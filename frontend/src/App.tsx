import { Routes, Route, Link } from "react-router-dom";
import "./styles/App.css";
import Header from "./includes/Header";
import Footer from "./includes/Footer";
import HomePage from "./pages/HomePage";
import CreateDocs from "./pages/CreateDocs";
import SavedDocs from "./pages/SavedDocs";
import FilmsList from "./pages/FilmsList";
import ListPage from "./pages/ListPage";

function App() {
  return (
    <div className="app-container">
      <Header />
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Document</Link> |{" "}
        <Link to="/saved">Saved Documents</Link> |{" "}
        <Link to="/list">List Documents</Link>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateDocs />} />
          <Route path="/saved" element={<SavedDocs />} />
          <Route path="/films" element={<FilmsList />} /> 
          <Route path="/list" element={<ListPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
