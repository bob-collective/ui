'use client';
import { ChevronDown, IconProps } from '@gobob/ui';
import {
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
  MetaMask: Metamask,
  'Trust Wallet': TrustWallet,
  WalletConnect: WalletConnect,
  WalletConnectLegacy: WalletConnect,
  'Coinbase Wallet': CoinbaseWallet,
  Ledger: Ledger,
  Xverse: Xverse,
  Leather: LeatherWallet,
  Unisat: UnisatWallet,
  Talisman: TalismanWallet,
  'OKX Wallet': OKXWallet,
  'Rabby Wallet': RabbyWallet
};

type WalletIconProps = Omit<IconProps, 'children'> & { name: string };

const WalletIcon = ({ name, ...props }: WalletIconProps) => {
  const Icon = name in Icons ? Icons[name] : Icons.Injected;

  return <Icon {...props} />;
};

export { WalletIcon };
export type { WalletIconProps };
