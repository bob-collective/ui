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
          Community voting allows you to use your Spice total to support your favourite BOB apps. Each week the projects
          with the most community votes will receive a Spice bonus which they can distribute to their users.
          <br />
          <br />
          You can vote for one app in each of the three categories each week. When you vote, your Spice total is added
          to the projects vote total.
          <br />
          <br />
          Please note that when you vote, you do not give away or lose any of your harvest. Your total is simply used to
          calculate the weight of your vote.
          <br />
          <br />
          You can reassign your vote as many times as you like in a given voting round. The vote is only locked in at
          the end of the round.
          <br />
          <br />
          Each voting round lasts about 1 week. More information about each round can be found on the voting dashboard.
        </P>
      </ModalBody>
    </Modal>
  );
};

export { VotingInfoModal };
