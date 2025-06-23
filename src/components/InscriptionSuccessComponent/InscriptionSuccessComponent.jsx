import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InscriptionSuccessComponent.css';

function InscriptionSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const { name, date, expectedTickets, phoneNumber } = state;

  return (
    <div className="inscription-success-wrapper">
      <div className="success-circle">✓</div>

      <h2>Inschrijving gelukt!</h2>

      <p>
        Je bent ingeschreven voor tickets voor <strong>{name}</strong> op <strong>{date}</strong>.
      </p>

      <p>
        Je hebt aangegeven <strong>{expectedTickets} tickets</strong> te willen kopen, maar je bent niet verplicht dit aantal daadwerkelijk af te nemen.
        <br />
        Als je aan de beurt bent (geen garantie), ontvang je een sms op <strong>{phoneNumber}</strong>.
      </p>

      <p>
        Vanaf dat moment heb je <strong>48 uur</strong> de tijd om je tickets te kopen.
      </p>

      <button
        onClick={() => navigate('/')}
        className="back-to-home-button"
      >
        Terug naar homepage
      </button>
    </div>
  );
}

export default InscriptionSuccess;
