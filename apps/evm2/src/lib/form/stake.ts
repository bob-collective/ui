import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const STAKE_AMOUNT = 'stake-amount';
const STAKE_STRATEGY = 'stake-strategy';
const STAKE_RECIPIENT = 'stake-recipient';
const STAKE_BTC_WALLET = 'stake-btc-wallet';

type StakeFormValues = {
  [STAKE_AMOUNT]?: string;
  [STAKE_STRATEGY]?: string;
  [STAKE_RECIPIENT]?: string;
};

type StakeFormValidationParams = {
  [STAKE_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
  [STAKE_RECIPIENT]: boolean;
  [STAKE_BTC_WALLET]: string | undefined;
};

const stakeSchema = (params: StakeFormValidationParams) => {
  return yup.object().shape({
    [STAKE_AMOUNT]: yup
      .string()
      .requiredAmount('stake')
      .btcWalletConnected(params[STAKE_BTC_WALLET])
      .maxAmount(params[STAKE_AMOUNT], 'stake')
      .minAmount(params[STAKE_AMOUNT], 'stake'),
    [STAKE_STRATEGY]: yup.string().required(),
    [STAKE_RECIPIENT]: params[STAKE_RECIPIENT]
      ? yup.string().required('Recipient is a required field').evmAddress()
      : yup.string()
  });
};

export { STAKE_AMOUNT, STAKE_STRATEGY, STAKE_RECIPIENT, STAKE_BTC_WALLET, stakeSchema };
export type { StakeFormValidationParams, StakeFormValues };