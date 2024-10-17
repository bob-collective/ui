import {
  ArrowLongRight,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  Spinner
} from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { Chain, TransactionDetails } from '..';

import { L1_CHAIN, L2_CHAIN } from '@/constants';
import { GatewayData, TransactionType } from '@/types';
import { useGetGatewayTransactions } from '@/hooks';

type Props = GatewayData;

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type GatewayTransactionModalProps = Props & InheritAttrs;

const GatewayTransactionModal = ({
  amount,
  txid,
  fee,
  onClose,
  ...props
}: GatewayTransactionModalProps): JSX.Element => {
  const { data: transactions } = useGetGatewayTransactions();

  const txData = transactions?.find((tx) => tx.type === TransactionType.Gateway && tx.btcTxId === txid);

  const isSubmitted = !!txData;

  const title = isSubmitted ? <Trans>Transaction submitted</Trans> : <Trans>Waiting for confirmation</Trans>;

  return (
    <Modal onClose={onClose} {...props}>
      <ModalHeader align='start'>{title}</ModalHeader>
      <ModalBody alignItems='center' gap='lg' padding='even'>
        {!isSubmitted && <Spinner size='42' thickness={4} />}
        <Flex alignItems='center' gap='md'>
          <Chain chainId='BTC' labelProps={{ size: 'xs' }} />
          <ArrowLongRight size='lg' />
          <Chain chainId={L2_CHAIN} labelProps={{ size: 'xs' }} />
        </Flex>
        {isSubmitted ? (
          <Flex direction='column' gap='md'>
            <P size='xs'>
              <Trans>
                Your assets will be delivered once your BTC transactions receive at least 3 confirmations and the
                processing finishes on our L2 chain. We will provide you with updates accordingly. You can monitor the
                progress on your bridge page. It will be marked as complete once the process has concluded.
              </Trans>
            </P>
          </Flex>
        ) : (
          <Flex alignSelf='normal' direction='column' gap='lg'>
            <P align='center' size='xs' weight='medium'>
              <Trans>Please confirm the transaction in your wallet</Trans>
            </P>
            <TransactionDetails amount={amount} chainId={L1_CHAIN} gasEstimate={fee} />
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

export { GatewayTransactionModal };
