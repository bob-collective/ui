import { Chip, Flex, H2, P, SolidClock, SolidInformationCircle, Span, Tooltip, Skeleton } from '@gobob/ui';
import { useAccount } from '@gobob/wagmi';
import { Plural, t, Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';
import { useIsClient } from 'usehooks-ts';
import { useLingui } from '@lingui/react';
import lottery from '@public/assets/lottery.png';

import { LotteryModal } from './LotteryModal';
import { StyledButton, StyledCard } from './LotterySections.style';
import { ROUND_END_TIME } from './constants';

import { useLotteryStats } from '@/hooks';

const tooltipLabel = '';

function LotterySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const isClient = useIsClient();
  const { data: lotteryStatsData } = useLotteryStats(address);
  const { i18n } = useLingui();

  return (
    <>
      <Flex direction={{ base: 'column', s: 'row' }} gap='4xl' marginTop='7xl'>
        {/* 499px matches figma designs */}
        <StyledCard
          background='unset'
          flex={{ base: '1 0 100%', s: '1 0 355px', lg: '1 0 499px' }}
          justifyContent='center'
          padding='none'
        >
          <Image
            alt={t(i18n)`Lottery`}
            placeholder='blur'
            sizes='100vw'
            src={lottery}
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </StyledCard>
        <Flex alignItems='flex-start' direction='column' gap='4xl' justifyContent='center'>
          <Flex alignItems='flex-start' direction='column' gap='lg' justifyContent='center'>
            <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
              {isClient ? (
                <Trans>{formatDistanceToNow(ROUND_END_TIME)} until next draw</Trans>
              ) : (
                <Skeleton width='10xl' />
              )}
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
