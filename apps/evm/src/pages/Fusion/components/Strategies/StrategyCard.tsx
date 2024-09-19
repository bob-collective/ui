import { Flex, H3, P } from '@gobob/ui';

import { StyledAvatarWrapper, StyledCard } from './Strategies.style';

type Props = {
  title: string;
  description: string;
  // reward: number;
};

type StrategyCardProps = Props;

const StrategyCard = ({ title, description }: StrategyCardProps) => {
  // const { locale } = useLocale();

  return (
    <StyledCard isHoverable isPressable direction='row' flex={1} gap='xl'>
      <StyledAvatarWrapper background='dark' flex={1}>
        {/* <StyledPrize rounded='s'>
          <Flex alignItems='center' gap='xs'>
            <Spice size='xs' />
            {Intl.NumberFormat(locale).format(Number(reward))}
          </Flex>
        </StyledPrize> */}
      </StyledAvatarWrapper>
      <Flex direction='column' flex={2.5} gap='s'>
        <H3 rows={1} size='md'>
          {title}
        </H3>
        <P color='grey-50' rows={3} size='s'>
          {description}
        </P>
      </Flex>
    </StyledCard>
  );
};

export { StrategyCard };
