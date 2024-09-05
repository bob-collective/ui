import { Button, ChevronLeft, ChevronRight, Flex, H2, useMediaQuery } from '@gobob/ui';
import { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { useTheme } from 'styled-components';

import { QuestRefCodes } from '../../../../utils';

import { ChallengeCard } from './ChallengeCard';
import { StyledSlider } from './Challenges.style';

function NextArrow(props: any) {
  const { className, style, onClick } = props;

  return (
    <Button isIconOnly className={className} style={style} onClick={onClick}>
      <ChevronRight strokeWidth='3' />
    </Button>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;

  return (
    <Button isIconOnly className={className} style={style} onClick={onClick}>
      <ChevronLeft strokeWidth='3' />
    </Button>
  );
}

const settings: Settings = {
  dots: true,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />
};

const Challenges = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('s'));

  return (
    <Flex direction='column' gap='2xl' marginTop='2xl'>
      <H2 size='2xl'>Challenges</H2>
      <StyledSlider {...settings} arrows={isDesktop}>
        <ChallengeCard
          description='Provide Liquidity with BOB'
          href='#'
          prize='200000'
          questRefCode={QuestRefCodes.GALXE}
        />
        <ChallengeCard
          description='Provide Liquidity with BOB'
          href='#'
          prize='200000'
          questRefCode={QuestRefCodes.INTRACT}
        />
        <ChallengeCard
          description='Provide Liquidity with BOB'
          href='#'
          prize='200000'
          questRefCode={QuestRefCodes.GALXE}
        />
        <ChallengeCard
          description='Provide Liquidity with BOB'
          href='#'
          prize='200000'
          questRefCode={QuestRefCodes.INTRACT}
        />
        <ChallengeCard
          description='Provide Liquidity with BOB'
          href='#'
          prize='200000'
          questRefCode={QuestRefCodes.INTRACT}
        />
      </StyledSlider>
    </Flex>
  );
};

export { Challenges };
