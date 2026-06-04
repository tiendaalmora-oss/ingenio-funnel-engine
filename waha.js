const axios = require('axios');

const WAHA_URL = process.env.WAHA_URL || 'https://waha.ingeniodigital.shop';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '12345';
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';

async function sendText(chatId, text) {
  try {
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
    console.log(`Mensaje enviado a ${chatId}`);
    return response.data;
  } catch (error) {
    console.error(`Error enviando mensaje a ${chatId}:`, error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
}

module.exports = {
  sendText
};
