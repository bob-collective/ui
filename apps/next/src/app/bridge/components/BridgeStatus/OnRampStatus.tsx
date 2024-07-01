import { Flex, FlexProps } from '@gobob/ui';

import { OnRampTransaction } from '../../hooks';

import { OnRampStep } from './OnRampStep';

type Props = { data: OnRampTransaction; isExpanded: boolean };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type OnRampStatusProps = Props & InheritAttrs;

const OnRampStatus = ({ data, isExpanded }: OnRampStatusProps): JSX.Element => {
  if (!isExpanded) {
    return <OnRampStep data={data} />;
  }

  return (
    <Flex direction='column' gap='s'>
      <OnRampStep data={data} step='btc-confirmation' />
      <OnRampStep data={data} step='l2-processing' />
    </Flex>
  );
};

export { OnRampStatus };
