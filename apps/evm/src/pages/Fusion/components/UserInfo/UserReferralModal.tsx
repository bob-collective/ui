import { Dd, Dl, DlGroup, Dt, Modal, ModalBody, ModalHeader, ModalProps, P } from '@gobob/ui';

import { UserResponse } from '../../../../utils';
import { SpiceAmount } from '../../../../components';

type Props = {
  user: UserResponse;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserReferralModalProps = Props & InheritAttrs;

const UserReferralModal = ({ user, ...props }: UserReferralModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Your Active Referrals
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          Here are your active referrals and the Spice they&apos;re currently earning for you. The more they earn, the
          more you benefit!
        </P>
        <Dl justifyContent='center'>
          <DlGroup>
            <Dt>Total Referrals Earnings:</Dt>
            <Dd>
              <SpiceAmount amount={Number(user.season3Data.s3LeaderboardData[0].ref_points) || 0} />
            </Dd>
          </DlGroup>
        </Dl>
      </ModalBody>
    </Modal>
  );
};

export { UserReferralModal };
