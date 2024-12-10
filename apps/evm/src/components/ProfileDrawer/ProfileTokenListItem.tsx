import { Avatar, Flex, P, useCurrencyFormatter } from '@gobob/ui';

import { ChainAsset } from '@/components';

type ProfileTokenListItemProps = {
  chainId?: number;
  name: string;
  logoUrl: string;
  balance: string;
  symbol: string;
  amountUSD: number;
};

const ProfileTokenListItem = ({ chainId, amountUSD, balance, logoUrl, name, symbol }: ProfileTokenListItemProps) => {
  const format = useCurrencyFormatter();

  return (
    <Flex alignItems='center' justifyContent='space-between'>
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
        <Flex direction='column'>
          <P rows={1}>{name}</P>
          <P color='grey-50' rows={1} size='s'>
            {balance} {symbol} ({format(amountUSD)})
          </P>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { ProfileTokenListItem };
