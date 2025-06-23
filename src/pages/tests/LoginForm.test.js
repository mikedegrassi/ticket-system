import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginForm from '../../components/LoginForm/LoginForm';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { supabase } from '../../lib/supabaseClient';

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('LoginForm component', () => {
  it('toont alle invoervelden en knop', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/E-mailadres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wachtwoord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inloggen/i })).toBeInTheDocument();
  });

  it('logt succesvol in en toont bevestiging', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ error: null });

    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/E-mailadres/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Inloggen/i }));

    await screen.findByText(/Inloggen gelukt!/i);
  });

  it('toont foutmelding bij mislukte login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: 'Ongeldige inlog' },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/E-mailadres/i), { target: { value: 'fout@mail.com' } });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), { target: { value: 'verkeerd' } });
    fireEvent.click(screen.getByRole('button', { name: /Inloggen/i }));

    await screen.findByText(/Login mislukt/i);
  });
});
