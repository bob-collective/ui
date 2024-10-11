import { Modal, ModalBody, ModalHeader, ModalProps, P, Span, Strong } from '@gobob/ui';

import { Fire } from '../SpiceChip/Fire';

import { StyledList } from './HeroBanner.style';

type VotingInfoModalProps = Omit<ModalProps, 'children'>;

const VotingInfoModal = (props: VotingInfoModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Community Voting Information
      </ModalHeader>
      <ModalBody gap='xl' padding='even'>
        <P weight='bold'>Support your favourite BOB apps</P>
        <P color='grey-50'>
          When you vote for a project, your Spice total is added to their vote total.
          <br />
          <br />
          Each week the projects with the most votes will receive a Spice bonus which they can distribute to their
          users.
        </P>
        <P weight='bold'>How to vote:</P>
        <StyledList direction='column' elementType='ul' marginLeft='2xl'>
          <li>
            Click the <Fire style={{ verticalAlign: 'text-bottom' }} /> icon next to your favourite apps
          </li>
          <li>Vote for maximum three projects per week</li>
          <li>You can change your votes at any time before the end of the weekly voting period</li>
        </StyledList>
        <P>
          <Strong>Please note: </Strong>
          <Span color='grey-50'>
            When you vote, you do not give away any of your harvest. Your Spice total is simply used to calculate the
            weight of your vote.
          </Span>
        </P>
      </ModalBody>
    </Modal>
  );
};

export { VotingInfoModal };
