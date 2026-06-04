// Configuración de los embudos para distintos productos
const funnels = {
  avios: {
    triggers: ['interesado en avios', 'info de avios'], // Frases de Ads
    steps: {
      captado: {
        message: "¡Hola! 👋 Gracias por tu interés en AviOS, el sistema diseñado para optimizar ventas y no perder dinero en el mostrador.\n\nPara pasarte la información exacta, ¿tienes una Carnicería (Responde 1) o una Avícola (Responde 2)?",
        transitions: {
          "1": "landing_carniceria",
          "2": "landing_avicola"
        },
        fallback: "Por favor, responde *1* para Carnicería o *2* para Avícola.",
        followup: null // El seguimiento inicial no es necesario si acaban de entrar
      },
      landing_carniceria: {
        message: "¡Excelente! 🥩\nPara carnicerías, AviOS tiene balanza integrada y cálculo de mermas real. Te ahorra muchísimo tiempo.\n\nMira este video corto donde mostramos cómo funciona en un local real y testimonios de otros dueños:\n👉 https://ingeniodigital.shop/avios-demo \n\nCuando termines de verlo, escríbeme *OK* y te paso el precio promocional.",
        transitions: {
          "ok": "oferta",
          "listo": "oferta",
          "ya": "oferta"
        },
        fallback: "Escríbeme *OK* cuando termines de ver la información del link para pasarte la promoción.",
        followup: {
          hours: 1, // Si en 1 hora no responde "OK"
          message: "¡Hola! ¿Pudiste revisar el enlace con la demostración? Si tienes alguna duda, escríbeme. Si quieres conocer el precio de promoción, responde *OK*."
        }
      },
      landing_avicola: {
        message: "¡Genial! 🍗\nPara avícolas, AviOS facilita el despiece y control de stock ultra rápido.\n\nMira cómo funciona y casos de éxito aquí:\n👉 https://ingeniodigital.shop/avios-demo \n\nCuando termines de verlo, escríbeme *OK* y te paso el precio.",
        transitions: {
          "ok": "oferta",
          "listo": "oferta",
          "ya": "oferta"
        },
        fallback: "Escríbeme *OK* cuando termines de ver la información del link para pasarte la promoción.",
        followup: {
          hours: 1,
          message: "¡Hola! ¿Pudiste revisar el enlace? Si quieres conocer el precio de promoción, responde *OK*."
        }
      },
      oferta: {
        message: "¡Perfecto! El precio de promoción actual (Pago Único, sin mensualidades) es de *$39.990 ARS*.\nIncluye instalación y 15 días de garantía.\n\n¿Te gustaría que te envíe los métodos de pago para avanzar hoy mismo? (Responde SÍ o NO)",
        transitions: {
          "si": "cierre",
          "no": "ofrecer_demo"
        },
        fallback: "Responde *SÍ* para los métodos de pago, o *NO* si tienes dudas.",
        followup: {
          hours: 2,
          message: "¡Hola! ¿Qué te pareció la promoción de $39.990? Si quieres avanzar, responde SÍ. Si tienes dudas, cuéntame."
        }
      },
      cierre: {
        message: "¡Excelente decisión! 🎉\nTransfiere a este CBU o Alias:\n*Alias:* ingenio.digital.mp\n\nEnvíame el comprobante por aquí y te mando el acceso inmediato.",
        transitions: {}, 
        followup: {
          hours: 24,
          message: "¡Hola! Pasaba a preguntarte si tuviste algún inconveniente con el pago. ¡Cualquier duda estoy para ayudarte!"
        }
      },
      ofrecer_demo: {
        message: "Entiendo perfectamente. Es importante estar seguro antes de invertir en tu negocio.\n\n¿Te gustaría que agendemos una *Demostración en vivo por videollamada* de 15 minutos? Así te muestro el sistema en mi pantalla y resolvemos todas tus dudas.\n(Responde SÍ para agendar o NO GRACIAS).",
        transitions: {
          "si": "agendar_demo",
          "no gracias": "rechazo"
        },
        followup: null
      },
      agendar_demo: {
        message: "¡Genial! Puedes agendar el día y la hora que mejor te quede en este enlace:\n👉 https://calendly.com/ingeniodigital/demo-avios",
        transitions: {}
      },
      rechazo: {
        message: "Comprendido. Seguimos a tu disposición para cuando necesites modernizar tu negocio. ¡Que tengas excelentes ventas! 😊",
        transitions: {}
      }
    }
  }
};

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

module.exports = { funnels, matchTrigger };
