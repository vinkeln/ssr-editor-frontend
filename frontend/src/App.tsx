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
        <Link to="/ssr-editor-frontend/">Home</Link> |{" "}
        <Link to="/create">Create Document</Link> |{" "}
          <Link to="/saved">Saved Documents</Link> |{" "}
        <Link to="/ssr-editor-frontend/list">List Documents</Link> |{" "}
        <Link to="/ssr-editor-frontend/films">Films</Link>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/ssr-editor-frontend/" element={<HomePage />} />
          <Route path="/create" element={<CreateDocs />} />
          <Route path="/saved" element={<SavedDocs />} />
          <Route path="/ssr-editor-frontend/films" element={<FilmsList />} />
          <Route path="/ssr-editor-frontend/list" element={<ListPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
