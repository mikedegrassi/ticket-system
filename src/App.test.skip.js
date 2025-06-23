import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('./lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              name: 'Mock Event',
              location: 'Mock City',
              date: '2025-12-31',
              artist_id: 1
            }
          ],
          error: null,
        }),
      })),
    })),
  },
}));

test('renders homepage with header and genres', async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(await screen.findByText(/APPNAME/i)).toBeInTheDocument();
});
