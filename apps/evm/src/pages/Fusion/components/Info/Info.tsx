import { Accordion, AccordionItem, Alert, Card, Flex, H1, H2, P, Span, Table, TextLink } from '@gobob/ui';
import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import infoSpiceAccrualSrc from '../../../../assets/info-spice-accrual.gif';
import { NotionLinks, SocialLinks } from '../../../../constants';

import { MultiplierTable } from './MultiplierTable';
import { StyledList, StyledTableP } from './Info.style';

const columnsSpiceAccrual = [
  { id: 'timeline', name: 'Timeline' },
  { id: 'alice', name: "User Alice's Spice" },
  { id: 'protocol', name: "Protocol's Spice" },
  { id: 'lp', name: "LP's Spice" }
];

const rowsSpiceAccrual = [
  {
    id: 1,
    timeline: <StyledTableP size='s'>1. User Alice made a transaction that generated 100 Spice</StyledTableP>,
    alice: '100',
    protocol: '100',
    lp: '0'
  },
  {
    id: 2,
    timeline: <StyledTableP size='s'>2. TVL Spice distribution to project for 500 Spice</StyledTableP>,
    alice: '100',
    protocol: '600',
    lp: '0'
  },
  {
    id: 3,
    timeline: <StyledTableP size='s'>3. Project distributes all Spice to LPs</StyledTableP>,

    alice: '100',
    protocol: '0',
    lp: '600'
  }
];

const columnsReferralExample = [
  { id: 'user', name: 'User' },
  { id: 'points', name: 'Points' },
  { id: 'explanation', name: 'Explanation' }
];

const rowsReferralExample = [
  {
    id: 1,
    user: <StyledTableP size='s'>Alice</StyledTableP>,
    points: '157',
    explanation: '150 (from referring BOB) + 7 (from BOB referring Carol)'
  },
  {
    id: 2,
    user: <StyledTableP size='s'>Bob</StyledTableP>,
    points: '1015',
    explanation: '1000 (harvested) + 15 (from referring Carol)'
  },
  {
    id: 3,
    user: <StyledTableP size='s'>Carol</StyledTableP>,

    points: '100',
    explanation: '100 (harvested)'
  }
];

type SpiceMeterProps = {
  isLow?: boolean;
  isMedium?: boolean;
  isHigh?: boolean;
  label?: ReactNode;
};

const SpiceMeter = ({ isHigh, isLow, isMedium, label }: SpiceMeterProps) => (
  <Flex alignItems='center' elementType='span' gap='xs' style={{ display: 'inline-flex' }}>
    {label && (
      <Span color='grey-200' size='s'>
        {label}:
      </Span>
    )}
    <Flex alignItems='center' elementType='span'>
      {isLow && (
        <Span color='green-500' size='s'>
          Low
        </Span>
      )}
      {isMedium && (
        <>
          {isLow && (
            <Span color='grey-200' size='s'>
              /
            </Span>
          )}
          <Span color='primary-500' size='s'>
            Medium
          </Span>
        </>
      )}
      {isHigh && (
        <>
          {isMedium && (
            <Span color='grey-200' size='s'>
              /
            </Span>
          )}
          <Span color='red-500' size='s'>
            High
          </Span>
        </>
      )}
    </Flex>
  </Flex>
);

const AccordionItemTitle = ({ title, isHigh, isLow, isMedium }: { title: ReactNode } & SpiceMeterProps) => (
  <Flex wrap direction='column' elementType='span' flex={1} justifyContent='space-between' marginRight='md'>
    <Span align='start' size='inherit' weight='inherit'>
      {title}
    </Span>
    <SpiceMeter isHigh={isHigh} isLow={isLow} isMedium={isMedium} label='Spice Meter' />
  </Flex>
);

