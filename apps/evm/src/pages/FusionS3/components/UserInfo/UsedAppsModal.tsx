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
import { ERC20Token } from '@gobob/currency';
import { Spice } from '@gobob/icons';
import { useTheme } from 'styled-components';
import { useMediaQuery } from '@uidotdev/usehooks';

import { useGetUser } from '../../../../hooks';
import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useGetTokensInfo } from '../../hooks/useGetTokensInfo';
import { useBridgeTokens } from '../../../Bridge/hooks';

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAssetsModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const UserAssetsModal = (props: UserAssetsModalProps): JSX.Element => {
  const { data: user } = useGetUser();
  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const { locale } = useLocale();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  const { data: tokensInfo, isLoading: isLoadingTokensInfo } = useGetTokensInfo({ enabled: !!props.isOpen });

  const data = tokens
    ?.map((token) => {
      if (token.l1Currency.isNative) {
        const stats = user?.depositStats?.find((item) => item.token_name === 'ethereum');

        const tokenInfo = tokensInfo?.find((info) => info.symbol === nativeToken.symbol);

        return {
          amount: stats?.total_amount || 0,
          logoUrl: token.l1Token.logoUrl,
          symbol: nativeToken.symbol,
          totalUsd: Number(stats?.total_usd || 0),
          multiplier: tokenInfo?.multiplier
        };
      }

      const stats = user?.depositStats?.find(
        (item) =>
          token.l1Currency.isToken &&
          isAddressEqual((token.l1Currency as ERC20Token)?.address, item?.token_address as Address)
      );

      const tokenInfo = tokensInfo?.find((info) => isAddressEqual(info.l2_address as Address, token.l2Token.address));

      return {
        amount: stats?.total_amount || 0,
        logoUrl: token.l1Token.logoUrl,
        symbol: token.l1Token.symbol,
        totalUsd: Number(stats?.total_usd || 0),
        multiplier: tokenInfo?.multiplier
      };
    })
    .sort((a, b) => b.totalUsd - a.totalUsd);

  const multiplierEl = (multiplier?: string) => (
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
            {multiplier ? `${multiplier}x` : '-'}
          </P>
          <Spice size={{ base: 'xs', s: 's' }} />
        </>
      )}
    </Flex>
  );

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Your Active Spice Harvesting Apps
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          Below are the apps you’re currently using to harvest Spice. Keep using these to maximize your earnings!
        </P>
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
              <Flex
                alignItems={{ base: 'flex-end' }}
                direction={{ base: 'column', s: 'row' }}
                flex={{ base: '1 1 60%', s: '1 1 45%' }}
                gap='s'
                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                <Span size={{ base: 's', s: 'md' }}>{item.amount}</Span>
                <Span size={{ base: 's', s: 'md' }}>
                  ({Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(Number(item.totalUsd))})
                </Span>
              </Flex>
              {!isMobile && multiplierEl(item.multiplier)}
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAssetsModal };
