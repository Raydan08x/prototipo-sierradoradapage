export const trainingData = [
    // INTENT: GREETING
    { text: "hola", label: "greeting" },
    { text: "buenos dias", label: "greeting" },
    { text: "buenas tardes", label: "greeting" },
    { text: "buenas noches", label: "greeting" },
    { text: "hey", label: "greeting" },
    { text: "que tal", label: "greeting" },
    { text: "como estas", label: "greeting" },
    { text: "ey", label: "greeting" },
    { text: "holi", label: "greeting" },
    { text: "saludos", label: "greeting" },

    // INTENT: GASTROBAR_INFO
    { text: "que es el gastrobar", label: "gastrobar.info" },
    { text: "tienen restaurante", label: "gastrobar.info" },
    { text: "venden comida", label: "gastrobar.info" },
    { text: "que comida hay", label: "gastrobar.info" },
    { text: "quiero comer", label: "gastrobar.info" },
    { text: "tengo hambre", label: "gastrobar.info" },
    { text: "hay comida", label: "gastrobar.info" },

    // INTENT: GASTROBAR_MENU (Direct Menu Link)
    { text: "ver el menu", label: "gastrobar.menu" },
    { text: "ver el menú del gastrobar", label: "gastrobar.menu" },
    { text: "carta digital", label: "gastrobar.menu" },
    { text: "qr del menu", label: "gastrobar.menu" },
    { text: "carta de comida", label: "gastrobar.menu" },
    { text: "hamburguesas", label: "gastrobar.menu" },
    { text: "platos fuertes", label: "gastrobar.menu" },
    { text: "picadas", label: "gastrobar.menu" },

    // INTENT: BOOKING (Reservation)
    { text: "quiero reservar", label: "booking.request" },
    { text: "agendar visita", label: "booking.request" },
    { text: "reservar mesa", label: "booking.request" },
    { text: "apartar cupo", label: "booking.request" },
    { text: "tienen reservas", label: "booking.request" },
    { text: "quiero ir", label: "booking.request" },
    { text: "visitar cerveceria", label: "booking.request" },
    { text: "puedo ir", label: "booking.request" },
    { text: "reserva", label: "booking.request" },

    // INTENT: LOCATION
    { text: "donde estan ubicados", label: "company.location" },
    { text: "ubicacion", label: "company.location" },
    { text: "direccion", label: "company.location" },
    { text: "como llego", label: "company.location" },
    { text: "mapa", label: "company.location" },
    { text: "en que ciudad estan", label: "company.location" },
    { text: "donde quedan", label: "company.location" },
    { text: "como los encuentro", label: "company.location" },
    { text: "direccion exacta", label: "company.location" },
    { text: "google maps", label: "company.location" },

    // INTENT: PRODUCTS (General)
    { text: "que cervezas tienen", label: "products.list" },
    { text: "catalogo de cervezas", label: "products.list" },
    { text: "tipos de pola", label: "products.list" },
    { text: "variedad de cerveza", label: "products.list" },
    { text: "cuales son las cervezas", label: "products.list" },
    { text: "que producen", label: "products.list" },
    { text: "que venden", label: "products.list" },

    // INTENT: PRICE (BEER ONLY)
    { text: "cuanto cuestan las cervezas", label: "products.price" },
    { text: "precio de la cerveza", label: "products.price" },
    { text: "valor de la pola", label: "products.price" },
    { text: "costo de la botella", label: "products.price" },
    { text: "precio del six pack", label: "products.price" },
    { text: "a como la cerveza", label: "products.price" },
    { text: "ver precios", label: "products.price" },
    { text: "precios cerveza", label: "products.price" },

    // INTENT: PRICE (GASTROBAR/FOOD)
    { text: "cuanto vale la comida", label: "gastrobar.price" },
    { text: "precio de la hamburguesa", label: "gastrobar.price" },
    { text: "precio de los platos", label: "gastrobar.price" },
    { text: "cuanto cuesta comer", label: "gastrobar.price" },
    { text: "precios del menu", label: "gastrobar.price" },
    { text: "valor de la picada", label: "gastrobar.price" },

    // INTENT: SOMMELIER (Recommendation)
    { text: "recomiendame una cerveza", label: "sommelier.start" },
    { text: "que me recomiendas", label: "sommelier.start" },
    { text: "cual es la mejor", label: "sommelier.start" },
    { text: "no se cual pedir", label: "sommelier.start" },
    { text: "ayudame a elegir", label: "sommelier.start" },
    { text: "cual me recomiendas", label: "sommelier.start" },
    { text: "recomiendame una", label: "sommelier.start" },

    // INTENT: CONTACT
    { text: "telefono", label: "contact" },
    { text: "whatsapp", label: "contact" },
    { text: "numero de contacto", label: "contact" },
    { text: "como los contacto", label: "contact" },
    { text: "redes sociales", label: "contact" },
    { text: "instagram", label: "contact" },

    // INTENT: HORARIO
    { text: "que horario tienen", label: "schedule" },
    { text: "a que hora abren", label: "schedule" },
    { text: "a que hora cierran", label: "schedule" },
    { text: "horarios de atencion", label: "schedule" },
    { text: "cuando estan abiertos", label: "schedule" },

    // INTENT: ABOUT
    { text: "quienes son", label: "about" },
    { text: "historia de la cerveceria", label: "about" },
    { text: "sobre ustedes", label: "about" },
    { text: "de que se trata", label: "about" },

    // INTENT: THANKS
    { text: "gracias", label: "thanks" },
    { text: "muchas gracias", label: "thanks" },
    { text: "te lo agradezco", label: "thanks" },
    { text: "genial", label: "thanks" },

    // INTENT: GOODBYE
    { text: "adios", label: "goodbye" },
    { text: "chao", label: "goodbye" },
    { text: "hasta luego", label: "goodbye" },
    { text: "nos vemos", label: "goodbye" },

    // INTENT: RESET / Go Back
    { text: "volver al inicio", label: "reset" },
    { text: "volver al menú", label: "reset" },
    { text: "empezar de nuevo", label: "reset" },
    { text: "reiniciar", label: "reset" },
];

