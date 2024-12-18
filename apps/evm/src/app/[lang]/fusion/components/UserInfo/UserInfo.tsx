import {
  Avatar,
  Bars3,
  Button,
  Card,
  Chip,
  Dd,
  Divider,
  Dl,
  DlGroup,
  Dt,
  Flex,
  H3,
  Link,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SolidInformationCircle,
  Span,
  Tooltip,
  UnstyledButton,
  useLocale
} from '@gobob/ui';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCopyToClipboard, useLocalStorage, useSessionStorage } from 'usehooks-ts';

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

import { AppData } from '@/app/[lang]/apps/hooks';
import { BabyPoints, LoginSection, SignUpButton, SpiceAmount } from '@/components';
import { INTERVAL, isClient, LocalStorageKey, RoutesPath } from '@/constants';
import { FeatureFlags, useFeatureFlag } from '@/hooks';
import { fusionKeys } from '@/lib/react-query';
import { SessionStorageKey } from '@/types';
import { apiClient, QuestS3Response, UserResponse } from '@/utils';

type UserInfoProps = {
  user?: UserResponse;
  apps: AppData[] | undefined;
  quests: QuestS3Response | undefined;
  isAuthenticated?: boolean;
};

const UserInfo = ({ apps, user, quests, isAuthenticated }: UserInfoProps) => {
  const { locale } = useLocale();

  const router = useRouter();
  const params = useParams();
  const { i18n } = useLingui();
  const [, setScrollQuests] = useSessionStorage(SessionStorageKey.SCROLL_QUESTS, false, {
    initializeWithValue: isClient
  });
  const [, setShowTopUserModal] = useLocalStorage(LocalStorageKey.SHOW_TOP_USER_MODAL, true, {
    initializeWithValue: isClient
  });
  const [, copy] = useCopyToClipboard();

  const { data: tvlLevel, isLoading: isLoadingTvlLevel } = useQuery({
    queryKey: fusionKeys.tvlLevel(),
    queryFn: () => apiClient.getLevelData(),
    refetchInterval: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const { data: totalHarvesters } = useQuery({
    queryKey: fusionKeys.totalHarvesters(),
    queryFn: async () => apiClient.getTotalHarvesters(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR
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

  const isTop100SpiceUsersEnabled = useFeatureFlag(FeatureFlags.TOP_100_SPICE_USERS);
  const isOPSuperusersEnabled = useFeatureFlag(FeatureFlags.OP_SUPERUSER);

  const isOpSuperuser = isOPSuperusersEnabled && user?.notices.isOpUser;
  const showFusionTopUser = isTop100SpiceUsersEnabled && user?.notices.showIsFusionTopUser;

  return (
    <StyledUserInfoWrapper direction='column' gap='lg' marginTop='4xl'>
      {showFusionTopUser && (
        <P color='grey-50'>
          <Trans>We would love to hear your thoughts on the BOB ecosystem and Bitcoin DeFi.</Trans>
        </P>
      )}
      <Flex alignItems='center' direction='row' justifyContent='flex-end'>
        {showFusionTopUser && (
          <Flex flex='1'>
            <Button color='primary' size='s' variant='outline' onPress={() => setShowTopUserModal(true)}>
              <Trans>Book a call with the founders</Trans>
            </Button>
          </Flex>
        )}
        <Card padding='md'>
          <Dl direction='row' gap='xxs' justifyContent='space-between'>
            <DlGroup>
              <Dd color='grey-50' size='s'>
                <Trans>Fusion Users:</Trans>
              </Dd>
              <Dt color='light' size='s' weight='semibold'>
                {totalHarvesters?.count ? Intl.NumberFormat(locale).format(Number(totalHarvesters.count)) : '-'}
              </Dt>
            </DlGroup>
          </Dl>
        </Card>
      </Flex>
      <StyledDl aria-hidden={!isAuthenticated && 'true'} gap='lg'>
        <StyledMainInfo direction={{ base: 'column', s: 'row' }} flex={1}>
          <Flex direction='column' flex={{ base: 1 }} gap='lg' justifyContent='space-between'>
            <DlGroup alignItems='flex-start' direction='column'>
              <Flex alignItems='center' elementType='dt' gap='s'>
                <Span color='grey-50' size='s'>
                  <Trans>Season 3 Harvested</Trans>
                </Span>
                <Span color='grey-50' size='s'>
                  <Trans>+</Trans>
                </Span>
                <Popover>
                  <PopoverTrigger>
                    <UnstyledButton>
                      <Chip
                        background='dark'
                        endAdornment={<SolidInformationCircle size='xs' />}
                        size='s'
                        startAdornment={
                          <Avatar size='xl' src='https://avatars.githubusercontent.com/u/106378782?s=200&v=4' />
                        }
                      >
                        <Trans>Babylon Campaign</Trans>
                      </Chip>
                    </UnstyledButton>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>
                      <Trans>About Babylon Campaign</Trans>
                    </PopoverHeader>
                    <PopoverBody gap='md' padding='even'>
                      <P size='s'>
                        <Trans>
                          BOB will distribute 100,000 Babylon Points per day to eligible users for 45 days. The points
                          are allocated pro rata based on the percentage of the eligible daily Spice you have harvested.
                          The more Spice you harvest the more Babylon points you will receive.
                        </Trans>
                      </P>
                      <P size='s'>
                        <Trans>
                          To be eligible, you must be registered for Fusion and hold or have held a Babylon LST in your
                          wallet. You must also not reside in one of the jurisdictions which are excluded in Babylon’s{' '}
                          <Link external href='https://babylonlabs.io/terms-of-use' size='inherit' underlined='always'>
                            terms of use
                          </Link>
                          , e.g. the USA. For full details see the{' '}
                          <Link
                            external
                            href='https://blog.gobob.xyz/posts/bob-integrates-with-babylon-to-become-a-bitcoin-secured-network-bringing-bitcoin-finality-to-the-hybrid-l2'
                            size='inherit'
                            underlined='always'
                          >
                            BOB blog
                          </Link>
                          .
                        </Trans>
                      </P>
                      <P size='s'>
                        <Trans>
                          The Babylon Points total displayed here only includes points earned during the BOB campaign.
                          The figure does not include points collected by other means.
                        </Trans>
                      </P>
                      <P size='s'>
                        <Trans>The campaign will run until 1st February.</Trans>
                      </P>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Flex>
              <Flex wrap alignItems='center' elementType='dd' gap='s'>
                <SpiceAmount showAnimation amount={totalPoints} gap='md' size='4xl' />
                <Flex alignItems='center' gap='s'>
                  <Span size='2xl' style={{ lineHeight: 1.3 }}>
                    +
                  </Span>
                  <BabyPoints showAnimation amount={user?.baby.total || 0} size='2xl' />
                </Flex>
              </Flex>
            </DlGroup>
            <DlGroup alignItems='flex-start' direction='column'>
              <Flex alignItems='center' elementType='dt' gap='s'>
                <Span color='grey-50' size='s'>
                  <Trans>Last 24 hours</Trans>
                </Span>
                <Tooltip
                  color='primary'
                  label={t(
                    i18n
                  )`This is the amount of spice you have harvested in the last 24 hours. It is updated every 15 minutes.`}
                >
                  <SolidInformationCircle color='grey-50' size='xs' />
                </Tooltip>
              </Flex>
              <Flex alignItems='center' elementType='dd' gap='xs'>
                <Flex wrap alignItems='center' elementType='span' gap='s'>
                  <SpiceAmount showAnimation amount={spicePerDay || 0} />
                  <Flex gap='s'>
                    <Span style={{ lineHeight: 1.2 }}>+</Span>
                    <BabyPoints showAnimation amount={user?.baby.daily || 0} />
                  </Flex>
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
          <Flex wrap alignItems='center' gap='md' justifyContent={{ base: 'center' }} marginTop='2xl'>
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
          tooltipLabel={
            isOpSuperuser
              ? t(
                  i18n
                )`Active Superchain users who have received any of the five OP Airdrops qualify for an exclusive 50% bonus on all Spice harvested between 9 December 2024 and 12 January 2025. The bonus will be applied at the end of the campaign.`
              : t(
                  i18n
                )`Share this link with a friend and when they sign up, you will receive 15% of their Spice harvest as a bonus, plus 7% of the Spice harvest of anyone they refer`
          }
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
        <StyledMeterCard gap='s' justifyContent='space-between' style={{ position: 'relative' }}>
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
              <Divider />
              <Dl direction='row' gap='xxs' justifyContent='space-between'>
                <DlGroup>
                  <Dd color='grey-50'>
                    <Trans>Fusion Users:</Trans>
                  </Dd>
                  <Dt color='light' weight='semibold'>
                    {totalHarvesters?.count ? Intl.NumberFormat(locale).format(Number(totalHarvesters.count)) : '-'}
                  </Dt>
                </DlGroup>
                <DlGroup justifyContent='space-between'>
                  <Dd color='grey-50'>
                    <Trans>Current TVL:</Trans>
                  </Dd>
                  <Dt color='light' weight='semibold'>
                    {currentTvl
                      ? Intl.NumberFormat(locale, {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                          notation: 'compact'
                        }).format(currentTvl)
                      : '-'}
                  </Dt>
                </DlGroup>
              </Dl>
            </StyledLoginCard>
          </StyledOverlay>
        </>
      )}
    </StyledUserInfoWrapper>
  );
};

export { UserInfo };
