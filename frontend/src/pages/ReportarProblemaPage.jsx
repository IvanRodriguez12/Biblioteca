import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ReportarProblemaPage() {
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    descripcion: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí se enviaría el formulario en una versión real
    console.log("Formulario enviado:", formData);
    setFormularioEnviado(true);
    
    // Reset del formulario después de 3 segundos
    setTimeout(() => {
      setFormularioEnviado(false);
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        descripcion: ""
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Reportar un Problema</h1>
          <p className="text-gray-600 text-lg">Ponte en contacto con nuestro equipo de soporte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Columna: Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envía tu Reporte</h2>
              
              {formularioEnviado && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Tu reporte ha sido enviado correctamente. Nos pondremos en contacto pronto.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Asunto *</label>
                  <select
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un tipo de problema</option>
                    <option value="error-datos">Error en los datos</option>
                    <option value="falla-modulo">Falla en un módulo</option>
                    <option value="falla-conexion">Falla de conexión</option>
                    <option value="error-validacion">Error de validación</option>
                    <option value="sugerencia">Sugerencia de mejora</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Descripción del Problema *</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe detalladamente el problema que encontraste..."
                    rows="6"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-2">Sé lo más detallado posible para ayudarnos a resolver el problema rápidamente.</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  📧 Enviar Reporte
                </button>
              </form>
            </div>
          </div>

          {/* Columna: Información de Contacto */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contacto Directo</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    📧 Email
                  </h4>
                  <a
                    href="mailto:programadores@gmail.com"
                    className="text-red-600 hover:text-red-700 font-medium break-all"
                  >
                    programadores@gmail.com
                  </a>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    📞 Teléfono
                  </h4>
                  <a
                    href="tel:+543624404011"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    +54 362 440 4011
                  </a>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Nuestro equipo de soporte está disponible para ayudarte con cualquier problema o duda que tengas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Consejo</h4>
              <p className="text-sm text-blue-800">
                Antes de reportar, verifica la página de <Link to="/ayuda-soporte" className="font-semibold hover:underline">Ayuda y Soporte</Link> por si la solución ya está disponible.
              </p>
            </div>
          </div>
        </div>

        {/* Sección: Información Adicional */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                ⏱️ Tiempo de Respuesta
              </h4>
              <p className="text-gray-700 text-sm">
                Nuestro equipo se compromete a responder en las primeras 24 horas hábiles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                📝 Información Requerida
              </h4>
              <p className="text-gray-700 text-sm">
                Por favor proporciona detalles específicos del problema para una mejor asistencia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                🔒 Privacidad
              </h4>
              <p className="text-gray-700 text-sm">
                Tu información será tratada de manera confidencial y segura.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                ✓ Confirmación
              </h4>
              <p className="text-gray-700 text-sm">
                Recibirás un correo de confirmación cuando tu reporte sea recibido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}