-- ============================================
-- 📘 DATOS DE EJEMPLO PARA LA BIBLIOTECA
-- ============================================

USE biblioteca;

-- ==========================
-- 🧍‍♂️ SOCIOS
-- ==========================
INSERT INTO socio (nombre, dni, numeroSocio, email, telefono)
VALUES 
('Ana Pérez', '40123456', 'S001', 'ana@example.com', '1123456789'),
('Carlos Gómez', '38987654', 'S002', 'carlos@example.com', '1134567890');

-- ==========================
-- 📚 LIBROS
-- ==========================
INSERT INTO libro (titulo, autor, isbn, estado)
VALUES
('Cien años de soledad', 'Gabriel García Márquez', '9788497592208', 'DISPONIBLE'),
('El Principito', 'Antoine de Saint-Exupéry', '9780156013987', 'DISPONIBLE'),
('Rayuela', 'Julio Cortázar', '9788437604947', 'PRESTADO');

-- ==========================
-- 🔄 PRÉSTAMOS
-- ==========================
INSERT INTO prestamo (idSocio, idLibro, fechaInicio, fechaDevolucion, fechaRealDevolucion, multa, estadoPrestamo)
VALUES 
(1, 3, '2025-10-10', '2025-10-17', NULL, 0, 'ACTIVO');

-- ==========================
-- 💰 MULTAS
-- ==========================
INSERT INTO registro_multa (idPrestamo, monto, descripcion, fecha)
VALUES
(1, 150.00, 'Devolución tardía', '2025-10-15');