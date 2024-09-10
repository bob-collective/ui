import { Spice } from '@gobob/icons';
import {
  ArrowRight,
  Bars3,
  Button,
  Divider,
  Flex,
  H3,
  Link,
  P,
  SolidDocumentDuplicate,
  Span,
  useLocale
} from '@gobob/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopyToClipboard } from '@uidotdev/usehooks';

import { UserResponse } from '../../../../utils';
import { AppData } from '../../../Apps/hooks';
import { LoginSection } from '../../../../components';
import { RoutesPath } from '../../../../constants';

import { StyledDl, StyledLoginCard, StyledOverlay, StyledUnderlay } from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserAssetsModal } from './UserAssetsModal';
import { UserAppsModal } from './UsedAppsModal';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  completedQuestsCount?: number;
  isAuthenticated?: boolean;
};

const UserInfo = ({ apps, user, completedQuestsCount, isAuthenticated }: UserInfoProps) => {
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [, copy] = useCopyToClipboard();

  const [isUserAssetsModalOpen, setUserAssetsModalOpen] = useState(false);
  const [isUserAppsModalOpen, setUserAppsModalOpen] = useState(false);

  const appsUsedCount = user?.season3Data.harvestedPointsS3.length;

  const spicePerDay = user?.season3Data.oneDayLeaderboardEntry[0].total_points;

  return (
    <div style={{ position: 'relative' }}>
      <StyledDl
        aria-hidden={!isAuthenticated && 'true'}
        direction={{ base: 'column', md: 'row' }}
        gap='lg'
        marginTop='5xl'
      >
        <UserInfoCard description='$172,124.22' title='Assets Deposited'>
          <Flex gap='md' marginTop='xl'>
            <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserAssetsModalOpen(true)}>
              <Bars3 />
            </Button>
            <Button
              fullWidth
              color='primary'
              disabled={!isAuthenticated}
              elementType={Link}
              {...{ href: RoutesPath.BRIDGE }}
            >
              Bridge More
            </Button>
          </Flex>
          <UserAssetsModal isOpen={isUserAssetsModalOpen} onClose={() => setUserAssetsModalOpen(false)} />
        </UserInfoCard>
        <UserInfoCard description={appsUsedCount} title='Apps Used' tooltipLabel='TBD'>
          <Flex gap='md' marginTop='xl'>
            <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserAppsModalOpen(true)}>
              <Bars3 />
            </Button>
            <Button
              fullWidth
              disabled={!isAuthenticated}
              elementType={Link}
              variant='outline'
              {...{ href: RoutesPath.APPS }}
            >
              Use Apps
              <ArrowRight size='xs' strokeWidth='2' style={{ marginLeft: 4 }} />
            </Button>
          </Flex>
          <UserAppsModal apps={apps} isOpen={isUserAppsModalOpen} onClose={() => setUserAppsModalOpen(false)} />
        </UserInfoCard>
        <UserInfoCard description={completedQuestsCount || 0} title='Challenges Solved' tooltipLabel='TBD'>
          <Button
            fullWidth
            disabled={!isAuthenticated}
            variant='outline'
            onPress={() => navigate(RoutesPath.FUSION, { state: { scrollChallenges: true } })}
          >
            Solve Challenges
          </Button>
        </UserInfoCard>
        <UserInfoCard description={user?.referral_code} title='Your Referral Code' tooltipLabel='TBD'>
          <Flex gap='md' marginTop='xl'>
            {/* <Button disabled={!isAuthenticated} variant='outline'>
              <Bars3 />
            </Button> */}
            <Button
              fullWidth
              disabled={!isAuthenticated}
              variant='outline'
              onPress={() => copy(user?.referral_code || '')}
            >
              Copy <SolidDocumentDuplicate size='xs' style={{ marginLeft: 4 }} />
            </Button>
          </Flex>
        </UserInfoCard>
        <UserInfoCard
          description={
            <Flex direction='column' elementType='span' gap='xs'>
              <Span size='inherit'>
                {Intl.NumberFormat(locale, { notation: 'compact' }).format(
                  user?.season3Data.s3LeaderboardData[0].total_points || 0
                )}
              </Span>
              <Flex elementType='span' gap='xs'>
                <Spice size='xs' />
                <Span size='xs'>
                  (+{Intl.NumberFormat(locale, { notation: 'compact' }).format(spicePerDay || 0)}/ Day)
                </Span>
              </Flex>
            </Flex>
          }
          flex={1.3}
          title='Season 3 Harvested Spice'
          tooltipLabel='TBD'
        />
      </StyledDl>
      {!isAuthenticated && (
        <>
          <StyledUnderlay />
          <StyledOverlay alignItems='center' justifyContent='center'>
            <StyledLoginCard shadowed borderColor='grey-300' gap='lg'>
              <H3 align='center' size='md'>
                Log in to View Dashboard
              </H3>
              <Divider />
              <P align='center' color='grey-50' size='s'>
                Set sail on your Season 3 adventure, charting new territories and harvesting Spice along the way.
              </P>
              <Button asChild color='primary' elementType={Link} size='xl' {...{ href: RoutesPath.SIGN_UP }}>
                Start Harvesting Spice
              </Button>
              <LoginSection direction={{ base: 'column', s: 'row' }} />
            </StyledLoginCard>
          </StyledOverlay>
        </>
      )}
    </div>
  );
};

export { UserInfo };
