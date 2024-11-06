'use client';

import { Card, Flex, P, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { TransactionItem } from './TransactionItem';

import { useGetTransactions } from '@/hooks';

const TransactionList = (): JSX.Element => {
  const { data: transactions, isPending } = useGetTransactions();

  return (
    <Card gap='lg' marginTop='5xl' marginX='xl' rounded='s'>
      {isPending ? (
        <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
          <Spinner size='16' thickness={2} />
          <P align='center' size='xs'>
            <Trans>Loading transactions...</Trans>
          </P>
        </Flex>
      ) : (
        <>
          {transactions?.length ? (
            transactions.map((transaction, idx) => <TransactionItem key={idx} transaction={transaction} />)
          ) : (
            <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
              <P align='center' size='xs'>
                <Trans>No transactions found</Trans>
              </P>
            </Flex>
          )}
        </>
      )}
    </Card>
  );
};

export { TransactionList };
