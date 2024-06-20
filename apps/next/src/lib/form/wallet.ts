import { bitcoinNetwork } from '../../constants';

import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const SEND_TOKEN_RECIPIENT = 'send-token-recipient';
const SEND_TOKEN_AMOUNT = 'send-token-amount';
const SEND_TOKEN_GAS_TOKEN = 'send-token-gas-token';

type SendTokenFormValues = {
  [SEND_TOKEN_RECIPIENT]?: string;
  [SEND_TOKEN_AMOUNT]?: string;
  [SEND_TOKEN_GAS_TOKEN]?: string;
};

type SendTokenFormValidationParams = {
  [SEND_TOKEN_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
  [SEND_TOKEN_RECIPIENT]: 'evm' | 'btc';
};

const sendTokenSchema = (params: SendTokenFormValidationParams) => {
  let recipient = yup.string().required('Recipient is a required field');

  if (params[SEND_TOKEN_RECIPIENT] === 'btc') {
    recipient = (recipient as any).btcAddress(bitcoinNetwork);
  } else {
    recipient = (recipient as any).evmAddress();
  }

  return yup.object().shape({
    [SEND_TOKEN_RECIPIENT]: recipient,
    [SEND_TOKEN_AMOUNT]: yup
      .string()
      .requiredAmount('send')
      .maxAmount(params[SEND_TOKEN_AMOUNT], 'send')
      .minAmount(params[SEND_TOKEN_AMOUNT], 'send'),
    [SEND_TOKEN_GAS_TOKEN]: yup.string().required()
  });
};

export { SEND_TOKEN_RECIPIENT, SEND_TOKEN_AMOUNT, SEND_TOKEN_GAS_TOKEN, sendTokenSchema };
export type { SendTokenFormValidationParams, SendTokenFormValues };
