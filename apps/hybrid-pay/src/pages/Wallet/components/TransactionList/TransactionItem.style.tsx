import styled from 'styled-components';

type StyledAvatarWrapperProps = {
  $type: 'receive' | 'send';
};

const StyledAvatarWrapper = styled.div<StyledAvatarWrapperProps>`
  position: relative;
`;

const StyledAvatarAdornment = styled.div<StyledAvatarWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${({ $type, theme }) => ($type === 'send' ? theme.color('red-500') : theme.color('green-500'))};
  width: ${({ theme }) => theme.spacing('2xl')};
  height: ${({ theme }) => theme.spacing('2xl')};
  line-height: 0px;
  font-weight: 700;
  right: 0;
  bottom: 0;
  transform: translateX(25%);
  border: 2px solid ${({ theme }) => theme.color('grey-500')};
  color: ${({ theme }) => theme.color('grey-500')};
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

export { StyledAvatarWrapper, StyledAvatarAdornment };
