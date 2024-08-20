import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import { Psbt } from 'bitcoinjs-lib';
import bs58check from 'bs58check';
/* @ts-ignore */

import { WalletNetwork } from '../types';
import { SnapError } from '../utils';

import { SatsConnector } from './base';

export enum BitcoinScriptType {
  P2WPKH = 'P2WPKH'
}

const getSnapNetwork = (network: WalletNetwork): Network => {
  switch (network) {
    default:
    case 'mainnet':
      return 'main';
    case 'testnet':
      return 'test';
  }
};

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);

function anyPubToXpub(xyzpub: string, network: bitcoin.Network) {
  let data = bs58check.decode(xyzpub);

  data = data.subarray(4);

  // force to xpub/tpub format
  const tpubPrefix = '043587cf';
  const xpubPrefix = '0488b21e';
  const prefix = network === bitcoin.networks.testnet ? tpubPrefix : xpubPrefix;

  data = Buffer.concat([Buffer.from(prefix, 'hex'), data]);

  return bs58check.encode(data);
}

function addressFromExtPubKey(xyzpub: string, network: bitcoin.Network) {
  const forcedXpub = anyPubToXpub(xyzpub, network);
  const pubkey = bip32.fromBase58(forcedXpub, network).derive(0).derive(0).publicKey;

  return bitcoin.payments.p2wpkh({ pubkey, network }).address;
}

const DEFAULT_BIP32_PATH = "m/84'/1'/0'/0/0";
// const hardcodedScriptType = BitcoinScriptType.P2WPKH;

interface ExtendedPublicKey {
  xpub: string;
  mfp: string;
}

type Network = 'main' | 'test';

declare global {
  interface Window {
    /* @ts-ignore */
    readonly ethereum: MetaMaskInpageProvider;
  }
}

const { ethereum } = window;

const snapId = 'npm:@gobob/bob-snap';

// TODO: distinguish between payment and oridnals address
class MMSnapConnector extends SatsConnector {
  extendedPublicKey: ExtendedPublicKey | undefined;
  snapNetwork: 'main' | 'test' = 'main';

  constructor(network: WalletNetwork) {
    super(network, 'metamask_snap', 'MetaMask', 'https://snaps.metamask.io/snap/npm/gobob/bob-snap/');
  }

  async connect(): Promise<void> {
    this.snapNetwork = getSnapNetwork(this.network);

    try {
      const result: any = await ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {}
        }
      });

      const hasError = !!result?.snaps?.[snapId]?.error;

      if (hasError) {
        throw new Error('Failed Connect');
      }
    } finally {
      // Switch in case current network is testnet
      if (this.snapNetwork === 'test') {
        await this.updateNetworkInSnap();
      }

      this.extendedPublicKey = await this.getExtendedPublicKey();
      this.publicKey = await this.getPublicKey();
      // Set the address to P2WPKH
      this.address = addressFromExtPubKey(this.extendedPublicKey.xpub, await this.getNetwork());
    }
  }

  async isReady(): Promise<boolean> {
    const snaps = await ethereum.request({
      method: 'wallet_getSnaps'
    });

    return Object.keys(snaps || {}).includes(snapId);
  }

  on(): void {}

  removeListener(): void {}

  async getExtendedPublicKey() {
    if (this.extendedPublicKey) {
      return this.extendedPublicKey;
    }

    try {
      return (await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'btc_getPublicExtendedKey',
            params: {
              network: this.snapNetwork,
              scriptType: BitcoinScriptType.P2WPKH
            }
          }
        }
      })) as ExtendedPublicKey;
    } catch (err: any) {
      const error = new SnapError(err?.message || 'Get extended public key failed');

      throw error;
    }
  }

  async getPublicKey(): Promise<string> {
    if (!this.extendedPublicKey) {
      throw new Error('Something wrong with connect');
    }

    const network = await this.getNetwork();

    // extKey.xpub is a vpub with purpose and cointype (mainnet vs testnet) path embedded
    // convert to xpub/tpub before getting pubkey
    const forcedXpub = anyPubToXpub(this.extendedPublicKey.xpub, await this.getNetwork());

    // child is m/84'/1'/0'/0/0 (same as DEFAULT_BIP32_PATH)
    const pubkey = bip32.fromBase58(forcedXpub, network).derive(0).derive(0).publicKey;

    return pubkey.toString('hex');
  }

  signMessage(): Promise<string> {
    throw new Error('Not implemented');
  }

  // FIXME: Refactor using btc-signer
  sendToAddress(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async signInput(inputIndex: number, psbt: Psbt) {
    try {
      const psbtBase64 = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'btc_signInput',
            params: {
              psbt: psbt.toBase64(),
              network: this.snapNetwork,
              scriptType: BitcoinScriptType.P2WPKH,
              inputIndex,
              path: DEFAULT_BIP32_PATH
            }
          }
        }
      });

      if (!psbtBase64) {
        throw new Error('');
      }

      return bitcoin.Psbt.fromBase64(psbtBase64 as string);
    } catch (err: any) {
      const error = new SnapError(err?.message || 'Sign Input failed');

      throw error;
    }
  }

  async getMasterFingerprint() {
    try {
      return await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'btc_getMasterFingerprint'
          }
        }
      });
    } catch (err: any) {
      const error = new SnapError(err?.message || 'Snap get master fingerprint failed');

      throw error;
    }
  }
  // FIXME: Refactor using btc-signer
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signPsbt(): Promise<string> {
    throw new Error('Not implemented');
  }

  async updateNetworkInSnap() {
    try {
      return await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'btc_network',
            params: {
              action: 'set',
              network: this.snapNetwork
            }
          }
        }
      });
    } catch (err: any) {
      const error = new SnapError(err?.message || 'Snap set Network failed');

      throw error;
    }
  }
}

export { MMSnapConnector };
