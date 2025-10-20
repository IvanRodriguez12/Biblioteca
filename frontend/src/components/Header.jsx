import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <nav className="bg-red-700 text-white shadow-lg">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Nombre */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition flex-shrink-0">
            <img 
              src="/icono.png" 
              alt="Biblioteca Magna" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="font-bold text-xl tracking-wide">Biblioteca Magna</div>
              <div className="text-xs opacity-90">Panel Bibliotecario</div>
            </div>
          </Link>

          {/* Navegación a la derecha */}
          <div className="flex items-center gap-8">
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

            {/* Botón Inicio */}
            {!isHomePage && (
              <Link to="/" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded font-semibold transition flex-shrink-0">
                ← Inicio
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}