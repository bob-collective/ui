import { ChainId } from '@gobob/chains';
import { ERC20Token } from '@gobob/currency';
import { TBTC, WBTC } from '@gobob/tokens';
import { Trans } from '@lingui/macro';
import { ReactNode } from 'react';
import { Address } from 'viem';

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
  Segment = 'Segment',
  Lombard = 'Lombard'
}

type StrategyCurrency =
  | { currency: { symbol: string; address: Address }; logoUrl: string }
  | { currency: ERC20Token; logoUrl: string };

type StrategyInfo = {
  name: string;
  description: ReactNode;
  protocol: StrategyProtocol;
  incentives: StrategyIncentive[];
  isDisabled?: boolean;
  warningMessage?: ReactNode;
  links: {
    securityReview?: string;
    landingPage: string;
    manage: string;
  };
  breakdown: Array<StrategyCurrency>;
};

const wBTC: StrategyCurrency = {
  currency: WBTC![ChainId.BOB]!,
  logoUrl:
    'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
};

const tBTC: StrategyCurrency = {
  currency: TBTC![ChainId.BOB]!,
  logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg'
};

const uniBTC: StrategyCurrency = {
  currency: { symbol: 'uniBTC', address: '0x236f8c0a61dA474dB21B693fB2ea7AAB0c803894' as Address },
  logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg'
};

const solvBTCPath: StrategyInfo['breakdown'] = [
  {
    currency: { symbol: 'SolvBTC', address: '0x541fd749419ca806a8bc7da8ac23d346f2df8b77' },
    logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/solvBTC.svg'
  },
  {
    currency: { symbol: 'SolvBTC.BBN', address: '0xcc0966d8418d412c599a6421b760a847eb169a8c' },
    logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/solvBTC.BBN.svg'
  }
];

const babylonWithdrawWarning = <Trans>Babylon does not yet support withdrawals.</Trans>;

const strategiesInfo: Record<string, StrategyInfo> = {
  'bedrock-unibtc': {
    name: 'Liquid Staking Bedrock-Babylon',
    description: <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>,
    protocol: StrategyProtocol.Bedrock,
    incentives: [StrategyIncentive.bedrock, StrategyIncentive.babylon],
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
      landingPage: 'https://app.bedrock.technology',
      manage: 'https://app.bedrock.technology/unibtc?network=bob'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC, uniBTC]
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
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC, ...solvBTCPath]
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
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn',
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC, ...solvBTCPath]
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
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x631ae97e24f9F30150d31d958d37915975F12ed8'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC, uniBTC]
  },
  'segment-tbtc': {
    name: 'Lending Segment-tBTC',
    description: <Trans>Lend out tBTC on Segment.</Trans>,
    protocol: StrategyProtocol.Segment,
    incentives: [StrategyIncentive.segment, StrategyIncentive.supply],
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/threshold-tbtc',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0xD30288EA9873f376016A0250433b7eA375676077'
    },
    breakdown: [
      tBTC,
      {
        currency: { symbol: 'seTBTC', address: '0xD30288EA9873f376016A0250433b7eA375676077' },
        logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg'
      }
    ]
  },
  'segment-wbtc': {
    name: 'Lending Segment-wBTC',
    description: <Trans>Lend out wBTC on Segment. </Trans>,
    protocol: StrategyProtocol.Segment,
    incentives: [StrategyIncentive.segment, StrategyIncentive.supply],
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/bitgo-wbtc',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x6265C05158f672016B771D6Fb7422823ed2CbcDd'
    },
    breakdown: [
      tBTC,
      {
        currency: { symbol: 'seWBTC', address: '0x6265C05158f672016B771D6Fb7422823ed2CbcDd' },
        logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg'
      }
    ]
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
    links: {
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x5EF2B8fbCc8aea2A9Dbe2729F0acf33E073Fa43e'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [
      wBTC,
      ...solvBTCPath,
      {
        currency: { symbol: 'seSOLVBTCBBN', address: '0x5EF2B8fbCc8aea2A9Dbe2729F0acf33E073Fa43e' },
        logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg'
      }
    ]
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
    links: {
      securityReview: '',
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x7848F0775EebaBbF55cB74490ce6D3673E68773A'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [
      wBTC,
      uniBTC,
      {
        currency: { symbol: 'seUNIBTC', address: '0x7848F0775EebaBbF55cB74490ce6D3673E68773A' },
        logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg'
      }
    ]
  },
  'lombard-lbtc': {
    name: 'Liquid Staking Lombard BTC',
    incentives: [StrategyIncentive.supply],
    protocol: StrategyProtocol.Lombard,
    description: <Trans>Stake BTC into Lombard and receive liquid staking token LBTC</Trans>,
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/lombard-lbtc',
      manage: 'https://www.lombard.finance/app/unstake',
      landingPage: 'https://www.lombard.finance/'
    },
    breakdown: [
      // TODO: replace with LBTC constant
      {
        currency: { symbol: 'LBTC', address: '0x1010101010101010101010101010101010101010' },
        logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33652.png'
      }
    ]
  }
} as const;

export { strategiesInfo, StrategyIncentive };
export type { StrategyInfo };
