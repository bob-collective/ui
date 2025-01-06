import { blur, testA11y, render } from '@gobob/test-utils';
import { screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Key, createRef, useState } from 'react';
import { Currency } from '@gobob/currency';
import { vi } from 'vitest';

import { TokenInput } from '..';

describe('TokenInput', () => {
  it('should render correctly', () => {
    const { unmount } = render(
      <TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />
    );

    expect(() => unmount()).not.toThrow();
  });

  it('ref should be forwarded', () => {
    const ref = createRef<HTMLInputElement>();

    render(<TokenInput ref={ref} currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);
    expect(ref.current).not.toBeNull();
  });

  it('should pass a11y', async () => {
    await testA11y(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);
  });

  it('should render with placeholder', () => {
    render(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);

    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
  });

  it('should render with usd value', () => {
    render(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' valueUSD={10} />);

    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('should render with default value', () => {
    render(
      <TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} defaultValue='10' label='label' logoUrl='' />
    );

    expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('10');
  });

  it('should display 0.01 when 0.0.1 is typed', async () => {
    render(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);

    const input = screen.getByRole('textbox', { name: /label/i });

    await userEvent.type(input, '0.0.1');

    await waitFor(() => {
      expect(input).toHaveValue('0.01');
    });
  });

  it('should display max decimals', async () => {
    render(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);

    const input = screen.getByRole('textbox', { name: /label/i });

    await userEvent.type(input, '0.0000001');

    await waitFor(() => {
      expect(input).toHaveValue('0.000000');
    });
  });

  it('should control value', async () => {
    const Component = () => {
      const [value, setValue] = useState('1');

      const handleValueChange = (value?: string | number) => setValue(value?.toString() || '');

      return (
        <TokenInput
          currency={{ decimals: 6, symbol: 'BTC' } as Currency}
          label='label'
          logoUrl=''
          value={value}
          onValueChange={handleValueChange}
        />
      );
    };

    render(<Component />);

    const input = screen.getByRole('textbox', { name: /label/i });

    expect(input).toHaveValue('1');

    await userEvent.type(input, '1');

    await waitFor(() => {
      expect(input).toHaveValue('11');
    });
  });

  it('should render description', () => {
    render(
      <TokenInput
        currency={{ decimals: 6, symbol: 'BTC' } as Currency}
        description='Please select token'
        label='label'
        logoUrl=''
      />
    );

    expect(screen.getByRole('textbox', { name: /label/i })).toHaveAccessibleDescription(/please select token$/i);
  });

  describe('balance', () => {
    it('should render human value', () => {
      render(
        <TokenInput balance='10' currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />
      );

      expect(screen.getByRole('button')).toHaveTextContent('10');
    });

    it('should update input when applying max', async () => {
      const handleClickBalance = vi.fn();
      const handleValueChange = vi.fn();

      render(
        <TokenInput
          balance='10'
          currency={{ decimals: 6, symbol: 'BTC' } as Currency}
          humanBalance='11'
          label='label'
          logoUrl=''
          onClickBalance={handleClickBalance}
          onValueChange={handleValueChange}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /10/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('10');
      });

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith('10');
      expect(handleClickBalance).toHaveBeenCalledTimes(1);
      expect(handleClickBalance).toHaveBeenCalledWith('10');
    });

    it('should apply max with exact decimals', async () => {
      const handleClickBalance = vi.fn();
      const handleValueChange = vi.fn();

      render(
        <TokenInput
          balance='0.167345554041665262'
          currency={{ decimals: 18, symbol: 'ETH' } as Currency}
          label='label'
          logoUrl=''
          onClickBalance={handleClickBalance}
          onValueChange={handleValueChange}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /apply/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('0.167345554041665262');
      });

      expect(handleValueChange).toHaveBeenCalledWith('0.167345554041665262');
      expect(handleClickBalance).toHaveBeenCalledWith('0.167345554041665262');
    });

    it('should apply max with correct amount decimals', async () => {
      const handleValueChange = vi.fn();

      render(
        <TokenInput
          balance='0.167345554041665262'
          currency={{ decimals: 8, symbol: 'BTC' } as Currency}
          label='label'
          logoUrl=''
          onValueChange={handleValueChange}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /apply/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('0.16734555');
      });

      expect(handleValueChange).toHaveBeenCalledWith('0.16734555');
    });

    it('should not emit input onBlur when focus is in max btn', async () => {
      const handleClickBalance = vi.fn();
      const handleBlur = vi.fn();

      render(
        <TokenInput
          balance='10'
          currency={{ decimals: 6, symbol: 'BTC' } as Currency}
          label='label'
          logoUrl=''
          onBlur={handleBlur}
          onClickBalance={handleClickBalance}
        />
      );

      await userEvent.type(screen.getByRole('textbox', { name: /label/i }), '1');

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('1');
      });

      await userEvent.click(screen.getByRole('button', { name: /apply/i }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('10');
      });

      expect(handleBlur).not.toHaveBeenCalled();

      blur(screen.getByRole('textbox', { name: /label/i }));

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should have max btn disabled when balance is 0', async () => {
      const handleClickBalance = vi.fn();

      render(
        <TokenInput
          balance='0'
          currency={{ decimals: 6, symbol: 'BTC' } as Currency}
          humanBalance={11}
          label='label'
          logoUrl=''
          onClickBalance={handleClickBalance}
        />
      );

      expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    });

    it('should have max btn disabled when input is disabled', async () => {
      const handleClickBalance = vi.fn();

      render(
        <TokenInput
          isDisabled
          balance='10'
          currency={{ decimals: 6, symbol: 'BTC' } as Currency}
          label='label'
          logoUrl=''
          onClickBalance={handleClickBalance}
        />
      );

      expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
    });
  });

  describe('fixed type', () => {
    it('should render with ticker adornment', () => {
      render(<TokenInput currency={{ decimals: 6, symbol: 'BTC' } as Currency} label='label' logoUrl='' />);

      expect(screen.getByText(/btc/i)).toBeInTheDocument();
    });
  });

  describe('selectable type', () => {
    const currencies = [{ decimals: 6, symbol: 'BTC' } as Currency, { decimals: 18, symbol: 'ETH' }];

    const items = [
      { balance: 1, currency: currencies[0] as Currency, balanceUSD: 10000, logoUrl: '' },
      { balance: 2, currency: currencies[1] as Currency, balanceUSD: 900, logoUrl: '' }
    ];

    it('should render correctly', async () => {
      const { unmount } = render(<TokenInput items={items} label='label' type='selectable' />);

      expect(() => unmount()).not.toThrow();
    });

    it('should pass a11y', async () => {
      await testA11y(<TokenInput items={items} label='label' type='selectable' />);
    });

    it('ref should be forwarded to the modal', async () => {
      const ref = createRef<HTMLInputElement>();

      render(<TokenInput items={items} label='label' selectProps={{ modalProps: { ref } }} type='selectable' />);

      await userEvent.click(screen.getByRole('button', { name: /select token/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
      });

      expect(ref.current).not.toBeNull();
    });

    it('should render default value', () => {
      render(
        <TokenInput
          items={items}
          label='label'
          selectProps={{ defaultValue: items[0].currency.symbol }}
          type='selectable'
        />
      );

      expect(screen.getByRole('button', { name: /select token/i })).toHaveTextContent('BTC');
    });

    it('should control select value and emit onChangeCurrency', async () => {
      const handleChangeCurrency = vi.fn();

      const Component = () => {
        const [value, setValue] = useState<any | undefined>(currencies[0]);

        const handleSelectionChange = (key: Key) =>
          setValue(currencies.find((currency) => currency.symbol === key.toString()));

        return (
          <TokenInput
            items={items}
            label='label'
            selectProps={{ value: value.symbol, onSelectionChange: handleSelectionChange }}
            type='selectable'
            onChangeCurrency={handleChangeCurrency}
          />
        );
      };

      render(<Component />);

      const selectBtn = screen.getByRole('button', { name: /select token/i });

      expect(selectBtn).toHaveTextContent('BTC');

      await userEvent.click(selectBtn);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
      });

      const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

      await userEvent.click(dialog.getByRole('row', { name: 'ETH' }));

      expect(screen.getByRole('button', { name: /select token/i })).toHaveTextContent('ETH');
      expect(handleChangeCurrency).toHaveBeenCalledWith(currencies[1]);
      expect(handleChangeCurrency).toHaveBeenCalledTimes(1);
    });

    it('should change currency', async () => {
      const Component = () => {
        const [value, setValue] = useState<any | undefined>(currencies[0]);

        const handleSelectionChange = (key: Key) =>
          setValue(currencies.find((currency) => currency.symbol === key.toString()));

        return (
          <>
            <button onClick={() => setValue(currencies[1])}>swap</button>
            <TokenInput
              items={items}
              label='label'
              selectProps={{ value: value.symbol, onSelectionChange: handleSelectionChange }}
              type='selectable'
            />
          </>
        );
      };

      render(<Component />);

      await userEvent.click(screen.getByRole('button', { name: /swap/i }));

      await waitFor(() => {
        const selectBtn = screen.getByRole('button', { name: /select token/i });

        expect(selectBtn).toHaveTextContent('ETH');
      });
    });

    it('should apply correct decimals when switching currency', async () => {
      render(
        <TokenInput
          items={items}
          label='label'
          selectProps={{ value: currencies[1].symbol }}
          type='selectable'
          value='0.0000000000001'
        />
      );

      const selectBtn = screen.getByRole('button', { name: /ETH select token/i });

      await userEvent.click(selectBtn);

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /select token/i })).toBeInTheDocument();
      });

      const dialog = within(screen.getByRole('dialog', { name: /select token/i }));

      await userEvent.click(dialog.getByRole('row', { name: 'BTC' }));

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /label/i })).toHaveValue('0.0000000000001');
      });
    });

    it('should render description', () => {
      render(
        <TokenInput
          items={items}
          label='label'
          selectProps={{ description: 'Please select token' }}
          type='selectable'
        />
      );

      expect(screen.getByRole('button', { name: /select token/i })).toHaveAccessibleDescription(
        /please select token$/i
      );
    });

    it('should render select error message', () => {
      render(
        <TokenInput
          items={items}
          label='label'
          selectProps={{ errorMessage: 'Token field is required' }}
          type='selectable'
        />
      );

      expect(screen.getByRole('button', { name: /select token/i })).toHaveAccessibleDescription(
        /token field is required$/i
      );
    });
  });
});