export const responses = {
    "greeting": [
        "¡Hola! 🐻 Soy Bachu, el oso de anteojos de Sierra Dorada. Estoy aquí para ayudarte con reservas, menús, y recomendaciones cerveceras. ¿En qué te ayudo?",
        "¡Buenas! 🍻 Soy Bachu, tu guía peludo en Sierra Dorada. Pregúntame lo que quieras sobre nuestras cervezas o el gastrobar."
    ],
    "gastrobar.info": [
        "🐻 Nuestro Gastrobar en Zipaquirá es mi lugar favorito. Fusionamos cerveza artesanal con platos diseñados para maridar perfectamente. ¡Hamburguesas, picadas, y más!",
        "¡Sí tenemos comida! 🍔 Ofrecemos hamburguesas artesanales, picadas, y platos fuertes pensados para acompañar nuestras polas. ¿Te gustaría ver el menú?"
    ],
    "gastrobar.menu": [
        "¡Claro! 🐻 Nuestra carta es 100% digital. Te la paso: https://toteat.shop/r/co/Sierra-Dorada-Gastrobar/21360/checkin/menu",
        "Aquí tienes el menú con precios actualizados: https://toteat.shop/r/co/Sierra-Dorada-Gastrobar/21360/checkin/menu 🍔"
    ],
    "gastrobar.price": [
        "Los precios de la comida varían según el plato. 🐻 Te recomiendo ver la carta digital: https://toteat.shop/r/co/Sierra-Dorada-Gastrobar/21360/checkin/menu",
        "Para ver los precios actualizados de hamburguesas y picadas, revisa nuestro menú digital. 🍔"
    ],
    "booking.request": [
        "¡Me encanta esa idea! 🐻🍺 Para agendar tu visita, necesito saber: ¿Para qué fecha y cuántas personas serían?"
    ],
    "company.location": [
        "🐻 Estamos en el CC Paseo de Gracia, Local 112 (Calle 26#12-63), Zipaquirá, Cundinamarca. ¡Te espero!",
        "Nuestra cueva cervecera está en Zipaquirá. CC Paseo de Gracia Local 112. 🗺️"
    ],
    "products.list": [
        "🐻 Tenemos 4 cervezas increíbles: American Pale Ale (Cítrica), IPA (Amarga/Intensa), Stout (Café/Chocolate) y Sour con Corozo (Ácida/Refrescante).",
        "Manejamos 4 estilos: Rubia (APA), Roja (IPA), Negra (Stout) y la especial de Corozo (Sour). 🍺"
    ],
    "products.price": [
        "🐻 Nuestras cervezas artesanales están entre $12k y $18k COP dependiendo del estilo y tamaño. ¡Buen precio para calidad premium!",
        "El precio varía por estilo. Una pinta está alrededor de $15k. ¿Buscas alguna en especial? 🍺"
    ],
    "sommelier.start": [
        "🐻 ¡Me encanta recomendar! Responde esto: ¿Prefieres sabores **Amargos/Intensos** o **Suaves/Dulces**?"
    ],
    "contact": [
        "🐻 Puedes contactarnos por WhatsApp: +57 313 871 8154, o síguenos en Instagram @sierradoradacerveza"
    ],
    "schedule": [
        "🐻 Nuestro Gastrobar abre de Jueves a Domingo. Jueves y Viernes: 5pm-10pm, Sábados: 12pm-10pm, Domingos: 12pm-8pm"
    ],
    "about": [
        "🐻 Sierra Dorada es una cervecería artesanal colombiana nacida en Zipaquirá, inspirada en las leyendas Muiscas y el amor por la buena cerveza. ¡Somos pasión cervecera!"
    ],
    "thanks": [
        "¡Con gusto! 🐻 Para eso estamos. ¿Hay algo más en que pueda ayudarte?",
        "¡Es un placer ayudarte! 🍺 Cuando necesites algo más, aquí estaré."
    ],
    "goodbye": [
        "¡Hasta pronto! 🐻🍺 Espero verte por Sierra Dorada.",
        "¡Chao! 🐻 Que tengas un excelente día. ¡Nos vemos en el Gastrobar!"
    ],
    "reset": [
        "¡Claro! 🐻 ¿En qué te puedo ayudar? Puedo recomendarte cervezas, darte info del menú, ayudarte con reservas o darte la ubicación."
    ],
    "fallback": [
        "Hmm, 🐻 no entendí bien eso. ¿Podrías preguntarlo de otra forma? Intenta con 'menu', 'ubicación', 'reservar' o 'cervezas'.",
        "Mi cerebro de oso está procesando... 🤔 Prueba preguntándome por cervezas, reservas, o cómo llegar."
    ]
};

