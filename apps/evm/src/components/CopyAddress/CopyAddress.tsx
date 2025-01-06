'use client';

import { Check, CopyClipboard, Flex, Span, SpanProps, Tooltip, UnstyledButton } from '@gobob/ui';
import { useCopyToClipboard } from 'usehooks-ts';
import { mergeProps } from '@react-aria/utils';
import { Trans } from '@lingui/macro';
import { useHover } from '@react-aria/interactions';

import { useIntervalTooltip } from '@/hooks';

type Props = {
  address: string;
  truncatedAddress?: string;
  hideIcon?: boolean;
  iconVisibility?: 'hide' | 'always' | 'hover';
};
type InheritAttrs = Omit<SpanProps, keyof Props>;

type CopyAddressProps = Props & InheritAttrs;

const CopyAddress = ({ truncatedAddress, address, iconVisibility = 'always', ...props }: CopyAddressProps) => {
  const [, copy] = useCopyToClipboard();
  const { buttonProps, tooltipProps } = useIntervalTooltip();

  const { isHovered, hoverProps } = useHover({ isDisabled: iconVisibility !== 'hover' });

  const handleCopy = () => copy(address || '');

  const showIcon = isHovered || iconVisibility === 'always';

  return (
    <Tooltip
      {...tooltipProps}
      label={
        <Flex alignItems='center' elementType='span' gap='s'>
          <Check color='green-500' size='xs' />
          <Trans>Copied</Trans>
        </Flex>
      }
    >
      <UnstyledButton
        style={{ display: 'flex', justifyContent: 'center', paddingRight: '1.25rem' }}
        {...mergeProps({ onPress: handleCopy }, buttonProps, hoverProps)}
      >
        <Flex alignItems='center' elementType='span' gap='xs' style={{ position: 'relative' }}>
          <Span {...props}>{truncatedAddress || address}</Span>
          {showIcon && (
            <Span
              size={props.size}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                ...(iconVisibility === 'hover'
                  ? {
                      position: iconVisibility === 'hover' ? 'absolute' : undefined,
                      right: 0,
                      transform: 'translateX(calc(100% + 4px))'
                    }
                  : undefined)
              }}
            >
              <CopyClipboard color={props.color} style={{ width: '1em', height: '1em' }} />
            </Span>
          )}
        </Flex>
      </UnstyledButton>
    </Tooltip>
  );
};

export { CopyAddress };
