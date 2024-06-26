import { render, testA11y } from '@gobob/test-utils';
import { createRef } from 'react';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from '..';

describe('Dialog', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <Dialog>
        <DialogHeader>title</DialogHeader>
        <DialogBody>body</DialogBody>
        <DialogFooter>footer</DialogFooter>
      </Dialog>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Dialog ref={ref}>
        <DialogHeader>title</DialogHeader>
        <DialogBody>body</DialogBody>
        <DialogFooter>footer</DialogFooter>
      </Dialog>
    );

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(
      <Dialog>
        <DialogHeader>title</DialogHeader>
        <DialogBody>body</DialogBody>
        <DialogFooter>footer</DialogFooter>
      </Dialog>
    );
  });
});
