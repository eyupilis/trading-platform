-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS signals;
SET FOREIGN_KEY_CHECKS = 1;

-- Create signals table
CREATE TABLE signals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trader_id INT NOT NULL,
    market_id INT NOT NULL,
    entry_price DECIMAL(20, 8) NOT NULL,
    take_profit DECIMAL(20, 8) NOT NULL,
    stop_loss DECIMAL(20, 8) NOT NULL,
    direction ENUM('BUY', 'SELL') NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    analysis TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes
CREATE INDEX idx_signals_trader ON signals(trader_id);
CREATE INDEX idx_signals_market ON signals(market_id);
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signals_direction ON signals(direction);
CREATE INDEX idx_signals_created ON signals(created_at);
