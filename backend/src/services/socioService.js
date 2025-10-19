import { Socio } from "../models/Socio.js";

// Crear socio (sin pedir número de socio manualmente)
export const registrarSocio = async (datos) => {
  const { dni, nombre, email, telefono } = datos;
  if (!dni || !nombre) throw new Error("Datos incompletos");

  // Verificar si ya existe un socio con el mismo DNI
  const existe = await Socio.findOne({ where: { dni } });
  if (existe) throw new Error("El socio ya está registrado");

  // Crear socio: el número se genera automáticamente por el hook beforeCreate
  const socio = await Socio.create({ dni, nombre, email, telefono });
  return socio;
};

// Listar socios
export const obtenerSocios = async () => {
  return await Socio.findAll();
};

// Obtener socio por ID
export const obtenerSocioPorId = async (id) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  return socio;
};

// Actualizar socio
export const actualizarSocio = async (id, datos) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  await socio.update(datos);
  return socio;
};

// Eliminar socio
export const eliminarSocio = async (id) => {
  const socio = await Socio.findByPk(id);
  if (!socio) throw new Error("Socio no encontrado");
  await socio.destroy();
};