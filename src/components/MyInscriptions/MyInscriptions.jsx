import React, { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabaseClient';
import './MyInscriptions.css';
import { Info } from 'lucide-react';

function MyInscriptions() {
  const user = useUser();
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchInscriptions = async () => {
      const { data, error } = await supabase
        .from('inscriptions')
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
        console.error('Fout bij ophalen inschrijvingen:', error);
      } else {
        setInscriptions(data);
      }

      setLoading(false);
    };

    fetchInscriptions();
  }, [user]);

  const grouped = inscriptions.reduce((acc, ins) => {
    const artistName = ins.event?.artist?.name || 'Onbekende artiest';
    if (!acc[artistName]) acc[artistName] = [];
    acc[artistName].push(ins);
    return acc;
  }, {});

  return (
    <div className="my-inscriptions-wrapper">
      <div className="inscriptions-header">
        <h2>Mijn inschrijvingen</h2>
        <button className="info-button" onClick={() => setShowPopup(true)}>
          <Info size={20} />
        </button>
      </div>

      {loading ? (
        <p>Laden...</p>
      ) : inscriptions.length === 0 ? (
        <p>Je hebt nog geen inschrijvingen.</p>
      ) : (
        Object.entries(grouped).map(([artist, items]) => (
          <div key={artist} className="artist-group">
            <h3>{artist}</h3>
            <ul>
              {items.map(ins => (
                <li key={ins.id}>
                  <span>{ins.event?.date}</span>
                  <span>{ins.event?.location}</span>
                  <span>Status: {ins.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Hoe werkt de inschrijving?</h3>
            <p>
              <strong>Inschrijven voor het evenement</strong><br />
              Zodra de inschrijving opent, kun je je aanmelden voor het evenement van jouw keuze.
            </p>
            <p>
            <strong>Aantal tickets kiezen</strong><br />
              Tijdens het inschrijven geef je aan hoeveel tickets je verwacht te kopen (max. 4). 
              Dit is niet bindend: je mag uiteindelijk minder kopen, maar niet meer dan het opgegeven aantal.
            </p>
            <p>
            <strong>Wachten op bevestiging</strong><br />
              Na de inschrijfperiode hoor je automatisch via sms of je tickets mag kopen. 
              Let op: het is niet gegarandeerd dat je aan de beurt komt.
            </p>
            <p>
            <strong>Tickets kopen</strong><br />
              Als je wordt geselecteerd, heb je 48 uur de tijd om je tickets te kopen.
            </p>
            <p>
            <strong>Tickets terugvinden</strong><br />
              Gekochte tickets ontvang je per e-mail en je vindt ze ook terug op de pagina “Mijn Tickets”.
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

export default MyInscriptions;

