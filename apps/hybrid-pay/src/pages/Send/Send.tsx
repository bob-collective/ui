import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether, Token } from '@gobob/currency';
import { useMutation, usePrices } from '@gobob/react-query';
import { Button, Flex, Input, toast, TokenInput, useForm } from '@gobob/ui';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import { Address, encodeFunctionData, erc20Abi, isAddress, isAddressEqual } from 'viem';
import { useGetApprovalData } from '@gobob/hooks';
import { MaxUint256 } from '@gobob/currency/src/constants';
import { useSearchParams } from 'react-router-dom';

import { paymasters, useBalances, useKernelClient, useTokens } from '../../hooks';
import {
  TRANSFER_TOKEN_AMOUNT,
  TRANSFER_TOKEN_RECIPIENT,
  TRANSFER_TOKEN_TICKER,
  TransferTokenFormValidationParams,
  TransferTokenFormValues,
  transferTokenSchema
} from '../../lib/form/transfer';
import { isFormDisabled } from '../../lib/form/utils';
import { calculateAmountUSD, dynamicApiClient } from '../../utils';
import { CHAIN } from '../../constants';
import { Main } from '../../components';

import { TokenButtonGroup } from './components';

const getAddress = async (recipient: string) => {
  const isRecipientAddress = isAddress(recipient);

  if (isRecipientAddress) {
    return recipient;
  }
  const walletData = await dynamicApiClient.createEmbeddedWallet(recipient);

  const smartAccount = walletData.user.verifiedCredentials.find(
    (credentials) => credentials.wallet_provider === 'smartContractWallet'
  );

  if (!smartAccount) {
    throw new Error('Smart Account Not Found');
  }

  return smartAccount?.address;
};

type Props = {};

type SendProps = Props;

