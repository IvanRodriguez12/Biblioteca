# Sistema de Gestión de Biblioteca 📚

## 🏛️ Descripción general
El **Sistema de Gestión de Biblioteca** permite al bibliotecario administrar todos los procesos de la biblioteca municipal de forma digital.  
Incluye módulos para gestionar **libros, socios, préstamos y multas**, todo con una interfaz moderna, responsive y conectada a una base de datos MySQL mediante un backend en Node.js.

---

## ⚙️ Estructura del proyecto
```
BibliotecaApp/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Libro.js
│   │   │   ├── Socio.js
│   │   │   ├── Prestamo.js
│   │   │   └── RegistroMulta.js
│   │   ├── controllers/
│   │   │   ├── libroController.js
│   │   │   ├── socioController.js
│   │   │   ├── prestamoController.js
│   │   │   └── multaController.js
│   │   ├── services/
│   │   │   ├── libroService.js
│   │   │   ├── socioService.js
│   │   │   ├── prestamoService.js
│   │   │   └── multaService.js
│   │   ├── routes/
│   │   │   ├── librosRoutes.js
│   │   │   ├── sociosRoutes.js
│   │   │   ├── prestamosRoutes.js
│   │   │   └── multasRoutes.js
│   │   └── config/
│   │       └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   └── Footer.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LibrosPage.jsx
    │   │   ├── SociosPage.jsx
    │   │   ├── PrestamosPage.jsx
    │   │   └── MultasPage.jsx
    │   ├── App.jsx
    │   └── index.js
    ├── package.json
    └── public/
```

---

## 🧩 Tecnologías utilizadas
| Componente | Tecnología | Descripción |
|-------------|-------------|-------------|
| **Backend** | Node.js + Express.js | Servidor principal y API REST |
| **Base de datos** | MySQL + Sequelize ORM | Almacenamiento y modelado relacional |
| **Frontend** | React.js + Tailwind CSS | Interfaz de usuario moderna y responsive |
| **Gestión de entorno** | dotenv | Configuración de variables seguras |
| **Validación** | express-validator | Validación de datos en el backend |
| **CORS** | cors | Comunicación entre frontend y backend |

---

## 📂 Modelos principales
- **Libro** → título, autor, ISBN, cantidad, cantidadDisponible, cantidadPrestado, cantidadDanado
- **Socio** → nombre, DNI, número de socio, email, teléfono  
- **Préstamo** → socio, libro, fechaInicio, fechaDevolucion, estadoPrestamo
- **Multa** → socio, préstamo, motivo, monto, fecha, estado

### Relaciones del modelo:
- Un **Socio** puede tener **muchos Préstamos** y **muchas Multas**
- Un **Libro** puede estar asociado a **muchos Préstamos**
- Un **Préstamo** pertenece a **un Socio** y a **un Libro**
- Una **Multa** pertenece a **un Socio** y puede estar relacionada con **un Préstamo** (opcional)

---

## 🚀 Instalación y ejecución

### 1️⃣ Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd Biblioteca
```

### 2️⃣ Configurar el backend

```bash
cd backend
npm install
```

#### Dependencias del backend:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

#### Scripts del backend:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Crear un archivo `.env` en la carpeta `backend/` con el siguiente formato:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=biblioteca
PORT=3001
```

### 3️⃣ Crear la base de datos

Ejecutar el siguiente script SQL en MySQL:

```sql
CREATE DATABASE biblioteca;
USE biblioteca;
```

Las tablas se crearán automáticamente gracias a Sequelize cuando inicies el servidor.

### 4️⃣ Iniciar el servidor backend

```bash
npm run dev
```

Si todo está correcto, verás:

```
✅ Servidor ejecutándose en puerto 3001
✅ Conexión a la base de datos exitosa
```

### 5️⃣ Configurar el frontend

```bash
cd ../frontend
npm install
```

#### Dependencias del frontend:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "tailwindcss": "^3.3.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

#### Scripts del frontend:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 6️⃣ Iniciar el frontend

```bash
npm run dev
```

El frontend estará disponible en 👉 **http://localhost:5173**

---

## 💻 Funcionalidades principales

| Módulo | Descripción | Acciones |
|--------|-------------|----------|
| **Libros** | Administración del catálogo | Alta, edición, eliminación, búsqueda, listado |
| **Socios** | Registro de usuarios de la biblioteca | Alta, edición, eliminación, listado |
| **Préstamos** | Control de préstamos de libros | Asignación, devolución, listado por estado |
| **Multas** | Registro de sanciones | Alta (por retraso, daño, extravío), pago, listado |

### Funcionalidades especiales:

#### 📖 Módulo de Libros
- Control de inventario con cantidades: disponible, prestado, dañado
- Visualización en tiempo real del estado de cada libro
- Validación de ISBN único

#### 👥 Módulo de Socios
- Generación automática de número de socio
- Validación de DNI, email y teléfono
- Modal de confirmación para eliminación

#### 📅 Módulo de Préstamos
- Filtrado por préstamos activos y cerrados
- Cálculo automático de días de retraso
- Devolución con actualización automática de inventario
- Validación de disponibilidad antes de prestar

#### ⚠️ Módulo de Multas
- Tipos de multas: Retraso, Libro dañado, Libro extraviado, Otra
- Vinculación automática con préstamos
- Actualización automática del estado del libro según tipo de multa:
  - **Retraso**: libro vuelve a disponible
  - **Dañado**: libro marcado como dañado
  - **Extraviado**: libro se reduce del inventario total
- Modal de confirmación para pago
- Filtros por estado: Activas, Pagadas, Todas

---

## 🖥️ Interfaz de usuario

- **Navbar** fija superior con acceso directo a todos los módulos
- **Footer** institucional con la leyenda "© Biblioteca Magna - Panel Bibliotecario 2025"
- Cards, tablas y formularios con diseño responsive en Tailwind CSS
- Colores institucionales:
  - Libros: Rojo
  - Socios: Verde
  - Préstamos: Azul
  - Multas: Rojo/Amarillo
- Animaciones suaves y transiciones
- Totalmente funcional desde desktop y dispositivos móviles
- Modales personalizados para confirmaciones 

---

## 🔄 Flujo de trabajo típico

1. **Registrar un libro** en el catálogo
2. **Registrar un socio** en el sistema
3. **Crear un préstamo** asignando un libro disponible a un socio
4. **Devolver el libro** cuando el socio lo retorna
5. **Generar una multa** si:
   - El libro se devuelve con retraso
   - El libro está dañado
   - El libro se extravió

---

## 🐛 Resolución de problemas comunes

### El backend no inicia
- Verificar que MySQL esté corriendo
- Verificar las credenciales en el archivo `.env`
- Verificar que el puerto 3001 no esté en uso

### El frontend no se conecta al backend
- Verificar que el backend esté corriendo en el puerto 3001
- Verificar la URL de la API en los archivos de páginas del frontend
- Verificar que CORS esté habilitado en el backend

---

## 🧠 Créditos y autoría

**Desarrollado por:** Luciano Ivan Cirilo Rodriguez  
**Comisión:** 2  
**Año:** 2025  
**Institución:** Biblioteca Magna

---

## 📄 Licencia

Este proyecto es de uso académico y educativo.

---

## 📞 Contacto y soporte

Para consultas, sugerencias o reportes de errores, contactar a:
- Email: ivanrosriguez7@gmail.com
- GitHub: https://github.com/IvanRodriguez12

---

**¡Gracias por usar el Sistema de Gestión de Biblioteca! 📚✨**