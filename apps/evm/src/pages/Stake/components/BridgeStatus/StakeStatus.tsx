import { Flex, FlexProps } from '@gobob/ui';

import { BridgeTransaction } from '../../hooks';
import { getOngoingStakeStep } from '../../utils';

import { StakeStep } from './StakeStep';

type Props = { data: BridgeTransaction; isExpanded: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type DepositStatusProps = Props & InheritAttrs;

const StakeStatus = ({ data, isExpanded }: DepositStatusProps): JSX.Element => {
  if (!isExpanded) {
    const step = data.status ? getOngoingStakeStep(data.status, data.direction) : undefined;

    return <StakeStep data={data} step={step} />;
  }

  return (
    <Flex direction='column' gap='s'>
      <StakeStep data={data} step='stake' />
      <StakeStep data={data} step='l2-confirmation' />
    </Flex>
  );
};

export { StakeStatus };
