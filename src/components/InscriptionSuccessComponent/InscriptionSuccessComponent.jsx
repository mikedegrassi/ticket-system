import React from 'react';
import './InscriptionSuccessComponent.css';

function InscriptionsSuccess() {
  return (
    <div className="inscription-success-wrapper">
      <div className="success-circle">✓</div>

      <h2>Inschrijving gelukt!</h2>

      <p>
        Je bent ingeschreven voor tickets voor <strong>André Hazes Jr.</strong> op <strong>14 juli 2025</strong>.
      </p>

      <p>
        Je hebt aangegeven <strong>4 tickets</strong> te willen kopen, maar je bent niet verplicht dit aantal daadwerkelijk af te nemen.
        <br />
        Als je aan de beurt bent (geen garantie), ontvang je een sms op <strong>06 12345678</strong>.
      </p>

      <p>
        Vanaf dat moment heb je <strong>48 uur</strong> de tijd om je tickets te kopen.
      </p>
    </div>
  );
}

export default InscriptionsSuccess;
