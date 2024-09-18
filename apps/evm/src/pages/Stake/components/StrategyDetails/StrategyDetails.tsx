import { Avatar, CardProps, Flex, Link, List, ListItem, P, Spinner } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { useMemo } from 'react';

import { StrategyData } from '../StakeForm/StakeForm';
import { chainL2 } from '../../../../constants';

import { PellNetwork } from './PellNetwork';
import { StyledSection, StyledStrategyDetails } from './StrategyDetails.style';

type TransactionListProps = CardProps & {
  strategy: StrategyData | undefined;
  isLoading?: boolean;
};

const strategyDetails = [
  { id: 'name', name: 'Name' },
  { id: 'lst', name: 'LST' },
  { id: 'apr', name: 'APR' }
] as const;

const StrategyDetails = ({ isLoading = false, strategy, ...props }: TransactionListProps): JSX.Element => {
  const strategyData = useMemo(
    () => ({
      name: (
        <Flex alignItems='center' gap='s'>
          {strategy?.raw.integration.logo ? (
            <Avatar size='2xl' src={strategy?.raw.integration.logo} />
          ) : (
            <PellNetwork />
          )}
          <P size='md'>{strategy?.raw.integration.name}</P>
        </Flex>
      ),
      lst: strategy?.raw.outputToken?.address ? (
        <Link
          external
          href={new URL(
            `/address/${strategy?.raw.outputToken?.address}`,
            chainL2.blockExplorers?.default.url
          ).toString()}
          size='md'
          underlined='always'
        >
          {truncateEthAddress(strategy?.raw.outputToken?.address)}
        </Link>
      ) : undefined,
      apr: '~'
    }),
    [strategy]
  );

  return (
    <StyledSection gap='xl' padding='none' {...props}>
      <StyledStrategyDetails
        direction='column'
        flex={1}
        gap='xl'
        justifyContent={isLoading || !strategy ? 'center' : undefined}
        padding='lg'
      >
        {isLoading || !strategy ? (
          <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
            <Spinner size='16' thickness={2} />
            <P align='center' size='xs'>
              Fetching staking strategies...
            </P>
          </Flex>
        ) : (
          <List aria-label='Strategy details' style={{ minWidth: 200 }}>
            {strategyDetails.map(({ id, name }) => (
              <ListItem key={id} textValue={name}>
                <Flex alignItems='center' justifyContent='space-between' style={{ width: '100%' }}>
                  <P size='md'>{name}</P>
                  <Flex alignItems='center' gap='s'>
                    {strategyData[id]}
                  </Flex>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </StyledStrategyDetails>
    </StyledSection>
  );
};

export { StrategyDetails };
