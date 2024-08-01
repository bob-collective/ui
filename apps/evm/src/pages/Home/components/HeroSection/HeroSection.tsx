import { useLocale, useMediaQuery } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Card, Span } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { useGetUser } from '../../../../hooks';
import { AuthCard } from '../../../../components';
import { RoutesPath } from '../../../../constants';

import {
  StyledAuthCardWrapper,
  StyledHeroBackground,
  StyledHeroSection,
  StyledLockedAmount,
  StyledVideo
} from './HeroSection.style';

const HeroSection = (): JSX.Element => {
  const { locale } = useLocale();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const displayTvl = import.meta.env.VITE_DISPLAY_TVL_FEATURE === 'enabled';

  const navigate = useNavigate();

  const { data: user } = useGetUser();

  const { t } = useTranslation();

  const totalTvl = useMemo(
    () => Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(300000000),
    [locale]
  );

  return (
    <StyledHeroSection paddingX='2xl'>
      <StyledHeroBackground>
        <StyledVideo
          autoPlay
          loop
          muted
          playsInline
          aria-label='spice harvesting'
          src='https://static.gobob.xyz/homepage-hero.mp4'
        />
        {!isMobile && displayTvl && (
          <StyledLockedAmount>
            <Span color='grey-50' size='xl'>
              {t('home.hero.season_one_tvl')}:
            </Span>
            <Span fontFamily='eurostar' size='2xl'>
              {totalTvl}
            </Span>
          </StyledLockedAmount>
        )}
      </StyledHeroBackground>
      <StyledAuthCardWrapper
        alignItems={{ base: 'center', md: 'flex-start' }}
        direction='column'
        justifyContent='center'
      >
        <AuthCard user={user} onValidReferralCode={() => navigate(RoutesPath.SIGN_UP)} />
        {isMobile && displayTvl && (
          <Card
            alignItems='center'
            alignSelf='normal'
            background='grey-700'
            bordered={false}
            gap='2xl'
            marginTop='2xl'
            paddingX={{ base: '2xl', s: '2xl', md: '2xl' }}
            paddingY={{ base: '4xl', md: '6xl' }}
            rounded='s'
          >
            <Span color='grey-50' size='xl'>
              {t('home.hero.season_one_tvl')}
            </Span>
            <Span fontFamily='eurostar' size='2xl'>
              {totalTvl}
            </Span>
          </Card>
        )}
      </StyledAuthCardWrapper>
    </StyledHeroSection>
  );
};

export { HeroSection };
