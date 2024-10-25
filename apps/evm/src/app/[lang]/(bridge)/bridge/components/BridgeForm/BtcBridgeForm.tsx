'use client';

import { CurrencyAmount } from '@gobob/currency';
import { Optional, usePrices } from '@gobob/react-query';
import { BtcAddressType, useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Alert, Avatar, Flex, Input, Item, P, Select, TokenInput, useForm } from '@gobob/ui';
import { useAccount, useIsContract } from '@gobob/wagmi';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { Address } from 'viem';

import { GatewayGasSwitch } from '../../../components/GatewayGasSwitch';
import { useGateway } from '../../../hooks';

import { GatewayTransactionDetails } from '@/components';
import { AuthButton } from '@/connect-ui';
import { TokenData } from '@/hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_BTC_WALLET,
  BRIDGE_RECIPIENT,
  BRIDGE_TICKER,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';
import { GatewayData } from '@/types';
import { isProd } from '@/constants';

type BtcBridgeFormProps = {
  availableTokens: TokenData[];
  onStart: (data: Optional<GatewayData, 'amount'>) => void;
  onSuccess: (data: GatewayData) => void;
  onError: () => void;
};

const gasEstimatePlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const toChain = isProd ? 'bob' : 'bob-sepolia';

const BtcBridgeForm = ({ availableTokens, onError, onStart, onSuccess }: BtcBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, addressType: btcAddressType } = useSatsAccount();

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });

  const [receiveTicker, setReceiveTicker] = useState(
    searchParams?.get('receive') ?? availableTokens[0]?.currency.symbol
  );

  const btcToken = useMemo(
    () => availableTokens.find((token) => token.currency.symbol === receiveTicker),
    [availableTokens, receiveTicker]
  );

  const [amount, setAmount] = useDebounceValue('', 300);

  const currencyAmount = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0) : undefined),
    [amount]
  );

  useEffect(() => {
    if (searchParams) {
      const urlSearchParams = new URLSearchParams(searchParams);

      if (receiveTicker) urlSearchParams.set('receive', receiveTicker);
      urlSearchParams.set('network', 'bitcoin');
      router.replace('?' + urlSearchParams);
    }
  }, [receiveTicker, router, searchParams]);

  const { balance, fee, isTopUpEnabled, liquidity, minAmount, mutation, quote, setTopUpEnabled } = useGateway({
    amount: currencyAmount,
    toChain,
    toToken: btcToken?.currency.symbol,
    onError,
    onMutate: onStart,
    onSuccess
  });

  useEffect(() => {
    if (!fee.amount || !form.values[BRIDGE_AMOUNT]) return;

    form.validateField(BRIDGE_AMOUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fee.amount]);

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount: new Big(minAmount.toExact()),

      maxAmount: new Big(balance.toExact())
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount,
    [BRIDGE_BTC_WALLET]: btcAddress
  };

  const initialValues = {
    [BRIDGE_AMOUNT]: '',
    [BRIDGE_TICKER]: receiveTicker,
    [BRIDGE_RECIPIENT]: ''
  };

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!quote || !evmAddress) return;

    mutation.mutate({
      evmAddress: (data[BRIDGE_RECIPIENT] as Address) || evmAddress
    });
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const btcPrice = getPrice('BTC');

  const valueUSD = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? new Big(amount || 0).mul(btcPrice || 0).toNumber() : 0),
    [amount, btcPrice]
  );

  const isSubmitDisabled = isFormDisabled(form);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const isDisabled =
    isSubmitDisabled ||
    !quote ||
    !!quote.error ||
    isTapRootAddress ||
    liquidity.isLoading ||
    !liquidity.data?.hasLiquidity ||
    fee.isLoading;

  const isLoading = !isSubmitDisabled && (mutation.isPending || quote.isPending);

  const placeholderAmount = useMemo(
    () => (btcToken ? CurrencyAmount.fromRawAmount(btcToken.currency, 0n) : undefined),
    [btcToken]
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balance.toExact()}
        balanceHelper={t(
          i18n
        )`Your available balance may differ from your wallet balance due to network fees and available liquidity`}
        currency={BITCOIN}
        label={t(i18n)`Amount`}
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        valueUSD={valueUSD}
        {...mergeProps(form.getTokenFieldProps(BRIDGE_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <Select<TokenData>
        items={availableTokens}
        label={t(i18n)`Receive`}
        modalProps={{ title: 'Select Token', size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(form.getSelectFieldProps(BRIDGE_TICKER), {
          onSelectionChange: (value: string) => {
            setReceiveTicker(value);
            if (searchParams) {
              const urlSearchParams = new URLSearchParams(searchParams);

              urlSearchParams.set('receive', value);
              router.replace('?' + urlSearchParams);
            }
          }
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
      <GatewayGasSwitch isSelected={isTopUpEnabled} onChange={(e) => setTopUpEnabled(e.target.checked)} />
      {isSmartAccount && (
        <Input
          label={t(i18n)`Recipient`}
          placeholder={t(i18n)`Enter destination address`}
          {...form.getFieldProps(BRIDGE_RECIPIENT)}
        />
      )}
      {isTapRootAddress && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              Unfortunately, Taproot (P2TR) addresses are not supported at this time. Please use a different address
              type.
            </Trans>
          </P>
        </Alert>
      )}
      {!!quote.error && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              BTC bridge is currently unavailable. This may be due to: {quote.error.message}. Please try again later.
            </Trans>
          </P>
        </Alert>
      )}
      {!liquidity.data?.hasLiquidity && !liquidity.isLoading && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>There is currently no available liquidity to onramp BTC into {btcToken?.currency.symbol}.</Trans>
          </P>
        </Alert>
      )}
      <GatewayTransactionDetails
        amount={quote?.data?.amount}
        amountLabel={<Trans>You will receive</Trans>}
        amountPlaceholder={placeholderAmount}
        amountTooltipLabel={t(
          i18n
        )`This is the final amount you will receive after deducting the Protocol fees from your input amount.`}
        feeRate={fee.rate}
        feeRateData={fee.rateData}
        gatewayFee={quote?.data?.protocolFee || gasEstimatePlaceholder}
        isLoadingFeeRate={fee.isLoading}
        networkFee={fee.amount || gasEstimatePlaceholder}
        selectedFee={fee.selectedFee}
        onChangeFee={fee.setSelectedFee}
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        <Trans>Bridge Asset</Trans>
      </AuthButton>
    </Flex>
  );
};

export { BtcBridgeForm };
