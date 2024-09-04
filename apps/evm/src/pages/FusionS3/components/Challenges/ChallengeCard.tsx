import { Avatar, Button, Card, CardProps, Chip, Link, P } from '@gobob/ui';

import { StyledAvatarWrapper } from './Challenges.style';

type Props = {
  href: string;
  description: string;
  prize: string;
};

type InheritAttrs = Omit<CardProps, keyof Props>;

type UserInfoCardProps = Props & InheritAttrs;

const UserInfoCard = ({ description, href, prize, ...props }: UserInfoCardProps) => (
  <Card gap='md' {...props}>
    <StyledAvatarWrapper>
      <Avatar size='11xl' src='123' />
      <Chip>...</Chip>
    </StyledAvatarWrapper>
    <P>{description}</P>
    <Button asChild variant='outline'>
      <Link external href={href}>
        View Challenge
      </Link>
    </Button>
  </Card>
);

export { UserInfoCard };
