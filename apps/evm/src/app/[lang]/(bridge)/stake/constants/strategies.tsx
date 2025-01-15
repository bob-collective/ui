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
  supply,
  avalon
}

enum StrategyProtocol {
  Bedrock = 'Bedrock',
  Solv = 'Solv',
  Pell = 'Pell',
  Segment = 'Segment',
  Lombard = 'Lombard',
  Ionic = 'Ionic',
  Avalon = 'Avalon'
}

type StrategyCurrency =
  | { currency: { symbol: string; address: Address }; logoUrl: string }
  | { currency: ERC20Token; logoUrl: string };

type StrategyInfo = {
  name: string;
  description: ReactNode;
  protocol: StrategyProtocol;
  logoUrl?: string;
  incentives: StrategyIncentive[];
  isDisabled?: boolean;
  isHidden?: boolean;
  warningMessage?: ReactNode;
  links: {
    securityReview?: string;
    landingPage: string;
    manage: string;
  };
  breakdown: Array<StrategyCurrency>;
};

const wBTC = {
  securityReview: 'https://www.bitcoinlayers.org/infrastructure/bitgo-wbtc',
  asset: {
    currency: WBTC![ChainId.BOB]!,
    logoUrl:
      'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png'
  } satisfies StrategyCurrency
};

const tBTC = {
  securityReview: 'https://www.bitcoinlayers.org/infrastructure/threshold-tbtc',
  asset: {
    currency: TBTC![ChainId.BOB]!,
    logoUrl: 'https://ethereum-optimism.github.io/data/tBTC/logo.svg'
  } satisfies StrategyCurrency
};

const uniBTC = {
  securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock-unibtc',
  asset: {
    currency: { symbol: 'uniBTC', address: '0x236f8c0a61dA474dB21B693fB2ea7AAB0c803894' as Address },
    logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/uniBTC.svg'
  } satisfies StrategyCurrency
};

const solvBTCSecurityReview = 'https://www.bitcoinlayers.org/infrastructure/solv-solvbtcbbn';

const solvBTCPath = [
  {
    currency: { symbol: 'SolvBTC', address: '0x541fd749419ca806a8bc7da8ac23d346f2df8b77' },
    logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/solvBTC.svg'
  } satisfies StrategyCurrency,
  {
    currency: { symbol: 'SolvBTC.BBN', address: '0xcc0966d8418d412c599a6421b760a847eb169a8c' },
    logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/solvBTC.BBN.svg'
  } satisfies StrategyCurrency
] as const;

const babylonWithdrawWarning = <Trans>Babylon does not yet support withdrawals.</Trans>;

