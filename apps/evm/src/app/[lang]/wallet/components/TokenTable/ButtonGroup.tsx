import { ArrowUp, ArrowDown, ArrowsUpDown, EllipsisVertical } from '@gobob/ui';
import { Button, Flex, Popover, PopoverBody, PopoverContent, PopoverTrigger, Tooltip } from '@gobob/ui';
import { useTheme } from 'styled-components';
import { useMediaQuery } from '@gobob/ui';
import { ReactNode, useState } from 'react';
import { chain } from '@react-aria/utils';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/macro';

import { ButtonGroupMobile } from './ButtonGroupMobile';

type ButtonProps = {
  ticker: string;
  connectLabel?: ReactNode;
  showOnlyConnect?: boolean;
  onPressConnect?: () => void;
  onPressBridge?: () => void;
  onPressSend: () => void;
  onPressReceive: () => void;
};

const ButtonGroup = ({
  ticker,
  onPressBridge,
  onPressReceive,
  onPressSend,
  onPressConnect,
  showOnlyConnect,
  connectLabel
}: ButtonProps) => {
  const [isOpen, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { i18n } = useLingui();

  if (isMobile) {
    return (
      <Popover isOpen={isOpen} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button size='s' variant='ghost'>
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            {showOnlyConnect ? (
              <Button color='primary' size='s' onPress={onPressConnect}>
                {connectLabel}
              </Button>
            ) : (
              <ButtonGroupMobile
                onPressBridge={chain(onPressBridge, () => setOpen(false))}
                onPressReceive={chain(onPressReceive, () => setOpen(false))}
                onPressSend={chain(onPressSend, () => setOpen(false))}
              />
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }

  if (showOnlyConnect) {
    return (
      <Button color='primary' size='s' onPress={onPressConnect}>
        {connectLabel}
      </Button>
    );
  }

  return (
    <Flex gap='s' justifyContent='flex-end'>
      {onPressBridge && (
        <Tooltip delay={300} label={t(i18n)`Bridge`}>
          <Button
            isIconOnly
            aria-label={t(i18n)`Navigate to bridge page`}
            size='s'
            variant='outline'
            onPress={onPressBridge}
          >
            <ArrowsUpDown size='xs' strokeWidth={2} />
          </Button>
        </Tooltip>
      )}
      <Tooltip delay={300} label={t(i18n)`Send`}>
        <Button isIconOnly aria-label={t(i18n)`Send ${ticker}`} size='s' variant='outline' onPress={onPressSend}>
          <ArrowUp size='xs' strokeWidth={2} />
        </Button>
      </Tooltip>
      <Tooltip delay={300} label={t(i18n)`Receive`}>
        <Button isIconOnly aria-label={t(i18n)`Receive ${ticker}`} size='s' variant='outline' onPress={onPressReceive}>
          <ArrowDown size='xs' strokeWidth={2} />
        </Button>
      </Tooltip>
      {/* <Button size='s' variant='outline'>
        Buy
      </Button> */}
    </Flex>
  );
};

export { ButtonGroup };
