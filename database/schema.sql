-- Cloudflare D1 Database Schema para MyBeats Catalog

-- Tabla de usuarios
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de beats (sincronizada con beats.js)
CREATE TABLE beats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  producer TEXT NOT NULL,
  bpm INTEGER,
  key TEXT,
  genre TEXT,
  tags TEXT, -- JSON array como string
  cover_image_url TEXT,
  mp3_url TEXT NOT NULL,
  wav_url TEXT, -- Para trackout y exclusivos
  stems_url TEXT, -- Para beats con stems
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de licencias (tipos de licencia disponibles)
CREATE TABLE license_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- mp3, trackout, exclusive
  price DECIMAL(10,2) NOT NULL,
  features TEXT NOT NULL, -- JSON array como string
  includes_wav BOOLEAN DEFAULT 0,
  includes_stems BOOLEAN DEFAULT 0,
  is_exclusive BOOLEAN DEFAULT 0,
  max_streams INTEGER,
  max_videos INTEGER
);

-- Tabla de compras/transacciones
CREATE TABLE purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  beat_id INTEGER NOT NULL,
  license_type_id INTEGER NOT NULL,
  transaction_id TEXT UNIQUE NOT NULL, -- ID de Stripe/PayPal
  amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- stripe, paypal
  license_number TEXT UNIQUE NOT NULL, -- Número único de licencia
  license_pdf_url TEXT, -- URL del PDF en R2
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (beat_id) REFERENCES beats(id),
  FOREIGN KEY (license_type_id) REFERENCES license_types(id)
);

-- Tabla de descargas (tracking)
CREATE TABLE downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id INTEGER NOT NULL,
  file_type TEXT NOT NULL, -- mp3, wav, pdf, stems
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id)
);

-- Tabla de beats vendidos con exclusividad
CREATE TABLE exclusive_beats (
  beat_id INTEGER PRIMARY KEY,
  sold_to_user_id INTEGER NOT NULL,
  sold_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (beat_id) REFERENCES beats(id),
  FOREIGN KEY (sold_to_user_id) REFERENCES users(id)
);

-- Índices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_beat ON purchases(beat_id);
CREATE INDEX idx_purchases_status ON purchases(payment_status);
CREATE INDEX idx_downloads_purchase ON downloads(purchase_id);

-- Insertar tipos de licencia iniciales
INSERT INTO license_types (name, slug, price, features, includes_wav, includes_stems, is_exclusive, max_streams, max_videos) VALUES
('Licencia MP3', 'mp3', 99.00, '["Formato MP3","Derechos No Exclusivos","2,000 Reproducciones","1 Video Musical"]', 0, 0, 0, 2000, 1),
('Trackout', 'trackout', 120.00, '["Formatos WAV + MP3","Derechos No Exclusivos","Reproducciones Ilimitadas","Videos Musicales Ilimitados","Soporte Prioritario"]', 1, 0, 0, NULL, NULL),
('Derechos Exclusivos', 'exclusive', 220.00, '["Propiedad Exclusiva Completa","Formatos WAV + MP3","Reproducciones Ilimitadas","Videos Ilimitados","Soporte VIP Dedicado","Beat retirado del catálogo"]', 1, 0, 1, NULL, NULL);
