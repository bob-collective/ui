import { Button } from '@gobob/ui';
import { useState } from 'react';
import { useAccount, useIsContract } from '@gobob/wagmi';

import { WithdrawModal } from '../WithdrawModal';

const CompleteSeasonOne = () => {
  const { address } = useAccount();
  const { isContract: isSmartAccount } = useIsContract({ address });

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <>
      <Button fullWidth color='primary' onPress={() => setIsWithdrawModalOpen(true)}>
        Complete Season 1
      </Button>
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        isSmartAccount={isSmartAccount}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdrawalMutationComplete={() => setIsWithdrawModalOpen(false)}
      />
    </>
  );
};

export { CompleteSeasonOne };
