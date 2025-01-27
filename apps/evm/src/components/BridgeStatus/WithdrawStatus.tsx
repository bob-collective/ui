'use client';

import { Flex, FlexProps, toast } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import * as Sentry from '@sentry/nextjs';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getWithdrawals } from 'viem/op-stack';
import { useAccount } from 'wagmi';

import { BridgeStep, getOngoingBridgeStep } from './BridgeStep';
import { ProveStep } from './ProveStep';
import { RelayStep } from './RelayStep';
import { TimeStep } from './TimeStep';

import { usePublicClientL1, usePublicClientL2, useWalletClientL1, useWalletClientL2 } from '@/hooks';
import { bridgeKeys } from '@/lib/react-query';
import { BridgeTransaction } from '@/types';

type Props = { data: BridgeTransaction; isExpanded: boolean; onProveSuccess?: () => void; onRelaySuccess?: () => void };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type WithdrawStatusProps = Props & InheritAttrs;

const WithdrawStatus = ({ data, isExpanded, onProveSuccess, onRelaySuccess }: WithdrawStatusProps): JSX.Element => {
  const publicClientL1 = usePublicClientL1();
  const publicClientL2 = usePublicClientL2();

  const walletClientL1 = useWalletClientL1();
  const walletClientL2 = useWalletClientL2();

  const { address } = useAccount();

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
    mutationKey: bridgeKeys.proveTransaction(address, data.transactionHash),
    mutationFn: async () => {
      const receipt =
        data.l2Receipt ||
        (await publicClientL2.getTransactionReceipt({
          hash: data.transactionHash
        }));

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
      onProveSuccess?.();
    },
    onError: handleError
  });

  const relayMutation = useMutation({
    mutationKey: bridgeKeys.relayTransaction(address, data.transactionHash),
    mutationFn: async () => {
      if (!address) return;

      const receiptL2 =
        data.l2Receipt ||
        (await publicClientL2.getTransactionReceipt({
          hash: data.transactionHash
        }));

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
      onRelaySuccess?.();
    },
    onError: handleError
  });

  const currentStep = useMemo(
    () => (data.status ? getOngoingBridgeStep(data.status, data.direction) : undefined),
    [data]
  );

  if (!isExpanded) {
    switch (currentStep) {
      case 'state-root-published':
        return <TimeStep currentStep={currentStep} data={data} step='state-root-published' />;
      case 'prove':
        return (
          <ProveStep
            currentStep={currentStep}
            data={data}
            isProveSuccessful={proveMutation.isSuccess}
            isProving={proveMutation.isPending}
            onPressProve={proveMutation.mutate}
          />
        );
      case 'relay':
        return (
          <RelayStep
            currentStep={currentStep}
            data={data}
            isRelaySuccessful={relayMutation.isSuccess}
            isRelaying={relayMutation.isPending}
            onPressFinalize={relayMutation.mutate}
          />
        );
      case 'challenge-period':
        return <TimeStep currentStep={currentStep} data={data} step='challenge-period' />;
      default:
        return <BridgeStep data={data} step={currentStep} />;
    }
  }

  return (
    <Flex direction='column' flex={1} gap='xs'>
      <BridgeStep data={data} step='withdraw' />
      <TimeStep currentStep={currentStep} data={data} step='state-root-published' />
      <ProveStep
        currentStep={currentStep}
        data={data}
        isProveSuccessful={proveMutation.isSuccess}
        isProving={proveMutation.isPending}
        onPressProve={proveMutation.mutate}
      />
      <TimeStep currentStep={currentStep} data={data} step='challenge-period' />
      <RelayStep
        currentStep={currentStep}
        data={data}
        isRelaySuccessful={relayMutation.isSuccess}
        isRelaying={relayMutation.isPending}
        onPressFinalize={relayMutation.mutate}
      />
    </Flex>
  );
};

export { WithdrawStatus };
