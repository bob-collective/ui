import { ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { useRouter } from 'next/navigation';
import { Address, Chain } from 'viem';
import { useAccount, useWatchAsset } from 'wagmi';
import { getCapitalizedChainName } from '@gobob/chains';

import { ProfileTokenListItem } from './ProfileTokenListItem';

import { L2_CHAIN, RoutesPath } from '@/constants';
import { TokenData, useBalances } from '@/hooks';
import { calculateAmountUSD } from '@/utils';

type ProfileTokenListProps = {
  items?: TokenData[];
  currentChain: Chain;
  otherChain: Chain;
  onPressNavigate?: () => void;
};

const ProfileTokenList = ({ items, currentChain, otherChain, onPressNavigate }: ProfileTokenListProps) => {
  const router = useRouter();

  const { watchAsset } = useWatchAsset();

  const { connector } = useAccount();

  const { getBalance: getBalance } = useBalances(currentChain.id);

  const { getPrice } = usePrices();

  const list = items?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }));

  const handlePressExplorer = (address: Address) => {
    window.open(`${currentChain?.blockExplorers?.default.url}/address/${address}`, '_blank', 'noreferrer');
  };

  const otherChainName = getCapitalizedChainName(otherChain.id);

  return list?.map((item) => {
    if (!item.balance?.greaterThan(0)) {
      return undefined;
    }

    const handlePressBridge = () => {
      if (currentChain.id === L2_CHAIN) {
        router.push(`${RoutesPath.BRIDGE}?type=withdraw&network=ethereum&receive=${item.token.currency.symbol}`);
      } else {
        router.push(`${RoutesPath.BRIDGE}?type=deposit&network=ethereum&receive=${item.token.currency.symbol}`);
      }

      onPressNavigate?.();
    };

    const handlePressAddErc20 = (currency: ERC20Token) => {
      watchAsset({
        type: 'ERC20',
        options: { address: currency.address, decimals: currency.decimals, symbol: currency.symbol }
      });
    };

    return (
      <ProfileTokenListItem
        key={item.token.raw.address}
        amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
        balance={item.balance && item.balance.toSignificant()}
        chainId={item.token.raw.chainId}
        connectorName={connector?.name}
        currency={item.token.currency}
        logoUrl={item.token.raw.logoUrl}
        name={item.token.raw.name}
        otherChainId={otherChain.id}
        otherChainName={otherChainName}
        onPressAddErc20={handlePressAddErc20}
        onPressBridge={handlePressBridge}
        onPressExplorer={handlePressExplorer}
      />
    );
  });
};

export { ProfileTokenList };
