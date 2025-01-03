/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { render } from '@gobob/test-utils';
import { vi } from 'vitest';

import { Input, TokenInput, Select, Item } from '../../../components';
import { useForm } from '../use-form';
import { BOBUIProvider } from '../../../system';

type FormData = {
  firstName: string;
  lastName: string;
};

const validate = (values: FormData) => {
  const errors: any = {};

  if (!values.firstName) {
    errors.firstName = 'Required';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  }

  return errors;
};

describe('useForm', () => {
  const handleSubmit = vi.fn();

  beforeEach(() => {
    handleSubmit.mockClear();
  });

  describe('Input', () => {
    const commonProps = { initialValues: { firstName: '', lastName: '' }, validate, onSubmit: handleSubmit };

    it('should set field value', async () => {
      const { result } = renderHook(() => useForm<FormData>(commonProps));

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      await userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 'j');

      await waitFor(() => {
        expect(result.current.values.firstName).toBe('j');
      });
    });

    it('should hide all errors', async () => {
      const { result } = renderHook(() =>
        useForm<FormData>({
          ...commonProps,
          hideErrors: true
        })
      );

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      await userEvent.click(screen.getByRole('textbox', { name: /first name/i }));

      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(result.current.errors.firstName).toBeDefined();
        expect(result.current.errors.lastName).toBeDefined();
      });

      expect(result.current.getFieldProps('firstName').errorMessage).not.toBeDefined();
      expect(result.current.getFieldProps('lastName').errorMessage).not.toBeDefined();
    });

    it('should hide errors of specific field', async () => {
      const { result } = renderHook(() =>
        useForm<FormData>({
          ...commonProps,
          hideErrors: {
            firstName: true
          }
        })
      );

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      await userEvent.click(screen.getByRole('textbox', { name: /first name/i }));

      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(result.current.errors.firstName).toBeDefined();
        expect(result.current.errors.lastName).toBeDefined();
      });

      expect(result.current.getFieldProps('firstName').errorMessage).not.toBeDefined();
      expect(result.current.getFieldProps('lastName').errorMessage).toBeDefined();
    });

    it('should hide untouched field errors', async () => {
      const { result } = renderHook(() =>
        useForm<FormData>({
          ...commonProps,
          hideErrors: 'untouched'
        })
      );

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      // eslint-disable-next-line testing-library/await-async-events
      userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 't');

      await waitFor(() => {
        expect(result.current.values.firstName).toBe('t');
      });

      // eslint-disable-next-line testing-library/await-async-events
      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(result.current.errors.firstName).not.toBeDefined();
        expect(result.current.errors.lastName).toBeDefined();
      });

      expect(result.current.getFieldProps('firstName').errorMessage).not.toBeDefined();
      expect(result.current.getFieldProps('lastName').errorMessage).not.toBeDefined();
    });

    it('should hide specified untouched field errors', async () => {
      const { result } = renderHook(() =>
        useForm<FormData>({
          ...commonProps,
          hideErrors: {
            lastName: 'untouched'
          }
        })
      );

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      // eslint-disable-next-line testing-library/await-async-events
      userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 't');

      await waitFor(() => {
        expect(result.current.values.firstName).toBe('t');
      });

      // eslint-disable-next-line testing-library/await-async-events
      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(result.current.errors.firstName).not.toBeDefined();
        expect(result.current.errors.lastName).toBeDefined();
      });

      expect(result.current.getFieldProps('firstName').errorMessage).not.toBeDefined();
      expect(result.current.getFieldProps('lastName').errorMessage).not.toBeDefined();
    });
  });

  describe('TokenInput', () => {
    const commonProps = { initialValues: { amount: '', currency: '' }, onSubmit: handleSubmit };

    it('should set amount field value', async () => {
      const { result } = renderHook(() => useForm<{ amount: string }>(commonProps));

      const props = result.current.getTokenFieldProps('amount');

      render(
        <form onSubmit={result.current.handleSubmit}>
          <TokenInput currency={{ decimals: 8, symbol: 'BTC' } as any} label='Amount' logoUrl='' {...props} />
          <button type='submit'>Submit</button>
        </form>
      );

      expect((props as any).onChange).toBeUndefined();

      await userEvent.type(screen.getByRole('textbox', { name: /amount/i }), '1');

      await waitFor(() => {
        expect(result.current.values.amount).toBe('1');
      });
    });

    it('should set currency field value', async () => {
      const { result } = renderHook(() => useForm<{ amount: string; currency: string }>(commonProps));

      const props = result.current.getSelectableTokenFieldProps({ amount: 'amount', currency: 'currency' });

      render(
        <form onSubmit={result.current.handleSubmit}>
          <TokenInput
            items={[{ logoUrl: '', balance: '0', balanceUSD: 0, currency: { symbol: 'BTC', decimals: 8 } as any }]}
            label='Amount'
            type='selectable'
            {...props}
          />
          <button type='submit'>Submit</button>
        </form>
      );

      const selectBtn = screen.getByRole('button', { name: /select token/i });

      await userEvent.click(selectBtn);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
      });

      const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

      await userEvent.click(dialog.getByRole('row', { name: 'BTC' }));

      await waitFor(() => {
        expect(result.current.values.currency).toBe('BTC');
      });
    });
  });

  describe('Select', () => {
    type SelectFormData = {
      token: string;
    };

    const commonProps = { initialValues: { token: '' }, onSubmit: handleSubmit };

    it('should persist untouched until focus is out of component', async () => {
      const { result } = renderHook(() =>
        useForm<SelectFormData>({
          ...commonProps
        })
      );

      render(
        <BOBUIProvider>
          <form onSubmit={result.current.handleSubmit}>
            <Select
              label='Token'
              modalProps={{ title: 'Select Token' }}
              type='modal'
              {...result.current.getSelectFieldProps('token')}
            >
              <Item key='BTC' textValue='BTC'>
                BTC
              </Item>
              <Item key='ETH' textValue='ETH'>
                ETH
              </Item>
              <Item key='USDT' textValue='USDT'>
                USDT
              </Item>
            </Select>
            <button type='submit'>Submit</button>
          </form>
        </BOBUIProvider>
      );

      await userEvent.click(screen.getByRole('button', { name: /token/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
      });

      expect(result.current.touched.token).toBeFalsy();

      const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

      await userEvent.click(dialog.getByRole('button', { name: /dismiss/i }));

      expect(result.current.touched.token).toBeFalsy();

      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(result.current.touched.token).toBeTruthy();
      });
    });

    it('should set field value', async () => {
      const { result } = renderHook(() =>
        useForm<SelectFormData>({
          ...commonProps
        })
      );

      const props = result.current.getSelectFieldProps('token');

      expect((props as any).onChange).toBeUndefined();

      act(() => {
        props.onSelectionChange?.('BTC');
      });

      await waitFor(() => {
        expect(result.current.values.token).toBe('BTC');
      });
    });
  });

  describe('onComplete', () => {
    const handleComplete = vi.fn();

    const validate = (values: FormData) => {
      const errors: any = {};

      if (!values.firstName) {
        errors.firstName = 'Required';
      }

      return errors;
    };

    const commonProps = {
      initialValues: { firstName: '', lastName: '' },
      validate,
      onSubmit: handleSubmit,
      onComplete: handleComplete
    };

    beforeEach(() => {
      handleComplete.mockClear();
    });

    it('should emit event', async () => {
      const { result } = renderHook(() => useForm<FormData>(commonProps));

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      await userEvent.type(screen.getByRole('textbox', { name: /first name/i }), 'j');

      await waitFor(() => {
        expect(result.current.dirty).toBeTruthy();
        expect(result.current.isValid).toBeTruthy();

        expect(handleComplete).toHaveBeenCalledTimes(1);
        expect(handleComplete).toHaveBeenCalledWith({ firstName: 'j', lastName: '' });
      });
    });

    it('should not emit event', async () => {
      const { result } = renderHook(() => useForm<FormData>(commonProps));

      render(
        <form onSubmit={result.current.handleSubmit}>
          <Input label='First Name' {...result.current.getFieldProps('firstName')} />
          <Input label='Last Name' {...result.current.getFieldProps('lastName')} />
          <button type='submit'>Submit</button>
        </form>
      );

      await userEvent.type(screen.getByRole('textbox', { name: /last name/i }), 'j');

      await waitFor(() => {
        expect(result.current.dirty).toBeTruthy();
        expect(result.current.isValid).not.toBeTruthy();

        expect(handleComplete).not.toHaveBeenCalled();
      });
    });
  });
});
