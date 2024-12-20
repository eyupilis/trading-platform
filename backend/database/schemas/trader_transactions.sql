-- Drop existing tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS trader_statistics;
DROP TABLE IF EXISTS notification_history;
DROP TABLE IF EXISTS notification_preferences;
DROP TABLE IF EXISTS trader_position_history;
DROP TABLE IF EXISTS trader_positions;
DROP TABLE IF EXISTS trader_transactions;
SET FOREIGN_KEY_CHECKS = 1;

-- Create trader positions table
CREATE TABLE trader_positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    market_id INT NOT NULL,
    type ENUM('long', 'short') NOT NULL,
    status ENUM('open', 'closed', 'partially_closed') NOT NULL,
    entry_price DECIMAL(24,8) NOT NULL,
    current_price DECIMAL(24,8),
    amount DECIMAL(24,8) NOT NULL,
    take_profit DECIMAL(24,8),
    stop_loss DECIMAL(24,8),
    leverage INT DEFAULT 1,
    unrealized_pnl DECIMAL(24,8),
    realized_pnl DECIMAL(24,8) DEFAULT 0,
    success_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create position history table
CREATE TABLE trader_position_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    position_id INT NOT NULL,
    user_id INT NOT NULL,
    market_id INT NOT NULL,
    type ENUM('entry', 'take_profit', 'stop_loss', 'manual_close') NOT NULL,
    price DECIMAL(24,8) NOT NULL,
    amount DECIMAL(24,8) NOT NULL,
    pnl DECIMAL(24,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (position_id) REFERENCES trader_positions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create notification preferences table
CREATE TABLE notification_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    price_alerts BOOLEAN DEFAULT TRUE,
    take_profit_alerts BOOLEAN DEFAULT TRUE,
    stop_loss_alerts BOOLEAN DEFAULT TRUE,
    position_updates BOOLEAN DEFAULT TRUE,
    market_news BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create notification history table
CREATE TABLE notification_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    position_id INT,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES trader_positions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create trader statistics table
CREATE TABLE trader_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_trades INT DEFAULT 0,
    winning_trades INT DEFAULT 0,
    losing_trades INT DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    total_pnl DECIMAL(24,8) DEFAULT 0,
    avg_profit_per_trade DECIMAL(24,8) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create trader transactions table
CREATE TABLE trader_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trader_id INT NOT NULL,
    market_id INT NOT NULL,
    type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRADE_PROFIT', 'TRADE_LOSS', 'COMMISSION') NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trader_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes
CREATE INDEX idx_positions_user ON trader_positions(user_id);
CREATE INDEX idx_positions_market ON trader_positions(market_id);
CREATE INDEX idx_positions_status ON trader_positions(status);
CREATE INDEX idx_history_position ON trader_position_history(position_id);
CREATE INDEX idx_history_user ON trader_position_history(user_id);
CREATE INDEX idx_history_market ON trader_position_history(market_id);
CREATE INDEX idx_notifications_user ON notification_preferences(user_id);
CREATE INDEX idx_notification_history_user ON notification_history(user_id);
CREATE INDEX idx_notification_history_position ON notification_history(position_id);
CREATE INDEX idx_trader_stats_user ON trader_statistics(user_id);
CREATE INDEX idx_transactions_trader ON trader_transactions(trader_id);
CREATE INDEX idx_transactions_market ON trader_transactions(market_id);
CREATE INDEX idx_transactions_type ON trader_transactions(type);
CREATE INDEX idx_transactions_status ON trader_transactions(status);
CREATE INDEX idx_transactions_created ON trader_transactions(created_at);
