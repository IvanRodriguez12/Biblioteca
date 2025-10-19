import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LibrosPage from "./pages/LibrosPage";
import SociosPage from "./pages/SociosPage";
import PrestamosPage from "./pages/PrestamosPage";
import MultasPage from "./pages/MultasPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/libros" element={<LibrosPage />} />
            <Route path="/socios" element={<SociosPage />} />
            <Route path="/prestamos" element={<PrestamosPage />} />
            <Route path="/multas" element={<MultasPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;