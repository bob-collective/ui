import { useMemo } from 'react';
import { createPublicClient, http } from 'viem';
import { publicActionsL1, publicActionsL2 } from 'viem/op-stack';

import { chainL1, chainL2 } from '../constants';

const usePublicClientL2 = () =>
  useMemo(
    () =>
      createPublicClient({
        chain: chainL2,
        transport: http(undefined, { batch: true })
      }).extend(publicActionsL2()),
    []
  );

const usePublicClientL1 = () =>
  useMemo(
    () =>
      createPublicClient({
        chain: chainL1,
        transport: http(undefined, { batch: true })
      }).extend(publicActionsL1()),
    []
  );

export { usePublicClientL1, usePublicClientL2 };
