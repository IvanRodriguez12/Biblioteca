import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;

// Crear DB si no existe
const crearBaseDeDatos = async () => {
  const conexion = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
  });
  await conexion.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await conexion.end();
};

await crearBaseDeDatos();

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});