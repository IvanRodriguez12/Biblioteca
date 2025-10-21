import React, { useState, useEffect } from "react";

export default function SociosPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [socioAEliminar, setSocioAEliminar] = useState(null);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: ""
  });
  const [errorModal, setErrorModal] = useState(null);

  const API_URL = "http://localhost:3001/api/socios";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorModal(null);

    if (!formData.nombre || formData.nombre.trim().length === 0) {
      setErrorModal("El nombre es requerido");
      return;
    }
    if (formData.nombre.trim().length < 3) {
      setErrorModal("El nombre debe tener al menos 3 caracteres");
      return;
    }
    if (formData.nombre.trim().length > 100) {
      setErrorModal("El nombre no puede exceder 100 caracteres");
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      setErrorModal("El nombre solo puede contener letras y espacios");
      return;
    }

    if (!formData.dni || formData.dni.trim().length === 0) {
      setErrorModal("El DNI es requerido");
      return;
    }
    if (formData.dni.length < 7 || formData.dni.length > 10) {
      setErrorModal("El DNI debe tener entre 7 y 10 caracteres");
      return;
    }
    if (!/^\d+$/.test(formData.dni)) {
      setErrorModal("El DNI solo puede contener números");
      return;
    }

    if (!formData.email || formData.email.trim().length === 0) {
      setErrorModal("El email es requerido");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorModal("El email no es válido");
      return;
    }
    if (formData.email.length > 100) {
      setErrorModal("El email no puede exceder 100 caracteres");
      return;
    }

    if (!formData.telefono || formData.telefono.trim().length === 0) {
      setErrorModal("El teléfono es requerido");
      return;
    }
    if (!/^[\d\s\-\+]+$/.test(formData.telefono)) {
      setErrorModal("El teléfono solo puede contener números, espacios, guiones y +");
      return;
    }
    if (formData.telefono.length < 7 || formData.telefono.length > 20) {
      setErrorModal("El teléfono debe tener entre 7 y 20 caracteres");
      return;
    }

    try {
      const url = editando ? `${API_URL}/${editando}` : API_URL;
      const method = editando ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar socio");
      }

      await fetchSocios();
      cerrarModal();
      setError(null);
    } catch (error) {
      console.error("Error al guardar socio:", error);
      setErrorModal(error.message || "Error al guardar el socio");
    }
  };

  const confirmarEliminarSocio = (socio) => {
    setSocioAEliminar(socio);
    setShowDeleteModal(true);
  };

  const eliminarSocio = async () => {
    try {
      const response = await fetch(`${API_URL}/${socioAEliminar.idSocio}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar");

      await fetchSocios();
      setShowDeleteModal(false);
      setSocioAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar socio:", error);
      setError("Error al eliminar el socio");
      setShowDeleteModal(false);
      setSocioAEliminar(null);
    }
  };

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

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setFormData({
      nombre: "",
      dni: "",
      email: "",
      telefono: ""
    });
    setErrorModal(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center" style={{minHeight: 'calc(100vh - 200px)'}}>
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-gray-600 font-semibold">Cargando socios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
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

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                        onClick={() => confirmarEliminarSocio(socio)}
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

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {editando ? "✏️ Editar Socio" : "➕ Agregar Socio"}
              </h2>

              {errorModal && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {errorModal}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ingresa el nombre del socio"
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
                    onClick={handleSubmit}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                  >
                    {editando ? "🔄 Actualizar" : "✨ Crear"}
                  </button>
                  <button
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && socioAEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">¿Eliminar Socio?</h2>
                <p className="text-gray-700 mb-2">
                  Estás a punto de eliminar al socio:
                </p>
                <p className="text-lg font-bold text-gray-900 mb-6">
                  {socioAEliminar.nombre}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Esta acción no se puede deshacer.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={eliminarSocio}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                  >
                    Sí, Eliminar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSocioAEliminar(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}