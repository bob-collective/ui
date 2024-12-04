import { Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

enum Incentives {
  spice,
  pell,
  bedrock,
  segment,
  babylon,
  solv,
  supply
}

type StakingInfo = Record<string, (typeof stakingInfo)[keyof typeof stakingInfo] | undefined>;

const stakingInfo = {
  'bedrock-unibtc': {
    strategy: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    incentives: [Incentives.bedrock, Incentives.babylon],
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
    incentives: [Incentives.pell, Incentives.bedrock, Incentives.babylon],
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
    incentives: [Incentives.segment, Incentives.supply, Incentives.bedrock, Incentives.babylon],
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

export { stakingInfo };
export type { StakingInfo };
