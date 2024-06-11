import { testA11y, render } from '@gobob/test-utils';

import { ProgressBar } from '..';

describe('ProgressBar', () => {
  it('should render correctly', () => {
    const { unmount } = render(<ProgressBar aria-label='progress' />);

    expect(() => unmount()).not.toThrow();
  });

  it('should pass a11y', async () => {
    await testA11y(<ProgressBar aria-label='progress' />);
  });
});
