import { SolidFunnel, List, ListItem, Popover, PopoverBody, PopoverContent, PopoverTrigger, Span } from '@gobob/ui';
import { ReactNode, useState } from 'react';

import { StyledFilterButton } from './ProfileActivity.style';

enum StatusFilterOption {
  ANY_STATUS = 'default',
  PENDING = 'pending',
  NEEDED_ACTION = 'needed-action',
  COMPLETE = 'complete',
  FAILED = 'failed'
}

enum TransactionTypeFilterOption {
  ALL_TRANSACTIONS = 'default',
  NATIVE_BRIDGE = 'native-bridge',
  BTC_BRIDGE = 'btc-bridge',
  STRATEGIES = 'strategies'
}

type ProfileActivityFilterProps<T extends StatusFilterOption | TransactionTypeFilterOption> = {
  label: ReactNode;
  value: T;
  options: Array<{ children: ReactNode; key: T }>;
  onSelectionChange: (value: T) => void;
};

const ProfileActivityFilter = <T extends StatusFilterOption | TransactionTypeFilterOption>({
  label,
  options,
  value,
  onSelectionChange
}: ProfileActivityFilterProps<T>): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger>
        <StyledFilterButton size='s' variant='ghost'>
          <SolidFunnel color='grey-50' size='xs' />
          <Span size='s'>{options.find((option) => (option.key as T) === value)?.children}</Span>
        </StyledFilterButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody gap='xs' padding='lg'>
          <Span color='grey-50' size='s' style={{ marginLeft: 12, marginRight: 12 }}>
            {label}:
          </Span>
          <List
            gap='xs'
            selectedKeys={value ? [value] : undefined}
            selectionMode='single'
            onSelectionChange={(key) => {
              const [selectedKey] = [...key];

              onSelectionChange(selectedKey as T);

              setOpen(false);
            }}
          >
            {options.map((option) => (
              <ListItem key={option.key} textValue={option.key}>
                <Span size='s'>{option.children}</Span>
              </ListItem>
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { ProfileActivityFilter, StatusFilterOption, TransactionTypeFilterOption };
