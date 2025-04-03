-- Creacion de la tabla pasantes
CREATE TABLE pasantes (
    id_pasante SERIAL PRIMARY KEY, -- Este campo es clave primaria y se autoincrementa
    nombre VARCHAR(100) NOT NULL,  -- El nombre no puede ser nulo, con un límite de 100 caracteres
    apellido VARCHAR(100) NOT NULL, -- El apellido no puede ser nulo, con un límite de 100 caracteres
    email VARCHAR(100) NOT NULL, -- El email no puede ser nulo y debe ser único
    fecha_ingreso DATE NOT NULL -- La fecha de ingreso no puede ser nula
);

INSERT INTO pasantes (nombre, apellido, email, fecha_ingreso) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '2025-03-29'),
('María', 'Gómez', 'maria.gomez@email.com', '2025-03-30'),
('Carlos', 'López', 'carlos.lopez@email.com', '2025-03-31');

SELECT * FROM pasantes

INSERT INTO pasantes (nombre, apellido, email, fecha_ingreso) VALUES
('James', 'Martínez', 'james.martinez@gmail.com', '2025-03-30');

--reestructuracion de la BD
DROP TABLE IF EXISTS pasantes;


-- Creación de la tabla de usuarios (pasantes y administradores)
CREATE TABLE usuarios (
    id_usuario VARCHAR(20) PRIMARY KEY, -- Código único
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL, -- Único para evitar duplicados
    fecha_ingreso DATE NOT NULL,
    password TEXT NOT NULL, -- Almacenar la contraseña (idealmente cifrada en backend)
    rol VARCHAR(20) CHECK (rol IN ('pasante', 'administrador')) NOT NULL -- Solo permite estos valores
);


INSERT INTO usuarios (id_usuario, nombre, apellido, email, fecha_ingreso, password, rol) VALUES
('P001', 'Juan', 'Pérez', 'juan.perez@email.com', '2025-03-29', 'hashed_password_juan', 'pasante'),
('P002', 'María', 'Gómez', 'maria.gomez@email.com', '2025-03-30', 'hashed_password_maria', 'pasante'),
('A001', 'Carlos', 'López', 'carlos.lopez@email.com', '2025-03-31', 'hashed_password_carlos', 'administrador');


SELECT * FROM usuarios;

INSERT INTO usuarios (id_usuario, nombre, apellido, email, fecha_ingreso, password, rol) VALUES
('P003', 'James', 'Martínez', 'james.martinez@gmail.com', '2025-03-30', 'james123', 'pasante');


-- contraseñas normales
-- Elimina la tabla si ya existe

DROP TABLE IF EXISTS usuarios;

-- Creación de la tabla de usuarios
CREATE TABLE usuarios (
    id_usuario VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_ingreso DATE NOT NULL,
    password TEXT NOT NULL, -- Almacenaremos contraseñas en texto plano temporalmente
    rol VARCHAR(20) CHECK (rol IN ('pasante', 'administrador')) NOT NULL
);

-- Inserts con contraseñas en texto plano (fáciles de recordar)
INSERT INTO usuarios (id_usuario, nombre, apellido, email, fecha_ingreso, password, rol) VALUES
('P001', 'Juan', 'Pérez', 'juan.perez@email.com', '2025-03-29', 'pasante123', 'pasante'),
('P002', 'María', 'Gómez', 'maria.gomez@email.com', '2025-03-30', 'pasante456', 'pasante'),
('A001', 'Carlos', 'López', 'carlos.lopez@email.com', '2025-03-31', 'admin123', 'administrador');


SELECT * FROM usuarios
SELECT id_usuario, password FROM usuarios;


INSERT INTO usuarios (id_usuario, nombre, apellido, email, fecha_ingreso, password, rol) VALUES
('P003', 'Juana', 'Péreza', 'juana.perez@email.com', '2025-03-24', 'pasante03', 'pasante'),
('P004', 'Juano', 'Pérezo', 'juano.perez@email.com', '2025-03-25', 'pasante04', 'pasante'),
('P005', 'Juane', 'Péreze', 'juane.perez@email.com', '2025-03-26', 'pasante05', 'pasante');

SELECT * FROM usuarios



-- NUEVO CAMBIO 3.0
/* 2 tablas para los usuarios y registro de la asistencia */

-- Elimina la tabla si existe
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS registros_asistencia;

-- Nueva tabla de usuarios (simplificada)
CREATE TABLE usuarios (
    id_usuario VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('pasante', 'administrador')) NOT NULL
);

-- Tabla para registrar asistencias
CREATE TABLE registros_asistencia (
    id_registro SERIAL PRIMARY KEY,
    id_usuario VARCHAR(20) REFERENCES usuarios(id_usuario),
    fecha DATE NOT NULL,
    hora_entrada TIMESTAMP NOT NULL,
    hora_salida TIMESTAMP,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'completo')) DEFAULT 'pendiente'
);

-- Insertar datos de prueba
INSERT INTO usuarios (id_usuario, nombre, apellido, email, password, rol) VALUES
('P001', 'Juan', 'Pérez', 'juan.perez@email.com', 'pasante123', 'pasante'),
('A001', 'Admin', 'Sistema', 'admin@email.com', 'admin123', 'administrador');


SELECT * FROM usuarios

SELECT * FROM registros_asistencia


CREATE INDEX idx_registros_usuario ON registros_asistencia(id_usuario, hora_entrada DESC);


-- Nuevo cambio V 4.0
-- Agregar columna de horario a la tabla usuarios
ALTER TABLE usuarios ADD COLUMN horario TEXT;

-- Actualizar los usuarios existentes (ejemplo)
UPDATE usuarios SET horario = 'Lunes a Viernes: 09:00 a 17:00' WHERE id_usuario = 'P001';
UPDATE usuarios SET horario = 'Lunes a Viernes: 08:00 a 18:00' WHERE id_usuario = 'A001';


INSERT INTO registros_asistencia (id_usuario, fecha, hora_entrada, hora_salida, estado) VALUES
('P001', '2025-03-01', '2025-03-01 08:00:00', '2025-03-01 16:00:00', 'completo'),
('P001', '2025-03-04', '2025-03-04 08:15:00', '2025-03-04 16:05:00', 'completo'),
('P001', '2025-03-07', '2025-03-07 08:30:00', '2025-03-07 16:10:00', 'completo'),
('P001', '2025-03-10', '2025-03-10 08:05:00', '2025-03-10 16:15:00', 'completo'),
('P001', '2025-03-13', '2025-03-13 08:10:00', '2025-03-13 16:00:00', 'completo'),
('P001', '2025-03-16', '2025-03-16 08:00:00', '2025-03-16 16:20:00', 'completo'),
('P001', '2025-03-19', '2025-03-19 08:25:00', '2025-03-19 16:10:00', 'completo'),
('P001', '2025-03-22', '2025-03-22 08:35:00', '2025-03-22 16:05:00', 'completo'),
('P001', '2025-03-25', '2025-03-25 08:00:00', '2025-03-25 16:00:00', 'completo'),
('P001', '2025-03-28', '2025-03-28 08:10:00', '2025-03-28 16:10:00', 'completo');







SELECT COUNT(*) FROM registros_asistencia WHERE id_usuario = 'P001';






