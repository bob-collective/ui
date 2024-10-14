import {
  Avatar,
  Flex,
  H3,
  Modal,
  ModalBody,
  ModalHeader,
  ModalProps,
  P,
  Skeleton,
  Span,
  Table,
  useLocale
} from '@gobob/ui';
import { ReactNode, useCallback, useId } from 'react';
import { Address, isAddressEqual } from 'viem';
import { Trans } from '@lingui/macro';

import { useGetTokensInfo } from '../../hooks';

import { TokenInfo } from '@/utils';

const yieldAssetsAddresses = [
  '0x236f8c0a61da474db21b693fb2ea7aab0c803894',
  '0xcc0966d8418d412c599a6421b760a847eb169a8c',
  '0x1fcca65fb6ae3b2758b9b2b394cb227eae404e1e'
];

const featuredAssetsAddresses = ['0xc96de26018a54d51c097160568752c4e3bd6c364'];

const BASE_MULTIPLIER = 0.5;
const LEDING_MULTIPLIER = 1.5;
const DEX_MULTIPLIER = 5;

const AssetCell = ({ name, logo }: { name: string; logo?: string }) => (
  <Flex alignItems='center' gap='s'>
    {logo && <Avatar alt={name} size='xl' src={logo} />}
    <Span size='inherit'>{name}</Span>
  </Flex>
);

const RewardsCell = ({ incentives }: { incentives: string[] }) => <Span size='inherit'>{incentives.join(' + ')}</Span>;

enum TableColumns {
  ASSET = 'asset',
  HOLDING = 'holding',
  LENDING = 'lending',
  DEX = 'DEX',
  REWARDS = 'REWARDS'
}

type TableRow = {
  id: number;
  [TableColumns.ASSET]: ReactNode;
  [TableColumns.HOLDING]: ReactNode;
  [TableColumns.LENDING]: ReactNode;
  [TableColumns.DEX]: ReactNode;
  [TableColumns.REWARDS]: ReactNode;
};

const columns = [
  { id: TableColumns.ASSET, minWidth: 140, name: 'Asset' },
  { id: TableColumns.HOLDING, name: 'Holding' },
  {
    id: TableColumns.LENDING,
    name: (
      <Span noWrap size='inherit' weight='inherit'>
        <Trans>Lending, Restaking, CDP *</Trans>
      </Span>
    )
  },
  {
    id: TableColumns.DEX,
    name: (
      <Span noWrap size='inherit' weight='inherit'>
        <Trans>DEX *</Trans>
      </Span>
    )
  },
  {
    id: TableColumns.REWARDS,
    minWidth: 250,
    name: (
      <Span noWrap size='inherit' weight='inherit'>
        <Trans>Rewards</Trans>
      </Span>
    )
  }
];

type MultipliersModalProps = Omit<ModalProps, 'children'>;

const MultipliersModal = (props: MultipliersModalProps): JSX.Element => {
  const { locale } = useLocale();

  const { data: tokensInfo } = useGetTokensInfo();

  const featuredAssetId = useId();
  const yieldAssetId = useId();
  const baseAssetId = useId();

  const getRow = useCallback(
    (item: TokenInfo, idx: number): TableRow => ({
      id: idx,
      [TableColumns.ASSET]: <AssetCell logo={item.logos[0]} name={item.symbol} />,
      [TableColumns.HOLDING]: `${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * BASE_MULTIPLIER)}x`,
      [TableColumns.LENDING]: (
        <Span
          color='yellow-500'
          size='inherit'
        >{`${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * LEDING_MULTIPLIER)}x`}</Span>
      ),
      [TableColumns.DEX]: (
        <Span
          color='green-500'
          size='inherit'
        >{`${Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(Number(item.multiplier || 0) * DEX_MULTIPLIER)}x`}</Span>
      ),
      [TableColumns.REWARDS]: item.incentives ? <RewardsCell incentives={item.incentives} /> : undefined
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
          [TableColumns.DEX]: <Skeleton width='4xl' />,
          [TableColumns.REWARDS]: <Skeleton width='4xl' />
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
          [TableColumns.DEX]: <Skeleton width='4xl' />,
          [TableColumns.REWARDS]: <Skeleton width='4xl' />
        }));

  const featuredAssetsRows = sortedData
    ? sortedData
        ?.filter((item) =>
          featuredAssetsAddresses.find((address) => isAddressEqual(item.l2_address as Address, address as Address))
        )
        .map(getRow)
    : Array(2)
        .fill(undefined)
        .map((_, idx) => ({
          id: idx,
          [TableColumns.ASSET]: <Skeleton width='4xl' />,
          [TableColumns.HOLDING]: <Skeleton width='4xl' />,
          [TableColumns.LENDING]: <Skeleton width='4xl' />,
          [TableColumns.DEX]: <Skeleton width='4xl' />,
          [TableColumns.REWARDS]: <Skeleton width='4xl' />
        }));

  return (
    <Modal {...props} size='3xl'>
      <ModalHeader showDivider align='start'>
        <Trans>Multipliers</Trans>
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          <Trans>Deploy high priority assets into high priority DeFi protocols to maximize your Spice harvest.</Trans>
        </P>
        <Flex direction='column' flex={1} gap='md'>
          <H3 id={featuredAssetId} size='md'>
            <Trans>Featured Assets</Trans>
          </H3>
          <Table
            aria-labelledby={featuredAssetId}
            columns={columns}
            rows={featuredAssetsRows}
            wrapperProps={{ padding: 'none' }}
          />
        </Flex>
        <Flex direction='column' flex={1} gap='md'>
          <H3 id={yieldAssetId} size='md'>
            <Trans>Yield Assets</Trans>
          </H3>
          <Table
            aria-labelledby={yieldAssetId}
            columns={columns}
            rows={yieldAssetsRows}
            wrapperProps={{ padding: 'none' }}
          />
        </Flex>
        <Flex direction='column' flex={1} gap='md'>
          <H3 id={baseAssetId} size='md'>
            <Trans>Base Assets</Trans>
          </H3>
          <Table
            aria-labelledby={baseAssetId}
            columns={columns}
            rows={baseAssetsRows}
            wrapperProps={{ padding: 'none' }}
          />
        </Flex>
        <P align='center' color='grey-50' size='xs'>
          <Trans>
            * The multipliers displayed are subject to change based on the payout structure of the respective projects.
          </Trans>
        </P>
      </ModalBody>
    </Modal>
  );
};

export { MultipliersModal };
