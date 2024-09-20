import { NATIVE } from '@gobob/tokens';
import { Modal, ModalBody, ModalHeader, ModalProps, P, Skeleton, Span, Table, useLocale } from '@gobob/ui';
import { ReactNode } from 'react';
import { Address, isAddressEqual } from 'viem';

import { L1_CHAIN, L2_CHAIN } from '../../../../constants';
import { useBridgeTokens } from '../../../../hooks';
import { useGetTokensInfo } from '../../hooks';

const LEDING_MULTIPLIER = 1.5;
const DEX_MULTIPLIER = 5;

const AssetCell = ({ name }: { name: string }) => <Span size='inherit'>{name}</Span>;

enum TableColumns {
  ASSET = 'asset',
  HOLDING = 'holding',
  LENDING = 'lending',
  DEX = 'DEX'
}

type TableRow = {
  id: number;
  [TableColumns.ASSET]: ReactNode;
  [TableColumns.HOLDING]: ReactNode;
  [TableColumns.LENDING]: ReactNode;
  [TableColumns.DEX]: ReactNode;
};

const columns = [
  { id: TableColumns.ASSET, name: 'Asset' },
  { id: TableColumns.HOLDING, name: 'Holding' },
  {
    id: TableColumns.LENDING,
    name: (
      <Span noWrap size='inherit' weight='inherit'>
        Lending, Restaking, CDP *
      </Span>
    )
  },
  {
    id: TableColumns.DEX,
    name: (
      <Span noWrap size='inherit' weight='inherit'>
        DEX *
      </Span>
    )
  }
];

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type MultipliersModalProps = Props & InheritAttrs;

const nativeToken = NATIVE[L2_CHAIN];

const MultipliersModal = (props: MultipliersModalProps): JSX.Element => {
  const { data: tokens } = useBridgeTokens(L1_CHAIN, L2_CHAIN);
  const { locale } = useLocale();

  const { data: tokensInfo, isLoading: isLoadingTokensInfo } = useGetTokensInfo();

  const data = tokens
    ?.map((token) => {
      if (token.l1Currency.isNative) {
        const tokenInfo = tokensInfo?.find((info) => info.symbol === 'eth');

        return {
          logoUrl: token.l1Token.logoUrl,
          symbol: nativeToken.symbol,
          multiplier: Number(tokenInfo?.multiplier)
        };
      }

      const tokenInfo = tokensInfo?.find((info) => isAddressEqual(info.l2_address as Address, token.l2Token.address));

      return {
        logoUrl: token.l1Token.logoUrl,
        symbol: token.l1Token.symbol,
        multiplier: Number(tokenInfo?.multiplier)
      };
    })
    .filter((item) => Boolean(item.multiplier))
    .sort((a, b) => {
      return Number(b.multiplier || 0) - Number(a.multiplier || 0); // If 'a' values are equal, sort by 'b'
    });

  const rows: TableRow[] =
    !isLoadingTokensInfo && data
      ? data.map((item, idx) => ({
          id: idx,
          [TableColumns.ASSET]: <AssetCell name={item.symbol} />,
          [TableColumns.HOLDING]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(item.multiplier)}x`,
          [TableColumns.LENDING]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(item.multiplier * LEDING_MULTIPLIER)}x`,
          [TableColumns.DEX]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(item.multiplier * DEX_MULTIPLIER)}x`
        }))
      : Array(10)
          .fill(undefined)
          .map((_, idx) => ({
            id: idx,
            [TableColumns.ASSET]: <Skeleton width='4xl' />,
            [TableColumns.HOLDING]: <Skeleton width='4xl' />,
            [TableColumns.LENDING]: <Skeleton width='4xl' />,
            [TableColumns.DEX]: <Skeleton width='4xl' />
          }));

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Multipliers
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>Bridge High Priority assets to earn multipliers on your spice</P>
        <Table removeWrapper columns={columns} rows={rows} />
        <P align='center' color='grey-50' size='xs'>
          * The multipliers displayed are subject to change based on the payout structure of the respective projects.
        </P>
      </ModalBody>
    </Modal>
  );
};

export { MultipliersModal };
