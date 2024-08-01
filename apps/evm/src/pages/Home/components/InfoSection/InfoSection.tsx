import { Flex, H4, P } from '@gobob/ui';
import { Trans, useTranslation } from 'react-i18next';

import cubsSpiceFactorySrc from '../../../../assets/cubs-spice-factory.png';
import { HighlightText } from '../../../../components';

import { StyledContainer, StyledAboutTitle, StyledLeftHighlight, StyledSpiceFactoryImg } from './InfoSection.style';

const InfoSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <StyledContainer gap='2xl' paddingX='4xl' paddingY={{ base: '4xl', md: '10xl' }}>
      <Flex direction='column' gap='2xl'>
        <StyledAboutTitle align='center' fontFamily='eurostar'>
          <Trans components={{ highlight: <HighlightText /> }} i18nKey='home.info.title' />
        </StyledAboutTitle>
        <P align='center' color='grey-50' size='lg'>
          {t('home.info.content')}
        </P>
      </Flex>
      <Flex alignItems='center' direction={{ base: 'column', lg: 'row' }} gap='8xl' marginTop='4xl'>
        <Flex direction='column' flex={1} gap='6xl'>
          <Flex direction='column' gap='2xl'>
            <StyledLeftHighlight as={H4} fontFamily='eurostar' size='4xl'>
              {t('home.info.exploreLabel')}
            </StyledLeftHighlight>
            <P color='grey-50' size='lg'>
              {t('home.info.exploreContent')}
            </P>
          </Flex>
          <Flex direction='column' gap='2xl'>
            <StyledLeftHighlight as={H4} fontFamily='eurostar' size='4xl'>
              {t('home.info.referLabel')}
            </StyledLeftHighlight>
            <P color='grey-50' size='lg'>
              {t('home.info.referContent')}
            </P>
          </Flex>
          <Flex direction='column' gap='2xl'>
            <StyledLeftHighlight as={H4} fontFamily='eurostar' size='4xl'>
              {t('home.info.questsLabel')}
            </StyledLeftHighlight>
            <P color='grey-50' size='lg'>
              {t('home.info.questsContent')}
            </P>
          </Flex>
        </Flex>
        <StyledSpiceFactoryImg alt='spice factory' src={cubsSpiceFactorySrc} />
      </Flex>
    </StyledContainer>
  );
};

export { InfoSection };
