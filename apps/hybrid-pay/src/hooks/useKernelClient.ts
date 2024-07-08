import { isZeroDevConnector } from '@dynamic-labs/ethereum-aa';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ChainId } from '@gobob/chains';
import { Currency } from '@gobob/currency';
import { createKernelAccountClient } from '@zerodev/sdk';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { createPimlicoBundlerClient } from 'permissionless/clients/pimlico';
import { useMemo } from 'react';
import { Address, http } from 'viem';
import { useAccount } from 'wagmi';

import { getBundlerByChainId } from '../lib/account-abstraction/bundler';

type Paymasters = Partial<Record<ChainId, Record<string, Address>>>;

const paymasters: Paymasters = {
  [ChainId.BASE_SEPOLIA]: { USDC: '0x00000000002E3A39aFEf1132214fEee5a55ce127' },
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

  const paymaster = gasToken ? paymasters?.[chain?.id as ChainId]?.[gasToken.symbol] : undefined;

  const dynamicAccountProvider = connector.getAccountAbstractionProvider();

  return dynamicAccountProvider && chain && bundlerClient
    ? createKernelAccountClient({
        account: dynamicAccountProvider.account as any,
        chain,
        bundlerTransport: http(getBundlerByChainId(chain.id), {
          timeout: 30_000 // optional
        }),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        middleware: {
          gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast,
          // MEMO: uncomment for fully sponsored tx
          // sponsorUserOperation: async ({ userOperation }) => {
          //   const paymaster = createPimlicoPaymasterClient({
          //     chain,
          //     entryPoint: ENTRYPOINT_ADDRESS_V07,
          //     // Get this RPC from ZeroDev dashboard
          //     transport: http(getBundlerByChainId(chain.id))
          //   });

          //   return paymaster.sponsorUserOperation({
          //     userOperation
          //   });
          // }
          sponsorUserOperation: async (args) => {
            const gasEstimates = await bundlerClient.estimateUserOperationGas({
              userOperation: {
                ...args.userOperation,
                paymaster
              }
            });

            return {
              ...gasEstimates,
              paymaster
            };
          }
        }
      })
    : undefined;
};

export { useKernelClient, paymasters };
