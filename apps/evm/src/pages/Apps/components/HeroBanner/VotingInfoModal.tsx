import { Modal, ModalBody, ModalHeader, ModalProps, P, Span, Strong } from '@gobob/ui';
import { useTranslation } from 'react-i18next';

import { Fire } from '../SpiceChip/Fire';

import { StyledList } from './HeroBanner.style';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type VotingInfoModalProps = Props & InheritAttrs;

const VotingInfoModal = (props: VotingInfoModalProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        {t('apps.votingInfoModal.title')}
      </ModalHeader>
      <ModalBody gap='xl' padding='even'>
        <P weight='bold'>{t('apps.votingInfoModal.support.title')}</P>
        <P color='grey-50'>
          {t('apps.votingInfoModal.support.content.one')}
          <br />
          <br />
          {t('apps.votingInfoModal.support.content.two')}
        </P>
        <P weight='bold'>{t('apps.votingInfoModal.howToVote.title')}</P>
        <StyledList direction='column' elementType='ul' marginLeft='2xl'>
          <li>
            {t('apps.votingInfoModal.howToVote.content.one.prefix')} <Fire style={{ verticalAlign: 'text-bottom' }} />{' '}
            {t('apps.votingInfoModal.howToVote.content.one.suffix')}
          </li>
          <li>{t('apps.votingInfoModal.howToVote.content.two')}</li>
          <li>{t('apps.votingInfoModal.howToVote.content.three')}</li>
        </StyledList>
        <P>
          <Strong>{t('apps.votingInfoModal.pleaseNote.title')}</Strong>
          <Span color='grey-50'>{t('apps.votingInfoModal.pleaseNote.content')}</Span>
        </P>
      </ModalBody>
    </Modal>
  );
};

export { VotingInfoModal };
