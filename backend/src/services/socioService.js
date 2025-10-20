import { Socio } from "../models/Socio.js";
import { Prestamo } from "../models/Prestamo.js";
import { Op } from "sequelize";

// Validaciones
const validarDNI = (dni) => {
  if (!dni || dni.trim().length === 0) {
    throw new Error("El DNI es requerido");
  }
  const dniLimpio = dni.trim();
  if (dniLimpio.length < 7 || dniLimpio.length > 10) {
    throw new Error("El DNI debe tener entre 7 y 10 caracteres");
  }
  if (!/^\d+$/.test(dniLimpio)) {
    throw new Error("El DNI solo puede contener números");
  }
  return dniLimpio;
};

const validarNombre = (nombre) => {
  if (!nombre || nombre.trim().length === 0) {
    throw new Error("El nombre es requerido");
  }
  const nombreLimpio = nombre.trim();
  if (nombreLimpio.length < 3) {
    throw new Error("El nombre debe tener al menos 3 caracteres");
  }
  if (nombreLimpio.length > 100) {
    throw new Error("El nombre no puede exceder 100 caracteres");
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreLimpio)) {
    throw new Error("El nombre solo puede contener letras y espacios");
  }
  return nombreLimpio;
};

const validarEmail = (email) => {
  if (!email || email.trim().length === 0) {
    throw new Error("El email es requerido");
  }
  const emailLimpio = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailLimpio)) {
    throw new Error("El email no es válido");
  }
  if (emailLimpio.length > 100) {
    throw new Error("El email no puede exceder 100 caracteres");
  }
  return emailLimpio;
};

const validarTelefono = (telefono) => {
  if (!telefono || telefono.trim().length === 0) {
    throw new Error("El teléfono es requerido");
  }
  const telefonoLimpio = telefono.trim();
  if (!/^[\d\s\-\+]+$/.test(telefonoLimpio)) {
    throw new Error("El teléfono solo puede contener números, espacios, guiones y +");
  }
  if (telefonoLimpio.length < 7 || telefonoLimpio.length > 20) {
    throw new Error("El teléfono debe tener entre 7 y 20 caracteres");
  }
  return telefonoLimpio;
};

// Crear socio
export const registrarSocio = async (datos) => {
  const { dni, nombre, email, telefono } = datos;

  // Validar datos
  const dniValidado = validarDNI(dni);
  const nombreValidado = validarNombre(nombre);
  const emailValidado = validarEmail(email);
  const telefonoValidado = validarTelefono(telefono);

  // Verificar si ya existe un socio con el mismo DNI
  const existe = await Socio.findOne({ where: { dni: dniValidado } });
  if (existe) throw new Error("Ya existe un socio registrado con este DNI");

  // Verificar si ya existe un socio con el mismo email
  const emailExiste = await Socio.findOne({ where: { email: emailValidado } });
  if (emailExiste) throw new Error("Ya existe un socio registrado con este email");

  // Crear socio: el número se genera automáticamente por el hook beforeCreate
  const socio = await Socio.create({
    dni: dniValidado,
    nombre: nombreValidado,
    email: emailValidado,
    telefono: telefonoValidado
  });

  return socio;
};

// Listar socios
export const obtenerSocios = async () => {
  return await Socio.findAll({
    order: [["idSocio", "DESC"]]
  });
};

// Obtener socio por ID
export const obtenerSocioPorId = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de socio inválido");
  }
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  return socio;
};

// Actualizar socio
export const actualizarSocio = async (id, datos) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de socio inválido");
  }

  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");

  // Validar y actualizar nombre si se proporciona
  if (datos.nombre) {
    socio.nombre = validarNombre(datos.nombre);
  }

  // Validar y actualizar email si se proporciona
  if (datos.email) {
    const emailValidado = validarEmail(datos.email);
    // Verificar que no exista otro socio con ese email
    const emailExiste = await Socio.findOne({
      where: {
        email: emailValidado,
        idSocio: { [Op.ne]: id }
      }
    });
    if (emailExiste) {
      throw new Error("Este email ya está en uso por otro socio");
    }
    socio.email = emailValidado;
  }

  // Validar y actualizar teléfono si se proporciona
  if (datos.telefono) {
    socio.telefono = validarTelefono(datos.telefono);
  }

  await socio.save();
  return socio;
};

// Eliminar socio
export const eliminarSocio = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error("ID de socio inválido");
  }

  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");

  // Verificar si tiene préstamos activos
  const prestamosActivos = await Prestamo.count({
    where: {
      idSocio: id,
      estadoPrestamo: "ACTIVO"
    }
  });

  if (prestamosActivos > 0) {
    throw new Error(`No se puede eliminar el socio. Tiene ${prestamosActivos} préstamo(s) activo(s). Debe devolverlos primero.`);
  }

  await socio.destroy();
};