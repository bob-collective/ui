import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';

enum StrategyIncentive {
  spice,
  pell,
  bedrock,
  segment,
  babylon,
  solv,
  supply
}

enum StrategyProtocol {
  Bedrock = 'Bedrock',
  Solv = 'Solv',
  Pell = 'Pell',
  Segment = 'Segment'
}

type StrategyInfo = {
  name: string;
  description: ReactNode;
  protocol: StrategyProtocol;
  incentives: StrategyIncentive[];
  outputToken?: string;
  isDisabled?: boolean;
  warningMessage?: ReactNode;
  links: {
    securityReview?: string;
    landingPage: string;
    manage: string;
  };
};

const babylonWithdrawWarning = <Trans>Babylon does not yet support withdrawals.</Trans>;

const strategiesInfo: Record<string, StrategyInfo> = {
  'bedrock-unibtc': {
    name: 'Liquid Staking Bedrock-Babylon',
    description: <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>,
    protocol: StrategyProtocol.Bedrock,
    incentives: [StrategyIncentive.bedrock, StrategyIncentive.babylon],
    outputToken: 'uniBTC',
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
      landingPage: 'https://app.bedrock.technology',
      manage: 'https://app.bedrock.technology/unibtc'
    },
    warningMessage: babylonWithdrawWarning
  },
  'solv-solvbtcbbn': {
    name: 'Liquid Staking Solv-Babylon',
    description: <Trans>Stake BTC into Babylon via Solv Protocol and receive liquid staking token solvBTC.BBN.</Trans>,
    protocol: StrategyProtocol.Solv,
    incentives: [StrategyIncentive.solv, StrategyIncentive.babylon],
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
      landingPage: 'https://solv.finance/',
      manage: 'https://app.solv.finance/babylon?network=bob'
    },
    warningMessage: babylonWithdrawWarning
  },
  'pell-solvbtcbbn': {
    name: 'Restaking Pell-SolvBTC-Babylon',
    description: (
      <Trans>
        Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and deposit into Pell.
      </Trans>
    ),
    protocol: StrategyProtocol.Pell,
    incentives: [StrategyIncentive.pell, StrategyIncentive.solv, StrategyIncentive.babylon],
    outputToken: 'SolvBTC.BBN',
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef'
    },
    warningMessage: babylonWithdrawWarning
  },
  'pell-unibtc': {
    name: 'Restaking Pell-uniBTC-Babylon',
    description: (
      <Trans>
        Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and deposit into Pell restaking.
      </Trans>
    ),
    protocol: StrategyProtocol.Pell,
    incentives: [StrategyIncentive.pell, StrategyIncentive.bedrock, StrategyIncentive.babylon],
    outputToken: 'uniBTC',
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x631ae97e24f9F30150d31d958d37915975F12ed8'
    },
    warningMessage: babylonWithdrawWarning
  },
  'segment-tbtc': {
    name: 'Lending Segment-tBTC',
    description: <Trans>Lend out tBTC on Segment.</Trans>,
    protocol: StrategyProtocol.Segment,
    incentives: [StrategyIncentive.segment, StrategyIncentive.supply],
    outputToken: 'tBTC',
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/threshold-tbtc',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0xD30288EA9873f376016A0250433b7eA375676077'
    }
  },
  'segment-wbtc': {
    name: 'Lending Segment-wBTC',
    description: <Trans>Lend out wBTC on Segment. </Trans>,
    protocol: StrategyProtocol.Segment,
    incentives: [StrategyIncentive.segment, StrategyIncentive.supply],
    outputToken: 'wBTC',
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bitgo-wbtc',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x6265C05158f672016B771D6Fb7422823ed2CbcDd'
    }
  },
  'segment-sesolvbtcbbn': {
    name: 'Staked Lending Segment-SolvBTC-Babylon',
    description: (
      <Trans>
        Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and lend it out on Segment.
      </Trans>
    ),
    protocol: StrategyProtocol.Segment,
    incentives: [
      StrategyIncentive.segment,
      StrategyIncentive.solv,
      StrategyIncentive.babylon,
      StrategyIncentive.supply
    ],
    outputToken: 'seSOLVBTCBBN',
    links: {
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x5EF2B8fbCc8aea2A9Dbe2729F0acf33E073Fa43e'
    },
    warningMessage: babylonWithdrawWarning
  },
  'segment-seunibtc': {
    name: 'Staked Lending Segment-uniBTC-Babylon',
    description: (
      <Trans>Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and lend it out on Segment.</Trans>
    ),
    protocol: StrategyProtocol.Segment,
    incentives: [
      StrategyIncentive.segment,
      StrategyIncentive.bedrock,
      StrategyIncentive.babylon,
      StrategyIncentive.supply
    ],
    outputToken: 'seUNIBTC',
    links: {
      securityReview: '',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x7848F0775EebaBbF55cB74490ce6D3673E68773A'
    },
    warningMessage: babylonWithdrawWarning
  }
} as const;

export { StrategyIncentive, strategiesInfo };
export type { StrategyInfo };
