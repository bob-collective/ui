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
import { useAccount } from '@gobob/wagmi';

type LotteryModalProps = Partial<LotteryStats> & {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_TICKETS = 3;

function LotteryModal({ isOpen, onClose, rollsRemaining, votesRemaining, pointsMissing }: LotteryModalProps) {
  const { lang } = useParams();
  const { locale } = useLocale();
  const { address } = useAccount();
  const { data: lotteryRollData, mutate: roll } = useLotteryRoll(address, {
    onError(error) {
      toast.error(error.message || <Trans>Something went wrong. Please try again later.</Trans>);
    }
  });

  const getHeaderText = () => {
    if (Boolean(pointsMissing)) return <Trans>You Have 0 Tickets</Trans>;

    if (rollsRemaining !== undefined)
      return (
        <>
          {(rollsRemaining || 0) + (votesRemaining || 0) === MAX_TICKETS && <Trans>You&apos;re Ready to Play!</Trans>}
          {lotteryRollData?.prize === 0 && (console.log('exec'), (<Trans>Not your lucky day... yet!</Trans>))}
          {(lotteryRollData?.prize || 0) > 0 && <Trans>Congratulations you won!</Trans>}
          <br />
          <Trans>
            <Span color='primary-500' size='unset'>
              {rollsRemaining}/{MAX_TICKETS}
            </Span>{' '}
            <Plural one='Ticket' other='Tickets' value={1} /> Remaining
          </Trans>
        </>
      );
  };

  const getDescriptionText = () => {
    if (Boolean(pointsMissing))
      return (
        <Trans>
          Each ticket is your chance to win big! Vote for your favourite app to receive {MAX_TICKETS} new tickets daily
          and boost your chances.
        </Trans>
      );
    if (rollsRemaining === 0)
      return (
        <Trans>
          You&apos;ve used all your tickets for today. New tickets will be available once the timer resets. Be sure to
          come back and vote daily to increase your chances of earning more SPICE!
        </Trans>
      );
    if (Boolean(rollsRemaining))
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
        hidden={!lotteryRollData?.prize}
        autoplay
        animationData={confettiAnimationData}
      />
      <ModalBody padding='2xl'>
        <Flex alignItems='center' direction='column' gap='5xl'>
          <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
            <Trans>new tickets drop in {formatDistanceToNow(ROUND_END_TIME)}</Trans>
          </Chip>
          <H3 size='2xl' align='center'>
            {getHeaderText()}
          </H3>
          {(rollsRemaining || 0) + (votesRemaining || 0) === MAX_TICKETS || Boolean(pointsMissing) ? (
            <Ticket size='3xl' />
          ) : (
            <StyledPoints>
              <Spice size='3xl' /> {Intl.NumberFormat(locale).format(lotteryRollData?.prize || 0)}
            </StyledPoints>
          )}
          <P color='grey-50' size='s' align='center'>
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
            <StyledButton variant='outline' onClick={onClose}>
              <Trans>Close</Trans>
            </StyledButton>
          )}
          {Boolean(rollsRemaining) && (
            <StyledButton color='primary' onClick={() => roll()}>
              {(rollsRemaining || 0) + (votesRemaining || 0) === MAX_TICKETS ? (
                <Trans>Play</Trans>
              ) : (
                <Trans>Play again</Trans>
              )}
            </StyledButton>
          )}
        </Flex>
      </ModalFooter>
    </Modal>
  );
}
export { LotteryModal };