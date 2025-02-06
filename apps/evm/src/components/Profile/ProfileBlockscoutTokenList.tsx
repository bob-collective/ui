import { ERC20Token } from '@gobob/currency';
import { usePrices } from '@gobob/hooks';
import { ChevronDown, Flex, Span, UnstyledButton } from '@gobob/ui';
import { Address } from 'viem';
import { useAccount, useWatchAsset } from 'wagmi';
import { t, Trans } from '@lingui/macro';
import { useState } from 'react';
import { useLingui } from '@lingui/react';

import { ChainAsset } from '../ChainAsset';

import { StyledMissingImageLogo } from './Profile.style';
import { ProfileTokenListItem } from './ProfileTokenListItem';

import { chainL2 } from '@/constants';
import { useBlockscoutBalances } from '@/hooks/blockscout/useBlockscoutBalances';
import { useBlockscoutTokens } from '@/hooks/blockscout/useBlockscoutTokens';
import { calculateAmountUSD } from '@/utils';
import { posthogEvents } from '@/lib/posthog';

const ProfileBlockscoutTokenList = () => {
  const { i18n } = useLingui();
  const [isExpanded, setExpanded] = useState(false);

  const { watchAsset } = useWatchAsset();

  const { connector } = useAccount();

  const { data: blockscoutTokens = [] } = useBlockscoutTokens();
  const { getBlockscoutBalance } = useBlockscoutBalances();

  const { getPrice } = usePrices();

  const list = blockscoutTokens
    ?.map((token) => ({ token, balance: getBlockscoutBalance(token.currency.symbol) }))
    .filter((token) => token.balance?.greaterThan(0));

  if (!list.length) return undefined;

  const handlePressExplorer = (address: Address) => {
    window.open(`${chainL2?.blockExplorers?.default.url}/address/${address}`, '_blank', 'noreferrer');
  };

  const handlePressAddErc20 = (currency: ERC20Token) => {
    watchAsset({
      type: 'ERC20',
      options: { address: currency.address, decimals: currency.decimals, symbol: currency.symbol }
    });
  };

  const handleExpand = () => {
    setExpanded((s) => !s);
    posthogEvents.wallet.drawer.tokens.others();
  };

  return (
    <>
      <UnstyledButton aria-label={t(i18n)`show/hide other tokens list`} onPress={handleExpand}>
        <Flex alignItems='center' gap='md' justifyContent='space-between' paddingX='s' paddingY='lg'>
          <Span color='grey-50' size='s'>
            <Trans>Others</Trans> ({list.length})
          </Span>
          <ChevronDown
            color='grey-50'
            size='xs'
            style={{ transform: isExpanded ? 'rotate(180deg)' : undefined, transition: 'all 200ms ease-in-out' }}
          />
        </Flex>
      </UnstyledButton>
      {(isExpanded ? list : []).map((item) => (
        <ProfileTokenListItem
          key={`${item.token.raw.address}${item.token.currency.chainId}`}
          hidePrice
          amountUSD={item.balance && calculateAmountUSD(item.balance, getPrice(item.balance!.currency.symbol))}
          balance={item.balance && item.balance.toSignificant()}
          connectorName={connector?.name}
          currency={item.token.currency}
          logo={
            <ChainAsset
              asset={
                item.token.raw.icon ? (
                  <item.token.raw.icon size='2xl' />
                ) : (
                  <StyledMissingImageLogo>{item.token.raw.symbol.toUpperCase().slice(0, 3)}</StyledMissingImageLogo>
                )
              }
              chainId={item.token.raw.chainId}
              chainProps={{ size: 'xs' }}
            />
          }
          name={item.token.raw.name}
          onPressAddErc20={handlePressAddErc20}
          onPressExplorer={handlePressExplorer}
        />
      ))}
    </>
  );
};

export { ProfileBlockscoutTokenList };
