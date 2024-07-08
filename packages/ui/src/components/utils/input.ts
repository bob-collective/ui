import { InputSizes, Theme } from '../../theme';

type HasErrorProps = { errorMessage?: string | string[]; isInvalid?: boolean };

const hasErrorMessage = (errorMessage?: string | string[]): boolean =>
  typeof errorMessage === 'string' ? !!errorMessage : !!errorMessage?.filter(Boolean).length;

const hasError = ({ errorMessage, isInvalid = false }: HasErrorProps): boolean =>
  (errorMessage && hasErrorMessage(errorMessage)) || isInvalid;

const inputSizeTheme = (theme: Theme, size: InputSizes) =>
  ({
    s: {
      ...theme.typography('s'),
      fontWeight: theme.fontWeight('normal'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: theme.spacing('s'),
      paddingBottom: theme.spacing('s')
    },
    md: {
      ...theme.typography('s'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: theme.spacing('md'),
      paddingBottom: theme.spacing('md')
    },
    lg: {
      ...theme.typography('md'),
      fontWeight: theme.fontWeight('medium'),
      paddingLeft: theme.spacing('lg'),
      paddingRight: theme.spacing('lg'),
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem'
    }
  })[size];

export { hasError, inputSizeTheme };
