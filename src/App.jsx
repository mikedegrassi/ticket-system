import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Event from './pages/Event';
import Login from './pages/Login';
import Register from './pages/Register';
import InscriptionSuccess from './pages/InscriptionSuccess';
import MyInscriptions from './components/MyInscriptions/MyInscriptions';
import ProfilePage from './components/Profile/Profile';

import MyTicketsPage from './pages/MyTicketsPage';
import TicketPage from './pages/TicketPage';
import TicketWarningPage from './pages/TicketWarningPage';

import TicketCreatorPage from './pages/admin/TicketCreatorPage';
import EventCreatorPage from './pages/admin/EventCreatorPage';
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
          <Route path="/mytickets" element={<MyTicketsPage />} />
          <Route path="/ticket/:id" element={<TicketPage />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/inscriptionsuccess" element={<InscriptionSuccess />} />
          <Route path='/ticketwarning' element={<TicketWarningPage />} />
          <Route
            path="/myinscriptions"
            element={<MyInscriptions />}
          />
          <Route path='/profile' element={<ProfilePage />} />

          <Route path='/ticketcreator' element={<TicketCreatorPage />} />
          <Route path='/eventcreator' element={<EventCreatorPage />} />
          <Route path='/artistcreator' element={<ArtistCreator />} />


        </Routes>
      </div>
    </Router>

  );
}

export default App;


