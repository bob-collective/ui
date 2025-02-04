/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Flex, H3, Modal, ModalBody, ModalFooter, ModalProps, P, Switch } from '@gobob/ui';
import { useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import Image from 'next/image';
import optimismCity from '@public/assets/optimism-city.webp';

type Props = { onClose: (hideForever: boolean) => void };

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type OpSuperuserModalProps = Props & InheritAttrs;

const OpSuperuserModal = ({ onClose, ...props }: OpSuperuserModalProps): JSX.Element => {
  const [shouldHideForever, setShouldHideForever] = useState(false);
  const { i18n } = useLingui();

  return (
    <Modal {...props} size='lg'>
      <Image
        alt={t(i18n)`Optimism city`}
        placeholder='blur'
        sizes='100vw'
        src={optimismCity}
        style={{
          width: '100%',
          height: 'auto'
        }}
      />
      <ModalBody gap='lg' padding='2xl' style={{ zIndex: 1 }}>
        <H3 color='primary-500' size='3xl'>
          <Trans>Exclusive Spice Bonus For Superchain Users</Trans>
        </H3>
        <Flex direction='column' elementType='ol' gap='lg'>
          <P color='grey-50'>
            <Trans>
              BOB is bringing Bitcoin DeFi to the Superchain, and to celebrate, active Superchain ecosystem users like
              you have unlocked an exclusive BOB Spice bonus.
            </Trans>
          </P>
          <P color='grey-50'>
            <Trans>
              All Spice you harvest between 9 December 2024 and 12 January 2025 will receive an exclusive 50% bonus,
              only available to OP airdrop recipients.
            </Trans>
          </P>
        </Flex>
      </ModalBody>
      <ModalFooter direction='column' elementType='form' gap='xl' style={{ zIndex: 1 }}>
        <Switch isSelected={shouldHideForever} onChange={(e) => setShouldHideForever(e.target.checked)}>
          <Trans>Don&apos;t show this message again</Trans>
        </Switch>
        <Button fullWidth color='primary' size='xl' onPress={() => onClose?.(shouldHideForever)}>
          <Trans>Start Harvesting Spice</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { OpSuperuserModal };
