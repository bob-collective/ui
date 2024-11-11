/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Sentry from '@sentry/nextjs';
import { getContract, createPublicClient, toHex, http, encodePacked, isAddress, Address } from 'viem';
import { sign, privateKeyToAddress } from 'viem/accounts';
import { toPackedUserOperation } from 'viem/account-abstraction';
import { bob, bobSepolia } from '@gobob/wagmi';

import { CHAIN } from '@/constants';
import { paymasterAbi } from '@/abis/paymaster.abi';

const provider = createPublicClient({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chain: CHAIN === bob.id ? bob : bobSepolia,
  transport: http()
});

export async function GET() {
  return Response.json('TEST', { status: 200 });
}

export async function POST(request: Request) {
  try {
    const userOperationRaw = await request.json();

    console.log(userOperationRaw, `Received request`);

    const userOperation = {
      ...userOperationRaw,
      verificationGasLimit: BigInt(userOperationRaw.verificationGasLimit),
      callGasLimit: BigInt(userOperationRaw.callGasLimit),
      maxFeePerGas: BigInt(userOperationRaw.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(userOperationRaw.maxPriorityFeePerGas),
      nonce: BigInt(userOperationRaw.nonce),
      paymasterPostOpGasLimit: BigInt(userOperationRaw.paymasterPostOpGasLimit),
      paymasterVerificationGasLimit: BigInt(userOperationRaw.paymasterVerificationGasLimit),
      preVerificationGas: BigInt(userOperationRaw.preVerificationGas)
    };

    const guarantorPrivateKey = process.env.NEXT_GUARANTOR_PRIVATE_KEY;

    if (!guarantorPrivateKey || !isAddress(guarantorPrivateKey)) {
      throw new Error('Invalid guarantor private key');
    }

    const validAfter = 0;
    const validUntil = Math.floor(Date.now() / 1000 + 3600); // valid for 1 hour

    const erc20Paymaster = getContract({
      abi: paymasterAbi,
      address: userOperation.paymaster, // a bit of a security issue, but gives us flexability for now. Just don't approve any contracts except the paymasters
      client: provider
    });

    // getting the hash to sign
    const hash = await erc20Paymaster.read.getHash([toPackedUserOperation(userOperation), validUntil, validAfter, 0n]);

    // signing the hash
    const { r, s, v } = await sign({ hash, privateKey: guarantorPrivateKey });

    // Ensure the hex strings are exactly 64 characters long, otherwise encodePacked will throw an error
    const pad = (x: Address) => ('0x' + x.substring(2).padStart(64, '0')) as Address;
    const signature = encodePacked(['bytes32', 'bytes32', 'uint8'], [pad(r), pad(s), Number(v)]);

    // creating paymaster and data for a Mode2 sponsor
    const mode2PaymasterData = encodePacked(
      ['bytes1', 'address', 'bytes6', 'bytes6', 'bytes'],
      [
        '0x02',
        privateKeyToAddress(guarantorPrivateKey),
        toHex(validUntil, { size: 6 }),
        toHex(validAfter, { size: 6 }),
        signature
      ]
    );

    // @ts-expect-error
    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };

    console.log(`Paymaster Data: ${mode2PaymasterData}`);

    return Response.json({ paymasterData: mode2PaymasterData }, { status: 200 });
  } catch (error) {
    console.error('Error from guarantor endpoint: ', error);

    Sentry.captureException(error);

    return Response.json('Internal Guarantor Error', { status: 500 });
  }
}
