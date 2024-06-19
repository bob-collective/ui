import { AuthButton } from '@gobob/connect-ui';
import { Bitcoin, CurrencyAmount, Ether } from '@gobob/currency';
import { INTERVAL, useMutation, usePrices, useQuery, useQueryClient } from '@gobob/react-query';
import {
  BtcAddressType,
  useAccount as useSatsAccount,
  useBalance as useSatsBalance,
  useFeeEstimate as useSatsFeeEstimate
} from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { Alert, Avatar, Flex, Input, Item, P, Select, TokenInput, Tooltip, toast, useForm } from '@gobob/ui';
import { useAccount, useIsContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounce } from '@uidotdev/usehooks';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';

import { TransactionDetails } from '../../../../components';
import { L2_CHAIN } from '../../../../constants';
import { TokenData } from '../../../../hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_RECIPIENT,
  BRIDGE_TICKER,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '../../../../lib/form/bridge';
import { isFormDisabled } from '../../../../lib/form/utils';
import { onRampApiClient } from '../../../../utils';
import { useGetTransactions } from '../../hooks';
import { OnRampData } from '../../types';
import { bridgeKeys } from '../../../../lib/react-query';

type BtcBridgeFormProps = {
  type: 'deposit' | 'withdraw';
  availableTokens: TokenData[];
  onStartOnRamp: (data: OnRampData) => void;
  onOnRampSuccess: (data: OnRampData) => void;
  onFailOnRamp: () => void;
};

const MIN_DEPOSIT_AMOUNT = 1000;

const gasEstimatePlaceholder = CurrencyAmount.fromRawAmount(BITCOIN, 0n);

const nativeToken = Ether.onChain(L2_CHAIN);

