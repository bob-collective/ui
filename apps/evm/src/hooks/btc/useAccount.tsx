'use client';

import { getAddressInfo } from 'bitcoin-address-validation';
import { useMemo } from 'react';

import { useDynamicWallets } from '../dynamic';

const useBtcAccount = () => {
  const { btcWallet } = useDynamicWallets();

  const paymentAddress = btcWallet?.additionalAddresses.find((address) => address.type === 'payment');

  const btcAddress = useMemo(
    () =>
      paymentAddress
        ? { address: paymentAddress.address, publicKey: paymentAddress.publicKey }
        : btcWallet?.additionalAddresses.find((additionalAddress) => additionalAddress.address === btcWallet.address),
    [btcWallet?.additionalAddresses, btcWallet?.address, paymentAddress]
  );

  const addressType = useMemo(() => (btcAddress ? getAddressInfo(btcAddress.address).type : undefined), [btcAddress]);

  return {
    address: btcAddress?.address,
    publicKey: btcAddress?.publicKey,
    addressType,
    connector: btcWallet?.connector,
    additionalAddresses: btcWallet?.additionalAddresses,
    isAuthenticated: btcWallet?.isAuthenticated
  };
};

export { useBtcAccount };
