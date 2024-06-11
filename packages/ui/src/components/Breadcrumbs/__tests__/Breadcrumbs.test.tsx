import { createRef } from 'react';
import { testA11y, render } from '@gobob/test-utils';

import { BreadcrumbItem, Breadcrumbs } from '..';

describe('Breadcrumbs', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <Breadcrumbs>
        <BreadcrumbItem>page</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Breadcrumbs ref={ref}>
        <BreadcrumbItem>page</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(
      <Breadcrumbs>
        <BreadcrumbItem>page</BreadcrumbItem>
      </Breadcrumbs>
    );
  });
});
