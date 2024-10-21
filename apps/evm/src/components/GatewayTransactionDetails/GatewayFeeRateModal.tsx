import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  NumberInput,
  P,
  Radio,
  RadioGroup,
  Span,
  useForm
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { FeeRateReturnType } from '@gobob/sats-wagmi';
import { useMemo } from 'react';
import { mergeProps } from '@react-aria/utils';

import { GatewayFeeRate } from '@/types';
import {
  BRIDGE_GATEWAY_FEE_RATE_AMOUNT,
  BRIDGE_GATEWAY_FEE_RATE_PROVIDER,
  BridgeGatewayFeeRateFormValues,
  bridgeGatewayFeeRateSchema
} from '@/lib/form/bridge';

type Props = {
  feeRateData: FeeRateReturnType;
  selectedFeeRate?: GatewayFeeRate;
  onChangeFeeRate?: (feeRate: GatewayFeeRate) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type GatewatFeeRateModalProps = Props & InheritAttrs;

const GatewatFeeRateModal = ({
  onClose,
  isOpen,
  feeRateData,
  selectedFeeRate,
  onChangeFeeRate,
  ...props
}: GatewatFeeRateModalProps): JSX.Element => {
  const handleSubmit = () => {};

  const initialValues: BridgeGatewayFeeRateFormValues = useMemo(
    () => ({
      [BRIDGE_GATEWAY_FEE_RATE_AMOUNT]: '',
      [BRIDGE_GATEWAY_FEE_RATE_PROVIDER]: selectedFeeRate?.provider
    }),
    []
  );

  const form = useForm<BridgeGatewayFeeRateFormValues>({
    initialValues,
    validationSchema: bridgeGatewayFeeRateSchema(),
    onSubmit: handleSubmit,
    hideErrors: 'untouched'
  });

  const { errorMessage, ...amountFormProps } = form.getFieldProps(BRIDGE_GATEWAY_FEE_RATE_AMOUNT);

  return (
    <Modal isOpen={isOpen} size='xs' onClose={onClose} {...props}>
      <ModalHeader align='start'>Select Fee Rate</ModalHeader>
      <ModalBody alignItems='center' gap='lg'>
        <RadioGroup
          value={form.values[BRIDGE_GATEWAY_FEE_RATE_PROVIDER]}
          onValueChange={(value) => form.setFieldValue(BRIDGE_GATEWAY_FEE_RATE_PROVIDER, value, true)}
        >
          <Radio value='esplora'>{feeRateData.esplora[6]} sat/vB (Blockstream)</Radio>
          <Radio value='memPool'>{feeRateData.memPool.hourFee} sat/vB (mempool)</Radio>
          <Flex gap='md'>
            <Radio value='custom' />
            <NumberInput
              aria-label='enter custom fee rate'
              endAdornment={
                <Span color='grey-50' size='s'>
                  sat/vB
                </Span>
              }
              inputMode='decimal'
              maxWidth='10xl'
              size='s'
              {...mergeProps(amountFormProps, {
                onFocus: () => form.setFieldValue(BRIDGE_GATEWAY_FEE_RATE_PROVIDER, 'custom', true)
              })}
            />
          </Flex>
        </RadioGroup>
        {errorMessage && <P>{errorMessage}</P>}
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onPress={handleSubmit}>
          <Trans>Submit</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { GatewatFeeRateModal };
