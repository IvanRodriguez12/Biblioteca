import React, { useState, useEffect } from "react";

export default function SociosPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: ""
  });

  const API_URL = "http://localhost:3001/api/socios";

  // Obtener todos los socios
  useEffect(() => {
    fetchSocios();
  }, []);

  const fetchSocios = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener socios");
      const data = await response.json();
      setSocios(data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener socios:", error);
      setError("No se pudieron cargar los socios");
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar socio
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editando ? `${API_URL}/${editando}` : API_URL;
      const method = editando ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Error al guardar socio");

      await fetchSocios();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar socio:", error);
      setError("Error al guardar el socio");
    }
  };

  // Eliminar socio
  const eliminarSocio = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este socio?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al eliminar");

        await fetchSocios();
      } catch (error) {
        console.error("Error al eliminar socio:", error);
        setError("Error al eliminar el socio");
      }
    }
  };

  // Abrir modal para editar
  const editarSocio = (socio) => {
    setEditando(socio.idSocio);
    setFormData({
      nombre: socio.nombre,
      dni: socio.dni,
      email: socio.email,
      telefono: socio.telefono
    });
    setShowModal(true);
  };

  // Cerrar modal y resetear form
  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setFormData({
      nombre: "",
      dni: "",
      email: "",
      telefono: ""
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-gray-600 font-semibold">Cargando socios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Socios</h1>
          <p className="text-gray-600 mt-1">Total: {socios.length} socio(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
        >
          + Agregar Socio
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de socios */}
      {socios.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nº Socio</th>
                <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left font-semibold">DNI</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Teléfono</th>
                <th className="px-6 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.idSocio} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">{socio.numeroSocio}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{socio.nombre}</td>
                  <td className="px-6 py-4 text-gray-700">{socio.dni}</td>
                  <td className="px-6 py-4 text-gray-700">{socio.email || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{socio.telefono || "-"}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => editarSocio(socio)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition inline-block"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarSocio(socio.idSocio)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition inline-block"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4 opacity-20">👥</div>
          <p className="text-gray-600 text-lg">No hay socios registrados</p>
          <p className="text-gray-500 mt-2">Crea uno haciendo clic en "Agregar Socio"</p>
        </div>
      )}

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editando ? "✏️ Editar Socio" : "➕ Agregar Socio"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ingresa el nombre del socio"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">DNI *</label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ingresa el DNI"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ingresa el teléfono"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                  {editando ? "🔄 Actualizar" : "✨ Crear"}
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}