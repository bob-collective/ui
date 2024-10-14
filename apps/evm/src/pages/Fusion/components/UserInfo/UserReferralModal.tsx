import { Dd, Dl, DlGroup, Dt, Modal, ModalBody, ModalHeader, ModalProps, P, Table } from '@gobob/ui';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { UserResponse } from '../../../../utils';
import { SpiceAmount } from '../../../../components';

enum TableColumns {
  USERNAME = 'username',
  REFERRED_BY = 'referred-by',
  SPICE_EARNED = 'spice-earned'
}

type TableRow = {
  id: number;
  [TableColumns.USERNAME]: ReactNode;
  [TableColumns.SPICE_EARNED]: ReactNode;
  [TableColumns.REFERRED_BY]: ReactNode;
};

const columns = [
  { id: TableColumns.USERNAME, name: 'Username' },
  {
    id: TableColumns.SPICE_EARNED,
    name: 'Earned Spice'
  },
  { id: TableColumns.REFERRED_BY, name: 'Referred by' }
];

type Props = {
  user: UserResponse;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserReferralModalProps = Props & InheritAttrs;

const UserReferralModal = ({ user, ...props }: UserReferralModalProps): JSX.Element => {
  const { t } = useTranslation();

  const rows: TableRow[] = user.season3Data.refPointsBreakdown
    .sort((a, b) => b.ref_points - a.ref_points)
    .map((item, idx) => ({
      id: idx,
      [TableColumns.USERNAME]: item.username,
      [TableColumns.SPICE_EARNED]: <SpiceAmount amount={item.ref_points} />,
      [TableColumns.REFERRED_BY]: item.direct_referral ? 'You' : item.referred_by
    }));

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        {t('fusion.userInfo.userReferralModal.tilte')}
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>{t('fusion.userInfo.userReferralModal.description')}</P>
        <Dl justifyContent='center'>
          <DlGroup>
            <Dt>{t('fusion.userInfo.userReferralModal.referralSpice')}</Dt>
            <Dd>
              <SpiceAmount amount={Number(user.season3Data.s3LeaderboardData[0].ref_points) || 0} />
            </Dd>
          </DlGroup>
        </Dl>
        <Table removeWrapper aria-label='referral table' columns={columns} rows={rows} />
      </ModalBody>
    </Modal>
  );
};

export { UserReferralModal };
