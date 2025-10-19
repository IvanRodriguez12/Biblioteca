import React, { useState, useEffect } from "react";

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear"); // "crear" o "devolver"
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [formData, setFormData] = useState({
    idSocio: "",
    idLibro: "",
    fechaInicio: "",
    fechaDevolucion: ""
  });
  const [fechaDevolucionReal, setFechaDevolucionReal] = useState("");

  const API_URL = "http://localhost:3001/api/prestamos";
  const SOCIOS_URL = "http://localhost:3001/api/socios";
  const LIBROS_URL = "http://localhost:3001/api/libros";

  // Obtener datos iniciales
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prestamosRes, sociosRes, librosRes] = await Promise.all([
        fetch(API_URL),
        fetch(SOCIOS_URL),
        fetch(LIBROS_URL)
      ]);

      if (!prestamosRes.ok || !sociosRes.ok || !librosRes.ok) {
        throw new Error("Error al obtener datos");
      }

      const prestamosData = await prestamosRes.json();
      const sociosData = await sociosRes.json();
      const librosData = await librosRes.json();

      setPrestamos(prestamosData);
      setSocios(sociosData);
      setLibros(librosData);
      setError(null);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Crear préstamo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Error al crear préstamo");

      await fetchAllData();
      cerrarModal();
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      setError("Error al crear el préstamo");
    }
  };

  // Registrar devolución
  const handleDevolucion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${selectedPrestamo.idPrestamo}/devolver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaRealDevolucion: fechaDevolucionReal
        })
      });

      if (!response.ok) throw new Error("Error al registrar devolución");

      await fetchAllData();
      cerrarModal();
    } catch (error) {
      console.error("Error al registrar devolución:", error);
      setError("Error al registrar la devolución");
    }
  };

  // Abrir modal para devolución
  const abrirModalDevolucion = (prestamo) => {
    setSelectedPrestamo(prestamo);
    setModalMode("devolver");
    setFechaDevolucionReal("");
    setShowModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setShowModal(false);
    setModalMode("crear");
    setSelectedPrestamo(null);
    setFormData({
      idSocio: "",
      idLibro: "",
      fechaInicio: "",
      fechaDevolucion: ""
    });
    setFechaDevolucionReal("");
  };

  // Obtener nombre de socio
  const getNombreSocio = (idSocio) => {
    const socio = socios.find(s => s.idSocio === idSocio);
    return socio ? socio.nombre : "Desconocido";
  };

  // Obtener título de libro
  const getTituloLibro = (idLibro) => {
    const libro = libros.find(l => l.id === idLibro || l.idLibro === idLibro);
    return libro ? libro.titulo : "Desconocido";
  };

  // Calcular si hay retraso
  const hayRetraso = (fechaDevolucion, estadoPrestamo) => {
    if (estadoPrestamo !== "ACTIVO") return false;
    return new Date(fechaDevolucion) < new Date();
  };

  // Filtrar libros disponibles
  const librosDisponibles = libros.filter(l => 
    l.estado === "DISPONIBLE" || 
    !prestamos.some(p => p.idLibro === (l.id || l.idLibro) && p.estadoPrestamo === "ACTIVO")
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🔁</div>
          <p className="text-gray-600 font-semibold">Cargando préstamos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Préstamos</h1>
          <p className="text-gray-600 mt-1">Total: {prestamos.length} préstamo(s)</p>
        </div>
        <button
          onClick={() => {
            setModalMode("crear");
            setShowModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
        >
          + Nuevo Préstamo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {prestamos.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Socio</th>
                <th className="px-6 py-4 text-left font-semibold">Libro</th>
                <th className="px-6 py-4 text-left font-semibold">Fecha Inicio</th>
                <th className="px-6 py-4 text-left font-semibold">Fecha Vencimiento</th>
                <th className="px-6 py-4 text-left font-semibold">Estado</th>
                <th className="px-6 py-4 text-left font-semibold">Multa</th>
                <th className="px-6 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((prestamo) => (
                <tr 
                  key={prestamo.idPrestamo} 
                  className={`border-b hover:bg-gray-50 transition ${
                    hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo) 
                      ? "bg-red-50" 
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-gray-700">{prestamo.idPrestamo}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {getNombreSocio(prestamo.idSocio)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {getTituloLibro(prestamo.idLibro)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(prestamo.fechaInicio).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className={hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo) ? "text-red-600 font-semibold" : ""}>
                      {new Date(prestamo.fechaDevolucion).toLocaleDateString("es-ES")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                      prestamo.estadoPrestamo === "ACTIVO"
                        ? hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo)
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {prestamo.estadoPrestamo}
                      {hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo) && " ⚠️"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">
                    ${parseFloat(prestamo.multa || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {prestamo.estadoPrestamo === "ACTIVO" && (
                      <button
                        onClick={() => abrirModalDevolucion(prestamo)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition"
                      >
                        Devolver
                      </button>
                    )}
                    {prestamo.estadoPrestamo === "CERRADO" && (
                      <span className="text-gray-500 text-sm">Finalizado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4 opacity-20">🔁</div>
          <p className="text-gray-600 text-lg">No hay préstamos registrados</p>
          <p className="text-gray-500 mt-2">Crea uno haciendo clic en "Nuevo Préstamo"</p>
        </div>
      )}

      {/* Modal para crear/devolver */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            {modalMode === "crear" ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">📚 Nuevo Préstamo</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Socio *</label>
                    <select
                      value={formData.idSocio}
                      onChange={(e) => setFormData({...formData, idSocio: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona un socio</option>
                      {socios.map(s => (
                        <option key={s.idSocio} value={s.idSocio}>
                          {s.nombre} ({s.numeroSocio})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Libro *</label>
                    <select
                      value={formData.idLibro}
                      onChange={(e) => setFormData({...formData, idLibro: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona un libro disponible</option>
                      {librosDisponibles.map(l => (
                        <option key={l.id || l.idLibro} value={l.id || l.idLibro}>
                          {l.titulo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Inicio *</label>
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Vencimiento *</label>
                    <input
                      type="date"
                      value={formData.fechaDevolucion}
                      onChange={(e) => setFormData({...formData, fechaDevolucion: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                    >
                      ✨ Crear Préstamo
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
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">📖 Registrar Devolución</h2>
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Socio:</strong> {selectedPrestamo && getNombreSocio(selectedPrestamo.idSocio)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Libro:</strong> {selectedPrestamo && getTituloLibro(selectedPrestamo.idLibro)}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Fecha Vencimiento:</strong> {selectedPrestamo && new Date(selectedPrestamo.fechaDevolucion).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <form onSubmit={handleDevolucion}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Real de Devolución *</label>
                    <input
                      type="date"
                      value={fechaDevolucionReal}
                      onChange={(e) => setFechaDevolucionReal(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                    >
                      ✓ Confirmar Devolución
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}