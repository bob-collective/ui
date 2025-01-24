import { getCapitalizedChainName } from '@gobob/chains';
import { Currency, ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { Avatar } from '@gobob/ui';
import { useRouter } from 'next/navigation';
import { Address, Chain } from 'viem';
import { useAccount, useWatchAsset } from 'wagmi';

import { ChainAsset } from '../ChainAsset';

import { StyledMissingImageLogo } from './Profile.style';
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

  const { getBalance } = useBalances(currentChain.id);

  const { getPrice } = usePrices();

  const list = items?.map((token) => ({ token, balance: getBalance(token.currency.symbol) }));

  const handlePressExplorer = (address: Address) => {
    window.open(`${currentChain?.blockExplorers?.default.url}/address/${address}`, '_blank', 'noreferrer');
  };

  const otherChainName = getCapitalizedChainName(otherChain.id);

  const handlePressAddErc20 = (currency: ERC20Token) => {
    watchAsset({
      type: 'ERC20',
      options: { address: currency.address, decimals: currency.decimals, symbol: currency.symbol }
    });
  };

  const handlePressBridge = (currency: Currency) => {
    if (currentChain.id === L2_CHAIN) {
      router.push(`${RoutesPath.BRIDGE}?type=withdraw&network=ethereum&receive=${currency.symbol}`);
    } else {
      router.push(`${RoutesPath.BRIDGE}?type=deposit&network=ethereum&receive=${currency.symbol}`);
    }

    onPressNavigate?.();
  };

  return list?.map((item) => {
    if (!item.balance?.greaterThan(0)) {
      return undefined;
    }

    return (
      <ProfileTokenListItem
        key={`${item.token.raw.address}${item.token.currency.chainId}`}
        amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
        balance={item.balance && item.balance.toSignificant()}
        connectorName={connector?.name}
        currency={item.token.currency}
        logo={
          <ChainAsset
            asset={
              item.token.raw.logoUrl ? (
                <Avatar alt={item.token.raw.name} size='5xl' src={item.token.raw.logoUrl} />
              ) : (
                <StyledMissingImageLogo>{item.token.raw.symbol.toUpperCase().slice(0, 3)}</StyledMissingImageLogo>
              )
            }
            chainId={item.token.raw.chainId}
            chainProps={{ size: 'xs' }}
          />
        }
        name={item.token.raw.name}
        otherChainId={otherChain.id}
        otherChainName={otherChainName}
        onPressAddErc20={handlePressAddErc20}
        onPressBridge={item.token.raw.bridgeDisabled ? undefined : handlePressBridge}
        onPressExplorer={handlePressExplorer}
      />
    );
  });
};

export { ProfileTokenList };
