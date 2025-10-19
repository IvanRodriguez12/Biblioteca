-- ============================================
-- 📘 SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema de Gestión de Biblioteca
-- ============================================

DROP DATABASE IF EXISTS biblioteca;
CREATE DATABASE biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE biblioteca;

-- ===============================
-- 🧍‍♂️ Tabla: Socios
-- ===============================
CREATE TABLE socio (
  idSocio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  numeroSocio VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100),
  telefono VARCHAR(30)
);

-- ===============================
-- 📚 Tabla: Libros
-- ===============================
CREATE TABLE libro (
  idLibro INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  isbn VARCHAR(30) NOT NULL UNIQUE,
  estado ENUM('DISPONIBLE', 'PRESTADO') DEFAULT 'DISPONIBLE'
);

-- ===============================
-- 🔄 Tabla: Préstamos
-- ===============================
CREATE TABLE prestamo (
  idPrestamo INT AUTO_INCREMENT PRIMARY KEY,
  idSocio INT NOT NULL,
  idLibro INT NOT NULL,
  fechaInicio DATE NOT NULL,
  fechaDevolucion DATE NOT NULL,
  fechaRealDevolucion DATE,
  multa DECIMAL(10,2) DEFAULT 0,
  estadoPrestamo ENUM('ACTIVO', 'CERRADO') DEFAULT 'ACTIVO',
  CONSTRAINT fk_prestamo_socio FOREIGN KEY (idSocio) REFERENCES socio(idSocio) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_prestamo_libro FOREIGN KEY (idLibro) REFERENCES libro(idLibro) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- 💰 Tabla: Registro de Multas
-- ===============================
CREATE TABLE registro_multa (
  idMulta INT AUTO_INCREMENT PRIMARY KEY,
  idPrestamo INT NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  descripcion VARCHAR(255),
  fecha DATE DEFAULT CURRENT_DATE,
  CONSTRAINT fk_multa_prestamo FOREIGN KEY (idPrestamo) REFERENCES prestamo(idPrestamo) ON DELETE CASCADE ON UPDATE CASCADE
);