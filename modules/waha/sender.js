const axios = require('axios');
const eventBus = require('../../core/eventBus');

const WAHA_URL = process.env.WAHA_URL || 'https://waha.ingeniodigital.shop';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '12345';
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';

async function sendText(chatId, text) {
  try {
    // Retraso dinámico para simular que un humano está escribiendo (entre 1.5s y 4s según el largo del texto)
    const delayMs = Math.min(Math.max(text.length * 20, 1500), 4000);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    const response = await axios.post(`${WAHA_URL}/api/sendText`, {
      session: WAHA_SESSION,
      chatId: chatId,
      text: text
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': WAHA_API_KEY,
        'Accept': 'application/json'
      }
    });
    
    // Emitir evento de mensaje enviado para el CRM
    eventBus.emit('message_sent', { phone: chatId, text: text });
    
    return response.data;
  } catch (error) {
    console.error(`[WAHA Sender] Error enviando a ${chatId}:`, error.message);
  }
}

module.exports = { sendText };
