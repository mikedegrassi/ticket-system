import React, { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabaseClient';
import './MyTickets.css';
import { Info, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MyTickets() {
    const user = useUser();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchTickets = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select(`
                    *,
                    event:event_id (
                        id,
                        date,
                        location,
                        artist:artist_id (
                            name
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fout bij ophalen tickets:', error);
            } else {
                setTickets(data);
            }

            setLoading(false);
        };

        fetchTickets();
    }, [user]);

    const grouped = tickets.reduce((acc, ticket) => {
        const artistName = ticket.event?.artist?.name || 'Onbekende artiest';
        if (!acc[artistName]) acc[artistName] = [];
        acc[artistName].push(ticket);
        return acc;
    }, {});

    return (
        <div className="my-inscriptions-wrapper">
            <div className="inscriptions-header">
                <h2>Mijn tickets</h2>
                <button className="info-button" onClick={() => setShowPopup(true)}>
                    <Info size={20} />
                </button>
            </div>

            {loading ? (
                <p>Laden...</p>
            ) : tickets.length === 0 ? (
                <p data-testid="no-tickets">Je hebt nog geen tickets.</p>
            ) : (
                Object.entries(grouped).map(([artist, items]) => (
                    <div key={artist} className="artist-group">
                        <h3>{artist}</h3>
                        <ul>
                            {items.map(ticket => (
                                <li key={ticket.id}>
                                    <span>{ticket.event?.date}</span>
                                    <span>{ticket.event?.location}</span>
                                    <button onClick={() => navigate(`/ticket/${ticket.id}`)} className="ticket-icon-button">
                                        <Ticket size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Hoe werkt het ticket systeem?</h3>
                        <p>
                            Zodra je bent geselecteerd, worden jouw tickets zichtbaar op deze pagina.
                        </p>
                        <p>
                            Elk ticket is gekoppeld aan een specifiek evenement. Klik op het ticket icoontje om het te openen.
                        </p>
                        <button className="close-button" onClick={() => setShowPopup(false)}>
                            Sluiten
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyTickets;
