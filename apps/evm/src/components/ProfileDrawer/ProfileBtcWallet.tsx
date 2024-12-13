'use client';

import { WalletIcon } from '@dynamic-labs/wallet-book';
import { CurrencyAmount } from '@gobob/currency';
import { BTC } from '@gobob/icons';
import { BITCOIN } from '@gobob/tokens';
import { truncateBtcAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';

import { ProfileWallet } from './ProfileWallet';

import { useBtcAccount, useBtcBalance, useDynamicWallets } from '@/hooks';

type ProfileBtcWalletProps = {
  onPressConnect: () => void;
  onUnlink: (id: string) => void;
};

const ProfileBtcWallet = ({ onPressConnect, onUnlink }: ProfileBtcWalletProps): JSX.Element | null => {
  const { data: btcBalance } = useBtcBalance();
  const { address: btcAddress, connector: btcConnector } = useBtcAccount();
  const { btcWallet, evmWallet } = useDynamicWallets();

  return (
    <ProfileWallet
      address={btcAddress}
      avatar={<BTC size='xl' />}
      balanceLabel={`${CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total || 0).toSignificant()} BTC`}
      connectLabel={<Trans>Connect BTC Wallet</Trans>}
      isRemovable={!!evmWallet}
      truncatedAddress={truncateBtcAddress(btcAddress || '')}
      walletAvatar={
        btcConnector && <WalletIcon style={{ height: '1rem', width: '1rem' }} walletKey={btcConnector.key} />
      }
      walletId={btcWallet?.id}
      onPressConnect={onPressConnect}
      onUnlink={onUnlink}
    />
  );
};

export { ProfileBtcWallet };
