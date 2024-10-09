/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Card, Flex, H3, Modal, ModalBody, ModalFooter, ModalProps, Span, Switch } from '@gobob/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UserResponse } from '../../../../utils';

type Props = { user: UserResponse; onClose: (hideForever: boolean) => void };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeModalProps = Props & InheritAttrs;

const WelcomeModal = ({ onClose, ...props }: WelcomeModalProps): JSX.Element => {
  const [shouldHideForever, setShouldHideForever] = useState(false);

  const { t } = useTranslation();

  return (
    <Modal {...props} size='lg'>
      <ModalBody gap='lg' padding='2xl'>
        <H3 size='3xl'>
          {t('fusion.welcomeModal.title')}
          <br />
          <Span color='primary-500' size='inherit'>
            {t('fusion.welcomeModal.subtitle')}
          </Span>
        </H3>
        <Flex direction='column' elementType='ol' gap='lg'>
          <Flex direction='column' elementType='li' gap='lg'>
            <Card background='grey-700' elementType={Span} padding='md'>
              {t('fusion.welcomeModal.steps.one.title')}
            </Card>
            <Span color='grey-50'>
              {t('fusion.welcomeModal.steps.one.description')}
              <br />
              {t('fusion.welcomeModal.steps.one.tip')}
            </Span>
          </Flex>
          <Flex direction='column' elementType='li' gap='lg'>
            <Card background='grey-700' elementType={Span} padding='md'>
              {t('fusion.welcomeModal.steps.two.title')}
            </Card>
            <Span color='grey-50'>
              {t('fusion.welcomeModal.steps.two.description')}
              <br />
              {t('fusion.welcomeModal.steps.two.tip')}
            </Span>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter direction='column' elementType='form' gap='xl'>
        <Switch isSelected={shouldHideForever} onChange={(e) => setShouldHideForever(e.target.checked)}>
          {t('fusion.welcomeModal.hideCta')}
        </Switch>
        <Button fullWidth color='primary' size='xl' onPress={() => onClose?.(shouldHideForever)}>
          {t('fusion.welcomeModal.startCta')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeModal };
