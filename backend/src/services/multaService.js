import { RegistroMulta } from "../models/RegistroMulta.js";
import { Socio } from "../models/Socio.js";

export const obtenerMultas = async () => {
  return await RegistroMulta.findAll({
    include: [{ model: Socio, attributes: ["idSocio", "nombre", "numeroSocio"] }],
    order: [["fecha", "DESC"], ["idMulta", "DESC"]],
  });
};

export const crearMulta = async ({ idSocio, motivo, monto, fecha }) => {
  if (!idSocio || !motivo || !monto || !fecha) {
    throw new Error("Datos incompletos para registrar la multa");
  }

  const multa = await RegistroMulta.create({
    idSocio,
    motivo,
    monto: parseFloat(monto),
    fecha,
    estado: "ACTIVA", 
  });

  return multa;
};

export const cancelarMulta = async (idMulta) => {
  const multa = await RegistroMulta.findByPk(idMulta);
  if (!multa) throw new Error("Multa no encontrada");

  multa.estado = "PAGADA"; 
  await multa.save();

  return { msg: "Multa cancelada correctamente" };
};