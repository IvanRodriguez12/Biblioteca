import { Prestamo } from "../models/Prestamo.js";
import { Socio } from "../models/Socio.js";
import { Libro } from "../models/Libro.js";

// Obtener préstamos activos
export const obtenerPrestamos = async () => {
  return await Prestamo.findAll({
    where: { estadoPrestamo: "ACTIVO" },
    include: [
      { model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] },
      { model: Libro, attributes: ["idLibro", "titulo", "estado"] },
    ],
  });
};

// Crear préstamo
export const crearPrestamo = async ({ idLibro, idSocio, fechaInicio, fechaDevolucion }) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");
  if (libro.estado === "PRESTADO") throw new Error("El libro no está disponible");

  const prestamo = await Prestamo.create({
    idLibro,
    idSocio,
    fechaInicio,
    fechaDevolucion,
    estadoPrestamo: "ACTIVO",
  });

  libro.estado = "PRESTADO";
  await libro.save();
  return prestamo;
};

// Registrar devolución
export const cerrarPrestamo = async (idPrestamo) => {
  const prestamo = await Prestamo.findByPk(idPrestamo, { include: [Libro] });
  if (!prestamo) throw new Error("Préstamo no encontrado");

  prestamo.estadoPrestamo = "CERRADO";
  prestamo.fechaRealDevolucion = new Date();
  await prestamo.save();

  const libro = prestamo.Libro;
  libro.estado = "DISPONIBLE";
  await libro.save();

  return { msg: "Libro devuelto correctamente" };
};