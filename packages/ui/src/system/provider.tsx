import type { ModalProviderProps } from '@react-aria/overlays';

import { I18nProvider, I18nProviderProps } from '@react-aria/i18n';
import { OverlayProvider } from '@react-aria/overlays';
import { ThemeProvider } from 'styled-components';
import { RouterProvider } from '@react-aria/utils';

import { bobTheme } from '../theme';
import { Toast } from '../components/Toast';

interface BOBUIProviderProps extends Omit<ModalProviderProps, 'children'> {
  children: React.ReactNode;
  /**
   * The locale to apply to the children.
   * @default "en-US"
   */
  locale?: I18nProviderProps['locale'];
  navigate?: (path: string) => void;
}

const BOBUIProvider: React.FC<BOBUIProviderProps> = ({ children, locale = 'en-US', navigate, ...otherProps }) => {
  let contents = children;

  if (navigate) {
    contents = <RouterProvider navigate={navigate}>{contents}</RouterProvider>;
  }

  return (
    <ThemeProvider theme={bobTheme}>
      <I18nProvider locale={locale}>
        <OverlayProvider {...otherProps}>
          <Toast>
            <div style={{ isolation: 'isolate' }}>{contents}</div>
          </Toast>
        </OverlayProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export { BOBUIProvider };
export type { BOBUIProviderProps };
