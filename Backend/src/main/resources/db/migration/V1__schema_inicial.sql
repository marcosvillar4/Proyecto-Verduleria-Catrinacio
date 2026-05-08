-- ============================================
-- V1 - Esquema inicial VerduleriaCatrinacio
-- ============================================

-- Tabla de usuarios
CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'VENDEDOR',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla de productos
CREATE TABLE producto (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    unidad_medida VARCHAR(20) NOT NULL DEFAULT 'KG',
    precio_compra DECIMAL(10,2) NOT NULL DEFAULT 0,
    precio_venta DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_actual DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_minimo DECIMAL(10,2) NOT NULL DEFAULT 0,
    categoria_id BIGINT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Tabla de proveedores
CREATE TABLE proveedor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(30),
    email VARCHAR(150),
    direccion VARCHAR(300),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingresos de mercadería
CREATE TABLE ingreso_mercaderia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id BIGINT,
    usuario_id BIGINT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observaciones VARCHAR(500),
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT fk_ingreso_proveedor FOREIGN KEY (proveedor_id) REFERENCES proveedor(id),
    CONSTRAINT fk_ingreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabla de detalle de ingreso
CREATE TABLE detalle_ingreso (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ingreso_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_detalle_ingreso_ingreso FOREIGN KEY (ingreso_id) REFERENCES ingreso_mercaderia(id),
    CONSTRAINT fk_detalle_ingreso_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Tabla de ventas
CREATE TABLE venta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    metodo_pago VARCHAR(30) NOT NULL DEFAULT 'EFECTIVO',
    estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADA',
    numero_ticket VARCHAR(50),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabla de detalle de venta
CREATE TABLE detalle_venta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (venta_id) REFERENCES venta(id),
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Tabla de alertas
CREATE TABLE alerta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    mensaje VARCHAR(500) NOT NULL,
    leida BOOLEAN NOT NULL DEFAULT FALSE,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alerta_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- ============================================
-- Datos iniciales
-- ============================================

-- Usuario administrador (password: admin123)
INSERT INTO usuario (nombre, apellido, email, password, rol, activo)
VALUES ('Admin', 'Sistema', 'admin@verduleria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', true);

-- Categorías iniciales
INSERT INTO categoria (nombre, descripcion, activa) VALUES ('Frutas', 'Frutas frescas de estación', true);
INSERT INTO categoria (nombre, descripcion, activa) VALUES ('Verduras', 'Verduras frescas', true);
INSERT INTO categoria (nombre, descripcion, activa) VALUES ('Hortalizas', 'Hortalizas y legumbres', true);
INSERT INTO categoria (nombre, descripcion, activa) VALUES ('Tubérculos', 'Papas, batatas y similares', true);
INSERT INTO categoria (nombre, descripcion, activa) VALUES ('Aromáticas', 'Hierbas aromáticas frescas', true);
