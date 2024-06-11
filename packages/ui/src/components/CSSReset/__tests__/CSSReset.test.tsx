import { render } from '@gobob/test-utils';

import { CSSReset } from '..';

describe('CSSReset', () => {
  it('should render correctly', () => {
    const { unmount } = render(<CSSReset />);

    expect(() => unmount()).not.toThrow();
  });
});
