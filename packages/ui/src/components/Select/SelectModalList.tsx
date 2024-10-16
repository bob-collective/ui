import { useFilter } from '@react-aria/i18n';
import { Node } from '@react-types/shared';
import { ReactNode } from 'react';

import { ListItem, ListProps } from '../List';
import { P, Span } from '../Text';
import { ModalBody } from '../Modal';

import { StyledList } from './Select.style';

type SelectObject = Record<any, any>;

type SearchableProps<T = SelectObject> = {
  items: Node<T>[];
  inputValue: string;
  onValueChange: (value: string) => void;
};

type SearchableFilter<T = SelectObject> = (searchTerm: string, item: T) => boolean;

type Props<T = SelectObject> = {
  items: Node<T>[];
  searchable?: boolean | SearchableFilter<T> | SearchableProps<T>;
  itemSkeleton?: (props: any) => ReactNode;
  searchTerm?: string;
  debouncedSearchTerm?: string;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children' | 'items'>;

type SelectModalListProps<T = SelectObject> = Props<T> & InheritAttrs;

const SelectModalList = <T extends SelectObject = SelectObject>({
  items: itemsProp,
  searchable,
  searchTerm,
  itemSkeleton: Skeleton,
  debouncedSearchTerm,
  ...props
}: SelectModalListProps<T>): JSX.Element => {
  const { contains } = useFilter({
    sensitivity: 'base'
  });

  const isSearchResultList = typeof searchable === 'object';

  const isSearching = searchTerm !== debouncedSearchTerm;

  const items = isSearchResultList
    ? searchable.items
    : searchable && searchTerm
      ? [...(itemsProp || [])]?.filter(
          typeof searchable === 'function'
            ? (item) => item.value && searchable(searchTerm, item.value)
            : (item) => contains(item.textValue, searchTerm)
        )
      : itemsProp;

  if (searchTerm && isSearching && Skeleton)
    return (
      <StyledList gap='s'>
        {Array(10)
          .fill(null)
          .map((_, idx) => (
            <ListItem key={idx} textValue={idx.toString()}>
              <Skeleton />
            </ListItem>
          ))}
      </StyledList>
    );

  if (!items.length)
    return (
      <ModalBody padding='even'>
        <P align='center'>
          {searchable && searchTerm ? (
            <>
              No results found for <Span color='grey-50'>{searchTerm}</Span>
            </>
          ) : (
            'No options'
          )}
        </P>
      </ModalBody>
    );

  return (
    <StyledList {...props} gap='s' selectionMode='single'>
      {items.map((item) => (
        <ListItem key={item.key} textValue={item.textValue}>
          {item.rendered}
        </ListItem>
      ))}
    </StyledList>
  );
};

export { SelectModalList };
export type { SelectModalListProps };
