import { INTERVAL, useQuery } from '@gobob/react-query';
import { Flex, H2, H3, InformationCircle, P, Spinner, TextLink, useLocale } from '@gobob/ui';
import { Trans, useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

import { useGetUser } from '../../../../hooks';
import { apiClient } from '../../../../utils';

import { PartnerCard } from './PartnerCard';
import { StyledCard, StyledGrid } from './ChallengesAndEcosystem.style';

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

      return partnerData.partners
        .filter((result) => result.show_on_app_store)
        .sort((a, b) => Number(b.points_distributed_per_hour) - Number(a.points_distributed_per_hour));
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

  // Top three projects are shown in a different row
  const topHarvesters = useMemo(
    () => partners?.filter((result) => result.category !== 'Quests').slice(0, 3),
    [partners]
  );

  const remainingPartners = useMemo(
    () => partners?.filter((result) => result.category !== 'Quests').slice(3),
    [partners]
  );

  const questProjects = useMemo(() => partners?.filter((result) => result.category === 'Quests'), [partners]);

  return (
    <>
      <Flex direction='column' gap='xl'>
        <H2 size='2xl' weight='semibold'>
          {t('fusion.challenges.title')}
        </H2>
        <P color='grey-200'>
          <Trans
            components={{
              challengeLink: (
                <TextLink
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
          {questProjects?.map((item, idx) => (
            // TODO: host these remotely and return an image url from the api
            // so that we don't need to update the UI when a project is added
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
          <>
            <H3 size='lg' weight='semibold'>
              Top Harvesters by Hour
            </H3>
            <StyledGrid>
              {topHarvesters?.map((item, idx) => (
                // TODO: host these remotely and return an image url from the api
                // so that we don't need to update the UI when a project is added
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
            <H3 size='lg' weight='semibold'>
              Other projects
            </H3>
            <StyledGrid>
              {remainingPartners?.map((item, idx) => (
                // TODO: host these remotely and return an image url from the api
                // so that we don't need to update the UI when a project is added
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
      </Flex>
    </>
  );
};

export { PartnersSection };
