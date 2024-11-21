import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';
import { vi } from 'vitest';

import { Link } from '..';

describe('Link', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Link>link</Link>);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(<Link ref={ref}>link</Link>);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<Link>link</Link>);
  });

  it('should render pressable link as a span', async () => {
    const handlePress = vi.fn();

    render(<Link onPress={handlePress}>link</Link>);

    expect(screen.getByRole('link').tagName).toBe('SPAN');
  });
});
