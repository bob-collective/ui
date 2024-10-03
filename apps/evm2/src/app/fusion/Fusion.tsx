'use client';

import { Flex, Tabs, TabsItem } from '@gobob/ui';
import { useLocalStorage, useSessionStorage } from '@uidotdev/usehooks';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Key, useCallback, useEffect } from 'react';

import { StyledUpdateMark } from './Fusion.style';
import { AllUsersLeaderboard, Dashboard, Info, PartnersAndChallenges, QuestUsersLeaderboard } from './components';

import { BannerCarousel, Geoblock, Main } from '@/components';
import { LocalStorageKey } from '@/constants';
import { SessionStorageKey } from '@/types/session-storage';

const Fusion = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const pathname = usePathname();

  const selectedTabKey = searchParams?.get('tab') || undefined;

  const [isInfoTabMarkHidden, setInfoTabMarkHidden] = useLocalStorage(
    LocalStorageKey.HIDE_INFO_TAB_UNVISITED_MARK,
    selectedTabKey === 'info'
  );
  const [scrollEcosystem, setScrollEcosystem] = useSessionStorage(SessionStorageKey.SCROLL_ECOSYSTEM, false);

  useEffect(() => {
    if (scrollEcosystem && selectedTabKey === 'dashboard') {
      setScrollEcosystem(false);
      document.getElementById('ecosystem')?.scrollIntoView?.();
    }
  }, [scrollEcosystem, selectedTabKey, setScrollEcosystem]);

  const handleSelectionChange = useCallback(
    (key: Key) => {
      if (key === 'info' && !isInfoTabMarkHidden) {
        setInfoTabMarkHidden(true);
      }

      if (pathname) {
        const url = new URL(pathname, window.location.origin);

        url.searchParams.set('tab', key as string);
        router.push(url.toString());
      }
    },
    [isInfoTabMarkHidden, pathname, router, setInfoTabMarkHidden]
  );

  return (
    <Geoblock>
      <Main maxWidth='4xl'>
        <Flex direction='column' gap='lg'>
          <BannerCarousel />
          <Tabs selectedKey={selectedTabKey} onSelectionChange={handleSelectionChange}>
            <TabsItem key='dashboard' title='Dashboard'>
              <Flex direction='column'>
                <Dashboard />
                <PartnersAndChallenges />
              </Flex>
            </TabsItem>
            <TabsItem key='leaderboard' title='Leaderboard'>
              <AllUsersLeaderboard />
            </TabsItem>
            <TabsItem key='quest-leaderboard' title='Quest Leaderboard'>
              <QuestUsersLeaderboard />
            </TabsItem>
            <TabsItem
              key='info'
              title={
                <>
                  Info
                  {!isInfoTabMarkHidden && <StyledUpdateMark />}
                </>
              }
            >
              <Info />
            </TabsItem>
          </Tabs>
        </Flex>
      </Main>
    </Geoblock>
  );
};

export { Fusion };
