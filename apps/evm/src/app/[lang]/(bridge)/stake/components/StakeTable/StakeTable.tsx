import {
  Table,
  Modal,
  Flex,
  Avatar,
  Button,
  ModalHeader,
  ModalBody,
  P,
  Dl,
  Dd,
  DlGroup,
  Dt,
  Divider,
  Link,
  Span,
  Chip,
  Card
} from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PellNetwork, Spice } from '@gobob/icons';
import { useLingui } from '@lingui/react';

import { StyledFlex, StyledCard } from '../../Stake.style';
import { StakingForm } from '../StakeForm';
import { StrategyData, useGetStakingStrategies } from '../../hooks';

import { chainL2 } from '@/constants';

const SpiceRewards = () => (
  <Card background='primary-500' padding='xs' style={{ width: 'fit-content' }}>
    <Spice size='xs' />
  </Card>
);

const PellPoints = () => (
  <Chip background='dark' size='s' startAdornment={<PellNetwork size='xs' />}>
    <Trans>Points</Trans>
  </Chip>
);

const BedrockDiamond = () => (
  <Chip
    background='blue-800'
    size='s'
    startAdornment={
      <Avatar size='xl' src='https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg' />
    }
  >
    <Trans>Diamond</Trans>
  </Chip>
);

const SegmentPoints = () => (
  <Chip
    size='s'
    startAdornment={
      <Avatar size='xl' src='https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg' />
    }
    style={{ backgroundColor: '#2C3CFE' }}
  >
    <Trans>Points</Trans>
  </Chip>
);

const BabylonPoints = () => (
  <Chip
    background='dark'
    size='s'
    startAdornment={<Avatar size='xl' src='https://avatars.githubusercontent.com/u/106378782?s=200&v=4' />}
  >
    <Trans>Points</Trans>
  </Chip>
);

const SolvXP = () => (
  <Chip
    size='s'
    startAdornment={<Avatar size='2xl' src='https://static.gobob.xyz/logos/SOLV%20LOGO%20purple.png' />}
    style={{ backgroundColor: '#301F5E' }}
  >
    <Trans>Solv XP</Trans>
  </Chip>
);

const SupplyApr = () => (
  <Chip background='grey-800' size='s'>
    <Trans>Supply APR</Trans>
  </Chip>
);

const StrategyCell = ({ name, protocol }: { protocol: string; name: string }) => (
  <Flex alignItems='flex-start' direction='column'>
    <Span size='xs' weight='bold'>
      {name}
    </Span>
    <Span color='grey-50' size='xs' weight='medium'>
      {protocol}
    </Span>
  </Flex>
);

enum Incentives {
  spice,
  pell,
  beckrock,
  segment,
  babylon,
  solv,
  supply
}

const incentivesMap: Record<Incentives, () => ReactNode> = {
  [Incentives.babylon]: BabylonPoints,
  [Incentives.beckrock]: BedrockDiamond,
  [Incentives.pell]: PellPoints,
  [Incentives.segment]: SegmentPoints,
  [Incentives.solv]: SolvXP,
  [Incentives.spice]: SpiceRewards,
  [Incentives.supply]: SupplyApr
};

enum StakeTableColumns {
  STRATEGY = 'strategy',
  REWARDS = 'incentives',
  TVL = 'tvl',
  ACTIONS = 'actions'
}

type StakeTableRow = {
  id: string;
  [StakeTableColumns.STRATEGY]: ReactNode;
  [StakeTableColumns.REWARDS]: ReactNode;
  [StakeTableColumns.TVL]: ReactNode;
  [StakeTableColumns.ACTIONS]: ReactNode;
};

const columns = [
  { name: <Trans>Strategy</Trans>, id: StakeTableColumns.STRATEGY, minWidth: 240 },
  // { name: <Trans>Protocol</Trans>, id: StakeTableColumns.PROTOCOL, minWidth: 150 },
  { name: <Trans>Rewards</Trans>, id: StakeTableColumns.REWARDS },
  { name: <Trans>TVL (on BOB)</Trans>, id: StakeTableColumns.TVL, minWidth: 96 },
  { name: '', id: StakeTableColumns.ACTIONS }
];

