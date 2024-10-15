import { INTERVAL, useQuery } from '@gobob/react-query';
import {
  Bars3,
  Button,
  Dd,
  Divider,
  DlGroup,
  Dt,
  Flex,
  H3,
  Link,
  P,
  Skeleton,
  SolidInformationCircle,
  Span,
  Tooltip
} from '@gobob/ui';
import { useCopyToClipboard, useSessionStorage } from 'usehooks-ts';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Barometer } from './Barometer';
import { MultipliersModal } from './MultipliersModal';
import { UserAppsModal } from './UsedAppsModal';
import {
  StyledArrowRight,
  StyledDl,
  StyledLoginCard,
  StyledMainInfo,
  StyledMeterCard,
  StyledOverlay,
  StyledSolidDocumentDuplicate,
  StyledUnderlay,
  StyledUserInfoWrapper
} from './UserInfo.style';
import { UserInfoCard } from './UserInfoCard';
import { UserReferralModal } from './UserReferralModal';

import { LoginSection, SignUpButton, SpiceAmount } from '@/components';
import { isClient, RoutesPath } from '@/constants';
import { fusionKeys } from '@/lib/react-query';
import { apiClient, QuestS3Response, UserResponse } from '@/utils';
import { SessionStorageKey } from '@/types';
import { AppData } from '@/app/[lang]/apps/hooks';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  quests: QuestS3Response | undefined;
  isAuthenticated?: boolean;
};

