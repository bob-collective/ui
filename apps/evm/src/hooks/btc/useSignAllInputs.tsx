'use client';

import { base64 } from '@scure/base';
import { Transaction } from '@scure/btc-signer';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { useBtcAccount } from './useAccount';
import { useBtcDynamicWallet } from './useDynamicWallet';

import { bitcoinNetwork } from '@/constants';

type UseBtcSignAllInputsProps = {
  mutation?: Omit<UseMutationOptions<string, Error, string, unknown>, 'mutationFn' | 'mutationKey'>;
};

function useBtcSignAllInputs({ mutation }: UseBtcSignAllInputsProps = {}) {
  const btcWallet = useBtcDynamicWallet();

  const { address: btcAddress } = useBtcAccount();

  return useMutation({
    mutationKey: ['sats-sign-all-inputs', bitcoinNetwork],
    mutationFn: async (psbtBase64: string) => {
      if (!btcWallet || !btcAddress) {
        throw new Error('BTC Wallet not connected');
      }

      // Sign all inputs with the payment address
      const unsignedTx = Transaction.fromPSBT(base64.decode(psbtBase64));
      const inputLength = unsignedTx.inputsLength;
      const inputsToSign = Array.from({ length: inputLength }, (_, i) => i);
      const psbt = unsignedTx.toPSBT(0);

      // Define the parameters for signing the PSBT
      const params = {
        allowedSighash: [1],
        unsignedPsbtBase64: base64.encode(psbt),
        signature: [
          {
            address: btcAddress,
            signingIndexes: inputsToSign
          }
        ]
      };

      // Request the wallet to sign the PSBT
      const signedPsbt = await btcWallet.signPsbt(params);

      if (!signedPsbt) {
        throw new Error('Not signed');
      }

      const signedTx = Transaction.fromPSBT(base64.decode(signedPsbt.signedPsbt));

      signedTx.finalize();

      return signedTx.hex;
    },
    ...mutation
  });
}

export { useBtcSignAllInputs };
