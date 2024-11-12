/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ChainId } from '@gobob/chains';
import { CurrencyAmount, ERC20Token, Ether, Token } from '@gobob/currency';
import { MaxUint256 } from '@gobob/currency/src/constants';
import { useGetApprovalData } from '@gobob/hooks';
import { useMutation, usePrices } from '@gobob/react-query';
import { Button, Flex, Input, QrCode, toast, TokenInput, useForm } from '@gobob/ui';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import { Address, encodeFunctionData, erc20Abi, isAddress } from 'viem';

import { ScannerModal, TokenButtonGroup } from './components';

import { Main } from '@/components';
import { CHAIN } from '@/constants';
import { paymasters, useBalances, useIsDynamicSmartAccount, useKernelClient, useTokens } from '@/hooks';
import {
  TRANSFER_TOKEN_AMOUNT,
  TRANSFER_TOKEN_RECIPIENT,
  TRANSFER_TOKEN_TICKER,
  TransferTokenFormValidationParams,
  TransferTokenFormValues,
  transferTokenSchema
} from '@/lib/form/transfer';
import { isFormDisabled } from '@/lib/form/utils';
import { calculateAmountUSD, dynamicApiClient } from '@/utils';
import { withAuth } from '@/utils/with-auth';

const getAddressData = async (recipient: string) => {
  const isRecipientAddress = isAddress(recipient);

  if (isRecipientAddress) {
    return { isAddress: isRecipientAddress, recipientAddress: recipient };
  }
  const walletData = await dynamicApiClient.createEmbeddedWallet(recipient);

  const smartAccount = walletData.user.verifiedCredentials.find(
    (credentials) => credentials.wallet_provider === 'smartContractWallet'
  );

  if (!smartAccount) {
    throw new Error('Smart Account Not Found');
  }

  return { isAddress: false, recipientAddress: smartAccount?.address };
};

type SendProps = {
  ticker: string;
  recipient: string;
};

