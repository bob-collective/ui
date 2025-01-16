'use client';

import { Flex, FlexProps, Span, SpanProps, useLocale } from '@gobob/ui';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useCountUp } from 'use-count-up';

type Props = {
  amount: number;
  compact?: boolean;
  icon?: ReactNode;
  hideIcon?: boolean;
  gap?: FlexProps['gap'];
  showAnimation?: boolean;
  shouldRoundDown?: boolean;
  maximumFractionDigits?: number;
};

type InheritAttrs = Omit<SpanProps, keyof Props>;

type AnimantedAmountProps = Props & InheritAttrs;

const AnimantedAmount = ({
  amount,
  compact,
  icon,
  hideIcon,
  gap = 'xs',
  showAnimation,
  shouldRoundDown,
  maximumFractionDigits = 0,
  ...props
}: AnimantedAmountProps) => {
  const [start, setStart] = useState(0);
  const { locale } = useLocale();

  const formatter = useCallback(
    (value: number) =>
      Intl.NumberFormat(locale, {
        notation: compact ? 'compact' : undefined,
        roundingMode: shouldRoundDown ? 'floor' : undefined,
        maximumFractionDigits
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any).format(value),
    [compact, shouldRoundDown, maximumFractionDigits, locale]
  );

  const { value, reset } = useCountUp({
    isCounting: showAnimation,
    start,
    end: amount,
    formatter,
    onComplete: () => setStart(amount)
  });

  useEffect(() => {
    if (showAnimation) {
      reset();
    }
  }, [amount, reset, showAnimation]);

  return (
    <Flex alignItems='center' elementType={Span} gap={gap} {...props}>
      {!hideIcon && icon}
      {showAnimation ? value : formatter(amount)}
    </Flex>
  );
};

export { AnimantedAmount };
export type { AnimantedAmountProps };
