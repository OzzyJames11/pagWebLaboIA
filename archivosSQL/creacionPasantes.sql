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

select * from usuarios
select * from registros_asistencia WHERE id_usuario = 'P001';
select * from registros_asistencia WHERE id_usuario = 'A001';


-- Inserción de datos de ejemplo en la tabla registros_asistencia
INSERT INTO registros_asistencia (id_usuario, fecha, hora_entrada, hora_salida, estado) VALUES
('P001', '2025-03-29', '2025-03-29 08:05:12.123', '2025-03-29 17:12:45.456', 'completo'),
('P001', '2025-03-30', '2025-03-30 08:10:33.231', '2025-03-30 17:00:01.789', 'completo'),
('P001', '2025-03-31', '2025-03-31 08:01:45.321', '2025-03-31 16:45:23.456', 'completo'),
('P001', '2025-04-01', '2025-04-01 08:15:22.654', '2025-04-01 17:10:10.111', 'completo'),
('P001', '2025-04-02', '2025-04-02 08:20:00.999', '2025-04-02 17:20:35.888', 'completo'),
('P001', '2025-04-03', '2025-04-03 07:55:44.012', '2025-04-03 16:50:29.456', 'completo'),
('P001', '2025-04-04', '2025-04-04 08:00:00.500', NULL, 'pendiente'),
('P001', '2025-04-05', '2025-04-05 08:03:30.312', '2025-04-05 17:05:05.732', 'completo'),
('P001', '2025-04-06', '2025-04-06 08:07:15.890', '2025-04-06 17:25:50.222', 'completo'),
('P001', '2025-04-07', '2025-04-07 08:11:59.701', NULL, 'pendiente'),
('P001', '2025-04-08', '2025-04-08 08:02:43.123', '2025-04-08 17:11:17.456', 'completo'),
('P001', '2025-04-09', '2025-04-09 08:14:35.999', '2025-04-09 17:07:41.777', 'completo'),
('P001', '2025-04-10', '2025-04-10 08:09:58.843', '2025-04-10 17:19:08.333', 'completo'),
('P001', '2025-04-11', '2025-04-11 08:13:02.101', NULL, 'pendiente'),
('P001', '2025-04-12', '2025-04-12 08:06:24.789', '2025-04-12 16:59:59.100', 'completo'),
('P001', '2025-04-13', '2025-04-13 08:04:12.777', '2025-04-13 17:22:45.211', 'completo'),
('P001', '2025-04-14', '2025-04-14 08:08:51.369', '2025-04-14 17:04:14.789', 'completo'),
('P001', '2025-04-15', '2025-04-15 08:16:33.300', NULL, 'pendiente'),
('P001', '2025-04-16', '2025-04-16 08:12:17.800', '2025-04-16 17:16:22.100', 'completo'),
('P001', '2025-04-17', '2025-04-17 08:18:45.200', '2025-04-17 17:30:00.000', 'completo');


-- Actualización V5.0
-- Creación de más usuarios
INSERT INTO usuarios (id_usuario, nombre, apellido, email, password, rol, horario) VALUES
('P003', 'Jamesz', 'Martinezz', 'james.martinezz@email.com', 'jamesz123', 'pasante', E'Lunes: 09:00 a 11:00\nMartes: 14:00 a 16:00\nMiércoles: 10:00 a 13:00' );

SELECT * FROM usuarios ORDER BY id_usuario ASC;
SELECT id_usuario, horario FROM usuarios


-- columna para reforzar el cambio de contraseña
ALTER TABLE usuarios ADD COLUMN must_change_password BOOLEAN DEFAULT false;

cmCqP4Z2C2
CQ6kU9MWk4

ZQsmkswFeL
uvsn9s

DELETE FROM usuarios WHERE id_usuario = '202098765';

-- columna para implementar el soft delete
ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT true;


-- regresar del soft delete a un usuario
UPDATE usuarios SET activo = true WHERE id_usuario = '201820543';


















