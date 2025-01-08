import { Card, FlexProps } from '@gobob/ui';
import { useState } from 'react';

import { GatewayStatus } from '../GatewayStatus';

import { TransactionDetails } from './TransactionDetails';

import { L2_CHAIN } from '@/constants';
import { GatewayTransaction, TransactionDirection } from '@/types';

type Props = { data: GatewayTransaction };

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type GatewayTransactionItemProps = Props & InheritAttrs;

const GatewayTransactionItem = ({ data, ...props }: GatewayTransactionItemProps): JSX.Element => {
  const [isExpanded, setExpanded] = useState(false);

  const fromChaindId = 'BTC';
  const toChaindId = L2_CHAIN;

  return (
    <Card background='grey-600' direction='column' gap='md' padding='lg' rounded='md' {...props}>
      <TransactionDetails
        amount={data.amount}
        date={data.date}
        direction={TransactionDirection.L1_TO_L2}
        fromChainId={fromChaindId}
        isPending={data.isPending}
        logoUrl={data.logoUrl}
        toChainId={toChaindId}
        onExpand={() => setExpanded((isExpanded) => !isExpanded)}
      />
      <GatewayStatus data={data} isExpanded={isExpanded} />
    </Card>
  );
};

export { GatewayTransactionItem };
