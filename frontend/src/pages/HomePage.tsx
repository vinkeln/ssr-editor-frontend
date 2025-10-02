import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../styles/HomePage.scss";
import laptopDocs from "../images/laptop-docs.png";

function HomePage() {
  return (
    <div className="home-container">
      <div className="content">
        <div className="text-section">
          <h1>
            Create DOCS: Free <br /> Online Document Creator.
          </h1>
          <Button 
                component={Link}
                to="/create" className="create-btn">Create a Document</Button>
        </div>

        <div className="image-section">
          <img src={laptopDocs} alt="Laptop with document" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
