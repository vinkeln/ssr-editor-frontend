/* Testing components/LoginForm.tsxx
With vitest and react-testing-library
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/LoginForm';

// Mock axios and react-router-dom.
vi.mock('axios');
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const MockLoginForm = ({ backendUrl = 'http://localhost:1337' }) => (
  <BrowserRouter>
    <LoginForm backendUrl={backendUrl} />
  </BrowserRouter>
);

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('Renders login form', () => {
    render(<MockLoginForm />);

    // Uses more selectors, due to login is header and button.
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  // Tests form input changes from the placeholder text.
  it('Updates email and password fields on user input', () => {
    render(<MockLoginForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  // Tests error when entering wrong or empty credentials.
  it('Shows error when submitting empty form', async () => {
    render(<MockLoginForm />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it('Disables submit button and shows loading text during submission', async () => {
    // Mock axios to delay response
    vi.mocked(axios.post).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<MockLoginForm />);

    // Fill form using placeholder text instead of labels
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    
    fireEvent.change(emailInput, { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(passwordInput, { 
      target: { value: 'password123' } 
    });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Logging in...');

    // Wait for promise to resolve
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Login');
    });
  });
});