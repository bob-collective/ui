import { render } from '@testing-library/react';

import { ConnectWallet } from '..';

describe('ConnectWallet', () => {
  it('should render correctly', () => {
    const { unmount } = render(<ConnectWallet />);

    expect(() => unmount()).not.toThrow();
  });
});
