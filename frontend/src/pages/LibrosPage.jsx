import React, { useState, useEffect } from "react";

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    estado: "DISPONIBLE"
  });

  const API_URL = "http://localhost:3001/api/libros";

  // Obtener todos los libros
  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener libros");
      const data = await response.json();
      setLibros(data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener libros:", error);
      setError("No se pudieron cargar los libros");
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar libro
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

      if (!response.ok) throw new Error("Error al guardar libro");

      await fetchLibros();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar libro:", error);
      setError("Error al guardar el libro");
    }
  };

  // Eliminar libro
  const eliminarLibro = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este libro?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { 
          method: "DELETE" 
        });

        if (!response.ok) throw new Error("Error al eliminar");

        await fetchLibros();
      } catch (error) {
        console.error("Error al eliminar libro:", error);
        setError("Error al eliminar el libro");
      }
    }
  };

  // Abrir modal para editar
  const editarLibro = (libro) => {
    setEditando(libro.id || libro.idLibro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      estado: libro.estado
    });
    setShowModal(true);
  };

  // Cerrar modal y resetear form
  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      estado: "DISPONIBLE"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600 font-semibold">Cargando libros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Libros</h1>
          <p className="text-gray-600 mt-1">Total: {libros.length} libro(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
        >
          + Agregar Libro
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de libros */}
      {libros.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Título</th>
                <th className="px-6 py-4 text-left font-semibold">Autor</th>
                <th className="px-6 py-4 text-left font-semibold">ISBN</th>
                <th className="px-6 py-4 text-left font-semibold">Estado</th>
                <th className="px-6 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.id || libro.idLibro} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">{libro.id || libro.idLibro}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{libro.titulo}</td>
                  <td className="px-6 py-4 text-gray-700">{libro.autor}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono text-sm">{libro.isbn}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                      libro.estado === "DISPONIBLE" 
                        ? "bg-green-100 text-green-800" 
                        : libro.estado === "PRESTADO"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {libro.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => editarLibro(libro)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition inline-block"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarLibro(libro.id || libro.idLibro)}
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
          <div className="text-6xl mb-4 opacity-20">📚</div>
          <p className="text-gray-600 text-lg">No hay libros registrados</p>
          <p className="text-gray-500 mt-2">Crea uno haciendo clic en "Agregar Libro"</p>
        </div>
      )}

      {/* Modal para crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editando ? "✏️ Editar Libro" : "➕ Agregar Libro"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingresa el título del libro"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Autor *</label>
                <input
                  type="text"
                  value={formData.autor}
                  onChange={(e) => setFormData({...formData, autor: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingresa el nombre del autor"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">ISBN *</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ingresa el ISBN"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Estado *</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="DISPONIBLE">✅ DISPONIBLE</option>
                  <option value="PRESTADO">📤 PRESTADO</option>
                  <option value="DAÑADO">❌ DAÑADO</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
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