'use client';

import { Card, Flex, H1, H2, Link, P } from '@gobob/ui';
import { useIsClient, useLocalStorage, useSessionStorage } from 'usehooks-ts';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import x from '@public/assets/x.png';
import { useEffect, useId, useState } from 'react';
import { useAccount } from 'wagmi';
import { Superchain } from '@gobob/icons';

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
  WelcomeModal,
  TopUserModal
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
import { useDismissOPSuperuserModal, useDismissTopUserModal, useGetQuests } from './hooks';

import { Geoblock } from '@/components';
import { LocalStorageKey } from '@/constants';
import { FeatureFlags, useFeatureFlag, useGetUser } from '@/hooks';
import { SessionStorageKey } from '@/types';

const Fusion = () => {
  const { i18n } = useLingui();
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();
  const { mutate: dismissTopUserModal } = useDismissTopUserModal();
  const { mutate: dismissOPSuperuserModal } = useDismissOPSuperuserModal();
  const isClient = useIsClient();
  const isTop100SpiceUsersEnabled = useFeatureFlag(FeatureFlags.TOP_100_SPICE_USERS);
  const isOPSuperusersEnabled = useFeatureFlag(FeatureFlags.OP_SUPERUSER);

  const questsSectionId = useId();

  const [showTopUserModal, setShowTopUserModal] = useLocalStorage(LocalStorageKey.SHOW_TOP_USER_MODAL, true, {
    initializeWithValue: isClient
  });

  const [showOPSuperuserModal, setShowOPSuperuserModal] = useLocalStorage(
    LocalStorageKey.SHOW_OP_SUPERUSER_MODAL,
    true,
    { initializeWithValue: isClient }
  );

  const onCloseTopUserModal = (shouldDismissTopUserModal: boolean) => {
    setShowTopUserModal(false);
    if (shouldDismissTopUserModal) dismissTopUserModal();
  };

  const onCloseOPUserModal = (shouldDismissOPSuperuserModal: boolean) => {
    setShowOPSuperuserModal(false);
    if (shouldDismissOPSuperuserModal) dismissOPSuperuserModal();
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

  const onPressXBanner = () => window.open('https://x.com/build_on_bob', '_blank', 'noreferrer');
  const onPressOPBanner = () =>
    window.open(
      'https://blog.gobob.xyz/posts/bob-hybrid-l2-joins-superchain-to-accelerate-bitcoin-defi',
      '_blank',
      'noreferrer'
    );

  useEffect(() => {
    if (scrollQuests) {
      setScrollQuests(false);
      document.getElementById(questsSectionId)?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [questsSectionId, scrollQuests, setScrollQuests]);

  const isAuthenticated = Boolean(user && address);
  const hasPastHarvest = user?.leaderboardRank && user.leaderboardRank.total_points > 0;
  const shouldDisplayOPSuperuserModal = isOPSuperusersEnabled && showOPSuperuserModal && user?.notices.showIsOpUser;
  const shouldDisplayTopUserModal = isTop100SpiceUsersEnabled && showTopUserModal && user?.notices.showIsFusionTopUser;
  const isOpSuperuser = isOPSuperusersEnabled && user?.notices.isOpUser;
  const isFusionTopUser = isTop100SpiceUsersEnabled && user?.is_fusion_top_user;

  return (
    <Geoblock>
      <StyledMain padding='none'>
        <StyledHeroSectionWrapper direction='column' paddingBottom='9xl' paddingX='lg'>
          <StyledBackground />
          <StyledBgDots alt={t(i18n)`Hero dots`} height='774' src='/assets/hero-dots.svg' width='1733' />
          <StyledHeroSection direction='column'>
            <Flex direction='column' gap='lg'>
              <H1 size='4xl'>
                {isFusionTopUser ? (
                  <Trans>You are one of the top 100 Spice holders in BOB Fusion</Trans>
                ) : (
                  <Trans>BOB Fusion: The Final Season</Trans>
                )}
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
            {isOpSuperuser ? (
              <Flex direction='column' marginTop='lg'>
                <Card
                  isPressable
                  justifyContent='center'
                  paddingX='xl'
                  paddingY='6xl'
                  style={{ position: 'relative', maxHeight: '8.5rem' }}
                  onPress={onPressOPBanner}
                >
                  <Flex alignItems='center' justifyContent='center'>
                    <Flex direction='column'>
                      <H2 size='2xl' weight='bold'>
                        <Trans>Bringing Bitcoin DeFi to the Superchain</Trans>
                      </H2>
                      <P color='grey-50'>
                        <Trans>
                          To celebrate BOB joining the Superchain, you have qualified for an OP exclusive 50% bonus on
                          all Spice harvested between 9 December 2024 and 12 January 2025.{' '}
                          <Link href='https://blog.gobob.xyz/posts/bob-hybrid-l2-joins-superchain-to-accelerate-bitcoin-defi'>
                            Learn more
                          </Link>
                        </Trans>
                      </P>
                    </Flex>
                    <Superchain
                      size='4xl'
                      style={{
                        width: '10rem',
                        top: 0,
                        right: 0
                      }}
                    />
                  </Flex>
                </Card>
              </Flex>
            ) : (
              <Flex direction='column' marginTop='lg'>
                <Card
                  isPressable
                  justifyContent='center'
                  paddingX='xl'
                  paddingY='6xl'
                  style={{ position: 'relative', maxHeight: '8.5rem' }}
                  onPress={onPressXBanner}
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
            )}
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
            shouldDisplayOPSuperuserModal ? (
              <OpSuperuserModal isOpen={shouldDisplayOPSuperuserModal} onClose={onCloseOPUserModal} />
            ) : shouldDisplayTopUserModal ? (
              <TopUserModal isOpen={shouldDisplayTopUserModal} onClose={onCloseTopUserModal} />
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
    </Geoblock>
  );
};

export { Fusion };
