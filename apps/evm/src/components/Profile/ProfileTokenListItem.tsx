import { Currency, ERC20Token } from '@gobob/currency';
import { Blockscout } from '@gobob/icons';
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
import { Trans } from '@lingui/macro';
import { chain as chainFn } from '@react-aria/utils';
import { ReactNode, useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

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
  amountUSD?: number;
  currency: Currency;
  onPressBridge?: () => void;
  onPressStake?: () => void;
  onPressExplorer?: (address: Address) => void;
  onPressAddErc20?: (currency: ERC20Token) => void;
};

const ProfileTokenListItem = ({
  chainId,
  amountUSD,
  balance,
  logoUrl,
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
          gap='lg'
          paddingX='md'
          paddingY='s'
        >
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
                {balance} {currency.symbol} (
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
              <P>Add to wallet</P>
            </PopoverOptions>
          )}
          {onPressBridge && (
            <PopoverOptions onPress={chainFn(onPressBridge, () => handleClose())}>
              <ArrowRightLeft />
              <P>Bridge</P>
            </PopoverOptions>
          )}
          {onPressStake && (
            <PopoverOptions onPress={chainFn(onPressStake, () => handleClose())}>
              <ArrowDownOnSquare />
              <P>Stake</P>
            </PopoverOptions>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { ProfileTokenListItem };
