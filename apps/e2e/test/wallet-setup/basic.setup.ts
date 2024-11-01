// import { defineWalletSetup } from '@synthetixio/synpress-cache';
// import { MetaMask } from '@synthetixio/synpress';

// // Define a test seed phrase and password
// export const SEED_PHRASE = 'test test test test test test test test test test test junk';
// export const PASSWORD = 'Tester@1234';

// // Define the basic wallet setup
// export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
//   // Create a new MetaMask instance
//   const metamask = new MetaMask(context, walletPage, PASSWORD);

//   // Import the wallet using the seed phrase
//   await metamask.importWallet(SEED_PHRASE);

//   // Additional setup steps can be added here, such as:
//   // - Adding custom networks
//   // - Importing tokens
//   // - Setting up specific account states
// });

import { defineWalletSetup } from '@synthetixio/synpress';
import { MetaMask } from '@synthetixio/synpress/playwright';

const SEED_PHRASE = 'test test test test test test test test test test test junk';
const PASSWORD = 'SynpressIsAwesomeNow!!!';

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  await metamask.importWallet(SEED_PHRASE);
});
