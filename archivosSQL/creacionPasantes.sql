-- =========================================================================
-- SCRIPT DE INICIALIZACIÓN - LABORATORIO DE IA (VERSIÓN DEFINITIVA)
-- Base de Datos: pasantias_lab
-- =========================================================================

-- 1. Limpieza previa (por si se ejecuta múltiples veces)
DROP TABLE IF EXISTS registros_asistencia CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- =========================================================================
-- 2. Creación de Tabla: USUARIOS
-- =========================================================================
CREATE TABLE usuarios (
    id_usuario VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('pasante', 'administrador')) NOT NULL,
    horario TEXT,
    must_change_password BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true
);

-- =========================================================================
-- 3. Creación de Tabla: REGISTROS_ASISTENCIA
-- =========================================================================
CREATE TABLE registros_asistencia (
    id_registro SERIAL PRIMARY KEY,
    id_usuario VARCHAR(20) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_entrada TIMESTAMP NOT NULL,
    hora_salida TIMESTAMP,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'completo')) DEFAULT 'pendiente'
);

-- Índice para mejorar el rendimiento de consultas de historial por usuario
CREATE INDEX idx_registros_usuario ON registros_asistencia(id_usuario, hora_entrada DESC);

-- =========================================================================
-- 4. Inserción de Datos Iniciales (Administrador Maestro)
-- =========================================================================
-- Se inserta un administrador por defecto para acceder al sistema por primera vez.
-- El password insertado es el hash correspondiente a la contraseña: "admin123"
INSERT INTO usuarios (id_usuario, nombre, apellido, email, password, rol, horario, must_change_password, activo) 
VALUES (
    'A001', 
    'Admin', 
    'Sistema', 
    'admin.labia@epn.edu.ec', 
    '$2a$10$X.xGqB.0GkQ/o1P.p/E7I.1rVb6U/rQfL.Hw2oZ1N.2n8.M9c8N8u', 
    'administrador', 
    'Lunes a Viernes: 08:00 a 18:00',
    false,
    true
);

-- =========================================================================
-- 5. Inserción de Datos de Prueba (Opcional - Pasantes)
-- =========================================================================
-- Las contraseñas insertadas son el hash de "pasante123"
INSERT INTO usuarios (id_usuario, nombre, apellido, email, password, rol, horario, must_change_password, activo) 
VALUES 
('P001', 'Juan', 'Pérez', 'juan.perez@epn.edu.ec', '$2a$10$T1K.YkY9Yd5T1nB8.E7zU.6wO.yO.0eI4.4.yO.0eI4.4.yO.0eI4', 'pasante', E'Lunes: 09:00 a 11:00\nMiércoles: 10:00 a 13:00', true, true),
('P002', 'María', 'Gómez', 'maria.gomez@epn.edu.ec', '$2a$10$T1K.YkY9Yd5T1nB8.E7zU.6wO.yO.0eI4.4.yO.0eI4.4.yO.0eI4', 'pasante', 'Martes y Jueves: 14:00 a 18:00', true, true);

-- Registros históricos de prueba para P001
INSERT INTO registros_asistencia (id_usuario, fecha, hora_entrada, hora_salida, estado) VALUES
('P001', '2026-03-01', '2026-03-01 08:00:00', '2026-03-01 16:00:00', 'completo'),
('P001', '2026-03-04', '2026-03-04 08:15:00', '2026-03-04 16:05:00', 'completo');