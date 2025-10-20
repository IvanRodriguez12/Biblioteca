import { Prestamo } from "../models/Prestamo.js";
import { Socio } from "../models/Socio.js";
import { Libro } from "../models/Libro.js";

// Validar cantidad de días
const validarDias = (fechaInicio, fechaDevolucion) => {
  const inicio = new Date(fechaInicio);
  const devolucion = new Date(fechaDevolucion);
  const dias = Math.floor((devolucion - inicio) / (1000 * 60 * 60 * 24));
  
  if (dias < 1) {
    throw new Error("El préstamo debe ser por al menos 1 día");
  }
  if (dias > 365 * 50) {
    throw new Error("El préstamo no puede superar 50 años de duración");
  }
  return dias;
};

// Calcular multa por retraso
const calcularMulta = (fechaVencimiento, fechaDevolucion) => {
  const vencimiento = new Date(fechaVencimiento);
  const devolucion = new Date(fechaDevolucion);
  
  if (devolucion <= vencimiento) return 0;
  
  const diasRetraso = Math.floor((devolucion - vencimiento) / (1000 * 60 * 60 * 24));
  const multa = diasRetraso * 0.50; // $0.50 por día de retraso
  
  return Math.min(multa, 50); // Máximo $50
};

// Obtener todos los préstamos (activos y cerrados)
export const obtenerPrestamos = async () => {
  return await Prestamo.findAll({
    include: [
      { model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] },
      { model: Libro, attributes: ["idLibro", "titulo", "cantidadDisponible", "cantidadPrestado"] },
    ],
    order: [["idPrestamo", "DESC"]]
  });
};

// Obtener préstamos activos
export const obtenerPrestamosActivos = async () => {
  return await Prestamo.findAll({
    where: { estadoPrestamo: "ACTIVO" },
    include: [
      { model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] },
      { model: Libro, attributes: ["idLibro", "titulo", "cantidadDisponible", "cantidadPrestado"] },
    ],
    order: [["idPrestamo", "DESC"]]
  });
};

// Crear préstamo
export const crearPrestamo = async ({ idLibro, idSocio, fechaInicio, fechaDevolucion }) => {
  // Validar que el libro existe
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");

  // Validar que hay copias disponibles
  if (libro.cantidadDisponible <= 0) {
    throw new Error("No hay copias disponibles de este libro");
  }

  // Validar que el socio existe
  const socio = await Socio.findByPk(idSocio);
  if (!socio) throw new Error("Socio no encontrado");

  // Validar fechas
  validarDias(fechaInicio, fechaDevolucion);

  // Crear el préstamo
  const prestamo = await Prestamo.create({
    idLibro,
    idSocio,
    fechaInicio,
    fechaDevolucion,
    multa: 0,
    estadoPrestamo: "ACTIVO",
  });

  // Actualizar cantidades del libro
  libro.cantidadDisponible -= 1;
  libro.cantidadPrestado += 1;
  await libro.save();

  return prestamo;
};

// Registrar devolución
export const cerrarPrestamo = async (idPrestamo, fechaRealDevolucion) => {
  const prestamo = await Prestamo.findByPk(idPrestamo, { include: [Libro] });
  if (!prestamo) throw new Error("Préstamo no encontrado");

  if (prestamo.estadoPrestamo === "CERRADO") {
    throw new Error("Este préstamo ya fue cerrado");
  }

  // Calcular multa por retraso si aplica
  const multa = calcularMulta(prestamo.fechaDevolucion, fechaRealDevolucion);

  // Actualizar préstamo
  prestamo.estadoPrestamo = "CERRADO";
  prestamo.fechaRealDevolucion = fechaRealDevolucion;
  prestamo.multa = multa;
  await prestamo.save();

  // Actualizar cantidades del libro
  const libro = prestamo.Libro;
  libro.cantidadDisponible += 1;
  libro.cantidadPrestado -= 1;
  await libro.save();

  return { 
    msg: "Libro devuelto correctamente",
    multa: multa > 0 ? `Se registró una multa de $${multa.toFixed(2)} por ${Math.floor((new Date(fechaRealDevolucion) - new Date(prestamo.fechaDevolucion)) / (1000 * 60 * 60 * 24))} días de retraso` : "Sin multa"
  };
};