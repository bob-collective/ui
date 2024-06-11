import '@testing-library/jest-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import * as React from 'react';
import userEvent from '@testing-library/user-event';

import { BOBUIProvider } from '../../ui/src';

const Provider = (props: any) => <BOBUIProvider {...props} />;

interface BOBRenderOptions extends RenderOptions {
  withProvider?: boolean;
}

expect.extend(toHaveNoViolations);

export function render(
  ui: React.ReactElement,
  { withProvider, ...options }: BOBRenderOptions = {
    withProvider: true
  }
): ReturnType<typeof rtlRender> & { user: ReturnType<typeof userEvent.setup> } {
  if (withProvider) {
    options.wrapper = Provider;
  }

  const user = userEvent.setup();

  return { user, ...rtlRender(ui, options) };
}
