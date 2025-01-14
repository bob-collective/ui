import { Avatar, Flex, P, Skeleton, useLocale } from '@gobob/ui';

import { ChainAsset } from '@/components';

type ProfileTokenListItemProps = {
  chainId?: number;
  name: string;
  logoUrl: string;
  balance?: string | number;
  symbol: string;
  amountUSD?: number;
};

const ProfileTokenListItem = ({ chainId, amountUSD, balance, logoUrl, name, symbol }: ProfileTokenListItemProps) => {
  const { locale } = useLocale();

  return (
    <Flex alignItems='center' gap='lg'>
      {chainId ? (
        <ChainAsset
          asset={<Avatar alt={name} size='5xl' src={logoUrl} />}
          chainId={chainId}
          chainProps={{ size: 'xs' }}
        />
      ) : (
        <Avatar alt={name} size='5xl' src={logoUrl} />
      )}
      <Flex direction='column' flex={1}>
        <P rows={1} style={{ whiteSpace: 'normal' }}>
          {name}
        </P>
        {balance !== undefined && amountUSD !== undefined ? (
          <P color='grey-50' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
            {balance} {symbol} (
            {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
              amountUSD
            )}
            )
          </P>
        ) : (
          <Skeleton height='1rem' />
        )}
      </Flex>
    </Flex>
  );
};

export { ProfileTokenListItem };
