import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import CreateDocs from "./pages/CreateDocs";

function App() {
  return (
    <>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Document</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateDocs />} />
      </Routes>
    </>
  );
}

export default App;
