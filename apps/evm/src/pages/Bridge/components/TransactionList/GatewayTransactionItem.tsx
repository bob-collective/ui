import { Flex, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { L2_CHAIN } from '../../../../constants';
import { GatewayTransaction } from '../../../../hooks';
import { GatewayStatus } from '../BridgeStatus';
import { Type } from '../../Bridge';

import { TransactionDetails } from './TransactionDetails';

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
        toChainId={toChaindId}
        type={Type.Deposit}
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <GatewayStatus data={data} isExpanded={isExpanded} />
    </Flex>
  );
};

export { GatewayTransactionItem };
