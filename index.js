console.log("=== BUILD DIAGNOSTICO V2 ===");
const express = require('express');
const { initCRMTracker } = require('./modules/crm/tracker');
const { initFunnelEngine } = require('./modules/funnels/engine');
const wahaWebhook = require('./modules/waha/webhook');
require('./cron'); // Inicializa los procesos cron

const app = express();
app.use(express.json());

// 1. Inicializar Módulos que escuchan Eventos
initCRMTracker();
initFunnelEngine();

// 2. Rutas Webhook
app.get('/', (req, res) => res.send('OK'));
app.use('/waha', wahaWebhook);

// ===== DIAGNÓSTICO: Ver qué inyecta EasyPanel =====
console.log('[DIAGNÓSTICO] process.env.PORT RAW =', JSON.stringify(process.env.PORT));
console.log('[DIAGNÓSTICO] Todas las vars de entorno con PORT:', 
  Object.entries(process.env).filter(([k]) => k.includes('PORT')));
// ===================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 IngenioOS Commercial OS (Event-Driven)
Escuchando en el puerto ${PORT} (0.0.0.0)
Endpoints disponibles:
- POST /waha/webhook
  `);
});
