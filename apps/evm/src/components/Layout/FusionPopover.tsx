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
import { useTranslation } from 'react-i18next';

import { useGetUser, useHaltedLockedTokens, useLockedTokens } from '../../hooks';
import { WithdrawAlert } from '../WithdrawAlert';
import { WithdrawModal } from '../WithdrawModal';
import { SpiceAmount } from '../SpiceAmount';

import { StyledChip, StyledContentWrapper, StyledHarvestCard, StyledOpacityOverlay } from './FusionPopover.style';

const FusionPopover = (): JSX.Element | null => {
  const { data: user } = useGetUser();
  const { locale } = useLocale();
  const { t } = useTranslation();

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
              {t('fusion.popover.season3')}
            </P>
            <StyledHarvestCard rounded='md'>
              <StyledOpacityOverlay />
              <StyledContentWrapper direction='column'>
                <P color='grey-50' size='s'>
                  {t('fusion.popover.currentHarvest')}
                </P>
                <SpiceAmount amount={season3TotalPoints} />
              </StyledContentWrapper>
            </StyledHarvestCard>
            <Card background='grey-500' rounded='lg'>
              <P color='grey-50' size='s'>
                {t('fusion.popover.currentLeaderboardRank')}
              </P>
              <P>#{season3leaderboardData.group_rank}</P>
            </Card>
            <>
              <Divider marginY='xs' />
              <P color='grey-50' size='s'>
                {t('fusion.popover.season1and2')}
              </P>
              <Card background='grey-500' rounded='lg'>
                <P color='grey-50' size='s'>
                  {t('fusion.popover.totalHarvest')}
                </P>
                <SpiceAmount amount={user.leaderboardRank?.total_points || 0} />
              </Card>
              {user.leaderboardRank?.rank && (
                <Card background='grey-500' rounded='lg'>
                  <P color='grey-50' size='s'>
                    {t('fusion.popover.season2FinalRank')}
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
