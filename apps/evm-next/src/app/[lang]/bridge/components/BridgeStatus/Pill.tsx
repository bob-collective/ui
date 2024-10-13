import { ArrowTopRightOnSquare, Span } from '@gobob/ui';

import { Circle, CircleCheck, CircleX } from '../../icons';

import { StyledLoadingSpinner, StyledPill } from './BridgeStatus.style';

import { BridgeStepStatus } from '@/constants';

const getPillIcon = (status: BridgeStepStatus) => {
  switch (status) {
    case 'idle':
      return <Circle size='xs' />;
    case 'complete':
      return <CircleCheck size='xs' />;
    case 'failed':
      return <CircleX size='xs' />;
    default:
    case 'ongoing':
      return <StyledLoadingSpinner size='12' thickness={2} />;
  }
};

type PillProps = {
  href?: string;
  label: string;
  status: BridgeStepStatus;
};

const Pill = ({ label, status, href }: PillProps): JSX.Element => {
  const icon = getPillIcon(status);

  return (
    <StyledPill external $status={status} as={href ? undefined : Span} href={href} size='xs' weight='medium'>
      {icon}
      {label}
      {href && <ArrowTopRightOnSquare size='xs' />}
    </StyledPill>
  );
};

export { Pill };
