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

















