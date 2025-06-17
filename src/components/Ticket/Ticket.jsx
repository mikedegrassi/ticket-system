import React, { useEffect, useState } from 'react';
import './Ticket.css';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Printer, MapPin, CreditCard, Share2 } from 'lucide-react';

function TicketPage() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicket = async () => {
            const { data, error } = await supabase
                .from('tickets')
                .select(`
          *,
          event:event_id (
            title,
            date,
            location,
            artist:artist_id (
              name
            )
          )
        `)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Fout bij ophalen ticket:', error);
            } else {
                setTicket(data);
            }

            setLoading(false);
        };

        fetchTicket();
    }, [id]);

    if (loading) return <p>Ticket laden...</p>;
    if (!ticket) return <p>Ticket niet gevonden.</p>;

    return (
        <div className="ticket-page-wrapper">
            <div className="ticket-header-bar">
                <div className="left-icons">
                    <button className="ticket-icon-button"><Printer size={20} /></button>
                    <button className="ticket-icon-button"><MapPin size={20} /></button>
                    <button className="ticket-icon-button"><CreditCard size={20} /></button>
                </div>
                <div className="right-icon">
                    <button className="ticket-icon-button"><Share2 size={20} /></button>
                </div>
            </div>



            <div className="ticket-body">
                <h3>{ticket.event.artist.name}</h3>

                <div className="ticket-info">
                    <div>
                        <p className="label">Datum</p>
                        <p>{new Date(ticket.event.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            weekday: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <div>
                        <p className="label">Locatie</p>
                        <p>{ticket.event.location} 📄</p>
                    </div>
                    <div className="seat-info">
                        <div><span className="label">Vak</span><p>{ticket.vak || 'AJ'}</p></div>
                        <div><span className="label">Rij</span><p>{ticket.rij || '4'}</p></div>
                        <div><span className="label">Stoel</span><p>{ticket.stoel || '13'}</p></div>
                    </div>
                </div>

                <div className="dotted-separator"></div>

                <div className="qr-code">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.qr_code}`} alt="QR Code" />
                </div>
            </div>

            <div className="personalization-footer">
                <p className="label">Personaliseer status</p>
                <div className="status-row">
                    <span><strong>{ticket.personalized_by || 'Onbekend'}</strong></span>
                    <span className="status-ok">{ticket.is_personalized ? 'Gelukt' : 'Niet voltooid'}</span>
                </div>
            </div>
        </div>
    );
}

export default TicketPage;
