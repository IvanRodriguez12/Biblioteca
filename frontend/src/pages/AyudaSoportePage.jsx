import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AyudaSoportePage() {
  const [seccionAbierta, setSeccionAbierta] = useState("que-es");

  const toggleSeccion = (seccion) => {
    setSeccionAbierta(seccionAbierta === seccion ? null : seccion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            overflow: hidden;
          }
          to {
            opacity: 1;
            max-height: 500px;
            overflow: visible;
          }
        }
        
        .accordion-content {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Ayuda y Soporte</h1>
          <p className="text-gray-600 text-lg">Conoce cómo funciona el sistema y sus limitaciones</p>
        </div>

        {/* Sección: Qué es el Sistema */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSeccion("que-es")}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold text-gray-900 text-left">¿Qué es este sistema?</h2>
            <span className={`text-2xl transition transform ${seccionAbierta === "que-es" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {seccionAbierta === "que-es" && (
            <div className="px-6 py-4 border-t border-gray-200 text-gray-700 space-y-4 accordion-content">
              <p>
                <strong>Biblioteca Magna</strong> es un sistema completo de gestión bibliotecaria diseñado para administrar 
                de manera eficiente todos los aspectos de una biblioteca moderna.
              </p>
              <p>
                El sistema está pensado exclusivamente para bibliotecarios y personal administrativo de la biblioteca, 
                permitiéndoles controlar el inventario, gestionar socios, registrar préstamos y administrar multas.
              </p>
            </div>
          )}
        </div>

        {/* Sección: Módulos Principales */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSeccion("modulos")}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold text-gray-900 text-left">Módulos Principales</h2>
            <span className={`text-2xl transition transform ${seccionAbierta === "modulos" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {seccionAbierta === "modulos" && (
            <div className="px-6 py-4 border-t border-gray-200 text-gray-700 space-y-4 accordion-content">
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">📚 Gestión de Libros</h3>
                  <p className="text-sm mt-1">Permite agregar, editar, eliminar y visualizar todos los libros del catálogo. 
                  Puedes registrar el título, autor, ISBN y estado de cada libro.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">👥 Gestión de Socios</h3>
                  <p className="text-sm mt-1">Administra los datos de los miembros de la biblioteca, incluyendo nombre, 
                  DNI, email, teléfono y número de socio (generado automáticamente).</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">🔁 Gestión de Préstamos</h3>
                  <p className="text-sm mt-1">Registra los préstamos de libros a socios, especificando fechas de inicio 
                  y vencimiento. Permite registrar devoluciones y detecta automáticamente retrasos.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">⚠️ Gestión de Multas</h3>
                  <p className="text-sm mt-1">Administra sanciones por retraso, daño o pérdida de libros. Permite crear multas, 
                  filtrar por estado y registrar pagos.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección: Características Principales */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSeccion("caracteristicas")}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold text-gray-900 text-left">Características Principales</h2>
            <span className={`text-2xl transition transform ${seccionAbierta === "caracteristicas" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {seccionAbierta === "caracteristicas" && (
            <div className="px-6 py-4 border-t border-gray-200 text-gray-700 space-y-3 accordion-content">
              <ul className="space-y-2">
                <li className="flex gap-2">✓ <span>Panel principal con estadísticas en tiempo real</span></li>
                <li className="flex gap-2">✓ <span>CRUD completo para libros, socios, préstamos y multas</span></li>
                <li className="flex gap-2">✓ <span>Detección automática de retrasos en préstamos</span></li>
                <li className="flex gap-2">✓ <span>Generación automática de números de socio</span></li>
                <li className="flex gap-2">✓ <span>Filtrado de datos por estado (activo, pagado, etc.)</span></li>
                <li className="flex gap-2">✓ <span>Interfaz intuitiva y fácil de usar</span></li>
                <li className="flex gap-2">✓ <span>Datos organizados en tablas ordenadas</span></li>
                <li className="flex gap-2">✓ <span>Sistema de modales para crear y editar registros</span></li>
              </ul>
            </div>
          )}
        </div>

        {/* Sección: Restricciones y Limitaciones */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSeccion("restricciones")}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold text-gray-900 text-left">Restricciones y Limitaciones</h2>
            <span className={`text-2xl transition transform ${seccionAbierta === "restricciones" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {seccionAbierta === "restricciones" && (
            <div className="px-6 py-4 border-t border-gray-200 text-gray-700 space-y-3 accordion-content">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3">
                <p className="font-semibold text-yellow-800">⚠️ Importante: Este sistema está diseñado exclusivamente para uso interno de bibliotecarios.</p>
              </div>
              <ul className="space-y-3">
                <li>
                  <strong>DNI Único:</strong> No es posible registrar dos socios con el mismo DNI.
                </li>
                <li>
                  <strong>Número de Socio Único:</strong> Cada socio tiene un número único, generado automáticamente.
                </li>
                <li>
                  <strong>Libros en Préstamo:</strong> Un libro no puede ser prestado dos veces simultáneamente.
                </li>
                <li>
                  <strong>Préstamos Activos:</strong> Solo se pueden registrar devoluciones de préstamos que estén en estado ACTIVO.
                </li>
                <li>
                  <strong>Acceso Restringido:</strong> El sistema no tiene autenticación, por lo que debe estar en una red segura.
                </li>
                <li>
                  <strong>Formato de Fechas:</strong> Las fechas deben estar en formato YYYY-MM-DD (2024-12-31).
                </li>
                <li>
                  <strong>Eliminación de Datos:</strong> Eliminar un socio eliminará todos sus préstamos y multas asociadas.
                </li>
                <li>
                  <strong>Conexión a Base de Datos:</strong> El sistema requiere una conexión estable a la base de datos.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sección: Cómo Usar */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <button
            onClick={() => toggleSeccion("como-usar")}
            className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-bold text-gray-900 text-left">Cómo Usar el Sistema</h2>
            <span className={`text-2xl transition transform ${seccionAbierta === "como-usar" ? "rotate-180" : ""}`}>▼</span>
          </button>
          {seccionAbierta === "como-usar" && (
            <div className="px-6 py-4 border-t border-gray-200 text-gray-700 space-y-4 accordion-content">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">1. Panel Principal</h3>
                <p className="text-sm">Accede desde "← Inicio" para ver las estadísticas generales del sistema.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">2. Registrar Libros</h3>
                <p className="text-sm">Ve a Libros → "+ Agregar Libro" → Completa el formulario con título, autor, ISBN y estado.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">3. Registrar Socios</h3>
                <p className="text-sm">Ve a Socios → "+ Agregar Socio" → Completa nombre, DNI, email y teléfono. El número de socio se genera automáticamente.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">4. Crear Préstamos</h3>
                <p className="text-sm">Ve a Préstamos → "+ Nuevo Préstamo" → Selecciona socio y libro, establece fechas.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">5. Registrar Devoluciones</h3>
                <p className="text-sm">En Préstamos, busca el préstamo activo → Botón "Devolver" → Ingresa la fecha real de devolución.</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">6. Gestionar Multas</h3>
                <p className="text-sm">Ve a Multas → "+ Nueva Multa" → Selecciona socio, motivo, monto y fecha. Usa el botón "Pagar" para marcar como pagada.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sección: Contacto */}
        <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6 border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-900 mb-4">¿Tienes problemas?</h2>
          <p className="text-gray-700 mb-4">
            Si encuentras un error o problema que no está documentado aquí, no dudes en reportarlo.
          </p>
          <Link
            to="/reportar-problema"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            📧 Reportar un Problema
          </Link>
        </div>
      </div>
    </div>
  );
}