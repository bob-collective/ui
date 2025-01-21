import { Currency, ERC20Token } from '@gobob/currency';
import { Blockscout, BOBLogo } from '@gobob/icons';
import {
  ArrowDownOnSquare,
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
import { Trans } from '@lingui/macro';
import { chain as chainFn } from '@react-aria/utils';
import { ReactNode, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

import { StyledTokenListItem } from './Profile.style';

import { ChainLogo } from '@/components';
import { chainL2 } from '@/constants';

const ProfileTokensListItemSkeleton = () => (
  <Flex alignItems='center' elementType='li' gap='lg' paddingX='md' paddingY='s'>
    <Skeleton height='5xl' rounded='full' width='5xl' />
    <Flex alignItems='flex-start' direction='column'>
      <Skeleton height='xl' width='12rem' />
      <Skeleton height='xl' width='8rem' />
    </Flex>
  </Flex>
);

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
  otherChainName?: string;
  otherChainId?: number;
  connectorName?: string;
  name: string;
  logo: ReactNode;
  balance?: string | number;
  amountUSD?: number;
  currency: Currency;
  onPressBridge?: (currency: ERC20Token) => void;
  onPressStake?: (currency: ERC20Token) => void;
  onPressExplorer?: (address: Address) => void;
  onPressAddErc20?: (currency: ERC20Token) => void;
};

const ProfileTokenListItem = ({
  otherChainId,
  otherChainName,
  connectorName,
  amountUSD,
  balance,
  logo,
  name,
  currency,
  onPressBridge,
  onPressStake,
  onPressExplorer,
  onPressAddErc20
}: ProfileTokenListItemProps) => {
  const { locale } = useLocale();
  const { chain } = useAccount();
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger>
        <StyledTokenListItem
          $isFocused={isOpen}
          alignItems='center'
          direction='row'
          elementType='li'
          gap='lg'
          paddingX='md'
          paddingY='s'
        >
          {logo}
          <Flex direction='column' flex={1}>
            <P rows={1} style={{ whiteSpace: 'normal' }}>
              {name}
            </P>
            {balance !== undefined && amountUSD !== undefined ? (
              <P color='grey-50' rows={1} size='s' style={{ whiteSpace: 'normal' }}>
                {balance} {currency.symbol} (
                {Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
                  amountUSD
                )}
                )
              </P>
            ) : (
              <Skeleton height='1rem' width='80%' />
            )}
          </Flex>
        </StyledTokenListItem>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody gap='s' padding='md'>
          {onPressStake && (
            <PopoverOptions onPress={chainFn(onPressStake, () => handleClose())}>
              <ArrowDownOnSquare />
              <P>
                <Trans>Stake</Trans>
              </P>
            </PopoverOptions>
          )}
          {chain && currency?.isToken && (
            <PopoverOptions
              onPress={() => {
                onPressExplorer?.(currency.address);
                handleClose();
              }}
            >
              <Blockscout />
              <P>
                <Trans>Go to Explorer</Trans>
              </P>
            </PopoverOptions>
          )}
          {currency?.isToken && (
            <PopoverOptions
              onPress={() => {
                onPressAddErc20?.(currency);
                handleClose();
              }}
            >
              <Wallet />
              <P>
                <Trans>Add to {connectorName || 'wallet'}</Trans>
              </P>
            </PopoverOptions>
          )}
          {onPressBridge && (
            <PopoverOptions
              onPress={currency.isToken ? chainFn(() => onPressBridge(currency), handleClose) : handleClose}
            >
              {otherChainId ? <ChainLogo chainId={otherChainId} /> : <BOBLogo />}
              <P>
                {otherChainName ? <Trans>Bridge to {otherChainName}</Trans> : <Trans>Bridge to {chainL2.name}</Trans>}
              </P>
            </PopoverOptions>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { ProfileTokenListItem, ProfileTokensListItemSkeleton };
