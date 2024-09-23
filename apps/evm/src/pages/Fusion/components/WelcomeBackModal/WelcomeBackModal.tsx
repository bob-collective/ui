import {
  Alert,
  Button,
  Card,
  Flex,
  H3,
  H4,
  Link,
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
import { WithdrawAlert } from '../../../../components';

import { StyledLearnButton } from './WelcomeBackModal.style';

type Props = { user: UserResponse };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeBackModalProps = Props & InheritAttrs;

const WelcomeBackModal = ({ user, onClose, ...props }: WelcomeBackModalProps): JSX.Element => {
  const { locale } = useLocale();

  return (
    <Modal {...props} size='lg'>
      <ModalBody gap='xl' padding='2xl'>
        <H3 size='3xl'>
          Welcome to BOB Fusion
          <br />
          <Span color='primary-500' size='inherit'>
            The final season
          </Span>
        </H3>
        <P color='grey-50' size='s'>
          Fusion season 3 is your last ever chance to harvest Spice. Stake your Bitcoin for the highest multipliers and
          refer a friend to receive a share of all the Spice they collect.
        </P>
        <H4 size='2xl'>Your performance in seasons 1 & 2</H4>
        <Flex direction={{ base: 'column', s: 'row' }} gap='lg'>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <P color='grey-50'>Total Spice Harvested</P>
            <Flex alignItems='center' gap='s'>
              <Spice />
              <P size='2xl'>
                {Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 2 }).format(
                  user.leaderboardRank.total_points
                )}
              </P>
            </Flex>
          </Card>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <P color='grey-50'>Final Leaderboard Rank</P>
            <P size='2xl'>#{user.leaderboardRank.rank}</P>
          </Card>
        </Flex>
        <Alert status='info' title='The leaderboard resets for the new season' variant='outlined'>
          Once complete, your season 3 score will be added to seasons 1 and 2 to calculate your final Spice harvest.
        </Alert>
        <WithdrawAlert onPressWithdraw={onClose} />
      </ModalBody>
      <ModalFooter direction={{ base: 'column', s: 'row' }} gap='xl'>
        <StyledLearnButton
          elementType={Link}
          size='xl'
          variant='outline'
          {...{ href: 'https://blog.gobob.xyz/posts/bob-fusion-the-final-season', external: true }}
        >
          Learn More
        </StyledLearnButton>
        <Button fullWidth color='primary' size='xl' onPress={onClose}>
          Start Harvesting
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeBackModal };
