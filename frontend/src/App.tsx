import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Header from "./includes/Header";
import HomePage from "./pages/HomePage";
import CreateDocs from "./pages/CreateDocs";
import SavedDocs from "./pages/SavedDocs";

function App() {
  return (
    <>
      <Header />
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Document</Link> |{" "}
        <Link to="/saved">Saved Documents</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateDocs />} />
        <Route path="/saved" element={<SavedDocs />} />
      </Routes>
    </>
  );
}

export default App;