const Send = ({ ticker: tickerProp = 'WBTC', recipient }: SendProps): JSX.Element => {
  const { i18n } = useLingui();

  const [isScanModalOpen, setScanModalOpen] = useState(false);

  const [ticker, setTicker] = useState(tickerProp);
  const [amount, setAmount] = useState('');
  const [isGroupAmount, setGroupAmount] = useState(false);

  const { getPrice } = usePrices();
  const { getBalance, isPending } = useBalances(CHAIN);

  const { data: tokens } = useTokens(CHAIN);

  const token = tokens.find((token) => token.currency.symbol === ticker)!;
  const paymasterAddress = paymasters?.[CHAIN as ChainId.BOB]?.[token.currency.symbol];

  const kernelClient = useKernelClient(token.currency);

  const { address } = useAccount();

  const currencyAmount = useMemo(
    () => CurrencyAmount.fromBaseAmount(token.currency, amount !== '' && !isNaN(+amount) ? amount : 0),
    [token, amount]
  );

  const isSmartAccount = useIsDynamicSmartAccount();

  const initialValues = useMemo(
    () => ({
      [TRANSFER_TOKEN_AMOUNT]: '',
      [TRANSFER_TOKEN_RECIPIENT]: recipient || '',
      [TRANSFER_TOKEN_TICKER]: ticker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tokenBalance = useMemo(() => token && getBalance(token.raw.address), [getBalance, token]);

  const params: TransferTokenFormValidationParams = {
    [TRANSFER_TOKEN_AMOUNT]: {
      minAmount: token && new Big(1 / 10 ** token.currency.decimals),
      maxAmount: new Big(tokenBalance?.toExact() || 0)
    }
  };

  const paymasterApprovalData = useGetApprovalData(
    currencyAmount.currency.isToken ? (currencyAmount as CurrencyAmount<Token>) : undefined,
    isSmartAccount ? kernelClient?.account?.address : undefined,
    paymasterAddress
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
      const { isAddress: isRecipientAddress, recipientAddress } = await getAddressData(recipient);

      let txid;

      if (currencyAmount.currency.isNative) {
        txid = await sendTransactionAsync({
          to: recipientAddress,
          value: currencyAmount.numerator
        });
      } else {
        txid = await writeTransferErc20Async({
          address: (currencyAmount.currency as Token).address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipientAddress, currencyAmount.numerator]
        });
      }

      // Record the tx in the db so that we can check for intract whether someone has sent to an email.
      // The same data could be used to provide a better tx history to the user, where we can show the
      // destination email address rather than the evm address.
      fetch('/fusion-api/bob-pay-insert-transaction', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverEmail: isRecipientAddress ? '' : recipient, // for now, also submit when transferring to evm address
          sender: address,
          receiver: recipientAddress,
          userOperationHash: txid
        })
      });

      return txid;
    }
  });

  const { isLoading: isWaitingEoaTransferTxConfirmation, data: eoaTransferTransactionReceipt } =
    useWaitForTransactionReceipt({
      hash: eoaTransferTx
    });

  useEffect(() => {
    if (eoaTransferTransactionReceipt?.status === 'success') {
      toast.success(t(i18n)`Successfully sent ${amount} ${token?.currency.symbol}`);

      form.resetForm();
      setAmount('');
      setGroupAmount(false);
      setTicker(tickerProp);
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
        t(
          i18n
        )`Successfully transfered ${variables.currencyAmount.toExact()} ${variables.currencyAmount.currency.symbol}`
      );

      form.resetForm();
      setAmount('');
      setGroupAmount(false);
      setTicker(tickerProp);
    },
    mutationFn: async ({
      recipient,
      currencyAmount
    }: {
      recipient: string;
      currencyAmount: CurrencyAmount<Ether | ERC20Token>;
    }) => {
      if (!paymasterAddress) return;

      const { isAddress: isRecipientAddress, recipientAddress } = await getAddressData(recipient);

      let userOpHash: Address | undefined;

      if (paymasterApprovalData.isApproveRequired) {
        userOpHash = await kernelClient?.sendUserOperation({
          account: kernelClient?.account,
          userOperation: {
            callData: await kernelClient?.account!.encodeCallData([
              {
                to: (currencyAmount.currency as Token).address,
                data: encodeFunctionData({
                  abi: erc20Abi,
                  args: [paymasterAddress, MaxUint256],
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
      } else {
        userOpHash = await kernelClient?.sendUserOperation({
          account: kernelClient?.account,
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

      if (!userOpHash) {
        throw new Error('Failed to submit transaction');
      }

      // Record the tx in the db so that we can check for intract whether someone has sent to an email.
      // The same data could be used to provide a better tx history to the user, where we can show the
      // destination email address rather than the evm address.
      fetch('/fusion-api/bob-pay-insert-transaction', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverEmail: isRecipientAddress ? '' : recipient, // for now, also submit when transferring to evm address
          sender: address,
          receiver: recipientAddress,
          userOperationHash: userOpHash
        })
      });

      return userOpHash;
    }
  });

  useEffect(() => {
    if (smartAccountTransferError) {
      toast.error(t(i18n)`Failed to submit transaction`);
      // eslint-disable-next-line no-console
      console.log(smartAccountTransferError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartAccountTransferError]);

  useEffect(() => {
    if (!isPending && form.values[TRANSFER_TOKEN_AMOUNT]) {
      form.validateField(TRANSFER_TOKEN_AMOUNT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  const tokenInputItems = useMemo(
    () =>
      tokens?.map((token) => {
        const balance = getBalance(token.raw.address);

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
    <Main maxWidth='md' padding='md'>
      <Flex direction='column' elementType='form' gap='md' marginX='md' onSubmit={form.handleSubmit as any}>
        <Input
          endAdornment={
            <Button isIconOnly variant='ghost' onPress={() => setScanModalOpen(true)}>
              <QrCode />
            </Button>
          }
          label={<Trans>Recipient</Trans>}
          placeholder='pay@gobob.xyz'
          size='lg'
          {...form.getFieldProps(TRANSFER_TOKEN_RECIPIENT)}
        />
        <TokenInput
          balance={balance}
          humanBalance={humanBalance}
          items={tokenInputItems}
          label={<Trans>Amount</Trans>}
          type='selectable'
          valueUSD={calculateAmountUSD(currencyAmount, getPrice(token.currency.symbol))}
          onChangeCurrency={(currency) => {
            setTicker(currency.symbol);
            setGroupAmount(false);
          }}
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
          balance={tokenBalance}
          currency={token.currency}
          isSelected={isGroupAmount}
          onSelectionChange={(currencyAmount) => {
            const amountValue = currencyAmount.toSignificant();

            form.setFieldValue(TRANSFER_TOKEN_AMOUNT, amountValue);
            setGroupAmount(true);
            setAmount(amountValue);
            setTimeout(() => form.setFieldTouched(TRANSFER_TOKEN_AMOUNT, true), 0);
            setTimeout(() => form.validateField(TRANSFER_TOKEN_AMOUNT), 0);
          }}
        />
        <Button
          color='primary'
          disabled={isSubmitDisabled}
          loading={isTransferLoading}
          size='xl'
          style={{ marginTop: '.5rem' }}
          type='submit'
        >
          <Trans>Send</Trans>
        </Button>
      </Flex>
      <ScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScan={([scan]) => {
          setScanModalOpen(false);

          if (!scan) return;

          const url = new URL(scan.rawValue);

          form.setFieldValue(TRANSFER_TOKEN_RECIPIENT, url.searchParams.get('to'));
        }}
      />
    </Main>
  );
};

export default withAuth(Send);
