import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

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
  [TRANSFER_TOKEN_RECIPIENT]?: 'evm' | 'socials';
};

const transferTokenSchema = (params: TransferTokenFormValidationParams) => {
  let recipient = yup.string().required('Recipient is a required field');

  if (params[TRANSFER_TOKEN_RECIPIENT] === 'socials') {
    recipient = recipient as any;
  } else {
    recipient = (recipient as any).evmAddress();
  }

  return yup.object().shape({
    [TRANSFER_TOKEN_RECIPIENT]: recipient,
    [TRANSFER_TOKEN_AMOUNT]: yup
      .string()
      .requiredAmount('transfer')
      .maxAmount(params[TRANSFER_TOKEN_AMOUNT], 'transfer')
      .minAmount(params[TRANSFER_TOKEN_AMOUNT], 'transfer')
  });
};

export { TRANSFER_TOKEN_RECIPIENT, TRANSFER_TOKEN_AMOUNT, transferTokenSchema };
export type { TransferTokenFormValues, TransferTokenFormValidationParams };
