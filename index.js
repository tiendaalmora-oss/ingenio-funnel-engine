console.log("=== BUILD V4 - DIAGNOSTICO SIGTERM ===");

// ===== CAPTURA DE SEÑALES =====
process.on('SIGTERM', () => {
  console.error('[PROCESO] Recibió SIGTERM - Stack:', new Error().stack);
  process.exit(0);
});
process.on('SIGINT', () => {
  console.error('[PROCESO] Recibió SIGINT');
  process.exit(0);
});
process.on('uncaughtException', (err) => {
  console.error('[PROCESO] EXCEPCIÓN NO CAPTURADA:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[PROCESO] PROMISE RECHAZADA:', reason);
});
// ================================
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

// 2. Rutas
app.get('/', (req, res) => res.send('OK'));
app.get('/health', (req, res) => {
  console.log('[Health] Healthcheck OK');
  res.status(200).json({ status: 'ok', port: process.env.PORT });
});
app.use('/waha', wahaWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🚀 IngenioOS Commercial OS (Event-Driven)
Escuchando en el puerto ${PORT} (0.0.0.0)
Endpoints disponibles:
- POST /waha/webhook
  `);
});
