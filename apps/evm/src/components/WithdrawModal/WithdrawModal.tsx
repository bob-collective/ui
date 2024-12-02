import { Dd, Dl, DlGroup, Dt, Modal, ModalBody, ModalHeader, useLocale } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useAccount } from 'wagmi';

import { useLayoutContext } from '../Layout';

import { DepositedAssets } from './DepositedAssets';
import { WithdrawForm } from './WithdrawForm';

import { useGetUser, useIsContract } from '@/hooks';

const WithdrawModal = () => {
  const { data: user } = useGetUser();
  const { address } = useAccount();
  const { isContract: isSmartAccount } = useIsContract({ address });
  const { isWithdrawAssetsOpen, setWithdrawAssetsOpen } = useLayoutContext();

  const { locale } = useLocale();

  const handleClose = () => setWithdrawAssetsOpen(false);

  return (
    <Modal isOpen={isWithdrawAssetsOpen} placement='top' onClose={handleClose}>
      <ModalHeader>
        <Trans>Withdraw Locked Assets</Trans>
      </ModalHeader>
      <ModalBody gap='lg'>
        <Dl justifyContent='space-between'>
          <DepositedAssets />
          <DlGroup alignItems='flex-start' direction='column' flex={0.5}>
            <Dt size='s' weight='semibold'>
              <Trans>Current Spice</Trans>
            </Dt>
            <Dd weight='bold'>{Intl.NumberFormat(locale).format(user?.leaderboardRank?.total_reward_points ?? 0)}</Dd>
          </DlGroup>
        </Dl>
        <WithdrawForm isSmartAccount={isSmartAccount} onSuccess={handleClose} />
      </ModalBody>
    </Modal>
  );
};

export { WithdrawModal };
