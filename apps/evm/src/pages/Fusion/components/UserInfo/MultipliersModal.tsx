import { Flex, H3, Modal, ModalBody, ModalHeader, ModalProps, P, Skeleton, Span, Table, useLocale } from '@gobob/ui';
import { ReactNode, useCallback, useId } from 'react';
import { Address, isAddressEqual } from 'viem';
import { useTranslation } from 'react-i18next';

import { useGetTokensInfo } from '../../hooks';
import { TokenInfo } from '../../../../utils';

const yieldAssetsAddresses = [
  '0x236f8c0a61da474db21b693fb2ea7aab0c803894',
  '0xcc0966d8418d412c599a6421b760a847eb169a8c',
  '0x1fcca65fb6ae3b2758b9b2b394cb227eae404e1e'
];

const BASE_MULTIPLIER = 0.5;
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

type Props = {};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type MultipliersModalProps = Props & InheritAttrs;

const MultipliersModal = (props: MultipliersModalProps): JSX.Element => {
  const { locale } = useLocale();
  const { t } = useTranslation();

  const { data: tokensInfo } = useGetTokensInfo();

  const featuredAssetId = useId();
  const yieldAssetId = useId();
  const baseAssetId = useId();

  const columns = [
    { id: TableColumns.ASSET, width: 160, name: t('fusion.userInfo.multipliersModal.columns.asset') },
    { id: TableColumns.HOLDING, name: t('fusion.userInfo.multipliersModal.columns.holding') },
    {
      id: TableColumns.LENDING,
      name: (
        <Span noWrap size='inherit' weight='inherit'>
          {t('fusion.userInfo.multipliersModal.columns.lending')}
        </Span>
      )
    },
    {
      id: TableColumns.DEX,
      name: (
        <Span noWrap size='inherit' weight='inherit'>
          {t('fusion.userInfo.multipliersModal.columns.dex')}
        </Span>
      )
    }
  ];

  const getRow = useCallback(
    (item: Pick<TokenInfo, 'symbol' | 'multiplier'>, idx: number): TableRow => ({
      id: idx,
      [TableColumns.ASSET]: <AssetCell name={item.symbol} />,
      [TableColumns.HOLDING]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * BASE_MULTIPLIER)}x`,
      [TableColumns.LENDING]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * LEDING_MULTIPLIER)}x`,
      [TableColumns.DEX]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * DEX_MULTIPLIER)}x`
    }),
    [locale]
  );

  const sortedData = tokensInfo?.sort((a, b) => {
    return Number(b.multiplier || 0) - Number(a.multiplier || 0); // If 'a' values are equal, sort by 'b'
  });

  const baseAssetsRows = sortedData
    ? sortedData
        ?.filter(
          (item) =>
            !yieldAssetsAddresses.find((address) => isAddressEqual(item.l2_address as Address, address as Address))
        )
        // TODO: remove when FBTC is added
        .filter((item) => item.symbol !== 'FBTC')
        .filter((item) => Number(item.multiplier) > 0)
        .map(getRow)
    : Array(10)
        .fill(undefined)
        .map((_, idx) => ({
          id: idx,
          [TableColumns.ASSET]: <Skeleton width='4xl' />,
          [TableColumns.HOLDING]: <Skeleton width='4xl' />,
          [TableColumns.LENDING]: <Skeleton width='4xl' />,
          [TableColumns.DEX]: <Skeleton width='4xl' />
        }));

  const yieldAssetsRows = sortedData
    ? sortedData
        ?.filter((item) =>
          yieldAssetsAddresses.find((address) => isAddressEqual(item.l2_address as Address, address as Address))
        )
        .map(getRow)
    : Array(2)
        .fill(undefined)
        .map((_, idx) => ({
          id: idx,
          [TableColumns.ASSET]: <Skeleton width='4xl' />,
          [TableColumns.HOLDING]: <Skeleton width='4xl' />,
          [TableColumns.LENDING]: <Skeleton width='4xl' />,
          [TableColumns.DEX]: <Skeleton width='4xl' />
        }));

  const featuredAssetsRows = [
    getRow({ multiplier: sortedData?.find((item) => item.symbol === 'FBTC')?.multiplier || '0', symbol: 'FBTC' }, 0)
  ];

  return (
    <Modal {...props} size='xl'>
      <ModalHeader showDivider align='start'>
        {t('fusion.userInfo.multipliersModal.title')}
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>{t('fusion.userInfo.multipliersModal.description')}</P>
        <Flex direction='column' gap='md'>
          <H3 id={featuredAssetId} size='md'>
            {t('fusion.userInfo.multipliersModal.sections.featured')}
          </H3>
          <Table removeWrapper aria-labelledby={featuredAssetId} columns={columns} rows={featuredAssetsRows} />
        </Flex>
        <Flex direction='column' gap='md'>
          <H3 id={yieldAssetId} size='md'>
            {t('fusion.userInfo.multipliersModal.sections.yield')}
          </H3>
          <Table removeWrapper aria-labelledby={yieldAssetId} columns={columns} rows={yieldAssetsRows} />
        </Flex>
        <Flex direction='column' gap='md'>
          <H3 id={baseAssetId} size='md'>
            {t('fusion.userInfo.multipliersModal.sections.base')}
          </H3>
          <Table removeWrapper aria-labelledby={baseAssetId} columns={columns} rows={baseAssetsRows} />
        </Flex>
        <P align='center' color='grey-50' size='xs'>
          {t('fusion.userInfo.multipliersModal.disclaimer')}
        </P>
      </ModalBody>
    </Modal>
  );
};

export { MultipliersModal };
