-- Veritabanını oluştur
DROP DATABASE IF EXISTS trading_signals;
CREATE DATABASE IF NOT EXISTS trading_signals;
USE trading_signals;

-- Users tablosu
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    role ENUM('user', 'trader') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Signals tablosu
DROP TABLE IF EXISTS signals;
CREATE TABLE signals (
    signal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    direction ENUM('long', 'short') NOT NULL,
    entry_price DECIMAL(10, 2) NOT NULL,
    stop_loss DECIMAL(10, 2) NOT NULL,
    take_profit DECIMAL(10, 2) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    risk_level ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    result ENUM('success', 'failure') DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Test trader hesabı oluştur (şifre: trader123)
INSERT INTO users (username, email, user_password, role) 
VALUES ('Trader1', 'trader@example.com', '$2a$10$6jM7.sCqxwpQOjmAqc3MeuOz8yUmJMi8PWqOyBrKqPaJnVUUO5jHC', 'trader');

-- Test sinyalleri oluştur
INSERT INTO signals (user_id, symbol, direction, entry_price, stop_loss, take_profit, timeframe, risk_level, status) 
VALUES 
(1, 'BTCUSDT', 'long', 42000.00, 41000.00, 45000.00, '1h', 'medium', 'active'),
(1, 'ETHUSDT', 'short', 2200.00, 2300.00, 2000.00, '4h', 'high', 'active'),
(1, 'BNBUSDT', 'long', 300.00, 290.00, 320.00, '1d', 'low', 'completed');
