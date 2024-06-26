import { AriaPopoverProps, DismissButton, usePopover } from '@react-aria/overlays';
import { OverlayTriggerState } from '@react-stately/overlays';
import { DOMProps } from '@react-types/shared';
import { forwardRef, HTMLAttributes, RefObject } from 'react';

import { Dialog } from '../Dialog';
import { Underlay } from '../Overlay';

import { StyledPopover } from './Popover.style';

type Props = {
  state: OverlayTriggerState;
  wrapperRef: RefObject<HTMLDivElement>;
  isOpen?: boolean;
  dialogProps?: DOMProps;
  popoverProps?: Partial<AriaPopoverProps>;
};

type InheritAttrs = Omit<AriaPopoverProps, keyof Props | 'popoverRef'>;

type NativeAttrs = Omit<HTMLAttributes<unknown>, keyof Props & InheritAttrs>;

type PopoverContentWrapperProps = Props & InheritAttrs & NativeAttrs;

const PopoverContentWrapper = forwardRef<HTMLDivElement, PopoverContentWrapperProps>(
  (props, ref): JSX.Element | null => {
    const {
      children,
      wrapperRef,
      state,
      isOpen,
      className,
      style,
      isNonModal,
      dialogProps,
      popoverProps: popoverPropsProp
    } = props;

    const { popoverProps, underlayProps, placement } = usePopover(
      {
        ...props,
        popoverRef: ref as RefObject<HTMLDivElement>,
        ...popoverPropsProp
      },
      state
    );

    return (
      <div ref={wrapperRef}>
        {!isNonModal && <Underlay isTransparent {...underlayProps} isOpen={isOpen} />}
        <StyledPopover
          {...popoverProps}
          ref={ref}
          $isOpen={state.isOpen}
          $placement={placement}
          className={className}
          data-testid='popover'
          role='presentation'
          style={{ ...style, ...popoverProps.style }}
        >
          {!isNonModal && <DismissButton onDismiss={state.close} />}
          <Dialog size='s' {...dialogProps}>
            {children}
          </Dialog>
          <DismissButton onDismiss={state.close} />
        </StyledPopover>
      </div>
    );
  }
);

PopoverContentWrapper.displayName = 'PopoverContentWrapper';

export { PopoverContentWrapper };
