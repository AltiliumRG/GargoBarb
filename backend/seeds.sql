-- ==========================================
-- SEED DATA PARA GARGOBARBA
-- ==========================================

USE gargobarb;

-- 1. Promover a Leider a Admin (si existe)
UPDATE users SET role_id = 1 WHERE username = 'Leider' OR email = 'altiliumrg@gmail.com';

-- 2. Limpiar tablas para evitar duplicados en pruebas (opcional, pero útil)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE appointments;
TRUNCATE TABLE services;
TRUNCATE TABLE barbershops;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Insertar Barbershop para el admin
INSERT INTO barbershops (user_id, name, address, city, is_active, created_at, updated_at)
SELECT id, 'Gargobarba Central', 'Carrera 50 #10-20', 'Medellín', 1, NOW(), NOW()
FROM users WHERE role_id = 1 LIMIT 1;

-- 4. Insertar Servicios
INSERT INTO services (barbershop_id, name, description, price, duration_minutes, is_active, created_at, updated_at)
SELECT id, 'Corte de Cabello', 'Corte moderno con degradado', 25000.00, 30, 1, NOW(), NOW() FROM barbershops LIMIT 1;

INSERT INTO services (barbershop_id, name, description, price, duration_minutes, is_active, created_at, updated_at)
SELECT id, 'Perfilado de Barba', 'Arreglo con toalla caliente', 15000.00, 20, 1, NOW(), NOW() FROM barbershops LIMIT 1;

-- 5. Insertar Citas (Hoy: 2026-02-13)
INSERT INTO appointments (user_id, barbershop_id, service_id, date, time, status, notes, created_at, updated_at)
SELECT u.id, b.id, s.id, '2026-02-13', '10:00:00', 'confirmada', 'Cliente puntual', NOW(), NOW()
FROM users u, barbershops b, services s 
WHERE u.role_id = 1 AND s.name = 'Corte de Cabello' LIMIT 1;

INSERT INTO appointments (user_id, barbershop_id, service_id, date, time, status, notes, created_at, updated_at)
SELECT u.id, b.id, s.id, '2026-02-13', '11:00:00', 'pendiente', 'Requiere lavado', NOW(), NOW()
FROM users u, barbershops b, services s 
WHERE u.role_id = 1 AND s.name = 'Perfilado de Barba' LIMIT 1;
