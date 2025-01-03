import { Alert, Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

enum Incentive {
  spice,
  pell,
  bedrock,
  segment,
  babylon,
  solv,
  supply
}

type StakingInfo = {
  strategy: string;
  protocol: string;
  incentives: Incentive[];
  tvl: string;
  about: JSX.Element;
  inputToken: string;
  outputToken: string;
  securityReview: string;
  website: string;
  isDisabled?: boolean;
};

const stakingInfo: Record<string, StakingInfo> = {
  'bedrock-unibtc': {
    strategy: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    incentives: [Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: (
      <Flex direction='column' gap='md'>
        <P>
          <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>
        </P>
        <Alert status='warning'>
          <Trans>Bedrock does not yet support withdrawals.</Trans>
        </Alert>
      </Flex>
    ),
    inputToken: 'BTC',
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
    website: 'https://app.bedrock.technology/unibtc'
  },
  'solv-solvbtcbbn': {
    strategy: 'Liquid Staking Solv-Babylon',
    protocol: 'Solv',
    incentives: [Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: (
      <P>
        <Trans>Stake BTC into Babylon via Solv Protocol and receive liquid staking token SolvBTC.BBN.</Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
    website: 'https://app.solv.finance/babylon?network=bob'
  },
  'pell-solvbtcbbn': {
    strategy: 'Restaking Pell-SolvBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: (
      <P>
        <Trans>
          Stake BTC into Babylon via Solv Protocol, get SolvBTC.BBN liquid staking token, and deposit into Pell.
        </Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
    website: 'https://app.pell.network/restake'
  },
  'pell-unibtc': {
    strategy: 'Restaking Pell-uniBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: (
      <P>
        <Trans>
          Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and deposit into Pell restaking.
        </Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
    website: 'https://app.pell.network/restake'
  },
  'segment-tbtc': {
    strategy: 'Lending Segment-tBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: (
      <P>
        <Trans>Lend out tBTC on Segment.</Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'tBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/threshold-tbtc',
    website: 'https://app.segment.finance'
  },
  'segment-wbtc': {
    strategy: 'Lending Segment-wBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: (
      <P>
        <Trans>Lend out wBTC on Segment.</Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'wBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bitgo-wbtc',
    website: 'https://app.segment.finance'
  },
  'segment-sesolvbtcbbn': {
    strategy: 'Staked Lending Segment-SolvBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.solv, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about: (
      <P>
        <Trans>
          Stake BTC into Babylon via Solv Protocol, get SolvBTC.BBN liquid staking token, and lend it out on Segment.
        </Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'seSOLVBTCBBN',
    securityReview: '',
    website: 'https://app.segment.finance'
  },
  'segment-seunibtc': {
    strategy: 'Staked Lending Segment-uniBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.bedrock, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about: (
      <P>
        <Trans>Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and lend it out on Segment.</Trans>
      </P>
    ),
    inputToken: 'BTC',
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance'
  }
} as const;

export { stakingInfo, Incentive };
export type { StakingInfo };
