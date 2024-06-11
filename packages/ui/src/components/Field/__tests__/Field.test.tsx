import { render, testA11y } from '@gobob/test-utils';
import { createRef } from 'react';

import { Field } from '..';

describe('Field', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Field description='Field description' label='Field' />);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Field ref={ref} description='Field description' label='Field' />);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<Field description='Field description' label='Field' />);
  });
});
