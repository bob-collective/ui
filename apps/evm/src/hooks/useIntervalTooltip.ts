import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

type UseIntervalTooltipProps = {
  delay?: number;
};

const useIntervalTooltip = ({ delay = 1000 }: UseIntervalTooltipProps = {}) => {
  const [isOpen, setOpen] = useState(false);

  useInterval(() => setOpen(false), isOpen ? delay : null);

  return {
    buttonProps: { onPress: () => setOpen(true) },
    tooltipProps: {
      isOpen
    }
  };
};

export { useIntervalTooltip };
