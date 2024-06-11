import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { UnstyledButton } from '..';

describe('UnstyledButton', () => {
  it('should render correctly', () => {
    const { unmount } = render(<UnstyledButton>Button</UnstyledButton>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<UnstyledButton ref={ref}>Button</UnstyledButton>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<UnstyledButton>Button</UnstyledButton>);
  });
});
