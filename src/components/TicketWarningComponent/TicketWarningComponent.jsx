import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketWarningComponent.css';

function TicketWarning() {
  const navigate = useNavigate();

  return (
    <div className="ticket-warning-wrapper">
      <div className="warning-circle">⚠️</div>

      <h2>Let op!</h2>

      <p>
        Uw tickets zijn <strong>nog niet gepersonaliseerd</strong>.  
        U kunt dit nu direct doen, of later via de pagina <strong>“Mijn Tickets”</strong>.
      </p>

      <p>
        Kaarten kunnen eventueel worden doorverkocht via <strong>Ticketswap</strong>.
      </p>

      <button
        onClick={() => navigate('/personaliseer')}
        className="personalize-button"
      >
        Personaliseer nu
      </button>

      <p className="return-home-link" onClick={() => navigate('/')}>
        of terug naar homepage
      </p>
    </div>
  );
}

export default TicketWarning;

