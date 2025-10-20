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
  const [errorModal, setErrorModal] = useState(null);
  const [formData, setFormData] = useState({
    idSocio: "",
    idLibro: "",
    fechaInicio: "",
    fechaDevolucion: ""
  });
  const [fechaDevolucionReal, setFechaDevolucionReal] = useState("");

  // Convertir formato DD/MM/YYYY a YYYY-MM-DD
  const convertirAISO = (fecha) => {
    const [dia, mes, año] = fecha.split("/");
    return `${año}-${mes}-${dia}`;
  };

  // Convertir formato YYYY-MM-DD a DD/MM/YYYY
  const convertirALocal = (fecha) => {
    if (!fecha) return "";
    const [año, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${año}`;
  };

  // Validar formato DD/MM/YYYY
  const validarFecha = (fecha) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(fecha)) return false;
    const [, dia, mes, año] = fecha.match(regex);
    return dia <= 31 && mes <= 12 && año >= 1900 && año <= 2100;
  };

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
    setErrorModal(null);

    // Validaciones
    if (!formData.idSocio) {
      setErrorModal("Debes seleccionar un socio");
      return;
    }
    if (!formData.idLibro) {
      setErrorModal("Debes seleccionar un libro");
      return;
    }
    if (!formData.fechaInicio) {
      setErrorModal("La fecha de inicio es requerida");
      return;
    }
    if (!validarFecha(formData.fechaInicio)) {
      setErrorModal("La fecha de inicio no es válida (formato: DD/MM/YYYY)");
      return;
    }
    if (!formData.fechaDevolucion) {
      setErrorModal("La fecha de vencimiento es requerida");
      return;
    }
    if (!validarFecha(formData.fechaDevolucion)) {
      setErrorModal("La fecha de vencimiento no es válida (formato: DD/MM/YYYY)");
      return;
    }

    const fechaInicio = new Date(convertirAISO(formData.fechaInicio));
    const fechaDevolucion = new Date(convertirAISO(formData.fechaDevolucion));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // No permite fecha pasada
    if (fechaInicio < hoy) {
      setErrorModal("La fecha de inicio no puede ser una fecha pasada");
      return;
    }

    if (fechaInicio >= fechaDevolucion) {
      setErrorModal("La fecha de vencimiento debe ser posterior a la fecha de inicio");
      return;
    }

    // No puede ser más de 50 años desde la fecha de inicio
    const fechaDevolucionMax = new Date(fechaInicio);
    fechaDevolucionMax.setFullYear(fechaDevolucionMax.getFullYear() + 50);

    if (fechaDevolucion > fechaDevolucionMax) {
      setErrorModal("El préstamo no puede superar 50 años de duración");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idSocio: formData.idSocio,
          idLibro: formData.idLibro,
          fechaInicio: convertirAISO(formData.fechaInicio),
          fechaDevolucion: convertirAISO(formData.fechaDevolucion)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear préstamo");
      }

      await fetchAllData();
      cerrarModal();
    } catch (error) {
      console.error("Error al crear préstamo:", error);
      setErrorModal(error.message || "Error al crear el préstamo");
    }
  };

  // Registrar devolución
  const handleDevolucion = async (e) => {
    e.preventDefault();
    setErrorModal(null);

    const hoy = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(`${API_URL}/${selectedPrestamo.idPrestamo}/devolver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaRealDevolucion: hoy
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar devolución");
      }

      await fetchAllData();
      cerrarModal();
    } catch (error) {
      console.error("Error al registrar devolución:", error);
      setErrorModal(error.message || "Error al registrar la devolución");
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
    setErrorModal(null);
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
                
                {errorModal && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {errorModal}
                  </div>
                )}

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
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Inicio (DD/MM/YYYY) *</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.fechaInicio}
                      onChange={(e) => {
                        const valor = e.target.value;
                        // Solo permitir números y barras
                        if (/^[\d/]*$/.test(valor) && valor.length <= 10) {
                          setFormData({...formData, fechaInicio: valor});
                        }
                      }}
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 font-medium"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Formato: DD/MM/YYYY. No puede ser una fecha pasada. Máximo 50 años desde hoy.</p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Vencimiento (DD/MM/YYYY) *</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={formData.fechaDevolucion}
                      onChange={(e) => {
                        const valor = e.target.value;
                        // Solo permitir números y barras
                        if (/^[\d/]*$/.test(valor) && valor.length <= 10) {
                          setFormData({...formData, fechaDevolucion: valor});
                        }
                      }}
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700 font-medium"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Formato: DD/MM/YYYY. Máximo 50 años desde la fecha de inicio</p>
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
                <h2 className="text-2xl font-bold mb-6 text-gray-900">📖 Confirmar Devolución</h2>
                
                {errorModal && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {errorModal}
                  </div>
                )}

                <div className="mb-6 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Socio:</strong> {selectedPrestamo && getNombreSocio(selectedPrestamo.idSocio)}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Libro:</strong> {selectedPrestamo && getTituloLibro(selectedPrestamo.idLibro)}
                  </p>
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Fecha Inicio:</strong> {selectedPrestamo && new Date(selectedPrestamo.fechaInicio).toLocaleDateString("es-ES")}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Fecha Vencimiento:</strong> {selectedPrestamo && new Date(selectedPrestamo.fechaDevolucion).toLocaleDateString("es-ES")}
                  </p>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ La devolución se registrará con la fecha de hoy</strong>
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDevolucion}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                  >
                    ✓ Confirmar Devolución
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}