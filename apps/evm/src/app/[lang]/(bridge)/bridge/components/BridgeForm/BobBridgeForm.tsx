/* eslint-disable no-console */
'use client';

import { Currency, CurrencyAmount, Ether } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { FuelStation } from '@gobob/icons';
import {
  Card,
  Flex,
  Input,
  P,
  Skeleton,
  SolidClock,
  toast,
  TokenInput,
  TokenSelectItemProps,
  useCurrencyFormatter,
  useForm
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sendGAEvent } from '@next/third-parties/google';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { useBridge } from '../../hooks';
import { BridgeTransactionModal } from '../BridgeTransactionModal';

import { BridgeAlert } from './BridgeAlert';

import { AuthButton } from '@/connect-ui';
import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { useBalances, useBridgeTokens, useGetBridgeTransactions, useIsContract, useSubscribeBalances } from '@/hooks';
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
import { posthogEvents } from '@/lib/posthog';
import { BridgeTransaction, TransactionDirection } from '@/types';
import { calculateAmountUSD } from '@/utils';

type BobBridgeFormProps = {
  direction: TransactionDirection;
  symbol?: string;
  onChangeSymbol: (symbol: string) => void;
};

// TODO: erc20 gas estimate (currently is failing)
const BobBridgeForm = ({
  direction = TransactionDirection.L1_TO_L2,
  symbol: symbolProp,
  onChangeSymbol
}: BobBridgeFormProps): JSX.Element => {
  const { i18n } = useLingui();
  const format = useCurrencyFormatter();
  const bridgeChainId = direction === TransactionDirection.L1_TO_L2 ? L1_CHAIN : L2_CHAIN;

  const { address, connector } = useAccount();

  const { getPrice } = usePrices();
  const { getBalance, refetch: refetchBalances } = useBalances(bridgeChainId);

  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const { isContract: isSmartAccount } = useIsContract({ address, chainId: bridgeChainId });
  const { refetch: refetchBridgeTransactions, addPlaceholderTransaction: addBridgePlaceholderTransaction } =
    useGetBridgeTransactions();

  useSubscribeBalances(bridgeChainId);

  const initialToken = useMemo(() => Ether.onChain(bridgeChainId), [bridgeChainId]);

  const symbol = symbolProp || initialToken.symbol;
  const [prevSymbol, setPrevSymbol] = useState(symbol);

  const [isBridgeModalOpen, setBridgeModalOpen] = useState(false);

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

  const evmBridgePosthogEvents = direction === TransactionDirection.L1_TO_L2 ? 'deposit' : 'withdraw';

  const isBridgeDisabled = !!(direction === TransactionDirection.L1_TO_L2
    ? selectedToken?.l1Token.bridgeDisabled
    : selectedToken?.l2Token.bridgeDisabled);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    console.error(error);

    posthogEvents.bridge.evm.failed(evmBridgePosthogEvents);

    toast.error(error.shortMessage || t(i18n)`Something went wrong. Please try again later.`);
  };

  const handleSuccess = (data: BridgeTransaction) => {
    // Resetting form and defaulting ETH
    form.resetForm({ values: { ...initialValues, [BRIDGE_ASSET]: initialToken.symbol } });

    onChangeSymbol?.(initialToken.symbol);
    setAmount('');

    refetchBalances();

    addBridgePlaceholderTransaction(data);

    refetchBridgeTransactions();

    sendGAEvent('event', 'evm_bridge', {
      l1_token: data.l1Token,
      amount: data.amount?.toExact(),
      tx_id: JSON.stringify(data.transactionHash),
      evm_wallet: connector?.name
    });

    posthogEvents.bridge.evm.completed(evmBridgePosthogEvents);
  };

  const { approval, approvalGasEstimate, deposit, withdraw, gasEstimate } = useBridge({
    direction,
    selectedCurrency,
    isBridgeDisabled,
    gasToken: initialToken,
    currencyAmount,
    selectedToken,
    onError: handleError,
    onSuccess: handleSuccess
  });

  const handleSubmit = async () => {
    setBridgeModalOpen(true);
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

    posthogEvents.bridge.evm.interacted(direction === TransactionDirection.L1_TO_L2 ? 'deposit' : 'withdraw', {
      ticker: symbol
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isFeePeding = gasEstimate.isPending || (approval.isApproveRequired && approvalGasEstimate.isPending);

  const isSubmitDisabled = isFormDisabled(form) || isBridgeDisabled || isFeePeding;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Flex direction='column' elementType='form' gap='md' marginTop='md' onSubmit={form.handleSubmit as any}>
      <TokenInput
        balance={tokenBalance?.toExact() || '0'}
        humanBalance={tokenBalance?.toSignificant()}
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
      <Card wrap background='grey-600' direction='row' gap='s' justifyContent='space-between' padding='lg' rounded='md'>
        <Flex alignItems='center' gap='s' style={{ maxHeight: '1.25rem' }}>
          <FuelStation color='grey-50' size='xxs' />
          {(approval.isApproveRequired && approvalGasEstimate.isLoading) || gasEstimate.isLoading ? (
            <Skeleton width='5rem' />
          ) : (
            <P color='grey-50' size='s'>
              {gasEstimate.data?.toSignificant(3) || '0.00'} (
              {format(
                gasEstimate.data
                  ? calculateAmountUSD(
                      approvalGasEstimate.data ? gasEstimate.data.add(approvalGasEstimate.data) : gasEstimate.data,
                      getPrice(gasEstimate.data.currency.symbol)
                    )
                  : 0
              )}
              )
            </P>
          )}
        </Flex>
        <Flex alignItems='center' gap='xxs'>
          <P color='grey-50' size='s'>
            {direction === TransactionDirection.L1_TO_L2 ? <Trans>~3 min</Trans> : <Trans>~7 days</Trans>}
          </P>
          <SolidClock color='grey-50' size='xs' />
        </Flex>
      </Card>
      <AuthButton
        chain={bridgeChainId}
        color='primary'
        disabled={isSubmitDisabled}
        size='xl'
        style={{ marginTop: '0.5rem' }}
        type='submit'
      >
        {isBridgeDisabled ? t(i18n)`Bridge disabled` : t(i18n)`Review bridge`}
      </AuthButton>
      {currencyAmount && selectedToken && (
        <BridgeTransactionModal
          approval={approval}
          approvalGasEstimate={approvalGasEstimate}
          currencyAmount={currencyAmount}
          deposit={deposit}
          direction={direction}
          gasEstimate={gasEstimate}
          isOpen={isBridgeModalOpen}
          recipient={form.values[BRIDGE_RECIPIENT]}
          selectedToken={selectedToken}
          withdraw={withdraw}
          onClose={() => setBridgeModalOpen(false)}
        />
      )}
    </Flex>
  );
};

export { BobBridgeForm };
