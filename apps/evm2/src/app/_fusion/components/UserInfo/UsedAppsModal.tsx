import { Avatar, Flex, List, ListItem, Modal, ModalBody, ModalHeader, ModalProps, P, Span } from '@gobob/ui';

import { AppData } from '../../../_apps/hooks';
import { SpiceAmount } from '../../../../components';

type Props = {
  apps: AppData[];
};

type InheritAttrs = Omit<ModalProps, keyof Props | 'children'>;

type UserAppsModalProps = Props & InheritAttrs;

const UserAppsModal = ({ apps, ...props }: UserAppsModalProps): JSX.Element => {
  return (
    <Modal {...props} size='lg'>
      <ModalHeader showDivider align='start'>
        Spice Earned Across Apps
      </ModalHeader>
      <ModalBody gap='2xl' padding='even'>
        <P color='grey-50'>
          Below is the Spice you&apos;ve harvested from apps. Keep participating to increase your future harvest!
        </P>
        <List direction='column' gap='md'>
          {apps.map((app) => (
            <ListItem key={app.ref_code} alignItems='center' flex={1} justifyContent='space-between'>
              <Flex alignItems='center' flex={1} gap='lg' justifyContent='space-between'>
                <Flex alignItems='center' gap='lg'>
                  <Avatar rounded='md' size='6xl' src={app.logoSrc} />
                  <Span>{app.name}</Span>
                </Flex>
                <SpiceAmount compact amount={Number(app.userHarvest) || 0} />
              </Flex>
            </ListItem>
          ))}
        </List>
      </ModalBody>
    </Modal>
  );
};

export { UserAppsModal };
