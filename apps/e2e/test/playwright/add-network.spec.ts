import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';

import basicSetup from '../wallet-setup/basic.setup';

const test = testWithSynpress(metaMaskFixtures(basicSetup));

const { expect } = test;

test('should add BOB network to MetaMask', async ({ metamask, page }) => {
  // Define the custom network parameters
  const customNetwork = {
    name: 'BOB Mainnet',
    rpcUrl: 'https://rpc.gobob.xyz/',
    chainId: 10,
    symbol: 'ETH'
  };

  // Add the custom network to MetaMask
  await metamask.addNetwork(customNetwork);

  // Verify that the chain ID has been updated correctly
  // Note: '0xed88' is the hexadecimal representation of 60808
  await expect(page.locator('#chainId')).toHaveText('0xed88');
});
