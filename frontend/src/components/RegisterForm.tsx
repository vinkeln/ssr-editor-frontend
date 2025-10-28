import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormProps } from "../types/register";
import "../styles/Auth.scss";

export default function RegisterForm({ backendUrl }: RegisterFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(''); // To display error messages.
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/api/auth/register`, {
                email,
                password,
                name
            }, {
                withCredentials: true // Ensure cookies are sent/received
            });

            console.log('Registration successful:', response.data);

            // Save user data to localStorage.
            const userData = {
                email: email,
                name: name,
                userId: response.data.userId
            };
            localStorage.setItem('user', JSON.stringify(userData));

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            window.dispatchEvent(new Event('userLogin'));
            navigate('/'); // Redirect to home page after successful registration.

        } catch (err: any) {
        console.error('Registration error:', err);
        if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
            setError('Cannot connect to server. Make sure backend is running.');
        } else {
            setError(err.response?.data?.error || 'Registration failed');
        }
    } finally {
        setLoading(false);
    }
};

    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form"
        >
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}

            <label className="name-label">Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="name-input"
                placeholder='Enter your name'
            />

            <label className="email-label">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
                placeholder='Enter your email'
            />

            <label className="password-label">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
                placeholder='Enter a password'
            />

            <button
                type="submit"
                className="submit-button"
                disabled={loading}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
}