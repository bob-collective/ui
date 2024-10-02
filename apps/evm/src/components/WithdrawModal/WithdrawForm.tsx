import { ChainId } from '@gobob/chains';
import { useMutation } from '@gobob/react-query';
import { USDT } from '@gobob/tokens';
import { toast } from '@gobob/ui';
import { AuthButton } from '@gobob/connect-ui';
import { useAccount, usePublicClient, useWriteContract } from '@gobob/wagmi';
import { P, Span } from '@gobob/ui';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { isAddressEqual } from 'viem';

import { ContractType, L1_CHAIN, contracts } from '../../constants';
import { useLockedTokens } from '../../hooks';

type WithdrawFormProps = {
  isSmartAccount?: boolean;
  onSuccess?: () => void;
};

const MIN_GAS_FEE = 200000;

const lockContract = contracts[L1_CHAIN as ChainId.ETHEREUM][ContractType.FUSION_LOCK];

const WithdrawForm = ({ isSmartAccount, onSuccess }: WithdrawFormProps) => {
  const { address } = useAccount();

  const { t } = useTranslation();

  const { writeContractAsync } = useWriteContract();

  const publicClient = usePublicClient();

  const { data: lockedTokens, refetch: refetchLockedTokens } = useLockedTokens();

  const otherTokens = useMemo(() => {
    if (!USDT?.[L1_CHAIN as ChainId.ETHEREUM]) return [];

    return lockedTokens?.filter(
      (token) => !isAddressEqual(token.raw.address, USDT![L1_CHAIN as ChainId.ETHEREUM]!.address)
    );
  }, [lockedTokens]);

  const isUSDTWithdrawNeeded = useMemo(() => {
    if (!USDT?.[L1_CHAIN as ChainId.ETHEREUM]) return false;

    return !!lockedTokens?.find((token) =>
      isAddressEqual(token.raw.address, USDT![L1_CHAIN as ChainId.ETHEREUM]!.address)
    );
  }, [lockedTokens]);

  const handleSuccess = () => {
    toast.success('Withdrawal successful');
    refetchLockedTokens();
    onSuccess?.();
  };

  const withdrawToL2Mutation = useMutation({
    mutationKey: ['withdrawToL2', address],
    mutationFn: async () => {
      if (!otherTokens || !lockedTokens || !address || !publicClient || !USDT?.[L1_CHAIN as ChainId.ETHEREUM]) return;

      if (isUSDTWithdrawNeeded) {
        const otherTokensAddress = otherTokens.map((token) => token.raw.address);

        const l2Tx = await writeContractAsync({
          abi: lockContract.abi,
          address: lockContract.address,
          functionName: 'withdrawDepositsToL2',
          args: [otherTokensAddress, MIN_GAS_FEE, address]
        });

        const l1Tx = await writeContractAsync({
          abi: lockContract.abi,
          address: lockContract.address,
          functionName: 'withdrawDepositsToL1',
          args: [[USDT[L1_CHAIN as ChainId.ETHEREUM]!.address]]
        });

        const [l2Receipt, l1Receipt] = await Promise.all([
          publicClient.waitForTransactionReceipt({ hash: l2Tx }),
          publicClient.waitForTransactionReceipt({ hash: l1Tx })
        ]);

        if (l2Receipt.status === 'reverted') {
          toast.error('Failed to withdraw to L2. Please try again.');
        }

        if (l1Receipt.status === 'reverted') {
          toast.error('Failed to withdraw USDT to L1. Please try again.');
        }

        if (l2Receipt.status === 'reverted' || l1Receipt.status === 'reverted') {
          throw new Error('Withdraw failed');
        }

        return;
      }

      const tokensAddresses = lockedTokens.map((token) => token.raw.address);

      const tx = await writeContractAsync({
        abi: lockContract.abi,
        address: lockContract.address,
        functionName: 'withdrawDepositsToL2',
        args: [tokensAddresses, MIN_GAS_FEE, address]
      });

      const txReceipt = await publicClient.waitForTransactionReceipt({ hash: tx });

      if (txReceipt.status === 'reverted') {
        toast.error('Failed to withdraw to L2. Please try again.');
        throw new Error('Failed to withdraw to L2');
      }
    },
    onSuccess: handleSuccess,
    onError: () => refetchLockedTokens()
  });

  const withdrawToL1Mutation = useMutation({
    mutationKey: ['withdrawToL1', address],
    mutationFn: async () => {
      if (!address || !lockedTokens || !publicClient) return;

      const tokensAddresses = lockedTokens.map((token) => token.raw.address);

      const tx = await writeContractAsync({
        abi: lockContract.abi,
        address: lockContract.address,
        functionName: 'withdrawDepositsToL1',
        args: [tokensAddresses]
      });

      const txReceipt = await publicClient.waitForTransactionReceipt({ hash: tx });

      if (txReceipt.status === 'reverted') {
        toast.error('Withdraw to L1 failed. Please try again.');
        throw new Error('Withdraw to L1 failed');
      }
    },
    onSuccess: handleSuccess,
    onError: () => refetchLockedTokens()
  });

  if (isSmartAccount) {
    return (
      <>
        <P size='s'>{t('fusion.withdrawModal.smartAccountsWarning')}</P>
        <AuthButton
          color='primary'
          loading={withdrawToL1Mutation.isPending}
          size='lg'
          onPress={() => withdrawToL1Mutation.mutate()}
        >
          {t('fusion.withdrawModal.withdrawLabel')}
        </AuthButton>
      </>
    );
  }

  const isOthersWithdrawNeeded = !!otherTokens?.length;

  return (
    <>
      {isOthersWithdrawNeeded && isUSDTWithdrawNeeded && (
        <P color='grey-50' size='s' weight='semibold'>
          USDT can only be withdrawn to Ethereum. When bridging to BOB, you will be prompted to sign twice: Once to
          bridge your assets (without USDT) to BOB and once to withdraw USDT to Ethereum
        </P>
      )}
      {!isOthersWithdrawNeeded && isUSDTWithdrawNeeded && (
        <P color='grey-50' size='s' weight='semibold'>
          USDT can only be withdrawn to Ethereum.
        </P>
      )}
      {isOthersWithdrawNeeded && (
        <AuthButton
          chain={L1_CHAIN}
          color='primary'
          loading={withdrawToL2Mutation.isPending}
          size='lg'
          onPress={() => withdrawToL2Mutation.mutate()}
        >
          {t('fusion.withdrawModal.bridgeLabel')}
        </AuthButton>
      )}
      <P color='grey-50' size='s'>
        <Trans
          components={{ strong: <Span color='grey-50' size='s' weight='semibold' /> }}
          i18nKey='fusion.withdrawModal.withdrawDescription'
        />
      </P>
      <AuthButton
        chain={L1_CHAIN}
        loading={withdrawToL1Mutation.isPending}
        size='lg'
        variant='outline'
        onPress={() => withdrawToL1Mutation.mutate()}
      >
        {t('fusion.withdrawModal.withdrawLabel')}
      </AuthButton>
    </>
  );
};

export { WithdrawForm };
