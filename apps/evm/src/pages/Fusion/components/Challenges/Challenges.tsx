import { Button, Card, ChevronLeft, ChevronRight, Flex, H2, P, useMediaQuery } from '@gobob/ui';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { useTheme } from 'styled-components';
import { useRef } from 'react';

import { QuestS3Response } from '../../../../utils';

import { ChallengeCard } from './ChallengeCard';
import { StyledOverlay, StyledSlider, StyledSliderWrapper, StyledUnderlay } from './Challenges.style';

const settings: Settings = {
  infinite: false,
  arrows: false,
  slidesToScroll: 1
};

type ChallengesProps = {
  quests: QuestS3Response | undefined;
};

const isComingSoon = true;

const Challenges = ({ quests }: ChallengesProps) => {
  const sliderRef = useRef<Slider>(null);

  const theme = useTheme();
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isTable = useMediaQuery(theme.breakpoints.up('s'));

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <Flex direction='column' gap='2xl' marginTop='8xl'>
      <H2 id='challenges' size='3xl'>
        Challenges
      </H2>
      <StyledSliderWrapper direction='column' gap='2xl'>
        {isComingSoon && (
          <>
            <StyledUnderlay />
            <StyledOverlay alignItems='center' justifyContent='center'>
              <Card borderColor='grey-300' paddingX='lg' paddingY='md' rounded='md'>
                <P size='xl'>Coming Soon</P>
              </Card>
            </StyledOverlay>
          </>
        )}
        <StyledSlider
          ref={sliderRef}
          {...settings}
          slidesToShow={isLargeDesktop ? 4 : isDesktop ? 3 : isTable ? 2 : 1.25}
        >
          {isComingSoon
            ? Array(4)
                .fill(undefined)
                .map((_, idx) => (
                  <ChallengeCard
                    key={idx}
                    isDisabled
                    data={
                      {
                        quest_name: 'Fusion Quest',
                        url: '#',
                        description: 'Complete this fusion quest and earn amazing prizes'
                      } as any
                    }
                  />
                ))
            : quests
              ? quests.questBreakdown
                  .sort((a, b) => {
                    // First, compare "is_featured" to prioritize featured quests.
                    if (a.is_featured && !b.is_featured) return -1;
                    if (!a.is_featured && b.is_featured) return 1;

                    // If both are equally featured or non-featured, handle "quest_completed".
                    if (a.quest_completed && !b.quest_completed) return 1; // completed goes to the end
                    if (!a.quest_completed && b.quest_completed) return -1; // non-completed stays in front

                    return 0; // if they're both featured/non-featured and completed/non-completed equally, keep their order
                  })
                  .map((quest) => <ChallengeCard key={quest.quest_id} data={quest} />)
              : Array(6)
                  .fill(undefined)
                  .map((_, idx) => <ChallengeCard key={idx} data={undefined} />)}
        </StyledSlider>
        <Flex gap='md' justifyContent='flex-end'>
          <Button isIconOnly disabled={isComingSoon} onPress={handlePrevious}>
            <ChevronLeft strokeWidth='3' />
          </Button>
          <Button isIconOnly disabled={isComingSoon} onClick={handleNext}>
            <ChevronRight strokeWidth='3' />
          </Button>
        </Flex>
      </StyledSliderWrapper>
    </Flex>
  );
};

export { Challenges };
