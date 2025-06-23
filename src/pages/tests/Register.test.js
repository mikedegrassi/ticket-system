import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Register';
import { supabase } from '../../lib/supabaseClient';
import '@testing-library/jest-dom';

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn()
    },
    from: jest.fn()
  }
}));

describe('Register component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('laat alle invoervelden zien', () => {
    render(<Register />);
    expect(screen.getByLabelText(/Voornaam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Achternaam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mailadres/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefoonnummer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wachtwoord/i)).toBeInTheDocument();
  });

  it('registreert succesvol en toont bevestiging', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });

    const insertMock = jest.fn().mockResolvedValue({ error: null });
    supabase.from.mockReturnValue({ insert: insertMock });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Voornaam/i), { target: { value: 'Jan', name: 'firstName' } });
    fireEvent.change(screen.getByLabelText(/Achternaam/i), { target: { value: 'Jansen', name: 'lastName' } });
    fireEvent.change(screen.getByLabelText(/E-mailadres/i), { target: { value: 'jan@example.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/Telefoonnummer/i), { target: { value: '0612345678', name: 'phone_number' } });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), { target: { value: 'wachtwoord', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Registreren/i }));

    await waitFor(() =>
      expect(screen.getByText(/Registratie succesvol!/i)).toBeInTheDocument()
    );
  });

  it('laat foutmelding zien als signUp faalt', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: { message: 'Email is al in gebruik' }
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Voornaam/i), { target: { value: 'Jan', name: 'firstName' } });
    fireEvent.change(screen.getByLabelText(/Achternaam/i), { target: { value: 'Jansen', name: 'lastName' } });
    fireEvent.change(screen.getByLabelText(/E-mailadres/i), { target: { value: 'jan@example.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/Telefoonnummer/i), { target: { value: '0612345678', name: 'phone_number' } });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), { target: { value: 'wachtwoord', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Registreren/i }));

    await waitFor(() =>
      expect(screen.getByText(/Email is al in gebruik/i)).toBeInTheDocument()
    );
  });

  it('laat foutmelding zien als profielinsert faalt', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { id: '123' } },
      error: null
    });

    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: { message: 'Database error' } })
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/Voornaam/i), { target: { value: 'Jan', name: 'firstName' } });
    fireEvent.change(screen.getByLabelText(/Achternaam/i), { target: { value: 'Jansen', name: 'lastName' } });
    fireEvent.change(screen.getByLabelText(/E-mailadres/i), { target: { value: 'jan@example.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/Telefoonnummer/i), { target: { value: '0612345678', name: 'phone_number' } });
    fireEvent.change(screen.getByLabelText(/Wachtwoord/i), { target: { value: 'wachtwoord', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Registreren/i }));

    await waitFor(() =>
      expect(screen.getByText(/Account aangemaakt, maar profiel niet opgeslagen/i)).toBeInTheDocument()
    );
  });
});
