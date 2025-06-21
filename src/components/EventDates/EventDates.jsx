import React, { useEffect, useState } from 'react';
import './EventDates.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

function EventDates({ eventId }) {
    const [dates, setDates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(1);
    const navigate = useNavigate();
    const user = useUser();

    useEffect(() => {
        const fetchDates = async () => {
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

    const handleInscription = async (item) => {
        if (!user) return;

        const { error } = await supabase
            .from('inscriptions')
            .insert({
                user_id: user.id,
                event_id: item.id,
                expected_amount: selectedAmount,
                status: 'pending',
            });

        if (error) {
            console.error('Fout bij opslaan van inschrijving:', error);
            return;
        }

        navigate('/inscriptionsuccess', {
            state: {
                name: item.artist.name,
                date: item.date,
                expectedTickets: selectedAmount,
                phoneNumber: user.user_metadata.phone_number,
            },
        });
    };

    return (
        <div className="event-dates-wrapper">
            <h2>Beschikbare data</h2>
            {dates.length === 0 ? (
                <p>Geen data beschikbaar voor dit evenement.</p>
            ) : (
                dates.map((item, index) => {
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
                                        Kies het verwachte aantal tickets u denkt te kopen (max. {item.max_tickets_per_user}). U bent niet verplicht dit aantal uiteindelijk te kopen.
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
                                                onClick={() =>
                                                    setSelectedAmount(prev => Math.min(item.max_tickets_per_user, prev + 1))
                                                }
                                                disabled={selectedAmount === item.max_tickets_per_user}
                                                className={
                                                    selectedAmount === item.max_tickets_per_user ? 'disabled highlight' : ''
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                        <button
                                            onClick={() => handleInscription(item)}
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
