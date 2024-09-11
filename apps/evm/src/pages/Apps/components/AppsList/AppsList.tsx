import { Flex, H2, H3, Tabs, TabsItem } from '@gobob/ui';
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

const MY_HARVESTERS = 'my-harvesters';

const AppsList = ({
  apps,
  isLoading,
  isAuthenticated,
  isVotingDisabled,
  isVotingExceeded,
  onVote
}: AppsListProps): JSX.Element => {
  const [tabCategory, setTabCategory] = useState(ALL_CATEGORIES);

  const categories = apps ? Array.from(new Set(apps.flatMap((app) => app.categories))).sort() : undefined;

  const list = apps
    ? tabCategory === ALL_CATEGORIES
      ? apps
      : tabCategory === MY_HARVESTERS
        ? apps.filter((app) => app.userHarvest)
        : apps.filter((app) => app.categories.includes(tabCategory))
    : undefined;

  const sortedList = list?.sort((a, b) => {
    if (!isAuthenticated || Number(b.userHarvest || 0) === Number(a.userHarvest || 0)) {
      return Number(b.points_distributed_per_hour_rank || 0) - Number(a.points_distributed_per_hour_rank || 0); // If 'a' values are equal, sort by 'b'
    } else {
      return Number(b.userHarvest) - Number(b.userHarvest);
    }
  });

  const hasItems = !!sortedList?.length;

  return (
    <Flex direction='column' gap='3xl' marginTop='3xl'>
      <H2 size='3xl'>Discover all Apps</H2>
      {!isLoading && categories ? (
        <Tabs variant='light' onSelectionChange={(key) => setTabCategory(key as string)}>
          <TabsItem key={ALL_CATEGORIES} title='All Categories'>
            <></>
          </TabsItem>
          {isAuthenticated && (
            <TabsItem key={MY_HARVESTERS} title='My Harvesters'>
              <></>
            </TabsItem>
          )}
          {categories.map((category) => (
            <TabsItem key={category} title={category}>
              <></>
            </TabsItem>
          ))}
        </Tabs>
      ) : (
        <Flex style={{ height: '3rem' }} />
      )}
      {hasItems || isLoading ? (
        <StyledGrid>
          {isLoading
            ? Array(3)
                .fill(undefined)
                .map((_, idx) => <AppCardSkeleton key={idx} />)
            : hasItems
              ? sortedList?.map((app) => (
                  <AppCard
                    key={app.ref_code}
                    categories={app.categories}
                    discord={app.discord_id}
                    imgSrc={app.logoSrc}
                    isVotingDisabled={isVotingDisabled}
                    isVotingExceeded={isVotingExceeded}
                    name={app.name}
                    spiceMultiplier={app.multiplier}
                    spicePerHour={Number(app.points_distributed_per_hour)}
                    twitter={app.twitter_id}
                    url={app.project_url}
                    userHarvest={isAuthenticated ? Number(app.userHarvest || 0) : undefined}
                    voting={app.voting}
                    onVote={onVote}
                  />
                ))
              : null}
        </StyledGrid>
      ) : (
        <Flex justifyContent='center' paddingY='11xl'>
          <H3 size='xl'>There are no apps to be displayed</H3>
        </Flex>
      )}
    </Flex>
  );
};

export { AppsList };
