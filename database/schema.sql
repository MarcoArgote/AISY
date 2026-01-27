-- Cloudflare D1 Database Schema para MyBeats Catalog

-- Tabla de usuarios con roles
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID generado en el backend
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'producer', 'admin'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'pending'
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Perfiles de productores
CREATE TABLE IF NOT EXISTS producer_profiles (
  user_id TEXT PRIMARY KEY,
  artist_name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT, -- URL en R2
  banner TEXT, -- URL en R2
  social_links TEXT, -- JSON: {instagram, twitter, youtube}
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Solicitudes para convertirse en productor
CREATE TABLE IF NOT EXISTS producer_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  bio TEXT,
  portfolio_links TEXT, -- JSON array
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  requested_at TEXT NOT NULL,
  reviewed_at TEXT,
  reviewed_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_producer_requests_status ON producer_requests(status);
CREATE INDEX IF NOT EXISTS idx_producer_requests_user ON producer_requests(user_id);

-- Tabla de beats
CREATE TABLE IF NOT EXISTS beats (
  id TEXT PRIMARY KEY,
  producer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  bpm INTEGER,
  key TEXT,
  genre TEXT,
  tags TEXT, -- JSON array
  cover TEXT NOT NULL, -- URL en R2
  audio_tagged TEXT NOT NULL, -- URL en R2 (con watermark)
  audio_untagged TEXT NOT NULL, -- URL en R2 (sin watermark)
  stems_url TEXT, -- URL en R2
  status TEXT DEFAULT 'active', -- 'active', 'hidden', 'deleted'
  plays INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (producer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_beats_producer ON beats(producer_id);
CREATE INDEX IF NOT EXISTS idx_beats_status ON beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats(genre);

-- Tabla de licencias (tipos de licencia disponibles)
CREATE TABLE IF NOT EXISTS license_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- mp3, trackout, exclusive
  price REAL NOT NULL,
  features TEXT NOT NULL, -- JSON array como string
  includes_wav INTEGER DEFAULT 0,
  includes_stems INTEGER DEFAULT 0,
  is_exclusive INTEGER DEFAULT 0,
  max_streams INTEGER,
  max_videos INTEGER
);

-- Tabla de órdenes (para pagos manuales QR)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  beat_id TEXT NOT NULL,
  beat_title TEXT NOT NULL,
  license_type TEXT NOT NULL,
  amount REAL NOT NULL,
  amount_bs REAL NOT NULL,
  payment_info TEXT, -- JSON con info bancaria
  screenshot TEXT, -- URL de captura en R2
  status TEXT DEFAULT 'pending', -- pending, pending_verification, approved, rejected, expired
  user_email TEXT,
  rejection_reason TEXT,
  transaction_id TEXT,
  created_at TEXT NOT NULL,
  approved_at TEXT,
  paid_at TEXT,
  FOREIGN KEY (beat_id) REFERENCES beats(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(user_email);

-- Tabla de compras/transacciones
CREATE TABLE IF NOT EXISTS purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  beat_id TEXT NOT NULL,
  license_type TEXT NOT NULL,
  transaction_id TEXT UNIQUE, -- ID de Stripe/PayPal/QR
  amount REAL NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- stripe, paypal, qr-manual
  license_number TEXT UNIQUE, -- Número único de licencia
  license_pdf_url TEXT, -- URL del PDF en R2
  order_id TEXT, -- Referencia a orders si es pago QR
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (beat_id) REFERENCES beats(id)
);

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_beat ON purchases(beat_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(payment_status);

-- Tabla de descargas (tracking)
CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL,
  file_type TEXT NOT NULL, -- mp3, wav, pdf, stems
  downloaded_at TEXT NOT NULL,
  ip_address TEXT,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id)
);

CREATE INDEX IF NOT EXISTS idx_downloads_purchase ON downloads(purchase_id);

-- Tabla de waitlist (lista de espera)
CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  notified INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Sessions para autenticación (opcional, puedes usar JWT)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Insertar tipos de licencia iniciales
INSERT INTO license_types (name, slug, price, features, includes_wav, includes_stems, is_exclusive, max_streams, max_videos) VALUES
('Licencia MP3', 'mp3', 99.00, '["Formato MP3","Derechos No Exclusivos","2,000 Reproducciones","1 Video Musical"]', 0, 0, 0, 2000, 1),
('Trackout', 'trackout', 120.00, '["Formatos WAV + MP3","Derechos No Exclusivos","Reproducciones Ilimitadas","Videos Musicales Ilimitados","Soporte Prioritario"]', 1, 0, 0, NULL, NULL),
('Derechos Exclusivos', 'exclusive', 220.00, '["Propiedad Exclusiva Completa","Formatos WAV + MP3","Reproducciones Ilimitadas","Videos Ilimitados","Soporte VIP Dedicado","Beat retirado del catálogo"]', 1, 0, 1, NULL, NULL);
