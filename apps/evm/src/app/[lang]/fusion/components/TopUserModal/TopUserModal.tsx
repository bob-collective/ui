import { Button, Flex, H3, Link, Modal, ModalBody, ModalFooter, ModalProps, P, Switch } from '@gobob/ui';
import { colors } from '@gobob/ui/src/theme/themes/bob/colors';
import { t, Trans } from '@lingui/macro';
import { useState } from 'react';
import { PopupModal, useCalendlyEventListener } from 'react-calendly';
import top100SpiceUser from '@public/assets/top-100-spice.webp';
import Image from 'next/image';
import { useLingui } from '@lingui/react';
import { sendGTMEvent } from '@next/third-parties/google';

type Props = {
  onClose: (shouldDismissTopUserModal: boolean) => void;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type TopUserModalProps = Props & InheritAttrs;

const TopUserModal = ({ onClose, isOpen, ...props }: TopUserModalProps): JSX.Element => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [shouldHideForever, setShouldHideForever] = useState(false);
  const { i18n } = useLingui();

  useCalendlyEventListener({
    onEventScheduled: (event) => {
      sendGTMEvent(event.data);
      onClose(true);
    }
  });

  return (
    <>
      <Modal {...props} isOpen={isOpen && !isCalendlyOpen} size='lg'>
        <Image
          alt={t(i18n)`Top 100 spice user`}
          placeholder='blur'
          sizes='100vw'
          src={top100SpiceUser}
          style={{
            width: '100%',
            height: 'auto'
          }}
        />
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
        <ModalFooter gap='lg'>
          <Flex gap='xl'>
            <Button fullWidth color='primary' size='xl' onPress={() => setIsCalendlyOpen(true)}>
              <Trans>Book A Call</Trans>
            </Button>
            <Button fullWidth color='default' size='xl' variant='outline' onPress={() => onClose(shouldHideForever)}>
              <Trans>Hide</Trans>
            </Button>
          </Flex>
          <Switch isSelected={shouldHideForever} onChange={(e) => setShouldHideForever(e.target.checked)}>
            <Trans>Don&apos;t show this message again</Trans>
          </Switch>
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
