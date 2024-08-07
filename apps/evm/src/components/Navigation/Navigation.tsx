import { ConnectWallet } from '@gobob/connect-ui';
import {
  Button,
  EllipsisHorizontal,
  Flex,
  FlexProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useMediaQuery
} from '@gobob/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { DocsLinks, RoutesPath } from '../../constants';
import { SocialsGroup } from '../SocialsGroup';

import { Nav } from './Nav';
import { NavItem } from './NavItem';

type Props = {};

type InheritAttrs = Omit<FlexProps, keyof Props | 'children'>;

type NavigationProps = Props & InheritAttrs;

const Navigation = (props: NavigationProps): JSX.Element => {
  const [isOpen, setOpen] = useState(false);

  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Flex alignItems='center' elementType='header' gap='xl' justifyContent='flex-end' {...props}>
      {!isMobile && (
        <>
          <Nav>
            <NavItem size='s' to={RoutesPath.BRIDGE}>
              {t('navigation.bridge')}
            </NavItem>
            <NavItem size='s' to={RoutesPath.WALLET}>
              {t('navigation.wallet')}
            </NavItem>
            <NavItem size='s' to={RoutesPath.FUSION}>
              {t('navigation.fusion')}
            </NavItem>
          </Nav>
          <Popover crossOffset={-50} isOpen={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger>
              <Button isIconOnly aria-label='Show secondary navigation' size='s' variant='ghost'>
                <EllipsisHorizontal color='light' size='s' />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody onClick={() => setOpen(false)}>
                <Nav direction='column'>
                  <NavItem
                    isExternal
                    size='s'
                    to='https://cdn.prod.website-files.com/6620e8932695794632789d89/668eaca0c8c67436ee679ca0_GoBob%20-%20Terms%20of%20Service%20(LW%20draft%207-9)(149414568.5).pdf'
                  >
                    {t('navigation.t_and_c')}
                  </NavItem>
                  <NavItem isExternal size='s' to={DocsLinks.HOME}>
                    {t('navigation.dev')}
                  </NavItem>
                  <NavItem isExternal size='s' to='https://gobob.xyz/'>
                    {t('navigation.about')}
                  </NavItem>
                  <NavItem isExternal size='s' to='https://safe.gobob.xyz/welcome'>
                    {t('navigation.multisig')}
                  </NavItem>
                </Nav>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <SocialsGroup variant='ghost' />
        </>
      )}
      <ConnectWallet variant='ghost' />
    </Flex>
  );
};

export { Navigation };
