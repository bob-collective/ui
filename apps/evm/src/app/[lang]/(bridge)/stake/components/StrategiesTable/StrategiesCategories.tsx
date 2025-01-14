import { Card, Item, Select } from '@gobob/ui';
import { Trans } from '@lingui/macro';

const getCategoryLabel = (type: 'bridge' | 'dex' | 'staking' | 'lending' | string) => {
  switch (type) {
    case 'bridge':
      return <Trans>Bridge</Trans>;
    case 'staking':
      return <Trans>Staking</Trans>;
    case 'dex':
      return 'DEX';
    case 'lending':
      return <Trans>Lending</Trans>;
    default:
      return type;
  }
};

type StrategiesCategoriesProps = {
  value?: string;
  categories: string[];
  onSelectionChange: (category?: string) => void;
};

const AllCategory = 'all';

const StrategiesCategories = ({ value = AllCategory, categories, onSelectionChange }: StrategiesCategoriesProps) => (
  <Card alignSelf='self-start' padding='xs'>
    <Select
      modalProps={{ title: <Trans>Select Category</Trans> }}
      type='modal'
      value={value}
      onSelectionChange={(key) => onSelectionChange(key.toString() === AllCategory ? undefined : key.toString())}
    >
      <Item key={AllCategory} textValue={AllCategory}>
        <Trans>All Categories</Trans>
      </Item>
      {
        Array.from(categories, (category) => (
          <Item key={category} textValue={category}>
            {getCategoryLabel(category)}
          </Item>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any
      }
    </Select>
  </Card>
);

export { StrategiesCategories };
