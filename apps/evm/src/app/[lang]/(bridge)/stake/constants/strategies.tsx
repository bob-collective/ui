import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';

enum Incentive {
  spice,
  pell,
  bedrock,
  segment,
  babylon,
  solv,
  supply
}

type StrategyInfo = {
  name: string;
  protocol: string;
  incentives: Incentive[];
  tvl: string;
  about: ReactNode;
  outputToken: string;
  securityReview: string;
  website: string;
  isDisabled?: boolean;
  warningMessage?: ReactNode;
};

const babylonWithdrawWarning = <Trans>Babylon does not yet support withdrawals.</Trans>;

const strategiesInfo: Record<string, StrategyInfo> = {
  'bedrock-unibtc': {
    name: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    incentives: [Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>,
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
    website: 'https://app.bedrock.technology/unibtc',
    warningMessage: babylonWithdrawWarning
  },
  'solv-solvbtcbbn': {
    name: 'Liquid Staking Solv-Babylon',
    protocol: 'Solv',
    incentives: [Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: <Trans>Stake BTC into Babylon via Solv Protocol and receive liquid staking token solvBTC.BBN.</Trans>,
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
    website: 'https://app.solv.finance/babylon?network=bob',
    warningMessage: babylonWithdrawWarning
  },
  'pell-solvbtcbbn': {
    name: 'Restaking Pell-SolvBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: (
      <Trans>
        Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and deposit into Pell.
      </Trans>
    ),
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
    website: 'https://app.pell.network/restake',
    warningMessage: babylonWithdrawWarning
  },
  'pell-unibtc': {
    name: 'Restaking Pell-uniBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: (
      <Trans>
        Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and deposit into Pell restaking.
      </Trans>
    ),
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
    website: 'https://app.pell.network/restake',
    warningMessage: babylonWithdrawWarning
  },
  'segment-tbtc': {
    name: 'Lending Segment-tBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: <Trans>Lend out tBTC on Segment.</Trans>,
    outputToken: 'tBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/threshold-tbtc',
    website: 'https://app.segment.finance'
  },
  'segment-wbtc': {
    name: 'Lending Segment-wBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: <Trans>Lend out wBTC on Segment. </Trans>,
    outputToken: 'wBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bitgo-wbtc',
    website: 'https://app.segment.finance'
  },
  'segment-sesolvbtcbbn': {
    name: 'Staked Lending Segment-SolvBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.solv, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about: (
      <Trans>
        Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and lend it out on Segment.
      </Trans>
    ),
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance',
    warningMessage: babylonWithdrawWarning
  },
  'segment-seunibtc': {
    name: 'Staked Lending Segment-uniBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.bedrock, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about: (
      <Trans>Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and lend it out on Segment.</Trans>
    ),
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance',
    warningMessage: babylonWithdrawWarning
  }
} as const;

export { Incentive, strategiesInfo };
export type { StrategyInfo };
