import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import TicketPage from '../../pages/TicketPage';

const mockSingle = jest.fn();

jest.mock('../../lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: mockSingle
        }))
      }))
    }))
  }
}));

describe('TicketPage', () => {
  it('laadt ticket en toont info correct', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'mock-ticket-id',
        qr_code: 'https://test.com/mockqr',
        vak: 'B',
        rij: '5',
        stoel: '12',
        is_personalized: true,
        personalized_by: 'Mike L.',
        event: {
          title: 'Concert Night',
          date: '2025-12-24T20:00:00',
          location: 'Ziggo Dome',
          artist: { name: 'Adele' },
        },
      },
      error: null,
    });

    await act(async () => {
      render(<TicketPage />);
    });

    expect(screen.getByText(/Adele/i)).toBeInTheDocument();
    expect(screen.getByText(/Ziggo Dome/i)).toBeInTheDocument();
    expect(screen.getByText(/Mike L./i)).toBeInTheDocument();
  });

  it('toont melding als ticket niet gevonden is', async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: null });

    await act(async () => {
      render(<TicketPage />);
    });

    expect(screen.getByText(/Ticket niet gevonden/i)).toBeInTheDocument();
  });
});

