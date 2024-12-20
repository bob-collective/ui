import styled, { css } from 'styled-components';

import { DialogSize, Spacing } from '../../theme';
import { Flex, FlexProps } from '../Flex';
import { H3 } from '../Text';
import { Button } from '../Button';
import { Divider } from '../Divider';

type StyledDialogProps = {
  $size: DialogSize;
};

type StyledDialogBodyProps = {
  $maxHeight?: Spacing;
  $padding?: FlexProps['padding'] | 'even' | 'uneven' | 'none';
};

const StyledDialog = styled.section<StyledDialogProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  outline: none;
  overflow: hidden;

  width: 100%;
  ${({ theme, $size }) => css`
    ${theme.dialog.base}
    ${theme.dialog.size[$size]}
  `}
`;

const StyledCloseBtn = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing('md')};
  right: ${({ theme }) => theme.spacing('md')};
  z-index: 100;
`;

const StyledDialogHeader = styled(H3)`
  ${({ theme }) => theme.dialog.header};

  overflow: hidden;
  flex-shrink: 0;
`;

const StyledDialogBody = styled(Flex)<StyledDialogBodyProps>`
  ${({ theme, $padding }) =>
    ($padding !== 'none' && theme.dialog.body[$padding as 'even']) ||
    css`
      padding: ${theme.spacing($padding as Spacing)};
    `};
  max-height: ${({ theme, $maxHeight }) => $maxHeight && theme.spacing($maxHeight)};

  flex: 1 1 auto;
`;

const StyledDialogFooter = styled(Flex)`
  ${({ theme }) => theme.dialog.footer};
`;

const StyledDivider = styled(Divider)`
  ${({ theme }) => theme.dialog.divider};
`;

export { StyledCloseBtn, StyledDialog, StyledDialogBody, StyledDialogFooter, StyledDialogHeader, StyledDivider };
