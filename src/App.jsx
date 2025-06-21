import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Event from './pages/Event';
import Login from './pages/Login';
import Register from './pages/Register';
import InscriptionSuccess from './pages/InscriptionSuccess';
import MyInscriptions from './components/MyInscriptions/MyInscriptions';

import MyTickets from './components/MyTickets/MyTickets';
import TicketPage from './components/Ticket/Ticket';
import TicketWarning from './components/TicketWarningComponent/TicketWarningComponent';

import TicketCreator from './components/admin/TicketCreator/TicketCreator';
import EventCreator from './components/admin/EventCreator/EventCreator';
import ArtistCreator from './components/admin/ArtistCreator/ArtistCreator';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/ticket/:id" element={<TicketPage />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/inscriptionsuccess" element={<InscriptionSuccess />} />
          <Route path='/ticketwarning' element={<TicketWarning />} />
          <Route
            path="/myinscriptions"
            element={<MyInscriptions />}
          />

          <Route path='/ticketcreator' element={<TicketCreator />} />
          <Route path='/eventcreator' element={<EventCreator />} />
          <Route path='/artistcreator' element={<ArtistCreator />} />

        </Routes>
      </div>
    </Router>

  );
}

export default App;


