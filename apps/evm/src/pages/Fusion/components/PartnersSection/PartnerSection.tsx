import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H2, H3, InformationCircle, P, Spinner, useLocale } from '@gobob/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

import { useGetUser } from '../../../../hooks';
import { apiClient } from '../../../../utils';

import { PartnerCard } from './PartnerCard';
import { StyledCard, StyledGrid } from './PartnerCard.style';

function getImageUrl(name: string) {
  return new URL(`../../../../assets/partners/${name.split(' ').join('').toLowerCase()}.png`, import.meta.url).href;
}

const PartnersSection = () => {
  const { locale } = useLocale();

  const { data: user } = useGetUser();

  const { t } = useTranslation();

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const partnerData = await apiClient.getPartners();

      return (
        partnerData.partners
          // NOTE: Remove category check when adding quest project cards
          .filter((result) => result.show_on_app_store && result.category.toLowerCase() !== 'quest')
          .sort(
            (a, b) =>
              // partner.live property is a boolean
              Number(!!b.live) - Number(!!a.live) ||
              Number(b.points_distributed_per_hour) - Number(a.points_distributed_per_hour)
          )
      );
    },
    refetchOnWindowFocus: false,
    gcTime: INTERVAL.HOUR,
    refetchOnMount: false
  });

  // Return top 3 projects
  const topHarvesters = useMemo(() => partners?.slice(0, 3), [partners]);

  // Return remaining projects
  const otherHavesters = useMemo(() => partners?.slice(3), [partners]);

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
      <H2 id='ecosystem' size='2xl' weight='semibold'>
        {t('fusion.partners.title')}
      </H2>
      <P color='grey-200'> {t('fusion.partners.content')}</P>
      {isLoading ? (
        <Flex direction='row' justifyContent='center' marginTop='8xl'>
          <Spinner size='36' thickness={5} />
        </Flex>
      ) : (
        <>
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
            {otherHavesters?.map((item, idx) => (
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
        </>
      )}
      <StyledCard alignItems='center' direction='row' gap='md'>
        <InformationCircle />
        <P size='s' weight='semibold'>
          {t('fusion.partners.alert')}
        </P>
      </StyledCard>
    </Flex>
  );
};

export { PartnersSection };