// TODO: separate protocol audits from asset audits
const strategiesInfo: Record<string, StrategyInfo> = {
  'bedrock-unibtc': {
    name: 'Liquid Staking Bedrock-Babylon',
    description: <Trans>Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.</Trans>,
    protocol: StrategyProtocol.Bedrock,
    incentives: [StrategyIncentive.bedrock, StrategyIncentive.babylon],
    links: {
      securityReview: uniBTC.securityReview,
      landingPage: 'https://app.bedrock.technology',
      manage: 'https://app.bedrock.technology/unibtc?network=bob'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC.asset, uniBTC.asset]
  },
  'solv-solvbtcbbn': {
    name: 'Liquid Staking Solv-Babylon',
    description: <Trans>Stake BTC into Babylon via Solv Protocol and receive liquid staking token solvBTC.BBN.</Trans>,
    protocol: StrategyProtocol.Solv,
    incentives: [StrategyIncentive.solv, StrategyIncentive.babylon],
    links: {
      securityReview: solvBTCSecurityReview,
      landingPage: 'https://solv.finance/',
      manage: 'https://app.solv.finance/babylon?network=bob'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC.asset, ...solvBTCPath]
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
    logoUrl: 'https://github.com/0xPellNetwork/pell_media_kit/blob/main/logos/500r_whiteblack.png?raw=true',
    links: {
      securityReview: solvBTCSecurityReview,
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x6f0AfADE16BFD2E7f5515634f2D0E3cd03C845Ef'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC.asset, ...solvBTCPath]
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
    logoUrl: 'https://github.com/0xPellNetwork/pell_media_kit/blob/main/logos/500r_whiteblack.png?raw=true',

    links: {
      securityReview: uniBTC.securityReview,
      landingPage: 'https://app.pell.network/',
      manage: 'https://app.pell.network/restake/detail?chainid=60808&address=0x631ae97e24f9F30150d31d958d37915975F12ed8'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [wBTC.asset, uniBTC.asset]
  },
  'segment-tbtc': {
    name: 'Lending Segment-tBTC',
    description: <Trans>Lend out tBTC on Segment.</Trans>,
    protocol: StrategyProtocol.Segment,
    incentives: [StrategyIncentive.segment, StrategyIncentive.supply],
    links: {
      securityReview: tBTC.securityReview,
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0xD30288EA9873f376016A0250433b7eA375676077'
    },
    breakdown: [
      tBTC.asset,
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
      securityReview: wBTC.securityReview,
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x6265C05158f672016B771D6Fb7422823ed2CbcDd'
    },
    breakdown: [
      tBTC.asset,
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
      securityReview: solvBTCSecurityReview,
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x5EF2B8fbCc8aea2A9Dbe2729F0acf33E073Fa43e'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [
      wBTC.asset,
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
      securityReview: uniBTC.securityReview,
      landingPage: 'https://app.segment.finance',
      manage: 'https://app.segment.finance/#//market/0x7848F0775EebaBbF55cB74490ce6D3673E68773A'
    },
    warningMessage: babylonWithdrawWarning,
    breakdown: [
      wBTC.asset,
      uniBTC.asset,
      {
        currency: { symbol: 'seUNIBTC', address: '0x7848F0775EebaBbF55cB74490ce6D3673E68773A' },
        logoUrl: 'https://raw.githubusercontent.com/bob-collective/bob/master/assets/segment.svg'
      }
    ]
  },
  'lombard-lbtc': {
    isHidden: true,
    name: 'Liquid Staking Lombard BTC',
    description: <Trans>Stake BTC into Lombard and receive liquid staking token LBTC.</Trans>,
    protocol: StrategyProtocol.Lombard,
    incentives: [StrategyIncentive.supply],
    links: {
      securityReview: 'https://www.bitcoinlayers.org/infrastructure/lombard-lbtc',
      manage: 'https://www.lombard.finance/app/unstake',
      landingPage: 'https://www.lombard.finance/'
    },
    breakdown: [
      {
        currency: { symbol: 'LBTC', address: '0x1010101010101010101010101010101010101010' },
        logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/33652.png'
      }
    ]
  },
  'ionic-wbtc': {
    name: 'Lending Ionic-wBTC',
    description: <Trans>Lend out wBTC on Ionic.</Trans>,
    protocol: StrategyProtocol.Ionic,
    incentives: [StrategyIncentive.supply],
    links: {
      securityReview: wBTC.securityReview,
      manage:
        'https://app.ionic.money/market/details/WBTC?chain=60808&comptrollerAddress=0x9cFEe81970AA10CC593B83fB96eAA9880a6DF715&cTokenAddress=0xEBc8a7EE7f1D6534eBF45Bd5311203BF0A17493c&dropdownSelectedChain=60808&pool=0&borrowAPR=0.009015820780655659&supplyAPR=0.000003837930484529295&selectedChain=60808&selectedSymbol=WBTC',
      landingPage: 'https://www.ionic.money/'
    },
    breakdown: [
      wBTC.asset,
      {
        currency: { symbol: 'ionWBTC', address: '0xEBc8a7EE7f1D6534eBF45Bd5311203BF0A17493c' },
        logoUrl: wBTC.asset.logoUrl
      }
    ]
  },
  'ionic-tbtc': {
    name: 'Lending Ionic-tBTC',
    description: <Trans>Lend out tBTC on Ionic.</Trans>,
    protocol: StrategyProtocol.Ionic,
    incentives: [StrategyIncentive.supply],
    links: {
      securityReview: tBTC.securityReview,
      manage:
        'https://app.ionic.money/market/details/tBTC?chain=60808&comptrollerAddress=0x9cFEe81970AA10CC593B83fB96eAA9880a6DF715&cTokenAddress=0x68e0e4d875FDe34fc4698f40ccca0Db5b67e3693&dropdownSelectedChain=60808&pool=0&borrowAPR=0.003916994341568447&supplyAPR=7.237513921509731e-7&selectedChain=60808&selectedSymbol=tBTC',
      landingPage: 'https://www.ionic.money/'
    },
    breakdown: [
      tBTC.asset,
      {
        currency: { symbol: 'iontBTC', address: '0x68e0e4d875FDe34fc4698f40ccca0Db5b67e3693' },
        logoUrl: tBTC.asset.logoUrl
      }
    ]
  },
  'avalon-wbtc': {
    name: 'Lending Avalon-wBTC',
    description: <Trans>Lend out wBTC on Avalon.</Trans>,
    protocol: StrategyProtocol.Avalon,
    incentives: [StrategyIncentive.avalon, StrategyIncentive.supply],
    logoUrl: 'https://raw.githubusercontent.com/avalonfinancexyz/marketing_kit/refs/heads/main/token/sUSDa.png',
    links: {
      securityReview: wBTC.securityReview,
      manage:
        'https://app.avalonfinance.xyz/reserve-overview/?underlyingAsset=0xbba2ef945d523c4e2608c9e1214c2cc64d4fc2e2&marketName=proto_bob_v3',
      landingPage: 'https://www.avalonfinance.xyz/'
    },
    breakdown: [
      wBTC.asset,
      {
        currency: { symbol: 'aBOBWBTC', address: '0x4b6Ec2339822A1023b11e45E43DBaAbedeD0BC3B' },
        logoUrl: tBTC.asset.logoUrl
      }
    ]
  },
  'avalon-tbtc': {
    name: 'Lending Avalon-tBTC',
    description: <Trans>Lend out tBTC on Avalon.</Trans>,
    protocol: StrategyProtocol.Avalon,
    incentives: [StrategyIncentive.avalon, StrategyIncentive.supply],
    links: {
      securityReview: tBTC.securityReview,
      manage:
        'https://app.avalonfinance.xyz/reserve-overview/?underlyingAsset=0xbba2ef945d523c4e2608c9e1214c2cc64d4fc2e2&marketName=proto_bob_v3',
      landingPage: 'https://www.avalonfinance.xyz/'
    },
    logoUrl: 'https://raw.githubusercontent.com/avalonfinancexyz/marketing_kit/refs/heads/main/token/sUSDa.png',

    breakdown: [
      tBTC.asset,
      {
        currency: { symbol: 'aBOBTBTC', address: '0x1c7ab34f5f24e6947F6e4cABd37a50febA37bdE4' },
        logoUrl: tBTC.asset.logoUrl
      }
    ]
  },
  'avalon-abobsolvbtcbbn': {
    name: 'Lending Avalon-SolvBTC-Babylon',
    description: (
      <Trans>
        Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and lend it out on Avalon.
      </Trans>
    ),
    protocol: StrategyProtocol.Avalon,
    incentives: [StrategyIncentive.babylon, StrategyIncentive.solv, StrategyIncentive.avalon, StrategyIncentive.supply],
    logoUrl: 'https://raw.githubusercontent.com/avalonfinancexyz/marketing_kit/refs/heads/main/token/sUSDa.png',

    links: {
      securityReview: solvBTCSecurityReview,
      manage:
        'https://app.avalonfinance.xyz/reserve-overview/?underlyingAsset=0xcc0966d8418d412c599a6421b760a847eb169a8c&marketName=proto_bob_v3',
      landingPage: 'https://www.avalonfinance.xyz/'
    },
    breakdown: [
      wBTC.asset,
      ...solvBTCPath,
      {
        currency: { symbol: 'aBOBSOLVBTCBBN', address: '0x828B2b38154C62b5F6733A74126A0795d709e493' },
        logoUrl: solvBTCPath[1].logoUrl
      }
    ]
  }
} as const;

export { strategiesInfo, StrategyIncentive };
export type { StrategyInfo, StrategyCurrency };
