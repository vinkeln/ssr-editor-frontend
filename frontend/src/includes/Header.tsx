// Filename - Header.tsx

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import type { User } from "../types/user";
import "../styles/Header.scss";


export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

        useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error with user data:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const userData = localStorage.getItem('user');
            setUser(userData ? JSON.parse(userData) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

        useEffect(() => {
            const handleUserLogin = () => {
            const userData = localStorage.getItem('user');
            setUser(userData ? JSON.parse(userData) : null);
        };

        window.addEventListener('userLogin', handleUserLogin);
        return () => window.removeEventListener('userLogin', handleUserLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Uppdatera state
        setUser(null);
        
        // Redirect till login
        navigate('/login');
    };

    return (
        <AppBar position="static" className="header">

            <Toolbar className="toolbar">
                <Button 
                component={Link}
                to="/"
                className="header-brand"
            >
                <h3 className="header-title">Document Management System</h3>
            </Button>

            <div className="header-nav">
            <Button 
                component={Link}
                to="/create"
                className="header-button"
            >
                Create Document
            </Button>

            <Button 
                component={Link}
                to="/saved"
                className="header-button"
            >
                Saved Documents
            </Button>

            {user ? (
                    <>
                        <a
                            className="header-button"
                        >   
                            User: {user.name || user.email}
                        </a>

                        <Button 
                            onClick={handleLogout}
                            className="header-button"
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Button 
                            component={Link}
                            to="/register"
                            className="header-button"
                        >
                            Register
                        </Button>

                        <Button 
                            component={Link}
                            to="/login"
                            className="header-button"
                        >
                            Login
                        </Button>
                    </>
                    )}
            </div>
      </Toolbar>
    </AppBar>
  );
}