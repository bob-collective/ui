'use client';

import { BitcoinWallet } from '@dynamic-labs/bitcoin';
import { useUserWallets } from '@dynamic-labs/sdk-react-core';

type UserBtcDynamicWalletReturnType = BitcoinWallet | undefined;

// internal
const useBtcDynamicWallet = (): UserBtcDynamicWalletReturnType => {
  const userWallets = useUserWallets();

  return userWallets.find((wallet) => wallet.chain === 'BTC') as BitcoinWallet | undefined;

  // if (!wallet) return undefined;

  // const signAllInputs = useCallback(
  //   async (psbtBase64: string) => {
  //     if (!wallet) {
  //       throw new Error('BTC Wallet not connected');
  //     }

  //     const paymentAddress = wallet?.additionalAddresses.find((address) => address.type === 'payment');

  //     if (!paymentAddress) {
  //       throw new Error('Missing payment address');
  //     }

  //     // Sign all inputs with the payment address
  //     const unsignedTx = Transaction.fromPSBT(base64.decode(psbtBase64));
  //     const inputLength = unsignedTx.inputsLength;
  //     const inputsToSign = Array.from({ length: inputLength }, (_, i) => i);
  //     const psbt = unsignedTx.toPSBT(0);

  //     // Define the parameters for signing the PSBT
  //     const params = {
  //       allowedSighash: [1],
  //       unsignedPsbtBase64: base64.encode(psbt),
  //       signature: [
  //         {
  //           address: paymentAddress.address,
  //           signingIndexes: inputsToSign
  //         }
  //       ]
  //     };

  //     // Request the wallet to sign the PSBT
  //     const signedPsbt = await wallet.signPsbt(params);

  //     if (!signedPsbt) {
  //       throw new Error('Not signed');
  //     }

  //     const signedTx = Transaction.fromPSBT(base64.decode(signedPsbt.signedPsbt));

  //     signedTx.finalize();

  //     return signedTx.hex;
  //   },
  //   [wallet]
  // );

  // return {
  //   ...wallet,
  //   signAllInputs
  // };
};

export { useBtcDynamicWallet };
