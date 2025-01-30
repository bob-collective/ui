/* eslint-disable no-console */
'use client';

import { Currency, CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { USDC } from '@gobob/tokens';
import { Flex, Input, TokenInput, TokenSelectItemProps, toast, useForm } from '@gobob/ui';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { mergeProps } from '@react-aria/utils';
import { useMutation } from '@tanstack/react-query';
import Big from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { Address } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import posthog from 'posthog-js';

import { BridgeAlert } from './BridgeAlert';

import { l1StandardBridgeAbi } from '@/abis/L1StandardBridge.abi';
import { l2StandardBridgeAbi } from '@/abis/L2StandardBridge.abi';
import { AuthButton } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN, publicClientL1, publicClientL2 } from '@/constants';
import { bridgeContracts } from '@/constants/bridge';
import {
  BridgeToken,
  useApproval,
  useBalances,
  useBridgeTokens,
  useIsContract,
  useSubscribeBalances,
  useWalletClientL1,
  useWalletClientL2
} from '@/hooks';
import {
  BRIDGE_AMOUNT,
  BRIDGE_ASSET,
  BRIDGE_BTC_WALLET,
  BRIDGE_EVM_WALLET,
  BRIDGE_RECIPIENT,
  BridgeFormValidationParams,
  BridgeFormValues,
  bridgeSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';
import { bridgeKeys } from '@/lib/react-query';
import {
  BridgeTransaction,
  BridgeTransactionStatus,
  InitBridgeTransaction,
  TransactionDirection,
  TransactionType
} from '@/types';
import { calculateAmountUSD } from '@/utils';
import { PosthogEvents } from '@/lib/posthog';

const getBridgeContract = (currency: Ether | ERC20Token) =>
  currency.isToken ? bridgeContracts[currency.symbol]?.[L2_CHAIN] || bridgeContracts.Standard : bridgeContracts.ETH;

type BobBridgeFormProps = {
  direction: TransactionDirection;
  symbol?: string;
  onChangeSymbol: (symbol: string) => void;
  onStartBridge?: (data: InitBridgeTransaction) => void;
  onBridgeSuccess?: (data: BridgeTransaction) => void;
  onStartApproval?: (data: InitBridgeTransaction) => void;
  onFailBridge?: () => void;
};

// TODO: erc20 gas estimate (currently is failing)
const BobBridgeForm = ({
  direction = TransactionDirection.L1_TO_L2,
  symbol: symbolProp,
  onBridgeSuccess,
  onStartBridge,
  onFailBridge,
  onStartApproval,
  onChangeSymbol
}: BobBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();
  const bridgeChainId = direction === TransactionDirection.L1_TO_L2 ? L1_CHAIN : L2_CHAIN;

  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { getPrice } = usePrices();
  const { getBalance, refetch: refetchBalances } = useBalances(bridgeChainId);

  useSubscribeBalances(bridgeChainId);

  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);

  const walletClientL1 = useWalletClientL1();
  const walletClientL2 = useWalletClientL2();

  const { isContract: isSmartAccount } = useIsContract({ address, chainId: bridgeChainId });

  const initialToken = useMemo(() => Ether.onChain(bridgeChainId), [bridgeChainId]);

  const symbol = symbolProp || initialToken.symbol;
  const [prevSymbol, setPrevSymbol] = useState(symbol);

  const [amount, setAmount] = useDebounceValue('', 300);

  const { selectedCurrency, selectedToken } = useMemo(() => {
    const selectedToken = tokens?.find((token) => token.l1Currency.symbol === symbol);

    return {
      selectedToken,
      selectedCurrency:
        direction === TransactionDirection.L1_TO_L2 ? selectedToken?.l1Currency : selectedToken?.l2Currency
    };
  }, [symbol, tokens, direction]);

  const currencyAmount = useMemo(
    () =>
      selectedCurrency && !isNaN(+amount) ? CurrencyAmount.fromBaseAmount(selectedCurrency, amount || 0) : undefined,
    [selectedCurrency, amount]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    console.error(error);

    onFailBridge?.();

    if (error.code === 4001) {
      toast.error(t(i18n)`User rejected the request`);
    } else {
      toast.error(t(i18n)`Something went wrong. Please try again later.`);
    }
  };

  const handleSuccess = (data: BridgeTransaction) => {
    onBridgeSuccess?.(data);

    // Resetting form and defaulting ETH
    form.resetForm({ values: { ...initialValues, [BRIDGE_ASSET]: initialToken.symbol } });

    onChangeSymbol?.(initialToken.symbol);
    setAmount('');

    refetchBalances();
  };

  const isBridgeDisabled =
    direction === TransactionDirection.L1_TO_L2
      ? selectedToken?.l1Token.bridgeDisabled
      : selectedToken?.l2Token.bridgeDisabled;

  const shouldCheckAllowance =
    currencyAmount &&
    currencyAmount.currency.isToken &&
    (direction === TransactionDirection.L1_TO_L2 ||
      (direction === TransactionDirection.L2_TO_L1 && USDC?.[L2_CHAIN]?.equals(currencyAmount.currency)));

  const bridgeContract = selectedCurrency && getBridgeContract(selectedCurrency);

  const {
    isApproveRequired,
    approveAsync,
    isApproving,
    allowance,
    isAllowanceLoading,
    refetch: refetchAllowance
  } = useApproval({
    amount: currencyAmount,
    spender:
      shouldCheckAllowance && bridgeContract
        ? direction === TransactionDirection.L1_TO_L2
          ? bridgeContract.l1Bridge
          : bridgeContract.l2Bridge
        : undefined
  });

  const depositMutation = useMutation({
    mutationKey: bridgeKeys.deposit(address),
    mutationFn: async ({
      currencyAmount,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }): Promise<BridgeTransaction> => {
      if (shouldCheckAllowance && !allowance) {
        throw new Error('Allowance data missing');
      }

      if (!(bridgeContract && bridgeContract.l1Bridge)) {
        throw new Error('Contract missing');
      }

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const data: InitBridgeTransaction = {
        amount: currencyAmount,
        direction: TransactionDirection.L1_TO_L2,
        from: address!,
        to: recipient,
        l1Token: l1Address,
        l2Token: l2Address,
        type: TransactionType.Bridge,
        logoUrl: selectedToken.l1Token.logoUrl
      };

      const to = recipient || address!;
      const amount = BigInt(currencyAmount.numerator);

      if (currencyAmount.currency.isNative) {
        onStartBridge?.(data);

        // simulate deposit
        const args = await publicClientL2.buildDepositTransaction({
          account: address!,
          mint: amount,
          to
        });

        const transactionHash = await walletClientL1.depositTransaction(args);

        return {
          ...data,
          transactionHash,
          status: BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
          date: new Date()
        };
      }

      if (isApproveRequired) {
        onStartApproval?.(data);

        const approveResult = await approveAsync?.();

        if (!approveResult) {
          throw new Error('Approve failed');
        }

        await publicClient?.waitForTransactionReceipt({ hash: approveResult });

        refetchAllowance();
      }

      onStartBridge?.(data);

      const { request } = await publicClientL1.simulateContract({
        account: address,
        abi: l1StandardBridgeAbi,
        address: bridgeContract.l1Bridge,
        functionName: 'depositERC20To',
        args: [l1Address, l2Address, to, amount, 0, '0x']
      });

      const transactionHash = await walletClientL1.writeContract(request);

      return {
        ...data,
        transactionHash,
        status: BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE,
        date: new Date()
      };
    },
    onSuccess: handleSuccess,
    onError: handleError
  });

  const withdrawMutation = useMutation({
    mutationKey: bridgeKeys.withdraw(address),
    mutationFn: async ({
      currencyAmount,
      selectedToken,
      recipient
    }: {
      selectedToken: BridgeToken;
      currencyAmount: CurrencyAmount<ERC20Token | Ether>;
      recipient: Address;
    }): Promise<BridgeTransaction> => {
      if (shouldCheckAllowance && !allowance) {
        throw new Error('Allowance data missing');
      }

      if (!(bridgeContract && bridgeContract.l1Bridge)) {
        throw new Error('Contract missing');
      }

      const l1Address = selectedToken.l1Token.address;
      const l2Address = selectedToken.l2Token.address;

      const data: InitBridgeTransaction = {
        amount: currencyAmount,
        direction: TransactionDirection.L2_TO_L1,
        from: address!,
        to: recipient,
        l1Token: l1Address,
        l2Token: l2Address,
        type: TransactionType.Bridge,
        logoUrl: selectedToken.l2Token.logoUrl
      };

      const to = recipient || address!;
      const amount = BigInt(currencyAmount.numerator);

      if (currencyAmount.currency.isNative) {
        onStartBridge?.(data);

        // simulate withdrawal
        const args = await publicClientL1.buildInitiateWithdrawal({
          account: address!,
          value: amount,
          to
        });

        const transactionHash = await walletClientL2.initiateWithdrawal(args);

        return {
          ...data,
          transactionHash,
          status: BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED,
          date: new Date()
        };
      }

      // Only needed for USDC
      if (isApproveRequired) {
        onStartApproval?.(data);

        const approveResult = await approveAsync?.();

        if (!approveResult) {
          throw new Error('Approve failed');
        }

        await publicClient?.waitForTransactionReceipt({ hash: approveResult });

        refetchAllowance();
      }

      onStartBridge?.(data);

      const { request } = await publicClientL2.simulateContract({
        account: address,
        abi: l2StandardBridgeAbi,
        address: bridgeContract.l2Bridge,
        functionName: 'withdrawTo',
        args: [l2Address, to, amount, 0, '0x']
      });

      const transactionHash = await walletClientL2.writeContract(request);

      return {
        ...data,
        transactionHash,
        status: BridgeTransactionStatus.STATE_ROOT_NOT_PUBLISHED,
        date: new Date()
      };
    },
    onSuccess: handleSuccess,
    onError: handleError
  });

  const handleSubmit = async (data: BridgeFormValues) => {
    if (!currencyAmount || !selectedToken || isBridgeDisabled) return;

    const recipient = (data[BRIDGE_RECIPIENT] as Address) || undefined;

    if (direction === TransactionDirection.L1_TO_L2) {
      return depositMutation.mutate({
        currencyAmount,
        selectedToken,
        recipient
      });
    }

    return withdrawMutation.mutate({
      currencyAmount,
      selectedToken,
      recipient
    });
  };

  const initialValues = useMemo(
    () => ({
      [BRIDGE_AMOUNT]: '',
      [BRIDGE_ASSET]: symbol,
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
    [BRIDGE_RECIPIENT]: !!isSmartAccount,
    [BRIDGE_BTC_WALLET]: null,
    [BRIDGE_EVM_WALLET]: address
  };

  const form = useForm<BridgeFormValues>({
    initialValues,
    validationSchema: bridgeSchema('bridge', params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  useEffect(() => {
    if (!form.dirty) return;

    posthog.capture(PosthogEvents.EVM_BRIDGE_FORM_TOUCHED);
  }, [form.dirty]);

  // Reseting form but keeping the symbol between Deposit and Withdraw
  useEffect(() => {
    form.resetForm({ values: { ...initialValues, [BRIDGE_ASSET]: symbol } });
    setAmount('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction]);

  if (symbol !== prevSymbol) {
    setPrevSymbol(symbol);
    form.setFieldValue(BRIDGE_ASSET, symbol, true);
  }

  const handleChangeSymbol = (currency: Currency) => {
    onChangeSymbol?.(currency.symbol as string);
  };

  const valueUSD = currencyAmount ? calculateAmountUSD(currencyAmount, getPrice(symbol)) : 0;

  const tokenInputItems: TokenSelectItemProps[] = useMemo(
    () =>
      tokens?.map((token): TokenSelectItemProps => {
        const balance = getBalance(token.l1Currency.symbol);

        return {
          balance: balance?.toExact() || 0,
          balanceUSD: balance ? calculateAmountUSD(balance, getPrice(token.l1Currency.symbol)) : 0,
          logoUrl: token.l1Token.logoUrl,
          currency: token.l1Currency
        };
      }) || [],
    [tokens, getBalance, getPrice]
  );

  const isCheckingAllowance = shouldCheckAllowance && (isAllowanceLoading || !allowance);

  const isBridgingLoading = depositMutation.isPending || withdrawMutation.isPending;

  const isSubmitDisabled = isFormDisabled(form) || isBridgeDisabled;

  const btnLabel = isBridgeDisabled
    ? t(i18n)`Bridge Disabled`
    : isCheckingAllowance
      ? t(i18n)`Checking Allowance`
      : isApproveRequired
        ? t(i18n)`Approve`
        : t(i18n)`Bridge Asset`;

  const isLoading = isCheckingAllowance || isApproving || isBridgingLoading;

  const balance = tokenBalance?.toExact() || '0';

  const humanBalance = tokenBalance?.toSignificant();

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={balance}
        humanBalance={humanBalance}
        items={tokenInputItems}
        label={t(i18n)`Amount`}
        type='selectable'
        valueUSD={valueUSD}
        onChangeCurrency={handleChangeSymbol}
        {...mergeProps(form.getSelectableTokenFieldProps({ amount: BRIDGE_AMOUNT, currency: BRIDGE_ASSET }), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      {isSmartAccount && (
        <Input
          label={t(i18n)`Recipient`}
          placeholder={t(i18n)`Enter destination address`}
          {...form.getFieldProps(BRIDGE_RECIPIENT)}
        />
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
