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
import { ReactNode, useCallback } from 'react';
import { useTheme } from 'styled-components';
import { MedalBronze, MedalGold, MedalSilver } from '@gobob/icons';

import { StyledCategoryTag, StyledIconWrapper, StyledLiveTag, StyledPartnerCard } from './PartnerCard.style';

type Props = {
  category: string;
  logoSrc: string | ReactNode;
  name: string;
  url: string;
  distributedSpice?: string;
  harvest?: string;
  isLive?: boolean;
  medal?: 'gold' | 'silver' | 'bronze';
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
  medal,
  ...props
}: PartnerCardProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getMedalIcon = useCallback(() => {
    if (!medal) return;

    const medalIcon = medal === 'gold' ? <MedalGold /> : medal === 'silver' ? <MedalSilver /> : <MedalBronze />;
    const capitalisedMedalName = medal.charAt(0).toUpperCase() + medal.slice(1);

    return isMobile ? (
      <Popover>
        <PopoverTrigger>
          <Button isIconOnly size='s' variant='ghost'>
            {medalIcon}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <P size='s'>{capitalisedMedalName} harvester.</P>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    ) : (
      <Tooltip color='primary' label={<P size='s'>{capitalisedMedalName} harvester.</P>}>
        {medalIcon}
      </Tooltip>
    );
  }, [isMobile, medal]);

  return (
    <StyledPartnerCard
      // NOTE: onPress used here to prevent popover triggering navigation
      onPress={() => window.open(url, '_blank', 'noreferrer')}
      {...props}
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
          {medal && <StyledIconWrapper>{getMedalIcon()}</StyledIconWrapper>}
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
                Spice per Hour:
                {isMobile ? (
                  <Popover>
                    <PopoverTrigger>
                      <Button isIconOnly size='s' variant='ghost'>
                        <QuestionMarkCircle color='grey-200' size='s' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody>
                        <P size='s'>
                          This is the average amount of spice distributed by the project per hour over the last 7 days.
                        </P>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Tooltip
                    color='primary'
                    label={
                      <P size='s'>
                        This is the average amount of spice distributed by the project per hour over the last 7 days.
                      </P>
                    }
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
