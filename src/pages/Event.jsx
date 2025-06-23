import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import EventDates from '../components/EventDates/EventDates';
import EventBanner from '../components/EventBannerCard/EventBannerCard';

function Event() {
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Fout bij het ophalen van het event:', error);
            } else {
                setEvent(data);
            }

            setLoading(false);
        };

        if (id) fetchEvent();
    }, [id]);

    if (loading) return <p>Evenement aan het laden...</p>;
    if (!event) return <p>Evenement niet gevonden.</p>;

    return (
        <div>
            <EventBanner title={event.title} imageUrl={event.image_url} genre={event.genre} />
            <EventDates eventId={event.id} />
        </div>
    );
}

export default Event;

