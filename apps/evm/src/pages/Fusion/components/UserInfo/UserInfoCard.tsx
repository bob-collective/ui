import { CardProps, Dd, Dt, Flex, SolidInformationCircle, Tooltip } from '@gobob/ui';
import { ReactNode } from 'react';

import { StyledCard } from './UserInfo.style';

type Props = {
  title?: ReactNode;
  tooltipLabel?: ReactNode;
  description?: ReactNode;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type UserInfoCardProps = Props & InheritAttrs;

const UserInfoCard = ({ description, title, tooltipLabel, children, ...props }: UserInfoCardProps) => (
  <StyledCard flex={1} gap='md' justifyContent='space-between' {...props}>
    <Flex direction='column' gap='md'>
      <Flex alignItems='center' gap='s'>
        <Dt>{title}</Dt>
        {tooltipLabel && (
          <Tooltip label={tooltipLabel}>
            <SolidInformationCircle size='s' />
          </Tooltip>
        )}
      </Flex>
      <Dd size='3xl'>{description}</Dd>
    </Flex>
    {children}
  </StyledCard>
);

export { UserInfoCard };