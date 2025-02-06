import { CheckCircle, Clock, Flex, P, Spinner } from '@gobob/ui';
import { Trans } from '@lingui/macro';

type WaitStepProps = {
  isLoading: boolean;
  isComplete: boolean;
  time: string;
};

const WaitStep = ({ time, isComplete, isLoading }: WaitStepProps) => (
  <Flex alignItems='center' gap='s' justifyContent='space-between' style={{ height: '100%' }}>
    <Flex alignItems='center' gap='s'>
      <Clock color='grey-50' size='xl' />
      <P weight='semibold'>
        <Trans>Wait {time}</Trans>
      </P>
    </Flex>
    {isComplete ? <CheckCircle color='green-500' /> : isLoading ? <Spinner /> : undefined}
  </Flex>
);

export { WaitStep };
