import { Button, H3, Link, Modal, ModalBody, ModalFooter, ModalProps, P } from '@gobob/ui';
import { colors } from '@gobob/ui/src/theme/themes/bob/colors';
import { Trans } from '@lingui/macro';
import { useState } from 'react';
import { PopupModal, useCalendlyEventListener } from 'react-calendly';

type Props = {
  onClose: () => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TopUserModalProps = Props & InheritAttrs;

const TopUserModal = ({ onClose, isOpen, ...props }: TopUserModalProps): JSX.Element => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  useCalendlyEventListener({
    onEventScheduled: onClose
  });

  return (
    <>
      <Modal {...props} isOpen={isOpen && !isCalendlyOpen} size='lg'>
        <ModalBody gap='xl' padding='2xl'>
          <H3 size='3xl'>
            <Trans>You are one of the top 100 Spice holders in BOB Fusion</Trans>
          </H3>
          <P color='grey-50' size='md'>
            <Trans>
              As one of our most important community members, we would love the opportunity to gain your input on the
              BOB ecosystem and our future plans.
            </Trans>
          </P>
          <P color='grey-50' size='md'>
            <Trans>
              BOB co-founder, <Link href='https://x.com/alexeiZamyatin'>Alexei Zamyatin</Link>, would like to invite you
              to a private 1-to-1 call to hear your thoughts on BOB and Bitcoin DeFi. If you are interested, please
              click the button below to book a call at a time that suits you.
            </Trans>
          </P>
        </ModalBody>
        <ModalFooter direction='row' elementType='form' gap='xl'>
          <Button fullWidth color='primary' size='xl' onPress={() => setIsCalendlyOpen(true)}>
            <Trans>Book Meeting</Trans>
          </Button>
          <Button fullWidth color='default' size='xl' variant='outline' onPress={onClose}>
            <Trans>No Thanks</Trans>
          </Button>
        </ModalFooter>
      </Modal>
      <PopupModal
        open={isCalendlyOpen}
        pageSettings={{
          backgroundColor: colors['grey-400'],
          textColor: colors['light'],
          primaryColor: colors['primary-500']
        }}
        rootElement={document.getElementById('root')!}
        url='https://calendly.com/alexei-zamyatin/30-min-call'
        onModalClose={() => setIsCalendlyOpen(false)}
      />
    </>
  );
};

export { TopUserModal };
