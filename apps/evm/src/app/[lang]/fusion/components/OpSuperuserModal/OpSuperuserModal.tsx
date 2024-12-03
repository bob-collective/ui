/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, Flex, H3, Modal, ModalBody, ModalFooter, ModalProps, P, Span, Switch } from '@gobob/ui';
import { useState } from 'react';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import Image from 'next/image';
import styled from 'styled-components';
import optimismCity from '@public/assets/optimism-city.png';

const StyledList = styled(Flex)`
  list-style-type: disc;

  li::marker {
    color: ${({ theme }) => theme.color('grey-50')};
  }
`;

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
          <Trans>Let&apos;s celebrate BOB&apos;s membership of the OP Superchain</Trans>
        </H3>
        <Flex direction='column' elementType='ol' gap='lg'>
          <P color='grey-50'>
            <Trans>
              As an OP Superuser, you unlock special rewards when you join BOB&apos;s Fusion campaign and explore the
              future of Bitcoin DeFi.
            </Trans>
          </P>
          <P color='grey-50'>Here&apos;s what you get: </P>
          <StyledList direction='column' elementType='ul' marginLeft='2xl'>
            <li>
              <Trans>
                <Span color='grey-50'>Enhanced Referral Bonuses: </Span>Earn even more from your network by sharing your
                unique referral link.
              </Trans>
            </li>
            <li>
              <Trans>
                <Span color='grey-50'>Extra Rewards for TVL Achievements: </Span>Benefit from additional incentives as
                BOB&apos;s Total Value Locked (TVL) milestones are reached.
              </Trans>
            </li>
          </StyledList>
          <P color='grey-50'>
            <Trans>Start earning exclusive perks and solidify your role as a leader in Bitcoin DeFi today!</Trans>
          </P>
        </Flex>
      </ModalBody>
      <ModalFooter direction='column' elementType='form' gap='xl' style={{ zIndex: 1 }}>
        <Switch isSelected={shouldHideForever} onChange={(e) => setShouldHideForever(e.target.checked)}>
          <Trans>Don&apos;t show this message again</Trans>
        </Switch>
        <Button fullWidth color='primary' size='xl' onPress={() => onClose?.(shouldHideForever)}>
          <Trans>Start Harvesting</Trans>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { OpSuperuserModal };
