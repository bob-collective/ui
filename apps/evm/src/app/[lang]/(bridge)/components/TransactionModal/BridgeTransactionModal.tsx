import {
  ArrowLongRight,
  Button,
  Card,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  Span,
  Spinner
} from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { TransactionDetails } from '../TransactionDetails';

import { BridgeTransaction, InitBridgeTransaction, TransactionDirection } from '@/types';
import { Chain } from '@/components';
import { L1_CHAIN, L2_CHAIN } from '@/constants';

type Props =
  | {
      data: InitBridgeTransaction;
      step: 'approval' | 'confirmation';
    }
  | {
      data: BridgeTransaction;
      step: 'submitted';
    };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type BridgeTransactionModalProps = Props & InheritAttrs;

const BridgeTransactionModal = ({
  data,
  onClose,
  isOpen,
  step,
  ...props
}: BridgeTransactionModalProps): JSX.Element => {
  const { direction, amount, gasEstimate } = data;

  const isSubmitted = step === 'submitted';

  const title =
    step === 'submitted' ? (
      <Trans>Transaction Submitted</Trans>
    ) : step === 'confirmation' ? (
      <Trans>Waiting for confirmation</Trans>
    ) : (
      <Trans>Waiting for approval</Trans>
    );
  const isL1ToL2 = direction === TransactionDirection.L1_TO_L2;

  const duration = direction === TransactionDirection.L1_TO_L2 ? '3 minutes' : '7 days';

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody alignItems='center' gap='lg' padding={isSubmitted ? undefined : 'even'}>
        {!isSubmitted && <Spinner size='42' thickness={4} />}
        <Flex alignItems='center' gap='md'>
          <Chain chainId={isL1ToL2 ? L1_CHAIN : L2_CHAIN} labelProps={{ size: 'xs' }} />
          <ArrowLongRight size='lg' />
          <Chain chainId={isL1ToL2 ? L2_CHAIN : L1_CHAIN} labelProps={{ size: 'xs' }} />
        </Flex>
        <Card background='grey-700' padding='s' rounded='xl'>
          <P size='xs'>
            {amount?.toExact()} {amount?.currency.symbol}
          </P>
        </Card>
        {isSubmitted ? (
          <Flex direction='column' gap='md'>
            <P size='xs'>
              <Trans>Your assets will be delivered shortly, with an estimated arrival time of aprox. </Trans>
              <Span size='xs'>{duration}</Span>
              {isL1ToL2 ? '' : <Trans>, due to the challenge period</Trans>}.{' '}
              <Trans>
                We will provide you with updates accordingly. You can monitor the progress on your bridge page; it will
                be marked as complete once the process has concluded.
              </Trans>
            </P>
          </Flex>
        ) : (
          <Flex alignSelf='normal' direction='column' gap='lg'>
            <P align='center' size='xs' weight='medium'>
              {step === 'confirmation' ? (
                <Trans>Please confirm transaction in your wallet</Trans>
              ) : (
                <Trans>Please confirm allowance approval for {amount.currency.symbol} in your wallet</Trans>
              )}
            </P>
            <TransactionDetails
              amount={amount}
              chainId={L1_CHAIN}
              duration={`~ ${duration}`}
              gasEstimate={gasEstimate}
            />
          </Flex>
        )}
      </ModalBody>
      {isSubmitted && (
        <ModalFooter>
          <Button color='primary' onPress={onClose}>
            <Trans>Close</Trans>
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { BridgeTransactionModal };
