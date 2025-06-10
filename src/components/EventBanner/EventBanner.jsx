import React from 'react';
import './EventBanner.css';

function EventBanner({ imageUrl, title, label, genre }) {
  return (
    <div className="event-banner" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="event-banner-overlay">
        {label && <div className="event-banner-label">{label}</div>}
        <p>{genre}</p>
        <h1 className="event-banner-title">{title}</h1>
      </div>
    </div>
  );
}

export default EventBanner;
