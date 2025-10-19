import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Socio = sequelize.define("Socio", {
  idSocio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  numeroSocio: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING
  },
  telefono: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false,
});

Socio.beforeCreate(async (socio) => {
  const ultimoSocio = await Socio.max("numeroSocio");
  const nuevoNumero = ultimoSocio ? parseInt(ultimoSocio) + 1 : 1;
  socio.numeroSocio = nuevoNumero.toString().padStart(4, "0"); 
});