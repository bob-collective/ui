import {
  ArrowDownOnSquare,
  ArrowRightLeft,
  Avatar,
  Card,
  Flex,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  useLocale,
  Wallet
} from '@gobob/ui';
import { Blockscout } from '@gobob/icons';
import { ReactNode } from 'react';
import { useAccount, useWatchAsset } from 'wagmi';
import { ERC20Token } from '@gobob/currency';

import { StyledTokenListItem } from './Profile.style';

import { ChainAsset } from '@/components';

const PopoverOptions = ({ children, onPress }: { children: ReactNode; onPress: () => void }) => (
  <Card
    isHoverable
    isPressable
    background='grey-600'
    direction='row'
    gap='md'
    paddingX='lg'
    paddingY='md'
    rounded='s'
    onPress={onPress}
  >
    {children}
  </Card>
);

type ProfileTokenListItemProps = {
  chainId?: number;
  name: string;
  logoUrl: string;
  balance?: string | number;
  symbol: string;
  amountUSD?: number;
  currency?: ERC20Token;
};

const ProfileTokenListItem = ({
  chainId,
  amountUSD,
  balance,
  logoUrl,
  name,
  symbol,
  currency
}: ProfileTokenListItemProps) => {
  const { locale } = useLocale();
  const { chain } = useAccount();
  const { watchAsset } = useWatchAsset();

  return (
    <Popover>
      <PopoverTrigger>
        <StyledTokenListItem alignItems='center' direction='row' gap='lg' paddingX='md' paddingY='s'>
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
        </StyledTokenListItem>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody gap='s' padding='md'>
          {chain && currency && (
            <PopoverOptions
              onPress={() =>
                window.open(`${chain?.blockExplorers?.default.url}/address/${currency.address}`, '_blank', 'noreferrer')
              }
            >
              <Blockscout />
              <P>Go to Explorer</P>
            </PopoverOptions>
          )}
          {currency && (
            <PopoverOptions
              onPress={() =>
                watchAsset({
                  type: 'ERC20',
                  options: { address: currency.address, decimals: currency.decimals, symbol: currency.symbol }
                })
              }
            >
              <Wallet />
              <P>Add to wallet</P>
            </PopoverOptions>
          )}
          <PopoverOptions onPress={console.log}>
            <ArrowRightLeft />
            <P>Bridge</P>
          </PopoverOptions>
          <PopoverOptions onPress={console.log}>
            <ArrowDownOnSquare />
            <P>Bridge</P>
          </PopoverOptions>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { ProfileTokenListItem };
