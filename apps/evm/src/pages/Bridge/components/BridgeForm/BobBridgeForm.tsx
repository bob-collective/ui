import { MessageDirection, NumberLike } from '@eth-optimism/sdk';
import { Currency, CurrencyAmount, ERC20Token, Ether, Token } from '@gobob/currency';
import { UINT_256_MAX, useApproval } from '@gobob/hooks';
import { INTERVAL, useMutation, usePrices, useQuery } from '@gobob/react-query';
import { USDC } from '@gobob/tokens';
import { Flex, Input, TokenSelectItemProps, TokenInput, toast, useForm } from '@gobob/ui';
import { useAccount, useChainId, useIsContract, usePublicClient } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounce } from '@uidotdev/usehooks';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { AuthButton } from '@gobob/connect-ui';

import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useBalances } from '../../../../hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_GAS_TOKEN,
  BRIDGE_RECIPIENT,
  BRIDGE_TICKER,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '../../../../lib/form/bridge';
import { isFormDisabled } from '../../../../lib/form/utils';
import {
  BridgeToken,
  USDCCrossBridgeConfig,
  useBridgeTokens,
  useCrossChainMessenger,
  useGetTransactions
} from '../../hooks';
import { L2BridgeData } from '../../types';

import { BridgeAlert } from './BridgeAlert';

type BobBridgeFormProps = {
  type: 'deposit' | 'withdraw';
  ticker?: string;
  onStartBridge?: (data: L2BridgeData) => void;
  onBridgeSuccess?: (data: L2BridgeData) => void;
  onStartApproval?: (data: L2BridgeData) => void;
  onFailBridge?: () => void;
};

