import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Libro = sequelize.define("Libro", {
  idLibro: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  autor: { type: DataTypes.STRING, allowNull: false },
  isbn: { type: DataTypes.STRING, unique: true, allowNull: false },
  estado: { 
    type: DataTypes.ENUM("DISPONIBLE", "PRESTADO"), 
    defaultValue: "DISPONIBLE" 
  },
}, {
  timestamps: false,
});