import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { Tabs, TabsItem } from '..';

describe('Tabs', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <Tabs>
        <TabsItem key='1' title='Title'>
          item
        </TabsItem>
      </Tabs>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Tabs ref={ref}>
        <TabsItem key='1' title='Title'>
          item
        </TabsItem>
      </Tabs>
    );

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(
      <Tabs>
        <TabsItem key='1' title='Title'>
          item
        </TabsItem>
      </Tabs>
    );
  });
});
