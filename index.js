console.log("======================================");
console.log("=== BUILD V7 - THE FINAL COUNTDOWN ===");
console.log("======================================");

// ===== CAPTURA DE SEÑALES =====
process.on('SIGTERM', () => {
  console.error('[PROCESO] Recibió SIGTERM - Stack:', new Error().stack);
  // No hacemos process.exit(0) inmediato para permitir que las promesas pendientes terminen
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

const appPort = process.env.PORT || 80;

app.listen(appPort, '0.0.0.0', () => {
  console.log(`🚀 IngenioOS Escuchando en el puerto principal ${appPort} (0.0.0.0)`);
});

// Escuchar también en el 3000 por si EasyPanel hace healthchecks ciegos ahí
if (appPort != 3000) {
  try {
    const app3000 = express();
    app3000.get('/health', (req, res) => res.status(200).json({status: 'ok'}));
    app3000.get('/', (req, res) => res.status(200).send('OK'));
    app3000.listen(3000, '0.0.0.0', () => console.log('🛡️ Healthcheck secundario en puerto 3000'));
  } catch(e) {}
}
