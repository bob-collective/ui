/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Card, Flex, H3, Modal, ModalBody, ModalFooter, ModalProps, Span, Switch } from '@gobob/ui';
import { useState } from 'react';

import { UserResponse } from '@/utils';

type Props = { user: UserResponse; onClose: (hideForever: boolean) => void };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type WelcomeModalProps = Props & InheritAttrs;

const WelcomeModal = ({ onClose, ...props }: WelcomeModalProps): JSX.Element => {
  const [shouldHideForever, setShouldHideForever] = useState(false);

  return (
    <Modal {...props} size='lg'>
      <ModalBody gap='lg' padding='2xl'>
        <H3 size='3xl'>
          Welcome to BOB Fusion
          <br />
          <Span color='primary-500' size='inherit'>
            The final season
          </Span>
        </H3>
        <Flex direction='column' elementType='ol' gap='lg'>
          <Flex direction='column' elementType='li' gap='lg'>
            <Card background='grey-700' elementType={Span} padding='md'>
              Step One
            </Card>
            <Span color='grey-50'>
              Step One Bridge your assets to BOB to start harvesting Spice.
              <br />
              TIP: Some assets earn more Spice than others. You can see which by clicking the “View Multipliers” button.
            </Span>
          </Flex>
          <Flex direction='column' elementType='li' gap='lg'>
            <Card background='grey-700' elementType={Span} padding='md'>
              Step Two
            </Card>
            <Span color='grey-50'>
              Use your bridged assets in apps to maximise your Spice harvest.
              <br />
              TIP: Some types of apps offer greater multipliers than others. Explore the “Hot Strategies” section to
              learn more.
            </Span>
          </Flex>
        </Flex>
      </ModalBody>
      <ModalFooter direction='column' elementType='form' gap='xl'>
        <Switch isSelected={shouldHideForever} onChange={(e) => setShouldHideForever(e.target.checked)}>
          Don&apos;t show this message again
        </Switch>
        <Button fullWidth color='primary' size='xl' onPress={() => onClose?.(shouldHideForever)}>
          Start Harvesting
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { WelcomeModal };
