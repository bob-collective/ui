import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { HelperText } from '..';

describe('HelperText', () => {
  it('should render correctly', () => {
    const { unmount } = render(<HelperText>text</HelperText>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(<HelperText ref={ref}>text</HelperText>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<HelperText>text</HelperText>);
  });
});
