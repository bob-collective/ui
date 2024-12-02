'use client';

import { Card, Flex, H1, H2, Link, P } from '@gobob/ui';
import { useIsClient, useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import x from '@public/assets/x.png';
import { useCallback, useEffect, useId, useState } from 'react';
import { useAccount } from 'wagmi';

import { useGetApps } from '../apps/hooks';

import {
  CommunityVoting,
  Leaderboard,
  LotterySection,
  OpSuperuserModal,
  Quest,
  Strategies,
  UserInfo,
  WelcomeBackModal,
  WelcomeModal
} from './components';
import {
  StyledBackground,
  StyledBannerImg,
  StyledBgDots,
  StyledContent,
  StyledHeroSection,
  StyledHeroSectionWrapper,
  StyledMain,
  StyledStrategiesWrapper
} from './Fusion.style';
import { useDismissTopUserModal, useGetQuests } from './hooks';
import { TopUserModal } from './components/TopUserModal';

import { Geoblock } from '@/components';
import { LocalStorageKey } from '@/constants';
import { useGetUser } from '@/hooks';
import { SessionStorageKey } from '@/types';

const Fusion = () => {
  const { i18n } = useLingui();
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();
  const { mutate: dismissTopUserModal } = useDismissTopUserModal();
  const isClient = useIsClient();

  const questsSectionId = useId();

  const [showTopUserModal, setShowTopUserModal] = useLocalStorage(LocalStorageKey.SHOW_TOP_USER_MODAL, true, {
    initializeWithValue: isClient
  });

  const onCloseModal = (shouldDismissTopUserModal: boolean) => {
    setShowTopUserModal(false);
    if (shouldDismissTopUserModal) dismissTopUserModal();
  };

  const [scrollQuests, setScrollQuests] = useSessionStorage(SessionStorageKey.SCROLL_QUESTS, false, {
    initializeWithValue: isClient
  });

  const [isHideFusionWelcomeBackModal, setHideFusionWelcomeBackModal] = useLocalStorage<boolean>(
    LocalStorageKey.HIDE_FUSION_WELCOME_BACK_MODAL,
    false,
    { initializeWithValue: isClient }
  );

  const [isHideFusionWelcomeModal, setHideFusionWelcomeModal] = useLocalStorage<boolean>(
    LocalStorageKey.HIDE_FUSION_WELCOME_MODAL,
    false,
    { initializeWithValue: isClient }
  );

  const [isFusionWelcomeModalOpen, setFusionWelcomeModalOpen] = useState(!isHideFusionWelcomeModal);

  const onPressBanner = useCallback(
    () => window.open('https://x.com/build_on_bob', '_blank', 'noreferrer'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (scrollQuests) {
      setScrollQuests(false);
      document.getElementById(questsSectionId)?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [questsSectionId, scrollQuests, setScrollQuests]);

  const isAuthenticated = Boolean(user && address);
  const hasPastHarvest = user?.leaderboardRank && user.leaderboardRank.total_points > 0;
  const shouldDisplayTopUserModal = user?.notices.showIsFusionTopUser && showTopUserModal;

  return (
    <Geoblock>
      <StyledMain padding='none'>
        <StyledHeroSectionWrapper direction='column' paddingBottom='9xl' paddingX='lg'>
          <StyledBackground />
          <StyledBgDots alt={t(i18n)`Hero dots`} height='774' src='/assets/hero-dots.svg' width='1733' />
          <StyledHeroSection direction='column'>
            <Flex direction='column' gap='lg'>
              <H1 size='4xl'>
                <Trans>BOB Fusion: The Final Season</Trans>
              </H1>
              <P color='grey-50'>
                <Trans>
                  Harvest Spice by depositing into BOB apps, voting, and solving quests. Keep an eye out for special
                  events.
                </Trans>{' '}
                <Link
                  color='light'
                  size='inherit'
                  underlined='always'
                  {...{ href: 'https://blog.gobob.xyz/posts/bob-fusion-the-final-season', external: true }}
                >
                  <Trans>Learn More</Trans>
                </Link>
              </P>
            </Flex>
            <UserInfo apps={apps} isAuthenticated={isAuthenticated} quests={quests} user={user} />
            <Flex direction='column' marginTop='lg'>
              <Card
                isPressable
                justifyContent='center'
                paddingX='xl'
                paddingY='6xl'
                style={{ position: 'relative', maxHeight: '8.5rem' }}
                onPress={onPressBanner}
              >
                <H2 size='2xl' weight='bold'>
                  <Trans>Follow us on X</Trans>
                </H2>
                <P color='grey-50'>
                  <Trans>To stay up-to date with the BOB ecosystem follow @build_on_bob.</Trans>
                </P>
                <StyledBannerImg alt='x' height='123' placeholder='blur' src={x} width='336' />
              </Card>
            </Flex>
            <LotterySection />
          </StyledHeroSection>
        </StyledHeroSectionWrapper>
        <StyledStrategiesWrapper direction='column' paddingBottom='7xl' paddingTop='6xl' paddingX='lg'>
          <StyledContent>
            <Strategies />
          </StyledContent>
        </StyledStrategiesWrapper>
        <StyledContent direction='column' paddingBottom='2xl' paddingX='lg'>
          <Quest id={questsSectionId} quests={quests} />
          <CommunityVoting />
          <Leaderboard />
          {user ? (
            shouldDisplayTopUserModal ? (
              <TopUserModal isOpen={shouldDisplayTopUserModal} onClose={onCloseModal} />
            ) : hasPastHarvest ? (
              <WelcomeBackModal
                isOpen={!isHideFusionWelcomeBackModal && isAuthenticated}
                user={user}
                onClose={() => setHideFusionWelcomeBackModal(true)}
              />
            ) : (
              <WelcomeModal
                isOpen={isFusionWelcomeModalOpen && isAuthenticated}
                user={user}
                onClose={(hideAlways) => {
                  if (hideAlways) {
                    setHideFusionWelcomeModal(true);
                  }

                  setFusionWelcomeModalOpen(false);
                }}
              />
            )
          ) : null}
        </StyledContent>
      </StyledMain>
      <OpSuperuserModal />
    </Geoblock>
  );
};

export { Fusion };
