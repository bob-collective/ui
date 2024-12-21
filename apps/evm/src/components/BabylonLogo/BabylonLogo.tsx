import { Avatar, AvatarProps } from '@gobob/ui';

type BabylonLogoProps = Omit<AvatarProps, 'src'>;

const BabylonLogo = (props: BabylonLogoProps) => (
  <Avatar {...props} alt='babylon logo' src='https://avatars.githubusercontent.com/u/106378782?s=200&v=4' />
);

export { BabylonLogo };
