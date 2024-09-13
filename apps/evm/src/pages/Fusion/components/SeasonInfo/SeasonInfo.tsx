import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H1, P } from '@gobob/ui';

import { fusionKeys } from '../../../../lib/react-query';
import { apiClient } from '../../../../utils';

import { Barometer } from './Barometer';

const SeasonInfo = () => {
  const { data: tvl } = useQuery({
    queryKey: fusionKeys.tvl(),
    queryFn: async () => Number((await apiClient.getBarometerTVL()).totalTvl),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR
  });

  return (
    <Flex direction='column' gap='4xl' paddingY='4xl'>
      <Flex alignItems='center' direction='column' gap='xl'>
        <H1 align='center' size={{ base: '4xl', md: '5xl' }} weight='semibold'>
          BOB Fusion - The Final Season
        </H1>
        <P align='center' color='grey-50'>
          Additional spice bonuses unlocked at each new TVL level.
        </P>
      </Flex>
      <Barometer value={tvl} />
    </Flex>
  );
};

export { SeasonInfo };
