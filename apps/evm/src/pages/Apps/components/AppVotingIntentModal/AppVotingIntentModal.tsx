/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Avatar,
  Button,
  Dd,
  Dl,
  DlGroup,
  Dt,
  Flex,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalProps,
  P,
  Span
} from '@gobob/ui';

import { AppData, VotingAppData, VotingAppsData } from '../../hooks';
import { SpiceChip } from '../SpiceChip';
import { LoginButton, SignUpButton } from '../../../../components';

type Props = {
  app: AppData;
  apps?: VotingAppsData;
  isAuthenticated?: boolean;
  isVotingDisabled?: boolean;
  isVotingExceeded?: boolean;
  onVote?: (app: VotingAppData) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type AppVotingIntentModalProps = Props & InheritAttrs;

const AppVotingIntentModal = ({
  app,
  apps,
  isAuthenticated,
  isVotingDisabled,
  isVotingExceeded,
  onClose,
  onVote,
  ...props
}: AppVotingIntentModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg' onClose={onClose}>
      <ModalHeader>Community Voting</ModalHeader>
      <ModalBody gap='lg'>
        {isAuthenticated ? (
          <Dl alignItems='center' direction='column'>
            <DlGroup alignItems='center'>
              <Dt color='light'>Votes left:</Dt>
              <Dd>
                <SpiceChip hideTooltip isLit amount={apps?.votesRemaining || 0} />
              </Dd>
            </DlGroup>
            <P align='center' color='grey-50' size='s'>
              Vote by clicking on the flame icon.
            </P>
          </Dl>
        ) : (
          <Flex direction='column'>
            <P>Before casting your vote, please take one of the following actions:</P>
            <Flex alignItems='center' gap='md' justifyContent='center'>
              <LoginButton color='primary' size='s'>
                Log in
              </LoginButton>
              <Span color='grey-50' size='s'>
                or
              </Span>
              <SignUpButton color='primary' variant='ghost' />
            </Flex>
          </Flex>
        )}
        <Flex alignItems='center' gap='s' justifyContent='space-between'>
          <Flex alignItems='center' flex={1} gap={{ base: 'md', s: 'xl' }}>
            <Avatar borderColor='grey-200' rounded='md' size={{ base: '5xl', s: '6xl' }} src={app.logoSrc} />
            <P noWrap>{app.name}</P>
          </Flex>
          <SpiceChip
            amount={app.voting!.weight}
            iconPlacement='end'
            isDisabled={isVotingDisabled}
            isLit={app.voting!.userHasVotedFor}
            isVotingExceeded={isVotingExceeded}
            onPress={() => onVote?.(app.voting!)}
          />
        </Flex>
      </ModalBody>
      <ModalFooter direction='column' elementType='form' gap='xl'>
        <Button color='primary' onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { AppVotingIntentModal };
