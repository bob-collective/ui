import { ERC20Token } from '@gobob/currency';
import { NATIVE } from '@gobob/tokens';
import {
  Avatar,
  Button,
  Dd,
  DlGroup,
  Flex,
  P,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  QuestionMarkCircle,
  Tooltip,
  useCurrencyFormatter,
  useMediaQuery
} from '@gobob/ui';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'styled-components';
import { isAddressEqual } from 'viem';

import { L1_CHAIN } from '@/constants';
import { useGetUser, useTokens } from '@/hooks';

import { StyledDt, StyledTooltipWrapper } from './UserStats.style';

const nativeToken = NATIVE[L1_CHAIN];

const DepositedAssets = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: user } = useGetUser();
  const format = useCurrencyFormatter();
  const { data: tokens } = useTokens(L1_CHAIN);

  const t = useTranslations();

  const depositedAssets = useMemo(
    () =>
      user?.depositStats.map((item, key) => {
        if (item.token_name === 'ethereum') {
          const eth = tokens?.find((token) => token.currency.isNative);

          if (!eth) return null;

          return (
            <Flex key={key} alignItems='center' gap='md'>
              <Avatar size='2xl' src={eth.raw.logoUrl} />
              <P size='xs' weight='semibold'>
                {item.total_amount} {nativeToken.symbol} ({format(Number(item.total_usd))})
              </P>
            </Flex>
          );
        }
        const erc20 = tokens?.find(
          (token) =>
            token.currency.isToken && isAddressEqual((token.currency as ERC20Token)?.address, item?.token_address)
        );

        if (!erc20) return null;

        return (
          <Flex key={key} alignItems='center' gap='md'>
            <Avatar size='2xl' src={erc20.raw.logoUrl} />
            <P size='xs' weight='semibold'>
              {item.total_amount} {erc20.currency.symbol} ({format(Number(item.total_usd))})
            </P>
          </Flex>
        );
      }),
    [user?.depositStats, tokens, format]
  );

  const lockedAmounts = !!depositedAssets?.length && (
    <Flex direction='column' gap='s'>
      <P size='xs' weight='bold'>
        {t('fusion.userStats.lockedCapitalBreakdown')}
      </P>
      {depositedAssets}
    </Flex>
  );

  return (
    <DlGroup alignItems='flex-start' direction='column'>
      <StyledDt size='s' weight='semibold'>
        {t('fusion.userStats.lockedAmount')}
        {lockedAmounts &&
          (isMobile ? (
            <Popover>
              <PopoverTrigger>
                <Button isIconOnly size='s' variant='ghost'>
                  <QuestionMarkCircle color='grey-50' size='s' />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>{lockedAmounts}</PopoverBody>
              </PopoverContent>
            </Popover>
          ) : (
            <StyledTooltipWrapper>
              <Tooltip label={lockedAmounts}>
                <QuestionMarkCircle color='grey-50' size='s' />
              </Tooltip>
            </StyledTooltipWrapper>
          ))}
      </StyledDt>
      <Dd weight='bold'>{format(user?.totalUsdDeposited || 0)}</Dd>
    </DlGroup>
  );
};

export { DepositedAssets };
