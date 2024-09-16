import { NATIVE } from '@gobob/tokens';
import {
  Avatar,
  Flex,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalHeader,
  ModalProps,
  P,
  Skeleton,
  Span,
  useLocale
} from '@gobob/ui';
import { Address, isAddressEqual } from 'viem';
import { Spice } from '@gobob/icons';
import { useTheme } from 'styled-components';
import { useMediaQuery } from '@uidotdev/usehooks';

import { useBalances } from '../../../../hooks';
import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useGetTokensInfo } from '../../hooks';
import { useBridgeTokens } from '../../../Bridge/hooks';
import { calculateAmountUSD } from '../../../../utils';

import { StyledAmountWrapper } from './UserInfo.style';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAssetsModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const UserAssetsModal = (props: UserAssetsModalProps): JSX.Element => {
  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const { locale } = useLocale();

  const { getBalance } = useBalances(L2_CHAIN);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const { data: tokensInfo, isLoading: isLoadingTokensInfo } = useGetTokensInfo({ enabled: !!props.isOpen });

  const data = tokens
    ?.map((token) => {
      const balance = getBalance(token.l2Token.symbol);

      if (token.l1Currency.isNative) {
        const tokenInfo = tokensInfo?.find((info) => info.symbol === 'eth');
        const balanceUSD = balance && calculateAmountUSD(balance, Number(tokenInfo?.latest_price_in_usd) || 0);

        return {
          amount: balance?.toSignificant() || 0,
          logoUrl: token.l1Token.logoUrl,
          symbol: nativeToken.symbol,
          totalUsd: balanceUSD || 0,
          multiplier: Number(tokenInfo?.multiplier)
        };
      }

      const tokenInfo = tokensInfo?.find((info) => isAddressEqual(info.l2_address as Address, token.l2Token.address));
      const balanceUSD = tokenInfo?.latest_price_in_usd
        ? calculateAmountUSD(balance, Number(tokenInfo?.latest_price_in_usd) || 0)
        : 0;

      return {
        amount: balance?.toSignificant() || 0,
        logoUrl: token.l1Token.logoUrl,
        symbol: token.l1Token.symbol,
        totalUsd: balanceUSD || 0,
        multiplier: Number(tokenInfo?.multiplier) || '0'
      };
    })
    .sort((a, b) => {
      if (a.totalUsd === b.totalUsd) {
        return Number(b.multiplier || 0) - Number(a.multiplier || 0); // If 'a' values are equal, sort by 'b'
      } else {
        return b.totalUsd - a.totalUsd; // Sort primarily by 'a'
      }
    });

  const multiplierEl = (multiplier?: string | number) => (
    <Flex
      alignItems='center'
      direction={{ base: 'row-reverse', s: 'row' }}
      flex='1 1 25%'
      gap='md'
      justifyContent={{ base: 'flex-end' }}
    >
      {isLoadingTokensInfo ? (
        <Skeleton height='lg' width='6xl' />
      ) : (
        <>
          <P color='grey-50' size='s'>
            {multiplier}x
          </P>
          <Spice size={{ base: 'xs', s: 's' }} />
        </>
      )}
    </Flex>
  );

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Total Assets
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>Bridge High Priority assets to earn multipliers on your spice</P>
        <List direction='column' gap='md'>
          {data?.map((item, key) => (
            <ListItem key={key} alignItems='center' flex={1} justifyContent='space-between'>
              <Flex direction='column' flex={{ base: '1 1 40%', s: '1 1 30%' }} gap='xs'>
                <Flex alignItems='center' gap='s'>
                  <Avatar size='2xl' src={item.logoUrl} />
                  <Span>{item.symbol}</Span>
                </Flex>
                {isMobile && multiplierEl(item.multiplier)}
              </Flex>
              <StyledAmountWrapper
                alignItems={{ base: 'flex-end' }}
                direction={{ base: 'column', s: 'row' }}
                flex={{ base: '1 1 60%', s: '1 1 45%' }}
                gap='s'
              >
                <Span color={Number(item.amount) === 0 ? 'grey-50' : undefined} size={{ base: 's', s: 'md' }}>
                  {item.amount}
                </Span>
                <Span color={Number(item.amount) === 0 ? 'grey-50' : undefined} size={{ base: 's', s: 'md' }}>
                  ({Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(item.totalUsd))})
                </Span>
              </StyledAmountWrapper>
              {!isMobile && multiplierEl(item.multiplier)}
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAssetsModal };
