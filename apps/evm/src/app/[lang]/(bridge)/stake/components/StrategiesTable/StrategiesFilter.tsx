import { Card, Item, Select, Tabs, TabsItem, useMediaQuery } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { useTheme } from 'styled-components';

enum StrategiesFilterOption {
  AllStrategies = 'all-strategies',
  MyDeposits = 'my-deposits'
}

type StrategiesFilterProps = {
  value: StrategiesFilterOption;
  onSelectionChange: (filter: StrategiesFilterOption) => void;
};

const StrategiesFilter = ({ value, onSelectionChange }: StrategiesFilterProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('s'));

  return (
    <Card padding='xs'>
      {isMobile ? (
        <Select
          modalProps={{ title: <Trans>Select Filter</Trans> }}
          type='modal'
          value={value}
          onSelectionChange={(key) => onSelectionChange(key as StrategiesFilterOption)}
        >
          <Item key={StrategiesFilterOption.AllStrategies} textValue={StrategiesFilterOption.AllStrategies}>
            <Trans>All Strategies</Trans>
          </Item>
          <Item key={StrategiesFilterOption.MyDeposits} textValue={StrategiesFilterOption.MyDeposits}>
            <Trans>My Deposits</Trans>
          </Item>
        </Select>
      ) : (
        <Tabs
          selectedKey={value}
          size='s'
          variant='solid'
          onSelectionChange={(key) => onSelectionChange(key as StrategiesFilterOption)}
        >
          <TabsItem key={StrategiesFilterOption.AllStrategies} title={<Trans>All Strategies</Trans>}>
            <></>
          </TabsItem>
          <TabsItem key={StrategiesFilterOption.MyDeposits} title={<Trans>My Deposits</Trans>}>
            <></>
          </TabsItem>
        </Tabs>
      )}
    </Card>
  );
};

export { StrategiesFilter, StrategiesFilterOption };
