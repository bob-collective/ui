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

type StakingInfo = {
  strategy: string;
  protocol: string;
  incentives: Incentive[];
  tvl: string;
  about: ReactNode;
  inputToken: string;
  inputTokenLogoUrl: string;
  outputToken: string;
  securityReview: string;
  website: string;
  isDisabled?: boolean;
  warningMessage?: ReactNode;
};

const babylonWithdrawWarning = 'Babylon does not yet support withdrawals.';

const stakingInfo: Record<string, StakingInfo> = {
  'bedrock-unibtc': {
    strategy: 'Liquid Staking Bedrock-Babylon',
    protocol: 'Bedrock',
    incentives: [Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: 'Stake BTC into Babylon via Bedrock and receive liquid staking token uniBTC.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'uniBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/bedrock',
    website: 'https://app.bedrock.technology/unibtc',
    warningMessage: babylonWithdrawWarning
  },
  'solv-solvbtcbbn': {
    strategy: 'Liquid Staking Solv-Babylon',
    protocol: 'Solv',
    incentives: [Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: 'Stake BTC into Babylon via Solv Protocol and receive liquid staking token solvBTC.BBN.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'SolvBTC.BBN',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/solvlst',
    website: 'https://app.solv.finance/babylon?network=bob',
    warningMessage: babylonWithdrawWarning
  },
  'pell-solvbtcbbn': {
    strategy: 'Restaking Pell-SolvBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.solv, Incentive.babylon],
    tvl: '-',
    about: 'Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and deposit into Pell.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'SolvBTC.BBN',
    securityReview: '',
    website: 'https://app.pell.network/restake',
    warningMessage: babylonWithdrawWarning
  },
  'pell-unibtc': {
    strategy: 'Restaking Pell-uniBTC-Babylon',
    protocol: 'Pell',
    incentives: [Incentive.pell, Incentive.bedrock, Incentive.babylon],
    tvl: '-',
    about: 'Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and deposit into Pell restaking.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'uniBTC',
    securityReview: '',
    website: 'https://app.pell.network/restake',
    warningMessage: babylonWithdrawWarning
  },
  'segment-tbtc': {
    strategy: 'Lending Segment-tBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: 'Lend out tBTC on Segment.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'tBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/tbtc',
    website: 'https://app.segment.finance'
  },
  'segment-wbtc': {
    strategy: 'Lending Segment-wBTC',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.supply],
    tvl: '-',
    about: 'Lend out wBTC on Segment.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'wBTC',
    securityReview: 'https://www.bitcoinlayers.org/infrastructure/wbtc',
    website: 'https://app.segment.finance'
  },
  'segment-sesolvbtcbbn': {
    strategy: 'Staked Lending Segment-SolvBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.solv, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about:
      'Stake BTC into Babylon via Solv Protocol, get solvBTC.BBN liquid staking token, and lend it out on Segment.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance',
    warningMessage: babylonWithdrawWarning
  },
  'segment-seunibtc': {
    strategy: 'Staked Lending Segment-uniBTC-Babylon',
    protocol: 'Segment',
    incentives: [Incentive.segment, Incentive.bedrock, Incentive.babylon, Incentive.supply],
    tvl: '-',
    about: 'Stake BTC into Babylon via Bedrock, get uniBTC liquid staking token, and lend it out on Segment.',
    inputToken: 'BTC',
    inputTokenLogoUrl: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    outputToken: 'seUNIBTC',
    securityReview: '',
    website: 'https://app.segment.finance',
    warningMessage: babylonWithdrawWarning
  }
} as const;

export { stakingInfo, Incentive };
export type { StakingInfo };
