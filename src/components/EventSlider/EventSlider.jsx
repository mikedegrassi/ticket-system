import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventSlider.css';

const events = [
  {
    id: 1,
    title: "Concert A",
    genre: "Pop",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "Festival B",
    genre: "Dance",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "Comedy Show C",
    genre: "Comedy",
    imageUrl: "https://placehold.co/600x400",
  },
];

function EventSlider() {
  const navigate = useNavigate();

  return (
    <div className="event-slider">
      {events.map(event => (
        <div
          key={event.id}
          className="event-card"
          onClick={() => navigate(`/event/${event.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <img src={event.imageUrl} alt={event.title} className="event-image" />
          <div className="event-genre">{event.genre}</div>
          <h3 className="event-title">{event.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default EventSlider;

