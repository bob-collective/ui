'use client';

import { GatewayQuote } from '@gobob/bob-sdk';
import { CurrencyAmount } from '@gobob/currency';
import { INTERVAL, Optional, useMutation, usePrices, useQuery, useQueryClient } from '@gobob/react-query';
import { BtcAddressType, useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Alert, Avatar, Flex, Input, Item, P, Select, TokenInput, toast, useForm } from '@gobob/ui';
import { useAccount, useIsContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounceValue } from 'usehooks-ts';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { PellNetwork } from '@gobob/icons/src/PellNetwork';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Type } from '../../Stake';
import { GatewayGasSwitch } from '../../../components/GatewayGasSwitch';
import { useGatewayFeeData } from '../../../hooks';

import { StrategyData } from './StakeForm';

import { AuthButton } from '@/connect-ui';
import { isProd } from '@/constants';
import { useGetTransactions } from '@/hooks';
import { gatewaySDK } from '@/lib/bob-sdk';
import {
  STAKE_AMOUNT,
  STAKE_BTC_WALLET,
  STAKE_RECIPIENT,
  STAKE_STRATEGY,
  StakeFormValidationParams,
  StakeFormValues,
  stakeSchema
} from '@/lib/form/stake';
import { isFormDisabled } from '@/lib/form/utils';
import { bridgeKeys } from '@/lib/react-query';
import { GatewayData, GatewayTransactionFee } from '@/types';
import { GatewayTransactionDetails } from '@/components';

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

const gasEstimatePlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const MIN_DEPOSIT_AMOUNT = (gasRefill: boolean) =>
  gasRefill ? DUST_THRESHOLD + DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : DUST_THRESHOLD;

const BtcStakeForm = ({
  type = Type.Stake,
  strategy,
  strategies,
  onStrategyChange,
  onGatewaySuccess,
  onStartGateway,
  onFailGateway
}: BtcBridgeFormProps): JSX.Element => {
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, connector, addressType: btcAddressType } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();

  const { getPrice } = usePrices({ baseUrl: process.env.NEXT_PUBLIC_MARKET_DATA_API });

  const { refetchGatewayTxs } = useGetTransactions();

  const {
    feeAmount,
    error: feeDataError,
    feeRate,
    feeRateData,
    isLoading: isLoadingFeeData,
    selectedFee,
    setSelectedFee
  } = useGatewayFeeData();

  const [isGasNeeded, setGasNeeded] = useState(true);

  const [amount, setAmount] = useDebounceValue('', 300);

  useEffect(() => {
    if (!feeAmount || !form.values[STAKE_AMOUNT]) return;

    form.validateField(STAKE_AMOUNT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeAmount]);

  const currencyAmount = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (!isNaN(amount as any) ? CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0) : undefined),
    [amount]
  );

  const handleError = useCallback((e: Error) => {
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
        CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0).greaterThan(MIN_DEPOSIT_AMOUNT(isGasNeeded)) &&
        hasLiquidity
    );
  }, [currencyAmount, strategy, evmAddress, btcAddress, amount, hasLiquidity, isGasNeeded]);

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

  const initialValues = {
    [STAKE_AMOUNT]: '',
    [STAKE_STRATEGY]: strategy?.raw.integration.slug,
    [STAKE_RECIPIENT]: ''
  };

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
        gasRefill: isGasNeeded ? DEFAULT_GATEWAY_QUOTE_PARAMS.gasRefill : 0,
        feeRate
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

  const handleChangeFee = (fee: GatewayTransactionFee) => {
    setSelectedFee(fee);
  };

  const handleSubmit = async (data: StakeFormValues) => {
    if (!quoteData || !evmAddress) return;

    if (type === Type.Stake) {
      return stakeMutation.mutate({
        evmAddress: (data[STAKE_RECIPIENT] as Address) || evmAddress,
        gatewayQuote: quoteData.gatewayQuote
      });
    }
  };

  const { balanceAmount } = useMemo(() => {
    if (!feeAmount || !availableLiquidity || !!feeDataError) {
      return { balanceAmount: CurrencyAmount.fromRawAmount(BITCOIN, 0n) };
    }

    const balance = CurrencyAmount.fromRawAmount(BITCOIN, satsBalance?.confirmed || 0);

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
  }, [feeAmount, availableLiquidity, feeDataError, satsBalance?.confirmed]);

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
    !quoteData ||
    isQuoteError ||
    isTapRootAddress ||
    isLoadingMaxQuote ||
    !hasLiquidity ||
    isLoadingFeeData;

  const isLoading = !isSubmitDisabled && (stakeMutation.isPending || isFetchingQuote);

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
        {...mergeProps(form.getTokenFieldProps(STAKE_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <Select<StrategyData>
        items={strategies}
        label={t(i18n)`Stake with`}
        modalProps={{ title: <Trans>Select Strategy</Trans>, size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(form.getSelectFieldProps(STAKE_STRATEGY), {
          onSelectionChange: (value: string) => onStrategyChange(value)
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
      <GatewayGasSwitch isSelected={isGasNeeded} onChange={(e) => setGasNeeded(e.target.checked)} />
      {isSmartAccount && (
        <Input
          label={<Trans>Recipient</Trans>}
          placeholder={t(i18n)`Enter destination address`}
          {...form.getFieldProps(STAKE_RECIPIENT)}
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
      {!hasLiquidity && !isLoadingMaxQuote && strategies.length > 0 && (
        <Alert status='warning'>
          <P size='s'>
            <Trans>Cannot stake into {strategy?.raw.integration.name} due to insufficient liquidity.</Trans>
          </P>
        </Alert>
      )}
      <GatewayTransactionDetails
        feeRate={feeRate}
        feeRateData={feeRateData}
        gatewayFee={quoteData?.fee || gasEstimatePlaceholder}
        isLoadingFeeRate={isLoadingFeeData}
        networkFee={feeAmount || gasEstimatePlaceholder}
        selectedFee={selectedFee}
        onChangeFee={handleChangeFee}
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        <Trans>Stake</Trans>
      </AuthButton>
    </Flex>
  );
};

export { BtcStakeForm };
