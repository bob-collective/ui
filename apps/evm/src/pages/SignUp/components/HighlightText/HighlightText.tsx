import { TextProps } from '@gobob/ui';
import { CSSProperties } from 'styled-components';

import { StyledHighlight } from './HighlightText.style';

type Props = { display?: CSSProperties['display'] };

type HighlightTextProps = Props & Omit<TextProps, keyof Props>;

const HighlightText = ({ display, ...props }: HighlightTextProps): JSX.Element => (
  <StyledHighlight $display={display} {...props} />
);

export { HighlightText };
