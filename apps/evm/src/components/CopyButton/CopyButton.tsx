'use client';

import { Button, ButtonProps, Check, CopyClipboard, Flex, IconProps, Tooltip } from '@gobob/ui';
import { Trans } from '@lingui/macro';
import { mergeProps } from '@react-aria/utils';
import { useCopyToClipboard } from 'usehooks-ts';

import { useIntervalTooltip } from '@/hooks';

type Props = {
  value: string;
  iconProps?: IconProps;
};
type InheritAttrs = Omit<ButtonProps, keyof Props | 'children'>;

type CopyButtonProps = Props & InheritAttrs;

const CopyButton = ({ value, iconProps, ...props }: CopyButtonProps) => {
  const [, copy] = useCopyToClipboard();
  const { buttonProps, tooltipProps } = useIntervalTooltip();

  const handleCopy = () => copy(value || '');

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
      <Button {...mergeProps({ onPress: handleCopy }, buttonProps)} {...props}>
        <CopyClipboard {...iconProps} />
      </Button>
    </Tooltip>
  );
};

export { CopyButton };
