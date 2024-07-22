import { Card, Flex, P, Spinner } from '@gobob/ui';

import { useGetTransactions } from '../../../../hooks';

import { TransactionItem } from './TransactionItem';

type Props = {};

type TransactionListProps = Props;

const TransactionList = ({}: TransactionListProps): JSX.Element => {
  const { data: transactions, isPending } = useGetTransactions();

  return (
    <Card bordered={false} gap='lg' marginTop='5xl' marginX='xl' rounded='s'>
      {isPending ? (
        <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
          <Spinner size='16' thickness={2} />
          <P align='center' size='xs'>
            Loading transactions...
          </P>
        </Flex>
      ) : (
        <>
          {transactions?.length ? (
            transactions.map((transaction, idx) => <TransactionItem key={idx} transaction={transaction} />)
          ) : (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <P align='center' size='xs'>
                No transactions found
              </P>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export { TransactionList };
