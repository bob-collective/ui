import { useTheme } from 'styled-components';
import { ReactNode } from 'react';

import { Flex } from '../Flex';
import { Button } from '../Button';
import { XMark } from '../../icons';
import { useMediaQuery } from '../../hooks';
import { DrawerProps } from '../Drawer';

import { useLayoutContext } from './LayoutContext';
import { StyledDrawer } from './Layout.style';

type Props = { logo: ReactNode; children?: ReactNode };

type InheritAttrs = Omit<DrawerProps, keyof Props | 'onClose' | 'isOpen'>;

type SidebarProps = Props & InheritAttrs;

const Sidebar = ({ logo, children, ...props }: SidebarProps): JSX.Element | null => {
  const { isSidebarOpen, setSidebarOpen } = useLayoutContext();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  if (isMobile) {
    const handleClose = () => setSidebarOpen(false);

    return (
      <StyledDrawer {...props} elementType='nav' isOpen={isSidebarOpen} onClose={handleClose}>
        <Flex direction='column' flex={1} gap='4xl' padding='2xl'>
          <Flex alignItems='center' justifyContent='space-between'>
            {logo}
            <Button isIconOnly variant='ghost' onPress={handleClose}>
              <XMark size='s' />
            </Button>
          </Flex>
          <Flex flex={1}>{children}</Flex>
        </Flex>
      </StyledDrawer>
    );
  }

  return null;
};

export { Sidebar };
export type { SidebarProps };