const UserInfo = ({ apps, user, quests, isAuthenticated }: UserInfoProps) => {
  const router = useRouter();
  const params = useParams();
  const { i18n } = useLingui();
  const [, setScrollQuests] = useSessionStorage(SessionStorageKey.SCROLL_QUESTS, false, {
    initializeWithValue: isClient
  });
  const [, copy] = useCopyToClipboard();

  const { data: tvlLevel, isLoading: isLoadingTvlLevel } = useQuery({
    queryKey: fusionKeys.tvlLevel(),
    queryFn: apiClient.getLevelData,
    refetchInterval: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const [isMultipliersModalOpen, setMultipliersModalOpen] = useState(false);
  const [isUserAppsModalOpen, setUserAppsModalOpen] = useState(false);
  const [isUserReferralModalOpen, setUserReferralModalOpen] = useState(false);

  const spicePerDay = user?.season3Data.oneDayLeaderboardEntry[0]?.total_points;

  const harvestedApps = apps?.filter((app) => app.userHarvest);

  const completedQuestsCount = quests?.questBreakdown.filter((quest) => quest.quest_completed).length;

  const hasReferrals = Number(user?.season3Data.s3LeaderboardData[0]?.ref_points) > 0;

  const totalPoints = user?.season3Data.s3LeaderboardData[0]?.total_points || 0;

  const currentTvl = Number(tvlLevel?.currentTvl || 0);
  const currentLevelTvlGoal = isLoadingTvlLevel
    ? 0
    : tvlLevel?.tvlGoal
      ? Number(tvlLevel.tvlGoal)
      : currentTvl + currentTvl * 0.2;

  return (
    <StyledUserInfoWrapper direction='column' marginTop='4xl'>
      <StyledDl aria-hidden={!isAuthenticated && 'true'} gap='lg'>
        <StyledMainInfo direction={{ base: 'column', s: 'row' }} flex={1}>
          <Flex direction='column' flex={1} gap='lg' justifyContent='space-between'>
            <DlGroup alignItems='flex-start' direction='column'>
              <Dt>
                <Trans>Season 3 Harvested Spice</Trans>
              </Dt>
              <Flex alignItems='flex-start' direction={{ base: 'column' }} elementType='dd'>
                <SpiceAmount showAnimation amount={totalPoints} gap='md' size='4xl' />
                <Flex alignItems='center' color='grey-50' elementType={Span} {...{ size: 's' }}>
                  (+{<SpiceAmount hideIcon amount={spicePerDay || 0} color='grey-50' size='inherit' />}/
                  <Trans>Day</Trans>)
                </Flex>
              </Flex>
            </DlGroup>
            <DlGroup wrap alignItems='center' gap='xs'>
              <Dt size='s'>
                <Trans>Season 1 & 2 Total Spice (Completed):</Trans>
              </Dt>
              <Dd>
                <SpiceAmount amount={user?.leaderboardRank?.total_points || 0} size='md' />
              </Dd>
            </DlGroup>
          </Flex>
          <Flex
            alignItems='center'
            flex={1}
            gap='md'
            justifyContent={{ base: 'center', s: 'flex-end' }}
            marginTop='2xl'
          >
            <Button variant='outline' onPress={() => setMultipliersModalOpen(true)}>
              <Trans>View Multipliers</Trans>
            </Button>
            <Button color='primary' elementType={Link} {...{ href: RoutesPath.BRIDGE }}>
              <Trans>Bridge Assets</Trans>
            </Button>
            <MultipliersModal isOpen={isMultipliersModalOpen} onClose={() => setMultipliersModalOpen(false)} />
          </Flex>
        </StyledMainInfo>
        <UserInfoCard
          description={harvestedApps?.length || 0}
          title={t(i18n)`Apps Used`}
          tooltipLabel={t(i18n)`The number of BOB ecosystem apps that you have harvested Spice with`}
        >
          <Flex gap='md' marginTop='xl'>
            {!!harvestedApps?.length && (
              <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserAppsModalOpen(true)}>
                <Bars3 />
              </Button>
            )}
            <Button
              fullWidth
              disabled={!isAuthenticated}
              elementType={Link}
              tabIndex={isAuthenticated ? undefined : -1}
              variant='outline'
              {...{ href: RoutesPath.APPS, isDisabled: !isAuthenticated }}
            >
              <Trans>Use Apps</Trans>
              <StyledArrowRight size='xs' strokeWidth='2' />
            </Button>
          </Flex>
          {!!harvestedApps?.length && (
            <UserAppsModal
              apps={harvestedApps}
              isOpen={isUserAppsModalOpen}
              onClose={() => setUserAppsModalOpen(false)}
            />
          )}
        </UserInfoCard>
        <UserInfoCard
          description={completedQuestsCount || 0}
          title={t(i18n)`Quests Completed`}
          tooltipLabel={t(i18n)`The number of Intract and Galxe quests that you have completed`}
        >
          <Button
            fullWidth
            disabled={!isAuthenticated}
            variant='outline'
            onPress={() => {
              setScrollQuests(true);
              router.push(`/${params.lang}${RoutesPath.FUSION}`);
            }}
          >
            <Trans>View Quests</Trans>
          </Button>
        </UserInfoCard>
        <UserInfoCard
          description={user?.referral_code}
          title={t(i18n)`Your Referral Code`}
          tooltipLabel={t(
            i18n
          )`Share this link with a friend and when they sign up, you will receive 15% of their Spice harvest as a bonus, plus 7% of the Spice harvest of anyone they refer`}
        >
          <Flex gap='md' marginTop='xl'>
            {hasReferrals && (
              <Button disabled={!isAuthenticated} variant='outline' onPress={() => setUserReferralModalOpen(true)}>
                <Bars3 />
              </Button>
            )}
            <Button
              fullWidth
              disabled={!isAuthenticated}
              variant='outline'
              onPress={() => copy(`${window.location.href}?refCode=${user?.referral_code || ''}`)}
            >
              <Trans>Copy referral URL</Trans> <StyledSolidDocumentDuplicate size='xs' />
            </Button>
          </Flex>
          {user && hasReferrals && (
            <UserReferralModal
              isOpen={isUserReferralModalOpen}
              user={user}
              onClose={() => setUserReferralModalOpen(false)}
            />
          )}
        </UserInfoCard>
        <StyledMeterCard gap='s' justifyContent='space-between'>
          <Flex direction='column' gap='md'>
            {isLoadingTvlLevel ? (
              <Flex direction='column'>
                <Skeleton height='3xl' width='10xl' />
                <Skeleton count={2} marginTop='s' />
              </Flex>
            ) : tvlLevel?.levelName ? (
              <>
                <Dt color='light' size='2xl'>
                  {tvlLevel.levelName}{' '}
                  <Tooltip label={tvlLevel.levelHelperText}>
                    <SolidInformationCircle color='grey-50' size='s' />
                  </Tooltip>
                </Dt>
                <Span color='grey-50' size='s'>
                  {tvlLevel.levelDescription}
                </Span>
              </>
            ) : (
              <>
                <Dt color='light' size='2xl'>
                  <Trans>BOB TVL Progress</Trans>
                </Dt>
                <Span color='grey-50' size='s'>
                  <Trans>No new goal at the moment. Stay tuned for updates!</Trans>
                </Span>
              </>
            )}
          </Flex>
          <Barometer maxValue={currentLevelTvlGoal} showGoal={!!tvlLevel?.tvlGoal} value={currentTvl} />
        </StyledMeterCard>
      </StyledDl>
      {!isAuthenticated && (
        <>
          <StyledUnderlay />
          <StyledOverlay alignItems='center' justifyContent='center'>
            <StyledLoginCard shadowed borderColor='grey-300' gap='lg'>
              <H3 align='center' size='md'>
                <Trans>Log in to View Dashboard</Trans>
              </H3>
              <Divider />
              <P align='center' color='grey-50' size='s'>
                <Trans>Grab the final opportunity to harvest Spice. Join Season 3.</Trans>
              </P>
              <SignUpButton color='primary' size='xl'>
                <Trans>Start Harvesting Spice</Trans>
              </SignUpButton>
              <LoginSection direction={{ base: 'column', s: 'row' }} />
            </StyledLoginCard>
          </StyledOverlay>
        </>
      )}
    </StyledUserInfoWrapper>
  );
};

export { UserInfo };
