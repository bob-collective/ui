import styled from 'styled-components';

const Addornment = ({ type, className }: { type: 'receive' | 'send'; className?: string }) => (
  <svg className={className} fill='none' height='20' viewBox='0 0 20 20' width='20' xmlns='http://www.w3.org/2000/svg'>
    <circle cx='10' cy='10' fill='currentColor' r='9' stroke='#161B26' strokeWidth='2' />
    {type === 'receive' ? (
      <path
        d='M9.31536 13.527V7.49292H10.8409V13.527H9.31536ZM7.0611 11.2727V9.74718H13.0952V11.2727H7.0611Z'
        fill='#161B26'
      />
    ) : (
      <path d='M12.2028 9.3374V10.8978H7.89098V9.3374H12.2028Z' fill='#161B26' />
    )}
  </svg>
);

const StyledAvatarWrapper = styled.div`
  position: relative;
`;

const StyledAvatarAdornment = styled(Addornment)`
  position: absolute;
  color: ${({ type, theme }) => (type === 'send' ? theme.color('red-500') : theme.color('green-500'))};
  right: 0;
  bottom: 0;
  transform: translateX(25%);
  border-radius: ${({ theme }) => theme.rounded('full')};
`;

export { StyledAvatarWrapper, StyledAvatarAdornment };
