import { Dd, Dl, DlGroup, Dt, Modal, ModalBody, ModalHeader } from '@gobob/ui';
import { useLocale } from '@gobob/ui';
import { t } from 'i18next';
import { useAccount, useIsContract } from '@gobob/wagmi';

import { useGetUser } from '../../hooks';
import { useLayoutContext } from '../Layout';

import { WithdrawForm } from './WithdrawForm';
import { DepositedAssets } from './DepositedAssets';

const WithdrawModal = () => {
  const { data: user } = useGetUser();
  const { address } = useAccount();
  const { isContract: isSmartAccount } = useIsContract({ address });
  const { isWithdrawAssetsOpen, setWithdrawAssetsOpen } = useLayoutContext();

  const { locale } = useLocale();

  const handleClose = () => setWithdrawAssetsOpen(false);

  return (
    <Modal isOpen={isWithdrawAssetsOpen} placement='top' onClose={handleClose}>
      <ModalHeader>Withdraw Locked Assets</ModalHeader>
      <ModalBody gap='lg'>
        <Dl justifyContent='space-between'>
          <DepositedAssets />
          <DlGroup alignItems='flex-start' direction='column' flex={0.5}>
            <Dt size='s' weight='semibold'>
              {t('fusion.withdrawModal.currentSpice')}
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