import { Card, CardProps, Flex, H3, P } from '@gobob/ui';
import { formatDistanceToNow } from 'date-fns';

import { ResultProjectVotingInfo } from '../../../../utils';

import { StyledOverlay, StyledUnderlay } from './AppsPodium.style';
import { PodiumCategory } from './PodiumCategory';

type Props = {
  apps?: ResultProjectVotingInfo;
  roundEndsAt?: string;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type AppPodiumProps = Props & InheritAttrs;

const isComingSoon = false;

const AppsPodium = ({ apps, roundEndsAt }: AppPodiumProps): JSX.Element => {
  const [categoryOne, categoryTwo, categoryThree] = apps?.categories || [undefined, undefined, undefined];

  return (
    <Flex direction='column' gap='3xl' marginTop='4xl'>
      <H3 size='3xl'>Last Week&apos;s Winners</H3>
      <Flex wrap direction={{ base: 'column', md: 'row' }} gap='md' style={{ position: 'relative' }}>
        {isComingSoon && (
          <>
            <StyledUnderlay />
            <StyledOverlay alignItems='center' justifyContent='center'>
              <Card borderColor='grey-300' paddingX='lg' paddingY='md' rounded='md'>
                <P align='center' size='xl'>
                  {roundEndsAt
                    ? `${formatDistanceToNow(roundEndsAt)} left until the winners are announced!`
                    : 'Coming Soon'}
                </P>
              </Card>
            </StyledOverlay>
          </>
        )}
        <PodiumCategory category={categoryOne} color='red' isComingSoon={isComingSoon} />
        <PodiumCategory category={categoryTwo} color='purple' isComingSoon={isComingSoon} />
        <PodiumCategory category={categoryThree} color='pink' isComingSoon={isComingSoon} />
      </Flex>
    </Flex>
  );
};

export { AppsPodium };
