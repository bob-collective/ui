import { AriaTableProps, useTable } from '@react-aria/table';
import { mergeProps } from '@react-aria/utils';
import { TableStateProps, useTableState } from '@react-stately/table';
import { forwardRef, HTMLAttributes } from 'react';

import { useDOMRef } from '../../hooks';

import { StyledTable } from './Table.style';
import { TableCell } from './TableCell';
import { TableColumnHeader } from './TableColumnHeader';
import { TableHeaderRow } from './TableHeaderRow';
import { TableRow } from './TableRow';
import { TableRowGroup } from './TableRowGroup';

type Props = {
  isStickyHeader?: boolean;
};

type InheritAttrs = Omit<TableStateProps<Record<string, any>> & AriaTableProps<Record<string, any>>, keyof Props>;

type NativeAttrs = Omit<HTMLAttributes<HTMLTableElement>, keyof (InheritAttrs & Props)>;

type BaseTableProps = Props & InheritAttrs & NativeAttrs;

const BaseTable = forwardRef<HTMLTableElement, BaseTableProps>(
  (
    {
      onRowAction,
      onCellAction,
      onSelectionChange,
      onSortChange,
      isStickyHeader,
      selectedKeys,
      selectionMode,
      selectionBehavior,
      ...props
    },
    ref
  ): JSX.Element => {
    const tableRef = useDOMRef(ref);

    const statelyProps: TableStateProps<Record<string, any>> = {
      onSelectionChange,
      onSortChange,
      selectedKeys,
      selectionMode,
      selectionBehavior,
      ...props
    };
    const state = useTableState(statelyProps);

    const ariaProps: AriaTableProps<Record<string, any>> = { onRowAction, onCellAction, ...props };
    const { gridProps } = useTable(ariaProps, state, tableRef);

    const { collection } = state;

    return (
      <StyledTable ref={tableRef} {...mergeProps(props, gridProps)}>
        <TableRowGroup elementType='thead' isStickyHeader={isStickyHeader}>
          {collection.headerRows.map((headerRow) => (
            <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
              {[...(collection.getChildren?.(headerRow.key) || [])].map((column) => (
                <TableColumnHeader key={column.key} column={column} state={state} />
              ))}
            </TableHeaderRow>
          ))}
          <tr
            aria-hidden='true'
            className='w-px h-px block'
            style={{ display: 'block', height: 1, width: 1, marginLeft: '0.25rem', marginTop: '0.25rem' }}
            tabIndex={-1}
          />
        </TableRowGroup>
        <TableRowGroup elementType='tbody'>
          {[...collection].map((row) => (
            <TableRow key={row.key} item={row} state={state}>
              {[...(collection.getChildren?.(row.key) || [])].map((cell) => (
                <TableCell key={cell.key} cell={cell} state={state} />
              ))}
            </TableRow>
          ))}
        </TableRowGroup>
      </StyledTable>
    );
  }
);

BaseTable.displayName = 'BaseTable';

export { BaseTable };
export type { BaseTableProps };
