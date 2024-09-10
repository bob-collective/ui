import { Spice } from '@gobob/icons';
import { Avatar, Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Span, useLocale } from '@gobob/ui';

import { AppData } from '../../../Apps/hooks';

type Props = {
  apps: AppData[] | undefined;
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAppsModalProps = Props & InheritAttrs;

const UserAppsModal = ({ apps, ...props }: UserAppsModalProps): JSX.Element => {
  const { locale } = useLocale();

  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Your Active Spice Harvesting Apps
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          Below are the apps you’re currently using to harvest Spice. Keep using these to maximize your earnings!
        </P>
        <List direction='column' gap='md'>
          {apps
            ?.filter((app) => app.userHarvest)
            .map((app) => (
              <ListItem key={app.ref_code} alignItems='center' flex={1} justifyContent='space-between'>
                <Flex flex={1} gap='lg'>
                  <Avatar rounded='md' size='6xl' src={app.logoSrc} />
                  <Flex
                    alignItems={{ base: 'flex-start', s: 'center' }}
                    direction={{ base: 'column', s: 'row' }}
                    flex={1}
                    justifyContent='space-between'
                  >
                    <Span>{app.name}</Span>
                    <Flex alignItems='center' gap='s'>
                      <Spice size={{ base: 's', s: 'md' }} />
                      <Span color='grey-50' size='s'>
                        {app.multiplier} (+
                        {Intl.NumberFormat(locale, { notation: 'compact' }).format(Number(app.userHarvest) || 0)})
                      </Span>
                    </Flex>
                  </Flex>
                </Flex>
              </ListItem>
            ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAppsModal };
