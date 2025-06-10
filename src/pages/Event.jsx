
import React from 'react';
import { useParams } from 'react-router-dom';
import EventBanner from '../components/EventBanner/EventBanner';
import EventDates from '../components/EventDates/EventDates';

const eventData = [
  {
    id: 1,
    title: 'Concert A',
    genre: 'Pop',
    imageUrl: '/images/banner.png',
  },
  {
    id: 2,
    title: 'Festival B',
    genre: 'Dance',
    imageUrl: '/images/banner.png',
  },
  {
    id: 3,
    title: 'Comedy Show C',
    genre: 'Comedy',
    imageUrl: '/images/banner.png',
  }
];

function Event() {
  const { id } = useParams();
  const event = eventData.find(e => e.id === parseInt(id));

  if (!event) return <p>Event niet gevonden.</p>;

  return (
    <div>
      <EventBanner title={event.title} imageUrl={event.imageUrl} genre={event.genre} />
      <EventDates eventId={id} />
    </div>
  );
}

export default Event;

