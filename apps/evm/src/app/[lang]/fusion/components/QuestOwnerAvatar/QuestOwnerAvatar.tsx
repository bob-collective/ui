import { Galxe, Intract, Layer3 } from '@gobob/icons';
import { Icon, IconProps } from '@gobob/ui';

type QuestOwner = 'galxe' | 'intract' | 'layer3';

const icons: Record<QuestOwner, typeof Icon> = {
  galxe: Galxe,
  intract: Intract,
  layer3: Layer3
};

type Props = {
  name: QuestOwner;
};

type InheritAttrs = Omit<IconProps, keyof Props>;

type QuestOwnerIconProps = Props & InheritAttrs;

const QuestOwnerIcon = ({ name, ...props }: QuestOwnerIconProps): JSX.Element => {
  const Component = icons[name];

  return <Component {...props} />;
};

export { QuestOwnerIcon };
export type { QuestOwner };
