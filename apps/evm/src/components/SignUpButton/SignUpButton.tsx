import { Button, ButtonProps } from '@gobob/ui';
import { mergeProps } from '@react-aria/utils';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoutesPath } from '../../constants';

type Props = { redirect?: string };

type InheritAttrs = Omit<ButtonProps, keyof Props>;

type SignUpButtonProps = Props & InheritAttrs;

const SignUpButton = ({ children, redirect, ...props }: SignUpButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePress = () =>
    navigate(RoutesPath.SIGN_UP, { state: { redirect: redirect || `${location.pathname}${location.search}` } });

  return (
    <Button
      {...mergeProps(props, {
        onPress: handlePress
      })}
    >
      {children || 'Create account'}
    </Button>
  );
};

export { SignUpButton };
