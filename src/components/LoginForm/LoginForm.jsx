import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabaseClient';
import './LoginForm.css';

function LoginForm() {

    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = form;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setMessage('Login mislukt. Controleer je gegevens.');
        } else {
            setMessage('Inloggen gelukt!');
            setTimeout(() => {
                navigate('/');
            }, 100);
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Inloggen</h2>

                <label htmlFor="email" className="required">E-mailadres</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                />

                <label htmlFor="password" className="required">Wachtwoord</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                />

                <button type="submit" className="login-button">Inloggen</button>

                <p className="register-link">
                    Nog geen account? <a href="/register">Registreer hier</a>.
                </p>

                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
}

export default LoginForm;

