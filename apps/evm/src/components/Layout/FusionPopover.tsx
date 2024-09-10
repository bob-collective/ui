import {
  Card,
  Chip,
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

import { useGetUser } from '../../hooks';

const FusionPopover = (): JSX.Element | null => {
  const { data: user } = useGetUser();
  const { locale } = useLocale();

  if (!user) return null;

  const season3leaderboardData = user.season3Data.s3LeaderboardData[0];

  const season3TotalPoints = season3leaderboardData.total_points;

  return (
    <Popover>
      <PopoverTrigger>
        <Chip borderColor='grey-300' rounded='md' startAdornment={<Spice size='xs' />}>
          {Intl.NumberFormat(locale, { notation: 'compact' }).format(season3TotalPoints)}
        </Chip>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>Your Spice Harvest Overview</PopoverHeader>
        <PopoverBody padding='even'>
          <P>Season 3 (Ongoing)</P>
          <Card rounded='md'>
            <P>Current Harvest</P>
            <Flex>
              <Spice /> {Intl.NumberFormat(locale).format(season3TotalPoints)}
            </Flex>
          </Card>
          <Card background='grey-500' rounded='lg'>
            <P>Current Leaderboard Rank</P>
            <P>#{season3leaderboardData.global_rank}</P>
          </Card>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { FusionPopover };
