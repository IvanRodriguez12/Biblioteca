import { Libro } from "../models/Libro.js";

// Validaciones
const validarTitulo = (titulo) => {
  if (!titulo || titulo.trim().length === 0) {
    throw new Error("El título es requerido");
  }
  const tituloLimpio = titulo.trim();
  if (tituloLimpio.length < 3) {
    throw new Error("El título debe tener al menos 3 caracteres");
  }
  if (tituloLimpio.length > 150) {
    throw new Error("El título no puede exceder 150 caracteres");
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s:,.-]+$/.test(tituloLimpio)) {
    throw new Error("El título contiene caracteres no válidos");
  }
  return tituloLimpio;
};

const validarAutor = (autor) => {
  if (!autor || autor.trim().length === 0) {
    throw new Error("El autor es requerido");
  }
  const autorLimpio = autor.trim();
  if (autorLimpio.length < 3) {
    throw new Error("El autor debe tener al menos 3 caracteres");
  }
  if (autorLimpio.length > 100) {
    throw new Error("El autor no puede exceder 100 caracteres");
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,.-]+$/.test(autorLimpio)) {
    throw new Error("El autor solo puede contener letras, espacios y símbolos básicos");
  }
  return autorLimpio;
};

const validarISBN = (isbn) => {
  if (!isbn || isbn.trim().length === 0) {
    throw new Error("El ISBN es requerido");
  }
  const isbnLimpio = isbn.trim();
  if (!/^[0-9\-]+$/.test(isbnLimpio)) {
    throw new Error("El ISBN solo puede contener números y guiones");
  }
  if (isbnLimpio.length < 10 || isbnLimpio.length > 17) {
    throw new Error("El ISBN debe tener entre 10 y 17 caracteres");
  }
  return isbnLimpio;
};

const validarCantidad = (cantidad) => {
  const cant = parseInt(cantidad);
  if (isNaN(cant) || cant < 1) {
    throw new Error("La cantidad debe ser mayor a 0");
  }
  if (cant > 1000) {
    throw new Error("La cantidad no puede exceder 1000 copias");
  }
  return cant;
};

// Crear libro
export const crearLibro = async (data) => {
  const { titulo, autor, isbn, cantidad } = data;

  // Validar datos
  const tituloValidado = validarTitulo(titulo);
  const autorValidado = validarAutor(autor);
  const isbnValidado = validarISBN(isbn);
  const cantidadValidada = validarCantidad(cantidad || 1);

  // Verificar ISBN duplicado
  const existente = await Libro.findOne({ where: { isbn: isbnValidado } });
  if (existente) {
    throw new Error("Ya existe un libro con ese ISBN");
  }

  const nuevoLibro = await Libro.create({
    titulo: tituloValidado,
    autor: autorValidado,
    isbn: isbnValidado,
    cantidad: cantidadValidada,
    cantidadDisponible: cantidadValidada,
    cantidadPrestado: 0,
    cantidadDanado: 0
  });

  return nuevoLibro;
};

// Listar todos los libros
export const obtenerLibros = async () => {
  return await Libro.findAll({
    order: [["idLibro", "DESC"]]
  });
};

// Obtener libro por ID
export const obtenerLibroPorId = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de libro inválido");
  }
  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");
  return libro;
};

// Actualizar libro
export const actualizarLibro = async (id, datos) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de libro inválido");
  }

  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");

  // Validar y actualizar título si se proporciona
  if (datos.titulo) {
    libro.titulo = validarTitulo(datos.titulo);
  }

  // Validar y actualizar autor si se proporciona
  if (datos.autor) {
    libro.autor = validarAutor(datos.autor);
  }

  // Validar y actualizar ISBN si se proporciona
  if (datos.isbn) {
    const isbnValidado = validarISBN(datos.isbn);
    if (isbnValidado !== libro.isbn) {
      const existente = await Libro.findOne({ 
        where: { 
          isbn: isbnValidado, 
          idLibro: { [require("sequelize").Op.ne]: id } 
        } 
      });
      if (existente) {
        throw new Error("Este ISBN ya está en uso por otro libro");
      }
    }
    libro.isbn = isbnValidado;
  }

  // Validar y actualizar cantidad si se proporciona
  if (datos.cantidad) {
    const nuevaCantidad = validarCantidad(datos.cantidad);
    const diferencia = nuevaCantidad - libro.cantidad;
    libro.cantidad = nuevaCantidad;
    libro.cantidadDisponible = Math.max(0, libro.cantidadDisponible + diferencia);
  }

  // Actualizar cantidades por estado
  if (datos.cantidadDisponible !== undefined) {
    libro.cantidadDisponible = Math.max(0, parseInt(datos.cantidadDisponible));
  }
  if (datos.cantidadPrestado !== undefined) {
    libro.cantidadPrestado = Math.max(0, parseInt(datos.cantidadPrestado));
  }
  if (datos.cantidadDanado !== undefined) {
    libro.cantidadDanado = Math.max(0, parseInt(datos.cantidadDanado));
  }

  // Validar que la suma no exceda la cantidad total
  const totalCopias = libro.cantidadDisponible + libro.cantidadPrestado + libro.cantidadDanado;
  if (totalCopias > libro.cantidad) {
    throw new Error("La suma de copias no puede exceder la cantidad total");
  }

  await libro.save();
  return libro;
};

// Eliminar libro
export const eliminarLibro = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de libro inválido");
  }

  const libro = await Libro.findByPk(id);
  if (!libro) throw new Error("Libro no encontrado");

  await libro.destroy();
};