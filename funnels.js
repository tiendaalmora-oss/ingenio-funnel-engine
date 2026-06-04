// Configuración de los embudos para distintos productos
const funnels = {
  avios: {
    // Palabras clave que activan el inicio del embudo desde cero
    triggers: ['estoy interesado en avios', 'info de avios'],
    
    // Pasos del embudo
    steps: {
      captado: {
        message: "¡Hola! 👋 Gracias por tu interés en AviOS, el sistema diseñado para optimizar ventas. \n\nPara brindarte la información correcta, ¿qué tipo de negocio tienes?\n\n*1.* Carnicería 🥩\n*2.* Avícola 🍗",
        transitions: {
          "1": "oferta_carniceria",
          "2": "oferta_avicola"
        },
        fallback: "Por favor, responde *1* para Carnicería o *2* para Avícola.",
        followup: {
          hours: 1,
          message: "¡Hola! ¿Pudiste revisar el mensaje anterior? Dime si tienes Carnicería (1) o Avícola (2) para enviarte la info exacta."
        }
      },
      oferta_carniceria: {
        message: "¡Excelente! 🥩\nPara carnicerías, AviOS tiene balanza integrada y cálculo de mermas.\n\nEl precio de promoción (Pago Único, sin mensualidades) es de *$39.990 ARS*.\n\n¿Te gustaría que te envíe los métodos de pago? (Responde SÍ o NO)",
        transitions: {
          "si": "cierre",
          "no": "rechazo"
        },
        fallback: "Por favor, responde *SÍ* para enviarte los métodos de pago o *NO* si tienes otra consulta.",
        followup: {
          hours: 2,
          message: "¡Hola! ¿Qué te pareció la promoción de $39.990? Si quieres avanzar, solo responde SÍ y te envío los datos de pago."
        }
      },
      oferta_avicola: {
        message: "¡Genial! 🍗\nPara avícolas, AviOS facilita el despiece y control de stock rápido.\n\nEl precio de promoción (Pago Único, sin mensualidades) es de *$39.990 ARS*.\n\n¿Te gustaría que te envíe los métodos de pago? (Responde SÍ o NO)",
        transitions: {
          "si": "cierre",
          "no": "rechazo"
        },
        fallback: "Por favor, responde *SÍ* para enviarte los métodos de pago o *NO* si tienes otra consulta.",
        followup: {
          hours: 2,
          message: "¡Hola! ¿Qué te pareció la promoción de $39.990? Si quieres avanzar, solo responde SÍ y te envío los datos de pago."
        }
      },
      cierre: {
        message: "¡Perfecto! 🎉\nPuedes realizar el pago mediante MercadoPago o Transferencia Bancaria al siguiente CBU/Alias:\n\n*Alias:* ingenio.digital.mp\n\nUna vez realizado el pago, envíame el comprobante por aquí mismo y te entregaré el link de instalación de inmediato.",
        transitions: {}, // Final del embudo automatizado, lo toma un humano
        followup: {
          hours: 24,
          message: "¡Hola! Pasaba a preguntarte si tuviste algún inconveniente con el pago. ¡Cualquier duda estoy aquí para ayudarte!"
        }
      },
      rechazo: {
        message: "Entendido. Si tienes alguna duda adicional o necesitas más información, no dudes en escribirme. ¡Que tengas un gran día! 😊",
        transitions: {}
      }
    }
  }
};

/**
 * Busca un producto basado en un texto (trigger)
 */
function matchTrigger(text) {
  if (!text) return null;
  const lowerText = text.toLowerCase().trim();
  for (const [product, config] of Object.entries(funnels)) {
    if (config.triggers.some(trigger => lowerText.includes(trigger))) {
      return product;
    }
  }
  return null;
}

module.exports = {
  funnels,
  matchTrigger
};
