import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 mb-6">
          <div>
            <h4 className="font-bold text-lg mb-3 text-red-400">Sistema</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition">Acerca del sistema</a></li>
              <li><a href="#" className="hover:text-white transition">Ayuda y soporte</a></li>
              <li><a href="#" className="hover:text-white transition">Reportar problema</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-red-400">Módulos</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/libros" className="hover:text-white transition">Gestión de Libros</Link></li>
              <li><Link to="/socios" className="hover:text-white transition">Gestión de Socios</Link></li>
              <li><Link to="/prestamos" className="hover:text-white transition">Gestión de Préstamos</Link></li>
              <li><Link to="/multas" className="hover:text-white transition">Gestión de Multas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-red-400">Información</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>📧 Email: admin@biblioteca.com</p>
              <p>📞 Tel: (123) 456-7890</p>
              <p className="text-xs text-gray-500 mt-3">© 2025 Sistema de Gestión Bibliotecario</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          <p>Sistema exclusivo para bibliotecarios - Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}