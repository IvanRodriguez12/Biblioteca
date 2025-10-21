import React, { useState, useEffect } from "react";

export default function MultasPage() {
  const [multas, setMultas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    idSocio: "",
    motivo: "",
    monto: "",
    idPrestamo: ""
  });
  const [filtroEstado, setFiltroEstado] = useState("ACTIVA");
  const [errorModal, setErrorModal] = useState(null);
  const [prestamosFiltrados, setPrestamosFiltrados] = useState([]);

  const API_URL = "http://localhost:3001/api/multas";
  const SOCIOS_URL = "http://localhost:3001/api/socios";
  const PRESTAMOS_URL = "http://localhost:3001/api/prestamos";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [multasRes, sociosRes, prestamosRes] = await Promise.all([
        fetch(API_URL),
        fetch(SOCIOS_URL),
        fetch(PRESTAMOS_URL)
      ]);

      if (!multasRes.ok || !sociosRes.ok || !prestamosRes.ok) {
        throw new Error("Error al obtener datos");
      }

      const multasData = await multasRes.json();
      const sociosData = await sociosRes.json();
      const prestamosData = await prestamosRes.json();

      setMultas(multasData);
      setSocios(sociosData);
      setPrestamos(prestamosData);
      setError(null);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setError("No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.idSocio) {
      const prestamosSocio = prestamos.filter(
        p => p.idSocio === parseInt(formData.idSocio) && p.estadoPrestamo === "ACTIVO"
      );
      setPrestamosFiltrados(prestamosSocio);
      
      if (prestamosSocio.length === 1) {
        setFormData(prev => ({...prev, idPrestamo: prestamosSocio[0].idPrestamo}));
      } else {
        setFormData(prev => ({...prev, idPrestamo: ""}));
      }
    } else {
      setPrestamosFiltrados([]);
      setFormData(prev => ({...prev, idPrestamo: ""}));
    }
  }, [formData.idSocio, prestamos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorModal(null);

    if (!formData.idSocio) {
      setErrorModal("Debes seleccionar un socio");
      return;
    }

    if (!formData.motivo) {
      setErrorModal("Debes seleccionar un motivo");
      return;
    }

    const motivosQueRequierenPrestamo = ["Retraso en devolución", "Libro dañado", "Libro extraviado"];
    if (motivosQueRequierenPrestamo.includes(formData.motivo) && !formData.idPrestamo) {
      setErrorModal("Debes seleccionar un préstamo para este tipo de multa");
      return;
    }

    if (!formData.monto) {
      setErrorModal("El monto es requerido");
      return;
    }

    const monto = parseFloat(formData.monto);
    if (isNaN(monto) || monto <= 0) {
      setErrorModal("El monto debe ser un número válido mayor a 0");
      return;
    }

    if (monto > 10000) {
      setErrorModal("El monto no puede exceder $10,000");
      return;
    }

    try {
      const hoy = new Date().toISOString().split('T')[0];
      
      const multaData = {
        idSocio: parseInt(formData.idSocio),
        motivo: formData.motivo,
        monto: monto,
        fecha: hoy,
        idPrestamo: formData.idPrestamo ? parseInt(formData.idPrestamo) : null
      };

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
      setErrorModal(error.message || "Error al crear la multa");
    }
  };

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

        await fetchAllData();
        setError(null);
      } catch (error) {
        console.error("Error al cancelar multa:", error);
        setError(error.message || "Error al cancelar la multa");
      }
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFormData({
      idSocio: "",
      motivo: "",
      monto: "",
      idPrestamo: ""
    });
    setErrorModal(null);
  };

  const getNombreSocio = (idSocio) => {
    const socio = socios.find(s => s.idSocio === idSocio);
    return socio ? socio.nombre : "Desconocido";
  };

  const multasFiltradas = multas.filter(m => 
    filtroEstado === "TODAS" || m.estado === filtroEstado
  );

  const totalActivas = multas.filter(m => m.estado === "ACTIVA").length;
  const totalPagadas = multas.filter(m => m.estado === "PAGADA").length;

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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm font-medium">Multas Activas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalActivas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm font-medium">Multas Pagadas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalPagadas}</p>
        </div>
      </div>

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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">➕ Nueva Multa</h2>
            
            {errorModal && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errorModal}
              </div>
            )}

            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Socio *</label>
                <select
                  value={formData.idSocio}
                  onChange={(e) => setFormData({...formData, idSocio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                >
                  <option value="">Selecciona el motivo</option>
                  <option value="Retraso en devolución">Retraso en devolución</option>
                  <option value="Libro dañado">Libro dañado</option>
                  <option value="Libro extraviado">Libro extraviado</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              {["Retraso en devolución", "Libro dañado", "Libro extraviado"].includes(formData.motivo) && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Préstamo relacionado *</label>
                  {prestamosFiltrados.length > 0 ? (
                    <select
                      value={formData.idPrestamo}
                      onChange={(e) => setFormData({...formData, idPrestamo: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un préstamo</option>
                      {prestamosFiltrados.map(p => (
                        <option key={p.idPrestamo} value={p.idPrestamo}>
                          Préstamo #{p.idPrestamo} - {p.Libro?.titulo || 'Libro desconocido'}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-2 border border-yellow-300 bg-yellow-50 rounded-lg text-yellow-800">
                      ⚠️ Este socio no tiene préstamos activos
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10000"
                  value={formData.monto}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.split('.')[0].length <= 5) {
                      setFormData({...formData, monto: value});
                    }
                  }}
                  onKeyPress={(e) => {
                    const value = e.target.value;
                    if (value.split('.')[0].length >= 5 && e.key !== '.' && e.key !== 'Backspace' && !value.includes('.')) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">Monto máximo: $10,000</p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Información:</strong> La multa se registrará automáticamente con la fecha de hoy.
                  {["Libro dañado", "Libro extraviado"].includes(formData.motivo) && (
                    <span className="block mt-2">
                      ⚠️ Al registrar esta multa, el libro será marcado como {formData.motivo === "Libro dañado" ? "dañado" : "extraviado"} y el préstamo se cerrará.
                    </span>
                  )}
                  {formData.motivo === "Retraso en devolución" && (
                    <span className="block mt-2">
                      📚 El libro será devuelto y estará disponible nuevamente.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                >
                  ✨ Crear Multa
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
    </div>
  );
}