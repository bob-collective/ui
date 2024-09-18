import { Avatar, CardProps, Flex, Link, P, RowProps, Spinner, Table } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { useMemo } from 'react';

import { chainL2 } from '../../../../constants';
import { StrategyData } from '../StakeForm/StakeForm';

import { StyledSection, StyledStrategiesList } from './StrategiesList.style';
import { PellNetwork } from './PellNetwork';

type TransactionListProps = CardProps & {
  strategies: StrategyData[];
  isLoading?: boolean;
};

const strategiesColumns = [
  { id: 'name', name: <P size='md'>Name</P> },
  { id: 'lst', name: <P size='md'>LST</P> },
  { id: 'apr', name: <P size='md'>APR</P> }
];

const StrategiesList = ({ isLoading = false, strategies, ...props }: TransactionListProps): JSX.Element => {
  const strategiesRows = useMemo<RowProps[]>(() => {
    return strategies.map((strategy) => ({
      id: strategy.raw.id,
      name: (
        <Flex alignItems='center' gap='s'>
          {strategy.raw.integration.logo ? <Avatar size='2xl' src={strategy.raw.integration.logo} /> : <PellNetwork />}
          <P size='md'>{strategy.raw.integration.name}</P>
        </Flex>
      ),
      lst: strategy.raw.outputToken?.address ? (
        <Link
          external
          href={new URL(
            `/address/${strategy.raw.outputToken?.address}`,
            chainL2.blockExplorers?.default.url
          ).toString()}
          size='md'
          underlined='always'
        >
          {truncateEthAddress(strategy.raw.outputToken?.address)}
        </Link>
      ) : undefined,
      apr: '~'
    }));
  }, [strategies]);

  return (
    <StyledSection gap='xl' padding='none' {...props}>
      <StyledStrategiesList
        direction='column'
        flex={1}
        gap='xl'
        justifyContent={isLoading || !strategies?.length ? 'center' : undefined}
      >
        {isLoading ? (
          <Flex alignItems='center' gap='md' justifyContent='center' style={{ height: '100%' }}>
            <Spinner size='16' thickness={2} />
            <P align='center' size='xs'>
              Fetching staking strategies...
            </P>
          </Flex>
        ) : (
          <Table columns={strategiesColumns} rows={strategiesRows} />
        )}
      </StyledStrategiesList>
    </StyledSection>
  );
};

export { StrategiesList };
