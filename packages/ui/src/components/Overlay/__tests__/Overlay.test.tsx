import { render, testA11y } from '@gobob/test-utils';
import { createRef } from 'react';

import { Overlay } from '..';

describe('Overlay', () => {
  it('should render correctly', () => {
    const ref = createRef<HTMLDivElement>();

    const { unmount } = render(
      <Overlay nodeRef={ref}>
        <div />
      </Overlay>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('should pass a11y', async () => {
    const ref = createRef<HTMLDivElement>();

    await testA11y(
      <Overlay nodeRef={ref}>
        <div />
      </Overlay>
    );
  });
});
