const cron = require('node-cron');
const db = require('./core/database');
const { funnels } = require('./modules/funnels/config');
const waha = require('./modules/waha/sender');

// Revisa cada 15 minutos (0, 15, 30, 45)
cron.schedule('*/15 * * * *', async () => {
  console.log('[Cron] Verificando seguimientos pendientes...');
  
  try {
    // Buscamos leads inactivos hace al menos 1 hora y que no tengan seguimientos (0)
    const inactiveLeads = db.getInactiveFunnels(1, 1);

    for (const lead of inactiveLeads) {
      const { phone, product, current_step, followup_count } = lead;
      const funnelConfig = funnels[product];
      
      if (!funnelConfig) continue;
      const stepConfig = funnelConfig.steps[current_step];
      
      if (!stepConfig || !stepConfig.followup) continue;

      // Convertimos last_interaction a horas de inactividad reales
      const hoursInactive = (new Date() - new Date(lead.last_interaction)) / (1000 * 60 * 60);
      
      // Si la inactividad real supera lo que pide la regla del paso
      if (hoursInactive >= stepConfig.followup.hours && followup_count === 0) {
        console.log(`[Cron] Enviando seguimiento a ${phone} en ${current_step}`);
        await waha.sendText(phone, stepConfig.followup.message);
        
        // Marcamos el seguimiento
        db.updateFollowupCount(phone, product, 1);
        
        // El envío emite su propio evento desde el sender, 
        // pero también podríamos emitir "followup_sent" si lo necesitamos a futuro.
      }
    }
  } catch (error) {
    console.error('[Cron] Error en tarea de seguimiento:', error);
  }
});
