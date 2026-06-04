const express = require('express');
const eventBus = require('../../core/eventBus');

const router = express.Router();

// Endpoint que WAHA llamará
router.post('/webhook', (req, res) => {
  // Respuesta rápida para no bloquear WAHA
  res.status(200).send('OK');

  try {
    const payload = req.body;
    
    // Filtramos solo los eventos de tipo mensaje que no sean enviados por nosotros mismos
    if (payload.event !== 'message') return;
    const msg = payload.payload;
    if (msg.fromMe) return;

    // Extraemos la información relevante
    const phone = msg.from;
    const text = msg.body;
    
    console.log(`[WAHA] Mensaje recibido de ${phone}: ${text}`);

    // Emitimos el evento al sistema central
    // Si viene desde un anuncio de Meta, podríamos extraer UTMs desde el body del mensaje inicial
    // (Ej. WAHA puede adjuntar info del anuncio si el cliente hace clic en un ad de fb)
    
    eventBus.emit('message_received', {
      phone: phone,
      text: text,
      metadata: {
        source: 'whatsapp',
        // campaign: '...', (extraer si está disponible)
      },
      raw_payload: payload
    });

  } catch (error) {
    console.error('[WAHA] Error procesando webhook:', error);
  }
});

module.exports = router;
