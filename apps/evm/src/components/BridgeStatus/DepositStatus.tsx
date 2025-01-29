import { Flex, FlexProps } from '@gobob/ui';

import { BridgeStep, getOngoingBridgeStep } from './BridgeStep';

import { BridgeTransaction } from '@/types';

type Props = { data: BridgeTransaction; isExpanded: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type DepositStatusProps = Props & InheritAttrs;

const DepositStatus = ({ data, isExpanded }: DepositStatusProps): JSX.Element => {
  if (!isExpanded) {
    const step = data.status ? getOngoingBridgeStep(data.status, data.direction) : undefined;

    return <BridgeStep data={data} step={step} />;
  }

  return (
    <Flex direction='column' gap='s'>
      <BridgeStep data={data} step='deposit' />
      <BridgeStep data={data} step='l2-confirmation' />
    </Flex>
  );
};

export { DepositStatus };
