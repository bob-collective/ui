import { WalletNetwork } from '../types';

import { PsbtInputAccounts, SatsConnector } from './base';

const getLibNetwork = (network: Network): WalletNetwork => {
  switch (network) {
    case 'livenet':
      return 'mainnet';
    case 'testnet':
      return 'testnet';
  }
};

const getUnisatNetwork = (network: WalletNetwork): Network => {
  switch (network) {
    default:
    case 'mainnet':
      return 'livenet';
    case 'testnet':
      return 'testnet';
  }
};

type AccountsChangedEvent = (event: 'accountsChanged', handler: (accounts: Array<string>) => void) => void;

type Inscription = {
  inscriptionId: string;
  inscriptionNumber: string;
  address: string;
  outputValue: string;
  content: string;
  contentLength: string;
  contentType: string;
  preview: string;
  timestamp: number;
  offset: number;
  genesisTransaction: string;
  location: string;
};

type getInscriptionsResult = { total: number; list: Inscription[] };

type SendInscriptionsResult = { txid: string };

type Balance = { confirmed: number; unconfirmed: number; total: number };

type Network = 'livenet' | 'testnet';

type Unisat = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  on: AccountsChangedEvent;
  removeListener: AccountsChangedEvent;
  getInscriptions: (cursor: number, size: number) => Promise<getInscriptionsResult>;
  sendInscription: (
    address: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ) => Promise<SendInscriptionsResult>;
  switchNetwork: (network: 'livenet' | 'testnet') => Promise<void>;
  getNetwork: () => Promise<Network>;
  getPublicKey: () => Promise<string>;
  getBalance: () => Promise<Balance>;
  sendBitcoin: (address: string, atomicAmount: number, options?: { feeRate: number }) => Promise<string>;
  signPsbt: (
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      }[];
    }
  ) => Promise<string>;
  signMessage: (msg: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
};

declare global {
  interface Window {
    unisat: Unisat;
  }
}

class UnisatConnector extends SatsConnector {
  id = 'unisat';
  name = 'Unisat';
  homepage = 'https://unisat.io/';

  constructor(network: WalletNetwork) {
    super(network);
  }

  async connect(): Promise<void> {
    const network = await window.unisat.getNetwork();
    const mappedNetwork = getLibNetwork(network);

    if (mappedNetwork !== this.network) {
      const expectedNetwork = getUnisatNetwork(this.network);

      await window.unisat.switchNetwork(expectedNetwork);
    }

    const [accounts, publicKey] = await Promise.all([window.unisat.requestAccounts(), window.unisat.getPublicKey()]);

    this.address = accounts[0];
    this.paymentAddress = accounts[0];
    this.ordinalsAddress = accounts[0];
    this.publicKey = publicKey;

    window.unisat.on('accountsChanged', this.changeAccount);
  }

  disconnect() {
    this.address = undefined;
    this.publicKey = undefined;

    window.unisat.removeListener('accountsChanged', this.changeAccount);
  }

  signMessage(message: string) {
    return window.unisat.signMessage(message);
  }

  async changeAccount([account]: string[]) {
    this.address = account;
    this.publicKey = await window.unisat.getPublicKey();
  }

  async isReady() {
    this.ready = typeof window.unisat !== 'undefined';

    return this.ready;
  }

  async sendToAddress(toAddress: string, amount: number): Promise<string> {
    return window.unisat.sendBitcoin(toAddress, amount);
  }

  async signPsbt(psbtHex: string, psbtInputAccounts: PsbtInputAccounts[]): Promise<string> {
    // https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet#signpsbt
    const publicKey = await this.getPublicKey();

    // Extract all inputs to be signed
    let inputs: number[] = [];

    for (const input of psbtInputAccounts) {
      for (const index of input.signingIndexes) {
        inputs.push(index);
      }
    }
    const toSignInputs = inputs.map((index) => {
      return {
        index,
        publicKey,
        disableTweakSigner: true
      };
    });

    const signedPsbtHex = await window.unisat.signPsbt(psbtHex, {
      autoFinalized: false,
      toSignInputs: toSignInputs
    });

    return signedPsbtHex;
  }

  // async sendInscription(address: string, inscriptionId: string, feeRate?: number): Promise<string> {
  //   return (await window.unisat.sendInscription(address, inscriptionId, feeRate ? { feeRate } : undefined)).txid;
  // }
}

export { UnisatConnector };
