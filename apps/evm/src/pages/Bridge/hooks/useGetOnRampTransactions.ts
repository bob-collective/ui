import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { BITCOIN } from '@gobob/tokens';
import { useAccount } from '@gobob/wagmi';
import { Address, isAddressEqual } from 'viem';

import { L2_CHAIN } from '../../../constants';
import { FeatureFlags, TokenData, useFeatureFlag, useTokens } from '../../../hooks';
import { electrsClient } from '../../../utils';
import { OnRampDepositSteps } from '../constants';
import { TransactionType } from '../types';
import { gatewayClient } from '../../../lib/bob-sdk';

type OnRampTransaction = {
  status: OnRampDepositSteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount: CurrencyAmount<ERC20Token>;
  type: TransactionType.OnRamp;
};

const getOnRampTransactions = async (address: Address, l2Tokens: TokenData[]): Promise<OnRampTransaction[]> => {
  const [orders, latestBlock] = await Promise.all([gatewayClient.getOrders(address), electrsClient.getLatestBlock()]);

  return (
    await Promise.all(
      orders.map(async (order): Promise<OnRampTransaction | undefined> => {
        const token = l2Tokens.find((token) => isAddressEqual(token.raw.address, order.token_address as Address));

        if (!token) return undefined;

        const amount = CurrencyAmount.fromRawAmount(BITCOIN, order.satoshis - order.fee);

        const txStatus = await electrsClient.getTxStatus(order.txid);

        const confirmations = txStatus.confirmed ? Number(latestBlock) - txStatus.block_height + 1 : 0;
        const hasEnoughConfirmations = confirmations >= order.tx_proof_difficulty_factor;

        const status: OnRampDepositSteps = !hasEnoughConfirmations
          ? 'btc-confirmation'
          : order.status
            ? 'l2-confirmation'
            : 'l2-processing';

        return {
          amount: CurrencyAmount.fromBaseAmount(token.currency as ERC20Token, amount.toExact()),
          btcTxId: order.txid,
          date: new Date(order.timestamp * 1000),
          confirmations,
          totalConfirmations: order.tx_proof_difficulty_factor,
          status,
          type: TransactionType.OnRamp
        };
      })
    )
  ).filter(Boolean) as OnRampTransaction[];
};

const useGetOnRampTransactions = () => {
  const { data: l2Tokens } = useTokens(L2_CHAIN);
  const { address } = useAccount();
  const isBtcOnRampEnabled = useFeatureFlag(FeatureFlags.BTC_ONRAMP);

  return useQuery({
    queryKey: ['onramp-transactions', address],
    queryFn: async () => getOnRampTransactions(address!, l2Tokens!),
    enabled: Boolean(address && l2Tokens && isBtcOnRampEnabled),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetOnRampTransactions };
export type { OnRampTransaction };
