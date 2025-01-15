'use client';

import { useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { Alert, Flex, Input, P } from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sendGAEvent } from '@next/third-parties/google';
import { chain, mergeProps } from '@react-aria/utils';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import {
  BtcTokenInput,
  GatewayGasSwitch,
  GatewayTransactionDetails,
  GatewayTransactionModal
} from '../../../components';
import { useGateway, useGatewayForm } from '../../../hooks';
import { StrategyData } from '../../hooks';

import { AuthButton } from '@/connect-ui';
import { BRIDGE_RECIPIENT, BridgeFormValues } from '@/lib/form/bridge';
import { GatewayTransactionType, InitGatewayTransaction } from '@/types';

type GatewayTransactionModalState = {
  isOpen: boolean;
  data?: InitGatewayTransaction;
};

type BtcBridgeFormProps = {
  isLending: boolean;
  strategy?: StrategyData;
  onSuccess: () => void;
};

const StrategyForm = ({ strategy, isLending, onSuccess }: BtcBridgeFormProps): JSX.Element => {
  const { connector } = useSatsAccount();
  const [gatewayModalState, setGatewayModalState] = useState<GatewayTransactionModalState>({
    isOpen: false
  });

  const handleStartGateway = (data: InitGatewayTransaction) => {
    setGatewayModalState({ isOpen: true, data });
  };

  const handleGatewaySuccess = (data: InitGatewayTransaction) => {
    onSuccess?.();
    setGatewayModalState({ isOpen: true, data });
    sendGAEvent('event', 'btc_stake', {
      asset: data.assetName,
      amount: data.amount?.toExact(),
      tx_id: data.txId,
      wallet: connector?.name
    });
  };

  const handleCloseGatewayModal = () => {
    setGatewayModalState((s) => ({ ...s, isOpen: false }));
  };

  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();

  const handleSuccess = () => {
    form.resetForm();
  };

  const gateway = useGateway({
    isDisabled: !strategy || strategy.info.isDisabled,
    params: {
      type: GatewayTransactionType.STRATEGY,
      toChain: strategy?.contract.chain.chainId,
      toToken: strategy?.contract.inputToken.address,
      strategyAddress: strategy?.contract.address,
      assetName: strategy?.contract.integration.name
    },
    onError: handleCloseGatewayModal,
    onMutate: handleStartGateway,
    onSuccess: chain(handleGatewaySuccess, handleSuccess)
  });

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!evmAddress) return;

    gateway.mutation.mutate({
      evmAddress: data[BRIDGE_RECIPIENT] || evmAddress
    });
  };

  const {
    isDisabled: isSubmitDisabled,
    fields,
    form
  } = useGatewayForm({
    type: GatewayTransactionType.STRATEGY,
    query: gateway.query,
    defaultAsset: strategy?.contract.integration.slug,
    onSubmit: handleSubmit
  });

  const isDisabled =
    isSubmitDisabled ||
    gateway.isDisabled ||
    !gateway.isReady ||
    gateway.query.quote.isPending ||
    !strategy ||
    strategy.info.isDisabled;

  const isLoading = gateway.mutation.isPending || gateway.query.quote.isLoading;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' flex={1} gap='xl' marginTop='xl' onSubmit={form.handleSubmit as any}>
      <BtcTokenInput
        amount={gateway.amount}
        balance={gateway.query.balance.data}
        {...mergeProps(fields.amount, {
          onValueChange: gateway.setAmount
        })}
      />
      <GatewayGasSwitch
        isSelected={gateway.settings.topUp.isEnabled}
        onChange={(e) => gateway.settings.topUp.enable(e.target.checked)}
      />
      {fields.recipient && (
        <Input
          label={<Trans>Recipient</Trans>}
          placeholder={t(i18n)`Enter destination address`}
          {...fields.recipient}
        />
      )}
      <GatewayTransactionDetails
        amountLabel={isLending ? <Trans>You will supply</Trans> : <Trans>You will stake</Trans>}
        assetName={strategy?.contract.integration.name}
        gateway={gateway}
      />
      {strategy?.info.isDisabled && (
        <Alert status='warning' variant='outlined'>
          <P size='s'>
            <Trans>Staking to {strategy?.info.name} is temporarily unavailable.</Trans>
          </P>
        </Alert>
      )}
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        {gateway.isReady ? isLending ? <Trans>Lend</Trans> : <Trans>Stake</Trans> : <Trans>Preparing...</Trans>}
      </AuthButton>
      {gatewayModalState.data && (
        <GatewayTransactionModal
          data={gatewayModalState.data}
          isOpen={gatewayModalState.isOpen}
          onClose={handleCloseGatewayModal}
        />
      )}
    </Flex>
  );
};

export { StrategyForm };
