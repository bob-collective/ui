import { useState } from 'react';
import { useInterval } from 'usehooks-ts';

type UseIntervalTooltipProps = {
  delay?: number;
};

const useIntervalTooltip = ({ delay = 1000 }: UseIntervalTooltipProps = {}) => {
  const [isOpen, setOpen] = useState(false);

  useInterval(
    () => {
      // Your custom logic here
      setOpen(false);
    },
    // Delay in milliseconds or null to stop it
    isOpen ? delay : null
  );

  return {
    buttonProps: { onPress: () => setOpen(true) },
    tooltipProps: {
      isOpen
    }
  };
};

export { useIntervalTooltip };
