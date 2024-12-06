import { ChainId } from '@gobob/chains';
import { ArbitrumOne, BNB, BOBLogo, BTC, Base, Bitlayer, ETH, Merlin, Moonbeam, Optimism, Polygon } from '@gobob/icons';
import { IconProps } from '@gobob/ui';
import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';

// TODO: temp
const chainLogo: Record<
  ChainId,
  ForwardRefExoticComponent<PropsWithoutRef<IconProps> & RefAttributes<SVGSVGElement>>
> = {
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
  [ChainId.MOONBEAM]: Moonbeam,
  [ChainId.BITLAYER]: Bitlayer,
  [ChainId.MERLIN]: Merlin
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
