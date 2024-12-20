import { useId } from '@react-aria/utils';
import { SelectState } from '@react-stately/select';
import { forwardRef, ReactNode } from 'react';

import { Modal, ModalHeader, ModalProps, P } from '..';
import { ListItem, ListProps } from '../List';

import { StyledList } from './Select.style';

type Props = {
  state: SelectState<unknown>;
  title?: ReactNode;
  listProps?: Omit<ListProps, 'children'>;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type SelectModalProps = Props & InheritAttrs;

const SelectModal = forwardRef<HTMLDivElement, SelectModalProps>(
  ({ state, title, onClose, listProps, ...props }, ref): JSX.Element => {
    const headerId = useId();

    const handleSelectionChange: ListProps['onSelectionChange'] = (key) => {
      const [selectedKey] = [...key];

      if (!selectedKey) {
        return onClose?.();
      }

      state.selectionManager.setSelectedKeys(key);
      onClose?.();
    };

    const items = [...state.collection];
    const hasItems = !!items.length;

    return (
      <Modal ref={ref} onClose={onClose} {...props}>
        {title && (
          <ModalHeader id={headerId} size='lg' weight='medium'>
            {title}
          </ModalHeader>
        )}
        {hasItems ? (
          <StyledList
            {...listProps}
            aria-labelledby={headerId}
            gap='s'
            selectionMode='single'
            onSelectionChange={handleSelectionChange}
          >
            {[...state.collection].map((item) => (
              <ListItem
                key={item.key}
                alignItems='center'
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
      </Modal>
    );
  }
);

SelectModal.displayName = 'SelectModal';

export { SelectModal };
export type { SelectModalProps };
