import {
  Alert,
  Button,
  Card,
  Flex,
  H3,
  H4,
  Modal,
  ModalBody,
  ModalFooter,
  ModalProps,
  P,
  Span,
  useLocale
} from '@gobob/ui';
import { Spice } from '@gobob/icons';

import { UserResponse } from '../../../../utils';
import { DeadlineChip } from '../DeadlineChip';

import { StyledBackground, StyledContent, StyledLearnButton } from './WelcomeModal.style';

type Props = { user: UserResponse };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeModalProps = Props & InheritAttrs;

const WelcomeModal = ({ user, onClose, ...props }: WelcomeModalProps): JSX.Element => {
  const { locale } = useLocale();

  return (
    <Modal {...props} size='xl'>
      <ModalBody padding='2xl'>
        <StyledBackground />
        <StyledContent direction='column' gap='2xl'>
          <DeadlineChip />
          <H3 size='4xl'>
            Welcome to BOB Fusion
            <br />
            <Span color='primary-500' size='inherit'>
              Season 3!
            </Span>
          </H3>
          <P size='s'>
            This will be the Final season with 20 Million Spice up for grabs. Bridge your assets to BOB, unlock new DeFi
            opportunities and refer others to get Spice bonus.
          </P>
          <H4 size='2xl'>Your Performance till now (S01 + S02)</H4>
          <Flex direction={{ base: 'column', s: 'row' }} gap='lg'>
            <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
              <P color='grey-50'>Spice Harvested</P>
              <Flex alignItems='center' gap='s'>
                <Spice />
                <P size='2xl'>{Intl.NumberFormat(locale).format(user.leaderboardRank.total_points)}</P>
              </Flex>
            </Card>
            <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
              <P color='grey-50'>Season 2 Final Rank</P>
              <P size='2xl'>#{user.leaderboardRank.rank}</P>
            </Card>
          </Flex>
          <Alert status='info' title=' For Season 3, your spice will be reset to 0' variant='outlined'>
            Season 1 and 2 spice will be retained and recorded but will no longer be reflected on the leaderboard.
          </Alert>
        </StyledContent>
      </ModalBody>
      <ModalFooter direction={{ base: 'column', s: 'row' }} gap='xl'>
        <StyledLearnButton size='xl' variant='outline'>
          Learn More {'>'}
        </StyledLearnButton>
        <Button fullWidth color='primary' size='xl' onPress={onClose}>
          Start Harvesting Season 03 
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeModal };
