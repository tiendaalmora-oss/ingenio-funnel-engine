// Configuración de los embudos para distintos productos
const funnels = {
  avios: {
    triggers: ['quiero la demo gratis de avios', 'demo gratis'],
    steps: {
      captado: {
        message: "👋 ¡Hola! Qué bueno tenerte por acá.\n\nAntes que nada quiero felicitarte porque la mayoría de los negocios sigue manejando ventas, stock y costos de forma manual, y eso termina generando pérdidas invisibles todos los meses.\n\nEl simple hecho de que estés buscando herramientas para profesionalizar tu negocio ya te pone varios pasos adelante. 🚀\n\nAntes de enviarte la demo gratuita quiero asegurarme de que AviOS sea realmente para vos.\n\nAviOS es un sistema:\n✅ Pago único.\n✅ Sin mensualidades.\n✅ Instalado localmente en tu PC.\n✅ Compatible con balanzas electrónicas.\n✅ Diseñado especialmente para carnicerías, avícolas y comercios similares.\n\nY algo que suele sorprender a nuestros clientes:\n💰 Todo esto por menos de $50.000 en pago único.\n\nPara ayudarte mejor respondeme:\n1️⃣ ¿Qué tipo de negocio tenés?\n2️⃣ ¿Lo vas a usar en una PC o en una caja con computadora?",
        transitions: {
          "*": "presentacion"
        },
        fallback: null,
        followup: null
      },
      presentacion: {
        message: "Perfecto 👍\n\nPor lo que me comentás, creo que AviOS puede encajar muy bien con tu negocio.\n\nAntes de enviarte la demo quiero mostrarte cómo funciona realmente.\n\n👉 https://ingeniodigital.shop/avios-demo\n\nEn esta página vas a encontrar:\n✅ Videos reales.\n✅ Capturas del sistema.\n✅ Casos de uso.\n✅ Testimonios.\n✅ Compatibilidad con balanzas.\n✅ Preguntas frecuentes.\n\nTomate unos minutos para verlo.\n\nCuando termines escribime *OK* y te envío la demo.",
        transitions: {
          "ok": "entrega_demo",
          "listo": "entrega_demo",
          "ya": "entrega_demo",
          "si": "entrega_demo",
          "dale": "entrega_demo"
        },
        fallback: "Escríbeme *OK* cuando termines de ver la información para enviarte el acceso a la Demo.",
        followup: null
      },
      entrega_demo: {
        message: "Excelente 🙌\n\nAcá te dejo el acceso directo a la demo funcional para que lo pruebes en tu PC:\n\n👉 [LINK DE DESCARGA O DEMO]\n\nTe envío también las instrucciones de instalación y una guía rápida de uso.\n\nProbalo tranquilo y cualquier duda que tengas en el camino, escribime por acá.",
        transitions: {},
        fallback: null,
        followup: [
          {
            hours: 2,
            message: "🎁 *BENEFICIO DE ACCIÓN RÁPIDA*\n\nMientras probás AviOS quiero dejarte algo importante.\n\nLa mayoría de nuestros clientes primero prueba el sistema y después decide si realmente encaja con su negocio. Por eso durante las próximas 48 horas voy a dejarte reservado un beneficio especial.\n\nSi después de probar AviOS sentís que era exactamente lo que estabas buscando, vas a poder acceder por:\n\n💰 *$39.900* pago único (En lugar de $47.900).\n\nAdemás te llevás:\n🎁 Instalación remota bonificada.\n🎁 Capacitación inicial.\n🎁 Configuración personalizada.\n🎁 Soporte de acompañamiento.\n\nY además:\n🛡️ *Garantía de satisfacción de 15 días.*\n\nSin mensualidades. Sin contratos. Sin costos ocultos.\n\nProbalo tranquilo. Y si sentís que realmente te ayuda en el día a día, simplemente respondeme por acá."
          },
          {
            hours: 24,
            message: "👋 Hola. Quería consultarte si ya pudiste probar la demo de AviOS.\n\nMuchos clientes descubren en pocos minutos cuánto tiempo pueden ahorrar cuando dejan de hacer cuentas manualmente o controlar stock de memoria.\n\nSi te surgió alguna duda con la instalación o el uso, respondeme por acá y te ayudo."
          },
          {
            hours: 48,
            message: "⏳ *Quería avisarte algo antes de cerrar el beneficio especial.*\n\nSi después de probar AviOS sentís que te ayuda a trabajar más rápido, controlar mejor el stock y evitar errores en el mostrador, todavía estás a tiempo de acceder por el precio promocional de *$39.900*.\n\nIncluyendo:\n✅ Instalación\n✅ Capacitación\n✅ Configuración\n✅ Soporte\n✅ Garantía de 15 días\n\nDespués de hoy volverá a su valor habitual de $47.900.\n\nSi querés aprovecharlo, respondeme por acá y te explico los siguientes pasos."
          }
        ]
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