const stakingInfo = {
  'bedrock-unibtc': {
    strategy: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    incentives: [Incentives.beckrock, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock',
    website: 'https://app.bedrock.technology/unibtc'
  },
  'solv-solvbtcbbn': {
    strategy: 'Liquid Staking Solv-Babylon',
    protocol: 'Solv',
    incentives: [Incentives.solv, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>Stake BTC into Babylon via Solv Protocol and receive liquid staking token solvBTC.BBN.</Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solvlst',
    website: 'https://app.solv.finance/babylon?network=bob'
  },
  'pell-solvbtcbbn': {
    strategy: 'Restaking Pell-SolvBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentives.pell, Incentives.solv, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>
            Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and deposit into Pell.
          </Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'SolvBTC.BBN',
    securityReview: '',
    website: 'https://app.pell.network/restake'
  },
  'pell-unibtc': {
    strategy: 'Restaking Pell-uniBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentives.pell, Incentives.beckrock, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>
            Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and deposit into Pell restaking.
          </Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'uniBTC',
    securityReview: '',
    website: 'https://app.pell.network/restake'
  },
  'segment-tbtc': {
    strategy: 'Lending Segment-tBTC',
    protocol: 'Segment',
    incentives: [Incentives.segment, Incentives.supply],
    tvl: '-',
    about: <Trans>Lend out tBTC on Segment.</Trans>,
    inputToken: 'BTC',
    outputToken: 'tBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/tbtc',
    website: 'https://app.segment.finance'
  },
  'segment-wbtc': {
    strategy: 'Lending Segment-wBTC',
    protocol: 'Segment',
    incentives: [Incentives.segment, Incentives.supply],
    tvl: '-',
    about: <Trans>Lend out wBTC on Segment.</Trans>,
    inputToken: 'BTC',
    outputToken: 'wBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/wbtc',
    website: 'https://app.segment.finance'
  },
  'segment-sesolvbtcbbn': {
    strategy: 'Staked Lending Segment-SolvBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentives.segment, Incentives.supply, Incentives.solv, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>
            Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and lend it out on Segment.
          </Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance'
  },
  'segment-seunibtc': {
    strategy: 'Staked Lending Segment-uniBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentives.segment, Incentives.supply, Incentives.beckrock, Incentives.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>
            Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and lend it out on Segment.
          </Trans>
        </P>
        <P>
          <Trans>Attention: Babylon does not yet support withdrawals.</Trans>
        </P>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance'
  }
} as const;

const stakingInfoAny = stakingInfo as Record<string, (typeof stakingInfo)[keyof typeof stakingInfo] | undefined>;

interface Props {
  searchParams?: { receive: string };
  onStakeSuccess: () => void;
}

const StakeTable = ({ searchParams, onStakeSuccess }: Props) => {
  const [strategy, setStrategy] = useState<StrategyData>();

  const { i18n } = useLingui();

  const urlSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const { data: strategies = [] } = useGetStakingStrategies();

  useEffect(() => {
    if (!strategies || !urlSearchParams) return;

    const receive = urlSearchParams.get('receive');
    const validStrategy = strategies.find((strategy) => strategy.raw.integration.slug === receive);

    setStrategy(validStrategy);
  }, [urlSearchParams, strategies]);

  const rows: StakeTableRow[] = strategies.map((strategy, idx) => {
    return {
      id: `${strategy.raw.id}${idx}`,
      [StakeTableColumns.STRATEGY]: (
        <Flex alignItems='center' gap='lg'>
          {strategy.raw.integration.logo ? (
            <Avatar size={'2xl'} src={strategy.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
          )}
          <StrategyCell
            name={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategy as string}
            protocol={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.protocol as string}
          />
        </Flex>
      ),
      [StakeTableColumns.REWARDS]: (
        <Flex direction={{ base: 'column', md: 'row' }} gap='xs'>
          <SpiceRewards />
          {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives.map((incentive, key) => {
            const Comp = incentivesMap[incentive];

            return <Comp key={key} />;
          })}
        </Flex>
      ),
      [StakeTableColumns.TVL]: strategy?.tvl ?? '-',
      [StakeTableColumns.ACTIONS]: (
        <Flex direction='row' gap='md'>
          <Button color='primary' onPress={() => setStrategy(strategy)}>
            <Trans>Stake</Trans>
          </Button>
          <Button
            variant='outline'
            onPress={() =>
              window.open(stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website, '_blank', 'noreferrer')
            }
          >
            <Trans>Manage</Trans>
          </Button>
        </Flex>
      )
    };
  });

  return (
    <>
      <Table aria-label={t(i18n)`Staking table`} columns={columns} rows={rows} />
      {strategy && (
        <Modal isOpen={!!strategy} size='4xl' onClose={() => setStrategy(undefined)}>
          <StyledCard>
            <ModalHeader>
              <Flex direction='column' gap='lg'>
                <Flex alignItems='center' gap='lg'>
                  {strategy.raw.integration.logo ? (
                    <Avatar size={'4xl'} src={strategy.raw.integration.logo} />
                  ) : (
                    <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
                  )}
                  {strategy.raw.integration.name}
                </Flex>
                {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.about}
              </Flex>
            </ModalHeader>
            <ModalBody>
              <StyledFlex direction={{ base: 'column', md: 'row' }} gap='xl'>
                <StakingForm strategy={strategy} onStakeSuccess={onStakeSuccess} />
                <StyledFlex direction='column' gap='xl'>
                  <Dl direction='column' gap='lg'>
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        <Trans>Input Token</Trans>
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.inputToken}
                      </Dt>
                    </DlGroup>
                    <Divider />
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        <Trans>Output Token</Trans>
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        <Link
                          external
                          color='grey-50'
                          href={new URL(
                            `/address/${strategy?.raw.outputToken?.address}`,
                            chainL2.blockExplorers?.default.url
                          ).toString()}
                          size='md'
                          underlined='always'
                        >
                          {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.outputToken}
                        </Link>
                      </Dt>
                    </DlGroup>
                    {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.securityReview && (
                      <>
                        <Divider />
                        <DlGroup alignItems='center' justifyContent='space-between'>
                          <Dd size='md' style={{ minWidth: '15ch' }}>
                            <Trans>Security Review by Bitcoin Layers</Trans>
                          </Dd>
                          <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                            <Link
                              external
                              color='grey-50'
                              href={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.securityReview}
                              size='md'
                              underlined='always'
                            >
                              {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.securityReview}
                            </Link>
                          </Dt>
                        </DlGroup>
                      </>
                    )}
                    <Divider />
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        <Trans>Website</Trans>
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        <Link
                          external
                          color='grey-50'
                          href={stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website}
                          size='md'
                          underlined='always'
                        >
                          {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.website}
                        </Link>
                      </Dt>
                    </DlGroup>
                  </Dl>
                </StyledFlex>
              </StyledFlex>
            </ModalBody>
          </StyledCard>
        </Modal>
      )}
    </>
  );
};

export { StakeTable };
