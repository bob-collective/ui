import { render, testA11y } from '@gobob/test-utils';
import { createRef } from 'react';
import { vi } from 'vitest';

import { Drawer } from '..';

describe('Drawer', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <Drawer isOpen onClose={vi.fn as any}>
        content
      </Drawer>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Drawer ref={ref} isOpen onClose={vi.fn as any}>
        content
      </Drawer>
    );

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(
      <Drawer isOpen onClose={vi.fn as any}>
        content
      </Drawer>
    );
  });
});
