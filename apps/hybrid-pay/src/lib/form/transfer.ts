import { isAddress } from 'viem';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateTelegram = (handle: string) => {
  return handle.startsWith('@');
};

const TRANSFER_TOKEN_RECIPIENT = 'transfer-token-recipient';
const TRANSFER_TOKEN_AMOUNT = 'transfer-token-amount';
const TRANSFER_TOKEN_TICKER = 'transfer-token-ticker';

type TransferTokenFormValues = {
  [TRANSFER_TOKEN_RECIPIENT]?: string;
  [TRANSFER_TOKEN_AMOUNT]?: string;
  [TRANSFER_TOKEN_TICKER]?: string;
};

type TransferTokenFormValidationParams = {
  [TRANSFER_TOKEN_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
};

const transferTokenSchema = (params: TransferTokenFormValidationParams) => {
  return yup.object().shape({
    [TRANSFER_TOKEN_RECIPIENT]: yup
      .string()
      .required('Recipient is required field')
      .test(
        'is-emails-or-tg-or-address',
        'Recipient must be an EVM address, Telegram handle starting with a "@", or email address',
        (value) => (value ? !!validateEmail(value) || validateTelegram(value) || isAddress(value) : false)
      ),
    [TRANSFER_TOKEN_AMOUNT]: yup
      .string()
      .requiredAmount('transfer')
      .minAmount(params[TRANSFER_TOKEN_AMOUNT], 'transfer')
      .maxAmount(params[TRANSFER_TOKEN_AMOUNT], 'transfer'),
    [TRANSFER_TOKEN_TICKER]: yup.string()
  });
};

export { TRANSFER_TOKEN_RECIPIENT, TRANSFER_TOKEN_AMOUNT, TRANSFER_TOKEN_TICKER, transferTokenSchema };
export type { TransferTokenFormValues, TransferTokenFormValidationParams };
