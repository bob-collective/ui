import { ArrowTopRightOnSquare, Avatar, Card, Flex, Link, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';

import { Meson } from './Meson';
import { Owl } from './Owl';
import { Relay } from './Relay';
import { Superbridge } from './Superbridge';

import { TransactionDirection } from '@/types';

type ExternalBridges = 'superbridge' | 'relay' | 'meson' | 'orbiter-finance' | 'owlto-finance';

// TODO: add missing links
const bridges: Record<
  ExternalBridges,
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any | string;
    href: string | { [TransactionDirection.L1_TO_L2]: string; [TransactionDirection.L2_TO_L1]: string };
    name: string;
    disabled: boolean;
  }
> = {
  superbridge: {
    href: 'https://superbridge.app/',
    name: 'Superbridge',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: (props: any) => (
      <Card background='light' padding='none' rounded='full'>
        <Superbridge {...props} />
      </Card>
    ),
    disabled: false
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
      [TransactionDirection.L1_TO_L2]: 'https://www.orbiter.finance/?dest=BOB',
      [TransactionDirection.L2_TO_L1]: 'https://www.orbiter.finance/?source=BOB'
    }
  },
  'owlto-finance': {
    href: 'https://owlto.finance/',
    icon: Owl,
    name: 'Owlto Finance',
    disabled: false
  }
};

type Props = { direction: TransactionDirection; bridge: ExternalBridges };

type ExternalBridgeCardProps = Props;

const ExternalBridgeCard = ({ direction, bridge }: ExternalBridgeCardProps): JSX.Element => {
  const { href, name, icon: Icon, disabled } = bridges[bridge];
  const typeHref = typeof href === 'string' ? href : href[direction];

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
          <P size='xs'>
            <Trans>Coming Soon</Trans>
          </P>
        </Card>
      ) : (
        <ArrowTopRightOnSquare size='s' />
      )}
    </Card>
  );
};

export { ExternalBridgeCard };
export type { ExternalBridges };
