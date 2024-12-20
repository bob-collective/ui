import yup, { MaxAmountValidationParams, MinAmountValidationParams } from './yup.custom';

const BRIDGE_AMOUNT = 'bridge-amount';
const BRIDGE_ASSET = 'bridge-asset';
const BRIDGE_RECIPIENT = 'bridge-recipient';
const BRIDGE_BTC_WALLET = 'bridge-btc-wallet';
const BRIDGE_EVM_WALLET = 'bridge-evm-wallet';

type BridgeFormValues = {
  [BRIDGE_AMOUNT]?: string;
  [BRIDGE_ASSET]?: string;
  [BRIDGE_RECIPIENT]?: string;
};

type BridgeFormValidationParams = {
  [BRIDGE_AMOUNT]: MaxAmountValidationParams & MinAmountValidationParams;
  [BRIDGE_RECIPIENT]: boolean;
  [BRIDGE_BTC_WALLET]: string | undefined | null;
  [BRIDGE_EVM_WALLET]: string | undefined | null;
};

const bridgeSchema = (form: 'bridge' | 'stake', params: BridgeFormValidationParams) => {
  return yup.object().shape({
    [BRIDGE_AMOUNT]: yup
      .string()
      .requiredAmount(form)
      .evmWalletConnected(params[BRIDGE_EVM_WALLET])
      .btcWalletConnected(params[BRIDGE_BTC_WALLET])
      .maxAmount(params[BRIDGE_AMOUNT], form)
      .minAmount(params[BRIDGE_AMOUNT], form),
    [BRIDGE_ASSET]: yup.string().required(),
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

type BridgeGatewayFeeRateFormValidationParams = {
  [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: number;
};

const bridgeGatewayFeeRateSchema = (params: BridgeGatewayFeeRateFormValidationParams) => {
  return yup.object().shape({
    [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: yup.string().required('Fee rate is a required field'),
    [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: yup.number().when([BRIDGE_GATEWAY_FEE_RATE_PROVIDER], {
      is: (provider: string) => {
        return provider === 'custom';
      },
      then: (schema) =>
        schema
          .required('Fee rate is a required field')
          .min(
            params[BRIDGE_GATEWAY_FEE_RATE_AMOUNT],
            `Fee rate must be greater or equal to ${params[BRIDGE_GATEWAY_FEE_RATE_AMOUNT]}`
          )
    })
  });
};

export {
  BRIDGE_AMOUNT,
  BRIDGE_ASSET,
  BRIDGE_RECIPIENT,
  BRIDGE_BTC_WALLET,
  BRIDGE_EVM_WALLET,
  BRIDGE_GATEWAY_FEE_RATE_PROVIDER,
  BRIDGE_GATEWAY_FEE_RATE_AMOUNT,
  bridgeSchema,
  bridgeGatewayFeeRateSchema
};
export type { BridgeFormValidationParams, BridgeGatewayFeeRateFormValues, BridgeFormValues };
