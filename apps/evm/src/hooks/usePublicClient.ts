import { useMemo } from 'react';
import { createPublicClient, webSocket } from 'viem';
import { publicActionsL1, publicActionsL2 } from 'viem/op-stack';

import { chainL1, chainL2 } from '../constants';

const usePublicClientL2 = () =>
  useMemo(
    () =>
      createPublicClient({
        chain: chainL2,
        transport: webSocket()
      }).extend(publicActionsL2()),
    []
  );

const usePublicClientL1 = () =>
  useMemo(
    () =>
      createPublicClient({
        chain: chainL1,
        transport: webSocket()
      }).extend(publicActionsL1()),
    []
  );

export { usePublicClientL1, usePublicClientL2 };
