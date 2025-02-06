import { CurrencyAmount, ERC20Token, Ether } from '@gobob/currency';
import { List, ListItem } from '@gobob/ui';
import { Chain } from 'viem';

import { useBridge } from '../../hooks';

import { ApprovalStep } from './ApprovalStep';
import { StartStep } from './StartStep';
import { WaitStep } from './WaitStep';
import { FinalStep } from './FinalStep';

import { BridgeToken } from '@/hooks';
import { BridgeTransaction, BridgeTransactionStatus } from '@/types';

type DepositTransactionListProps = {
  toChain: Chain;
  fromChain: Chain;
  currencyAmount: CurrencyAmount<Ether | ERC20Token>;
  selectedToken: BridgeToken;
  transaction?: BridgeTransaction;
  recipient?: string;
  descriptionId: string;
} & Omit<ReturnType<typeof useBridge>, 'withdraw'>;

const DepositTransactionList = ({
  fromChain,
  toChain,
  currencyAmount,
  selectedToken,
  approval,
  approvalGasEstimate,
  deposit,
  gasEstimate,
  transaction,
  recipient,
  descriptionId
}: DepositTransactionListProps): JSX.Element => {
  const handlePressStart = () => {
    deposit.mutate({
      currencyAmount,
      selectedToken,
      recipient
    });
  };

  return (
    <List aria-labelledby={descriptionId} gap='xs' marginTop='xs'>
      {
        (approval.isApproveRequired && (
          <ListItem backgroundColor='grey-500'>
            <ApprovalStep
              approval={approval}
              approvalGasEstimate={approvalGasEstimate}
              chain={fromChain}
              selectedToken={selectedToken}
            />
          </ListItem>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any
      }
      <ListItem backgroundColor='grey-500'>
        <StartStep
          chain={fromChain}
          gasEstimate={gasEstimate}
          isStarted={deposit.isPending}
          transactionHash={deposit.data?.transactionHash}
          onPressStart={handlePressStart}
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <WaitStep
          isComplete={transaction?.status === BridgeTransactionStatus.RELAYED}
          isLoading={transaction?.status === BridgeTransactionStatus.UNCONFIRMED_L1_TO_L2_MESSAGE}
          time='3 min'
        />
      </ListItem>
      <ListItem backgroundColor='grey-500'>
        <FinalStep
          currencyAmount={currencyAmount}
          fromChain={fromChain}
          isComplete={transaction?.status === BridgeTransactionStatus.RELAYED}
          toChain={toChain}
        />
      </ListItem>
    </List>
  );
};

export { DepositTransactionList };
