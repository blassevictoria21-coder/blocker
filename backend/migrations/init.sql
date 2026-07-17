-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  gmail_connected BOOLEAN DEFAULT FALSE,
  gmail_access_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_from VARCHAR(255),
  email_to VARCHAR(255),
  subject TEXT NOT NULL,
  body TEXT,
  classification VARCHAR(50) CHECK (classification IN ('spam', 'safe')),
  spam_score DECIMAL(3, 2) DEFAULT 0,
  is_read BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create spam reports table
CREATE TABLE IF NOT EXISTS spam_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_id INTEGER REFERENCES emails(id) ON DELETE CASCADE,
  reason TEXT,
  report_type VARCHAR(50) CHECK (report_type IN ('false_positive', 'false_negative', 'phishing', 'malware')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emails_classification ON emails(classification);
CREATE INDEX idx_emails_created_at ON emails(created_at);
CREATE INDEX idx_spam_reports_user_id ON spam_reports(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Alter table to add trigger for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_emails_timestamp BEFORE UPDATE ON emails
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
