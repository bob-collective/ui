'use client';

import { CurrencyAmount } from '@gobob/currency';
import { BTC } from '@gobob/icons';
import { useBalance, useAccount as useSatsAccount } from '@gobob/sats-wagmi';
import { BITCOIN } from '@gobob/tokens';
import { truncateBtcAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { ProfileWallet } from './ProfileWallet';

import { WalletIcon } from '@/connect-ui';

type ProfileBtcWalletProps = {
  onPressConnect: () => void;
  onUnlink: (id: string) => void;
};

const ProfileBtcWallet = ({ onPressConnect, onUnlink }: ProfileBtcWalletProps): JSX.Element | null => {
  const { data: btcBalance } = useBalance();
  const { address } = useAccount();
  const { address: btcAddress, connector: btcConnector } = useSatsAccount();

  return (
    <ProfileWallet
      address={btcAddress}
      avatar={<BTC size='xl' />}
      balanceLabel={`${CurrencyAmount.fromRawAmount(BITCOIN, btcBalance?.total || 0).toSignificant()} BTC`}
      connectLabel={<Trans>Connect BTC Wallet</Trans>}
      isRemovable={!!address}
      truncatedAddress={truncateBtcAddress(btcAddress || '')}
      walletAvatar={btcConnector && <WalletIcon name={btcConnector.name} style={{ height: '1rem', width: '1rem' }} />}
      walletId={btcConnector?.id}
      onPressConnect={onPressConnect}
      onUnlink={onUnlink}
    />
  );
};

export { ProfileBtcWallet };
