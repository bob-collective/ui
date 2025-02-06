import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { Avatar, Card, Flex, Icon, P, Span } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';

import { ChainAsset, ChainLogo } from '@/components';
import { TransactionDirection } from '@/types';
import { getLocale } from '@/utils';

type TransactionDetailsProps = {
  direction: TransactionDirection;
  date: Date;
  fromChainId: ChainId | 'BTC';
  toChainId: ChainId | 'BTC';
  amount?: CurrencyAmount<Currency>;
  logoUrl?: string;
  icon?: typeof Icon;
  isPending?: boolean;
  isExpanded?: boolean;
};

const TransactionDetails = ({
  date,
  fromChainId,
  toChainId,
  amount,
  logoUrl,
  icon: Icon,
  isPending
}: TransactionDetailsProps): JSX.Element => {
  const { lang } = useParams();

  return (
    <Flex alignItems='center' gap='lg'>
      {amount ? (
        <ChainAsset
          asset={Icon ? <Icon size='2xl' /> : <Avatar alt={amount.currency.symbol} size='5xl' src={logoUrl} />}
          chainId={toChainId}
          chainProps={{ size: 'xs' }}
        />
      ) : (
        <Card background='grey-700' padding='2xl' rounded='full' />
      )}
      <Flex direction='column' flex={1} style={{ overflow: 'hidden' }}>
        <Flex alignItems='center' justifyContent='space-between'>
          <P color='grey-50' size='xs' weight='semibold'>
            <Trans>
              {formatDistanceToNow(date, { locale: getLocale(lang as Parameters<typeof getLocale>[0]) })} ago
            </Trans>
          </P>
          <Flex alignItems='center'>
            <ChainLogo chainId={fromChainId} size='xs' />
            <ChainLogo chainId={toChainId} size='xs' style={{ marginLeft: '-4px' }} />
          </Flex>
        </Flex>
        <P lineHeight='1.35' weight='medium'>
          {isPending ? (
            <Trans>Pending</Trans>
          ) : amount ? (
            <Flex wrap elementType='span'>
              <Span size='inherit' style={{ marginRight: 4 }}>
                {amount.toExact()}
              </Span>
              <Span size='inherit'>{amount.currency.symbol}</Span>
            </Flex>
          ) : (
            <Trans>Unknown</Trans>
          )}
        </P>
      </Flex>
    </Flex>
  );
};

export { TransactionDetails };
