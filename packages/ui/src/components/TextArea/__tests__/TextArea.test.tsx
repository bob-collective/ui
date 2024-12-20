import { render, blur, focus, testA11y } from '@gobob/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { vi } from 'vitest';

import { TextArea } from '..';

describe('TextArea', () => {
  it('should render correctly', () => {
    const { unmount } = render(<TextArea label='Name' />);

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<TextArea ref={ref} label='label' />);

    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<TextArea label='label' />);
  });

  it('should render default value', () => {
    render(<TextArea defaultValue='John Doe' label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toHaveValue('John Doe');
  });

  it('should control value', async () => {
    const Component = () => {
      const [value, setValue] = useState('John');

      const handleValueChange = (value?: string | number) => setValue(value?.toString() || '');

      return <TextArea label='Name' value={value} onValueChange={handleValueChange} />;
    };

    render(<Component />);

    const input = screen.getByRole('textbox', { name: /Name/i });

    expect(input).toHaveValue('John');

    await userEvent.type(input, 'y');

    await waitFor(() => {
      expect(input).toHaveValue('Johny');
    });
  });

  it('should be disabled', () => {
    render(<TextArea isDisabled label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toBeDisabled();
  });

  it('should render description', () => {
    render(<TextArea description='Please enter name' label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toHaveAccessibleDescription(/please enter name$/i);
  });

  it('should render error message', () => {
    render(<TextArea errorMessage='Please enter name' label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toBeInvalid();
    expect(screen.getByRole('textbox', { name: /Name/i })).toHaveAccessibleDescription(/please enter name$/i);
  });

  it('should be read only', () => {
    render(<TextArea isReadOnly label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toHaveAttribute('readonly');
  });

  it('should be read only', () => {
    render(<TextArea isRequired label='Name' />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toHaveAttribute('aria-required', 'true');
  });

  it('should emit onChange', async () => {
    const handleChange = vi.fn();

    render(<TextArea label='Name' onChange={handleChange} />);

    await userEvent.type(screen.getByRole('textbox', { name: /Name/i }), 'j');

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  it('should emit onValueChange', async () => {
    const handleValueChange = vi.fn();

    render(<TextArea label='Name' onValueChange={handleValueChange} />);

    await userEvent.type(screen.getByRole('textbox', { name: /Name/i }), 'j');

    await waitFor(() => {
      expect(handleValueChange).toHaveBeenCalledTimes(1);
    });

    expect(handleValueChange).toHaveBeenCalledWith('j');
  });

  it('should emit onBlur', async () => {
    const handleBlur = vi.fn();

    render(<TextArea label='Name' onBlur={handleBlur} />);

    focus(screen.getByRole('textbox', { name: /Name/i }));
    blur(screen.getByRole('textbox', { name: /Name/i }));

    await waitFor(() => {
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });
});
