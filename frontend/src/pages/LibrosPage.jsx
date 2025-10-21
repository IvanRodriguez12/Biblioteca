import React, { useState, useEffect } from "react";

export default function LibrosPage() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [errorModal, setErrorModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    isbn: "",
    cantidad: ""
  });

  const API_URL = "http://localhost:3001/api/libros";

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

  const validarTitulo = (titulo) => {
    if (!titulo || titulo.trim().length === 0) {
      setErrorModal("El título es requerido");
      return false;
    }
    if (titulo.trim().length < 3) {
      setErrorModal("El título debe tener al menos 3 caracteres");
      return false;
    }
    if (titulo.trim().length > 150) {
      setErrorModal("El título no puede exceder 150 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s:,.-]+$/.test(titulo)) {
      setErrorModal("El título contiene caracteres no válidos");
      return false;
    }
    return true;
  };

  const validarAutor = (autor) => {
    if (!autor || autor.trim().length === 0) {
      setErrorModal("El autor es requerido");
      return false;
    }
    if (autor.trim().length < 3) {
      setErrorModal("El autor debe tener al menos 3 caracteres");
      return false;
    }
    if (autor.trim().length > 100) {
      setErrorModal("El autor no puede exceder 100 caracteres");
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,.-]+$/.test(autor)) {
      setErrorModal("El autor solo puede contener letras, espacios y símbolos básicos");
      return false;
    }
    return true;
  };

  const validarISBN = (isbn) => {
    if (!isbn || isbn.trim().length === 0) {
      setErrorModal("El ISBN es requerido");
      return false;
    }
    if (!/^[0-9\-]+$/.test(isbn)) {
      setErrorModal("El ISBN solo puede contener números y guiones");
      return false;
    }
    if (isbn.length < 10 || isbn.length > 17) {
      setErrorModal("El ISBN debe tener entre 10 y 17 caracteres");
      return false;
    }
    return true;
  };

  const handleNumberInput = (value) => {
    // Permitir campo vacío
    if (value === "" || value === undefined) return "";
    
    // Limpiar input: solo números
    const cleaned = value.replace(/[^0-9]/g, "");
    
    // Limitar a 3 dígitos
    if (cleaned.length > 3) return cleaned.slice(0, 3);
    
    return cleaned;
  };

  const validarCantidad = (valor, minimo = 1) => {
    if (valor === "" || valor === undefined) return false;
    const num = parseInt(valor);
    return !isNaN(num) && num >= minimo && num <= 200;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorModal(null);

    if (!validarTitulo(formData.titulo)) return;
    if (!validarAutor(formData.autor)) return;
    if (!validarISBN(formData.isbn)) return;

    if (!editando) {
      // Validar cantidad para crear nuevo libro
      if (formData.cantidad === "" || formData.cantidad === undefined) {
        setErrorModal("Debes ingresar al menos una copia");
        return;
      }

      const cantidad = parseInt(formData.cantidad);
      if (isNaN(cantidad) || cantidad < 1) {
        setErrorModal("La cantidad debe ser al menos 1 copia");
        return;
      }

      if (cantidad > 200) {
        setErrorModal("La cantidad no puede exceder 200 copias");
        return;
      }

      const datosEnvio = {
        titulo: formData.titulo,
        autor: formData.autor,
        isbn: formData.isbn,
        cantidad: cantidad,
        cantidadDisponible: cantidad,
        cantidadPrestado: 0,
        cantidadDanado: 0
      };

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnvio)
      })
        .then(response => {
          if (!response.ok) throw new Error("Error al guardar libro");
          return response.json();
        })
        .then(() => {
          fetchLibros();
          cerrarModal();
        })
        .catch(error => {
          console.error("Error al guardar libro:", error);
          setErrorModal(error.message || "Error al guardar el libro");
        });
    } else {
      // Validar edición - convertir vacíos a 0 y validar
      const disponible = formData.cantidadDisponible === "" ? 0 : parseInt(formData.cantidadDisponible);
      const prestado = formData.cantidadPrestado === "" ? 0 : parseInt(formData.cantidadPrestado);
      const danado = formData.cantidadDanado === "" ? 0 : parseInt(formData.cantidadDanado);

      // Validar que sean números válidos
      if (isNaN(disponible) || disponible < 0 || disponible > 200) {
        setErrorModal("Cantidad de disponibles inválida (0-200)");
        return;
      }
      if (isNaN(prestado) || prestado < 0 || prestado > 200) {
        setErrorModal("Cantidad de prestados inválida (0-200)");
        return;
      }
      if (isNaN(danado) || danado < 0 || danado > 200) {
        setErrorModal("Cantidad de dañados inválida (0-200)");
        return;
      }

      const suma = disponible + prestado + danado;

      if (suma === 0) {
        setErrorModal("Debe haber al menos una copia en total");
        return;
      }

      if (suma > 200) {
        setErrorModal("La suma total no puede exceder 200 copias");
        return;
      }

      const datosEnvio = {
        titulo: formData.titulo.trim(),
        autor: formData.autor.trim(),
        isbn: formData.isbn.trim(),
        cantidad: suma,
        cantidadDisponible: disponible,
        cantidadPrestado: prestado,
        cantidadDanado: danado
      };

      fetch(`${API_URL}/${editando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosEnvio)
      })
        .then(response => {
          if (!response.ok) throw new Error("Error al guardar libro");
          return response.json();
        })
        .then(() => {
          fetchLibros();
          cerrarModal();
        })
        .catch(error => {
          console.error("Error al guardar libro:", error);
          setErrorModal(error.message || "Error al guardar el libro");
        });
    }
  };

  const abrirModalEliminar = (libro) => {
    setLibroAEliminar(libro);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    if (!libroAEliminar) return;

    fetch(`${API_URL}/${libroAEliminar.idLibro}`, { 
      method: "DELETE" 
    })
      .then(response => {
        if (!response.ok) throw new Error("Error al eliminar");
        fetchLibros();
        setShowDeleteModal(false);
        setLibroAEliminar(null);
      })
      .catch(error => {
        console.error("Error al eliminar libro:", error);
        setError("Error al eliminar el libro");
        setShowDeleteModal(false);
        setLibroAEliminar(null);
      });
  };

  const cancelarEliminar = () => {
    setShowDeleteModal(false);
    setLibroAEliminar(null);
  };

  const editarLibro = (libro) => {
    setEditando(libro.idLibro);
    setFormData({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      cantidad: libro.cantidad,
      cantidadDisponible: libro.cantidadDisponible === 0 ? "" : libro.cantidadDisponible.toString(),
      cantidadPrestado: libro.cantidadPrestado === 0 ? "" : libro.cantidadPrestado.toString(),
      cantidadDanado: libro.cantidadDanado === 0 ? "" : libro.cantidadDanado.toString()
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setFormData({
      titulo: "",
      autor: "",
      isbn: "",
      cantidad: ""
    });
    setErrorModal(null);
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

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {libros.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">ID</th>
                <th className="px-4 py-4 text-left font-semibold">Título</th>
                <th className="px-4 py-4 text-left font-semibold">Autor</th>
                <th className="px-4 py-4 text-left font-semibold">ISBN</th>
                <th className="px-4 py-4 text-center font-semibold">✅ Disponible</th>
                <th className="px-4 py-4 text-center font-semibold">📤 Prestado</th>
                <th className="px-4 py-4 text-center font-semibold">❌ Dañado</th>
                <th className="px-4 py-4 text-center font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro) => (
                <tr key={libro.idLibro} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-4 text-gray-700">{libro.idLibro}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">{libro.titulo}</td>
                  <td className="px-4 py-4 text-gray-700">{libro.autor}</td>
                  <td className="px-4 py-4 text-gray-700 font-mono text-sm">{libro.isbn}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {libro.cantidadDisponible}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {libro.cantidadPrestado}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {libro.cantidadDanado}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center space-x-2">
                    <button
                      onClick={() => editarLibro(libro)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold transition inline-block"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => abrirModalEliminar(libro)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-semibold transition inline-block"
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-xl max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {editando ? "✏️ Editar Libro" : "➕ Agregar Libro"}
            </h2>

            {errorModal && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errorModal}
              </div>
            )}

            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      formData.titulo && (formData.titulo.trim().length < 3 || formData.titulo.trim().length > 150)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Ej: Don Quijote"
                  />
                  <p className="text-xs text-gray-500 mt-1">3-150 caracteres</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Autor *</label>
                  <input
                    type="text"
                    value={formData.autor}
                    onChange={(e) => setFormData({...formData, autor: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      formData.autor && (formData.autor.trim().length < 3 || formData.autor.trim().length > 100)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Ej: Miguel de Cervantes"
                  />
                  <p className="text-xs text-gray-500 mt-1">3-100 caracteres, solo letras</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">ISBN *</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      formData.isbn && (formData.isbn.length < 10 || formData.isbn.length > 17)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Ej: 978-84-11-47"
                  />
                  <p className="text-xs text-gray-500 mt-1">10-17 caracteres (números y guiones)</p>
                </div>

                {!editando && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Cantidad Total *</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.cantidad}
                      onChange={(e) => {
                        setFormData({...formData, cantidad: handleNumberInput(e.target.value)});
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        !validarCantidad(formData.cantidad, 1)
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Ingresa la cantidad"
                    />
                    <p className="text-xs text-gray-500 mt-1">1-200 copias (máx 3 dígitos)</p>
                  </div>
                )}
              </div>

              {editando && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">✅ Disponibles *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.cantidadDisponible}
                        onChange={(e) => setFormData({...formData, cantidadDisponible: handleNumberInput(e.target.value)})}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          !validarCantidad(formData.cantidadDisponible, 0)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">📤 Prestados *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.cantidadPrestado}
                        onChange={(e) => setFormData({...formData, cantidadPrestado: handleNumberInput(e.target.value)})}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          !validarCantidad(formData.cantidadPrestado, 0)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">❌ Dañados *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.cantidadDanado}
                        onChange={(e) => setFormData({...formData, cantidadDanado: handleNumberInput(e.target.value)})}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                          !validarCantidad(formData.cantidadDanado, 0)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Total:</strong> {(parseInt(formData.cantidadDisponible) || 0) + (parseInt(formData.cantidadPrestado) || 0) + (parseInt(formData.cantidadDanado) || 0)} copias (máx 200)
                    </p>
                  </div>
                </>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
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

      {showDeleteModal && libroAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">⚠️ Confirmar eliminación</h2>
            
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar el libro <strong>{libroAEliminar.titulo}</strong>?
              </p>
              <p className="text-sm text-gray-600 mt-2">Esta acción no se puede deshacer.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarEliminar}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                🗑️ Eliminar
              </button>
              <button
                onClick={cancelarEliminar}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}