// Filename - Header.tsx

import { Link } from "react-router-dom";
// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import "../styles/Header.scss";

export default function Header() {
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

            <Button 
                component={Link}
                to="/films"
                className="header-button"
            >
                Films
            </Button>

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
            </div>
      </Toolbar>
    </AppBar>
  );
}