import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Libro = sequelize.define("Libro", {
  idLibro: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  titulo: { 
    type: DataTypes.STRING(150), 
    allowNull: false 
  },
  autor: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  isbn: { 
    type: DataTypes.STRING(17), 
    unique: true, 
    allowNull: false 
  },
  cantidad: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  cantidadDisponible: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cantidadPrestado: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cantidadDanado: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: false,
});