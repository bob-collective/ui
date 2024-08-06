import styled, { css } from 'styled-components';

import { visuallyHidden } from '../utils/visually-hidden';

type StyledHelperTextProps = {
  $hasError?: boolean;
  $isHidden?: boolean;
};

const StyledHelperText = styled.div<StyledHelperTextProps>`
  ${({ theme, $hasError, $isHidden }) => css`
    ${theme.label.base}
    ${$hasError && theme.label.error.base}
    
    ${theme.typography('xs')}
    ${$isHidden && visuallyHidden()}

    font-weight: ${theme.fontWeight('medium')};
    padding: ${theme.spacing('xs')} 0;
  `}
`;

const StyledSubHelperText = styled.p`
  line-height: ${({ theme }) => theme.lineHeight('s')};
`;

export { StyledHelperText, StyledSubHelperText };
