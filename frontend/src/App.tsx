import { Routes, Route } from "react-router-dom";
import { Header, Footer } from "./includes";
import { HomePage, CreateDocs, SavedDocs, FilmsList, Register, Login } from "./imports";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<ProtectedRoute showAlert={true}>
            <CreateDocs />
          </ProtectedRoute>
         } 
        />
          <Route path="/saved" element={ <ProtectedRoute showAlert={true}>
            <SavedDocs />
          </ProtectedRoute>
          } 
        />
          <Route path="/films" element={<FilmsList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
