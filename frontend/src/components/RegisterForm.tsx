import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormProps } from "../types/register";

export default function RegisterForm({ backendUrl }: RegisterFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(''); // To display error messages.
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post(`${backendUrl}/register`, {
                email,
                password,
                name
            });
            // On successful registration, navigate to login page.
            navigate('/login'); // Adjust the path as necessary.
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="register-form"
        >
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}

            <label className="-name-label">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="-name-input"
            />

            <label className="email-label">Email</label>'
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
            />

            <label className="password-label">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
            />

            <button
                type="submit"
                className="submit-button"
            >
                Register
            </button>
        </form>
    );
}