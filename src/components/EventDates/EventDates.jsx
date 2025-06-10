import React, { useState } from 'react';
import './EventDates.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Dummy data (tijdelijk, later kun je dit vervangen met echte API data)
const eventData = {
    Rotterdam: [
        {
            date: "14 JUL",
            dayTime: "za - 18:00",
            venue: "Rotterdam Ahoy",
            artist: "André Hazes JR."
        },
        {
            date: "15 JUL",
            dayTime: "zo - 20:00",
            venue: "Rotterdam Ahoy",
            artist: "André Hazes JR."
        }
    ],
    Amsterdam: [
        {
            date: "20 JUL",
            dayTime: "do - 19:30",
            venue: "Ziggo Dome",
            artist: "André Hazes JR."
        }
    ]
};

function EventDates({ eventId }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(1);
    const navigate = useNavigate();

    return (
        <div className="event-dates-wrapper">
            <h2>Beschikbare data</h2>
            {Object.entries(eventData).map(([location, dates]) => (
                <div key={location} className="location-group">
                    <h3>{location}</h3>
                    {dates.map((item, index) => {
                        const isSelected = selectedIndex === `${location}-${index}`;
                        return (
                            <div key={index} className="event-line">
                                <div className="event-date">{item.date}</div>

                                {!isSelected ? (
                                    <>
                                        <div className="event-info">
                                            <p>{item.dayTime}</p>
                                            <p>{item.venue}</p>
                                            <p className="artist-name">{item.artist}</p>
                                        </div>
                                        <button
                                            className="inschrijven-button"
                                            onClick={() => setSelectedIndex(`${location}-${index}`)}
                                        >
                                            Tickets
                                        </button>
                                    </>
                                ) : (
                                    <div className="ticket-select-box">
                                        <p>
                                            Kies het verwachte aantal tickets u denkt te kopen (max. 4). U bent niet verplicht dit aantal uiteindelijk te kopen.
                                        </p>
                                        <div className="ticket-selector-controls">
                                            <button
                                                onClick={() => setSelectedIndex(null)}
                                                className="back-button"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <div className="ticket-counter">
                                                <button
                                                    onClick={() => setSelectedAmount(prev => Math.max(1, prev - 1))}
                                                    disabled={selectedAmount === 1}
                                                    className={selectedAmount === 1 ? 'disabled' : ''}
                                                >
                                                    −
                                                </button>
                                                <span>{selectedAmount}</span>
                                                <button
                                                    onClick={() => setSelectedAmount(prev => Math.min(4, prev + 1))}
                                                    disabled={selectedAmount === 4}
                                                    className={selectedAmount === 4 ? 'disabled highlight' : ''}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => navigate('/inschrijving')}
                                                className="submit-button"
                                            >
                                                Inschrijven
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default EventDates;
