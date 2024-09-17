import { useId } from '@react-aria/utils';
import { SelectState } from '@react-stately/select';
import { forwardRef, ReactNode, useState } from 'react';
import { useFilter } from '@react-aria/i18n';

import { MagnifyingGlass } from '../../icons';
import { Chip, ChipProps, Flex, Input, ModalHeader, ModalProps, P } from '..';
import { ListItem, ListProps } from '../List';
import { ModalDivider } from '../Modal';

import { StyledList, StyledModal, StyledModalBody } from './Select.style';

type Props = {
  state: SelectState<unknown>;
  title?: ReactNode;
  listProps?: Omit<ListProps, 'children'>;
  showAutoComplete?: boolean;
  featuredItems?: Pick<ChipProps, 'startAdornment' | 'endAdornment' | 'children'>[];
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps = Props & InheritAttrs;

const SelectModal = forwardRef<HTMLDivElement, SelectModalProps>(
  ({ state, title, onClose, listProps, showAutoComplete, featuredItems, ...props }, ref): JSX.Element => {
    const headerId = useId();

    const [search, setSearch] = useState('');

    const { contains } = useFilter({
      sensitivity: 'base'
    });

    const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
      const [selectedKey] = [...key];

      if (!selectedKey) {
        return onClose?.();
      }

      state.selectionManager.setSelectedKeys(key);
      onClose?.();
    };

    const handleSearchChange = (value: string) => {
      setSearch(value);
    };

    const items = [...state.collection];

    const matchedItems = items.filter((item) => contains(item.textValue, search));

    const hasItems = !!items.length;

    const hasFeaturedItems = !!featuredItems?.length;

    return (
      <StyledModal ref={ref} $showAutoComplete={showAutoComplete} onClose={onClose} {...props}>
        {title && (
          <ModalHeader id={headerId} showDivider={false} size='lg' weight='medium'>
            {title}
          </ModalHeader>
        )}
        <ModalDivider />
        {(hasFeaturedItems || showAutoComplete) && (
          <>
            <StyledModalBody>
              {showAutoComplete && (
                <Input
                  placeholder='Search'
                  startAdornment={<MagnifyingGlass color='grey-50' />}
                  value={search}
                  onValueChange={handleSearchChange}
                />
              )}
              {hasFeaturedItems && (
                <Flex gap='s'>
                  {featuredItems.map((item, key) => (
                    <Chip borderColor='grey-300' {...item} key={key} />
                  ))}
                </Flex>
              )}
            </StyledModalBody>
            <ModalDivider />
          </>
        )}
        {hasItems ? (
          <StyledList
            {...listProps}
            aria-labelledby={headerId}
            gap='s'
            selectionMode='single'
            onSelectionChange={handleSelectionChange}
          >
            {matchedItems.map((item) => (
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
        ) : (
          <P align='center'>No options</P>
        )}
      </StyledModal>
    );
  }
);

SelectModal.displayName = 'SelectModal';

export { SelectModal };
export type { SelectModalProps };
