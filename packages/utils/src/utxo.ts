import { DefaultEsploraClient, EsploraClient, UTXO } from '@gobob/bob-sdk';
import { DefaultOrdinalsClient, TESTNET_ORD_BASE_PATH } from '@gobob/bob-sdk/dist/ordinal-api';
import { Transaction, Script, selectUTXO, TEST_NETWORK, NETWORK, p2wpkh, p2sh } from '@scure/btc-signer';
import { hex } from '@scure/base';
import { AddressType } from 'bitcoin-address-validation';
import * as bitcoin from 'bitcoinjs-lib';

import { getTxInscriptions, parseInscriptionId } from './inscription';
import { NetworkType, getBtcNetwork } from './btcNetwork';

// Confirmation target for fee estimation in Bitcoin blocks
export const CONFIRMATION_TARGET = 6;

/// The sequence number that enables replace-by-fee and absolute lock time but
/// disables relative lock time.
const ENABLE_RBF_NO_LOCKTIME = 0xfffffffd;

interface InscriptionUTXO {
  value: number;
  script_pubkey: string;
  address: string;
  transaction: string;
  sat_ranges: string;
  inscriptions: string[];
  runes: Record<string, any>;
}

export interface Input {
  txid: string;
  index: number;
  sequence: number;
  witness_script?: Uint8Array;
  redeem_script?: Uint8Array;
  witnessUtxo?: {
    script: Uint8Array;
    amount: bigint;
  };
  nonWitnessUtxo?: Uint8Array;
}

export async function findUtxoForInscriptionId(
  esploraClient: EsploraClient,
  utxos: UTXO[],
  inscriptionId: string
): Promise<UTXO | undefined> {
  // TODO: can we get the current UTXO of the inscription from ord?
  // we can use the satpoint for this
  const { txid, index } = parseInscriptionId(inscriptionId);

  for (const utxo of utxos) {
    if (utxo.confirmed) {
      const res = await fetch(`${TESTNET_ORD_BASE_PATH}/output/${utxo.txid}:${utxo.vout}`, {
        headers: {
          Accept: 'application/json'
        }
      });

      const inscriptionUtxo: InscriptionUTXO = await res.json();

      if (inscriptionUtxo.inscriptions && inscriptionUtxo.inscriptions.includes(inscriptionId)) {
        return utxo;
      }
    } else if (txid == utxo.txid) {
      const inscriptions = await getTxInscriptions(esploraClient, utxo.txid);

      if (typeof inscriptions[index] !== 'undefined') {
        return utxo;
      }
    }
  }

  return undefined;
}

export async function findUtxosWithoutInscriptions(network: string, utxos: UTXO[]): Promise<UTXO[]> {
  const ordinalsClient = new DefaultOrdinalsClient(network);

  const safeUtxos: UTXO[] = [];

  // Exclude UTXOs that are uncomfirmed or have inscriptions
  await Promise.all([
    utxos.map(async (utxo) => {
      if (utxo.confirmed) {
        const inscription = await ordinalsClient.getInscriptionsFromOutPoint({
          txid: utxo.txid,
          vout: utxo.vout
        });

        if (inscription.inscriptions.length === 0) {
          safeUtxos.push(utxo);
        }
      }
    })
  ]);

  return safeUtxos;
}

