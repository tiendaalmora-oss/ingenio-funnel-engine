const eventBus = require('../../core/eventBus');
const db = require('../../core/database');

/**
 * Módulo CRM: Escucha eventos del sistema y mantiene la base de datos actualizada.
 */
function initCRMTracker() {
  
  // Cuando se recibe un mensaje nuevo
  eventBus.on('message_received', (data) => {
    const { phone, text, metadata } = data;
    
    // 1. Asegurar que el contacto exista (Upsert)
    db.upsertContact(phone, metadata);
    
    // 2. Registrar el evento en el historial (Audit Trail)
    db.logEvent(phone, 'message_received', { text });
  });

  // Cuando alguien cambia de paso en un embudo
  eventBus.on('step_changed', (data) => {
    const { phone, product, old_step, new_step } = data;
    
    // Guardar el evento en el historial general
    db.logEvent(phone, 'funnel_step_changed', { product, old_step, new_step });
  });

  // Cuando se envía un mensaje saliente
  eventBus.on('message_sent', (data) => {
    const { phone, text } = data;
    db.logEvent(phone, 'message_sent', { text });
  });
  
  console.log('[CRM Module] Tracker inicializado.');
}

module.exports = { initCRMTracker };
