import { testA11y, render } from '@gobob/test-utils';

import { Spinner } from '..';

describe('Spinner', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Spinner aria-label='loading' />);

    expect(() => unmount()).not.toThrow();
  });

  it('should pass a11y', async () => {
    await testA11y(<Spinner aria-label='loading' />);
  });
});
