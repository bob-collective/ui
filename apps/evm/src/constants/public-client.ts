import { createPublicClient, http } from 'viem';
import { publicActionsL1, publicActionsL2 } from 'viem/op-stack';

import { chainL1, chainL2 } from '.';

export const publicClientL1 = createPublicClient({
  chain: chainL1,
  transport: http(undefined, { batch: true })
}).extend(publicActionsL1());

export const publicClientL2 = createPublicClient({
  chain: chainL2,
  transport: http(undefined, { batch: true })
}).extend(publicActionsL2());
