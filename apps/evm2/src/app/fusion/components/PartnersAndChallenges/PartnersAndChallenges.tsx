import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H2, H3, InformationCircle, P, Spinner, Link, useLocale } from '@gobob/ui';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

import { PartnerCard } from './PartnerCard';
import { StyledPartnerCard, StyledGrid } from './PartnerCard.style';

import { useGetUser } from '@/hooks';
import { apiClient } from '@/utils';

function getImageUrl(name: string) {
  return `/assets/partners/${name.split(' ').join('').toLowerCase()}.png`;
}

const PartnersAndChallenges = () => {
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const { t } = useTranslation();

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const partnerData = await apiClient.getPartners();

      return partnerData.partners.sort(
        (a, b) =>
          // partner.live property is a boolean
          Number(!!b.live) - Number(!!a.live) ||
          Number(b.points_distributed_per_hour) - Number(a.points_distributed_per_hour)
      );
    },
    refetchOnWindowFocus: false,
    gcTime: INTERVAL.HOUR,
    refetchOnMount: false
  });

  // Return quest projects
  const questPartners = useMemo(
    () =>
      partners?.filter((result) => result.show_on_app_store && result.category.toLowerCase() === 'quests').slice(0, 3),
    [partners]
  );

  // Return all other projects
  const otherPartners = useMemo(
    () => partners?.filter((result) => result.show_on_app_store && result.category.toLowerCase() !== 'quests'),
    [partners]
  );

  // Return top 3 projects
  const topHarvesters = useMemo(() => otherPartners?.slice(0, 3), [otherPartners]);

  // Return remaining projects
  const otherHarvesters = useMemo(() => otherPartners?.slice(3), [otherPartners]);

  const getHarvest = useCallback(
    (refCode: string) => {
      const harvest = user?.harvested?.find((partner: any) => partner.partner_refcode === refCode);

      return harvest
        ? Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
            Number(harvest.total_points)
          )
        : '-';
    },
    [locale, user]
  );

  const getMedal = (position: number) => {
    // NOTE: Projects are sorted so this is a check against the index
    switch (position) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
    }
  };

  return (
    <Flex direction='column' gap='xl' marginTop='4xl'>
      {isLoading ? (
        <Flex direction='row' justifyContent='center' marginTop='4xl'>
          <Spinner size='36' thickness={5} />
        </Flex>
      ) : (
        <Flex direction='column' gap='4xl'>
          <Flex direction='column' gap='xl'>
            <H2 size='2xl' weight='semibold'>
              {t('fusion.challenges.title')}
            </H2>
            <P color='grey-50'>
              <Trans
                components={{
                  challengeLink: (
                    <Link
                      external
                      href='https://www.intract.io/explore?query=BOB+Summer+Fest&hideCompleted=true&hideExpired=true&sortBy=participation'
                      size='s'
                    />
                  )
                }}
                i18nKey='fusion.challenges.content'
              />
            </P>
            <StyledGrid>
              {questPartners?.map((item, idx) => (
                <PartnerCard
                  key={idx}
                  isHoverable
                  isPressable
                  category={item?.category}
                  distributedSpice={Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
                    Number(item.points_distributed_per_hour)
                  )}
                  elementType='a'
                  gap='md'
                  harvest={getHarvest(item.ref_code)}
                  isLive={item.live}
                  logoSrc={getImageUrl(item.name)}
                  name={item.name}
                  url={item?.project_url}
                />
              ))}
            </StyledGrid>
          </Flex>
          <Flex direction='column' gap='xl'>
            <H2 id='ecosystem' size='2xl' weight='semibold'>
              {t('fusion.partners.title')}
            </H2>
            <P color='grey-50'> {t('fusion.partners.content')}</P>
            <H3 size='lg' weight='semibold'>
              Top Harvesters
            </H3>
            <StyledGrid>
              {topHarvesters?.map((item, idx) => (
                <PartnerCard
                  key={idx}
                  isHoverable
                  isPressable
                  category={item?.category}
                  distributedSpice={Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
                    Number(item.points_distributed_per_hour)
                  )}
                  elementType='a'
                  gap='md'
                  harvest={getHarvest(item.ref_code)}
                  isLive={item.live}
                  logoSrc={getImageUrl(item.name)}
                  medal={getMedal(idx)}
                  name={item.name}
                  url={item?.project_url}
                />
              ))}
            </StyledGrid>
            <H3 size='lg' weight='semibold'>
              Other Harvesters
            </H3>
            <StyledGrid>
              {otherHarvesters?.map((item, idx) => (
                <PartnerCard
                  key={idx}
                  isHoverable
                  isPressable
                  category={item?.category}
                  distributedSpice={Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
                    Number(item.points_distributed_per_hour)
                  )}
                  elementType='a'
                  gap='md'
                  harvest={getHarvest(item.ref_code)}
                  isLive={item.live}
                  logoSrc={getImageUrl(item.name)}
                  name={item.name}
                  url={item?.project_url}
                />
              ))}
            </StyledGrid>
          </Flex>
        </Flex>
      )}
      <StyledPartnerCard alignItems='center' direction='row' gap='md'>
        <InformationCircle />
        <P size='s' weight='semibold'>
          {t('fusion.partners.alert')}
        </P>
      </StyledPartnerCard>
    </Flex>
  );
};

export { PartnersAndChallenges };
