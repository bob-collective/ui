'use client';

import { Flex, H1, Link, P } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { useEffect, useId, useState } from 'react';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';

import { Geoblock } from '../../components';
import { isClient, LocalStorageKey } from '../../constants';
import { useGetApps } from '../apps/hooks';

import {
  CommunityVoting,
  Leaderboard,
  Quest,
  Strategies,
  UserInfo,
  WelcomeBackModal,
  WelcomeModal
} from './components';
import {
  StyledBackground,
  StyledBgDots,
  StyledContent,
  StyledHeroSection,
  StyledHeroSectionWrapper,
  StyledMain,
  StyledStrategiesWrapper
} from './Fusion.style';
import { useGetQuests } from './hooks';

import { useGetUser } from '@/hooks';
import { SessionStorageKey } from '@/types';

const Fusion = () => {
  const { address } = useAccount();
  const { data: user } = useGetUser();
  const { data: apps } = useGetApps();
  const { data: quests } = useGetQuests();

  const questsSectionId = useId();

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

  useEffect(() => {
    if (scrollQuests) {
      setScrollQuests(false);
      document.getElementById(questsSectionId)?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [questsSectionId, scrollQuests, setScrollQuests]);

  const isAuthenticated = Boolean(user && address);
  const hasPastHarvest = user?.leaderboardRank && user.leaderboardRank.total_points > 0;

  return (
    <Geoblock>
      <StyledMain padding='none'>
        <StyledHeroSectionWrapper direction='column' paddingBottom='9xl' paddingX='lg'>
          <StyledBackground />
          <StyledBgDots alt='Hero dots' height='774' src='/assets/hero-dots.svg' width='1733' />
          <StyledHeroSection direction='column'>
            <Flex direction='column' gap='lg'>
              <H1 size='4xl'>BOB Fusion: The Final Season</H1>
              <P color='grey-50'>
                Harvest Spice by depositing into BOB apps, voting, and solving quests. Keep an eye out for special
                events.{' '}
                <Link
                  color='light'
                  size='inherit'
                  underlined='always'
                  {...{ href: 'https://blog.gobob.xyz/posts/bob-fusion-the-final-season', external: true }}
                >
                  Learn More
                </Link>
              </P>
            </Flex>
            <UserInfo apps={apps} isAuthenticated={isAuthenticated} quests={quests} user={user} />
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
            hasPastHarvest ? (
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
