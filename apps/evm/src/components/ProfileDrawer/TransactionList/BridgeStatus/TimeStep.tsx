import { Clock, Flex, FlexProps } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { formatDistanceToNow, isFuture } from 'date-fns';
import { ReactNode, useMemo } from 'react';

import { StyledTimePill } from './BridgeStatus.style';
import { BridgeStep } from './BridgeStep';

import { BridgeSteps, BridgeTransaction } from '@/types';

const TimeLabel = ({ label }: { label: ReactNode }) => (
  <StyledTimePill size='xs'>
    <Clock size='xs' />
    {label}
  </StyledTimePill>
);

type Props = {
  data: BridgeTransaction;
  step: Extract<BridgeSteps, 'state-root-published' | 'challenge-period'>;
  currentStep?: BridgeSteps;
};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type TimeStepProps = Props & InheritAttrs;

const TimeStep = ({ step, data, currentStep }: TimeStepProps): JSX.Element => {
  const timeLabel = useMemo(() => {
    // should only show step if it is not a complete step
    const showTime =
      (step === 'challenge-period'
        ? currentStep !== 'l1-confirmation' && currentStep !== 'relay'
        : currentStep === 'l2-confirmation' || currentStep === 'state-root-published') ||
      // when the current step is challenge period or state root, we should only show is the date is in the future
      (currentStep === step && data.statusEndDate && isFuture(data.statusEndDate));

    if (!showTime) return undefined;

    // show default duration estimate if step is still incomplete
    if (currentStep !== step || !data.statusEndDate) {
      return step === 'challenge-period' ? <Trans>7 days</Trans> : <Trans>2 hours</Trans>;
    }

    return <Trans>{formatDistanceToNow(data.statusEndDate)} remaining</Trans>;
  }, [step, currentStep, data.statusEndDate]);

  return (
    <Flex alignItems='center' flex={1} justifyContent='space-between'>
      <BridgeStep data={data} step={step} />
      {timeLabel && <TimeLabel label={timeLabel} />}
    </Flex>
  );
};

export { TimeStep };
