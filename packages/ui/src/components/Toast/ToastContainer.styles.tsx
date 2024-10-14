'use client';

import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import styled, { css } from 'styled-components';

// &&& is used to override css styles
const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    color: ${({ theme }) => theme.color('light')};
    padding: ${({ theme }) => theme.spacing('md')};
  }

  @media ${({ theme }) => theme.breakpoints.up('s')} {
    &&&.Toastify__toast-container {
      padding: 0;
    }
  }

  .Toastify__toast-theme--light,
  .Toastify__close-button--light {
    color: ${({ theme }) => theme.color('light')};
  }

  .Toastify__close-button--light {
    opacity: 1;
  }

  .Toastify__toast {
    font-family: inherit;

    ${({ theme }) => css`
      border: 1px solid ${theme.color('grey-400')};
      margin-bottom: ${theme.spacing('lg')};
      border-radius: ${theme.rounded('lg')};
      background-color: ${theme.color('grey-500')};
      padding: ${theme.spacing('lg')};
    `}
  }

  .Toastify__toast-body {
    padding: 0;
  }
`;

export { StyledToastContainer };
