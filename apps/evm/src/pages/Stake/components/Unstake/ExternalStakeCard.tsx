import { ArrowTopRightOnSquare, Avatar, Card, Flex, Link, P } from '@gobob/ui';
import { BTC } from '@gobob/icons';

import { SolvBTCBBN } from '../StrategyDetails/SolvBTCBBN';
import { UniBTC } from '../StrategyDetails/UniBTC';
import { PellNetwork } from '../StrategyDetails/PellNetwork';
import { Type } from '../../Stake';

type ExternalBridge = 'solvbtc' | 'babylon' | 'unibtc' | 'pell-network' | 'segment' | 'shoebill';

// TODO: add missing links
const bridges: Record<
  ExternalBridge,
  { icon: any | string; href: string | { stake: string; unstake: string }; name: string; disabled: boolean }
> = {
  solvbtc: {
    href: 'https://app.solv.finance/solvbtc?network=bob',
    icon: BTC,
    name: 'SolvBTC',
    disabled: false
  },
  babylon: {
    href: 'https://app.solv.finance/babylon?network=bob',
    icon: SolvBTCBBN,
    name: 'SolBTC.BBN',
    disabled: false
  },
  unibtc: {
    href: 'https://app.bedrock.technology/unibtc',
    icon: UniBTC,
    name: 'UniBTC',
    disabled: false
  },
  'pell-network': {
    href: 'https://app.pell.network/restake',
    icon: PellNetwork,
    name: 'Pell network',
    disabled: false
  },
  segment: {
    href: 'https://app.segment.finance/#/',
    icon: BTC,
    name: 'Segment Finance',
    disabled: false
  },
  shoebill: {
    href: 'https://bob-btc.shoebill.finance/#/',
    icon: BTC,
    name: 'Shoebill Finance',
    disabled: false
  }
};

type Props = { type: Type; bridge: ExternalBridge };

type ExternalBridgeCardProps = Props;

const ExternalStakeCard = ({ type, bridge }: ExternalBridgeCardProps): JSX.Element => {
  const { href, name, icon: Icon, disabled } = bridges[bridge];
  const typeHref = typeof href === 'string' ? href : href[type];

  return (
    <Card
      {...{ external: true, href: typeHref }}
      alignItems='center'
      background='grey-600'
      direction='row'
      elementType={Link}
      isDisabled={disabled}
      isPressable={!disabled}
      justifyContent='space-between'
      padding='lg'
      rounded='md'
    >
      <Flex alignItems='center' gap='s'>
        {typeof Icon === 'string' ? <Avatar src={Icon} /> : <Icon size='xl' />}
        <P size='md'>{name}</P>
      </Flex>
      {disabled ? (
        <Card paddingX='s' paddingY='xs'>
          <P size='xs'>Coming Soon</P>
        </Card>
      ) : (
        <ArrowTopRightOnSquare size='s' />
      )}
    </Card>
  );
};

export { ExternalStakeCard };
export type { ExternalBridge };
