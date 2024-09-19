import { GatewayQuote } from '@gobob/bob-sdk';
import { AuthButton } from '@gobob/connect-ui';
import { CurrencyAmount } from '@gobob/currency';
import { FuelStation } from '@gobob/icons';
import { INTERVAL, Optional, useMutation, usePrices, useQuery, useQueryClient } from '@gobob/react-query';
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
import { useDebounce } from '@uidotdev/usehooks';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Address } from 'viem';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';

import { isProd } from '../../../../constants';
import { useGetTransactions } from '../../../../hooks';
import { gatewaySDK } from '../../../../lib/bob-sdk';
import {
  STAKE_AMOUNT,
  STAKE_BTC_WALLET,
  STAKE_RECIPIENT,
  STAKE_STRATEGY,
  StakeFormValidationParams,
  StakeFormValues,
  stakeSchema
} from '../../../../lib/form/stake';
import { isFormDisabled } from '../../../../lib/form/utils';
import { bridgeKeys } from '../../../../lib/react-query';
import { GatewayData } from '../../../../types';
import { Type } from '../../Stake';

import { StrategyData } from './StakeForm';

type BtcBridgeFormProps = {
  type: Type;
  strategy: StrategyData;
  strategies: StrategyData[];
  onStrategyChange: (strategy: string) => void;
  onStartGateway: (data: Optional<GatewayData, 'amount'>) => void;
  onGatewaySuccess: (data: Optional<GatewayData, 'amount'>) => void;
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

const BtcStakeForm = ({
  type = Type.Stake,
  strategy,
  onStrategyChange,
  strategies,
  onGatewaySuccess,
  onStartGateway,
  onFailGateway
}: BtcBridgeFormProps): JSX.Element => {
  const queryClient = useQueryClient();

  const [_, setSearchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, connector, addressType: btcAddressType } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();
  const { data: satsFeeEstimate, isError: isSatsFeeEstimateError } = useSatsFeeEstimate();

  const showToast = useRef(true);

  if (isSatsFeeEstimateError && showToast.current) {
    showToast.current = false;
    toast.error('Failed to get estimated fee');
  }

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });

  const { refetchGatewayTxs } = useGetTransactions();

  const [amount, setAmount] = useState('');
  const debouncedAmount = useDebounce(amount, 300);

  const [isGasNeeded, setGasNeeded] = useState(true);

  const currencyAmount = useMemo(
    () => (!isNaN(amount as any) ? CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0) : undefined),
    [amount]
  );

  const handleError = useCallback((e: any) => {
    toast.error(e.message);
  }, []);

  const { data: availableLiquidity, isLoading: isLoadingMaxQuote } = useQuery({
    enabled: Boolean(strategy),
    queryKey: bridgeKeys.btcQuote(evmAddress, btcAddress, isGasNeeded, strategy?.raw.integration.slug, 'max'),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      // TODO: error from this isn't propagated
      const maxQuoteData = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        toChain: strategy.raw.chain.chainId,
        toToken: strategy.raw.inputToken.address,
        strategyAddress: strategy.raw.address
      });

      return CurrencyAmount.fromRawAmount(BITCOIN, maxQuoteData.satoshis);
    }
  });

  const hasLiquidity = useMemo(
    () => availableLiquidity?.greaterThan(MIN_DEPOSIT_AMOUNT(isGasNeeded)),
    [availableLiquidity, isGasNeeded]
  );

  const quoteDataEnabled = useMemo(() => {
    return Boolean(
      currencyAmount &&
        strategy &&
        evmAddress &&
        btcAddress &&
        CurrencyAmount.fromBaseAmount(BITCOIN, debouncedAmount || 0).greaterThan(MIN_DEPOSIT_AMOUNT(isGasNeeded)) &&
        hasLiquidity
    );
  }, [currencyAmount, strategy, evmAddress, btcAddress, debouncedAmount, hasLiquidity, isGasNeeded]);

  const quoteQueryKey = bridgeKeys.btcQuote(
    evmAddress,
    btcAddress,
    isGasNeeded,
    strategy?.raw.inputToken.symbol,
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
      if (!currencyAmount) return;

      const atomicAmount = currencyAmount.numerator.toString();
      const gatewayQuote = await gatewaySDK.getQuote({
        ...DEFAULT_GATEWAY_QUOTE_PARAMS,
        amount: atomicAmount,
        gasRefill: isGasNeeded ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0,
        toChain: strategy.raw.chain.chainId,
        toToken: strategy.raw.inputToken.address,
        strategyAddress: strategy.raw.address
      });

      const feeAmount = CurrencyAmount.fromRawAmount(BITCOIN, gatewayQuote.fee);

      return {
        fee: feeAmount,
        gatewayQuote
      };
    }
  });

  const stakeMutation = useMutation({
    mutationKey: bridgeKeys.btcDeposit(evmAddress, btcAddress),
    mutationFn: async ({ evmAddress, gatewayQuote }: { evmAddress: Address; gatewayQuote: GatewayQuote }) => {
      if (!connector) {
        throw new Error('Connector missing');
      }

      if (!quoteData) {
        throw new Error('Quote Data missing');
      }

      const data = {
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
      form.resetForm();
      onGatewaySuccess?.(data);
      refetchGatewayTxs();
      queryClient.removeQueries({ queryKey: quoteQueryKey });
    },
    onError: (error) => {
      handleError(error);
      onFailGateway();
    }
  });

  useEffect(() => {
    form.resetForm();

    setAmount('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategies]);

  const handleSubmit = async (data: StakeFormValues) => {
    if (!quoteData || !evmAddress) return;

    if (type === Type.Stake) {
      return stakeMutation.mutate({
        evmAddress: (data[STAKE_RECIPIENT] as Address) || evmAddress,
        gatewayQuote: quoteData.gatewayQuote
      });
    }
  };

  const { balanceAmount, humanBalanceAmount } = useMemo(() => {
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
      humanBalanceAmount: balance,
      balanceAmount: availableBalance
    };
  }, [satsBalance, availableLiquidity, satsFeeEstimate]);

  const initialValues = useMemo(
    () => ({
      [STAKE_AMOUNT]: '',
      [STAKE_STRATEGY]: strategy?.raw.integration.slug,
      [STAKE_RECIPIENT]: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const params: StakeFormValidationParams = {
    [STAKE_AMOUNT]: {
      minAmount:
        currencyAmount && MIN_DEPOSIT_AMOUNT(isGasNeeded)
          ? new Big(MIN_DEPOSIT_AMOUNT(isGasNeeded) / 10 ** currencyAmount?.currency.decimals)
          : undefined,
      maxAmount: new Big(balanceAmount.toExact())
    },
    [STAKE_RECIPIENT]: !!isSmartAccount,
    [STAKE_BTC_WALLET]: btcAddress
  };

  const form = useForm<StakeFormValues>({
    initialValues,
    validationSchema: stakeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const btcPrice = useMemo(() => getPrice('BTC'), [getPrice]);

  const valueUSD = useMemo(() => new Big(amount || 0).mul(btcPrice || 0).toNumber(), [amount, btcPrice]);

  const isSubmitDisabled = isFormDisabled(form);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const isDisabled =
    isSubmitDisabled || !quoteData || isQuoteError || isTapRootAddress || isLoadingMaxQuote || !hasLiquidity;

  const isLoading = !isSubmitDisabled && (stakeMutation.isPending || isFetchingQuote);

  return (
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balanceAmount.toExact()}
        balanceHelper='Your available balance may differ from your wallet balance due to network fees and available liquidity'
        currency={BITCOIN}
        humanBalance={humanBalanceAmount?.toExact()}
        label='Amount'
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        valueUSD={valueUSD}
        {...mergeProps(form.getTokenFieldProps(STAKE_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <Select<StrategyData>
        items={strategies}
        label='Stake with'
        modalProps={{ title: 'Select Strategy', size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(form.getSelectFieldProps(STAKE_STRATEGY), {
          onSelectionChange: (value: string) => {
            onStrategyChange(value);
            setSearchParams(
              (prev) => {
                const urlSearchParams = new URLSearchParams(prev);

                urlSearchParams.set('stakeWith', value);

                return urlSearchParams;
              },
              { replace: true }
            );
          }
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
      <Card background='grey-600' direction='row' gap='lg' justifyContent='space-between' rounded='md'>
        <Flex alignItems='center' gap='md'>
          <FuelStation color='primary-500' />
          <Flex direction='column'>
            <Flex alignItems='center' gap='s'>
              <P>Top-up Gas</P>
              <Tooltip
                color='primary'
                label={<P size='xs'>BOB Gateway allows you to swap BTC on Bitcoin to ETH on BOB.</P>}
              >
                <InformationCircle color='grey-50' size='xs' />
              </Tooltip>
            </Flex>
            <P color='grey-50' size='xs'>
              Get ETH for transaction fees on BOB
            </P>
          </Flex>
        </Flex>
        <Switch isSelected={isGasNeeded} size='lg' onChange={(e) => setGasNeeded(e.target.checked)} />
      </Card>
      {isSmartAccount && (
        <Input label='Recipient' placeholder='Enter destination address' {...form.getFieldProps(STAKE_RECIPIENT)} />
      )}
      {isTapRootAddress && (
        <Alert status='warning'>
          <P size='s'>
            Unfortunately, Taproot (P2TR) addresses are not supported at this time. Please use a different address type.
          </P>
        </Alert>
      )}
      {!!quoteError && !quoteData && (
        <Alert status='warning'>
          <P size='s'>
            BTC bridge is currently unavailable. This may be due to: {quoteError.message}. Please try again later.
          </P>
        </Alert>
      )}
      {!hasLiquidity && !isLoadingMaxQuote && strategies.length > 0 && (
        <Alert status='warning'>
          <P size='s'>Cannot stake into {strategy?.raw.integration.name} due to insufficient liquidity.</P>
        </Alert>
      )}
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        Stake
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
