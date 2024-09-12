import { Chip, Flex, H1, P, Skeleton, useLocale } from '@gobob/ui';
import { INTERVAL, useQuery } from '@gobob/react-query';

import { fusionKeys } from '../../../../lib/react-query';
import { apiClient } from '../../../../utils';

import { Barometer } from './Barometer';
import { StyledHeaderWrapper, StyledSkeleton } from './SeasonInfo.style';

const SeasonInfo = () => {
  const { locale } = useLocale();

  const { data: tvl, isLoading } = useQuery({
    queryKey: fusionKeys.tvl(),
    queryFn: async () => Number((await apiClient.getBarometerTVL()).totalTvl),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: INTERVAL.HOUR
  });

  return (
    <Flex alignItems='center' direction='column' gap='4xl' paddingY='4xl'>
      <Chip background='grey-500' borderColor='grey-300' size='lg'>
        Ends 21st Nov 2024
      </Chip>
      <StyledHeaderWrapper>
        {isLoading && (
          <StyledSkeleton>
            <Skeleton
              height={{ base: '5xl', s: '6xl' }}
              style={{ lineHeight: 'inherit' }}
              width={{ base: '20rem', s: '23rem' }}
            />
          </StyledSkeleton>
        )}
        <H1 size={{ base: '4xl', md: '6xl' }} style={{ visibility: isLoading ? 'hidden' : undefined }}>
          {Intl.NumberFormat(locale, {
            currency: 'USD',
            style: 'currency',
            notation: 'compact',
            minimumFractionDigits: 2
          }).format(tvl || 0)}{' '}
          DeFi TVL
        </H1>
      </StyledHeaderWrapper>
      <P align='center' color='grey-50'>
        Season 3 is live from September 15 to November 25, with a huge 20M prize pool at stake. This is your final
        opportunity to gather Spice!
      </P>
      <Barometer value={tvl || 0} />
    </Flex>
  );
};

export { SeasonInfo };