export async function createTransferWithOpReturn(
  network: NetworkType,
  paymentAddress: string,
  toAddress: string,
  amount: number,
  opReturn: string,
  addressType: string,
  publicKey?: string
): Promise<Transaction> {
  const electrsClient = new DefaultEsploraClient(network);

  // eslint-disable-next-line no-console
  console.log('Payment address:', paymentAddress);
  // eslint-disable-next-line no-console
  console.log('To address:', toAddress);

  // NOTE: Electrs only returns the 25 most recent UTXOs
  // TODO: change this to use the pagination API and return all UTXOs
  const [confirmedUtxos, feeRate] = await Promise.all([
    electrsClient.getAddressUtxos(paymentAddress),
    electrsClient.getFeeEstimate(CONFIRMATION_TARGET)
  ]);

  if (confirmedUtxos.length === 0) {
    throw new Error('No confirmed UTXOs');
  }

  // To construct the spending transaction and estimate the fee, we need the transactions for the UTXOs
  let possibleInputs: Input[] = [];

  await Promise.all(
    confirmedUtxos.map(async (utxo) => {
      const hex = await electrsClient.getTransactionHex(utxo.txid);

      const transaction = Transaction.fromRaw(Buffer.from(hex, 'hex'), { allowUnknownOutputs: true });

      const input = getInputFromUtxoAndTransaction(network, utxo, transaction, addressType, publicKey);

      possibleInputs.push(input);
    })
  );

  // Strip 0x prefix from opReturn
  if (opReturn.startsWith('0x')) {
    opReturn = opReturn.slice(2);
  }
  const outputs = [
    {
      address: toAddress,
      amount: BigInt(amount)
    },
    {
      // OP_RETURN https://github.com/paulmillr/scure-btc-signer/issues/26
      script: Script.encode(['RETURN', hex.decode(opReturn)]),
      amount: BigInt(0)
    }
  ];

  // Outsource UTXO selection to btc-signer
  // https://github.com/paulmillr/scure-btc-signer?tab=readme-ov-file#utxo-selection
  // default = exactBiggest/accumBiggest creates tx with smallest fees, but it breaks
  // big outputs to small ones, which in the end will create a lot of outputs close to dust.
  const signerNetwork = network === 'mainnet' ? NETWORK : TEST_NETWORK;
  const transaction = selectUTXO(possibleInputs, outputs, 'default', {
    changeAddress: paymentAddress, // Refund surplus to the payment address
    feePerByte: BigInt(Math.ceil(feeRate)), // round up to the nearest integer
    bip69: true, // Sort inputs and outputs according to BIP69
    createTx: true, // Create the transaction
    network: signerNetwork,
    allowUnknownOutputs: true, // Required for OP_RETURN
    allowLegacyWitnessUtxo: true // Required for P2SH-P2WPKH
  });

  if (!transaction || !transaction.tx) {
    throw new Error('Failed to create transaction. Do you have enough funds?');
  }

  return transaction.tx;
}

// Using the UTXO and the transaction, we can construct the input for the transaction
export function getInputFromUtxoAndTransaction(
  network: NetworkType,
  utxo: UTXO,
  transaction: Transaction,
  addressType: string,
  pubKey?: string
): Input {
  // The output containts the necessary details to spend the UTXO based on the script type
  // Under the hood, @scure/btc-signer parses the output and extracts the script and amount
  const output = transaction.getOutput(utxo.vout);

  // For p2sh, we additionally need the redeem script. This cannot be extracted from the transaction itself
  // We only support P2SH-P2WPKH
  // TODO: add support for P2WSH
  // TODO: add support for P2SH-P2PKH
  let redeemScript = {};

  if (addressType === AddressType.p2sh) {
    const inner = p2wpkh(Buffer.from(pubKey!, 'hex'), getBtcNetwork(network));

    redeemScript = p2sh(inner);
  }

  // For the redeem and witness script, we need to construct the script mixin
  const scriptMixin = {
    ...redeemScript
  };

  // eslint-disable-next-line no-console
  console.log('Script mixin:', scriptMixin);
  // eslint-disable-next-line no-console
  console.log('Output:', output);

  const nonWitnessUtxo = {
    nonWitnessUtxo: Buffer.from(transaction.hex, 'hex')
  };
  const witnessUtxo = {
    witnessUtxo: {
      script: output.script!,
      amount: output.amount!
    }
  };
  const witnessMixin = transaction.hasWitnesses ? witnessUtxo : nonWitnessUtxo;

  // Construct inputs based on the script type
  const input = {
    txid: utxo.txid,
    index: utxo.vout,
    sequence: ENABLE_RBF_NO_LOCKTIME,
    ...scriptMixin, // Maybe adds the redeemScript and/or witnessScript
    ...witnessMixin // Adds the witnessUtxo or nonWitnessUtxo
  };

  // eslint-disable-next-line no-console
  console.log('Input:', input);

  return input;
}

export function estimateTxFee(feeRate: number, numInputs: number = 1) {
  const tx = new bitcoin.Transaction();

  for (let i = 0; i < numInputs; i++) {
    tx.addInput(Buffer.alloc(32, 0), 0, 0xfffffffd, Buffer.alloc(0));
  }
  // https://github.com/interlay/interbtc-clients/blob/6bd3e81d695b93180c5aeae4f33910ad4395ff1a/bitcoin/src/light/wallet.rs#L80
  tx.ins.map((tx_input) => (tx_input.witness = [Buffer.alloc(33 + 32 + 7, 0), Buffer.alloc(33, 0)]));
  tx.addOutput(Buffer.alloc(22, 0), 1000); // P2WPKH
  tx.addOutput(Buffer.alloc(22, 0), 1000); // P2WPKH (change)
  tx.addOutput(bitcoin.script.compile([bitcoin.opcodes.OP_RETURN, Buffer.alloc(20, 0)]), 0);
  const vsize = tx.virtualSize();
  const satoshis = feeRate * vsize;

  return satoshis;
}
