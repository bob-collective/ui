import { Flex, H2, Tabs, TabsItem } from '@gobob/ui';
import { useState } from 'react';

import { AppData, VotingAppData } from '../../hooks';

import { StyledGrid } from './AppsList.style';
import { AppCard } from './AppCard';
import { AppCardSkeleton } from './AppCardSkeleton';

type AppsListProps = {
  apps?: AppData[];
  isLoading?: boolean;
  onVote?: (app: VotingAppData) => void;
  isAuthenticated: boolean;
  isVotingDisabled?: boolean;
  isVotingExceeded?: boolean;
};

const ALL_CATEGORIES = 'all';

const AppsList = ({
  apps,
  isLoading,
  isAuthenticated,
  isVotingDisabled,
  isVotingExceeded,
  onVote
}: AppsListProps): JSX.Element => {
  const [tabCategory, setTabCategory] = useState(ALL_CATEGORIES);

  const categories = apps ? Array.from(new Set(apps.map((app) => app.category))) : undefined;

  const list = apps ? (tabCategory === 'all' ? apps : apps.filter((app) => app.category === tabCategory)) : undefined;

  const sortedList = list?.sort(
    (a, b) => Number(b.points_distributed_per_hour_rank) - Number(a.points_distributed_per_hour_rank)
  );

  return (
    <Flex direction='column' gap='3xl' marginTop='3xl'>
      <H2 size='3xl'>Discover all Apps</H2>
      {!isLoading && categories ? (
        <Tabs variant='light' onSelectionChange={(key) => setTabCategory(key as string)}>
          <TabsItem key='all' title='All Categories'>
            <></>
          </TabsItem>
          {categories.map((category) => (
            <TabsItem key={category} title={category}>
              <></>
            </TabsItem>
          ))}
        </Tabs>
      ) : (
        <Flex style={{ height: '3rem' }} />
      )}
      <StyledGrid>
        {sortedList?.map((app) => (
          <AppCard
            key={app.ref_code}
            categories={app.categories || [app.category]}
            imgSrc={app.logoSrc}
            isVotingDisabled={isVotingDisabled}
            isVotingExceeded={isVotingExceeded}
            name={app.name}
            spiceMultiplier={
              app.min_multiplier === app.max_multiplier
                ? `${app.max_multiplier}x`
                : `${app.min_multiplier}x - ${app.max_multiplier}x`
            }
            spicePerHour={Number(app.points_distributed_per_hour)}
            url={app.project_url}
            userHarvest={isAuthenticated ? Number(app.userHarvest || 0) : undefined}
            voting={app.voting}
            onVote={onVote}
          />
        )) ||
          Array(3)
            .fill(undefined)
            .map((_, idx) => <AppCardSkeleton key={idx} />)}
      </StyledGrid>
    </Flex>
  );
};

export { AppsList };
