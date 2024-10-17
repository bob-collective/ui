import { render } from '@testing-library/react';

import { AuthButton } from '..';

describe('AuthButton', () => {
  it('should render correctly', () => {
    const { unmount } = render(<AuthButton />);

    expect(() => unmount()).not.toThrow();
  });
});
