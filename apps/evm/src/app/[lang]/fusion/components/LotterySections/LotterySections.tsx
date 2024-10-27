import { Chip, Flex, H2, P, SolidClock, Span, Skeleton } from '@gobob/ui';
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

import { useGetUser, useLotteryStats } from '@/hooks';

function LotterySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const isClient = useIsClient();
  const { data: user } = useGetUser();
  const { data: lotteryStatsData, isError, isLoading } = useLotteryStats();
  const { i18n } = useLingui();

  return (
    <>
      <Flex direction={{ base: 'column', s: 'row' }} gap='4xl' marginTop='7xl'>
        {/* 499px matches figma designs */}
        <StyledCard
          background='unset'
          flex={{ base: '0 0 100%', s: '0 0 355px', lg: '0 0 499px' }}
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
        <Flex alignItems='flex-start' direction='column' flex='1 0' gap='4xl' justifyContent='center'>
          <Flex alignItems='flex-start' direction='column' gap='lg' justifyContent='center'>
            <Chip background='grey-500' borderColor='grey-200' startAdornment={<SolidClock size='s' />}>
              {isClient ? (
                <Trans>{formatDistanceToNow(ROUND_END_TIME)} until next draw</Trans>
              ) : (
                <Skeleton width='11xl' />
              )}
            </Chip>
            <H2 size='4xl'>
              {!isClient || (!address && isClient) || !user || isError || isLoading ? (
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
              {/* {tooltipLabel && (
                <Tooltip label={tooltipLabel}>
                  <SolidInformationCircle color='grey-50' size='s' />
                </Tooltip>
              )} */}
            </H2>
            <P color='grey-50'>
              <Trans>
                Feeling lucky? Try your luck with the daily lottery!
                <br />
                Participate in Fusion voting to receive 3 lottery tickets each day.
              </Trans>
            </P>
          </Flex>
          <StyledButton
            color='primary'
            disabled={!isClient || (!user && isClient)}
            onPress={() => setIsModalOpen(true)}
          >
            {isClient && address && user ? <Trans>Play</Trans> : <Trans>Login to play</Trans>}
          </StyledButton>
        </Flex>
      </Flex>
      {lotteryStatsData && (
        <LotteryModal {...lotteryStatsData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export { LotterySection };
