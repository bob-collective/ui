import { render } from '@gobob/test-utils';

import { Layout } from '..';

describe('Layout', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Layout>Layout</Layout>);

    expect(() => unmount()).not.toThrow();
  });
});
