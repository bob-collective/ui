import { Dd, Dl, DlGroup, Dt, Modal, ModalBody, ModalHeader, ModalProps, P, Table } from '@gobob/ui';
import { ReactNode } from 'react';
import { Trans, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { UserResponse } from '@/utils';
import { SpiceAmount } from '@/components';

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
  { id: TableColumns.USERNAME, name: <Trans>Username</Trans> },
  {
    id: TableColumns.SPICE_EARNED,
    name: <Trans>Earned Spice</Trans>
  },
  { id: TableColumns.REFERRED_BY, name: <Trans>Referred by</Trans> }
];

type Props = {
  user: UserResponse;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserReferralModalProps = Props & InheritAttrs;

const UserReferralModal = ({ user, ...props }: UserReferralModalProps): JSX.Element => {
  const { i18n } = useLingui();
  const rows: TableRow[] = user.season3Data.refPointsBreakdown
    .sort((a, b) => b.ref_points - a.ref_points)
    .map((item, idx) => ({
      id: idx,
      [TableColumns.USERNAME]: item.username,
      [TableColumns.SPICE_EARNED]: <SpiceAmount amount={item.ref_points} />,
      [TableColumns.REFERRED_BY]: item.direct_referral ? <Trans>You</Trans> : item.referred_by
    }));

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        <Trans>Your Active Referrals</Trans>
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          <Trans>
            Here are your active referrals and the Spice they&apos;re currently earning for you. The more they earn, the
            more you benefit!
          </Trans>
        </P>
        <Dl justifyContent='center'>
          <DlGroup>
            <Dt>
              <Trans>Total Referrals Earnings:</Trans>
            </Dt>
            <Dd>
              <SpiceAmount amount={Number(user.season3Data.s3LeaderboardData[0]?.ref_points) || 0} />
            </Dd>
          </DlGroup>
        </Dl>
        <Table removeWrapper aria-label={t(i18n)`referral table`} columns={columns} rows={rows} />
      </ModalBody>
    </Modal>
  );
};

export { UserReferralModal };
