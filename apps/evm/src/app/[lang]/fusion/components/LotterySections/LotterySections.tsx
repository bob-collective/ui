import { Chip, Flex, H2, P, SolidClock, SolidInformationCircle, Span, Tooltip } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Plural, Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { LotteryModal } from './LotteryModal';
import { StyledButton, StyledCard } from './LotterySections.style';
import { ROUND_END_TIME } from './constants';

import { useLotteryStats } from '@/hooks';
import { useIsClient } from 'usehooks-ts';

const tooltipLabel = '';

function LotterySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const isClient = useIsClient();
  const { data: lotteryStatsData } = useLotteryStats(address);

  return (
    <>
      <Flex direction={{ base: 'column', s: 'row' }} gap='4xl' marginTop='7xl'>
        <StyledCard flex={0.4} />
        <Flex alignItems='flex-start' direction='column' gap='4xl' justifyContent='center'>
          <Flex alignItems='flex-start' direction='column' gap='lg' justifyContent='center'>
            <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
              <Trans>{formatDistanceToNow(ROUND_END_TIME)} until next draw</Trans>
            </Chip>
            <H2 size='4xl'>
              {!isClient || (!address && isClient) ? (
                <Trans>Lottery</Trans>
              ) : (
                <Trans>
                  <Span color='primary-500' size='unset'>
                    {lotteryStatsData?.rollsRemaining ?? 0}{' '}
                    <Plural one='Ticket' other='Tickets' value={lotteryStatsData?.rollsRemaining || 0} />{' '}
                  </Span>
                  Remaining
                </Trans>
              )}{' '}
              {tooltipLabel && (
                <Tooltip label={tooltipLabel}>
                  <SolidInformationCircle color='grey-50' size='s' />
                </Tooltip>
              )}
            </H2>
            <P color='grey-50'>
              <Trans>
                Join BOB&apos;s voting campaign, vote on projects, & get tickets for prizes. New users get a spice
                bonus. Engage, vote, and win!
              </Trans>
            </P>
          </Flex>
          <StyledButton
            color='primary'
            disabled={
              !isClient || (!address && isClient)
              // (lotteryStatsData?.rollsRemaining === 0 && lotteryStatsData?.votesRemaining === 0)
            }
            onClick={() => setIsModalOpen(true)}
          >
            {isClient && address ? <Trans>Play</Trans> : <Trans>Login to play</Trans>}
          </StyledButton>
        </Flex>
      </Flex>
      <LotteryModal {...lotteryStatsData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export { LotterySection };
