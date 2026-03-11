# Sistema de Registro y Control de Asistencia - Laboratorio de Investigación en Inteligencia y Visión Artificial "Alan Turing"

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

Plataforma web full-stack desarrollada para modernizar, automatizar y gestionar el registro de horas trabajadas por los pasantes del laboratorio. El sistema elimina la dependencia del registro en papel, asegurando la integridad de los datos mediante reglas de negocio estrictas y validaciones en tiempo real.

## ✨ Características Principales

* **🔐 Autenticación Segura:** Sistema de login con JWT (JSON Web Tokens) y contraseñas encriptadas con `bcrypt`. Bloqueo de rutas protegidas y gestión de roles (Pasante y Administrador).
* **⏱️ Reloj Checador Inteligente:** Registro automático de entradas y salidas. El sistema bloquea el registro fuera de horarios de oficina, penaliza tiempos de sesión inválidos (< 10 minutos) e ignora sesiones no cerradas de días anteriores.
* **📊 Dashboard Estadístico:** Visualización interactiva de asistencias mediante gráficos de barras (`Recharts`) y cálculo automático de horas netas acumuladas.
* **⚙️ Panel Administrativo (CRUD):** Los administradores pueden gestionar usuarios, restablecer contraseñas, agregar registros de asistencia por contingencia (históricos) y eliminar registros inválidos con soft/hard deletes.
* **📥 Exportación de Datos:** Capacidad de exportar reportes de horas trabajadas y logs de asistencia en formato CSV.

## 📂 Estructura del Proyecto

El repositorio está dividido en tres áreas principales:

* `/frontend` - Aplicación cliente (React + Vite + Material-UI).
* `/backend` - API RESTful (Node.js + Express).
* `/archivosSQL` - Scripts y diagramas de modelado relacional para PostgreSQL.


## 🚀 Instalación y Uso Local

### Prerrequisitos
* Node.js (v16 o superior)
* PostgreSQL configurado y corriendo localmente (pgAdmin 4 recomendado).

### 1. Configuración de Base de Datos
1. Crea una base de datos en PostgreSQL llamada `pasantias_lab`.
2. Ejecuta los scripts ubicados en la carpeta `archivosSQL` para generar las tablas `usuarios` y `registros_asistencia`.

### 2. Configuración del Backend
```bash
cd backend
npm install
```
Crea un archivo .env en la raíz de la carpeta backend con las siguientes variables:
```bash
PORT=5000
PG_PASSWORD=tu_contraseña_de_postgres
JWT_SECRET=tu_clave_secreta_super_segura
```

Inicia el servidor de desarrollo:
```bash
node server.js
```
(Opcional: puedes modificar los horarios operativos del laboratorio editando el archivo `labConfig.js`).


### 3. Configuración del Frontend
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```

La aplicación cliente estará disponible en  `http://localhost:5173`.




## 👨‍💻 Autor

**Ozzy Loachamín** 🎓 *Estudiante de Ingeniería en Ciencias de la Computación*

[![GitHub](https://img.shields.io/badge/GitHub-OzzyJames11-181717?style=for-the-badge&logo=github)](https://github.com/OzzyJames11)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ozzy-loacham%C3%ADn-4a2146328/) 
[![Email](https://img.shields.io/badge/Email-Contáctame-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ozzy.loachamin@epn.edu.ec)



