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
      let nextFollowup = null;

      // Soporte para Drip Campaigns (Múltiples seguimientos en un array)
      if (Array.isArray(stepConfig.followup)) {
        if (followup_count < stepConfig.followup.length) {
          nextFollowup = stepConfig.followup[followup_count];
        }
      } else if (stepConfig.followup && followup_count === 0) {
        // Compatibilidad hacia atrás (un solo seguimiento)
        nextFollowup = stepConfig.followup;
      }

      if (nextFollowup && hoursInactive >= nextFollowup.hours) {
        console.log(`[Cron] Ejecutando seguimiento de ${nextFollowup.hours}hs para ${phone}`);
        try {
          await waha.sendText(phone, nextFollowup.message);
          db.updateFollowupCount(phone, product, followup_count + 1);
        } catch (error) {
          console.error(`[Cron] Error enviando a ${phone}:`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('[Cron] Error en tarea de seguimiento:', error);
  }
});
