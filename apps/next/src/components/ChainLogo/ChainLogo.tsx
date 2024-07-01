import { ChainId } from '@gobob/chains';
import { ArbitrumOne, BNB, BOBLogo, BTC, Base, ETH, Moonbeam, Optimism, Polygon } from '@gobob/icons';
import { IconProps } from '@gobob/ui';

// TODO: temp
const chainLogo: Record<ChainId, any> = {
  [ChainId.BOB]: BOBLogo,
  [ChainId.BOB_SEPOLIA]: BOBLogo,
  [ChainId.ETHEREUM]: ETH,
  [ChainId.SEPOLIA]: ETH,
  [ChainId.ARBITRUM_ONE]: ArbitrumOne,
  [ChainId.BASE]: Base,
  [ChainId.OP]: Optimism,
  [ChainId.BSC]: BNB,
  [ChainId.OPBNB]: BNB,
  [ChainId.POLYGON_ZKEVM]: Polygon,
  [ChainId.POLYGON]: Polygon,
  [ChainId.MOONBEAM]: Moonbeam
};

type Props = {
  chainId: ChainId | 'BTC';
};

type InheritAttrs = Omit<IconProps, keyof Props>;

type ChainLogoProps = Props & InheritAttrs;

const ChainLogo = ({ chainId, ...props }: ChainLogoProps) => {
  const Logo = chainId === 'BTC' ? BTC : chainLogo[chainId];

  return <Logo {...props} />;
};

export { ChainLogo };
export type { ChainLogoProps };
