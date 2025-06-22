import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '../RegisterForm/RegisterForm.css';

function Register() {
    const [form, setForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone_number: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { email, password, firstName, middleName, lastName, phone_number } = form;
      
        // Stap 1: Gebruiker aanmaken
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              firstName,
              middleName,
              lastName,
              phone_number,
            },
          },
        });
      
        if (signUpError) {
          setMessage(signUpError.message);
          return;
        }
      
        const userId = signUpData?.user?.id;
      
        // Stap 2: Profiel aanmaken
        if (userId) {
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              user_id: userId,
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              phone_number: phone_number,
            },
          ]);
      
          if (profileError) {
            setMessage('Account aangemaakt, maar profiel niet opgeslagen: ' + profileError.message);
            return;
          }
      
          setMessage('Registratie succesvol!');
        } else {
          setMessage('Registratie mislukt: gebruikers-ID niet ontvangen.');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h2>Registreren</h2>

                <label htmlFor="firstName">Voornaam <span className="required">*</span></label>
                <input id="firstName" type="text" name="firstName" required value={form.firstName} onChange={handleChange} />

                <label htmlFor="middleName">Tussenvoegsel</label>
                <input id="middleName" type="text" name="middleName" value={form.middleName} onChange={handleChange} />

                <label htmlFor="lastName">Achternaam <span className="required">*</span></label>
                <input id="lastName" type="text" name="lastName" required value={form.lastName} onChange={handleChange} />

                <label htmlFor="email">E-mailadres <span className="required">*</span></label>
                <input id="email" type="email" name="email" required value={form.email} onChange={handleChange} />

                <div className="phone-with-tooltip">
                    <label htmlFor="phone_number">
                        Telefoonnummer <span className="required">*</span>
                        <span
                            className="tooltip-icon"
                            onClick={() => setShowTooltip(!showTooltip)}
                        >
                            ⓘ
                        </span>
                    </label>
                    <input
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        required
                        value={form.phone_number}
                        onChange={handleChange}
                    />
                    {showTooltip && (
                        <div className="tooltip-popup">
                            Uw telefoonnummer wordt alleen gebruikt als back-up voor communicatie.
                        </div>
                    )}
                </div>

                <label htmlFor="password">Wachtwoord <span className="required">*</span></label>
                <input id="password" type="password" name="password" required value={form.password} onChange={handleChange} />

                <button type="submit" className="register-button">Registreren</button>

                <p className="login-link">
                    Al een account? <a href="/login">Log hier in</a>.
                </p>

                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
}

export default Register;
