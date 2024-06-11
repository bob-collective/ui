import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { Label } from '..';

describe('Label', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Label>label</Label>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLLabelElement>();

    render(<Label ref={ref}>label</Label>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<Label>label</Label>);
  });
});
