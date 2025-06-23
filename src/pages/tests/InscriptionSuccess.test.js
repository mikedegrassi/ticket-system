import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import InscriptionSuccess from '../../components/InscriptionSuccessComponent/InscriptionSuccessComponent';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

describe('InscriptionSuccessComponent', () => {
  test('Toont correcte gegevens als state is meegegeven', () => {
    const history = createMemoryHistory();
    const state = {
      name: 'Artiest Test',
      date: '2025-07-01',
      expectedTickets: 2,
      phoneNumber: '+31612345678'
    };

    history.push('/inscriptionsuccess', state);

    render(
      <Router location={history.location} navigator={history}>
        <InscriptionSuccess />
      </Router>
    );

    expect(screen.getByText('Inschrijving gelukt!')).toBeInTheDocument();
    expect(screen.getByText(/Artiest Test/)).toBeInTheDocument();
    expect(screen.getByText(/2025-07-01/)).toBeInTheDocument();
    expect(screen.getByText(/2 tickets/)).toBeInTheDocument();
    expect(screen.getByText(/\+31612345678/)).toBeInTheDocument();
    expect(screen.getByText('Terug naar homepage')).toBeInTheDocument();
  });

  test('Redirect naar home als state ontbreekt', () => {
    const history = createMemoryHistory();
    history.push('/inscriptionsuccess'); 

    render(
      <Router location={history.location} navigator={history}>
        <InscriptionSuccess />
      </Router>
    );

    const heading = screen.queryByText('Inschrijving gelukt!');
    expect(heading).not.toBeInTheDocument();
  });
});
