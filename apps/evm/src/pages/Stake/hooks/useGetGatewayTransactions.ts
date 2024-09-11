import { CurrencyAmount, ERC20Token } from '@gobob/currency';
import { INTERVAL, useQuery } from '@gobob/react-query';
import { BITCOIN } from '@gobob/tokens';
import { useAccount } from '@gobob/wagmi';
import { Address, isAddressEqual } from 'viem';

import { L2_CHAIN } from '../../../constants';
import { FeatureFlags, TokenData, useFeatureFlag, useTokens } from '../../../hooks';
import { electrsClient } from '../../../utils';
import { GatewayDepositSteps } from '../constants';
import { TransactionType } from '../types';
import { gatewaySDK } from '../../../lib/bob-sdk';

type GatewayTransaction = {
  status: GatewayDepositSteps;
  date: Date;
  confirmations: number;
  totalConfirmations: number;
  btcTxId: string;
  amount: CurrencyAmount<ERC20Token>;
  type: TransactionType.Gateway;
};

const getGatewayTransactions = async (address: Address, l2Tokens: TokenData[]): Promise<GatewayTransaction[]> => {
  const [orders, latestBlock] = await Promise.all([gatewaySDK.getOrders(address), electrsClient.getLatestBlock()]);

  return (
    await Promise.all(
      orders.map(async (order): Promise<GatewayTransaction | undefined> => {
        const token = l2Tokens.find((token) => isAddressEqual(token.raw.address, order.tokenAddress as Address));

        if (!token) return undefined;

        const amount = CurrencyAmount.fromRawAmount(BITCOIN, order.satoshis - order.fee);

        const txStatus = await electrsClient.getTxStatus(order.txid);

        const confirmations = txStatus.confirmed ? Number(latestBlock) - txStatus.block_height + 1 : 0;
        const hasEnoughConfirmations = confirmations >= order.txProofDifficultyFactor;

        const status: GatewayDepositSteps = !hasEnoughConfirmations
          ? 'btc-confirmation'
          : order.status
            ? 'l2-confirmation'
            : 'l2-processing';

        return {
          amount: CurrencyAmount.fromBaseAmount(token.currency as ERC20Token, amount.toExact()),
          btcTxId: order.txid,
          date: new Date(order.timestamp * 1000),
          confirmations,
          totalConfirmations: order.txProofDifficultyFactor,
          status,
          type: TransactionType.Gateway
        };
      })
    )
  ).filter(Boolean) as GatewayTransaction[];
};

const useGetGatewayTransactions = () => {
  const { data: l2Tokens } = useTokens(L2_CHAIN);
  const { address } = useAccount();
  const isBtcGatewayEnabled = useFeatureFlag(FeatureFlags.BTC_GATEWAY);

  return useQuery({
    queryKey: ['gateway-transactions', address],
    queryFn: async () => getGatewayTransactions(address!, l2Tokens!),
    enabled: Boolean(address && l2Tokens && isBtcGatewayEnabled),
    refetchInterval: INTERVAL.SECONDS_30,
    gcTime: INTERVAL.MINUTE,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });
};

export { useGetGatewayTransactions };
