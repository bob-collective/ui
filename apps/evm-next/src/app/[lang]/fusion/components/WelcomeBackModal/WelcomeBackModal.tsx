import {
  Alert,
  Button,
  Card,
  Dd,
  Dl,
  Dt,
  H3,
  H4,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  ModalProps,
  P,
  Span
} from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { StyledLearnButton } from './WelcomeBackModal.style';

import { UserResponse } from '@/utils';
import { SpiceAmount, WithdrawAlert } from '@/components';

type Props = { user: UserResponse };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeBackModalProps = Props & InheritAttrs;

const WelcomeBackModal = ({ user, onClose, ...props }: WelcomeBackModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalBody gap='xl' padding='2xl'>
        <H3 size='3xl'>
          <Trans>Welcome to BOB Fusion</Trans>
          <br />
          <Span color='primary-500' size='inherit'>
            <Trans>The final season</Trans>
          </Span>
        </H3>
        <P color='grey-50' size='s'>
          <Trans>
            Fusion season 3 is your last ever chance to harvest Spice. Stake your Bitcoin for the highest multipliers
            and refer a friend to receive a share of all the Spice they collect.
          </Trans>
        </P>
        <H4 size='2xl'>Your performance in seasons 1 & 2</H4>
        <Dl direction={{ base: 'column', s: 'row' }} gap='lg'>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <Dt color='grey-50'>
              <Trans>Total Spice Harvested</Trans>
            </Dt>
            <Dd size='2xl'>
              <SpiceAmount amount={user.leaderboardRank?.total_points || 0} size='inherit' />
            </Dd>
          </Card>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <Dt color='grey-50'>
              <Trans>Final Leaderboard Rank</Trans>
            </Dt>
            <P size='2xl'>#{user.leaderboardRank?.rank || '-'}</P>
          </Card>
        </Dl>
        <Alert status='info' title='The leaderboard resets for the new season' variant='outlined'>
          <Trans>
            Once complete, your season 3 score will be added to seasons 1 and 2 to calculate your final Spice harvest.
          </Trans>
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
          <Trans>Learn More</Trans>
        </StyledLearnButton>
        <Button fullWidth color='primary' size='xl' onPress={onClose}>
          <Trans>Start Harvesting</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeBackModal };
