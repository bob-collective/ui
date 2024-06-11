import { DefaultElectrsClient, RemoteSigner } from '@gobob/bob-sdk';
import { Network as LibNetwork, Psbt, Transaction, networks } from 'bitcoinjs-lib';
import * as bitcoin from 'bitcoinjs-lib';
import retry from 'async-retry';
import { createTransferWithOpReturn } from '@gobob/utils';
import { Transaction as SigTx } from '@scure/btc-signer';
import { hex } from '@scure/base';
import { AddressType, getAddressInfo } from 'bitcoin-address-validation';
import { NetworkType } from '@gobob/utils/src/btcNetwork';

import { WalletNetwork } from '../types';

type Address = string;

interface PsbtInputAccounts {
  address: string;
  signingIndexes: number[];
}

abstract class SatsConnector {
  /** Unique connector id */
  abstract readonly id: string;
  /** Connector name */
  abstract readonly name: string;
  /** Extension or Snap homepage */
  abstract homepage: string;

  /** Whether connector is usable */
  ready: boolean = false;

  // Address types depend on which wallet is connected
  // Xverse: payment (P2SH) and ordinals (P2TR)
  // UniSat: depends on the user selection in the extension
  // Leather: payment (P2WPKH) and ordinals (P2TR)
  // BOB MM Snap: payment (P2WPKH) and ordinals (P2TR)
  address: Address | undefined = '';
  ordinalsAddress: Address | undefined = '';
  paymentAddress: Address | undefined = '';

  publicKey: string | undefined;

  network: WalletNetwork;

  constructor(network: WalletNetwork) {
    this.network = network;
  }

  abstract connect(): Promise<void>;

  abstract sendToAddress(toAddress: string, amount: number): Promise<string>;

  abstract signMessage(message: string): Promise<string>;

  // Abstraction over the signing of a PSBT input
  // Unisat: https://docs.unisat.io/dev/unisat-developer-service/unisat-wallet#signpsbts
  // Xverse: https://docs.xverse.app/sats-connect/bitcoin-methods/signpsbt
  // Leather: https://leather.gitbook.io/developers/bitcoin-methods/signpsbt
  // NOTE: return string is hex encoded!
  abstract signPsbt(psbtHex: string, psbtInputAccounts: PsbtInputAccounts[]): Promise<string>;

  abstract isReady(): Promise<boolean>;

  disconnect() {
    this.address = undefined;
    this.paymentAddress = undefined;
    this.ordinalsAddress = undefined;
    this.publicKey = undefined;
  }

  getAccount(): string | undefined {
    return this.address;
  }

  getAddressType(): AddressType | undefined {
    if (!this.address) {
      return;
    }

    return getAddressInfo(this.address).type;
  }

  isAuthorized(): boolean {
    const address = this.getAccount();

    return !!address;
  }

  // Get bitcoinlib-js network
  async getNetwork(): Promise<LibNetwork> {
    switch (this.network) {
      case 'mainnet':
        return networks.bitcoin;
      case 'testnet':
        return networks.testnet;
      case 'regtest':
        return networks.regtest;
      default:
        throw new Error('Unknown network');
    }
  }

  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      throw new Error('Something went wrong while connecting');
    }

    return this.publicKey;
  }

  // TODO: verify if this works on mainnet
  async sendInscription(): Promise<string> {
    throw new Error('Not implemented');
    // if (!this.ordinalsAddress || !this.publicKey) {
    //   throw new Error('Connect wallet');
    // }

    // const network = await this.getNetwork();

    // const electrsClient = new DefaultElectrsClient(this.network as string);

    // const utxos = await electrsClient.getAddressUtxos(this.ordinalsAddress);

    // const inscriptionUtxo = await findUtxoForInscriptionId(electrsClient, utxos, inscriptionId);

    // if (inscriptionUtxo === undefined) {
    //   throw Error(
    //     `Unable to find utxo owned by address [${this.ordinalsAddress}] containing inscription id [${inscriptionId}]`
    //   );
    // }

    // const txHex = await electrsClient.getTransactionHex(inscriptionUtxo.txid);
    // const utx = Transaction.fromHex(txHex);

    // const witnessUtxo = {
    //   script: utx.outs[inscriptionUtxo.vout].script,
    //   value: inscriptionUtxo.value
    // };

    // const nonWitnessUtxo = utx.toBuffer();

    // let psbt = new Psbt({
    //   network
    // });

    // psbt.addInput({
    //   hash: inscriptionUtxo.txid,
    //   index: inscriptionUtxo.vout,
    //   witnessUtxo,
    //   nonWitnessUtxo,
    //   tapInternalKey: toXOnly(Buffer.from(this.publicKey, 'hex'))
    // });

    // const txSize = estimateTxSize(network, address);
    // const fee = txSize * feeRate;

    // psbt.addOutput({
    //   address,
    //   value: inscriptionUtxo.value - fee
    // });

    // psbt = await this.signInput(0, psbt);

    // psbt.finalizeAllInputs();

    // return electrsClient.broadcastTx(psbt.extractTransaction().toHex());
  }

  async getTransaction(txId: string): Promise<Transaction> {
    const electrsClient = new DefaultElectrsClient(this.network as string);

    return retry(
      async (bail) => {
        // if anything throws, we retry
        const txHex = await electrsClient.getTransactionHex(txId);

        if (!txHex) {
          bail(new Error('Failed'));
        }

        return Transaction.fromHex(txHex);
      },
      {
        retries: 20,
        minTimeout: 2000,
        maxTimeout: 5000
      } as any
    );
  }

  // TODO: verify this works on mainnet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async inscribe(): Promise<string> {
    throw new Error('Not implemented');
    // if (!this.ordinalsAddress) {
    //   throw new Error('Something went wrong while connecting');
    // }

    // const electrsClient = new DefaultElectrsClient(this.network as string);

    // let inscription;

    // if (contentType === 'image') {
    //   const buffer = Buffer.from(content, 'base64');

    //   inscription = createImageInscription(buffer);
    // } else {
    //   inscription = createTextInscription(content);
    // }

    // const feeRate = await electrsClient.getFeeEstimate(6);

    // const inscribeTx = await inscribeData(this.getSigner(), this.ordinalsAddress, feeRate, inscription);

    // return electrsClient.broadcastTx(inscribeTx.toHex());
  }

  // Supports creating a transaction from the payment address with an OP_RETURN output
  // Addresses from which can be spend are limited to:
  // - P2WPKH (Unisat)
  // - P2SH-P2WPKH (Xverse, Unisat)
  // - P2PKH (Unisat)
  // NOTE: does not broadcast the tx!
  async createTxWithOpReturn(toAddress: string, amount: number, opReturn: string): Promise<bitcoin.Transaction> {
    if (!this.paymentAddress) {
      throw new Error('Something went wrong while connecting');
    }

    let networkType: NetworkType;
    const networkStr = this.network.toString();

    if (NetworkType.isNetwork(networkStr)) {
      networkType = networkStr;
    } else {
      throw new Error('Invalid network');
    }

    const unsignedTransaction = await createTransferWithOpReturn(
      networkType,
      this.paymentAddress,
      toAddress,
      amount,
      opReturn,
      this.publicKey
    );

    // Determine how many inputs to sign
    const inputLength = unsignedTransaction.inputsLength;
    const inputsToSign = Array.from({ length: inputLength }, (_, i) => i);

    // Sign all inputs
    const psbt = unsignedTransaction.toPSBT(0);
    const psbtHex = hex.encode(psbt);

    // Sign all inputs with the payment address
    const signedPsbtHex = await this.signPsbt(psbtHex, [
      {
        address: this.paymentAddress,
        signingIndexes: inputsToSign
      }
    ]);

    const signedTx = SigTx.fromPSBT(Psbt.fromHex(signedPsbtHex).toBuffer());

    signedTx.finalize();

    return bitcoin.Transaction.fromBuffer(Buffer.from(signedTx.extract()));
  }

  // lib needs this signer
  // FIXME: need to update the SDK to reflect the refactor from `signInput` to `signPsbt`
  getSigner(): RemoteSigner {
    throw new Error('Not implemented');
    // return this;
  }
}

export { SatsConnector };
export type { PsbtInputAccounts };
