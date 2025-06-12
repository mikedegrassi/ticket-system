import React, { useEffect, useState } from 'react';
import './EventDates.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

function EventDates({ eventId }) {
  const [dates, setDates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDates = async () => {

        console.log(eventId);
        
        const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          artist:artist_id (
            name
          )
        `)
        .eq('id', eventId);
      

      if (error) {
        console.error('Fout bij ophalen van event data:', error);
      } else {
        setDates(data);
      }
    };

    if (eventId) fetchDates();
  }, [eventId]);

  return (
    <div className="event-dates-wrapper">
      <h2>Beschikbare data</h2>
      {dates.length === 0 ? (
        <p>Geen data beschikbaar voor dit evenement.</p>
      ) : (
        dates.map((item, index) => {
            console.log(item)
          const isSelected = selectedIndex === index;
          return (
            <div key={item.id} className="event-line">
              <div className="event-date">{item.date}</div>

              {!isSelected ? (
                <>
                  <div className="event-info">
                    <p>{item.location}</p>
                    <p>{item.date}</p>
                    <p className="artist-name">{item.artist.name}</p>
                  </div>
                  <button
                    className="inschrijven-button"
                    onClick={() => setSelectedIndex(index)}
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
                      onClick={() => navigate('/inscriptionsuccess')}
                      className="submit-button"
                    >
                      Inschrijven
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default EventDates;

