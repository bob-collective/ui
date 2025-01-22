import {
  Button,
  Card,
  Flex,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SolidFunnel,
  Span
} from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useEffect, useId, useState } from 'react';

enum ProfileActivityStatusFilterOption {
  ANY_STATUS = 'default',
  PENDING = 'pending',
  NEEDED_ACTION = 'needed-action',
  COMPLETE = 'complete',
  FAILED = 'failed'
}

enum ProfileActivityTypeFilterOption {
  ALL_TRANSACTIONS = 'default',
  NATIVE_BRIDGE = 'native-bridge',
  BTC_BRIDGE = 'btc-bridge',
  STRATEGIES = 'strategies'
}

const statusFilterOptions = [
  { children: <Trans>Any Status</Trans>, key: ProfileActivityStatusFilterOption.ANY_STATUS },
  { children: <Trans>Pending</Trans>, key: ProfileActivityStatusFilterOption.PENDING },
  { children: <Trans>Needed Action</Trans>, key: ProfileActivityStatusFilterOption.NEEDED_ACTION },
  { children: <Trans>Complete</Trans>, key: ProfileActivityStatusFilterOption.COMPLETE },
  { children: <Trans>Failed</Trans>, key: ProfileActivityStatusFilterOption.FAILED }
];

const typeFilterOptions = [
  { children: <Trans>Any Transaction</Trans>, key: ProfileActivityTypeFilterOption.ALL_TRANSACTIONS },
  { children: <Trans>Native Bridge</Trans>, key: ProfileActivityTypeFilterOption.NATIVE_BRIDGE },
  { children: <Trans>BTC Bridge</Trans>, key: ProfileActivityTypeFilterOption.BTC_BRIDGE },
  { children: <Trans>Staking</Trans>, key: ProfileActivityTypeFilterOption.STRATEGIES }
];

type ProfileActivityFiltersData = { type: ProfileActivityTypeFilterOption; status: ProfileActivityStatusFilterOption };

type ProfileActivityFiltersProps = {
  value: ProfileActivityFiltersData;
  onSelectionChange: (filters: ProfileActivityFiltersData) => void;
};

const ProfileActivityFilters = ({ value, onSelectionChange }: ProfileActivityFiltersProps): JSX.Element => {
  const statusLabelId = useId();
  const typeLabelId = useId();

  const [state, setState] = useState<ProfileActivityFiltersData>({
    status: value.status || ProfileActivityStatusFilterOption.ANY_STATUS,
    type: value.type || ProfileActivityTypeFilterOption.ALL_TRANSACTIONS
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {}, [isOpen]);

  const handleApply = () => {
    onSelectionChange(state);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen && (state.status !== value.status || state.type !== value.type)) {
      setState(value);
    }
  };

  const handleClear = () => {
    const clearState = {
      status: ProfileActivityStatusFilterOption.ANY_STATUS,
      type: ProfileActivityTypeFilterOption.ALL_TRANSACTIONS
    };

    setState(clearState);

    onSelectionChange(clearState);
    setOpen(false);
  };

  const isFiltering =
    (value.status && value.status !== ProfileActivityStatusFilterOption.ANY_STATUS) ||
    (value.type && value.type !== ProfileActivityTypeFilterOption.ALL_TRANSACTIONS);

  const statusLabel = statusFilterOptions.find(
    (item) => item.key === (value.status || ProfileActivityStatusFilterOption.ANY_STATUS)
  )?.children;
  const typeLabel = typeFilterOptions.find(
    (item) => item.key === (value.type || ProfileActivityTypeFilterOption.ALL_TRANSACTIONS)
  )?.children;

  return (
    <Popover isOpen={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Card
          isHoverable
          isPressable
          alignItems='center'
          background={isFiltering ? 'primary-500' : 'grey-500'}
          direction='row'
          gap='s'
          paddingX='md'
          paddingY='s'
          rounded='md'
        >
          <SolidFunnel size='xxs' />
          <Span size='xs'>
            {isFiltering ? (
              statusLabel && typeLabel ? (
                <>
                  {statusLabel} | {typeLabel}
                </>
              ) : (
                statusLabel || typeLabel
              )
            ) : (
              <Trans>Filter by</Trans>
            )}
          </Span>
        </Card>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody gap='xs' padding='none'>
          <Flex gap='s' paddingTop='lg' paddingX='xl'>
            <Flex direction='column' gap='xs'>
              <Span color='grey-50' id={statusLabelId} size='xs'>
                <Trans>Status</Trans>:
              </Span>
              <List
                aria-labelledby={statusLabelId}
                selectedKeys={state.status ? [state.status] : undefined}
                selectionMode='single'
                onSelectionChange={(key) => {
                  const [selectedKey] = [...key];

                  setState((s) => ({ ...s, status: selectedKey as ProfileActivityStatusFilterOption }));
                }}
              >
                {statusFilterOptions.map((option) => (
                  <ListItem key={option.key} textValue={option.key}>
                    <Span size='xs'>{option.children}</Span>
                  </ListItem>
                ))}
              </List>
            </Flex>
            <Flex direction='column' gap='xs'>
              <Span color='grey-50' id={typeLabelId} size='xs'>
                <Trans>Type</Trans>:
              </Span>
              <List
                aria-labelledby={typeLabelId}
                selectedKeys={state.type ? [state.type] : undefined}
                selectionMode='single'
                onSelectionChange={(key) => {
                  const [selectedKey] = [...key];

                  setState((s) => ({ ...s, type: selectedKey as ProfileActivityTypeFilterOption }));
                }}
              >
                {typeFilterOptions.map((option) => (
                  <ListItem key={option.key} textValue={option.key}>
                    <Span size='xs'>{option.children}</Span>
                  </ListItem>
                ))}
              </List>
            </Flex>
          </Flex>
          <Flex gap='md' justifyContent='flex-end' paddingBottom='lg' paddingX='xl'>
            <Button size='s' variant='ghost' onPress={handleClear}>
              <Trans>Clear</Trans>
            </Button>
            <Button color='primary' size='s' onPress={handleApply}>
              <Trans>Apply</Trans>
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { ProfileActivityFilters, ProfileActivityStatusFilterOption, ProfileActivityTypeFilterOption };
export type { ProfileActivityFiltersData };
