import {
  Card,
  Flex,
  Funnel,
  List,
  ListItem,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { TransactionItem } from './TransactionItem';
import { StyledTransactionList } from './ProfileActivity.style';

import { chainL2 } from '@/constants';
import { useGetTransactions } from '@/app/[lang]/(bridge)/bridge/hooks';

const ProfileActivity = (): JSX.Element => {
  const { i18n } = useLingui();

  const { data, isInitialLoading, refetch } = useGetTransactions();

  const { address, chain } = useAccount();

  const explorerUrl = useMemo(() => (chain || chainL2).blockExplorers?.default.url, [chain]);

  const txsUrl = address ? `${explorerUrl}/address/${address}` : `${explorerUrl}`;

  // TODO: icon is solid
  return (
    <Flex direction='column'>
      <Popover>
        <PopoverTrigger>
          <Card>
            <Funnel color='grey-50' />
            All Transactions
          </Card>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody gap='md' padding='lg'>
            <List>
              <ListItem>All Transactions</ListItem>
            </List>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <StyledTransactionList direction='column' elementType='ul' flex={1} gap='md' marginTop='md'>
        {isInitialLoading ? (
          Array(8)
            .fill(undefined)
            .map((_, idx) => (
              <Flex key={idx} direction='column' elementType='li' gap='xxs' paddingX='md' paddingY='s'>
                <Flex alignItems='center' gap='lg' paddingX='md' paddingY='s'>
                  <Skeleton height='5xl' rounded='full' width='5xl' />
                  <Flex alignItems='flex-start' direction='column'>
                    <Skeleton height='xl' width='8rem' />
                    <Skeleton height='xl' width='10rem' />
                  </Flex>
                </Flex>
                <Skeleton height='xl' width='8rem' />
              </Flex>
            ))
        ) : (
          <>
            {data?.length ? (
              data.map((data, key) => (
                <TransactionItem
                  key={key}
                  data={data}
                  onProveSuccess={refetch.bridge}
                  onRelaySuccess={refetch.bridge}
                />
              ))
            ) : (
              <Flex alignItems='center' gap='md' justifyContent='center' marginY='8xl'>
                <P align='center' size='s'>
                  <Trans>No operations found</Trans>
                </P>
              </Flex>
            )}
          </>
        )}
      </StyledTransactionList>
    </Flex>
  );
};

export { ProfileActivity };
