import { Card, Flex, P, Spinner } from '@gobob/ui';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetTransactions } from '../../../../hooks';

import { TransactionItem } from './TransactionItem';

type Props = {};

type TransactionListProps = Props;

const TransactionList = ({}: TransactionListProps): JSX.Element => {
  const { address } = useAccount();
  const { data: transactions, isLoading } = useGetTransactions();
  const [isInitialLoading, setInitialLoading] = useState(isLoading);

  useEffect(() => {
    if (isInitialLoading) {
      setInitialLoading(isLoading);
    }
  }, [isLoading, isInitialLoading]);

  useEffect(() => {
    if (address) {
      setInitialLoading(isLoading);
    }
  }, [address, isLoading]);

  return (
    <Card bordered={false} gap='md' marginTop='5xl' marginX='xl'>
      {isInitialLoading ? (
        <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
          <Spinner size='16' thickness={2} />
          <P align='center' size='xs'>
            Fetching bridging operations...
          </P>
        </Flex>
      ) : (
        <>
          {transactions?.length ? (
            transactions.map((transaction, idx) => <TransactionItem key={idx} transaction={transaction} />)
          ) : (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <P align='center' size='xs'>
                No bridging operations found
              </P>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export { TransactionList };
