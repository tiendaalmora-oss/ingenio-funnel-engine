const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'ingenio.sqlite'));

// Configuración de la base de datos CRM Orientada a Eventos
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    phone TEXT PRIMARY KEY,
    name TEXT,
    status TEXT DEFAULT 'lead',
    source TEXT,
    campaign TEXT,
    adset TEXT,
    ad TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS system_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT,
    event_type TEXT,
    payload TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS funnel_states (
    phone TEXT,
    product TEXT,
    current_step TEXT,
    last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    followup_count INTEGER DEFAULT 0,
    PRIMARY KEY (phone, product)
  );
`);

// ============================================
// Métodos Core de Base de Datos
// ============================================

function getContact(phone) {
  return db.prepare('SELECT * FROM contacts WHERE phone = ?').get(phone);
}

function upsertContact(phone, metadata = {}) {
  const existing = getContact(phone);
  if (existing) {
    db.prepare('UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE phone = ?').run(phone);
    return existing;
  } else {
    db.prepare(`
      INSERT INTO contacts (phone, name, source, campaign, adset, ad) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      phone, 
      metadata.name || null,
      metadata.source || null, 
      metadata.campaign || null, 
      metadata.adset || null, 
      metadata.ad || null
    );
    return getContact(phone);
  }
}

function logEvent(phone, event_type, payload = {}) {
  db.prepare(`
    INSERT INTO system_events (phone, event_type, payload)
    VALUES (?, ?, ?)
  `).run(phone, event_type, JSON.stringify(payload));
}

function getFunnelState(phone, product) {
  return db.prepare('SELECT * FROM funnel_states WHERE phone = ? AND product = ?').get(phone, product);
}

function upsertFunnelState(phone, product, step) {
  const existing = getFunnelState(phone, product);
  if (existing) {
    db.prepare(`
      UPDATE funnel_states 
      SET current_step = ?, last_interaction = CURRENT_TIMESTAMP, followup_count = 0 
      WHERE phone = ? AND product = ?
    `).run(step, phone, product);
  } else {
    db.prepare(`
      INSERT INTO funnel_states (phone, product, current_step) 
      VALUES (?, ?, ?)
    `).run(phone, product, step);
  }
}

function updateFollowupCount(phone, product, count) {
  db.prepare(`
    UPDATE funnel_states 
    SET followup_count = ?
    WHERE phone = ? AND product = ?
  `).run(count, phone, product);
}

function getInactiveFunnels(hours, maxFollowups) {
  return db.prepare(`
    SELECT * FROM funnel_states 
    WHERE last_interaction <= datetime('now', '-' || ? || ' hours') 
    AND followup_count < ?
  `).all(hours, maxFollowups);
}

module.exports = {
  db,
  getContact,
  upsertContact,
  logEvent,
  getFunnelState,
  upsertFunnelState,
  updateFollowupCount,
  getInactiveFunnels
};
