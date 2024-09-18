import { useFilter } from '@react-aria/i18n';
import { Node } from '@react-types/shared';

import { ListItem, ListProps } from '../List';
import { P } from '../Text';

import { StyledList } from './Select.style';

type SelectObject = Record<any, any>;

type SearchableProps<T = SelectObject> = {
  items: Node<T>[];
  inputValue: string;
  onValueChange: (value: string) => void;
};

type SearchableFilter<T = SelectObject> = (value: Node<T>) => boolean;

type Props<T = SelectObject> = {
  items: Node<T>[];
  searchable?: boolean | SearchableFilter<T> | SearchableProps<T>;
  searchTerm?: string;
};

type InheritAttrs = Omit<ListProps, keyof Props | 'children' | 'items'>;

type SelectModalListProps<T = SelectObject> = Props<T> & InheritAttrs;

const SelectModalList = <T extends SelectObject = SelectObject>({
  items: itemsProp,
  searchable,
  searchTerm,
  ...props
}: SelectModalListProps<T>): JSX.Element => {
  const { contains } = useFilter({
    sensitivity: 'base'
  });

  const isSearchResultList = typeof searchable === 'object';

  const items = isSearchResultList
    ? searchable.items
    : searchable && searchTerm
      ? [...(itemsProp || [])]?.filter(
          typeof searchable === 'function' ? searchable : (item) => contains(item.textValue, searchTerm)
        )
      : itemsProp;

  if (!items.length)
    return (
      <P align='center'>{isSearchResultList && searchTerm ? `No results found for ${searchTerm}` : 'No options'}</P>
    );

  return (
    <StyledList {...props} gap='s' selectionMode='single'>
      {items.map((item) => (
        <ListItem
          key={item.key}
          alignItems='center'
          alignSelf='auto'
          gap='xs'
          justifyContent='space-between'
          textValue={item.textValue}
        >
          {item.rendered}
        </ListItem>
      ))}
    </StyledList>
  );
};

export { SelectModalList };
export type { SelectModalListProps };
