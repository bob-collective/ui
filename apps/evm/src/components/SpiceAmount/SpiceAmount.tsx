import { Flex, FlexProps, Span, SpanProps, useLocale } from '@gobob/ui';
import { Spice } from '@gobob/icons';

type Props = {
  amount: number;
  compact?: boolean;
  hideIcon?: boolean;
  gap?: FlexProps['gap'];
};

type InheritAttrs = Omit<SpanProps, keyof Props>;

type SpiceAmountProps = Props & InheritAttrs;

const SpiceAmount = ({ amount, compact, hideIcon, gap = 'xs', ...props }: SpiceAmountProps) => {
  const { locale } = useLocale();

  return (
    <Flex alignItems='center' elementType={Span} gap={gap} {...props}>
      {!hideIcon && <Spice style={{ width: '1em', height: '1em' }} />}
      {Intl.NumberFormat(locale, { notation: compact ? 'compact' : undefined, maximumFractionDigits: 0 }).format(
        amount
      )}
    </Flex>
  );
};

export { SpiceAmount };
