import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const STAKE_AMOUNT = 'stake-amount';
const STAKE_TICKER = 'stake-ticker';
const STAKE_RECIPIENT = 'stake-recipient';
const STAKE_GAS_TOKEN = 'stake-gas-token';

type StakeFormValues = {
  [STAKE_AMOUNT]?: string;
  [STAKE_TICKER]?: string;
  [STAKE_RECIPIENT]?: string;
  [STAKE_GAS_TOKEN]?: string;
};

type StakeFormValidationParams = {
  [STAKE_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
  [STAKE_RECIPIENT]: boolean;
};

const stakeSchema = (params: StakeFormValidationParams) => {
  return yup.object().shape({
    [STAKE_AMOUNT]: yup
      .string()
      .requiredAmount('stake')
      .maxAmount(params[STAKE_AMOUNT], 'stake')
      .minAmount(params[STAKE_AMOUNT], 'stake'),
    [STAKE_TICKER]: yup.string().required(),
    [STAKE_GAS_TOKEN]: yup.string(),
    [STAKE_RECIPIENT]: params[STAKE_RECIPIENT]
      ? yup.string().required('Recipient is a required field').evmAddress()
      : yup.string()
  });
};

export { STAKE_AMOUNT, STAKE_TICKER, STAKE_RECIPIENT, STAKE_GAS_TOKEN, stakeSchema };
export type { StakeFormValidationParams, StakeFormValues };
