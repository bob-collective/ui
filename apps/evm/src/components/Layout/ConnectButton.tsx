'use client';

import { Button, Drawer } from '@gobob/ui';
import { truncateBtcAddress, truncateEthAddress } from '@gobob/utils';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useState } from 'react';

import { useBtcAccount } from '@/hooks';

const ConnectButton = (): JSX.Element => {
  const { setShowAuthFlow } = useDynamicContext();

  const { address: evmAddress } = useAccount();
  const { address: btcAddress } = useBtcAccount();

  const [isOpen, setOpen] = useState(false);

  const isAuthenticated = evmAddress || btcAddress;

  if (!isAuthenticated) {
    const handleConnect = () => {
      setShowAuthFlow(true);
    };

    return (
      <Button onPress={handleConnect}>
        <Trans>Connect Wallet</Trans>
      </Button>
    );
  }

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onPress={handleOpen}>
        {evmAddress ? truncateEthAddress(evmAddress) : btcAddress ? truncateBtcAddress(btcAddress) : undefined}
      </Button>
      <Drawer isOpen={isOpen} onClose={handleClose}>
        Here
      </Drawer>
    </>
  );
};

export { ConnectButton };
