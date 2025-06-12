import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './EventSlider.css';

function EventSlider() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('events').select('*');

      console.log(data);
      

      if (error) {
        console.error('Fout bij het ophalen van evenementen:', error);
      } else {
        console.log(data);
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-slider">
      {events.map(event => (
        <div
          key={event.id}
          className="event-card"
          onClick={() => navigate(`/event/${event.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img src={event.image_url} alt={event.title} className="event-image" />
          <div className="event-genre">{event.genre}</div>
          <h3 className="event-title">{event.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default EventSlider;

