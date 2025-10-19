import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalSocios: 0,
    prestamosActivos: 0,
    multasPendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Aquí irán las llamadas a tu backend
      const [librosRes, sociosRes, prestamosRes, multasRes] = await Promise.all([
        fetch("http://localhost:3001/api/libros"),
        fetch("http://localhost:3001/api/socios"),
        fetch("http://localhost:3001/api/prestamos"),
        fetch("http://localhost:3001/api/multas"),
      ]);

      if (!librosRes.ok || !sociosRes.ok || !prestamosRes.ok || !multasRes.ok) {
        throw new Error("Error al obtener datos del servidor");
      }

      const libros = await librosRes.json();
      const socios = await sociosRes.json();
      const prestamos = await prestamosRes.json();
      const multas = await multasRes.json();

      setStats({
        totalLibros: libros.length || 0,
        totalSocios: socios.length || 0,
        prestamosActivos: prestamos.filter(p => p.estadoPrestamo === "ACTIVO").length || 0,
        multasPendientes: multas.filter(m => m.estado === "ACTIVA").length || 0,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Control - Bibliotecario</h1>
          <p className="text-gray-600 mt-1">Sistema de gestión de biblioteca</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Libros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLibros}</p>
              </div>
              <div className="text-4xl opacity-20">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Socios Registrados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSocios}</p>
              </div>
              <div className="text-4xl opacity-20">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Préstamos Activos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prestamosActivos}</p>
              </div>
              <div className="text-4xl opacity-20">🔁</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Multas Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.multasPendientes}</p>
              </div>
              <div className="text-4xl opacity-20">⚠️</div>
            </div>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Libros */}
          <Link 
            to="/libros" 
            className="group bg-white rounded-lg shadow-md p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Libros</h3>
                <p className="text-gray-600">Agregar, editar, buscar y eliminar libros del catálogo</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">📚</div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4">
              <li>• Crear nuevo libro</li>
              <li>• Editar información</li>
              <li>• Ver disponibilidad</li>
            </ul>
          </Link>

          {/* Socios */}
          <Link 
            to="/socios" 
            className="group bg-white rounded-lg shadow-md p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Socios</h3>
                <p className="text-gray-600">Administrar miembros y sus datos de afiliación</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">👥</div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4">
              <li>• Registrar nuevo socio</li>
              <li>• Actualizar datos</li>
              <li>• Ver historial</li>
            </ul>
          </Link>

          {/* Préstamos */}
          <Link 
            to="/prestamos" 
            className="group bg-white rounded-lg shadow-md p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Préstamos</h3>
                <p className="text-gray-600">Controlar préstamos activos y registrar devoluciones</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">🔁</div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4">
              <li>• Crear nuevo préstamo</li>
              <li>• Registrar devolución</li>
              <li>• Ver préstamos activos</li>
            </ul>
          </Link>

          {/* Multas */}
          <Link 
            to="/multas" 
            className="group bg-white rounded-lg shadow-md p-8 hover:shadow-2xl transition-all duration-300 border-l-4 border-red-500 transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestionar Multas</h3>
                <p className="text-gray-600">Administrar sanciones por demora y registrar pagos</p>
              </div>
              <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">⚠️</div>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4">
              <li>• Ver multas pendientes</li>
              <li>• Registrar pago</li>
              <li>• Cancelar multa</li>
            </ul>
          </Link>
        </div>
      </div>
    </div>
  );
}