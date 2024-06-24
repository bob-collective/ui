import {
  Button,
  CardProps,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  H3,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  QuestionMarkCircle,
  Tooltip,
  useMediaQuery
} from '@gobob/ui';
import { ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { StyledCategoryTag, StyledLiveTag, StyledPartnerCard } from './PartnerCard.style';

type Props = {
  category: string;
  logoSrc: string | ReactNode;
  name: string;
  url: string;
  distributedSpice?: string;
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
  distributedSpice,
  harvest,
  isLive,
  ...props
}: PartnerCardProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            <Dt size='s'>
              <Flex alignItems='center' gap='s'>
                Spice Distributed per Hour:
                {isMobile ? (
                  <Popover>
                    <PopoverTrigger>
                      <Button isIconOnly size='s' variant='ghost'>
                        <QuestionMarkCircle color='grey-200' size='s' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        <P size='s'>This is the average amount of spice distributed by the project per hour.</P>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Tooltip
                    color='primary'
                    label={<P size='s'>This is the average amount of spice distributed by the project per hour.</P>}
                  >
                    <QuestionMarkCircle color='grey-200' size='s' />
                  </Tooltip>
                )}
              </Flex>
            </Dt>
            <Dd size='s' weight='bold'>
              {distributedSpice}
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
