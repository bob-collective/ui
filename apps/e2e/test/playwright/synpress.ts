import { testWithSynpress } from '@synthetixio/synpress';
import { metaMaskFixtures } from '@synthetixio/synpress/playwright';

import connectedSetup from '../wallet-setup/connected.setup';

export default testWithSynpress(metaMaskFixtures(connectedSetup));

// https://app.gobob.xyz/en/stake?type=stake&receive=solv-solvbtcbbn&network=bitcoin
