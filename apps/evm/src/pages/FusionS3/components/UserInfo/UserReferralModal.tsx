import { Dl, DlGroup, Dt, Flex, Modal, ModalBody, ModalHeader, ModalProps, P, Span, useLocale } from '@gobob/ui';
import { Spice } from '@gobob/icons';

import { UserResponse } from '../../../../utils';

type Props = {
  user: UserResponse;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserReferralModalProps = Props & InheritAttrs;

const UserReferralModal = ({ user, ...props }: UserReferralModalProps): JSX.Element => {
  const { locale } = useLocale();

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Your Active Referrals{' '}
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          Here are your active referrals and the Spice they’re currently earning for you. The more they earn, the more
          you benefit!
        </P>
        <Dl justifyContent='center'>
          <DlGroup>
            <Dt>Total Ref Earnings:</Dt>
            <Flex elementType='dd' gap='s'>
              <Spice />
              <Span>
                {Intl.NumberFormat(locale).format(Number(user.season3Data.s3LeaderboardData[0].ref_points) || 0)}
              </Span>
            </Flex>
          </DlGroup>
        </Dl>
      </ModalBody>
    </Modal>
  );
};

export { UserReferralModal };
