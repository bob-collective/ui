'use client';

import { Spice } from '@gobob/icons';
import {
  Chip,
  Flex,
  H3,
  H4,
  Link,
  Modal,
  ModalBody,
  ModalFooter,
  P,
  SolidClock,
  Span,
  toast,
  useLocale
} from '@gobob/ui';
import { Plural, Trans } from '@lingui/macro';
import { useParams } from 'next/navigation';

import { Ticket } from '../icons';
import confettiAnimationData from '../lotties/confettie.json';
import { useTimeToNextDraw } from '../hooks';

import { StyledButton, StyledLottie, StyledPoints } from './LotteryModal.style';

import { RoutesPath } from '@/constants';
import { useGetUser, useLotteryRoll } from '@/hooks';
import { LotteryStats } from '@/utils';

type LotteryModalProps = LotteryStats & {
  isOpen: boolean;
  onClose: () => void;
};

const MAX_TICKETS = 3;
const getPrefilledXText = (refCode: string | undefined) =>
  `I just won Spice in the @build_on_bob Fusion Lottery!%0A%0AJoin me in the Final Season and explore the Hybrid L2 ecosystem.%0A%0AHere's my referral link https://app.gobob.xyz/?refCode=${refCode || ''}`;

const LotteryModal = ({
  isOpen,
  onClose,
  rollsRemaining,
  votesRemaining,
  pointsMissing,
  minPointsToRoll
}: LotteryModalProps) => {
  const { lang } = useParams();
  const { locale } = useLocale();
  const { data: user } = useGetUser();
  const { data: timeToNextDraw } = useTimeToNextDraw(lang as Parameters<typeof useTimeToNextDraw>[0]);
  const {
    data: lotteryRollData,
    isIdle,
    isPending,
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
              <Trans>new tickets drop in {timeToNextDraw}</Trans>
            </Chip>
            <H3 align='center' size='2xl'>
              <Trans>
                You need at least {Intl.NumberFormat(locale).format(minPointsToRoll)} Spice to participate in Lottery.
              </Trans>
            </H3>
            <P align='center' color='grey-50' size='s'>
              <Trans>Harvest {pointsMissing.toFixed(2)} more Spice to play</Trans>
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
  const allRollsUsed = rollsRemaining === 0;
  const allVotesUsed = votesRemaining === 0;
  const allTicketsUsed = allRollsUsed && allVotesUsed;
  const notPlayed = lotteryRollData === undefined;
  const isWinner = lotteryRollData !== undefined && lotteryRollData.winningPackageId !== null;
  const isNotWinner = lotteryRollData !== undefined && lotteryRollData.winningPackageId === null;

  const getHeaderText = () => {
    if (allRollsUsed && !lotteryRollData) return <Trans>You Have 0 Tickets</Trans>;

    return (
      <>
        {isIdle && <Trans>You&apos;re Ready to Play!</Trans>}
        {isNotWinner && <Trans>Not your lucky day... yet!</Trans>}
        {isWinner && (
          <Trans>
            Congratulations you won!
            <br />
            Take a screenshot to share with your friends!
          </Trans>
        )}
        <br />
        <Trans>
          <Span color='primary-500' size='unset'>
            {rollsRemaining}/3
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
          Each ticket is your chance to win big! Vote for your favourite app to receive 3 new tickets daily and boost
          your chances.
        </Trans>
      );

    if (allTicketsUsed)
      return (
        <Trans>
          You&apos;ve used all your tickets for today, new tickets will be available once the timer resets! Remember to
          participate in Weekly Fusion Voting to be eligible for daily tickets.
        </Trans>
      );

    return (
      <Trans>
        Maximize your chances by using all your tickets before the countdown resets. Don&apos;t forget to participate in
        Weekly Fusion Voting to claim your 3 Lottery tickets daily.
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
            <Trans>new tickets drop in {timeToNextDraw}</Trans>
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
          {isWinner && (
            <H4 align='center' size='lg'>
              Share it on X with your referral link!
            </H4>
          )}
          <P align='center' color='grey-50' size='s'>
            {getDescriptionText()}
          </P>
        </Flex>
      </ModalBody>
      <ModalFooter padding='2xl'>
        <Flex alignItems='stretch' gap='xl' justifyContent='space-between'>
          {!allVotesUsed && (
            <StyledButton elementType={Link} variant='outline' {...{ href: `/${lang}${RoutesPath.APPS}` }}>
              <Trans>Get tickets</Trans>
            </StyledButton>
          )}
          {allRollsUsed && (
            <StyledButton variant='outline' onPress={onClose}>
              <Trans>Close</Trans>
            </StyledButton>
          )}
          {isWinner && (
            <StyledButton
              elementType={Link}
              variant='outline'
              {...{ href: `https://x.com/intent/tweet?text=${getPrefilledXText(user?.referral_code)}` }}
            >
              <Trans>Share on X</Trans>
            </StyledButton>
          )}
          {!allRollsUsed && (
            <StyledButton color='primary' loading={isPending} onPress={() => roll()}>
              <Trans>Play</Trans>
            </StyledButton>
          )}
        </Flex>
      </ModalFooter>
    </Modal>
  );
};

export { LotteryModal };
