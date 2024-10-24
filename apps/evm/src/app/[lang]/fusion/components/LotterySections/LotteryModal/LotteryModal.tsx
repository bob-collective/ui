'use client';

import { Spice } from '@gobob/icons';
import { Chip, Flex, H3, Link, Modal, ModalBody, ModalFooter, P, SolidClock, Span, toast, useLocale } from '@gobob/ui';
import { Plural, Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';

import { ROUND_END_TIME } from '../constants';
import { Ticket } from '../icons';
import confettiAnimationData from '../lotties/confettie.json';

import { StyledButton, StyledLottie, StyledPoints } from './LotteryModal.style';

import { RoutesPath } from '@/constants';
import { useLotteryRoll } from '@/hooks';
import { LotteryStats } from '@/utils';

type LotteryModalProps = LotteryStats & {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_TICKETS = 3;

function LotteryModal({ isOpen, onClose, rollsRemaining, votesRemaining, pointsMissing }: LotteryModalProps) {
  const { lang } = useParams();
  const { locale } = useLocale();
  const {
    data: lotteryRollData,
    isIdle,
    mutate: roll
  } = useLotteryRoll({
    onError(error) {
      toast.error(error.message || <Trans>Something went wrong. Please try again later.</Trans>);
    }
  });

  if (pointsMissing) {
    return (
      <Modal isDismissable isOpen={isOpen} size='s' onClose={onClose}>
        <ModalBody padding='2xl'>
          <Flex alignItems='center' direction='column' gap='5xl'>
            <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
              <Trans>new tickets drop in {formatDistanceToNow(ROUND_END_TIME)}</Trans>
            </Chip>
            <H3 align='center' size='2xl'>
              <Trans>Not enough spice</Trans>
            </H3>
            <StyledPoints>
              <Spice size='3xl' /> {Intl.NumberFormat(locale).format(pointsMissing)}
            </StyledPoints>
            <P align='center' color='grey-50' size='s'>
              <Trans>Add {pointsMissing} more SPICE to your wallet to participate</Trans>
            </P>
          </Flex>
        </ModalBody>
        <ModalFooter padding='2xl'>
          <Flex alignItems='stretch'>
            <StyledButton variant='outline' onPress={onClose}>
              <Trans>Close</Trans>
            </StyledButton>
          </Flex>
        </ModalFooter>
      </Modal>
    );
  }

  const rollsNotUsed = rollsRemaining === MAX_TICKETS;
  const votesNotUsed = votesRemaining === MAX_TICKETS;
  const notPlayed = lotteryRollData === undefined;
  const isWinner = lotteryRollData !== undefined && lotteryRollData.winningPackageId !== null;
  const isNotWinner = lotteryRollData !== undefined && lotteryRollData.winningPackageId === null;

  const getHeaderText = () => {
    if (rollsRemaining === 0 && !lotteryRollData) return <Trans>You Have 0 Tickets</Trans>;

    return (
      <>
        {isIdle && <Trans>You&apos;re Ready to Play!</Trans>}
        {isNotWinner && <Trans>Not your lucky day... yet!</Trans>}
        {isWinner && <Trans>Congratulations you won!</Trans>}
        <br />
        <Trans>
          <Span color='primary-500' size='unset'>
            {rollsRemaining}/{MAX_TICKETS}
          </Span>{' '}
          <Plural one='Ticket' other='Tickets' value={rollsRemaining || 0} /> Remaining
        </Trans>
      </>
    );
  };

  const getDescriptionText = () => {
    if (votesNotUsed)
      return (
        <Trans>
          Each ticket is your chance to win big! Vote for your favourite app to receive {MAX_TICKETS} new tickets daily
          and boost your chances.
        </Trans>
      );

    if (rollsRemaining === 0 && votesRemaining === 0)
      return (
        <Trans>
          You&apos;ve used all your tickets for today. New tickets will be available once the timer resets. Be sure to
          come back and vote daily to increase your chances of earning more SPICE!
        </Trans>
      );

    return (
      <Trans>
        Use all your tickets before the countdown ends to boost your chances! New tickets will be available once the
        timer resets. Vote daily to increase your chances of earning more SPICE!
      </Trans>
    );
  };

  return (
    <Modal isDismissable isOpen={isOpen} size='s' onClose={onClose}>
      <StyledLottie
        key={lotteryRollData?.rollsRemaining}
        autoplay
        animationData={confettiAnimationData}
        hidden={!isWinner}
      />
      <ModalBody padding='2xl'>
        <Flex alignItems='center' direction='column' gap='5xl'>
          <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
            <Trans>new tickets drop in {formatDistanceToNow(ROUND_END_TIME)}</Trans>
          </Chip>
          <H3 align='center' size='2xl'>
            {getHeaderText()}
          </H3>
          {rollsNotUsed || votesNotUsed || notPlayed ? (
            <Ticket size='3xl' />
          ) : (
            <StyledPoints>
              <Spice size='3xl' /> {Intl.NumberFormat(locale).format(lotteryRollData?.prize || 0)}
            </StyledPoints>
          )}
          <P align='center' color='grey-50' size='s'>
            {getDescriptionText()}
          </P>
        </Flex>
      </ModalBody>
      <ModalFooter padding='2xl'>
        <Flex alignItems='stretch' gap='xl' justifyContent='space-between'>
          {votesRemaining !== 0 && (
            <StyledButton elementType={Link} variant='outline' {...{ href: `/${lang}${RoutesPath.APPS}` }}>
              <Trans>Get tickets</Trans>
            </StyledButton>
          )}
          {rollsRemaining === 0 && (
            <StyledButton variant='outline' onPress={onClose}>
              <Trans>Close</Trans>
            </StyledButton>
          )}
          {Boolean(rollsRemaining) && (
            <StyledButton color='primary' onPress={() => roll()}>
              <Trans>Play</Trans>
            </StyledButton>
          )}
        </Flex>
      </ModalFooter>
    </Modal>
  );
}
export { LotteryModal };
