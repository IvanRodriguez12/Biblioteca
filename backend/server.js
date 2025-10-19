import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./src/config/db.js";

// Importar rutas
import libroRoutes from "./src/routes/libroRoutes.js";
import socioRoutes from "./src/routes/socioRoutes.js";
import prestamoRoutes from "./src/routes/prestamoRoutes.js";
import multaRoutes from "./src/routes/multaRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Endpoints principales
app.use("/api/libros", libroRoutes);
app.use("/api/socios", socioRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/multas", multaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  await sequelize.sync();
});

app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  res.status(500).json({ error: err.message });
});