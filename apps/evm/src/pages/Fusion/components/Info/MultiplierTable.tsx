import { Table, TableProps } from '@gobob/ui';
import { ReactNode } from 'react';

import { StyledTableP } from './Info.style';

type MultiplierTableProps = Omit<TableProps, 'rows' | 'columns'>;

enum MultiplierTableColumns {
  MULTIPLIER = 'multiplier',
  TOKENS = 'tokens'
}

type MultiplierTableData = {
  multiplier: string;
  tokens: string;
};

type MultiplierTableRow = {
  id: string;
  [MultiplierTableColumns.MULTIPLIER]: ReactNode;
  [MultiplierTableColumns.TOKENS]: ReactNode;
};

const multiplierTableData: MultiplierTableData[] = [
  {
    multiplier: '1.5x',
    tokens: 'tBTC, WBTC'
  },
  {
    multiplier: '1.3x',
    tokens: 'DAI, eDLLR, rETH, STONE, USDC, USDT, wstETH'
  },
  {
    multiplier: '1x',
    tokens: 'ALEX, ETH, eSOV'
  }
];

const columns = [
  { name: 'Multiplier', id: MultiplierTableColumns.MULTIPLIER },
  { name: 'Tokens', id: MultiplierTableColumns.TOKENS }
];

const rows: MultiplierTableRow[] = multiplierTableData.map((multiplier) => {
  return {
    id: multiplier.multiplier,
    multiplier: <StyledTableP size='s'>{multiplier.multiplier}</StyledTableP>,
    tokens: <StyledTableP size='s'>{multiplier.tokens}</StyledTableP>
  };
});

const MultiplierTable = ({ ...props }: MultiplierTableProps) => (
  <Table columns={columns} rows={rows} wrapperProps={{ padding: 'lg' }} {...props} />
);

export { MultiplierTable };
