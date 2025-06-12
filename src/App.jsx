import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Event from './pages/Event';
import Login from './pages/Login';
import Register from './pages/Register';
import InscriptionSuccess from './pages/InscriptionSuccess';
import GuestRoute from './components/routes/GuestRoute';
import PrivateRoute from './components/routes/PrivateRoute';

function App() {
  return (
    <>
  <Header />
  <div className="container">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route path="/" element={<Home />} />
      <Route path="/event/:id" element={<PrivateRoute><Event /></PrivateRoute>} />
      <Route path="/inscriptionsuccess" element={<PrivateRoute><InscriptionSuccess /></PrivateRoute>} />
    </Routes>
  </div>
</>

  );
}


export default App;


