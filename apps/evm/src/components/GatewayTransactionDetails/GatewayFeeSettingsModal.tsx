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
  Alert
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { mergeProps } from '@react-aria/utils';
import { useDebounceValue } from 'usehooks-ts';

import { GatewayTransactionFee, GatewayTransactionSpeed, GatewayTransactionSpeedData } from '@/types';
import {
  BRIDGE_GATEWAY_FEE_RATE_AMOUNT,
  BRIDGE_GATEWAY_FEE_RATE_PROVIDER,
  BridgeGatewayFeeRateFormValues,
  bridgeGatewayFeeRateSchema
} from '@/lib/form/bridge';
import { isFormDisabled } from '@/lib/form/utils';
import { isHighFeeRate, isLowFeeRate } from '@/utils/gateway';

type Props = {
  feeRateData: GatewayTransactionSpeedData;
  selectedFee?: GatewayTransactionFee;
  onChangeFee?: (fee: GatewayTransactionFee) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type GatewayFeeSettingsModalProps = Props & InheritAttrs;

const GatewayFeeSettingsModal = ({
  onClose,
  isOpen,
  feeRateData,
  selectedFee,
  onChangeFee,
  ...props
}: GatewayFeeSettingsModalProps): JSX.Element => {
  const handleSubmit = (data: BridgeGatewayFeeRateFormValues) => {
    const { [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: amount, [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: speed } = data;

    if (speed === 'custom') {
      if (!amount) return;

      onChangeFee?.({ networkRate: Number(amount), speed: GatewayTransactionSpeed.CUSTOM });
    } else {
      onChangeFee?.({ speed: speed as Exclude<GatewayTransactionFee['speed'], 'custom'> });
    }

    onClose?.();
  };

  const initialValues: BridgeGatewayFeeRateFormValues = {
    [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: selectedFee?.speed === 'custom' ? selectedFee.networkRate.toString() : '',
    [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: selectedFee?.speed
  };

  const [debouncedValue, setDebounceValue] = useDebounceValue<string | number | undefined>(
    initialValues[BRIDGE_GATEWAY_FEE_RATE_AMOUNT],
    500
  );

  const form = useForm<BridgeGatewayFeeRateFormValues>({
    initialValues,
    validationSchema: bridgeGatewayFeeRateSchema({ [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: feeRateData.minimum }),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const isSubmitDisabled = isFormDisabled(form, false);

  const shouldConsiderWarning =
    !!form.values[BRIDGE_GATEWAY_FEE_RATE_AMOUNT] &&
    !!debouncedValue &&
    form.values[BRIDGE_GATEWAY_FEE_RATE_PROVIDER] === 'custom';

  const shouldShowLowFeeRateWarning = shouldConsiderWarning && isLowFeeRate(Number(debouncedValue), feeRateData);

  const shouldShowHighFeeRateWarning = shouldConsiderWarning && isHighFeeRate(Number(debouncedValue), feeRateData);

  return (
    <Modal isOpen={isOpen} size='md' onClose={onClose} {...props}>
      <ModalHeader align='start'>
        <Trans>Advanced Fee Settings</Trans>
      </ModalHeader>
      <ModalBody
        alignItems='center'
        elementType='form'
        gap='2xl'
        padding='even'
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...{ onSubmit: form.handleSubmit as any }}
      >
        <Flex direction='column' gap='lg'>
          <P size='s'>
            <Trans>
              Adjusting the fee rate affects how quickly your Bitcoin transaction is confirmed. Lower fees may lead to
              significant delays in confirmation time.
            </Trans>
          </P>
          <RadioGroup
            gap='s'
            label='Fee Rate'
            value={form.values[BRIDGE_GATEWAY_FEE_RATE_PROVIDER]}
            onValueChange={(value) => form.setFieldValue(BRIDGE_GATEWAY_FEE_RATE_PROVIDER, value, true)}
          >
            <Radio value={GatewayTransactionSpeed.FASTEST}>
              <Flex direction='column'>
                <Span size='s'>Fastest ({feeRateData.fastest} sat/vB) </Span>
                <Span color='grey-50' size='xs'>
                  <Trans>Estimated within the next block</Trans>
                </Span>
              </Flex>
            </Radio>
            <Radio value={GatewayTransactionSpeed.FAST}>
              <Flex direction='column'>
                <Span size='s'>Fast ({feeRateData.fast} sat/vB) </Span>
                <Span color='grey-50' size='xs'>
                  <Trans>Estimated within 30 minutes</Trans>
                </Span>
              </Flex>
            </Radio>
            <Radio value={GatewayTransactionSpeed.SLOW}>
              <Flex direction='column'>
                <Span size='s'>Slow ({feeRateData.slow} sat/vB) </Span>
                <Span color='grey-50' size='xs'>
                  <Trans>Estimated within 1 hour</Trans>
                </Span>
              </Flex>
            </Radio>
            <Flex>
              <Radio value={GatewayTransactionSpeed.CUSTOM}>
                <Span hidden>{debouncedValue ? `${debouncedValue} sat/vB` : 'Custom'}</Span>
              </Radio>
              <NumberInput
                aria-label='fee rate'
                endAdornment={
                  <Span color='grey-50' size='s'>
                    sat/vB
                  </Span>
                }
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
