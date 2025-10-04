import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { LoginFormProps } from "../types/login";
import "../styles/Auth.scss";

export default function LoginForm({ backendUrl }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`${backendUrl}/login`, {
                email,
                password
            }, {
                withCredentials: true // Ensure cookies are sent/received.
            });

            // Store user data in localStorage.
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/'); // Redirect to home or dashboard after login.
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="auth-form"
        >
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}

            <label className="email-label">Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="email-input"
                placeholder="Enter your email"
            />

            <label className="password-label">Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="password-input"
                placeholder="Enter your password"
            />

            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="register-link">
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </form>
    );
}
