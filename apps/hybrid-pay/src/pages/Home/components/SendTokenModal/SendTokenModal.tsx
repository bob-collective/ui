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

import { TransactionDetails } from '../../../../components';
import { CHAIN } from '../../../../constants';
import { paymasters, useBalances, useKernelClient } from '../../../../hooks';
import {
  TRANSFER_TOKEN_AMOUNT,
  TRANSFER_TOKEN_RECIPIENT,
  TransferTokenFormValidationParams,
  TransferTokenFormValues,
  transferTokenSchema
} from '../../../../lib/form/transfer';
import { isFormDisabled } from '../../../../lib/form/utils';
import { calculateAmountUSD, dynamicApiClient } from '../../../../utils';

const baseToken = {
  [ChainId.BASE_SEPOLIA]: {
    currency: new ERC20Token(ChainId.BASE_SEPOLIA, '0x036CbD53842c5426634e7929541eC2318f3dCF7e', 6, 'USDC', 'USD Coin'),
    raw: {
      chainId: ChainId.BASE_SEPOLIA,
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logoUrl: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
      apiId: 'usd-coin'
    }
  },
  [ChainId.BOB]: {
    currency: new ERC20Token(ChainId.BOB, '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3', 8, 'WBTC', 'Wrapped BTC'),
    raw: {
      chainId: ChainId.BOB,
      address: '0x03c7054bcb39f7b2e5b2c7acb37583e32d70cfa3',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      logoUrl:
        'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
      apiId: 'wrapped-btc'
    }
  }
};

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

type TransferFormProps = Props;

const TransferForm = ({}: TransferFormProps): JSX.Element => {
  const { address, chain } = useAccount();

  const token = baseToken[(chain?.id as ChainId.BASE_SEPOLIA) || ChainId.BASE_SEPOLIA];
  const gasToken = token;

  const { isAuthenticated, setShowAuthFlow, user } = useDynamicContext();

  const [amount, setAmount] = useState('');

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { getBalance } = useBalances(CHAIN);

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
      [TRANSFER_TOKEN_RECIPIENT]: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tokenBalance = useMemo(() => token && getBalance(token.currency.symbol), [getBalance, token]);

  const params: TransferTokenFormValidationParams = {
    [TRANSFER_TOKEN_AMOUNT]: {
      minAmount: token && new Big(1 / 10 ** token.currency.decimals),
      maxAmount: new Big(tokenBalance?.toExact() || 0)
    },
    [TRANSFER_TOKEN_RECIPIENT]: 'socials'
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
    onSuccess: () => {
      form.resetForm();
      setAmount('');
    },
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
        `Successfully transfered ${variables.currencyAmount.numerator} ${variables.currencyAmount.currency.symbol}`
      );

      form.resetForm();
      setAmount('');
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error('Failed to submite transaction');
      // eslint-disable-next-line no-console
      console.log(smartAccountTransferError);
    }
  }, [smartAccountTransferError]);

  const balance = tokenBalance?.toExact() || '0';
  const humanBalance = tokenBalance?.toSignificant();

  const isTransferLoading = isSmartAccountTransferPending || isEOATransferPending || isWaitingEoaTransferTxConfirmation;
  const isSubmitDisabled = isFormDisabled(form);

  return (
    <Flex direction='column' elementType='form' gap='xl' marginTop='md' onSubmit={form.handleSubmit as any}>
      <Input
        label='Recipient'
        placeholder='Enter email/EVM address'
        size='lg'
        {...form.getFieldProps(TRANSFER_TOKEN_RECIPIENT)}
      />
      <TokenInput
        balance={balance}
        currency={token.currency}
        humanBalance={humanBalance}
        label='Amount'
        logoUrl={token.raw.logoUrl}
        size='lg'
        valueUSD={calculateAmountUSD(currencyAmount, getPrice(token.currency.symbol))}
        {...mergeProps(form.getTokenFieldProps(TRANSFER_TOKEN_AMOUNT), {
          onValueChange: (value: string) => setAmount(value)
        })}
      />
      <TransactionDetails
        amount={currencyAmount}
        chainId={CHAIN}
        duration='< 1 minute'
        tokenUrl={token.raw.logoUrl}
        // gasEstimate={currencyAmount}
        // isLoadingGasEstimate={gasEstimateMutation.isLoading}
      />
      {isAuthenticated ? (
        <Button color='primary' disabled={isSubmitDisabled} loading={isTransferLoading} size='xl' type='submit'>
          Send
        </Button>
      ) : (
        <Button color='primary' size='xl' onPress={() => setShowAuthFlow(true)}>
          Log in or sign up
        </Button>
      )}
    </Flex>
  );
};

export { TransferForm };
