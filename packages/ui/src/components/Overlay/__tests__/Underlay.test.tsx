import { render, testA11y } from '@gobob/test-utils';

import { Underlay } from '..';

describe('Underlay', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Underlay isOpen />);

    expect(() => unmount()).not.toThrow();
  });

  it('should pass a11y', async () => {
    await testA11y(<Underlay isOpen />);
  });
});
