// Filename - Header.js

// importing material UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// import Box from "@material-ui/core/Box/Box";

export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                {/*Inside the IconButton, we 
                    can render various icons*/}
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    {/*This is a simple Menu 
                      Icon wrapped in Icon */}
                    <MenuIcon />
                </IconButton>
                {/* The Typography component applies 
                     default font weights and sizes */}

                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, color: "yellow" }}
                >
                    Group L & J Header
                </Typography>
                    <Button 
                    color="inherit"
                    sx={{ 
                        color: "white",
                        "&:hover": { backgroundColor: "transparent", boxShadow: "none", textDecoration: "underline" }
                    }}
                    >
                    Documents
                    </Button>

                    <Button 
                    color="inherit"
                    sx={{ 
                        color: "white",
                        "&:hover": { backgroundColor: "transparent", boxShadow: "none", textDecoration: "underline" }
                    }}
                    >
                    Register
                    </Button>

                    <Button 
                    color="inherit"
                    sx={{ 
                        color: "white",
                        "&:hover": { backgroundColor: "transparent", boxShadow: "none", textDecoration: "underline" }
                    }}
                    >
                    Login
                    </Button>
            </Toolbar>
        </AppBar>
    );
}