const Info = () => {
  const { t } = useTranslation();

  return (
    <Flex direction='column' gap='2xl' marginTop='3xl'>
      <Card gap='lg'>
        <H1 size='2xl' weight='semibold'>
          What is BOB Fusion Season 2?
        </H1>
        <P color='grey-200'>
          BOB Fusion is the official points program of BOB, where users can harvest Spice (points) based on:
        </P>
        <StyledList>
          <li>TVL ({<SpiceMeter isHigh isMedium />})</li>
          <li>Using dApps ({<SpiceMeter isLow isMedium />})</li>
          <li>Referrals ({<SpiceMeter isHigh isLow isMedium />})</li>
          <li>Quests and special events ({<SpiceMeter isLow isMedium />})</li>
        </StyledList>
        <P color='grey-200'>
          Intract XP converts into Spice in a 1:10 ratio. E.g. if you have 1000 XP from BOB campaigns, it will be
          converted to 10,000 Spice and added to your BOB Fusion Dashboard.
        </P>
        <P color='grey-200'>DApps can use the BOB Fusion system to bootstrap their launch on BOB.</P>
        <Accordion defaultExpandedKeys={['2']}>
          <AccordionItem key='1' hasChildItems={false} title='Season 1'>
            <P color='grey-200'>
              Season 1 started on 27/03/2024 and ended with the BOB mainnet launch on 1st May 2024. During Season 1,
              users harvested Spice by locking in whitelisted assets with different multipliers. The on-chain TVL for
              Season 1 reached a whopping 300 Million USD in just 4 weeks.
            </P>
          </AccordionItem>
          <AccordionItem key='2' hasChildItems={false} title='Season 2'>
            <P color='grey-200'>
              Season 2 started on 1st May 2024 with more ways to harvest Spice based on-chain activity. Below are
              different ways in which you can harvest Spice during Season 2.
            </P>
          </AccordionItem>
        </Accordion>
      </Card>
      <Card>
        <H1 size='2xl' weight='semibold'>
          Spice System
        </H1>
        <P color='grey-200'>Spice represents a users or projects support to the growth of the BOB ecosystem.</P>
        <Accordion>
          <AccordionItem key='1' hasChildItems={false} title={<AccordionItemTitle isHigh isMedium title='TVL' />}>
            <Flex direction='column' gap='lg'>
              <P>Harvesting</P>
              <P color='grey-200'>
                Supplying TVL into dApps generates the most Spice. Exact amount depends on the asset (see multipliers)
                and the dApp. Higher effort/risk and benefit for the ecosystem results in more Spice.
              </P>
              <StyledList>
                <li>
                  Example: DEXes generate significantly more Spice then lending protocols. That is because providing
                  liquidity to DEXes involes higher risk, and DEX liquidity is needed for lending protocols to function
                  (liquidations)
                </li>
                <li>Whitelisted assets and multipliers:</li>
              </StyledList>
              <MultiplierTable />
              <P>Distribution</P>
              <P color='grey-200'>
                TVL Spice points are allocated to dApps that re-distribute them to users. Distribution may vary from
                project to project (e.g. special bonuses or requirements). DYOR.
              </P>
            </Flex>
          </AccordionItem>
          <AccordionItem
            key='2'
            hasChildItems={false}
            title={<AccordionItemTitle isLow isMedium title='Actively using BOB dApps' />}
          >
            <Flex direction='column' gap='lg'>
              <P>Harvesting</P>
              <P color='grey-200'>You also harvest Spice when you use dApps participating in BOB Fusion.</P>
              <Alert status='warning' variant='outlined'>
                Rate limits and anti-spam measures are in place. Extreme cases of spamming may lead to exclusion from
                BOB Fusion.
              </Alert>
              <P color='grey-200'>This Spice is split 50:50 between user and dApp.</P>
              <StyledList>
                <li>User points: directly distributed</li>
                <li>dApp points: dApps redistribute to their LPs (DeFi), creators (NFTs) and or via special quests.</li>
              </StyledList>
              <P>Distribution</P>
              <P color='grey-200'>
                TVL Spice points are allocated to dApps that re-distribute them to users. Distribution may vary from
                project to project (e.g. special bonuses or requirements). DYOR.
              </P>
              <P>Spice Accrual Example: Visual</P>
              <img alt='spice accrual example' src={infoSpiceAccrualSrc} />
              <P>Spice Accrual Example: Visual</P>
              <Table columns={columnsSpiceAccrual} rows={rowsSpiceAccrual} wrapperProps={{ padding: 'lg' }} />
            </Flex>
          </AccordionItem>
          <AccordionItem
            key='3'
            hasChildItems={false}
            title={<AccordionItemTitle isHigh isLow isMedium title='Referrals' />}
          >
            <Flex direction='column' gap='lg'>
              <P>Harvesting</P>
              <P color='grey-200'>Users can harvest Spice by completing quests of the Galxe or Intract campaign.</P>
              <P>Distribution</P>
              <P color='grey-200'>
                Invite users to join BOB Fusion and get 15% Spice for direct invites and 7% for invites of your
                invitees. The referral bonus is calculated based on ALL Spice the referred users harvest until the end
                of the BOB Fusion campaign, across all of the apps they use (excluding points they collect from their
                own referrals).
              </P>
              <StyledList>
                <li>
                  Example: Alice referred BOB. BOB referred Carol. BOB collects 1000 Spice points. Carol collects 100
                  Spice points.
                </li>
              </StyledList>
              <Table columns={columnsReferralExample} rows={rowsReferralExample} wrapperProps={{ padding: 'lg' }} />
            </Flex>
          </AccordionItem>
          <AccordionItem
            key='4'
            hasChildItems={false}
            title={<AccordionItemTitle isLow isMedium title='Quests and special events' />}
          >
            <Flex direction='column' gap='lg'>
              <P>Harvesting</P>
              <P color='grey-200'>Users can harvest Spice by completing quests of the Galxe or Intract campaign. </P>
              <P>Distribution</P>
              <P color='grey-200'>
                Users will earn points with the respective campaign website (Galxe or Intract) which will be manually
                added to their Spice balance by the BOB team at after the campaign ended.
              </P>
            </Flex>
          </AccordionItem>
        </Accordion>
      </Card>
      <Card gap='lg'>
        <H2 size='2xl' weight='semibold'>
          {t('fusion.community.title')}
        </H2>
        <P color='grey-200'>
          <Trans
            components={{
              xLink: <TextLink external href='https://twitter.com/build_on_bob' />,
              discordLink: <TextLink external href='https://discord.gg/gobob' />
            }}
            i18nKey='fusion.community.content'
          />
        </P>
      </Card>
      <Card gap='lg'>
        <H2 size='2xl' weight='semibold'>
          For Projects
        </H2>
        <P color='grey-200'>
          Reach out to the team on{' '}
          {
            <TextLink external href={SocialLinks.TELEGRAM}>
              Telegram
            </TextLink>
          }{' '}
          to learn more about the opportunities for builders to grow their project with our BOB Fusion campaign or read
          our{' '}
          {
            <TextLink external href={NotionLinks.LAUNCH_PARTNERS_CHECKLIST}>
              project checklist
            </TextLink>
          }{' '}
          that includes information about how to whitelist your dApp or add custom assets to the BOB Fusion campaign.
        </P>
      </Card>
    </Flex>
  );
};

export { Info };
