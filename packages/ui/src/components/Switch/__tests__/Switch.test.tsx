import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { Switch } from '..';

describe('Switch', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Switch>switch</Switch>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Switch ref={ref}>switch</Switch>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<Switch>switch</Switch>);
  });
});
