import { Flex, H3, Modal, ModalBody, ModalHeader, P, SolidGift, Span } from '@gobob/ui';
import { ReactNode, useId, useState } from 'react';
import { Spice } from '@gobob/icons';
import { t, Trans } from '@lingui/macro';
import Image from 'next/image';
import { useLingui } from '@lingui/react';
import spiceShapedBackground from '@public/assets/spice-shape-background.webp';

import { StyledBanner, StyledBannerWrapper, StyledCard, StyledTitle } from './Strategies.style';

type StepStructure = {
  description: ReactNode;
};

type Step = StepStructure & { subSteps?: StepStructure[] };

type Props = {
  title: string;
  shortDescription: string;
  longDescription: ReactNode;
  steps: Step[];
  rewards: string[];
  isDisabled?: boolean;
};

type StrategyCardProps = Props;

const StrategyCard = ({ title, longDescription, rewards, shortDescription, steps, isDisabled }: StrategyCardProps) => {
  const [isOpen, setOpen] = useState(false);
  const { i18n } = useLingui();

  const stepId = useId();
  const rewardsId = useId();

  return (
    <StyledCard
      isHoverable
      isPressable
      direction='row'
      flex={1}
      isDisabled={isDisabled}
      padding='none'
      onPress={() => setOpen(true)}
    >
      <StyledBannerWrapper flex={1}>
        <StyledBanner alignItems='center' justifyContent='center'>
          <Image
            fill
            alt={t(i18n)`Spice styled background`}
            placeholder='blur'
            quality={100}
            sizes='100vw'
            src={spiceShapedBackground}
            style={{
              objectFit: 'cover'
            }}
          />
          <Spice color='primary-500' filter='drop-shadow(0px 0px 10px #F25D00)' size='3xl' />
        </StyledBanner>
      </StyledBannerWrapper>
      <Flex direction='column' flex={2} gap='s' justifyContent='center' padding='lg'>
        <H3 rows={1} size='md'>
          {title}
        </H3>
        <P color='grey-50' rows={3} size='s'>
          {shortDescription}
        </P>
      </Flex>
      <Modal isOpen={isOpen} size='xl' onClose={() => setOpen(false)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody gap='lg' padding='even'>
          <P color='grey-50'>{longDescription}</P>
          <StyledTitle id={stepId} size='lg'>
            <Trans>Steps</Trans>
          </StyledTitle>
          <Flex
            aria-labelledby={stepId}
            direction='column'
            elementType='ol'
            gap='s'
            marginLeft='3xl'
            style={{ listStyleType: 'decimal' }}
          >
            {steps.map((step, idx) => (
              <li key={idx}>
                <Span>{step.description}</Span>
                {step.subSteps && (
                  <Flex
                    direction='column'
                    elementType='ol'
                    gap='xs'
                    marginLeft='3xl'
                    style={{ listStyleType: 'lower-alpha' }}
                  >
                    {step.subSteps.map((step, idx) => (
                      <li key={idx}>
                        <Span>{step.description}</Span>
                      </li>
                    ))}
                  </Flex>
                )}
              </li>
            ))}
          </Flex>
          <StyledTitle id={rewardsId} size='lg'>
            <SolidGift color='grey-50' size='xs' />
            <Trans>Rewards</Trans>
          </StyledTitle>
          <Flex
            aria-labelledby={stepId}
            direction='column'
            elementType='ol'
            gap='s'
            marginLeft='3xl'
            style={{ listStyleType: 'decimal' }}
          >
            {rewards.map((reward, idx) => (
              <li key={idx}>
                <Span>{reward}</Span>
              </li>
            ))}
          </Flex>
        </ModalBody>
      </Modal>
    </StyledCard>
  );
};

export { StrategyCard };
export type { StrategyCardProps };
