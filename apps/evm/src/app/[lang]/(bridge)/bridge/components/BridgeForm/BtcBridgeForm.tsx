'use client';

import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { Alert, Avatar, Flex, Input, Item, P, Select, Skeleton, Link } from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { chain, mergeProps } from '@react-aria/utils';
import { Optional } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { BtcTokenInput, GatewayGasSwitch, GatewayTransactionDetails } from '../../../components';
import { useGateway, useGatewayForm, useGetGatewayTransactions } from '../../../hooks';

import { AuthButton } from '@/connect-ui';
import { isProd, mempoolUrl } from '@/constants';
import { TokenData } from '@/hooks';
import { BRIDGE_RECIPIENT, BridgeFormValues } from '@/lib/form/bridge';
import { GatewayTransactionType, InitGatewayTransaction } from '@/types';

type BtcBridgeFormProps = {
  availableTokens?: TokenData[];
  symbol?: string;
  onStart: (data: Optional<InitGatewayTransaction, 'amount'>) => void;
  onSuccess: (data: InitGatewayTransaction) => void;
  onError: () => void;
  onChangeSymbol: (symbol: string) => void;
};

const toChain = isProd ? 'bob' : 'bob-sepolia';

const BtcBridgeForm = ({
  availableTokens = [],
  symbol: symbolProp,
  onError,
  onStart,
  onSuccess,
  onChangeSymbol
}: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const { data: gatewayTransactions } = useGetGatewayTransactions();

  const latestPendingTransaction = gatewayTransactions
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ?.find((transaction) => transaction.status === 'btc-confirmation');

  const { address: evmAddress } = useAccount();

  const defaultToken = availableTokens[0];

  const symbol = symbolProp || defaultToken?.currency.symbol;

  const btcToken = useMemo(
    () => availableTokens.find((token) => token.currency.symbol === symbol),
    [availableTokens, symbol]
  );

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
    defaultAsset: symbol,
    onSubmit: handleSubmit,
    type: GatewayTransactionType.BRIDGE
  });

  const isDisabled = isSubmitDisabled || gateway.isDisabled || !gateway.isReady || gateway.query.quote.isPending;

  const isLoading = gateway.mutation.isPending || gateway.query.quote.isLoading;

  const placeholderAmount = useMemo(
    () => (btcToken ? CurrencyAmount.fromRawAmount(btcToken.currency, 0n) : undefined),
    [btcToken]
  );

  const showBalanceAlert = !!latestPendingTransaction && !gateway.query.balance.isPending;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      {showBalanceAlert && (
        <Alert status='info' title={<Trans>Heads up!</Trans>}>
          <P size='s'>
            <Trans>
              If your BTC balance shows smaller value or 0, it might be due to a transaction in progress, such as this
              one:{' '}
              <Link
                external
                href={`${mempoolUrl}/tx/${latestPendingTransaction.btcTxId}`}
                size='inherit'
                underlined='always'
              >
                View Transaction
              </Link>
              . Please wait for it to confirm before checking again.
            </Trans>
          </P>
        </Alert>
      )}
      <BtcTokenInput
        amount={gateway.amount}
        balance={gateway.query.balance.data}
        {...mergeProps(fields.amount, {
          onValueChange: gateway.setAmount
        })}
      />
      <Select<TokenData>
        items={availableTokens}
        label={t(i18n)`Receive`}
        modalProps={{ title: 'Select Token', size: 'xs' }}
        placeholder={<Skeleton height='3xl' width='8xl' />}
        size='lg'
        type='modal'
        {...mergeProps(fields.asset, {
          onSelectionChange: onChangeSymbol
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
