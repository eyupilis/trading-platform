-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS user_balances;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS trades;
SET FOREIGN_KEY_CHECKS = 1;

-- Create orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    market_id INT NOT NULL,
    type ENUM('buy', 'sell') NOT NULL,
    order_type ENUM('market', 'limit', 'stop') NOT NULL,
    status ENUM('pending', 'partial', 'completed', 'cancelled') NOT NULL,
    price DECIMAL(24,8),
    amount DECIMAL(24,8) NOT NULL,
    filled_amount DECIMAL(24,8) DEFAULT 0,
    remaining_amount DECIMAL(24,8),
    total DECIMAL(24,8),
    trigger_price DECIMAL(24,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create trades table
CREATE TABLE trades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    signal_id INT NOT NULL,
    trader_id INT NOT NULL,
    entry_price DECIMAL(20, 8) NOT NULL,
    exit_price DECIMAL(20, 8),
    quantity DECIMAL(20, 8) NOT NULL,
    pnl DECIMAL(20, 8),
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    close_reason ENUM('TAKE_PROFIT', 'STOP_LOSS', 'MANUAL') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (signal_id) REFERENCES signals(id) ON DELETE CASCADE,
    FOREIGN KEY (trader_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create user balances table
CREATE TABLE user_balances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    available DECIMAL(24,8) DEFAULT 0,
    locked DECIMAL(24,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create alerts table
CREATE TABLE alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    market_id INT NOT NULL,
    alert_type ENUM('above', 'below') NOT NULL,
    price DECIMAL(24,8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_market ON orders(market_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_trades_signal ON trades(signal_id);
CREATE INDEX idx_trades_trader ON trades(trader_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_created ON trades(created_at);
CREATE INDEX idx_trades_closed ON trades(closed_at);
CREATE INDEX idx_balances_user ON user_balances(user_id);
CREATE INDEX idx_balances_currency ON user_balances(currency);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_market ON alerts(market_id);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_price ON alerts(price);
