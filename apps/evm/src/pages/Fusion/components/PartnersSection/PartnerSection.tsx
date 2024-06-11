import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H2, InformationCircle, P, Spinner, useLocale } from '@gobob/ui';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

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
      const partners = await apiClient.getPartners();

      return partners.partners.sort((a, b) => Number(b.total_points) - Number(a.total_points));
    },
    refetchOnWindowFocus: false,
    gcTime: INTERVAL.HOUR,
    refetchOnMount: false
  });

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

  const getPercentageDistributed = useCallback(
    (total: string, distributed: string) => {
      const percentageDistributed = Number(distributed) / Number(total);

      // If a project has 0 total and 0 distributed the result will be NaN
      return isNaN(percentageDistributed)
        ? '-'
        : Intl.NumberFormat(locale, {
            style: 'percent',
            maximumFractionDigits: 2
          }).format(percentageDistributed);
    },
    [locale]
  );

  return (
    <Flex direction='column' gap='xl' marginTop='4xl'>
      <H2 id='ecosystem' size='2xl' weight='semibold'>
        {t('fusion.partners.title')}
      </H2>
      <P color='grey-200'> {t('fusion.partners.content')}</P>
      <StyledCard alignItems='center' direction='row' gap='md'>
        <InformationCircle />
        <P size='s' weight='semibold'>
          {t('fusion.partners.alert')}
        </P>
      </StyledCard>
      {isLoading ? (
        <Flex direction='row' justifyContent='center' marginTop='8xl'>
          <Spinner size='36' thickness={5} />
        </Flex>
      ) : (
        <StyledGrid>
          {partners?.map((item, idx) => (
            // TODO: host these remotely and return an image url from the api
            // so that we don't need to update the UI when a project is added
            <PartnerCard
              key={idx}
              isHoverable
              isPressable
              category={item?.category}
              distributedSpice={Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
                Number(item.total_distributed_points)
              )}
              elementType='a'
              gap='md'
              harvest={getHarvest(item.ref_code)}
              isLive={item.live}
              logoSrc={getImageUrl(item.name)}
              name={item.name}
              percentageDistributed={getPercentageDistributed(item.total_points, item.total_distributed_points)}
              totalSpice={Intl.NumberFormat(locale, { maximumFractionDigits: 2, notation: 'compact' }).format(
                Number(item.total_points)
              )}
              url={item?.project_url}
            />
          ))}
        </StyledGrid>
      )}
    </Flex>
  );
};

export { PartnersSection };
