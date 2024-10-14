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
import { useTranslation } from 'react-i18next';

import { UserResponse } from '../../../../utils';
import { SpiceAmount, WithdrawAlert } from '../../../../components';

import { StyledLearnButton } from './WelcomeBackModal.style';

type Props = { user: UserResponse };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeBackModalProps = Props & InheritAttrs;

const WelcomeBackModal = ({ user, onClose, ...props }: WelcomeBackModalProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal {...props} size='lg'>
      <ModalBody gap='xl' padding='2xl'>
        <H3 size='3xl'>
          {t('fusion.welcomeBackModal.title')}
          <br />
          <Span color='primary-500' size='inherit'>
            {t('fusion.welcomeBackModal.subtitle')}
          </Span>
        </H3>
        <P color='grey-50' size='s'>
          {t('fusion.welcomeBackModal.description')}
        </P>
        <H4 size='2xl'>{t('fusion.welcomeBackModal.performance.title')}</H4>
        <Dl direction={{ base: 'column', s: 'row' }} gap='lg'>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <Dt color='grey-50'>{t('fusion.welcomeBackModal.performance.totalHarvested')}</Dt>
            <Dd size='2xl'>
              <SpiceAmount amount={user.leaderboardRank?.total_points || 0} size='inherit' />
            </Dd>
          </Card>
          <Card background='grey-500' flex={1} gap='s' rounded='lg' style={{ opacity: 0.9 }}>
            <Dt color='grey-50'>{t('fusion.welcomeBackModal.performance.rank')}</Dt>
            <P size='2xl'>#{user.leaderboardRank?.rank || '-'}</P>
          </Card>
        </Dl>
        <Alert status='info' title='The leaderboard resets for the new season' variant='outlined'>
          {t('fusion.welcomeBackModal.disclaimer')}
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
          {t('fusion.welcomeBackModal.moreCta')}
        </StyledLearnButton>
        <Button fullWidth color='primary' size='xl' onPress={onClose}>
          {t('fusion.welcomeBackModal.startCta')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeBackModal };
