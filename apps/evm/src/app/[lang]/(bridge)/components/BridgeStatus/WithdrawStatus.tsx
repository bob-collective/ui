'use client';

import { useMutation } from '@gobob/react-query';
import { Flex, FlexProps, toast } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Trans } from '@lingui/macro';
import * as Sentry from '@sentry/nextjs';
import { useMemo } from 'react';
import { getWithdrawals } from 'viem/op-stack';

import { BridgeTransaction } from '../../hooks';

import { BridgeStep, getOngoingBridgeStep } from './BridgeStep';
import { ProveStep } from './ProveStep';
import { RelayStep } from './RelayStep';
import { TimeStep } from './TimeStep';

import { usePublicClientL1, usePublicClientL2, useWalletClientL1, useWalletClientL2 } from '@/hooks';
import { bridgeKeys } from '@/lib/react-query';

type Props = { data: BridgeTransaction; isExpanded: boolean; onProveSuccess?: () => void; onRelaySuccess?: () => void };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type WithdrawStatusProps = Props & InheritAttrs;

const WithdrawStatus = ({ data, isExpanded, onProveSuccess, onRelaySuccess }: WithdrawStatusProps): JSX.Element => {
  const publicClientL1 = usePublicClientL1();
  const publicClientL2 = usePublicClientL2();

  const walletClientL1 = useWalletClientL1();
  const walletClientL2 = useWalletClientL2();

  const { address } = useAccount();

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
    onError: (e) => {
      Sentry.captureException(e);
      // eslint-disable-next-line no-console
      console.log('Prove: ', e);
      toast.error(<Trans>Failed to submit proof.</Trans>);
    }
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
    onError: (e) => {
      Sentry.captureException(e);
      // eslint-disable-next-line no-console
      console.log('Finalize: ', e);
      toast.error(<Trans>Failed to finalize.</Trans>);
    }
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
    <Flex direction='column' flex={1} gap='s'>
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
