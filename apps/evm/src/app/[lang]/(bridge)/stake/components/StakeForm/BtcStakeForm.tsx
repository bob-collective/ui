'use client';

import { Alert, Flex, Input, P } from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { chain, mergeProps } from '@react-aria/utils';
import { Optional } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { BtcTokenInput, GatewayGasSwitch, GatewayTransactionDetails } from '../../../components';
import { useGateway, useGatewayForm } from '../../../hooks';
import { StakingInfo } from '../../../utils/stakeData';

import { StrategyData } from './StakeForm';

import { AuthButton } from '@/connect-ui';
import { BRIDGE_RECIPIENT, BridgeFormValues } from '@/lib/form/bridge';
import { GatewayTransactionType, InitGatewayTransaction } from '@/types';

type BtcBridgeFormProps = {
  strategy: StrategyData;
  stakingInfo: StakingInfo;
  onStart: (data: Optional<InitGatewayTransaction, 'amount'>) => void;
  onSuccess: (data: InitGatewayTransaction) => void;
  onError: () => void;
};

const BtcStakeForm = ({ strategy, stakingInfo, onStart, onSuccess, onError }: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();

  const handleSuccess = () => {
    form.resetForm();
  };

  const gateway = useGateway({
    isDisabled: !!stakingInfo.isDisabled,
    params: {
      type: GatewayTransactionType.STAKE,
      toChain: strategy?.raw.chain.chainId,
      toToken: strategy?.raw.inputToken.address,
      strategyAddress: strategy?.raw.address,
      assetName: strategy?.raw.integration.name
    },
    onError,
    onMutate: onStart,
    onSuccess: chain(onSuccess, handleSuccess)
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
    query: gateway.query,
    defaultAsset: strategy?.raw.integration.slug,
    onSubmit: handleSubmit
  });

  const isDisabled =
    isSubmitDisabled ||
    gateway.isDisabled ||
    !gateway.isReady ||
    gateway.query.quote.isPending ||
    stakingInfo.isDisabled;

  const isLoading = gateway.mutation.isPending || gateway.query.quote.isLoading;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <BtcTokenInput
        amount={gateway.amount}
        balance={gateway.query.balance}
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
        amountLabel={<Trans>You will stake</Trans>}
        assetName={strategy?.raw.integration.name}
        gateway={gateway}
      />
      {stakingInfo.isDisabled && (
        <Alert status='warning' variant='outlined'>
          <P size='s'>
            <Trans>Staking to {stakingInfo.strategy} is temporarily unavailable.</Trans>
          </P>
        </Alert>
      )}
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        {gateway.isReady ? <Trans>Stake</Trans> : <Trans>Preparing...</Trans>}
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
