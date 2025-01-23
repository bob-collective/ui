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

import { SharedStoreProfileTxStatus, SharedStoreProfileTxType } from '@/lib/store';

const statusFilterOptions = [
  { children: <Trans>Any Status</Trans>, key: SharedStoreProfileTxStatus.ANY_STATUS },
  { children: <Trans>Pending</Trans>, key: SharedStoreProfileTxStatus.PENDING },
  { children: <Trans>Needed Action</Trans>, key: SharedStoreProfileTxStatus.NEEDED_ACTION },
  { children: <Trans>Complete</Trans>, key: SharedStoreProfileTxStatus.COMPLETE },
  { children: <Trans>Failed</Trans>, key: SharedStoreProfileTxStatus.FAILED }
];

const typeFilterOptions = [
  { children: <Trans>Any Transaction</Trans>, key: SharedStoreProfileTxType.ALL_TRANSACTIONS },
  { children: <Trans>Native Bridge</Trans>, key: SharedStoreProfileTxType.NATIVE_BRIDGE },
  { children: <Trans>BTC Bridge</Trans>, key: SharedStoreProfileTxType.BTC_BRIDGE },
  { children: <Trans>Staking</Trans>, key: SharedStoreProfileTxType.STRATEGIES }
];

type ProfileActivityFiltersData = { type?: SharedStoreProfileTxType; status?: SharedStoreProfileTxStatus };

type ProfileActivityFiltersProps = {
  isFiltering: boolean;
  value: ProfileActivityFiltersData;
  onSelectionChange: (filters: ProfileActivityFiltersData) => void;
};

const ProfileActivityFilters = ({
  isFiltering,
  value,
  onSelectionChange
}: ProfileActivityFiltersProps): JSX.Element => {
  const statusLabelId = useId();
  const typeLabelId = useId();

  const [state, setState] = useState<ProfileActivityFiltersData>(value);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setState(value);
  }, [value]);

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
      status: undefined,
      type: undefined
    };

    setState(clearState);

    onSelectionChange(clearState);
    setOpen(false);
  };

  const statusLabel = statusFilterOptions.find(
    (item) => item.key === (value.status || SharedStoreProfileTxStatus.ANY_STATUS)
  )?.children;
  const typeLabel = typeFilterOptions.find(
    (item) => item.key === (value.type || SharedStoreProfileTxType.ALL_TRANSACTIONS)
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
                selectedKeys={state.status ? [state.status] : [SharedStoreProfileTxStatus.ANY_STATUS]}
                selectionMode='single'
                onSelectionChange={(key) => {
                  const [selectedKey] = [...key];

                  setState((s) => ({
                    ...s,
                    status:
                      selectedKey === SharedStoreProfileTxStatus.ANY_STATUS
                        ? undefined
                        : (selectedKey as SharedStoreProfileTxStatus)
                  }));
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
                selectedKeys={state.type ? [state.type] : [SharedStoreProfileTxType.ALL_TRANSACTIONS]}
                selectionMode='single'
                onSelectionChange={(key) => {
                  const [selectedKey] = [...key];

                  setState((s) => ({
                    ...s,
                    type:
                      selectedKey === SharedStoreProfileTxType.ALL_TRANSACTIONS
                        ? undefined
                        : (selectedKey as SharedStoreProfileTxType)
                  }));
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

export { ProfileActivityFilters };
export type { ProfileActivityFiltersData };
