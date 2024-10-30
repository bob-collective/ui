'use client';

import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { Optional } from '@gobob/react-query';
import { Avatar, Flex, Input, Item, P, Select, Skeleton, Span, UnstyledButton } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { chain, mergeProps } from '@react-aria/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { BtcTokenInput, GatewayGasSwitch, GatewayTransactionDetails } from '../../../components';
import { useGateway, useGatewayForm } from '../../../hooks';
import { StrategyDetailsModal } from '../StrategyDetailsModal';

import { StrategyData } from './StakeForm';

import { AuthButton } from '@/connect-ui';
import { isProd } from '@/constants';
import { BRIDGE_RECIPIENT, BridgeFormValues } from '@/lib/form/bridge';
import { GatewayData, GatewayTransactionType } from '@/types';

const INITIAL_SELECTED_STRATEGY_SLUG = 'solv-solvbtcbbn';

type BtcBridgeFormProps = {
  strategies: StrategyData[];
  onStart: (data: Optional<GatewayData, 'amount'>) => void;
  onSuccess: (data: GatewayData) => void;
  onError: () => void;
};

const BtcStakeForm = ({ strategies, onStart, onSuccess, onError }: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { address: evmAddress } = useAccount();

  const [isStrategyModalOpen, setStrategyModalOpen] = useState(false);

  const [selectedStrategy, setSelectedStrategy] = useState(
    searchParams?.get('stake-with') ?? (isProd ? INITIAL_SELECTED_STRATEGY_SLUG : strategies[0]?.raw.integration.slug)
  );

  const strategy = useMemo(
    () => strategies.find((strategy) => strategy.raw.integration.slug === selectedStrategy),
    [selectedStrategy, strategies]
  );

  useEffect(() => {
    if (searchParams) {
      const urlSearchParams = new URLSearchParams(searchParams);

      if (selectedStrategy) urlSearchParams.set('receive', selectedStrategy);
      urlSearchParams.set('network', 'bitcoin');
      router.replace('?' + urlSearchParams);
    }
  }, [selectedStrategy, router, searchParams]);

  const handleSuccess = () => {
    form.resetForm();
  };

  const gateway = useGateway({
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

  const isDisabled = isSubmitDisabled || gateway.isDisabled || !gateway.isReady || gateway.query.quote.isPending;

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
      <Flex direction='column' gap='xs'>
        <Select<StrategyData>
          items={strategies}
          label={t(i18n)`Stake with`}
          modalProps={{ title: <Trans>Select Strategy</Trans>, size: 'xs' }}
          size='lg'
          type='modal'
          {...mergeProps(fields.asset, {
            onSelectionChange: setSelectedStrategy
          })}
        >
          {(data) => (
            <Item key={data.raw.integration.slug} textValue={data.raw.integration.name}>
              <Flex alignItems='center' gap='s'>
                {data.raw.integration.logo ? <Avatar size='2xl' src={data.raw.integration.logo} /> : <PellNetwork />}
                <P style={{ color: 'inherit' }}>{data.raw.integration.name}</P>
              </Flex>
            </Item>
          )}
        </Select>
        {strategy ? (
          <>
            <UnstyledButton
              color='primary-500'
              style={{ alignSelf: 'flex-start' }}
              onPress={() => setStrategyModalOpen(true)}
            >
              <Span color='grey-50' size='s' style={{ textDecoration: 'underline' }}>
                <Trans>Learn more about {strategy.raw.integration.name}</Trans>
              </Span>
            </UnstyledButton>
            <StrategyDetailsModal
              isOpen={isStrategyModalOpen}
              strategy={strategy}
              onClose={() => setStrategyModalOpen(false)}
            />
          </>
        ) : (
          <Span size='s'>
            <Skeleton width='60%' />
          </Span>
        )}
      </Flex>
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
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        {gateway.isReady ? <Trans>Stake</Trans> : <Trans>Preparing...</Trans>}
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
