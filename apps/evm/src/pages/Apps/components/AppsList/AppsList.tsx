import { Flex, H2, H3, Skeleton, Tabs, TabsItem } from '@gobob/ui';
import { useEffect, useId, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppData, VotingAppData } from '../../hooks';

import { AppCard } from './AppCard';
import { AppCardSkeleton } from './AppCardSkeleton';
import { StyledGrid, StyledSkeletonsWrapper } from './AppsList.style';

type AppsListProps = {
  apps?: AppData[];
  isLoading?: boolean;
  onVote?: (app: VotingAppData) => void;
  isAuthenticated: boolean;
  isVotingDisabled?: boolean;
  isVotingExceeded?: boolean;
};

const ALL_APPS = 'all';

const MY_APPS = 'my-apps';

const AppsList = ({
  apps,
  isLoading,
  isAuthenticated,
  isVotingDisabled,
  isVotingExceeded,
  onVote
}: AppsListProps): JSX.Element => {
  const navigate = useNavigate();

  const headerId = useId();

  const [searchParams] = useSearchParams(new URLSearchParams(window.location.search));

  const [tabCategory, setTabCategory] = useState(searchParams.get('category') || ALL_APPS);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.set('category', tabCategory);
    navigate({ search: searchParams.toString() }, { replace: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabCategory]);

  useEffect(() => {
    if (!searchParams.get('category')) return;

    document.getElementById(headerId)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = apps ? Array.from(new Set(apps.flatMap((app) => app.categories))).sort() : undefined;

  const list = apps
    ? tabCategory === ALL_APPS
      ? apps
      : tabCategory === MY_APPS
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
      <H2 id={headerId} size='3xl'>
        Discover All Apps
      </H2>
      {!isLoading && categories ? (
        <Tabs selectedKey={tabCategory} variant='light' onSelectionChange={(key) => setTabCategory(key as string)}>
          <TabsItem key={ALL_APPS} title='All Apps'>
            <></>
          </TabsItem>
          {isAuthenticated && (
            <TabsItem key={MY_APPS} title='My Apps'>
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
        <StyledSkeletonsWrapper alignItems='center' gap='xl'>
          {Array(7)
            .fill(undefined)
            .map((_, idx) => (
              <Skeleton key={idx} height='4xl' width='10xl' />
            ))}
        </StyledSkeletonsWrapper>
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
                    description={app.description}
                    discord={app.discord_id}
                    imgSrc={app.logoSrc}
                    isVotingDisabled={isVotingDisabled}
                    isVotingExceeded={isVotingExceeded}
                    name={app.name}
                    spiceMultiplier={app.multiplier}
                    spicePerHour={Number(app.points_distributed_per_hour)}
                    twitter={app.twitter_id}
                    userHarvest={isAuthenticated ? Number(app.userHarvest || 0) : undefined}
                    voting={app.voting}
                    onPress={() => window.open(app.project_url, '_blank', 'noreferrer')}
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
