CREATE DATABASE IF NOT EXISTS moodalert CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moodalert;
CREATE TABLE IF NOT EXISTS usuarios (
 id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE, senha_hash VARCHAR(255) NULL,
 nivel ENUM('paciente','medico') NOT NULL DEFAULT 'paciente'
);
CREATE TABLE IF NOT EXISTS registros_humor (
 id INT AUTO_INCREMENT PRIMARY KEY, paciente_id INT NOT NULL,
 data DATE NOT NULL, humor TINYINT NOT NULL, sono DECIMAL(3,1) NOT NULL,
 nota VARCHAR(1000) NOT NULL DEFAULT '', criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (paciente_id) REFERENCES usuarios(id), UNIQUE KEY registro_diario (paciente_id,data),
 CHECK (humor BETWEEN 1 AND 5), CHECK (sono BETWEEN 0 AND 24)
);
INSERT IGNORE INTO usuarios (id,nome,email,nivel) VALUES (1,'Paciente de demonstração','paciente@example.com','paciente');
