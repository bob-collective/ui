'use client';

import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { Optional } from '@gobob/react-query';
import { Avatar, Flex, Input, Item, P, Select } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { mergeProps } from '@react-aria/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';

import { BtcTokenInput, GatewayGasSwitch } from '../../../components';
import { useGateway, useGatewayForm } from '../../../hooks';

import { StrategyData } from './StakeForm';

import { GatewayTransactionDetails } from '@/components';
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

  const gateway = useGateway({
    params: {
      type: GatewayTransactionType.STAKE,
      toChain: strategy?.raw.chain.chainId,
      toToken: strategy?.raw.inputToken.address,
      strategyAddress: strategy?.raw.address
    },
    onError,
    onMutate: onStart,
    onSuccess
  });

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!evmAddress) return;

    gateway.mutation.mutate({
      evmAddress: (data[BRIDGE_RECIPIENT] as Address | '') || evmAddress
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

  const isDisabled = isSubmitDisabled || !gateway.isReady;

  const isLoading = !isSubmitDisabled && (gateway.mutation.isPending || gateway.query.quote.isPending);

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
      <GatewayTransactionDetails assetName={strategy?.raw.integration.name} gateway={gateway} />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        <Trans>Stake</Trans>
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
