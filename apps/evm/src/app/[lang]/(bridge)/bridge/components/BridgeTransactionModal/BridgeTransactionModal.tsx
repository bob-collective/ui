import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { Avatar, Flex, Modal, ModalBody, ModalHeader, ModalProps, P, useCurrencyFormatter } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useId } from 'react';

import { useBridge } from '../../hooks';

import { DepositTransactionList } from './DepositTransactionList';
import { WithdrawTransactionList } from './WithdrawTransactionList';

import { ChainAsset } from '@/components';
import { chainL1, chainL2 } from '@/constants';
import { BridgeToken, useGetBridgeTransactions } from '@/hooks';
import { TransactionDirection } from '@/types';
import { calculateAmountUSD } from '@/utils';

type Props = {
  direction: TransactionDirection;
  currencyAmount: CurrencyAmount<Ether | ERC20Token>;
  selectedToken: BridgeToken;
  recipient?: string;
} & ReturnType<typeof useBridge>;

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type BridgeTransactionModalProps = Props & InheritAttrs;

const BridgeTransactionModal = ({
  onClose,
  isOpen,
  direction,
  currencyAmount,
  selectedToken,
  approval,
  approvalGasEstimate,
  deposit,
  withdraw,
  gasEstimate,
  recipient,
  ...props
}: BridgeTransactionModalProps): JSX.Element => {
  const descriptionId = useId();

  const format = useCurrencyFormatter();
  const { getPrice } = usePrices();

  const { data: transactions, refetch: refetchTransactions } = useGetBridgeTransactions();

  const fromChain = direction === TransactionDirection.L1_TO_L2 ? chainL1 : chainL2;
  const toChain = direction === TransactionDirection.L1_TO_L2 ? chainL2 : chainL1;

  const currentTransaction = transactions.find((transaction) => {
    if (direction === TransactionDirection.L1_TO_L2) {
      return deposit.data && transaction.transactionHash === deposit.data.transactionHash;
    }

    return withdraw.data && transaction.transactionHash === withdraw.data.transactionHash;
  });

  const handleClose = () => {
    onClose?.();

    withdraw.reset();
    deposit.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} {...props}>
      <ModalHeader align='start'>
        <Trans>Review bridge</Trans>
      </ModalHeader>
      <ModalBody gap='md' padding='even'>
        <Flex alignItems='center' direction='column' gap='md'>
          <Flex alignItems='center' gap='md'>
            <ChainAsset
              asset={<Avatar alt={currencyAmount.currency.symbol} size='5xl' src={selectedToken.l1Token.logoUrl} />}
              chainId={toChain.id}
              chainProps={{ size: 'xs' }}
            />
            <Flex direction='column' flex={1}>
              <P lineHeight='1.2' rows={1} size='lg' style={{ whiteSpace: 'normal' }} weight='semibold'>
                {currencyAmount.toSignificant(3)} {currencyAmount.currency.symbol}
              </P>
              <P color='grey-50' lineHeight='1.2' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
                {format(calculateAmountUSD(currencyAmount, getPrice(currencyAmount.currency.symbol)))}
              </P>
            </Flex>
          </Flex>
        </Flex>
        <P align='center' id={descriptionId} size='s' style={{ marginTop: '0.75rem' }} weight='bold'>
          <Trans>
            Follow these steps to bridge your {selectedToken.l1Token.symbol} onto {toChain.name}
          </Trans>
        </P>
        {direction === TransactionDirection.L1_TO_L2 ? (
          <DepositTransactionList
            approval={approval}
            approvalGasEstimate={approvalGasEstimate}
            currencyAmount={currencyAmount}
            deposit={deposit}
            descriptionId={descriptionId}
            fromChain={fromChain}
            gasEstimate={gasEstimate}
            recipient={recipient}
            selectedToken={selectedToken}
            toChain={toChain}
            transaction={currentTransaction}
          />
        ) : (
          <WithdrawTransactionList
            approval={approval}
            approvalGasEstimate={approvalGasEstimate}
            currencyAmount={currencyAmount}
            descriptionId={descriptionId}
            fromChain={fromChain}
            gasEstimate={gasEstimate}
            recipient={recipient}
            selectedToken={selectedToken}
            toChain={toChain}
            transaction={currentTransaction}
            withdraw={withdraw}
            onProveSuccess={refetchTransactions}
            onRelaySuccess={refetchTransactions}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

export { BridgeTransactionModal };
