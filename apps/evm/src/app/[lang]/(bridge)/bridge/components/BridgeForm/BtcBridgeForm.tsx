'use client';

import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { Optional } from '@gobob/react-query';
import { Avatar, Flex, Input, Item, P, Select } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { chain, mergeProps } from '@react-aria/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { BtcTokenInput, GatewayGasSwitch, GatewayTransactionDetails } from '../../../components';
import { useGateway, useGatewayForm } from '../../../hooks';

import { AuthButton } from '@/connect-ui';
import { isProd } from '@/constants';
import { TokenData } from '@/hooks';
import { BRIDGE_RECIPIENT, BridgeFormValues } from '@/lib/form/bridge';
import { InitGatewayTransaction, GatewayTransactionType } from '@/types';

type BtcBridgeFormProps = {
  availableTokens: TokenData[];
  onStart: (data: Optional<InitGatewayTransaction, 'amount'>) => void;
  onSuccess: (data: InitGatewayTransaction) => void;
  onError: () => void;
};

const toChain = isProd ? 'bob' : 'bob-sepolia';

const BtcBridgeForm = ({ availableTokens, onError, onStart, onSuccess }: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { address: evmAddress } = useAccount();

  const [receiveTicker, setReceiveTicker] = useState(
    searchParams?.get('receive') ?? availableTokens[0]?.currency.symbol
  );

  const btcToken = useMemo(
    () => availableTokens.find((token) => token.currency.symbol === receiveTicker),
    [availableTokens, receiveTicker]
  );

  useEffect(() => {
    if (searchParams) {
      const urlSearchParams = new URLSearchParams(searchParams);

      if (receiveTicker) urlSearchParams.set('receive', receiveTicker);
      urlSearchParams.set('network', 'bitcoin');
      router.replace('?' + urlSearchParams);
    }
  }, [receiveTicker, router, searchParams]);

  const handleSuccess = () => {
    form.resetForm();
  };

  const gateway = useGateway({
    params: {
      type: GatewayTransactionType.BRIDGE,
      toChain,
      toToken: btcToken?.currency.symbol,
      token: btcToken?.currency as ERC20Token | undefined
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
    defaultAsset: receiveTicker,
    onSubmit: handleSubmit
  });

  const isDisabled = isSubmitDisabled || gateway.isDisabled || !gateway.isReady || gateway.query.quote.isPending;

  const isLoading = gateway.mutation.isPending || gateway.query.quote.isLoading;

  const placeholderAmount = useMemo(
    () => (btcToken ? CurrencyAmount.fromRawAmount(btcToken.currency, 0n) : undefined),
    [btcToken]
  );

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
      <Select<TokenData>
        items={availableTokens}
        label={t(i18n)`Receive`}
        modalProps={{ title: 'Select Token', size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(fields.asset, {
          onSelectionChange: setReceiveTicker
        })}
      >
        {(data) => (
          <Item key={data.currency.symbol} textValue={data.currency.symbol}>
            <Flex alignItems='center' gap='s'>
              <Avatar size='2xl' src={data.raw.logoUrl} />
              <P style={{ color: 'inherit' }}>{data.currency.symbol}</P>
            </Flex>
          </Item>
        )}
      </Select>
      <GatewayGasSwitch
        isSelected={gateway.settings.topUp.isEnabled}
        onChange={(e) => gateway.settings.topUp.enable(e.target.checked)}
      />
      {fields.recipient && (
        <Input label={t(i18n)`Recipient`} placeholder={t(i18n)`Enter destination address`} {...fields.recipient} />
      )}
      <GatewayTransactionDetails
        amountLabel={<Trans>You will receive</Trans>}
        amountPlaceholder={placeholderAmount}
        amountTooltipLabel={t(
          i18n
        )`This is the final amount you will receive after deducting the Protocol fees from your input amount.`}
        assetName={btcToken?.currency.symbol}
        gateway={gateway}
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        {gateway.isReady ? <Trans>Bridge Asset</Trans> : <Trans>Preparing...</Trans>}
      </AuthButton>
    </Flex>
  );
};

export { BtcBridgeForm };
