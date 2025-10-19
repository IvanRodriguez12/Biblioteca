import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h4 className="font-bold text-lg mb-3 text-red-400">Sistema</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/ayuda-soporte" className="hover:text-white transition">Ayuda y soporte</Link></li>
              <li><Link to="/reportar-problema" className="hover:text-white transition">Reportar problema</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-red-400">Información</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <p>📧 Email: bibliotecamagna@gmail.com</p>
              <p>📞 Tel: + 54 362 404 596 2</p>
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