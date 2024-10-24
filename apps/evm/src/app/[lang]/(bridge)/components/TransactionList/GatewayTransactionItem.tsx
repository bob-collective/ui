import { Flex, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { GatewayStatus } from '../BridgeStatus';
import { Type } from '../../bridge/Bridge';

import { TransactionDetails } from './TransactionDetails';

import { L2_CHAIN } from '@/constants';
import { GatewayTransaction } from '@/hooks';

type Props = { data: GatewayTransaction };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type GatewayTransactionItemProps = Props & InheritAttrs;

const GatewayTransactionItem = ({ data, ...props }: GatewayTransactionItemProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);

  const fromChaindId = 'BTC';
  const toChaindId = L2_CHAIN;

  return (
    <Flex direction='column' gap='md' {...props}>
      <TransactionDetails
        amount={data.amount}
        date={data.date}
        fromChainId={fromChaindId}
        isPending={data.isPending}
        toChainId={toChaindId}
        type={Type.Deposit}
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <GatewayStatus data={data} isExpanded={isExpanded} />
    </Flex>
  );
};

export { GatewayTransactionItem };
