import { ArrowTopRightOnSquare, Span } from '@gobob/ui';

import { StyledLoadingSpinner, StyledPill } from './TransactionPill.style';
import { Circle } from './Circle';
import { CircleCheck } from './CircleCheck';
import { CircleX } from './CircleX';

import { BridgeStepStatus } from '@/types';

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

type TransactionPillProps = {
  href?: string;
  label: string;
  status: BridgeStepStatus;
};

const TransactionPill = ({ label, status, href }: TransactionPillProps): JSX.Element => {
  const icon = getPillIcon(status);

  return (
    <StyledPill external $status={status} as={href ? undefined : Span} href={href} size='xs' weight='medium'>
      {icon}
      {label}
      {href && <ArrowTopRightOnSquare size='xs' />}
    </StyledPill>
  );
};

export { TransactionPill };
