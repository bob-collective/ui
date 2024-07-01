import { ArrowTopRightOnSquare, Avatar, Card, Flex, P } from '@gobob/ui';

import { StyledAnchor, StyledExternalBridgeCard } from './ExternalBridgeForm.style';
import { Meson } from './Meson';
import { Owl } from './Owl';
import { Relay } from './Relay';
import { Stargate } from './Stargate';

type Bridges = 'stargate' | 'relay' | 'meson' | 'orbiter-finance' | 'owlto-finance';

// TODO: add missing links
const bridges: Record<
  Bridges,
  { icon: any | string; href: string | { deposit: string; withdraw: string }; name: string; disabled: boolean }
> = {
  stargate: {
    href: 'https://stargate.finance/transfer',
    icon: Stargate,
    name: 'Stargate',
    disabled: true
  },
  relay: {
    href: 'https://relay.link/bridge/bob/',
    icon: Relay,
    name: 'Relay',
    disabled: false
  },
  meson: {
    href: 'https://meson.fi/bob',
    icon: Meson,
    name: 'Meson',
    disabled: false
  },
  'orbiter-finance': {
    icon: 'https://docs.orbiter.finance/~gitbook/image?url=https%3A%2F%2F1544475235-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-MY5Qy9GjDHXTy9ppyql%252Fuploads%252Fgit-blob-d43576a05a193419b332d9322d2453c75890ca0a%252Ficon-1.png%3Falt%3Dmedia&width=400&dpr=2&quality=100&sign=f56bd30e6036fd11ede281ea575525fea222f411cb6bc41e55fe9ed4a1b556f7',
    name: 'Orbiter Finance',
    disabled: false,
    href: {
      deposit: 'https://www.orbiter.finance/?dest=BOB',
      withdraw: 'https://www.orbiter.finance/?source=BOB'
    }
  },
  'owlto-finance': {
    href: 'https://owlto.finance/',
    icon: Owl,
    name: 'Owlto Finance',
    disabled: false
  }
};

type Props = { type: 'deposit' | 'withdraw'; bridge: Bridges };

type ExternalBridgeCardProps = Props;

const ExternalBridgeCard = ({ type, bridge }: ExternalBridgeCardProps): JSX.Element => {
  const { href, name, icon: Icon, disabled } = bridges[bridge];

  const card = (
    <StyledExternalBridgeCard
      $isDisabled={disabled}
      alignItems='center'
      background='grey-700'
      direction='row'
      isHoverable={!disabled}
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
    </StyledExternalBridgeCard>
  );

  if (disabled) {
    return card;
  }

  const typeHref = typeof href === 'string' ? href : href[type];

  return (
    <StyledAnchor href={typeHref} rel='noreferrer' target='_blank'>
      {card}
    </StyledAnchor>
  );
};

export { ExternalBridgeCard };
