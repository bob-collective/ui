import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  ModalProps,
  NumberInput,
  Radio,
  RadioGroup,
  Span,
  useForm,
  P,
  Alert,
  Link
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { FeeRateReturnType } from '@gobob/sats-wagmi';
import { mergeProps } from '@react-aria/utils';
import { useDebounceValue } from 'usehooks-ts';

import { GatewayTransactionFee } from '@/types';
import {
  BRIDGE_GATEWAY_FEE_RATE_AMOUNT,
  BRIDGE_GATEWAY_FEE_RATE_PROVIDER,
  BridgeGatewayFeeRateFormValues,
  bridgeGatewayFeeRateSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';

type Props = {
  feeRateData: FeeRateReturnType;
  selectedFee?: GatewayTransactionFee;
  onChangeFee?: (fee: GatewayTransactionFee) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type GatewayFeeSettingsModalProps = Props & InheritAttrs;

// FIX: not able to go back on other fees
const GatewayFeeSettingsModal = ({
  onClose,
  isOpen,
  feeRateData,
  selectedFee,
  onChangeFee,
  ...props
}: GatewayFeeSettingsModalProps): JSX.Element => {
  const handleSubmit = (data: BridgeGatewayFeeRateFormValues) => {
    const { [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: amount, [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: provider } = data;

    if (provider === 'custom') {
      if (!amount) return;

      onChangeFee?.({ networkRate: Number(amount), provider: 'custom' });
    } else {
      onChangeFee?.({ provider: provider as Exclude<GatewayTransactionFee['provider'], 'custom'> });
    }

    onClose?.();
  };

  const initialValues: BridgeGatewayFeeRateFormValues = {
    [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: selectedFee?.provider === 'custom' ? selectedFee.networkRate.toString() : '',
    [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: selectedFee?.provider
  };

  const [debouncedValue, setDebounceValue] = useDebounceValue<string | number | undefined>(
    initialValues[BRIDGE_GATEWAY_FEE_RATE_AMOUNT],
    500
  );

  const form = useForm<BridgeGatewayFeeRateFormValues>({
    initialValues,
    validationSchema: bridgeGatewayFeeRateSchema(),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const isSubmitDisabled = isFormDisabled(form);

  const esploraFeeRecommendation = feeRateData.esplora[6];
  const mempoolFeeRecommendation = feeRateData.memPool.hourFee;

  const shouldConsiderWarning =
    !!form.values[BRIDGE_GATEWAY_FEE_RATE_AMOUNT] &&
    !!debouncedValue &&
    form.values[BRIDGE_GATEWAY_FEE_RATE_PROVIDER] === 'custom';

  const shouldShowLowFeeRateWarning =
    shouldConsiderWarning &&
    Number(debouncedValue) < Math.min(esploraFeeRecommendation, mempoolFeeRecommendation) * 0.8;

  const shouldShowHighFeeRateWarning =
    shouldConsiderWarning &&
    Number(debouncedValue) > Math.max(esploraFeeRecommendation, mempoolFeeRecommendation) * 1.2;

  return (
    <Modal isOpen={isOpen} size='md' onClose={onClose} {...props}>
      <ModalHeader align='start'>Advanced Fee Settings</ModalHeader>
      <ModalBody
        alignItems='center'
        elementType='form'
        gap='2xl'
        padding='even'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...{ onSubmit: form.handleSubmit as any }}
      >
        <Flex alignItems='center' direction='column' gap='lg'>
          <P size='s'>
            <Trans>
              Adjusting the fee rate affects how quickly your Bitcoin transaction is confirmed. Lower fees may lead to
              significant delays in confirmation time.
            </Trans>
          </P>
          <RadioGroup
            label='Fee Rate'
            value={form.values[BRIDGE_GATEWAY_FEE_RATE_PROVIDER]}
            onValueChange={(value) => form.setFieldValue(BRIDGE_GATEWAY_FEE_RATE_PROVIDER, value, true)}
          >
            <Flex gap='xl'>
              <Radio value='esplora'>{Math.ceil(esploraFeeRecommendation)} sat/vB</Radio>
              <Link external icon href='https://blockstream.info/' size='s'>
                Blockstream
              </Link>
            </Flex>
            <Flex gap='xl'>
              <Radio value='memPool'>{Math.ceil(mempoolFeeRecommendation)} sat/vB</Radio>
              <Link external icon href='https://mempool.space/' size='s'>
                mempool.space
              </Link>
            </Flex>
            <Flex>
              <Radio value='custom'>
                <Span hidden>{debouncedValue ? `${debouncedValue} sat/vB` : 'custom fee rate'}</Span>
              </Radio>
              <NumberInput
                aria-label='fee rate'
                endAdornment={
                  <Span color='grey-50' size='s'>
                    sat/vB
                  </Span>
                }
                maxWidth='11xl'
                placeholder='Custom'
                size='s'
                {...mergeProps(form.getFieldProps(BRIDGE_GATEWAY_FEE_RATE_AMOUNT), {
                  onFocus: () => form.setFieldValue(BRIDGE_GATEWAY_FEE_RATE_PROVIDER, 'custom', true),
                  onValueChange: (value: string | number) => setDebounceValue(value)
                })}
              />
            </Flex>
          </RadioGroup>
          {shouldShowLowFeeRateWarning && (
            <Alert status='warning' variant='outlined'>
              <Trans>
                The specified fee rate may delay the confirmation of your transaction, possibly taking longer than 1
                hour to receive your funds. For faster confirmation, consider increasing the fee rate.
              </Trans>
            </Alert>
          )}
          {shouldShowHighFeeRateWarning && (
            <Alert status='warning' variant='outlined'>
              <Trans>
                The specified fee rate is higher than necessary and may result in overpaying. A lower fee rate could
                still confirm your transaction within a reasonable time.
              </Trans>
            </Alert>
          )}
        </Flex>
        <Button fullWidth color='primary' disabled={isSubmitDisabled} size='lg' type='submit'>
          <Trans>Apply</Trans>
        </Button>
      </ModalBody>
    </Modal>
  );
};

export { GatewayFeeSettingsModal };
