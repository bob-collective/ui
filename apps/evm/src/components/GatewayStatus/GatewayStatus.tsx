import { Flex, FlexProps } from '@gobob/ui';

import { GatewayStep } from './GatewayStep';

import { GatewayTransaction } from '@/types';

type Props = { data: GatewayTransaction; isExpanded: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type GatewayStatusProps = Props & InheritAttrs;

const GatewayStatus = ({ data, isExpanded }: GatewayStatusProps): JSX.Element => {
  if (!isExpanded) {
    return <GatewayStep data={data} />;
  }

  return (
    <Flex direction='column' gap='s'>
      <GatewayStep data={data} step='btc-confirmation' />
      <GatewayStep data={data} step='l2-processing' />
    </Flex>
  );
};

export { GatewayStatus };
