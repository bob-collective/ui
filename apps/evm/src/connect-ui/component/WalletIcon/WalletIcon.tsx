import { ChevronDown, IconProps } from '@gobob/ui';
import {
  BinanceWeb3Wallet,
  CoinbaseWallet,
  LeatherWallet,
  Ledger,
  Metamask,
  OKXWallet,
  RabbyWallet,
  TalismanWallet,
  TrustWallet,
  UnisatWallet,
  WalletConnect,
  Xverse
} from '@gobob/icons';

const Icons: Record<string, typeof Metamask> = {
  Injected: ChevronDown,
  'Binance Web3 Wallet': BinanceWeb3Wallet,
  MetaMask: Metamask,
  'Trust Wallet': TrustWallet,
  WalletConnect: WalletConnect,
  WalletConnectLegacy: WalletConnect,
  'Coinbase Wallet': CoinbaseWallet,
  Ledger: Ledger,
  Xverse: Xverse,
  Leather: LeatherWallet,
  UniSat: UnisatWallet,
  Talisman: TalismanWallet,
  'OKX Wallet': OKXWallet,
  'Rabby Wallet': RabbyWallet
};

type WalletIconProps = Omit<IconProps, 'children'> & { name: string };

const WalletIcon = ({ name, ...props }: WalletIconProps) => {
  const Icon = name in Icons ? Icons[name] : Icons.Injected;

  if (!Icon) return null;

  return <Icon {...props} />;
};

export { WalletIcon };
export type { WalletIconProps };
