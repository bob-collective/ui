import {
  Table,
  Modal,
  Flex,
  Avatar,
  Button,
  ArrowLongRight,
  ModalHeader,
  ModalBody,
  P,
  Dl,
  Dd,
  DlGroup,
  Dt,
  Divider,
  Link
} from '@gobob/ui';
import { Trans, t } from '@lingui/macro';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { PellNetwork } from '@gobob/icons';
import { ChainId } from '@gobob/chains';
import { useLingui } from '@lingui/react';

import { StyledFlex, StyledCard } from '../../Stake.style';
import { StakingForm } from '../StakeForm';
import { StrategyData, useGetStakingStrategies } from '../../hooks';

import { chainL2 } from '@/constants';
import { Chain } from '@/components';

enum StakeTableColumns {
  STRATEGY_NAME = 'strategyName',
  PROTOCOL = 'bridge',
  REWARDS = 'incentives',
  TVL = 'tvl',
  ACTION = 'action'
}

type StakeTableRow = {
  id: string;
  [StakeTableColumns.STRATEGY_NAME]: ReactNode;
  [StakeTableColumns.PROTOCOL]: ReactNode;
  [StakeTableColumns.REWARDS]: ReactNode;
  [StakeTableColumns.TVL]: ReactNode;
  [StakeTableColumns.ACTION]: ReactNode;
};

const columns = [
  { name: <Trans>Strategy Name</Trans>, id: StakeTableColumns.STRATEGY_NAME },
  { name: <Trans>Protocol</Trans>, id: StakeTableColumns.PROTOCOL },
  { name: <Trans>Rewards</Trans>, id: StakeTableColumns.REWARDS },
  { name: <Trans>TVL (on BOB)</Trans>, id: StakeTableColumns.TVL },
  { name: <Trans>Action</Trans>, id: StakeTableColumns.ACTION }
];

const stakingInfo = {
  'bedrock-unibtc': {
    strategyName: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> uniBTC
      </>
    ),
    incentives: <Trans>Spice + Bedrock Diamonds + Babylon Points</Trans>,
    tvl: '$10',
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
    strategyName: 'Liquid Staking Solv-Babylon',
    protocol: 'Solv',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> SolvBTC.BBN
      </>
    ),
    incentives: <Trans>Spice + Solv XP + Babylon Points</Trans>,
    tvl: '$10',
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
    strategyName: 'Restaking Pell-SolvBTC-Babylon',
    protocol: 'Pell',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> SolvBTC.BBN
      </>
    ),
    incentives: <Trans>Spice + Pell Points + Solv XP + Babylon Points</Trans>,
    tvl: '$10',
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
    strategyName: 'Restaking Pell-uniBTC-Babylon',
    protocol: 'Pell',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> uniBTC
      </>
    ),
    incentives: <Trans>Spice + Pell Points + Bedrock Diamond + Babylon Points</Trans>,
    tvl: '$10',
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
    strategyName: 'Lending Segment-tBTC',
    protocol: 'Segment',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} /> tBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    tvl: '$10',
    about: <Trans>Lend out tBTC on Segment.</Trans>,
    inputToken: 'BTC',
    outputToken: 'tBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/tbtc',
    website: 'https://app.segment.finance'
  },
  'segment-wbtc': {
    strategyName: 'Lending Segment-wBTC',
    protocol: 'Segment',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> wBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR</Trans>,
    tvl: '$10',
    about: <Trans>Lend out wBTC on Segment.</Trans>,
    inputToken: 'BTC',
    outputToken: 'wBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/wbtc',
    website: 'https://app.segment.finance'
  },
  'segment-sesolvbtcbbn': {
    strategyName: 'Staked Lending Segment-SolvBTC-Babylon',
    protocol: 'Segment',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> seSOLVBTCBBN
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR + Solv XP + Babylon Points</Trans>,
    tvl: '$10',
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
    strategyName: 'Staked Lending Segment-uniBTC-Babylon',
    protocol: 'Segment',
    strategy: (
      <>
        <Chain chainId='BTC' iconProps={{ size: 'xs' }} label={false} />
        <ArrowLongRight color='grey-50' size='s' />
        <Chain chainId={ChainId.BOB} iconProps={{ size: 'xs' }} label={false} /> seUNIBTC
      </>
    ),
    incentives: <Trans>Spice + Segment Points + Supply APR + Bedrock Diamonds + Babylon Points</Trans>,
    tvl: '$10',
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
};

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
      [StakeTableColumns.STRATEGY_NAME]: (
        <Flex alignItems='center' gap='lg'>
          {strategy.raw.integration.logo ? (
            <Avatar size={'2xl'} src={strategy.raw.integration.logo} />
          ) : (
            <PellNetwork style={{ height: '1.3rem', width: '1.3rem' }} />
          )}
          {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.strategyName}
        </Flex>
      ),
      [StakeTableColumns.PROTOCOL]: (
        <Flex alignItems='center' gap='lg'>
          <>{stakingInfoAny[strategy?.raw.integration.slug ?? '']?.protocol}</>
        </Flex>
      ),
      [StakeTableColumns.REWARDS]: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.incentives,
      [StakeTableColumns.TVL]: stakingInfoAny[strategy?.raw.integration.slug ?? '']?.tvl,
      [StakeTableColumns.ACTION]: (
        <Button color='primary' onPress={() => setStrategy(strategy)}>
          Stake
        </Button>
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
              <StyledFlex direction='row' gap='xl'>
                <StyledFlex>
                  <StakingForm strategy={strategy} onStakeSuccess={onStakeSuccess} />
                </StyledFlex>
                <StyledFlex direction='column' gap='xl'>
                  <Dl direction='column' gap='lg'>
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        Input Token
                      </Dd>
                      <Dt style={{ textAlign: 'right', wordBreak: 'break-word' }}>
                        {stakingInfoAny[strategy?.raw.integration.slug ?? '']?.inputToken}
                      </Dt>
                    </DlGroup>
                    <Divider />
                    <DlGroup alignItems='center' justifyContent='space-between'>
                      <Dd size='md' style={{ minWidth: '15ch' }}>
                        Output Token
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
                            Security Review by Bitcoin Layers
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
                        Website
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
