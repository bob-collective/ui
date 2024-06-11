import { render, testA11y } from '@gobob/test-utils';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Alert } from '..';

describe('Alert', () => {
  it('should render correctly', () => {
    const { unmount } = render(<Alert>Alert</Alert>);

    expect(() => unmount()).not.toThrow();
  });

  it('should pass a11y', async () => {
    await testA11y(<Alert>Alert</Alert>);
  });

  it.skip('should emit close event', async () => {
    const handleClose = jest.fn();

    render(<Alert onClose={handleClose}>Alert</Alert>);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