// TODO: erc20 gas estimate (currently is failing)
const BobBridgeForm = ({
  type = 'deposit',
  ticker: tickerProp,
  onBridgeSuccess,
  onStartBridge,
  onFailBridge,
  onStartApproval
}: BobBridgeFormProps): JSX.Element => {
  const bridgeChainId = useMemo(() => (type === 'deposit' ? L1_CHAIN : L2_CHAIN), [type]);

  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { address, chain } = useAccount();

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { getBalance } = useBalances(bridgeChainId);

  const { refetchBridgeTxs } = useGetTransactions();

  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);

  const messenger = useCrossChainMessenger();

  const [amount, setAmount] = useState('');
  const debouncedAmount = useDebounce(amount, 300);

  const { isContract: isSmartAccount } = useIsContract({ address, chainId: bridgeChainId });

  const nativeToken = useMemo(() => Ether.onChain(bridgeChainId), [bridgeChainId]);

  const [ticker, setTicker] = useState(tickerProp || nativeToken.symbol);
  const [gasTicker, setGasTicker] = useState(nativeToken.symbol);

  const { selectedCurrency, selectedToken } = useMemo(() => {
    const selectedToken = tokens?.find((token) => token.l1Currency.symbol === ticker);

    return {
      selectedToken,
      selectedCurrency: type === 'deposit' ? selectedToken?.l1Currency : selectedToken?.l2Currency
    };
  }, [ticker, tokens, type]);

  const selectedGasToken = useMemo(
    () => tokens?.find((token) => token.l1Currency.symbol === gasTicker),
    [gasTicker, tokens]
  );

  const currencyAmount = useMemo(
    () =>
      selectedCurrency && !isNaN(amount as any)
        ? CurrencyAmount.fromBaseAmount(selectedCurrency, amount || 0)
        : undefined,
    [selectedCurrency, amount]
  );

  const handleError = useCallback((e: any) => {
    if (e.code === 4001) {
      toast.error('User rejected the request');
    } else {
      toast.error('Something went wrong. Please try again later.');
    }
  }, []);

  // FIXME: not working
  const gasEstimateMutation = useMutation({
    mutationKey: ['gasEstimate', amount, address],
    mutationFn: async ({
      currencyAmount,
      selectedToken
    }: {
      selectedToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
    }) => {
      if (!messenger) {
        throw new Error('Missing messenger');
      }

      if (currencyAmount.currency.isNative) {
        const amount = currencyAmount.numerator.toString();

        const gasAmount = await (type === 'deposit'
          ? messenger.estimateGas.depositETH(amount)
          : messenger.estimateGas.withdrawETH(amount));

        return CurrencyAmount.fromRawAmount(nativeToken, gasAmount.toBigInt());
      }

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;
      const amount = currencyAmount.numerator.toString();

      // TODO: USDC requires approval on withdraw
      if (type === 'deposit') {
        const approval = await messenger.approval(l1Address, l2Address);

        const approvalAmount = CurrencyAmount.fromRawAmount(currencyAmount.currency, approval.toBigInt());

        if (approvalAmount.lessThan(currencyAmount)) {
          const gasAmount = await messenger.estimateGas.approveERC20(
            l1Address,
            l2Address,
            UINT_256_MAX as unknown as NumberLike
          );

          return CurrencyAmount.fromRawAmount(nativeToken, gasAmount.toBigInt());
        }
      }

      const gasAmount = await (type === 'deposit'
        ? messenger.estimateGas.depositERC20(l1Address, l2Address, amount)
        : messenger.estimateGas.withdrawERC20(l1Address, l2Address, amount));

      return CurrencyAmount.fromRawAmount(nativeToken, gasAmount.toBigInt());
    }
  });

  const isBridgeDisabled = useMemo(
    () => (type === 'deposit' ? selectedToken?.l1Token.bridgeDisabled : selectedToken?.l2Token.bridgeDisabled),
    [type, selectedToken]
  );

  const {
    data: allowance,
    refetch: refetchL1Allowance,
    isLoading: isLoadingAllowance,
    isFetching: isFetchingAllowance
  } = useQuery({
    queryKey: ['allowance', ticker, address],
    enabled: Boolean(!isBridgeDisabled && currencyAmount && address && selectedCurrency?.isToken && type === 'deposit'),
    queryFn: async () => {
      if (!messenger) {
        throw new Error('Missing messenger');
      }

      if (!selectedToken || !selectedCurrency) return;

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const approval = await messenger.approval(l1Address, l2Address);

      return CurrencyAmount.fromRawAmount(selectedCurrency, approval.toBigInt());
    },
    staleTime: INTERVAL.HOUR
  });

  const isApproveRequired = useMemo(
    () => !!currencyAmount && !!allowance && allowance.lessThan(currencyAmount),
    [allowance, currencyAmount]
  );

  const depositMutation = useMutation({
    mutationKey: ['deposit', address],
    mutationFn: async ({
      currencyAmount,
      selectedGasToken,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      selectedGasToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }) => {
      if (!messenger) {
        throw new Error('Missing messenger');
      }

      if (!allowance && currencyAmount.currency.isToken) {
        throw new Error('Allowance data missing');
      }

      const data = {
        amount: currencyAmount,
        gasEstimate: gasEstimateMutation.data || CurrencyAmount.fromRawAmount(selectedGasToken.l1Currency, 0n),
        direction: MessageDirection.L1_TO_L2
      };

      if (currencyAmount.currency.isNative) {
        onStartBridge?.(data);

        const tx = await messenger.depositETH(currencyAmount.numerator.toString(), { recipient });

        return {
          ...data,
          transactionHash: tx.hash as Address
        };
      }

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      if (isApproveRequired) {
        onStartApproval?.(data);

        const tx = await messenger.approveERC20(l1Address, l2Address, UINT_256_MAX.toString());

        await tx.wait();

        await refetchL1Allowance();
      }

      onStartBridge?.(data);

      const tx = await messenger.depositERC20(l1Address, l2Address, currencyAmount.numerator.toString(), { recipient });

      return {
        ...data,
        transactionHash: tx.hash as Address
      };
    },
    onSuccess: (data) => {
      gasEstimateMutation.reset();
      setAmount('');
      onBridgeSuccess?.(data);
      form.resetForm();
      refetchBridgeTxs();
    },
    onError: (error) => {
      onFailBridge?.();
      handleError(error);
    }
  });

  const isUSDCWithdraw = useMemo(
    () => currencyAmount && type === 'withdraw' && USDC[L2_CHAIN].equals(currencyAmount.currency),
    [type, currencyAmount]
  );

  const {
    isApproveRequired: isUSDCApproveRequired,
    approveAsync: approveUSDCAsync,
    isApproving: isApprovingUSDC
  } = useApproval({
    amount: isUSDCWithdraw ? (currencyAmount as CurrencyAmount<Token>) : undefined,
    spender: USDCCrossBridgeConfig[L2_CHAIN].l2Bridge as Address
  });

  const withdrawMutation = useMutation({
    mutationKey: ['withdraw', address],
    mutationFn: async ({
      currencyAmount,
      selectedGasToken,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      selectedGasToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }) => {
      if (!messenger) {
        throw new Error('Missing messenger');
      }

      const data = {
        amount: currencyAmount,
        gasEstimate: gasEstimateMutation.data || CurrencyAmount.fromRawAmount(selectedGasToken.l2Currency, 0n),
        direction: MessageDirection.L2_TO_L1
      };

      if (currencyAmount.currency.isNative) {
        onStartBridge?.(data);

        const tx = await messenger.withdrawETH(currencyAmount.numerator.toString(), { recipient });

        return {
          ...data,
          transactionHash: tx.hash as Address
        };
      }

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      if (isUSDCApproveRequired) {
        onStartApproval?.(data);

        const approveResult = await approveUSDCAsync?.();

        if (!approveResult) {
          throw new Error('Approve failed');
        }

        await publicClient?.waitForTransactionReceipt({ hash: approveResult });
      }
      onStartBridge?.(data);

      const tx = await messenger.withdrawERC20(l1Address, l2Address, currencyAmount.numerator.toString(), {
        recipient
      });

      return {
        ...data,
        transactionHash: tx.hash as Address
      };
    },
    onSuccess: (data) => {
      gasEstimateMutation.reset();
      setAmount('');
      onBridgeSuccess?.(data);
      form.resetForm();
      refetchBridgeTxs();
    },
    onError: (error) => {
      onFailBridge?.();
      handleError(error);
    }
  });

  const handleChangeCurrencyAmount = (currencyAmount: CurrencyAmount<ERC20Token | Ether>, token: BridgeToken) => {
    if (
      type === 'deposit' &&
      chainId === L1_CHAIN &&
      currencyAmount.currency.isToken &&
      currencyAmount.greaterThan(0)
    ) {
      refetchL1Allowance();
    }

    if (currencyAmount.greaterThan(0)) {
      gasEstimateMutation.mutate({ currencyAmount, selectedToken: token });
    }
  };

  useEffect(() => {
    if (!debouncedAmount) return;

    const amount = form.values[BRIDGE_AMOUNT];

    if (!amount || isNaN(amount as any) || !selectedCurrency || !selectedToken) return;

    // TODO: change currency
    const currencyAmount = CurrencyAmount.fromBaseAmount(selectedCurrency, amount);

    handleChangeCurrencyAmount(currencyAmount, selectedToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAmount]);

  useEffect(() => {
    form.resetForm();
    gasEstimateMutation.reset();

    setTicker(nativeToken.symbol);
    setGasTicker(nativeToken.symbol);
    setAmount('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (currencyAmount && selectedToken) {
      handleChangeCurrencyAmount(currencyAmount, selectedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!currencyAmount || !selectedToken || !selectedGasToken || isBridgeDisabled) return;

    const recipient = (data[BRIDGE_RECIPIENT] as Address) || undefined;

    if (type === 'deposit') {
      return depositMutation.mutate({
        currencyAmount,
        selectedGasToken,
        selectedToken,
        recipient
      });
    }

    return withdrawMutation.mutate({
      currencyAmount,
      selectedGasToken,
      selectedToken,
      recipient
    });
  };

  const initialValues = useMemo(
    () => ({
      [BRIDGE_AMOUNT]: '',
      [BRIDGE_TICKER]: ticker,
      [BRIDGE_GAS_TOKEN]: gasTicker,
      [BRIDGE_RECIPIENT]: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tokenBalance = useMemo(
    () => (selectedCurrency ? getBalance(selectedCurrency.symbol) : undefined),
    [getBalance, selectedCurrency]
  );

  const params: BridgeFormValidationParams = {
    [BRIDGE_AMOUNT]: {
      minAmount: currencyAmount && new Big(1 / 10 ** currencyAmount?.currency.decimals),
      maxAmount: new Big(tokenBalance?.toExact() || 0)
    },
    [BRIDGE_RECIPIENT]: !!isSmartAccount
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const handleChangeTicker = (currency: Currency) => {
    setTicker(currency.symbol as string);

    const selectedToken = tokens?.find((token) => token.l1Currency.symbol === currency.symbol);

    const selectedCurrency = type === 'deposit' ? selectedToken?.l1Currency : selectedToken?.l2Currency;

    if (!selectedCurrency || !selectedToken) return;

    const currencyAmount = CurrencyAmount.fromBaseAmount(selectedCurrency, amount || 0);

    handleChangeCurrencyAmount(currencyAmount, selectedToken);
  };

  const getUsdValue = useCallback(
    (ticker: string, amount: string | number) =>
      !isNaN(amount as any) ? new Big(amount || 0).mul(getPrice(ticker) || 0).toNumber() : 0,
    [getPrice]
  );

  const valueUSD = useMemo(() => getUsdValue(ticker, amount), [amount, getUsdValue, ticker]);

  const tokenInputItems: TokenSelectItemProps[] = useMemo(
    () =>
      tokens?.map((token): TokenSelectItemProps => {
        const balance = getBalance(token.l1Currency.symbol);

        return {
          balance: balance?.toExact() || 0,
          balanceUSD: getUsdValue(token.l1Currency.symbol, balance?.toExact() || 0),
          logoUrl: token.l1Token.logoUrl,
          currency: token.l1Currency
        };
      }) || [],
    [tokens, getBalance, getUsdValue]
  );

  const isBridgingLoading = depositMutation.isPending || withdrawMutation.isPending;

  const isSubmitDisabled = isFormDisabled(form) || !messenger || isFetchingAllowance || isBridgeDisabled;

  const btnLabel = isBridgeDisabled
    ? 'Bridge Disabled'
    : isFetchingAllowance
      ? 'Checking Allowance'
      : (!isLoadingAllowance && isApproveRequired) || isUSDCApproveRequired
        ? 'Approve'
        : 'Bridge Asset';

  const isLoading = isFetchingAllowance || isApprovingUSDC || isBridgingLoading;

  const balance = tokenBalance?.toExact() || '0';
  const humanBalance = tokenBalance?.toSignificant();

  return (
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balance}
        humanBalance={humanBalance}
        items={tokenInputItems}
        label='Amount'
        type='selectable'
        valueUSD={valueUSD}
        onChangeCurrency={handleChangeTicker}
        {...mergeProps(form.getSelectableTokenFieldProps({ amount: BRIDGE_AMOUNT, currency: BRIDGE_TICKER }), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      {isSmartAccount && (
        <Input label='Recipient' placeholder='Enter destination address' {...form.getFieldProps(BRIDGE_RECIPIENT)} />
      )}
      {isBridgeDisabled && selectedToken && <BridgeAlert token={selectedToken} />}
      <AuthButton
        chain={bridgeChainId}
        color='primary'
        disabled={isSubmitDisabled}
        loading={isLoading}
        size='xl'
        type='submit'
      >
        {btnLabel}
      </AuthButton>
    </Flex>
  );
};

export { BobBridgeForm };
