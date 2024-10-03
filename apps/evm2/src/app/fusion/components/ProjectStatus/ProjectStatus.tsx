import { Flex, H2, P, Span, Stepper, StepperItem } from '@gobob/ui';
import { useId } from '@react-aria/utils';
import { useTranslations } from 'next-intl';

import { StyledWrapper } from './ProjectStatus.style';

const ProjectStatus = () => {
  const statusId = useId();

  const t = useTranslations();

  return (
    <StyledWrapper direction='column' gap='3xl' justifyContent='space-between'>
      <Flex direction='column' gap='2xl'>
        <Flex direction={{ base: 'column', md: 'row' }} gap='2xl' justifyContent='space-between'>
          <Flex color='grey-50' direction='column' elementType={H2} flex={{ base: '1', md: '1' }} gap='s' id={statusId}>
            <Span color='grey-50' size='s'>
              {t('fusion.status')}
            </Span>
            <Span size='md' weight='semibold'>
              {t('fusion.season')}
            </Span>
          </Flex>
          <Stepper aria-labelledby={statusId} flex={{ base: '1', md: '1.5' }} index={1}>
            <StepperItem textValue='1' />
            <StepperItem textValue='2' />
            <StepperItem textValue='3' />
          </Stepper>
        </Flex>
        <P color='grey-50' size='s'>
          {t('fusion.seasonDescription')}
        </P>
      </Flex>
    </StyledWrapper>
  );
};

export { ProjectStatus };
