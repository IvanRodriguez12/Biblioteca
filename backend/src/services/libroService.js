import { Libro } from "../models/Libro.js";

// Crear libro
export const crearLibro = async (data) => {
  const { titulo, autor, isbn } = data;
  if (!titulo || !autor || !isbn) throw new Error("Datos incompletos");

  const existente = await Libro.findOne({ where: { isbn } });
  if (existente) throw new Error("Ya existe un libro con ese ISBN");

  const nuevoLibro = await Libro.create({
    titulo,
    autor,
    isbn,
    estado: "DISPONIBLE"
  });
  return nuevoLibro;
};

// Listar todos los libros
export const obtenerLibros = async () => {
  return await Libro.findAll();
};

// Obtener libro por ID
export const obtenerLibroPorId = async (id) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  return libro;
};

// Actualizar libro
export const actualizarLibro = async (id, datos) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  await libro.update(datos);
  return libro;
};

// Eliminar libro
export const eliminarLibro = async (id) => {
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  await libro.destroy();
};

// Prestar libro
export const prestarLibro = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");
  if (libro.estado === "PRESTADO") throw new Error("El libro ya está prestado");

  libro.estado = "PRESTADO";
  await libro.save();
  return libro;
};

// Devolver libro
export const devolverLibro = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  if (!libro) throw new Error("Libro no encontrado");

  libro.estado = "DISPONIBLE";
  await libro.save();
  return libro;
};

// Estado
export const estaDisponible = async (idLibro) => {
  const libro = await Libro.findByPk(idLibro);
  return libro?.estado === "DISPONIBLE";
};