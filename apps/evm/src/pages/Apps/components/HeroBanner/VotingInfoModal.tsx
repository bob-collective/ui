import { Modal, ModalBody, ModalHeader, ModalProps, P } from '@gobob/ui';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type VotingInfoModalProps = Props & InheritAttrs;

const VotingInfoModal = (props: VotingInfoModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Community Voting Information{' '}
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          A user can reassign their vote as many times as they like. Their vote is only locked in at the end of each
          round.
          <br />
          <br />
          Users vote with their Season 3 spice: When voting, a user’s spice total is added to the project’s vote total,
          for example if a user with 1M spice votes for a project then 1M is added to the project’s vote total. Please
          note that when you vote, you don’t give away your spice but your spice harvest is used to represent the weight
          of your vote.
          <br />
          <br />
          A voting round lasts about 2 weeks, more information about the round can be found on the voting dashboard.
          <br />
          <br />
          At the end of each round the top-placing projects will receive a spice bonus which they can distribute to
          their users.
        </P>
      </ModalBody>
    </Modal>
  );
};

export { VotingInfoModal };
