import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
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
import { Address } from '@gobob/wagmi';

import { L1_CHAIN, L2_CHAIN } from '../../constants';
import { MessageDirection } from '../../types';
import { getDuration } from '../../utils';
import { Chain } from '../Chain';
import { TransactionDetails } from '../TransactionDetails';

type Props = {
  amount: CurrencyAmount<ERC20Token | Ether>;
  gasEstimate: CurrencyAmount<ERC20Token | Ether>;
  direction: MessageDirection;
  transactionHash?: Address;
  step: 'approval' | 'confirmation' | 'submitted';
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type BridgeTransactionModalProps = Props & InheritAttrs;

const BridgeTransactionModal = ({
  transactionHash,
  direction,
  amount,
  gasEstimate,
  onClose,
  isOpen,
  step,
  ...props
}: BridgeTransactionModalProps): JSX.Element => {
  const isSubmitted = !!transactionHash && step === 'submitted';
  const title =
    step === 'submitted'
      ? 'Transaction Submitted'
      : step === 'confirmation'
        ? 'Waiting for confirmation'
        : 'Waiting for approval';
  const isL1ToL2 = direction === MessageDirection.L1_TO_L2;

  const duration = getDuration(direction);

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
              Your assets will be delivered shortly, with an estimated arrival time of aprox.{' '}
              <Span size='xs'>{duration}</Span>
              {isL1ToL2 ? '' : ', due to the challenge period'}. We will provide you with updates accordingly. You can
              monitor the progress on your bridge page; it will be marked as complete once the process has concluded.
            </P>
          </Flex>
        ) : (
          <Flex alignSelf='normal' direction='column' gap='lg'>
            <P align='center' size='xs' weight='medium'>
              {step === 'confirmation'
                ? 'Please confirm transaction in your wallet'
                : `Please confirm allowance approval for ${amount.currency.symbol} in your wallet`}
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
            Close
          </Button>
        </ModalFooter>
      )}
    </Modal>
  );
};

export { BridgeTransactionModal };
