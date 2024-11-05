import { isZeroDevConnector } from '@dynamic-labs/ethereum-aa';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ChainId } from '@gobob/chains';
import { Currency } from '@gobob/currency';
import { createKernelAccountClient } from '@zerodev/sdk';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { createPimlicoBundlerClient } from 'permissionless/clients/pimlico';
import { useMemo } from 'react';
import { Address, http } from 'viem';
import { useAccount } from '@gobob/wagmi';

import { CHAIN } from '../constants';

const bundler = {
  [ChainId.BOB]: `https://api.pimlico.io/v2/60808/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
};

const getBundlerByChainId = (chainId: ChainId) => {
  return bundler[chainId as ChainId.BOB];
};

type Paymasters = Record<ChainId.BOB, Record<string, Address>>;

const paymasters: Paymasters = {
  [ChainId.BOB]: {
    WBTC: '0x000000003CE83Ad13E6A53658Eb03179a37411AE',
    USDC: '0x00000000D00a8A2AdA5EE8c162C90B6e7A05e970',
    USDT: '0x000000009f6044DD489C2e2351AdbD9F52C3ABe7'
  }
};

const useKernelClient = (gasToken?: Currency) => {
  const { chain } = useAccount();
  const { primaryWallet } = useDynamicContext();

  const { connector } = primaryWallet || {};

  const bundlerClient = useMemo(
    () =>
      chain &&
      createPimlicoBundlerClient({
        transport: http(getBundlerByChainId(chain?.id)),
        entryPoint: ENTRYPOINT_ADDRESS_V07
      }),
    [chain]
  );

  if (!connector || !isZeroDevConnector(connector)) {
    return;
  }

  const paymaster = gasToken ? paymasters?.[CHAIN as ChainId.BOB]?.[gasToken.symbol] : undefined;

  const dynamicAccountProvider = connector.getAccountAbstractionProvider();

  return dynamicAccountProvider && chain && bundlerClient
    ? createKernelAccountClient({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        account: dynamicAccountProvider.account as any,
        chain,
        bundlerTransport: http(getBundlerByChainId(chain.id), {
          timeout: 30_000 // optional
        }),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        middleware: {
          gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast,
          sponsorUserOperation: async (args) => {
            const gasEstimates = await bundlerClient.estimateUserOperationGas({
              userOperation: {
                ...args.userOperation,
                paymaster
              }
            });

            // We need to estimate gas prior to adding paymaster data, since the guarantor signs the gas limits.
            // However, adding the guarantor actually increases the required gas. As a workaround, we add fixed
            // amounts of gas here to account for the guarantor gas usage
            gasEstimates.paymasterVerificationGasLimit! += 25000n; // observed increase was 13992
            gasEstimates.paymasterPostOpGasLimit! += 20000n; // observed increase was 10678

            const fullUserOp = {
              paymaster,
              ...args.userOperation,
              ...gasEstimates
            };

            // can't json-serialize bigints - convert them to strings
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            BigInt.prototype['toJSON'] = function () {
              return this.toString();
            };
            const body = JSON.stringify(fullUserOp);

            const rawData = await fetch('/api/guarantor', {
              method: 'POST',
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              },
              body
            });
            const paymasterData = (await rawData.json()).paymasterData;

            return {
              ...gasEstimates,
              paymaster,
              paymasterData
            };
          }
        }
      })
    : undefined;
};

export { useKernelClient, paymasters };
