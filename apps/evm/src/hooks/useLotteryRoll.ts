'use client';

import { useMutation, UseMutationOptions, useQueryClient } from '@gobob/react-query';
import { useState } from 'react';
import { Address } from 'viem';

import { fusionKeys } from '@/lib/react-query';
import { LotteryRoll } from '@/utils';

const useLotteryRoll = (
  address: Address | undefined,
  props: Omit<UseMutationOptions<LotteryRoll, Error, void, string[]>, 'mutationFn'> = {}
) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState(3);

  return useMutation({
    // mutationFn: () => apiClient.lotteryRoll(),
    mutationFn: async () => {
      if (state === 0) {
        return {
          rollsRemaining: 0, // How many rolls are left
          votesRemaining: 0, // How many votes are left, if above zero user is missing out on rolls as 1 vote = 1 roll
          running: true, // Is the lottery running, if their is no current voting round, the user cannot roll
          pointsMissing: 10500, // The user has to have 10500 points to roll, this is the number of points they are missing
          packageId: 1, // The id of the package the user won
          prize: state % 2 ? 10500 : 0 // The number of spice the user won
        };
      }

      return {
        rollsRemaining: state, // How many rolls are left
        votesRemaining: 0, // How many votes are left, if above zero user is missing out on rolls as 1 vote = 1 roll
        running: true, // Is the lottery running, if their is no current voting round, the user cannot roll
        pointsMissing: 10500, // The user has to have 10500 points to roll, this is the number of points they are missing
        packageId: 1, // The id of the package the user won
        prize: state % 2 ? 10500 : 0 // The number of spice the user won
      };
    },
    onSuccess: () => {
      setState((val) => val - 1);
      queryClient.refetchQueries({ queryKey: fusionKeys.lotteryStats(address) });
    },
    ...props
  });
};

export { useLotteryRoll };
