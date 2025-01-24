import { ArrowTopRightOnSquare, Span } from '@gobob/ui';

import { StyledLoadingSpinner, StyledChip } from './StatusChip.style';
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

type StatusChipProps = {
  href?: string;
  label: string;
  status: BridgeStepStatus;
};

const StatusChip = ({ label, status, href }: StatusChipProps): JSX.Element => {
  const icon = getPillIcon(status);

  return (
    <StyledChip
      $status={status}
      as={href ? undefined : Span}
      href={href}
      size='xs'
      weight='medium'
      {...(href ? { external: true } : undefined)}
    >
      {icon}
      {label}
      {href && <ArrowTopRightOnSquare size='xs' />}
    </StyledChip>
  );
};

export { StatusChip };
