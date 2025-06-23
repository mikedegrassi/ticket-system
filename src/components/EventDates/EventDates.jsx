import React, { useEffect, useState, useMemo } from 'react';
import './EventDates.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

function EventDates({ eventId }) {
    const [dates, setDates] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(1);
    const [countdowns, setCountdowns] = useState({});
    const [userInscriptions, setUserInscriptions] = useState([]);
    const navigate = useNavigate();
    const user = useUser();

    useEffect(() => {
        const fetchDates = async () => {
            const { data, error } = await supabase
                .from('events')
                .select(`*, artist:artist_id ( name )`)
                .eq('id', eventId);

            if (error) {
                console.error('Fout bij ophalen van event data:', error);
            } else {
                setDates(data);
            }
        };

        if (eventId) fetchDates();
    }, [eventId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newCountdowns = {};

            dates.forEach(event => {
                const now = new Date();
                const end = new Date(event.registration_end);
                const diff = end - now;

                if (diff > 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    newCountdowns[event.id] = `${hours}u ${minutes}min ${seconds}s`;
                } else {
                    newCountdowns[event.id] = null;
                }
            });

            setCountdowns(newCountdowns);
        }, 1000);

        return () => clearInterval(interval);
    }, [dates]);

    useEffect(() => {
        const fetchUserInscriptions = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from('inscriptions')
                .select('event_id')
                .eq('user_id', user.id);

            if (!error && data) {
                setUserInscriptions(data.map(d => d.event_id));
            }
        };

        fetchUserInscriptions();
    }, [user]);

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
                    const now = new Date();
                    const start = new Date(item.registration_start);
                    const end = new Date(item.registration_end);
                    const isBeforeStart = now < start;
                    const isAfterEnd = now > end;
                    const isAlreadyRegistered = userInscriptions.includes(item.id);

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
                                    <div className="event-actions">
                                        {isAlreadyRegistered ? (
                                            <button
                                                className="inschrijven-button"
                                                disabled
                                                style={{
                                                    backgroundColor: 'green',
                                                    color: 'white',
                                                    cursor: 'default'
                                                }}
                                            >
                                                Voltooid
                                            </button>
                                        ) : (
                                            <button
                                                className="inschrijven-button"
                                                onClick={() => setSelectedIndex(index)}
                                                disabled={isBeforeStart || isAfterEnd}
                                                style={{
                                                    backgroundColor: isAfterEnd ? '#ccc' : '',
                                                    cursor: isAfterEnd ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {isAfterEnd ? 'Gesloten' : 'Inschrijven'}
                                            </button>
                                        )}
                                        {isBeforeStart ? (
                                            <p className="event-status">Inschrijven begint: {start.toLocaleString('nl-NL')}</p>
                                        ) : isAfterEnd ? (
                                            <p className="event-status">Inschrijving gesloten</p>
                                        ) : (
                                            <p className="event-status" style={{ color: 'red', fontSize: '0.9rem' }}>
                                                {countdowns[item.id]}
                                            </p>
                                        )}
                                    </div>
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
