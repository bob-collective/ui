import { Dd, Dt, Flex } from '@gobob/ui';
import styled, { css } from 'styled-components';

type StyledReferralCodeProps = {
  $isHidden: boolean;
};

const StyledReferralCode = styled(Dd)<StyledReferralCodeProps>`
  ${({ $isHidden }) =>
    $isHidden &&
    css`
      color: transparent;
      text-shadow: 0 0 6px rgba(255, 255, 255, 0.9);
      user-select: none;
    `}
`;

const StyledDt = styled(Dt)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-height: ${({ theme }) => theme.typography('s').lineHeight};
`;

const StyledTooltipWrapper = styled(Flex)`
  margin-left: ${({ theme }) => theme.spacing('md')};
`;

export { StyledReferralCode, StyledDt, StyledTooltipWrapper };
