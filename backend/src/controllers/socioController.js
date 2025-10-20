import * as SocioService from "../services/socioService.js";

// Obtener todos los socios
export const getSocios = async (req, res) => {
  try {
    const socios = await SocioService.obtenerSocios();
    res.json(socios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener socio por ID
export const getSocioById = async (req, res) => {
  try {
    const { id } = req.params;
    const socio = await SocioService.obtenerSocioPorId(id);
    res.json(socio);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Crear nuevo socio 
export const crearSocio = async (req, res) => {
  try {
    const { nombre, dni, email, telefono } = req.body;

    // Validaciones básicas de presencia
    if (!nombre || !dni || !email || !telefono) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios: nombre, dni, email, telefono"
      });
    }

    const socio = await SocioService.registrarSocio({ nombre, dni, email, telefono });
    res.status(201).json({
      msg: "Socio registrado correctamente",
      socio,
    });
  } catch (error) {
    console.error("Error en crearSocio:", error);
    res.status(400).json({ error: error.message });
  }
};

// Actualizar socio existente
export const actualizarSocio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de socio es requerido" });
    }

    const socio = await SocioService.actualizarSocio(id, req.body);
    res.json({ msg: "Socio actualizado correctamente", socio });
  } catch (error) {
    console.error("Error en actualizarSocio:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar socio
export const eliminarSocio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de socio es requerido" });
    }

    await SocioService.eliminarSocio(id);
    res.json({ msg: "Socio eliminado correctamente" });
  } catch (error) {
    console.error("Error en eliminarSocio:", error);
    res.status(400).json({ error: error.message });
  }
};