import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import '../TicketCreator/TicketCreator.css';

function AdminTicketCreator() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [amount, setAmount] = useState(1);
  const [status, setStatus] = useState('actief');
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('id, location, date');
      if (error) {
        console.error('Fout bij ophalen events:', error);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const tickets = Array.from({ length: amount }).map(() => ({
      event_id: selectedEventId,
      user_id: null, 
      qr_code: crypto.randomUUID(),
      status,
      is_personalized: isPersonalized,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('tickets').insert(tickets);

    if (error) {
      console.error('Fout bij toevoegen tickets:', error);
      setMessage('Fout bij toevoegen tickets');
    } else {
      setMessage(`${amount} tickets succesvol toegevoegd.`);
    }
  };

  return (
    <div className="admin-ticket-creator">
      <h2>Tickets genereren</h2>
      <form onSubmit={handleSubmit}>
        <label>Evenement:</label>
        <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} required>
          <option value="">-- Kies een evenement --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.location} op {event.date}
            </option>
          ))}
        </select>

        <label>Aantal tickets:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="actief">Actief</option>
          <option value="geannuleerd">Geannuleerd</option>
        </select>

        <label>
          Gepersonaliseerd:
          <input
            type="checkbox"
            checked={isPersonalized}
            onChange={(e) => setIsPersonalized(e.target.checked)}
          />
        </label>

        <button type="submit">Genereer tickets</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminTicketCreator;
