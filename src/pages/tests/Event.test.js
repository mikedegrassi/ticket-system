import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Event from '../Event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as supabaseClient from '../../lib/supabaseClient';

jest.mock('../../components/EventDates/EventDates', () => () => <div data-testid="event-dates" />);
jest.mock('../../components/EventBannerCard/EventBannerCard', () => () => <div data-testid="event-banner" />);

const mockEvent = {
  id: '1',
  title: 'Test Event',
  image_url: 'test.jpg',
  genre: 'Rock'
};

jest.spyOn(supabaseClient.supabase, 'from').mockImplementation(() => ({
  select: () => ({
    eq: () => ({
      single: async () => ({ data: mockEvent, error: null })
    })
  })
}));

describe('Event page', () => {
  it('laadt event data en toont componenten', async () => {
    render(
      <MemoryRouter initialEntries={[`/event/1`]}>
        <Routes>
          <Route path="/event/:id" element={<Event />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Evenement aan het laden/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('event-banner')).toBeInTheDocument();
      expect(screen.getByTestId('event-dates')).toBeInTheDocument();
    });
  });

  it('geeft foutmelding bij geen event', async () => {
    supabaseClient.supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: 'Not found' })
        })
      })
    });

    render(
      <MemoryRouter initialEntries={[`/event/999`]}>
        <Routes>
          <Route path="/event/:id" element={<Event />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Evenement niet gevonden/i)).toBeInTheDocument();
    });
  });
});
