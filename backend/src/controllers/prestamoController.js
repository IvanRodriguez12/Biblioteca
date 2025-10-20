import * as PrestamoService from "../services/prestamoService.js";

export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await PrestamoService.obtenerPrestamos();
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearPrestamo = async (req, res) => {
  try {
    const { idLibro, idSocio, fechaInicio, fechaDevolucion } = req.body;

    if (!idLibro || !idSocio || !fechaInicio || !fechaDevolucion) {
      return res.status(400).json({ 
        error: "Los campos idLibro, idSocio, fechaInicio y fechaDevolucion son obligatorios" 
      });
    }

    const prestamo = await PrestamoService.crearPrestamo({
      idLibro,
      idSocio,
      fechaInicio,
      fechaDevolucion
    });

    res.status(201).json({ msg: "Préstamo registrado correctamente", prestamo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const devolverLibro = async (req, res) => {
  try {
    const { idPrestamo } = req.params;
    const { fechaRealDevolucion } = req.body;

    if (!idPrestamo) {
      return res.status(400).json({ error: "ID de préstamo es requerido" });
    }

    if (!fechaRealDevolucion) {
      return res.status(400).json({ error: "La fecha de devolución es requerida" });
    }

    const resultado = await PrestamoService.cerrarPrestamo(idPrestamo, fechaRealDevolucion);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};