import { AuthButton } from '@gobob/connect-ui';
import { CurrencyAmount, Token } from '@gobob/currency';
import { useMutation, usePrices } from '@gobob/react-query';
import { useAccount as useSatsAccount, useBalance as useSatsBalance } from '@gobob/sats-wagmi';
import { BITCOIN, NATIVE } from '@gobob/tokens';
import { toast } from '@gobob/ui';
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  TokenInput,
  useForm
} from '@gobob/ui';
import { useSendTransaction, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from '@gobob/wagmi';
import { mergeProps } from '@react-aria/utils';
import Big from 'big.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi } from 'viem';

import { TransactionDetails } from '../../../../components';
import { L2_CHAIN } from '../../../../constants';
import { TokenData, useBalances } from '../../../../hooks';
import { isFormDisabled } from '../../../../lib/form/utils';
import {
  SEND_TOKEN_AMOUNT,
  SEND_TOKEN_GAS_TOKEN,
  SEND_TOKEN_RECIPIENT,
  SendTokenFormValidationParams,
  SendTokenFormValues,
  sendTokenSchema
} from '../../../../lib/form/wallet';

type Props = {
  token: TokenData | 'btc';
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SendTokenModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const SendTokenModal = ({ token, onClose, ...props }: SendTokenModalProps): JSX.Element => {
  const { currency, raw: tokenData } =
    token !== 'btc'
      ? token
      : {
          currency: BITCOIN,
          raw: {
            logoUrl: 'https://github.com/trustwallet/assets/blob/master/blockchains/bitcoin/info/logo.png?raw=true'
          }
        };

  const isBtc = token === 'btc';

  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [gasTicker, setGasTicker] = useState(nativeToken.symbol);

  const { getPrice } = usePrices({ baseUrl: import.meta.env.VITE_MARKET_DATA_API });
  const { getBalance } = useBalances(L2_CHAIN);
  const { data: satsBalance } = useSatsBalance();
  const { connector, address: btcAddress } = useSatsAccount();

  const currencyAmount = useMemo(
    () =>
      !isNaN(amount as any)
        ? CurrencyAmount.fromBaseAmount(currency, amount || 0)
        : CurrencyAmount.fromRawAmount(currency, 0n),
    [currency, amount]
  );

  const initialValues = useMemo(
    () => ({
      [SEND_TOKEN_AMOUNT]: '',
      [SEND_TOKEN_RECIPIENT]: '',
      [SEND_TOKEN_GAS_TOKEN]: gasTicker
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tokenBalance = useMemo(
    () => (isBtc ? CurrencyAmount.fromRawAmount(BITCOIN, satsBalance?.value || 0n) : getBalance(currency.symbol)),
    [isBtc, satsBalance, getBalance, currency.symbol]
  );

  const params: SendTokenFormValidationParams = {
    [SEND_TOKEN_AMOUNT]: {
      minAmount: new Big(1 / 10 ** currencyAmount?.currency.decimals),
      maxAmount: new Big(tokenBalance?.toExact() || 0)
    },
    [SEND_TOKEN_RECIPIENT]: isBtc ? 'btc' : 'evm'
  };

  const handleClose = useCallback(() => {
    onClose?.();
    setAmount('');
    setGasTicker(nativeToken.symbol);
    setRecipient('');
    form.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleSubmit = async (data: SendTokenFormValues) => {
    if (!data[SEND_TOKEN_RECIPIENT]) return;

    if (isBtc) {
      return sendBtc();
    }

    if (currency.isNative) {
      return sendTransaction({
        // gas: sendTransactionGas,
        to: data[SEND_TOKEN_RECIPIENT] as Address,
        value: currencyAmount.numerator
      });
    }

    if (currency.isToken && simulateTransferData) {
      return writeTransferErc20(simulateTransferData.request);
    }
  };

  const form = useForm<SendTokenFormValues>({
    initialValues,
    validationSchema: sendTokenSchema(params),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const isSubmitDisabled = isFormDisabled(form);

  const { mutate: sendBtc, isPending: isSendingBtc } = useMutation({
    mutationKey: ['send-btc', btcAddress],
    mutationFn: async () => connector?.sendToAddress(recipient, Number(currencyAmount.numerator)),
    onSuccess: () => {
      handleClose();
      toast.success(`Successfully sent ${amount} ${currency.symbol}`);
    },
    onError: () => {
      toast.error(`Failed to send ${amount} ${currency.symbol}`);
    }
  });

  // TODO: had gas estimate
  // const { data: sendTransactionGas} = useEstimateGas({
  //   query: {
  //     enabled: !isSubmitDisabled
  //   },
  //   to: form.values[SEND_TOKEN_RECIPIENT] as Address,
  //   value: currencyAmount.numerator
  // });

  const { sendTransaction, data: sendTransactionResult, isPending: isSendingTx } = useSendTransaction();

  const { data: simulateTransferData } = useSimulateContract({
    query: {
      enabled: Boolean(currency.isToken && !isSubmitDisabled)
    },
    address: (currency as Token).address,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [recipient as Address, currencyAmount.numerator]
  });

  const {
    writeContract: writeTransferErc20,
    isPending: isTransferErc20Pending,
    data: transferErc20Result
  } = useWriteContract();

  const { isLoading: isWaitingTxConfirmation, data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: currency.isToken ? transferErc20Result : sendTransactionResult
  });

  useEffect(() => {
    if (transactionReceipt?.status === 'success') {
      handleClose();
      toast.success(`Successfully sent ${amount} ${currency.symbol}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionReceipt]);

  const balance = tokenBalance?.toExact() || '0';

  const getUsdValue = useCallback(
    (ticker: string, amount: string | number) =>
      !isNaN(amount as any) ? new Big(amount || 0).mul(getPrice(ticker) || 0).toNumber() : 0,
    [getPrice]
  );

  const valueUSD = useMemo(() => getUsdValue(currency.symbol, amount), [amount, currency.symbol, getUsdValue]);

  const isSendLoading = isSendingTx || isWaitingTxConfirmation || isSendingBtc || isTransferErc20Pending;

  return (
    <Modal elementType='form' onClose={handleClose} {...mergeProps(props, { onSubmit: form.handleSubmit })} size='lg'>
      <ModalHeader align='start'>Send {currency.symbol}</ModalHeader>
      <ModalBody gap='2xl'>
        <Flex direction='column' gap='md'>
          <Input
            label='Recipient'
            placeholder='Enter Address'
            {...mergeProps(form.getFieldProps(SEND_TOKEN_RECIPIENT), {
              onValueChange: (value: string) => setRecipient(value)
            })}
          />
          <TokenInput
            balance={balance}
            currency={currency}
            label='Amount'
            logoUrl={tokenData.logoUrl}
            valueUSD={valueUSD}
            {...mergeProps(form.getTokenFieldProps(SEND_TOKEN_AMOUNT), {
              onValueChange: (value: string) => setAmount(value)
            })}
          />
        </Flex>
        {!isBtc && (
          <TransactionDetails
            amount={currencyAmount}
            chainId={L2_CHAIN}
            duration='< 1 minute'
            selectProps={form.getSelectFieldProps(SEND_TOKEN_GAS_TOKEN)}
            onChangeGasTicker={(ticker) => setGasTicker(ticker)}
            // gasEstimate={gasEstimateMutation.data}
            // isLoadingGasEstimate={gasEstimateMutation.isLoading}
          />
        )}
      </ModalBody>
      <ModalFooter direction='row' gap='lg'>
        <Button fullWidth size='lg' variant='ghost' onPress={handleClose}>
          Cancel
        </Button>
        <AuthButton
          fullWidth
          chain={L2_CHAIN}
          color='primary'
          disabled={isSubmitDisabled || (currency.isToken && !simulateTransferData)}
          isBtcAuthRequired={isBtc}
          isEvmAuthRequired={!isBtc}
          loading={isSendLoading}
          size='lg'
          type='submit'
        >
          Send
        </AuthButton>
      </ModalFooter>
    </Modal>
  );
};

export { SendTokenModal };
