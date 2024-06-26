import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { Button } from '..';

describe('Button', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Button>Button</Button>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Button</Button>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<Button>Button</Button>);
  });
});
