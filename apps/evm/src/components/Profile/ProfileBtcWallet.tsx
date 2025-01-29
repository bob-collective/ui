'use client';

import { CurrencyAmount } from '@gobob/currency';
import { BTC } from '@gobob/icons';
import { BITCOIN } from '@gobob/tokens';
import { truncateBtcAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';
import { WalletIcon } from '@dynamic-labs/wallet-book';

import { ProfileWallet } from './ProfileWallet';

import { useBtcAccount, useBtcBalance } from '@/hooks';

type ProfileBtcWalletProps = {
  onPressConnect: () => void;
  onUnlink: (id: string) => void;
};

const ProfileBtcWallet = ({ onPressConnect, onUnlink }: ProfileBtcWalletProps): JSX.Element | null => {
  const { data: btcBalance } = useBtcBalance();
  const { address } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();

  return (
    <ProfileWallet
      address={btcAddress}
      avatar={<BTC size='xl' />}
      balance={CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total || 0)}
      connectLabel={<Trans>Connect BTC Wallet</Trans>}
      isRemovable={!!address}
      truncatedAddress={truncateBtcAddress(btcAddress || '')}
      walletAvatar={
        btcConnector && <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
      }
      walletId={btcConnector?.key}
      onPressConnect={onPressConnect}
      onUnlink={onUnlink}
    />
  );
};

export { ProfileBtcWallet };
