import { Button, ChevronLeft, ChevronRight, Flex, H2, useMediaQuery } from '@gobob/ui';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { useTheme } from 'styled-components';
import { useRef } from 'react';

import { QuestS3Response } from '../../../../utils';

import { ChallengeCard } from './ChallengeCard';
import { StyledSlider } from './Challenges.style';

const settings: Settings = {
  infinite: false,
  arrows: false,
  slidesToScroll: 1
};

type ChallengesProps = {
  quests: QuestS3Response | undefined;
};

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
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <H2 id='challenges' size='3xl'>
        Challenges
      </H2>
      <StyledSlider
        ref={sliderRef}
        {...settings}
        slidesToShow={isLargeDesktop ? 4 : isDesktop ? 3 : isTable ? 2 : 1.25}
      >
        {quests
          ? quests.questBreakdown.map((quest) => <ChallengeCard key={quest.quest_id} data={quest} />)
          : Array(6)
              .fill(undefined)
              .map((_, idx) => <ChallengeCard key={idx} data={undefined} />)}
      </StyledSlider>
      <Flex gap='md' justifyContent='flex-end'>
        <Button isIconOnly onPress={handlePrevious}>
          <ChevronLeft strokeWidth='3' />
        </Button>
        <Button isIconOnly onClick={handleNext}>
          <ChevronRight strokeWidth='3' />
        </Button>
      </Flex>
    </Flex>
  );
};

export { Challenges };
