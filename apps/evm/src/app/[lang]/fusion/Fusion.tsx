'use client';

import { Card, Flex, H1, Link, P } from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import superchainEco from '@public/assets/partners/superchain-eco.png';
import { useId, useState } from 'react';
import { useIsClient, useLocalStorage } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { useGetApps } from '../apps/hooks';
import { XBanner } from '../(bridge)/components/BannerCarousel/XBanner';

import {
  CommunityVoting,
  Leaderboard,
  LotterySection,
  OpSuperuserModal,
  Quests,
  Strategies,
  TopUserModal,
  UserInfo,
  WelcomeBackModal,
  WelcomeModal
} from './components';
import {
  StyledBackground,
  StyledBannerContent,
  StyledBannerImg,
  StyledBannerTitle,
  StyledBgDots,
  StyledContent,
  StyledHeroSection,
  StyledHeroSectionWrapper,
  StyledMain,
  StyledStrategiesWrapper
} from './Fusion.style';
import { useDismissOPSuperuserModal, useDismissTopUserModal } from './hooks';

import { Geoblock } from '@/components';
import { LocalStorageKey } from '@/constants';
import { FeatureFlags, useFeatureFlag, useGetUser } from '@/hooks';

const Fusion = () => {
  const { i18n } = useLingui();
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
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
    window.open('https://blog.gobob.xyz/posts/get-optimistic-on-bitcoin', '_blank', 'noreferrer');

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
            <UserInfo apps={apps} isAuthenticated={isAuthenticated} user={user} />
            {isOpSuperuser ? (
              <Flex direction='column' marginTop='lg'>
                <Card
                  isPressable
                  direction='column'
                  justifyContent='center'
                  paddingX='xl'
                  paddingY='6xl'
                  style={{ position: 'relative', maxHeight: '8.5rem' }}
                  onPress={onPressOPBanner}
                >
                  <StyledBannerContent>
                    <Flex direction='column'>
                      <StyledBannerTitle size='2xl' weight='bold'>
                        <Trans>Bringing Bitcoin DeFi to the Superchain</Trans>
                      </StyledBannerTitle>
                      <P color='grey-50'>
                        <Trans>
                          To celebrate BOB joining the Superchain, you have qualified for an OP exclusive 50% bonus on
                          all Spice harvested between 9 December 2024 and 12 January 2025. Learn more &gt;
                        </Trans>
                      </P>
                    </Flex>
                  </StyledBannerContent>
                  <StyledBannerImg
                    alt={t(i18n)`Superchain Eco`}
                    height='134'
                    placeholder='blur'
                    src={superchainEco}
                    width='312'
                  />
                </Card>
              </Flex>
            ) : (
              <XBanner onPress={onPressXBanner} />
            )}
            <LotterySection />
          </StyledHeroSection>
        </StyledHeroSectionWrapper>
        <StyledStrategiesWrapper direction='column' paddingBottom='7xl' paddingTop='6xl' paddingX='lg'>
          <StyledContent direction='column' gap='5xl'>
            <Strategies />
            <Quests id={questsSectionId} />
          </StyledContent>
        </StyledStrategiesWrapper>
        <StyledContent direction='column' paddingBottom='2xl' paddingX='lg'>
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
                isOpen={isFusionWelcomeModalOpen && !isHideFusionWelcomeModal && isAuthenticated}
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
