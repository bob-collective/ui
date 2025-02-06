import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { List, ListItem, toast } from '@gobob/ui';
import * as Sentry from '@sentry/nextjs';
import { useMutation } from '@tanstack/react-query';
import { Chain } from 'viem';
import { useAccount } from 'wagmi';
import { Trans } from '@lingui/macro';
import { getWithdrawals } from 'viem/op-stack';

import { useBridge } from '../../hooks';

import { ApprovalStep } from './ApprovalStep';
import { StartStep } from './StartStep';
import { WaitStep } from './WaitStep';
import { WithdrawStep } from './WithdrawStep';

import { publicClientL1, publicClientL2 } from '@/constants';
import { BridgeToken, useWalletClientL1, useWalletClientL2 } from '@/hooks';
import { bridgeKeys } from '@/lib/react-query';
import { BridgeTransaction, BridgeTransactionStatus } from '@/types';

type WithdrawTransactionListProps = {
  toChain: Chain;
  fromChain: Chain;
  currencyAmount: CurrencyAmount<Ether | ERC20Token>;
  selectedToken: BridgeToken;
  transaction?: BridgeTransaction;
  recipient?: string;
  descriptionId: string;
  onProveSuccess: () => void;
  onRelaySuccess: () => void;
} & Omit<ReturnType<typeof useBridge>, 'deposit'>;

const WithdrawTransactionList = ({
  fromChain,
  toChain,
  currencyAmount,
  selectedToken,
  approval,
  approvalGasEstimate,
  withdraw,
  gasEstimate,
  transaction,
  recipient,
  descriptionId,
  onProveSuccess,
  onRelaySuccess
}: WithdrawTransactionListProps): JSX.Element => {
  const { address } = useAccount();

  const walletClientL1 = useWalletClientL1();
  const walletClientL2 = useWalletClientL2();

  const handlePressStart = () => {
    withdraw.mutate({
      currencyAmount,
      selectedToken,
      recipient
    });
  };

  const handleError = (e: Error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (((e as unknown as any).shortMessage as string).includes('User rejected the request')) {
      toast.error(<Trans>User rejected the request.</Trans>);
    } else {
      Sentry.captureException(e);

      toast.error(
        <Trans>
          Submission failed. Please disable any wallets other than the one connected to this dApp. If the issue
          persists, please contact us.
        </Trans>
      );
    }
  };

  const proveMutation = useMutation({
    mutationKey: bridgeKeys.proveTransaction(address, transaction?.transactionHash),
    mutationFn: async () => {
      if (!transaction) return;

      const receipt = await publicClientL2.getTransactionReceipt({
        hash: transaction.transactionHash
      });

      const { output, withdrawal } = await publicClientL1.waitToProve({
        receipt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        targetChain: walletClientL2.chain as any
      });

      const args = await publicClientL2.buildProveWithdrawal({
        output,
        withdrawal
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hash = await walletClientL1?.proveWithdrawal(args as any);

      return { hash };
    },
    onSuccess: (data) => {
      toast.success(<Trans>Successfully submitted ${data?.hash} proof</Trans>);
      onProveSuccess();
    },
    onError: handleError
  });

  const relayMutation = useMutation({
    mutationKey: bridgeKeys.relayTransaction(address, transaction?.transactionHash),
    mutationFn: async () => {
      if (!address || !transaction) return;

      const receiptL2 = await publicClientL2.getTransactionReceipt({
        hash: transaction.transactionHash
      });

      const [withdrawal] = getWithdrawals(receiptL2);

      const hash = await walletClientL1.finalizeWithdrawal({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        targetChain: walletClientL2.chain as any,
        withdrawal: withdrawal!,
        account: address
      });

      await publicClientL1.waitForTransactionReceipt({
        hash
      });

      return hash;
    },
    onSuccess: () => {
      toast.success(<Trans>Successfully finalized transaction</Trans>);
      onRelaySuccess();
    },
    onError: handleError
  });

  return (
    <List aria-labelledby={descriptionId} gap='xs' marginTop='xs'>
      {
        (approval.isApproveRequired && (
          <ListItem backgroundColor='grey-500'>
            <ApprovalStep
              approval={approval}
              approvalGasEstimate={approvalGasEstimate}
              chain={fromChain}
              selectedToken={selectedToken}
            />
          </ListItem>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any
      }
      <ListItem backgroundColor='grey-500'>
        <StartStep
          chain={fromChain}
          gasEstimate={gasEstimate}
          isStarted={withdraw.isPending}
          transactionHash={withdraw.data?.transactionHash}
          onPressStart={handlePressStart}
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <WaitStep
          isComplete={transaction?.status !== BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED}
          isLoading={transaction?.status === BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED}
          time='1 hour'
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <WithdrawStep
          isComplete={
            transaction?.status !== BridgeTransactionStatus.IN_CHALLENGE_PERIOD &&
            transaction?.status !== BridgeTransactionStatus.READY_FOR_RELAY &&
            transaction?.status !== BridgeTransactionStatus.RELAYED
          }
          isPending={proveMutation.isPending}
          toChain={toChain}
          type='prove'
          onPressStart={proveMutation.mutate}
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <WaitStep
          isComplete={
            transaction?.status === BridgeTransactionStatus.READY_FOR_RELAY ||
            transaction?.status === BridgeTransactionStatus.RELAYED
          }
          isLoading={transaction?.status === BridgeTransactionStatus.IN_CHALLENGE_PERIOD}
          time='7 days'
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <WithdrawStep
          isComplete={transaction?.status === BridgeTransactionStatus.RELAYED}
          isPending={relayMutation.isPending}
          toChain={toChain}
          type='finalize'
          onPressStart={relayMutation.mutate}
        />
      </ListItem>
    </List>
  );
};

export { WithdrawTransactionList };
