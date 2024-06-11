import { CardProps, Dd, Dl, DlGroup, Dt, Flex, H3, P } from '@gobob/ui';
import { ReactNode } from 'react';

import { StyledCategoryTag, StyledLiveTag, StyledPartnerCard } from './PartnerCard.style';

type Props = {
  category: string;
  logoSrc: string | ReactNode;
  name: string;
  url: string;
  totalSpice?: string;
  distributedSpice?: string;
  percentageDistributed?: string;
  harvest?: string;
  isLive?: boolean;
};

type PartnerCardProps = Props & Omit<CardProps, keyof Props>;

function getFallbackImage() {
  return new URL(`../../../../assets/partners/default.png`, import.meta.url).href;
}

const PartnerCard = ({
  category,
  logoSrc,
  name,
  url,
  totalSpice,
  distributedSpice,
  percentageDistributed,
  harvest,
  isLive,
  ...props
}: PartnerCardProps): JSX.Element => {
  return (
    <StyledPartnerCard
      {...props}
      {...{ href: url, target: '_blank', rel: 'noreferrer' }}
      style={{ textDecoration: 'none', width: '100%' }}
    >
      <StyledLiveTag
        background={isLive ? 'primary-700' : 'grey-900'}
        bordered={isLive ? 'primary-500' : 'grey-400'}
        paddingX='xs'
        paddingY='xxs'
        rounded='md'
      >
        <P size='xs' weight='bold'>
          {isLive ? 'Live' : 'Not Live'}
        </P>
      </StyledLiveTag>
      <Flex direction='column' gap='md'>
        <Flex alignItems='center' direction='row' gap='md'>
          {typeof logoSrc === 'string' ? (
            <img
              alt={name}
              src={logoSrc}
              width={52}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = getFallbackImage();
              }}
            />
          ) : (
            logoSrc
          )}
          <H3 align='center' size='md' weight='bold'>
            {name}
          </H3>
        </Flex>
        <StyledCategoryTag align='center' size='xs' weight='bold'>
          {category}
        </StyledCategoryTag>
        <Dl direction='column' gap='s' justifyContent='space-between'>
          <DlGroup alignItems='flex-start' direction='row' justifyContent='space-between'>
            <Dt size='s'>Total Spice:</Dt>
            <Dd size='s' weight='bold'>
              {totalSpice}
            </Dd>
          </DlGroup>
          <DlGroup alignItems='flex-start' direction='row' justifyContent='space-between'>
            <Dt size='s'>Distributed:</Dt>
            <Dd size='s' weight='bold'>
              {distributedSpice} ({percentageDistributed})
            </Dd>
          </DlGroup>
          <DlGroup alignItems='flex-start' direction='row' justifyContent='space-between'>
            <Dt size='s'>Your Harvest:</Dt>
            <Dd color='primary-500' size='s' weight='bold'>
              {harvest}
            </Dd>
          </DlGroup>
        </Dl>
      </Flex>
    </StyledPartnerCard>
  );
};

export { PartnerCard };