const Send = ({}: SendProps): JSX.Element => {
  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const { address } = useAccount();

  const { user } = useDynamicContext();

  const defaultTicker = CHAIN === ChainId.BASE_SEPOLIA ? 'USDC' : searchParams.get('token') || 'WBTC';

  const [ticker, setTicker] = useState(defaultTicker);
  const [amount, setAmount] = useState('');
  const [isGroupAmount, setGroupAmount] = useState(false);

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { getBalance, balances, isPending } = useBalances(CHAIN);

  const { data: tokens } = useTokens(CHAIN);

  const token = tokens.find((token) => token.currency.symbol === ticker)!;
  const gasToken = token;

  const kernelClient = useKernelClient(token.currency);

  const currencyAmount = useMemo(
    () => CurrencyAmount.fromBaseAmount(token.currency, amount !== '' && !isNaN(amount as any) ? amount : 0),
    [token, amount]
  );

  const isSmartAccount = useMemo(
    () =>
      !!(
        address &&
        user?.verifiedCredentials.find(
          (credentials) =>
            credentials.walletProvider === 'smartContractWallet' &&
            isAddressEqual(credentials.address as Address, address)
        )
      ),
    [address, user?.verifiedCredentials]
  );

  const initialValues = useMemo(
    () => ({
      [TRANSFER_TOKEN_AMOUNT]: '',
      [TRANSFER_TOKEN_RECIPIENT]: searchParams.get('to') || '',
      [TRANSFER_TOKEN_TICKER]: ticker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tokenBalance = useMemo(() => token && getBalance(token.currency.symbol), [getBalance, token]);

  const params: TransferTokenFormValidationParams = {
    [TRANSFER_TOKEN_AMOUNT]: {
      minAmount: token && new Big(1 / 10 ** token.currency.decimals),
      maxAmount: new Big(tokenBalance?.toExact() || 0)
    }
  };

  const paymasterApprovalData = useGetApprovalData(
    currencyAmount.currency.isToken ? (currencyAmount as CurrencyAmount<Token>) : undefined,
    isSmartAccount ? kernelClient?.account?.address : undefined,
    paymasters?.[CHAIN as ChainId.BASE_SEPOLIA]?.[gasToken.currency.symbol]
  );

  const handleSubmit = async (data: TransferTokenFormValues) => {
    if (!data[TRANSFER_TOKEN_RECIPIENT] || !currencyAmount) return;

    const args = { recipient: data[TRANSFER_TOKEN_RECIPIENT], currencyAmount };

    if (isSmartAccount) {
      smartAccountTransfer(args);

      return;
    }

    eoaTransfer(args);
  };

  const form = useForm<TransferTokenFormValues>({
    initialValues,
    validationSchema: transferTokenSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const { sendTransactionAsync } = useSendTransaction();

  const { writeContractAsync: writeTransferErc20Async } = useWriteContract();

  const {
    data: eoaTransferTx,
    mutate: eoaTransfer,
    isPending: isEOATransferPending,
    error: eoaTransferError
  } = useMutation({
    mutationKey: ['eoa-transfer', amount, form.values[TRANSFER_TOKEN_RECIPIENT]],
    mutationFn: async ({
      recipient,
      currencyAmount
    }: {
      recipient: string;
      currencyAmount: CurrencyAmount<Ether | ERC20Token>;
    }) => {
      const recipientAddress = await getAddress(recipient);

      if (currencyAmount.currency.isNative) {
        return sendTransactionAsync({
          to: recipientAddress,
          value: currencyAmount.numerator
        });
      }

      return writeTransferErc20Async({
        address: (currencyAmount.currency as Token).address,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipientAddress, currencyAmount.numerator]
      });
    }
  });

  const { isLoading: isWaitingEoaTransferTxConfirmation, data: eoaTransferTransactionReceipt } =
    useWaitForTransactionReceipt({
      hash: eoaTransferTx
    });

  useEffect(() => {
    if (eoaTransferTransactionReceipt?.status === 'success') {
      toast.success(`Successfully sent ${amount} ${token?.currency.symbol}`);

      form.resetForm();
      setAmount('');
      setGroupAmount(false);
      setTicker(defaultTicker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eoaTransferTransactionReceipt]);

  useEffect(() => {
    if (eoaTransferError) {
      toast.error(eoaTransferError.message);
      // eslint-disable-next-line no-console
      console.log(eoaTransferError);
    }
  }, [eoaTransferError]);

  const {
    mutate: smartAccountTransfer,
    isPending: isSmartAccountTransferPending,
    error: smartAccountTransferError
  } = useMutation({
    mutationKey: ['smart-account-transfer', amount, form.values[TRANSFER_TOKEN_RECIPIENT]],
    onSuccess: (tx, variables) => {
      if (!tx) {
        throw new Error('Failed to submit tx');
      }

      toast.success(
        `Successfully transfered ${variables.currencyAmount.toExact()} ${variables.currencyAmount.currency.symbol}`
      );

      form.resetForm();
      setAmount('');
      setGroupAmount(false);
      setTicker(defaultTicker);
    },
    mutationFn: async ({
      recipient,
      currencyAmount
    }: {
      recipient: string;
      currencyAmount: CurrencyAmount<Ether | ERC20Token>;
    }) => {
      const recipientAddress = await getAddress(recipient);

      if (paymasterApprovalData.isApproveRequired) {
        return kernelClient?.sendUserOperation({
          account: kernelClient?.account!,
          userOperation: {
            callData: await kernelClient?.account!.encodeCallData([
              {
                to: (currencyAmount.currency as Token).address,
                data: encodeFunctionData({
                  abi: erc20Abi,
                  args: [paymasters?.[CHAIN as ChainId.BASE_SEPOLIA]?.[gasToken.currency.symbol]!, MaxUint256],
                  functionName: 'approve'
                }),
                value: BigInt(0)
              },
              {
                to: (currencyAmount.currency as Token).address,
                data: encodeFunctionData({
                  abi: erc20Abi,
                  args: [recipientAddress, currencyAmount.numerator],
                  functionName: 'transfer'
                }),
                value: BigInt(0)
              }
            ])
          }
        });
      }

      return kernelClient?.sendUserOperation({
        account: kernelClient?.account!,
        userOperation: {
          callData: await kernelClient?.account!.encodeCallData([
            {
              to: (currencyAmount.currency as Token).address,
              data: encodeFunctionData({
                abi: erc20Abi,
                args: [recipientAddress, currencyAmount.numerator],
                functionName: 'transfer'
              }),
              value: BigInt(0)
            }
          ])
        }
      });
    }
  });

  useEffect(() => {
    if (smartAccountTransferError) {
      toast.error('Failed to submit transaction');
      // eslint-disable-next-line no-console
      console.log(smartAccountTransferError);
    }
  }, [smartAccountTransferError]);

  useEffect(() => {
    if (!isPending) {
      form.validateField(TRANSFER_TOKEN_AMOUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, isPending]);

  const tokenInputItems = useMemo(
    () =>
      tokens?.map((token) => {
        const balance = getBalance(token.currency.symbol);

        return {
          balance: balance?.toExact() || 0,
          balanceUSD: balance ? calculateAmountUSD(balance, getPrice(token.currency.symbol)) : 0,
          logoUrl: token.raw.logoUrl,
          currency: token.currency
        };
      }) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, getBalance]
  );

  const balance = tokenBalance?.toExact() || '0';
  const humanBalance = tokenBalance?.toSignificant();

  const isTransferLoading = isSmartAccountTransferPending || isEOATransferPending || isWaitingEoaTransferTxConfirmation;
  const isSubmitDisabled = isFormDisabled(form);

  return (
    <Main maxWidth='s' padding='md'>
      <Flex direction='column' elementType='form' gap='xl' marginX='md' onSubmit={form.handleSubmit as any}>
        <Input
          label='Recipient'
          placeholder='pay@gobob.xyz'
          size='lg'
          {...form.getFieldProps(TRANSFER_TOKEN_RECIPIENT)}
        />
        <TokenInput
          balance={balance}
          humanBalance={humanBalance}
          items={tokenInputItems}
          label='Amount'
          size='lg'
          type='selectable'
          valueUSD={calculateAmountUSD(currencyAmount, getPrice(token.currency.symbol))}
          onChangeCurrency={(currency) => setTicker(currency.symbol)}
          {...mergeProps(
            form.getSelectableTokenFieldProps({ amount: TRANSFER_TOKEN_AMOUNT, currency: TRANSFER_TOKEN_TICKER }),
            {
              onValueChange: (value: string) => {
                setAmount(value);
                setGroupAmount(false);
              }
            }
          )}
        />
        <TokenButtonGroup
          currency={token.currency}
          isSelected={isGroupAmount}
          onSelectionChange={(currencyAmount) => {
            form.setFieldValue(TRANSFER_TOKEN_AMOUNT, currencyAmount.toSignificant());
            form.setFieldTouched(TRANSFER_TOKEN_AMOUNT, true);
            setGroupAmount(true);
            setTimeout(() => form.validateField(TRANSFER_TOKEN_AMOUNT), 0);
          }}
        />
        <Button color='primary' disabled={isSubmitDisabled} loading={isTransferLoading} size='xl' type='submit'>
          Send
        </Button>
      </Flex>
    </Main>
  );
};

export { Send };
