import React, { useState, useEffect } from "react";

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("crear");
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    idSocio: "",
    idLibro: "",
    fechaInicio: "",
    fechaDevolucion: ""
  });

  const API_URL = "http://localhost:3001/api/prestamos";
  const SOCIOS_URL = "http://localhost:3001/api/socios";
  const LIBROS_URL = "http://localhost:3001/api/libros";

  // Obtener fecha actual en formato YYYY-MM-DD
  const getFechaHoy = () => {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (showModal && modalMode === "crear") {
      setFormData(prev => ({
        ...prev,
        fechaInicio: getFechaHoy()
      }));
    }
  }, [showModal]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const prestamosRes = await fetch(API_URL);
      const sociosRes = await fetch(SOCIOS_URL);
      const librosRes = await fetch(LIBROS_URL);

      if (!prestamosRes.ok) throw new Error("Error al obtener préstamos");
      if (!sociosRes.ok) throw new Error("Error al obtener socios");
      if (!librosRes.ok) throw new Error("Error al obtener libros");

      const prestamosData = await prestamosRes.json();
      const sociosData = await sociosRes.json();
      const librosData = await librosRes.json();

      setPrestamos(prestamosData || []);
      setSocios(sociosData || []);
      setLibros(librosData || []);
      setError(null);
    } catch (error) {
      console.error("Error en fetchAllData:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const CalendarPicker = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDayClick = (day) => {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = selectedDate.toISOString().split('T')[0];

      const fechaInicio = new Date(formData.fechaInicio);
      if (selectedDate < fechaInicio) {
        setErrorModal("La fecha no puede ser anterior a la fecha de inicio");
        return;
      }

      const fechaMax = new Date(fechaInicio);
      fechaMax.setFullYear(fechaMax.getFullYear() + 50);
      if (selectedDate > fechaMax) {
        setErrorModal("El préstamo no puede superar 50 años");
        return;
      }

      setFormData({...formData, fechaDevolucion: dateString});
      setShowCalendar(false);
    };

    const isDateDisabled = (day) => {
      const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaMax = new Date(fechaInicio);
      fechaMax.setFullYear(fechaMax.getFullYear() + 50);

      return selectedDate < fechaInicio || selectedDate > fechaMax;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["D", "L", "M", "X", "J", "V", "S"];

    const days = [];
    for (let i = 0; i < firstDayOfMonth(currentMonth); i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth(currentMonth); i++) {
      days.push(i);
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="px-3 py-2 hover:bg-gray-200 rounded font-bold text-lg"
            >
              ←
            </button>
            <span className="font-semibold text-gray-800 text-lg min-w-40 text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="px-3 py-2 hover:bg-gray-200 rounded font-bold text-lg"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(d => (
              <div key={d} className="w-10 h-10 flex items-center justify-center font-bold text-gray-600">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {days.map((day, i) => (
              <button
                key={i}
                type="button"
                disabled={!day || isDateDisabled(day)}
                onClick={() => day && handleDayClick(day)}
                className={`w-10 h-10 rounded font-semibold text-sm ${
                  !day ? "invisible" :
                  isDateDisabled(day) ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                  formData.fechaDevolucion === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ?
                  "bg-purple-600 text-white" :
                  "hover:bg-purple-200 text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowCalendar(false)}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorModal(null);

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
    if (!formData.fechaDevolucion) {
      setErrorModal("La fecha de vencimiento es requerida");
      return;
    }

    const fechaInicio = new Date(formData.fechaInicio);
    const fechaDevolucion = new Date(formData.fechaDevolucion);

    if (fechaInicio >= fechaDevolucion) {
      setErrorModal("La fecha de vencimiento debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      // Crear objetos Date con la fecha completa para evitar problemas de zona horaria
      const fechaInicioCompleta = new Date(formData.fechaInicio + 'T12:00:00');
      const fechaDevolucionCompleta = new Date(formData.fechaDevolucion + 'T12:00:00');

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idSocio: parseInt(formData.idSocio),
          idLibro: parseInt(formData.idLibro),
          fechaInicio: fechaInicioCompleta.toISOString(),
          fechaDevolucion: fechaDevolucionCompleta.toISOString()
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

  const handleDevolucion = async () => {
    setErrorModal(null);

    try {
      // Obtener fecha actual y establecer hora al mediodía
      const fechaHoy = getFechaHoy();

      const response = await fetch(`${API_URL}/${selectedPrestamo.idPrestamo}/devolver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fechaRealDevolucion: fechaHoy
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

  const abrirModalDevolucion = (prestamo) => {
    setSelectedPrestamo(prestamo);
    setModalMode("devolver");
    setShowModal(true);
  };

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
    setErrorModal(null);
    setShowCalendar(false);
  };

  const getNombreSocio = (idSocio) => {
    const socio = socios.find(s => s.idSocio === idSocio);
    return socio ? socio.nombre : "Desconocido";
  };

  const getTituloLibro = (idLibro) => {
    const libro = libros.find(l => l.idLibro === idLibro);
    return libro ? libro.titulo : "Desconocido";
  };

  const hayRetraso = (fechaDevolucion, estadoPrestamo) => {
    if (estadoPrestamo !== "ACTIVO") return false;
    return new Date(fechaDevolucion) < new Date();
  };

  const librosDisponibles = libros.filter(l => l.cantidadDisponible > 0);

  const prestamosPorEstado = {
    activos: prestamos.filter(p => p.estadoPrestamo === "ACTIVO"),
    cerrados: prestamos.filter(p => p.estadoPrestamo === "CERRADO")
  };

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
          <p className="text-gray-600 mt-1">Total: {prestamos.length} préstamo(s) - Activos: {prestamosPorEstado.activos.length}</p>
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
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-600 text-white px-6 py-4">
              <h2 className="text-xl font-bold">Préstamos Activos ({prestamosPorEstado.activos.length})</h2>
            </div>
            {prestamosPorEstado.activos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Socio</th>
                      <th className="px-6 py-4 text-left font-semibold">Libro</th>
                      <th className="px-6 py-4 text-left font-semibold">Fecha Inicio</th>
                      <th className="px-6 py-4 text-left font-semibold">Fecha Vencimiento</th>
                      <th className="px-6 py-4 text-left font-semibold">Estado</th>
                      <th className="px-6 py-4 text-center font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamosPorEstado.activos.map((prestamo) => (
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
                            hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo)
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            ACTIVO {hayRetraso(prestamo.fechaDevolucion, prestamo.estadoPrestamo) && "⚠️"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => abrirModalDevolucion(prestamo)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition"
                          >
                            Devolver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">No hay préstamos activos</div>
            )}
          </div>

          {prestamosPorEstado.cerrados.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Préstamos Cerrados ({prestamosPorEstado.cerrados.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Socio</th>
                      <th className="px-6 py-4 text-left font-semibold">Libro</th>
                      <th className="px-6 py-4 text-left font-semibold">Fecha Inicio</th>
                      <th className="px-6 py-4 text-left font-semibold">Fecha Vencimiento</th>
                      <th className="px-6 py-4 text-left font-semibold">Multa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamosPorEstado.cerrados.map((prestamo) => (
                      <tr key={prestamo.idPrestamo} className="border-b hover:bg-gray-50 transition">
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
                          {new Date(prestamo.fechaDevolucion).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          ${parseFloat(prestamo.multa || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4 opacity-20">🔁</div>
          <p className="text-gray-600 text-lg">No hay préstamos registrados</p>
          <p className="text-gray-500 mt-2">Crea uno haciendo clic en "Nuevo Préstamo"</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl max-h-screen overflow-y-auto">
            {modalMode === "crear" ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Nuevo Préstamo</h2>
                
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      onChange={(e) => setFormData({...formData, idLibro: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un libro disponible</option>
                      {librosDisponibles.map(l => (
                        <option key={l.idLibro} value={l.idLibro}>
                          {l.titulo} ({l.cantidadDisponible} disponible{l.cantidadDisponible !== 1 ? "s" : ""})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Inicio</label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold">
                      {formData.fechaInicio ? new Date(formData.fechaInicio).toLocaleDateString("es-ES") : ""}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Fecha Vencimiento *</label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(true)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-purple-50 font-semibold text-gray-700"
                    >
                      {formData.fechaDevolucion ? new Date(formData.fechaDevolucion).toLocaleDateString("es-ES") : "📅 Selecciona fecha"}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                    >
                      Crear Préstamo
                    </button>
                    <button
                      onClick={cerrarModal}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Confirmar Devolución</h2>
                
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
                  {selectedPrestamo && new Date(selectedPrestamo.fechaDevolucion) < new Date() && (
                    <p className="text-sm text-red-700 mt-2">
                      <strong>⚠️ Hay retraso. Se calculará automáticamente una multa de $0.50 por día.</strong>
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDevolucion}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
                  >
                    Confirmar Devolución
                  </button>
                  <button
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

      {showCalendar && <CalendarPicker />}
    </div>
  );
}