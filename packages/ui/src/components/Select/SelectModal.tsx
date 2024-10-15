import { mergeProps, useId } from '@react-aria/utils';
import { SelectState } from '@react-stately/select';
import { CSSProperties, ForwardedRef, forwardRef, ReactNode, useRef, useState } from 'react';
import { useButton } from '@react-aria/button';
import { Node, PressEvent } from '@react-types/shared';
import { useDebounceValue } from 'usehooks-ts';

import { MagnifyingGlass } from '../../icons';
import { ChipProps, Flex, Input, ModalHeader, ModalProps, P } from '..';
import { ListProps } from '../List';
import { Spacing } from '../../theme';

import { StyledModal, StyledModalBody, StyledModalDivider, StyledSelectableChip } from './Select.style';
import { SelectModalList, SelectModalListProps } from './SelectModalList';

type SelectObject = Record<any, any>;

const SelectableChip = ({ onPress, ...props }: ChipProps & { onPress?: (e: PressEvent) => void }) => {
  const ref = useRef(null);
  const { buttonProps } = useButton({ onPress, elementType: 'div' }, ref);

  return <StyledSelectableChip ref={ref} borderColor='grey-300' size='lg' {...mergeProps(props, buttonProps)} />;
};

type Props<T = SelectObject> = {
  state: SelectState<unknown>;
  title?: ReactNode;
  listProps?: Omit<ListProps, 'children' | 'searchable'>;
  searchable?: SelectModalListProps<T>['searchable'];
  featuredItems?: Array<Pick<ChipProps, 'startAdornment' | 'endAdornment' | 'children'> & { value: string }>;
  height?: CSSProperties['height'] | Spacing;
  itemSkeleton?: (props: any) => ReactNode;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps<T = SelectObject> = Props<T> & InheritAttrs;

const SelectModal = <T extends SelectObject = SelectObject>(
  { state, title, listProps, height, searchable, featuredItems, itemSkeleton, ...props }: SelectModalProps<T>,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element => {
  const headerId = useId();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 500);

  const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
    state.selectionManager.setSelectedKeys(key);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
  };

  const handlePressChip = (value: string) => {
    state.selectionManager.setSelectedKeys(new Set([value]));
  };

  const isSearchable = !!searchable;
  const hasFeaturedItems = !!featuredItems?.length;

  const items = [...state.collection] as Node<T>[];

  // TODO: featured items should be scrollable with list
  return (
    <StyledModal ref={ref} $height={height} {...props}>
      {title && (
        <ModalHeader id={headerId} size='lg' weight='medium'>
          {title}
        </ModalHeader>
      )}
      {(hasFeaturedItems || isSearchable) && (
        <>
          <StyledModalBody gap='lg'>
            {isSearchable && (
              <Input
                placeholder='Search'
                startAdornment={<MagnifyingGlass color='grey-50' />}
                value={search}
                onValueChange={handleSearchChange}
              />
            )}
            {hasFeaturedItems && !search && (
              <Flex wrap gap='s'>
                {featuredItems.map(({ value, ...item }, key) => (
                  <SelectableChip
                    key={key}
                    aria-label={`select ${value}`}
                    borderColor='grey-300'
                    size='lg'
                    onPress={() => handlePressChip(value)}
                    {...item}
                  />
                ))}
              </Flex>
            )}
            {!!search && (
              <Flex alignItems='center' color='grey-50' elementType={P} gap='s'>
                <MagnifyingGlass color='grey-50' size='s' />
                Search results
              </Flex>
            )}
          </StyledModalBody>
          {!search && <StyledModalDivider />}
        </>
      )}
      <SelectModalList<T>
        {...listProps}
        aria-labelledby={headerId}
        debouncedSearchTerm={debouncedSearch}
        itemSkeleton={itemSkeleton}
        items={items}
        searchTerm={search}
        searchable={searchable}
        onSelectionChange={handleSelectionChange}
      />
    </StyledModal>
  );
};

const _SelectModal = forwardRef(SelectModal) as <T extends SelectObject = SelectObject>(
  props: SelectModalProps<T> & { ref?: React.ForwardedRef<HTMLInputElement> }
) => ReturnType<typeof SelectModal>;

SelectModal.displayName = 'SelectModal';

export { _SelectModal as SelectModal };
export type { SelectModalProps };
