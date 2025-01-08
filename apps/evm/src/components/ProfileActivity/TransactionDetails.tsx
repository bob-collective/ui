import { ChainId } from '@gobob/chains';
import { Currency, CurrencyAmount } from '@gobob/currency';
import { Avatar, Card, Flex, P } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'next/navigation';

import { AmountLabel, ChainAsset, ChainLogo } from '@/components';
import { TransactionDirection } from '@/types';
import { getLocale } from '@/utils';

type TransactionDetailsProps = {
  direction: TransactionDirection;
  date: Date;
  fromChainId: ChainId | 'BTC';
  toChainId: ChainId | 'BTC';
  amount?: CurrencyAmount<Currency>;
  logoUrl?: string;
  isPending?: boolean;
  isExpanded?: boolean;
};

const TransactionDetails = ({
  date,
  fromChainId,
  toChainId,
  amount,
  logoUrl,
  isPending
}: TransactionDetailsProps): JSX.Element => {
  const { lang } = useParams();

  return (
    <Flex alignItems='center' gap='lg'>
      {amount ? (
        <ChainAsset
          asset={<Avatar alt={amount.currency.symbol} size='5xl' src={logoUrl} />}
          chainId={toChainId}
          chainProps={{ size: 'xs' }}
        />
      ) : (
        <Card background='grey-700' padding='2xl' rounded='full' />
      )}
      <Flex direction='column' flex={1}>
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
            <AmountLabel hidePrice amount={amount} />
          ) : (
            <Trans>Unknown</Trans>
          )}
        </P>
      </Flex>
    </Flex>
  );
};

export { TransactionDetails };
