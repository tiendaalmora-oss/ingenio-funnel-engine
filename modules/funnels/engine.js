const eventBus = require('../../core/eventBus');
const db = require('../../core/database');
const waha = require('../waha/sender');
const { funnels, matchTrigger } = require('./config');

function initFunnelEngine() {
  
  eventBus.on('message_received', async (data) => {
    const { phone, text } = data;
    
    // Buscar si el lead ya está en un embudo activo
    // Por simplicidad, tomamos el último estado activo (si tuviéramos múltiples, filtraríamos)
    const activeFunnels = db.db.prepare('SELECT * FROM funnel_states WHERE phone = ?').all(phone);
    let leadFunnel = activeFunnels.length > 0 ? activeFunnels[0] : null;

    if (!leadFunnel) {
      // Si NO está en ningún embudo, verificamos si activó un trigger
      const matchedProduct = matchTrigger(text);
      if (matchedProduct) {
        console.log(`[Funnels] Nuevo lead para ${matchedProduct}`);
        
        const initialStep = 'captado';
        db.upsertFunnelState(phone, matchedProduct, initialStep);
        
        const firstStepConfig = funnels[matchedProduct].steps[initialStep];
        await waha.sendText(phone, firstStepConfig.message);
        
        eventBus.emit('step_changed', { phone, product: matchedProduct, old_step: null, new_step: initialStep });
      }
      return;
    }

    // SI el lead YA está en un embudo
    const product = leadFunnel.product;
    const currentStepId = leadFunnel.current_step;
    const funnelConfig = funnels[product];
    
    if (!funnelConfig) return;
    
    const currentStepConfig = funnelConfig.steps[currentStepId];
    
    if (!currentStepConfig.transitions || Object.keys(currentStepConfig.transitions).length === 0) {
      // Fin del embudo
      return;
    }

    const normalizedText = text.trim().toLowerCase();
    const nextStepId = currentStepConfig.transitions[normalizedText];

    if (nextStepId && funnelConfig.steps[nextStepId]) {
      // Transición exitosa
      console.log(`[Funnels] ${phone} avanza de ${currentStepId} a ${nextStepId}`);
      db.upsertFunnelState(phone, product, nextStepId);
      
      const nextStepConfig = funnelConfig.steps[nextStepId];
      await waha.sendText(phone, nextStepConfig.message);
      
      eventBus.emit('step_changed', { phone, product, old_step: currentStepId, new_step: nextStepId });
    } else {
      // Fallback
      console.log(`[Funnels] ${phone} - Fallback en ${currentStepId}`);
      if (currentStepConfig.fallback) {
        await waha.sendText(phone, currentStepConfig.fallback);
      }
    }
  });

  console.log('[Funnel Engine] Motor de Embudos inicializado.');
}

module.exports = { initFunnelEngine };
