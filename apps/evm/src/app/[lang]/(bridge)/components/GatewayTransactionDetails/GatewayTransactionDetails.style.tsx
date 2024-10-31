import { DlGroup, Dt } from '@gobob/ui';
import styled from 'styled-components';

type StyledDtProps = {
  $hasExtendedHeight?: boolean;
};

// This custom padding helps to keep harmony between normal elements and elements with small select
const StyledDlGroup = styled(DlGroup)`
  line-height: 20px;
`;

const StyledDt = styled(Dt)<StyledDtProps>`
  line-height: ${({ $hasExtendedHeight = true }) => $hasExtendedHeight && '1.875rem'};
`;

export { StyledDlGroup, StyledDt };
