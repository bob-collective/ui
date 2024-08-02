import { Flex, Tabs, TabsItem } from '@gobob/ui';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Key, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import { Geoblock, Main } from '../../components';
import { LocalStorageKey } from '../../constants';

import { AllUsersLeaderboard, Dashboard, Info, PartnersAndChallenges, QuestUsersLeaderboard } from './components';
import { StyledUpdateMark } from './Fusion.style';

const Fusion = () => {
  const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams('tab=dashboard'));

  const location = useLocation();

  const selectedTabKey = searchParams.get('tab') || undefined;

  const [isInfoTabMarkHidden, setInfoTabMarkHidden] = useLocalStorage(
    LocalStorageKey.HIDE_INFO_TAB_UNVISITED_MARK,
    selectedTabKey === 'info'
  );

  useEffect(() => {
    if (location.state?.scrollEcosystem && selectedTabKey === 'dashboard') {
      document.getElementById('ecosystem')?.scrollIntoView?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectionChange = useCallback(
    (key: Key) => {
      if (key === 'info' && !isInfoTabMarkHidden) {
        setInfoTabMarkHidden(true);
      }

      setSearchParams(() => {
        const newParams = new URLSearchParams();

        newParams.set('tab', key as string);

        return newParams;
      });
    },
    [isInfoTabMarkHidden, setInfoTabMarkHidden, setSearchParams]
  );

  return (
    <Geoblock>
      <Main hasBackgroundImg maxWidth='4xl'>
        <Tabs selectedKey={selectedTabKey} onSelectionChange={handleSelectionChange}>
          <TabsItem key='dashboard' title='Dashboard'>
            <Flex direction='column' gap='2xl'>
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
      </Main>
    </Geoblock>
  );
};

export { Fusion };
