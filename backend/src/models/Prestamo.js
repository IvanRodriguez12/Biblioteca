import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Socio } from "./Socio.js";
import { Libro } from "./Libro.js";

export const Prestamo = sequelize.define("Prestamo", {
  idPrestamo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
  fechaDevolucion: { type: DataTypes.DATEONLY, allowNull: false },
  fechaRealDevolucion: { type: DataTypes.DATEONLY },
  multa: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  estadoPrestamo: { type: DataTypes.ENUM("ACTIVO", "CERRADO"), defaultValue: "ACTIVO" },
}, {
  timestamps: false,
});

// Relaciones
Socio.hasMany(Prestamo, {
  foreignKey: "idSocio",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
Prestamo.belongsTo(Socio, {
  foreignKey: "idSocio"
});

Libro.hasMany(Prestamo, {
  foreignKey: "idLibro",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});
Prestamo.belongsTo(Libro, {
  foreignKey: "idLibro"
});