const BtcBridgeForm = ({
  type = 'deposit',
  availableTokens,
  onOnRampSuccess,
  onStartOnRamp,
  onFailOnRamp
}: BtcBridgeFormProps): JSX.Element => {
  const queryClient = useQueryClient();

  const { address: evmAddress } = useAccount();

  const { isContract: isSmartAccount } = useIsContract({ address: evmAddress });

  const { address: btcAddress, connector, addressType: btcAddressType } = useSatsAccount();
  const { data: satsBalance } = useSatsBalance();
  const { data: satsFeeEstimate } = useSatsFeeEstimate();

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });

  const { refetchOnRampTxs } = useGetTransactions();

  const [amount, setAmount] = useState('');
  const debouncedAmount = useDebounce(amount, 300);

  const [receiveTicker, setReceiveTicker] = useState(availableTokens[0].currency.symbol);

  const currencyAmount = useMemo(
    () => (!isNaN(amount as any) ? CurrencyAmount.fromBaseAmount(BITCOIN, amount || 0) : undefined),
    [amount]
  );

  const btcToken = useMemo(
    () => availableTokens.find((token) => token.currency.symbol === receiveTicker),
    [availableTokens, receiveTicker]
  );

  const handleError = useCallback((e: any) => {
    toast.error(e.message);
  }, []);

  const { data: availableLiquidity, isLoading: isLoadingLiquidity } = useQuery({
    enabled: Boolean(btcToken),
    queryKey: bridgeKeys.btcTotalLiquidity(),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!currencyAmount || !btcToken) return;

      const total = await onRampApiClient.getTotalLiquidity(btcToken.raw.address);

      return CurrencyAmount.fromRawAmount(BITCOIN, total);
    }
  });

  const hasLiquidity = useMemo(() => availableLiquidity?.greaterThan(MIN_DEPOSIT_AMOUNT), [availableLiquidity]);

  const quoteDataEnabled = useMemo(() => {
    return Boolean(
      currencyAmount &&
        btcToken &&
        evmAddress &&
        btcAddress &&
        CurrencyAmount.fromBaseAmount(BITCOIN, debouncedAmount || 0).greaterThan(MIN_DEPOSIT_AMOUNT) &&
        hasLiquidity
    );
  }, [currencyAmount, btcToken, evmAddress, btcAddress, debouncedAmount, hasLiquidity]);

  const quoteQueryKey = bridgeKeys.btcQuote(evmAddress, btcAddress, Number(currencyAmount?.numerator));

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

      const { fee, onramp_address, bitcoin_address, gratuity } = await onRampApiClient.getQuote(
        btcToken.raw.address,
        atomicAmount
      );

      // means that the call failed
      if (!fee) return null;

      const feeAmount = CurrencyAmount.fromRawAmount(BITCOIN, fee);

      const btcReceiveAmount = currencyAmount.subtract(feeAmount);

      return {
        receiveAmount: CurrencyAmount.fromBaseAmount(btcToken.currency, btcReceiveAmount.toExact()),
        gratuityAmount: CurrencyAmount.fromRawAmount(nativeToken, gratuity),
        fee: feeAmount,
        onrampAddress: onramp_address,
        bitcoinAddress: bitcoin_address
      };
    }
  });

  const depositMutation = useMutation({
    mutationKey: bridgeKeys.btcDeposit(evmAddress, btcAddress),
    mutationFn: async ({
      evmAddress,
      bitcoinAddress,
      onrampAddress,
      currencyAmount
    }: {
      evmAddress: Address;
      bitcoinAddress: string;
      onrampAddress: Address;
      currencyAmount: CurrencyAmount<Bitcoin>;
    }) => {
      if (!connector) {
        throw new Error('Connector missing');
      }

      if (!quoteData) {
        throw new Error('Quote Data missing');
      }

      const data = {
        amount: [quoteData.receiveAmount, quoteData.gratuityAmount],
        fee: quoteData.fee
      };

      onStartOnRamp(data);

      const atomicAmount = Number(currencyAmount.numerator);

      const orderId = await onRampApiClient.createOrder(onrampAddress, evmAddress, atomicAmount);

      const tx = await connector.createTxWithOpReturn(bitcoinAddress, atomicAmount, evmAddress);

      // NOTE: relayer should broadcast the tx
      await onRampApiClient.updateOrder(orderId, tx.toHex());

      return { ...data, txid: tx.getId() };
    },
    onSuccess: (data) => {
      setAmount('');
      form.resetForm();
      onOnRampSuccess?.(data);
      refetchOnRampTxs();
      queryClient.removeQueries({ queryKey: quoteQueryKey });
    },
    onError: (error) => {
      handleError(error);
      onFailOnRamp();
    }
  });

  useEffect(() => {
    form.resetForm();

    setReceiveTicker(availableTokens[0].currency.symbol);
    setAmount('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTokens]);

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!currencyAmount || !quoteData || !evmAddress) return;

    if (type === 'deposit') {
      return depositMutation.mutate({
        onrampAddress: quoteData.onrampAddress,
        bitcoinAddress: quoteData.bitcoinAddress,
        evmAddress: (data[BRIDGE_RECIPIENT] as Address) || evmAddress,
        currencyAmount
      });
    }
  };

  const { balanceAmount, humanBalanceAmount } = useMemo(() => {
    if (!satsFeeEstimate || !availableLiquidity) {
      return { balanceAmount: CurrencyAmount.fromRawAmount(BITCOIN, 0n) };
    }

    const balance = CurrencyAmount.fromRawAmount(BITCOIN, satsBalance || 0);

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
      [BRIDGE_AMOUNT]: '',
      [BRIDGE_TICKER]: receiveTicker,
      [BRIDGE_RECIPIENT]: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount: currencyAmount && new Big(MIN_DEPOSIT_AMOUNT / 10 ** currencyAmount?.currency.decimals),
      maxAmount: new Big(balanceAmount.toExact())
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const price = useMemo(() => getPrice('BTC'), [getPrice]);

  const valueUSD = useMemo(() => new Big(amount || 0).mul(price || 0).toNumber(), [amount, price]);

  const isSubmitDisabled = isFormDisabled(form);

  const isTapRootAddress = btcAddressType === BtcAddressType.p2tr;

  const isDisabled =
    isSubmitDisabled || !quoteData || isQuoteError || isTapRootAddress || isLoadingLiquidity || !hasLiquidity;

  const isLoading = !isSubmitDisabled && (depositMutation.isPending || isFetchingQuote);

  const receiveAmount = useMemo(
    () => (quoteData ? [quoteData.receiveAmount, quoteData.gratuityAmount] : undefined),
    [quoteData]
  );

  const placeholderAmount = useMemo(
    () =>
      btcToken
        ? [CurrencyAmount.fromRawAmount(btcToken.currency, 0n), CurrencyAmount.fromRawAmount(nativeToken, 0n)]
        : undefined,
    [btcToken]
  );

  return (
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balanceAmount.toExact()}
        balanceLabel={
          <Tooltip label='Your available balance may differ from your wallet balance due to network fees and available liquidity'>
            Available
          </Tooltip>
        }
        currency={BITCOIN}
        humanBalance={humanBalanceAmount?.toExact()}
        label='Amount'
        logoUrl='https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png'
        size='lg'
        valueUSD={valueUSD}
        {...mergeProps(form.getTokenFieldProps(BRIDGE_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <Select<TokenData>
        items={availableTokens}
        label='Receive'
        modalProps={{ title: 'Select Token', size: 'xs' }}
        size='lg'
        type='modal'
        {...mergeProps(form.getSelectFieldProps(BRIDGE_TICKER), {
          onValueChange: (value: string) => setReceiveTicker(value)
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
      {isSmartAccount && (
        <Input label='Recipient' placeholder='Enter destination address' {...form.getFieldProps(BRIDGE_RECIPIENT)} />
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
      {!hasLiquidity && !isLoadingLiquidity && (
        <Alert status='warning'>
          <P size='s'>There is currently no available liquidity to onramp BTC into {btcToken?.currency.symbol}.</P>
        </Alert>
      )}
      <TransactionDetails
        amount={receiveAmount}
        amountPlaceholder={placeholderAmount}
        chainId={L2_CHAIN}
        gasEstimate={quoteData?.fee || gasEstimatePlaceholder}
        gasEstimatePlaceholder={gasEstimatePlaceholder}
        gasLabel='Estimated Fee'
      />
      <AuthButton isBtcAuthRequired color='primary' disabled={isDisabled} loading={isLoading} size='xl' type='submit'>
        Bridge Asset
      </AuthButton>
    </Flex>
  );
};

export { BtcBridgeForm };
