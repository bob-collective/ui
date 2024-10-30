import { FlexProps } from '@gobob/ui';

import { BridgeTransaction } from '../../hooks';

import { DepositStatus } from './DepositStatus';
import { WithdrawStatus } from './WithdrawStatus';

import { MessageDirection } from '@/types';

type Props = { data: BridgeTransaction; isExpanded: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type BridgeStatusProps = Props & InheritAttrs;

const BridgeStatus = ({ data, isExpanded }: BridgeStatusProps): JSX.Element => {
  if (data.direction === MessageDirection.L1_TO_L2) {
    return <DepositStatus data={data} isExpanded={isExpanded} />;
  }

  return <WithdrawStatus data={data} isExpanded={isExpanded} />;
};

export { BridgeStatus };
