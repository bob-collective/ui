import { usePrices } from '@gobob/hooks';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  Span,
  Spinner,
  useCurrencyFormatter
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import Avatar from 'boring-avatars';

import { BridgeTransactionDetails } from '../BridgeTransactionDetails';

import { ChainAsset, ChainLogo } from '@/components';
import { chainL1, chainL2 } from '@/constants';
import { BridgeTransaction, InitBridgeTransaction, TransactionDirection } from '@/types';
import { calculateAmountUSD } from '@/utils';

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
  const format = useCurrencyFormatter();
  const { getPrice } = usePrices();

  const { direction, amount, gasEstimate, logoUrl } = data;

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

  const fromChain = data.direction === TransactionDirection.L1_TO_L2 ? chainL1 : chainL2;
  const toChain = data.direction === TransactionDirection.L1_TO_L2 ? chainL2 : chainL1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody alignItems='center' gap='lg' padding={isSubmitted ? undefined : 'even'}>
        {!isSubmitted && <Spinner size='42' thickness={4} />}
        <Flex gap='s' justifyContent='space-between'>
          <P size='s' weight='bold'>
            <Trans>Get on {toChain.name}</Trans>
          </P>
          <Flex alignItems='center'>
            <ChainLogo chainId={fromChain.id} size='xs' />
            <ChainLogo chainId={toChain.id} size='xs' style={{ marginLeft: '-4px' }} />
          </Flex>
        </Flex>
        <Flex alignItems='center' gap='md'>
          <ChainAsset
            asset={<Avatar alt={amount.currency.symbol} size='6xl' src={logoUrl} />}
            chainId={toChain.id}
            chainProps={{ size: 'xs' }}
          />
          <Flex direction='column' flex={1}>
            <P lineHeight='1.2' rows={1} size='lg' style={{ whiteSpace: 'normal' }} weight='semibold'>
              {amount.toSignificant(3)} {amount.currency.symbol}
            </P>
            <P color='grey-50' lineHeight='1.2' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
              {format(calculateAmountUSD(amount, getPrice(amount.currency.symbol)))}
            </P>
          </Flex>
        </Flex>
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
            <BridgeTransactionDetails direction={direction} gasEstimate={gasEstimate} />
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
