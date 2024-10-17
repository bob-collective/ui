import { Modal, ModalBody, ModalHeader, ModalProps, P, Span, Strong } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { Fire } from '../SpiceChip/Fire';

import { StyledList } from './HeroBanner.style';

type VotingInfoModalProps = Omit<ModalProps, 'children'>;

const VotingInfoModal = (props: VotingInfoModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        <Trans>Community Voting Information</Trans>
      </ModalHeader>
      <ModalBody gap='xl' padding='even'>
        <P weight='bold'>
          <Trans>Support your favourite BOB apps</Trans>
        </P>
        <P color='grey-50'>
          <Trans>
            When you vote for a project, your Spice total is added to their vote total.
            <br />
            <br />
            Each week the projects with the most votes will receive a Spice bonus which they can distribute to their
            users.
          </Trans>
        </P>
        <P weight='bold'>
          <Trans>How to vote:</Trans>
        </P>
        <StyledList direction='column' elementType='ul' marginLeft='2xl'>
          <li>
            <Trans>
              Click the <Fire style={{ verticalAlign: 'text-bottom' }} /> icon next to your favourite apps
            </Trans>
          </li>
          <li>
            <Trans>Vote for maximum three projects per week</Trans>
          </li>
          <li>
            <Trans>You can change your votes at any time before the end of the weekly voting period</Trans>
          </li>
        </StyledList>
        <P>
          <Strong>
            <Trans>Please note: </Trans>
          </Strong>
          <Span color='grey-50'>
            <Trans>
              When you vote, you do not give away any of your harvest. Your Spice total is simply used to calculate the
              weight of your vote.
            </Trans>
          </Span>
        </P>
      </ModalBody>
    </Modal>
  );
};

export { VotingInfoModal };
