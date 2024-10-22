import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const BRIDGE_AMOUNT = 'bridge-amount';
const BRIDGE_TICKER = 'bridge-ticker';
const BRIDGE_RECIPIENT = 'bridge-recipient';
const BRIDGE_GAS_TOKEN = 'bridge-gas-token';
const BRIDGE_BTC_WALLET = 'bridge-btc-wallet';

type BridgeFormValues = {
  [BRIDGE_AMOUNT]?: string;
  [BRIDGE_TICKER]?: string;
  [BRIDGE_RECIPIENT]?: string;
  [BRIDGE_GAS_TOKEN]?: string;
};

type BridgeFormValidationParams = {
  [BRIDGE_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
  [BRIDGE_RECIPIENT]: boolean;
  [BRIDGE_BTC_WALLET]: string | undefined | null;
};

const bridgeSchema = (params: BridgeFormValidationParams) => {
  return yup.object().shape({
    [BRIDGE_AMOUNT]: yup
      .string()
      .requiredAmount('bridge')
      .btcWalletConnected(params[BRIDGE_BTC_WALLET])
      .maxAmount(params[BRIDGE_AMOUNT], 'bridge')
      .minAmount(params[BRIDGE_AMOUNT], 'bridge'),
    [BRIDGE_TICKER]: yup.string().required(),
    [BRIDGE_GAS_TOKEN]: yup.string(),
    [BRIDGE_RECIPIENT]: params[BRIDGE_RECIPIENT]
      ? yup.string().required('Recipient is a required field').evmAddress()
      : yup.string()
  });
};

const BRIDGE_GATEWAY_FEE_RATE_PROVIDER = 'bridge-gateway-fee-rate-provider';
const BRIDGE_GATEWAY_FEE_RATE_AMOUNT = 'bridge-gateway-fee-rate-amount';

type BridgeGatewayFeeRateFormValues = {
  [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]?: string;
  [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]?: string;
};

const bridgeGatewayFeeRateSchema = () => {
  return yup.object().shape({
    [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: yup.string().required('Fee rate is a required field'),
    [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: yup.number().when([BRIDGE_GATEWAY_FEE_RATE_PROVIDER], {
      is: (provider: string) => {
        return provider === 'custom';
      },
      then: (schema) => schema.required('Fee rate is a required field').min(1, 'Fee rate must be greater than 0')
    })
  });
};

export {
  BRIDGE_AMOUNT,
  BRIDGE_GAS_TOKEN,
  BRIDGE_TICKER,
  BRIDGE_RECIPIENT,
  BRIDGE_BTC_WALLET,
  BRIDGE_GATEWAY_FEE_RATE_PROVIDER,
  BRIDGE_GATEWAY_FEE_RATE_AMOUNT,
  bridgeSchema,
  bridgeGatewayFeeRateSchema
};
export type { BridgeFormValidationParams, BridgeGatewayFeeRateFormValues, BridgeFormValues };
