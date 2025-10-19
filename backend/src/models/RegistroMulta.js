import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Socio } from "./Socio.js";

export const RegistroMulta = sequelize.define("RegistroMulta", {
  idMulta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  motivo: { type: DataTypes.STRING, allowNull: false },
  monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  estado: { type: DataTypes.ENUM("ACTIVA", "PAGADA"), defaultValue: "ACTIVA" },
  // 👇 esta es la columna que falta
  idSocio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Socio, key: "idSocio" },
  },
}, {
  timestamps: false,
});

// Relaciones
Socio.hasMany(RegistroMulta, {
  foreignKey: "idSocio",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

RegistroMulta.belongsTo(Socio, { foreignKey: "idSocio" });