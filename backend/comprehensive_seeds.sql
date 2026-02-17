-- ==========================================
-- COMPREHENSIVE SEED DATA PARA GARGOBARBA
-- ==========================================

USE gargobarb;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE appointments;
TRUNCATE TABLE services;
TRUNCATE TABLE barbershops;
-- No truncamos users para no borrar al Admin Leider, pero insertamos barberos si no existen
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Asegurar Barberos (rol 2)
INSERT IGNORE INTO users (username, full_name, email, password_hash, role_id, created_at, updated_at)
VALUES 
('BarberJuan', 'Juan Perez', 'juan@barber.com', '$2b$10$K7.t8.m.h.f.g.', 2, NOW(), NOW()),
('BarberPedro', 'Pedro Lopez', 'pedro@barber.com', '$2b$10$K7.t8.m.h.f.g.', 2, NOW(), NOW());

-- 2. Insertar Barbershop
INSERT INTO barbershops (user_id, name, address, city, is_active, created_at, updated_at)
SELECT id, 'Gargobarba Central', 'Calle 70 #10-50', 'Medellín', 1, NOW(), NOW()
FROM users WHERE role_id = 1 LIMIT 1;

-- 3. Insertar Servicios
INSERT INTO services (barbershop_id, name, description, price, duration_minutes, is_active, created_at, updated_at)
SELECT id, 'Corte Premium', 'Corte con detalles y lavado', 35000.00, 45, 1, NOW(), NOW() FROM barbershops LIMIT 1;

INSERT INTO services (barbershop_id, name, description, price, duration_minutes, is_active, created_at, updated_at)
SELECT id, 'Barba Completa', 'Diseño y afeitado tradicional', 20000.00, 30, 1, NOW(), NOW() FROM barbershops LIMIT 1;

-- 4. Insertar Citas Históricas (para probar ganancias X semanas/meses)
SET @barber1 = (SELECT id FROM users WHERE username = 'BarberJuan' LIMIT 1);
SET @barber2 = (SELECT id FROM users WHERE username = 'BarberPedro' LIMIT 1);
SET @client = (SELECT id FROM users WHERE role_id = 1 LIMIT 1); -- Usamos al admin como cliente para simplificar
SET @shop = (SELECT id FROM barbershops LIMIT 1);
SET @service1 = (SELECT id FROM services WHERE name = 'Corte Premium' LIMIT 1);
SET @service2 = (SELECT id FROM services WHERE name = 'Barba Completa' LIMIT 1);

-- Ganancias de HOY
INSERT INTO appointments (user_id, barbershop_id, service_id, barber_id, date, time, status, created_at, updated_at)
VALUES 
(@client, @shop, @service1, @barber1, CURDATE(), '09:00:00', 'completada', NOW(), NOW()),
(@client, @shop, @service2, @barber2, CURDATE(), '10:00:00', 'completada', NOW(), NOW());

-- Ganancias de hace 3 DIAS (Semana actual)
INSERT INTO appointments (user_id, barbershop_id, service_id, barber_id, date, time, status, created_at, updated_at)
VALUES 
(@client, @shop, @service1, @barber1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '14:00:00', 'completada', NOW(), NOW()),
(@client, @shop, @service2, @barber2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '15:00:00', 'completada', NOW(), NOW());

-- Ganancias de hace 15 DIAS (Mes actual)
INSERT INTO appointments (user_id, barbershop_id, service_id, barber_id, date, time, status, created_at, updated_at)
VALUES 
(@client, @shop, @service1, @barber1, DATE_SUB(CURDATE(), INTERVAL 15 DAY), '11:00:00', 'completada', NOW(), NOW());

-- Ganancias de hace 6 meses (Año actual)
INSERT INTO appointments (user_id, barbershop_id, service_id, barber_id, date, time, status, created_at, updated_at)
VALUES 
(@client, @shop, @service2, @barber2, DATE_SUB(CURDATE(), INTERVAL 6 MONTH), '16:00:00', 'completada', NOW(), NOW());
