'use client';

import { CurrencyAmount } from '@gobob/currency';
import { INTERVAL, useMutation, usePrices, useQuery, useQueryClient } from '@gobob/react-query';
import {
  BtcAddressType,
  useAccount as useSatsAccount,
  useBalance as useSatsBalance,
  useFeeEstimate as useSatsFeeEstimate
} from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import {
  Alert,
  Avatar,
  Card,
  Flex,
  InformationCircle,
  Input,
  Item,
  P,
  Select,
  Switch,
  TokenInput,
  Tooltip,
  toast,
  useForm
} from '@gobob/ui';
import { useAccount, useIsContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounceValue } from 'usehooks-ts';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Address } from 'viem';
import { FuelStation } from '@gobob/icons';
import { GatewayQuote } from '@gobob/bob-sdk';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLingui } from '@lingui/react';
import { Trans, t } from '@lingui/macro';

import { Type } from '../../Bridge';

import { AuthButton } from '@/connect-ui';
import { TransactionDetails } from '@/components';
import { isProd, L2_CHAIN } from '@/constants';
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
import { useGetTransactions } from '@/hooks';
import { GatewayData } from '@/types';
import { bridgeKeys } from '@/lib/react-query';
import { gatewaySDK } from '@/lib/bob-sdk';

type BtcBridgeFormProps = {
  type: Type;
  availableTokens: TokenData[];
  onStartGateway: (data: GatewayData) => void;
  onGatewaySuccess: (data: GatewayData) => void;
  onFailGateway: () => void;
};

const DEFAULT_GATEWAY_QUOTE_PARAMS = {
  fromChain: 'bitcoin',
  toChain: isProd ? 'bob' : 'bob-sepolia',
  fromToken: 'BTC',
  // TODO: should be dynamic based on exchange rate
  gasRefill: 2000
};

// TODO: get this from the API
const DUST_THRESHOLD = 1000;

const MIN_DEPOSIT_AMOUNT = (gasRefill: boolean) =>
  gasRefill ? DUST_THRESHOLD + DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : DUST_THRESHOLD;

const gasEstimatePlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const BtcBridgeForm = ({
  type = Type.Deposit,
  availableTokens,
  onGatewaySuccess,
  onStartGateway,
  onFailGateway
}: BtcBridgeFormProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, connector, addressType: btcAddressType } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();
  const { data: satsFeeEstimate, isError: isSatsFeeEstimateError } = useSatsFeeEstimate();

  const showToast = useRef(true);

  if (isSatsFeeEstimateError && showToast.current) {
    showToast.current = false;
    toast.error(t(i18n)`Failed to get estimated fee`);
  }

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });

  const { refetchGatewayTxs } = useGetTransactions();

  const [amount, setAmount] = useDebounceValue('', 300);

  const [receiveTicker, setReceiveTicker] = useState(
    searchParams?.get('receive') ?? availableTokens[0]?.currency.symbol
  );

  useEffect(() => {
    if (searchParams) {
      const urlSearchParams = new URLSearchParams(searchParams);

      if (receiveTicker) urlSearchParams.set('receive', receiveTicker);
      urlSearchParams.set('network', 'bitcoin');
      router.replace('?' + urlSearchParams);
    }
  }, [receiveTicker, router, searchParams]);

  const [isGasNeeded, setGasNeeded] = useState(true);

  const currencyAmount = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0) : undefined),
    [amount]
  );

  const btcToken = useMemo(
    () => availableTokens.find((token) => token.currency.symbol === receiveTicker),
    [availableTokens, receiveTicker]
  );

  const handleError = useCallback((e: Error) => {
    toast.error(e.message);
  }, []);

  const { data: availableLiquidity, isLoading: isLoadingMaxQuote } = useQuery({
    enabled: Boolean(btcToken),
    queryKey: bridgeKeys.btcQuote(evmAddress, btcAddress, isGasNeeded, btcToken?.currency.symbol, 'max'),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!currencyAmount || !btcToken) return;

      // TODO: error from this isn't propagated
      const maxQuoteData = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toToken: btcToken.currency.symbol
      });

      return CurrencyAmount.fromRawAmount(BITCOIN, maxQuoteData.satoshis);
    }
  });

  const hasLiquidity = availableLiquidity?.greaterThan(MIN_DEPOSIT_AMOUNT(isGasNeeded));

  const quoteDataEnabled = Boolean(
    currencyAmount &&
      btcToken &&
      evmAddress &&
      btcAddress &&
      CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0).greaterThan(MIN_DEPOSIT_AMOUNT(isGasNeeded)) &&
      hasLiquidity
  );

  const quoteQueryKey = bridgeKeys.btcQuote(
    evmAddress,
    btcAddress,
    isGasNeeded,
    btcToken?.currency.symbol,
    Number(currencyAmount?.numerator)
  );

  const {
    data: quoteData,
    isLoading: isFetchingQuote,
    isError: isQuoteError,
    error: quoteError
  } = useQuery({
    enabled: quoteDataEnabled,
    queryKey: quoteQueryKey,
    refetchInterval: INTERVAL.SECONDS_30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!currencyAmount || !btcToken) return;

      const atomicAmount = currencyAmount.numerator.toString();
      const gatewayQuote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toToken: btcToken.currency.symbol,
        amount: atomicAmount,
        gasRefill: isGasNeeded ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0
      });

      const feeAmount = CurrencyAmount.fromRawAmount(BITCOIN, gatewayQuote.fee);

      const btcReceiveAmount = currencyAmount.subtract(feeAmount);

      return {
        receiveAmount: CurrencyAmount.fromBaseAmount(btcToken.currency, btcReceiveAmount.toExact()),
        fee: feeAmount,
        isStakingToken: !!gatewayQuote.strategyAddress,
        gatewayQuote
      };
    }
  });

  const initialValues = {
    [BRIDGE_AMOUNT]: '',
    [BRIDGE_TICKER]: receiveTicker,
    [BRIDGE_RECIPIENT]: ''
  };

  const depositMutation = useMutation({
    mutationKey: bridgeKeys.btcDeposit(evmAddress, btcAddress),
    mutationFn: async ({ evmAddress, gatewayQuote }: { evmAddress: Address; gatewayQuote: GatewayQuote }) => {
      if (!connector) {
        throw new Error('Connector missing');
      }

      if (!quoteData) {
        throw new Error('Quote Data missing');
      }

      const data = {
        amount: quoteData.receiveAmount,
        fee: quoteData.fee
      };

      onStartGateway(data);

      const { uuid, psbtBase64 } = await gatewaySDK.startOrder(gatewayQuote, {
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toUserAddress: evmAddress,
        fromUserAddress: connector.paymentAddress!,
        fromUserPublicKey: connector.publicKey,
        gasRefill: isGasNeeded ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0
      });

      const bitcoinTxHex = await connector.signAllInputs(psbtBase64!);

      // NOTE: user does not broadcast the tx, that is done by
      // the relayer after it is validated
      const txid = await gatewaySDK.finalizeOrder(uuid, bitcoinTxHex);

      return { ...data, txid };
    },
    onSuccess: (data) => {
      setAmount('');
      form.resetForm({ values: initialValues });
      onGatewaySuccess?.(data);
      refetchGatewayTxs();
      queryClient.removeQueries({ queryKey: quoteQueryKey });
    },
    onError: (error) => {
      handleError(error);
      onFailGateway();
    }
  });

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!quoteData || !evmAddress) return;

    if (type === Type.Deposit) {
      return depositMutation.mutate({
        evmAddress: (data[BRIDGE_RECIPIENT] as Address) || evmAddress,
        gatewayQuote: quoteData.gatewayQuote
      });
    }
  };

  const { balanceAmount } = useMemo(() => {
    if (!satsFeeEstimate || !availableLiquidity) {
      return { balanceAmount: CurrencyAmount.fromRawAmount(BITCOIN, 0n) };
    }

    const balance = CurrencyAmount.fromRawAmount(BITCOIN, satsBalance?.value || 0);

    const feeAmount = CurrencyAmount.fromRawAmount(BITCOIN, satsFeeEstimate);

    if (balance.lessThan(feeAmount)) {
      return { balanceAmount: CurrencyAmount.fromRawAmount(BITCOIN, 0n) };
    }

    const availableBalance = balance.subtract(feeAmount);

    if (availableBalance.greaterThan(availableLiquidity)) {
      return {
        balanceAmount: availableLiquidity
      };
    }

    return {
      balanceAmount: availableBalance
    };
  }, [satsBalance, availableLiquidity, satsFeeEstimate]);

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount:
        currencyAmount && MIN_DEPOSIT_AMOUNT(isGasNeeded)
          ? new Big(MIN_DEPOSIT_AMOUNT(isGasNeeded) / 10 ** currencyAmount?.currency.decimals)
          : undefined,
      maxAmount: new Big(balanceAmount.toExact())
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount,
    [BRIDGE_BTC_WALLET]: btcAddress
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const btcPrice = getPrice('BTC');

  const valueUSD = useMemo(() => new Big(amount || 0).mul(btcPrice || 0).toNumber(), [amount, btcPrice]);

  const isSubmitDisabled = isFormDisabled(form);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const isDisabled =
    isSubmitDisabled || !quoteData || isQuoteError || isTapRootAddress || isLoadingMaxQuote || !hasLiquidity;

  const isLoading = !isSubmitDisabled && (depositMutation.isPending || isFetchingQuote);

  const receiveAmount = quoteData ? quoteData.receiveAmount : undefined;

  const placeholderAmount = useMemo(
    () => (btcToken ? CurrencyAmount.fromRawAmount(btcToken.currency, 0n) : undefined),
    [btcToken]
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balanceAmount.toExact()}
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
      <Card background='grey-600' direction='row' gap='lg' justifyContent='space-between' rounded='md'>
        <Flex alignItems='center' gap='md'>
          <FuelStation color='primary-500' />
          <Flex direction='column'>
            <Flex alignItems='center' gap='s'>
              <P>
                <Trans>Top up Gas</Trans>
              </P>
              <Tooltip color='primary' label={t(i18n)`BOB Gateway allows you to swap BTC on Bitcoin to ETH on BOB`}>
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
            <P color='grey-50' size='xs'>
              <Trans>Get ETH for transaction fees on BOB</Trans>
            </P>
          </Flex>
        </Flex>
        <Switch isSelected={isGasNeeded} size='lg' onChange={(e) => setGasNeeded(e.target.checked)} />
      </Card>
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
      {!!quoteError && !quoteData && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>
              BTC bridge is currently unavailable. This may be due to: {quoteError.message}. Please try again later.
            </Trans>
          </P>
        </Alert>
      )}
      {!hasLiquidity && !isLoadingMaxQuote && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>There is currently no available liquidity to onramp BTC into {btcToken?.currency.symbol}.</Trans>
          </P>
        </Alert>
      )}
      <TransactionDetails
        amount={receiveAmount}
        amountPlaceholder={placeholderAmount}
        chainId={L2_CHAIN}
        currencyOnly={quoteData?.isStakingToken}
        gasEstimate={quoteData?.fee || gasEstimatePlaceholder}
        gasEstimatePlaceholder={gasEstimatePlaceholder}
        gasLabel={t(i18n)`Estimated Fee`}
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        Bridge Asset
      </AuthButton>
    </Flex>
  );
};

export { BtcBridgeForm };