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
  useLocale
} from '@gobob/ui';
import { Spice } from '@gobob/icons';
import { useFocusRing } from '@react-aria/focus';

import { WithdrawAlert } from '../WithdrawAlert';
import { WithdrawModal } from '../WithdrawModal';
import { SpiceAmount } from '../SpiceAmount';

import { StyledChip, StyledContentWrapper, StyledHarvestCard, StyledOpacityOverlay } from './FusionPopover.style';

import { useGetUser, useHaltedLockedTokens, useLockedTokens } from '@/hooks';

const FusionPopover = (): JSX.Element | null => {
  const { data: user } = useGetUser();
  const { locale } = useLocale();

  useLockedTokens();
  useHaltedLockedTokens();

  const { focusProps, isFocusVisible } = useFocusRing();

  if (!user) return null;

  const season3leaderboardData = user.season3Data.s3LeaderboardData[0];

  const season3TotalPoints = season3leaderboardData.total_points;

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <StyledChip {...focusProps} $isFocusVisible={isFocusVisible} borderColor='grey-300' rounded='md'>
            <Flex alignItems='center' gap='xs'>
              <Spice size='xs' />
              {Intl.NumberFormat(locale, { notation: 'compact' }).format(season3TotalPoints)}
            </Flex>
          </StyledChip>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader showDivider={false}>Your Spice Harvest Overview</PopoverHeader>
          <PopoverBody gap='md' padding='even'>
            <P color='grey-50' size='s'>
              Season 3 (Ongoing)
            </P>
            <StyledHarvestCard rounded='md'>
              <StyledOpacityOverlay />
              <StyledContentWrapper direction='column'>
                <P color='grey-50' size='s'>
                  Current Harvest
                </P>
                <SpiceAmount amount={season3TotalPoints} />
              </StyledContentWrapper>
            </StyledHarvestCard>
            <Card background='grey-500' rounded='lg'>
              <P color='grey-50' size='s'>
                Current Leaderboard Rank
              </P>
              <P>#{season3leaderboardData.group_rank}</P>
            </Card>
            <>
              <Divider marginY='xs' />
              <P color='grey-50' size='s'>
                Season 1 & 2 (Completed)
              </P>
              <Card background='grey-500' rounded='lg'>
                <P color='grey-50' size='s'>
                  Total Harvest
                </P>
                <SpiceAmount amount={user.leaderboardRank?.total_points || 0} />
              </Card>
              {user.leaderboardRank?.rank && (
                <Card background='grey-500' rounded='lg'>
                  <P color='grey-50' size='s'>
                    Season 2 Final Rank
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