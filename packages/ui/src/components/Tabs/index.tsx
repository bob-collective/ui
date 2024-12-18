import { Item } from '@react-stately/collections';
import { ItemProps } from '@react-types/shared';

import { TabsItemProps } from './Tab';

const TabsItem = Item as <T>(props: ItemProps<T> & TabsItemProps) => JSX.Element;

export { Tabs } from './Tabs';
export type { TabsProps } from './Tabs';
export { TabsItem };
export type { TabsItemProps };
