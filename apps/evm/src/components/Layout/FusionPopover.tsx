import { Optimism, Spice } from '@gobob/icons';
import {
  Card,
  Divider,
  Flex,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Span,
  useLocale
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useFocusRing } from '@react-aria/focus';

import { BabyPoints } from '../BabyPoints';
import { SpiceAmount } from '../SpiceAmount';
import { WithdrawAlert } from '../WithdrawAlert';
import { WithdrawModal } from '../WithdrawModal';

import { StyledChip, StyledContentWrapper, StyledHarvestCard, StyledOpacityOverlay } from './FusionPopover.style';

import { FeatureFlags, useFeatureFlag, useGetUser, useHaltedLockedTokens, useLockedTokens } from '@/hooks';

const FusionPopover = (): JSX.Element | null => {
  const { data: user } = useGetUser();
  const { locale } = useLocale();
  const isOPSuperusersEnabled = useFeatureFlag(FeatureFlags.OP_SUPERUSER);

  useLockedTokens();
  useHaltedLockedTokens();

  const { focusProps, isFocusVisible } = useFocusRing();

  if (!user) return null;

  const season3leaderboardData = user.season3Data.s3LeaderboardData[0];
  const isOpSuperuser = user?.notices.isOpUser;

  const season3TotalPoints = season3leaderboardData?.total_points;

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <StyledChip
            {...focusProps}
            $isFocusVisible={isFocusVisible}
            borderColor={isOPSuperusersEnabled && isOpSuperuser ? 'red-500' : 'grey-300'}
            rounded='md'
            style={
              isOPSuperusersEnabled && isOpSuperuser
                ? { borderColor: 'FF0420', background: 'rgba(255, 4, 32, .1)' }
                : undefined
            }
          >
            <Flex alignItems='center' gap='xs'>
              <Spice size='xs' />
              {Intl.NumberFormat(locale, { notation: 'compact' }).format(season3TotalPoints!)}
            </Flex>
          </StyledChip>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader showDivider={false}>
            <Trans>Your Spice Harvest Overview</Trans>
          </PopoverHeader>
          <PopoverBody gap='md' padding='even'>
            <P color='grey-50' size='s'>
              <Trans>Season 3 (Ongoing)</Trans>
            </P>
            <StyledHarvestCard rounded='md'>
              <StyledOpacityOverlay />
              <StyledContentWrapper direction='column'>
                <P color='grey-50' size='s'>
                  <Trans>Current Harvest</Trans>
                </P>
                <Flex wrap gap='s'>
                  <SpiceAmount amount={season3TotalPoints!} />
                  <Span>+</Span>
                  <BabyPoints amount={user.baby.total} />
                </Flex>
              </StyledContentWrapper>
            </StyledHarvestCard>
            <Card background='grey-500' rounded='lg'>
              <P color='grey-50' size='s'>
                <Trans>Current Leaderboard Rank</Trans>
              </P>
              <P>#{season3leaderboardData?.group_rank}</P>
            </Card>
            {isOpSuperuser && (
              <Card background='grey-500' rounded='lg' style={{ position: 'relative' }}>
                <Flex
                  style={{ position: 'absolute', backgroundColor: 'rgba(255, 0, 0, 0.5)', inset: 0, opacity: 0.1 }}
                />
                <Optimism
                  style={{
                    right: 0,
                    top: '50%',
                    position: 'absolute',
                    opacity: 0.1,
                    height: '7rem',
                    width: '7rem',
                    transform: 'translate(25%, -50%)'
                  }}
                />
                <Flex direction='column' gap='xs'>
                  <P size='s'>
                    <Trans>
                      Active Superchain users who have received any of the five OP Airdrops qualify for an exclusive 50%
                      bonus on all Spice harvested between 9 December 2024 and 12 January 2025. The bonus will be
                      applied at the end of the campaign.
                    </Trans>
                  </P>
                </Flex>
              </Card>
            )}
            <>
              <Divider marginY='xs' />
              <P color='grey-50' size='s'>
                <Trans>Season 1 & 2 (Completed)</Trans>
              </P>
              <Card background='grey-500' rounded='lg'>
                <P color='grey-50' size='s'>
                  <Trans>Total Harvest</Trans>
                </P>
                <SpiceAmount amount={user.leaderboardRank?.total_points || 0} />
              </Card>
              {user.leaderboardRank?.rank && (
                <Card background='grey-500' rounded='lg'>
                  <P color='grey-50' size='s'>
                    <Trans>Season 2 Final Rank</Trans>
                  </P>
                  <P>#{user.leaderboardRank?.rank}</P>
                </Card>
              )}
            </>
            <WithdrawAlert />
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <WithdrawModal />
    </>
  );
};

export { FusionPopover };
