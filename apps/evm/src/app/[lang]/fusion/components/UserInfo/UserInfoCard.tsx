import { Card, CardProps, Dd, Dt, Flex, SolidInformationCircle, Tooltip } from '@gobob/ui';
import { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  tooltipLabel?: ReactNode;
  description?: ReactNode;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type UserInfoCardProps = Props & InheritAttrs;

const UserInfoCard = ({ description, title, tooltipLabel, children, ...props }: UserInfoCardProps) => (
  <Card flex={1} gap='md' justifyContent='space-between' style={{ position: 'relative' }} {...props}>
    <Flex direction='column' gap='md' style={{ zIndex: 1 }}>
      <Flex alignItems='center' gap='s'>
        <Dt>{title}</Dt>
        {tooltipLabel && (
          <Tooltip label={tooltipLabel}>
            <SolidInformationCircle color='grey-50' size='s' />
          </Tooltip>
        )}
      </Flex>
      <Dd size='3xl'>{description}</Dd>
    </Flex>
    {children}
  </Card>
);

export { UserInfoCard };
