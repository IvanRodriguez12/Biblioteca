import { RegistroMulta } from "../models/RegistroMulta.js";
import { Socio } from "../models/Socio.js";
import { Prestamo } from "../models/Prestamo.js";
import { Libro } from "../models/Libro.js";
import { sequelize } from "../config/db.js";

export const obtenerMultas = async () => {
  return await RegistroMulta.findAll({
    include: [{ model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] }],
    order: [["fecha", "DESC"], ["idMulta", "DESC"]],
  });
};

export const crearMulta = async ({ idSocio, motivo, monto, fecha, idPrestamo }) => {
  if (!idSocio || !motivo || !monto || !fecha) {
    throw new Error("Datos incompletos para registrar la multa");
  }

  // Validar que motivos que requieren préstamo lo tengan
  const motivosQueRequierenPrestamo = [
    "Retraso en devolución",
    "Libro dañado",
    "Libro extraviado"
  ];

  if (motivosQueRequierenPrestamo.includes(motivo) && !idPrestamo) {
    throw new Error("Este tipo de multa requiere un préstamo asociado");
  }

  // Usar transacción para garantizar integridad de datos
  const resultado = await sequelize.transaction(async (t) => {
    // Crear la multa
    const multa = await RegistroMulta.create({
      idSocio,
      motivo,
      monto: parseFloat(monto),
      fecha,
      estado: "ACTIVA",
      idPrestamo: idPrestamo || null,
    }, { transaction: t });

    // Si hay préstamo relacionado, actualizar según el motivo
    if (idPrestamo) {
      const prestamo = await Prestamo.findByPk(idPrestamo, {
        include: [Libro],
        transaction: t
      });

      if (!prestamo) {
        throw new Error("Préstamo no encontrado");
      }

      if (prestamo.estadoPrestamo === "CERRADO") {
        throw new Error("Este préstamo ya fue cerrado");
      }

      const libro = prestamo.Libro;

      // Validar que el libro tenga libros prestados
      if (libro.cantidadPrestado <= 0) {
        throw new Error("Error: el libro no tiene ejemplares prestados");
      }

      switch (motivo) {
        case "Retraso en devolución":
          // Devolver el libro normalmente (disponible +1, prestado -1)
          await libro.update({
            cantidadDisponible: libro.cantidadDisponible + 1,
            cantidadPrestado: libro.cantidadPrestado - 1
          }, { transaction: t });

          // Cerrar el préstamo
          await prestamo.update({
            estadoPrestamo: "CERRADO",
            fechaRealDevolucion: fecha
          }, { transaction: t });
          break;

        case "Libro dañado":
          // Marcar como dañado (dañado +1, prestado -1)
          await libro.update({
            cantidadDanado: libro.cantidadDanado + 1,
            cantidadPrestado: libro.cantidadPrestado - 1
          }, { transaction: t });

          // Cerrar el préstamo
          await prestamo.update({
            estadoPrestamo: "CERRADO",
            fechaRealDevolucion: fecha
          }, { transaction: t });
          break;

        case "Libro extraviado":
          // El libro se pierde completamente del inventario
          // Reducir: cantidad total -1, prestado -1
          await libro.update({
            cantidad: libro.cantidad - 1,
            cantidadPrestado: libro.cantidadPrestado - 1
          }, { transaction: t });

          // Cerrar el préstamo
          await prestamo.update({
            estadoPrestamo: "CERRADO",
            fechaRealDevolucion: fecha
          }, { transaction: t });
          break;
      }
    }

    return multa;
  });

  return resultado;
};

export const cancelarMulta = async (idMulta) => {
  const multa = await RegistroMulta.findByPk(idMulta);
  if (!multa) throw new Error("Multa no encontrada");

  if (multa.estado === "PAGADA") {
    throw new Error("Esta multa ya está pagada");
  }

  multa.estado = "PAGADA"; 
  await multa.save();

  return { msg: "Multa cancelada correctamente" };
};