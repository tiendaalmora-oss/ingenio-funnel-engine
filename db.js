const Database = require('better-sqlite3');
const path = require('path');

// Se asume que el volumen en EasyPanel persista la data, por ahora un archivo local
const db = new Database(path.join(__dirname, 'leads.sqlite'));

// Inicializar tabla de leads
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    phone TEXT PRIMARY KEY,
    product TEXT,
    step TEXT,
    source TEXT,
    campaign TEXT,
    adset TEXT,
    ad TEXT,
    last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    followup_count INTEGER DEFAULT 0
  );
`);

function getLead(phone) {
  return db.prepare('SELECT * FROM leads WHERE phone = ?').get(phone);
}

function upsertLead(phone, product, step, metadata = {}) {
  const existing = getLead(phone);
  if (existing) {
    db.prepare(`
      UPDATE leads 
      SET product = ?, step = ?, last_interaction = CURRENT_TIMESTAMP, followup_count = 0 
      WHERE phone = ?
    `).run(product, step, phone);
  } else {
    db.prepare(`
      INSERT INTO leads (phone, product, step, source, campaign, adset, ad) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      phone, product, step, 
      metadata.source || null, 
      metadata.campaign || null, 
      metadata.adset || null, 
      metadata.ad || null
    );
  }
}

function updateFollowup(phone, count) {
  db.prepare(`
    UPDATE leads 
    SET followup_count = ?
    WHERE phone = ?
  `).run(count, phone);
}

function getLeadsForFollowup(hours, maxFollowups) {
  // Busca leads que no hayan interactuado en X horas y tengan menos de N seguimientos
  return db.prepare(`
    SELECT * FROM leads 
    WHERE last_interaction <= datetime('now', '-' || ? || ' hours') 
    AND followup_count < ?
  `).all(hours, maxFollowups);
}

module.exports = {
  getLead,
  upsertLead,
  updateFollowup,
  getLeadsForFollowup
};
