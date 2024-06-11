import { testA11y, render } from '@gobob/test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Key, createRef, useState } from 'react';

import { Select, Item } from '..';

describe('Select', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <Select label='label'>
        <Item key='1'>Item 1</Item>
      </Select>
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Select ref={ref} label='label'>
        <Item key='1'>Item 1</Item>
      </Select>
    );

    expect(ref.current).not.toBeNull();
  });

  describe('type modal', () => {
    it('should render correctly', () => {
      const { unmount } = render(
        <Select defaultOpen label='label' type='modal'>
          <Item key='1'>Item 1</Item>
        </Select>
      );

      expect(() => unmount()).not.toThrow();
    });

    it('should forwarded modal ref', () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Select defaultOpen label='label' modalProps={{ ref }} type='modal'>
          <Item key='1'>Item 1</Item>
        </Select>
      );

      expect(ref.current).not.toBeNull();
    });

    it('should pass a11y', async () => {
      await testA11y(
        <Select defaultOpen label='label' type='modal'>
          <Item key='1'>Item 1</Item>
        </Select>
      );
    });

    it('should control value', async () => {
      const Component = () => {
        const [value, setValue] = useState<any | undefined>('1');

        const handleSelectionChange = (key: Key) => setValue(key);

        return (
          <Select label='label' type='modal' value={value} onSelectionChange={handleSelectionChange}>
            <Item key='1'>Item 1</Item>
            <Item key='2'>Item 2</Item>
          </Select>
        );
      };

      render(<Component />);

      const selectBtn = screen.getByRole('button', { name: /item 1/i });

      expect(selectBtn).toHaveTextContent(/item 1/i);

      await userEvent.click(selectBtn);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const dialog = within(screen.getByRole('dialog'));

      await userEvent.click(dialog.getByRole('row', { name: /item 2/i }));

      expect(screen.getByRole('button', { name: /item 2/i })).toHaveTextContent(/item 2/i);
    });
  });
});
