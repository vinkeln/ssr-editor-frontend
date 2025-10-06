/* Testing components/RegisterForm.tsx
With vitest and react-testing-library
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import RegisterForm from '../components/RegisterForm';

// Mock axiosn and react-router-dom.
vi.mock('axios');
const mockedNavigate = vi.fn(); //vi.fn() creates a mock function.

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const MockRegisterForm = ({ backendUrl = 'http://localhost:3001' } = {}) => (
    <BrowserRouter>
        <RegisterForm backendUrl={backendUrl} />
    </BrowserRouter>
);

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mock calls before each test.
  });

  it('Renders the register form with all fields and the submit button', () => {
    render(<MockRegisterForm />);

    // Check for form elements. Register is the heading text and the button text.
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter a password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('Updates name, email, and password fields on user input', () => {
    render(<MockRegisterForm />);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter a password/i);

    // Simulating user input.
    fireEvent.change(nameInput, { target: { value: 'Lich23' } });
    fireEvent.change(emailInput, { target: { value: 'lich23@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  });

  it('Submits form with correct data when register button is selected and clicked', async () => {
    const mockedPost = vi.mocked(axios.post);
    mockedPost.mockResolvedValueOnce({ data: {} }); // Mock resolved value for axios.post.

    render(<MockRegisterForm backendUrl= 'http://backend.com' />);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter a password/i);
    
    // Simulating user input.
    fireEvent.change(nameInput, { target: { value: 'Lich23' } });
    fireEvent.change(emailInput, { target: { value: 'lich23@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      // Check that axios.post was called with the correct URL and data.
      expect(mockedPost).toHaveBeenCalledWith(
        'http://backend.com/api/auth/register',
        {
          name: 'Lich23',
          email: 'lich23@example.com',
          password: 'password123'
        },
        {
          withCredentials: true
        }
      );
    });
  });

  it('Displays error message on registration failure', async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
        response: { data: { message: 'Registration failed' } }
    });

    render(<MockRegisterForm />);

    const nameInput = screen.getByPlaceholderText(/enter your name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter a password/i);

    // Simulating user input.
    fireEvent.change(nameInput, { target: { value: 'Lich23' } });
    fireEvent.change(emailInput, { target: { value: 'lich23@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the error message to appear.
    await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument();
        });
    });
});