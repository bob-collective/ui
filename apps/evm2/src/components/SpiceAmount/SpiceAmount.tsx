'use client';

import { Flex, FlexProps, Span, SpanProps, useLocale } from '@gobob/ui';
import { Spice } from '@gobob/icons';
import { useCountUp } from 'use-count-up';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  amount: number;
  compact?: boolean;
  hideIcon?: boolean;
  gap?: FlexProps['gap'];
  showAnimation?: boolean;
};

type InheritAttrs = Omit<SpanProps, keyof Props>;

type SpiceAmountProps = Props & InheritAttrs;

const SpiceAmount = ({ amount, compact, hideIcon, gap = 'xs', showAnimation, ...props }: SpiceAmountProps) => {
  const [start, setStart] = useState(0);
  const { locale } = useLocale();

  const formatter = useCallback(
    (value: number) =>
      Intl.NumberFormat(locale, { notation: compact ? 'compact' : undefined, maximumFractionDigits: 0 }).format(value),
    [compact, locale]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, showAnimation]);

  return (
    <Flex alignItems='center' elementType={Span} gap={gap} {...props}>
      {!hideIcon && <Spice style={{ width: '1em', height: '1em' }} />}
      {showAnimation ? value : formatter(amount)}
    </Flex>
  );
};

export { SpiceAmount };
