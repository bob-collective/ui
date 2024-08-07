import { mergeProps } from '@react-aria/utils';
import { ElementType } from 'react';

import { TextProps } from '../Text';

import { StyledDialogHeader, StyledDivider } from './Dialog.style';
import { useDialogContext } from './DialogContext';

type Props = {
  elementType?: ElementType;
  showDivider?: boolean;
};

type InheritAttrs = Omit<TextProps, keyof Props>;

type DialogHeaderProps = Props & InheritAttrs;

const DialogHeader = ({
  elementType,
  children,
  align = 'start',
  showDivider = true,
  ...props
}: DialogHeaderProps): JSX.Element => {
  const { titleProps } = useDialogContext();

  return (
    <>
      <StyledDialogHeader align={align} as={elementType} size='xl' {...mergeProps(titleProps || {}, props)}>
        {children}
      </StyledDialogHeader>
      {showDivider && <StyledDivider />}
    </>
  );
};

export { DialogHeader };
export type { DialogHeaderProps };
