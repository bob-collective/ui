import { Galxe, Intract } from '@gobob/icons';
import { Icon, IconProps } from '@gobob/ui';

type QuestOwner = 'galxe' | 'intract';

const icons: Record<QuestOwner, typeof Icon> = {
  galxe: Galxe,
  intract: Intract
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
