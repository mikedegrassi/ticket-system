import React from 'react';
import { render, screen, act } from '@testing-library/react';
import MyTickets from '../../components/MyTickets/MyTickets';
import { useUser } from '@supabase/auth-helpers-react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('@supabase/auth-helpers-react', () => ({
  useUser: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder,
    })),
  },
}));

describe('MyTickets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUser.mockReturnValue({ id: 'test-user' });
  });

  it('toont melding als er geen tickets zijn', async () => {
    mockSelect.mockReturnThis();
    mockEq.mockReturnThis();
    mockOrder.mockResolvedValueOnce({ data: [], error: null });

    await act(async () => {
      render(
        <MemoryRouter>
          <MyTickets />
        </MemoryRouter>
      );
    });

    expect(screen.getByTestId('no-tickets')).toBeInTheDocument();
  });
});

