import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-3 border-b border-red-600">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-red-700 font-bold text-2xl">📚</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-lg tracking-wide">BIBLIOTECA</div>
              <div className="text-xs opacity-90">Panel Bibliotecario</div>
            </div>
          </Link>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-8">
            <NavLink 
              to="/libros"
              className={({isActive}) => `hover:text-red-200 transition pb-1 text-base font-semibold ${isActive ? "font-bold border-b-2 border-white" : ""}`}
            >
              📚 Libros
            </NavLink>
            <NavLink 
              to="/socios"
              className={({isActive}) => `hover:text-red-200 transition pb-1 text-base font-semibold ${isActive ? "font-bold border-b-2 border-white" : ""}`}
            >
              👥 Socios
            </NavLink>
            <NavLink 
              to="/prestamos"
              className={({isActive}) => `hover:text-red-200 transition pb-1 text-base font-semibold ${isActive ? "font-bold border-b-2 border-white" : ""}`}
            >
              🔁 Préstamos
            </NavLink>
            <NavLink 
              to="/multas"
              className={({isActive}) => `hover:text-red-200 transition pb-1 text-base font-semibold ${isActive ? "font-bold border-b-2 border-white" : ""}`}
            >
              ⚠️ Multas
            </NavLink>
          </div>
          
          {!isHomePage && (
            <Link to="/" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded font-semibold transition">
              ← Inicio
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}