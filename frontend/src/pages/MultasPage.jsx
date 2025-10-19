import React, { useState, useEffect } from "react";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: "",
    fecha: ""
  });
  const [filtroEstado, setFiltroEstado] = useState("ACTIVA");

  const API_URL = "http://localhost:3001/api/multas";
  const SOCIOS_URL = "http://localhost:3001/api/socios";

  // Obtener multas y socios
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [multasRes, sociosRes] = await Promise.all([
        fetch(API_URL),
        fetch(SOCIOS_URL)
      ]);

      if (!multasRes.ok || !sociosRes.ok) {
        throw new Error("Error al obtener datos");
      }

      const multasData = await multasRes.json();
      const sociosData = await sociosRes.json();

      setMultas(multasData);
      setSocios(sociosData);
      setError(null);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Crear multa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que todos los campos estén completos
      if (!formData.idSocio || !formData.motivo || !formData.monto || !formData.fecha) {
        setError("Todos los campos son requeridos");
        return;
      }

      // Validar que el monto sea un número válido
      const monto = parseFloat(formData.monto);
      if (isNaN(monto) || monto <= 0) {
        setError("El monto debe ser un número válido mayor a 0");
        return;
      }

      // Validar que la fecha sea válida y en formato correcto
      const fecha = new Date(formData.fecha);
      if (isNaN(fecha.getTime())) {
        setError("La fecha no es válida");
        return;
      }

      const multaData = {
        idSocio: parseInt(formData.idSocio),
        motivo: formData.motivo,
        monto: monto,
        fecha: formData.fecha // Debe estar en formato YYYY-MM-DD
      };

      console.log("Enviando multa:", multaData);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(multaData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear multa");
      }

      await fetchAllData();
      cerrarModal();
      setError(null);
    } catch (error) {
      console.error("Error al crear multa:", error);
      setError(error.message || "Error al crear la multa");
    }
  };

  // Cancelar multa
  const cancelarMulta = async (idMulta) => {
    if (window.confirm("¿Estás seguro de marcar esta multa como pagada?")) {
      try {
        const response = await fetch(`${API_URL}/${idMulta}/cancelar`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al cancelar multa");
        }

        // Refrescar los datos
        await fetchAllData();
        setError(null);
      } catch (error) {
        console.error("Error al cancelar multa:", error);
        setError(error.message || "Error al cancelar la multa");
      }
    }
  };

  // Cerrar modal
  const cerrarModal = () => {
    setShowModal(false);
    setFormData({
      idSocio: "",
      motivo: "",
      monto: "",
      fecha: ""
    });
  };

  // Obtener nombre de socio
  const getNombreSocio = (idSocio) => {
    const socio = socios.find(s => s.idSocio === idSocio);
    return socio ? socio.nombre : "Desconocido";
  };

  // Filtrar multas por estado
  const multasFiltradas = multas.filter(m => 
    filtroEstado === "TODAS" || m.estado === filtroEstado
  );

  // Calcular totales
  const totalActivas = multas.filter(m => m.estado === "ACTIVA").length;
  const totalPagadas = multas.filter(m => m.estado === "PAGADA").length;
  const montoTotal = multas
    .filter(m => m.estado === "ACTIVA")
    .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 font-semibold">Cargando multas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Multas</h1>
          <p className="text-gray-600 mt-1">Total: {multas.length} multa(s)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
        >
          + Nueva Multa
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">Multas Activas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalActivas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Multas Pagadas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalPagadas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm font-medium">Monto Total Pendiente</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${montoTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtro de estado */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFiltroEstado("ACTIVA")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filtroEstado === "ACTIVA"
              ? "bg-red-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Activas
        </button>
        <button
          onClick={() => setFiltroEstado("PAGADA")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filtroEstado === "PAGADA"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Pagadas
        </button>
        <button
          onClick={() => setFiltroEstado("TODAS")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            filtroEstado === "TODAS"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Todas
        </button>
      </div>

      {/* Tabla de multas */}
      {multasFiltradas.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Socio</th>
                <th className="px-6 py-4 text-left font-semibold">Motivo</th>
                <th className="px-6 py-4 text-left font-semibold">Monto</th>
                <th className="px-6 py-4 text-left font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left font-semibold">Estado</th>
                <th className="px-6 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {multasFiltradas.map((multa) => (
                <tr key={multa.idMulta} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-700">{multa.idMulta}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {getNombreSocio(multa.idSocio)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{multa.motivo}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ${parseFloat(multa.monto).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(multa.fecha).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                      multa.estado === "ACTIVA"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {multa.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {multa.estado === "ACTIVA" && (
                      <button
                        onClick={() => cancelarMulta(multa.idMulta)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition"
                      >
                        Pagar
                      </button>
                    )}
                    {multa.estado === "PAGADA" && (
                      <span className="text-gray-500 text-sm">Pagada ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4 opacity-20">⚠️</div>
          <p className="text-gray-600 text-lg">
            {filtroEstado === "TODAS" 
              ? "No hay multas registradas"
              : filtroEstado === "ACTIVA"
              ? "No hay multas activas"
              : "No hay multas pagadas"
            }
          </p>
          <p className="text-gray-500 mt-2">Crea una haciendo clic en "Nueva Multa"</p>
        </div>
      )}

      {/* Modal para crear multa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">➕ Nueva Multa</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Socio *</label>
                <select
                  value={formData.idSocio}
                  onChange={(e) => setFormData({...formData, idSocio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                <label className="block text-gray-700 font-semibold mb-2">Motivo *</label>
                <select
                  value={formData.motivo}
                  onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecciona el motivo</option>
                  <option value="Retraso en devolución">Retraso en devolución</option>
                  <option value="Libro dañado">Libro dañado</option>
                  <option value="Libro extraviado">Libro extraviado</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                  ✨ Crear Multa
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