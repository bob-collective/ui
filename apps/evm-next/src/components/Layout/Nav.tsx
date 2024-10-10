import { Flex, FlexProps } from '@gobob/ui';

type NavProps = FlexProps;

const Nav = ({ gap = 'xl', ...props }: NavProps): JSX.Element => {
  return <Flex {...props} elementType='ul' gap={gap} />;
};

export { Nav };
