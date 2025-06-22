// Fix voor TextEncoder fout
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm/LoginForm';
import { supabase } from '../../lib/supabaseClient';

// ✅ Supabase mock
jest.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn()
    }
  }
}));

// ✅ Router mock
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('LoginForm component', () => {
  it('toont alle invoervelden en knop', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/E-mailadres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wachtwoord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inloggen/i })).toBeInTheDocument();
  });

  it('logt succesvol in en toont bevestiging', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/E-mailadres/i), {
      target: { value: 'jan@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), {
      target: { value: 'test1234' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Inloggen/i }));

    await waitFor(() => {
      expect(screen.getByText(/Inloggen gelukt!/i)).toBeInTheDocument();
    });
  });

  it('toont foutmelding bij mislukte login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Inloggegevens kloppen niet' }
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/E-mailadres/i), {
      target: { value: 'jan@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), {
      target: { value: 'verkeerdwachtwoord' }
    });

    fireEvent.click(screen.getByRole('button', { name: /Inloggen/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login mislukt/i)).toBeInTheDocument();
    });
  });
});
