import { Avatar, CardProps, Dd, Divider, Dl, DlGroup, Dt, Flex, Link, P, Spinner } from '@gobob/ui';
import { truncateEthAddress } from '@gobob/utils';
import { Fragment, useMemo } from 'react';

import { chainL2 } from '../../../../constants';
import { StrategyData } from '../StakeForm/StakeForm';

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
    <StyledSection padding='2xl' {...props}>
      <StyledStrategyDetails
        direction='column'
        flex={1}
        gap='xl'
        justifyContent={isLoading || !strategy ? 'center' : undefined}
      >
        {isLoading || !strategy ? (
          <Flex alignItems='center' gap='md' justifyContent='center'>
            <Spinner size='16' thickness={2} />
            <P align='center' size='xs'>
              Fetching staking strategies...
            </P>
          </Flex>
        ) : (
          <Dl direction='column'>
            {strategyDetails.map(({ id, name }, index) => (
              <Fragment key={id}>
                {index !== 0 && <Divider />}
                <DlGroup alignItems='center' justifyContent='space-between'>
                  <Dd size='md'>{name}</Dd>
                  <Dt>{strategyData[id] ?? '~'}</Dt>
                </DlGroup>
              </Fragment>
            ))}
          </Dl>
        )}
      </StyledStrategyDetails>
    </StyledSection>
  );
};

export { StrategyDetails };
