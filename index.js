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

const PORT1 = 80;
const PORT2 = 3000;
app.listen(PORT1, () => { console.log(Escuchando en el puerto ); }).on('error', () => {});
app.listen(PORT2, () => {
  console.log(`
🚀 IngenioOS Commercial OS (Event-Driven)
Escuchando en el puerto ${PORT}
Endpoints disponibles:
- POST /waha/webhook
  `);
});





