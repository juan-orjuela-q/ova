/* ============================================================
   Contenido declarativo de la OVA — Unidad 1.

   Formato JSONP, no .json: fetch() y XMLHttpRequest no pueden leer
   un archivo local bajo file:// (CORS bloquea el esquema "file" en
   Chromium, verificado con Playwright al construir T2). Un <script>
   clásico sí puede cargar cualquier archivo local, así que el
   contenido se envuelve en una asignación a una variable global en
   vez de pedirse por red. El contenido en sí sigue siendo JSON puro
   dentro de esta asignación — el motor (router.js) no sabe nada de
   este archivo más allá de leer `window.OVA_CONTENIDO`.

   Pantallas de prueba, numeración post-C0 (4 sep) — la de BRIEF-DI.md,
   ver CLAUDE.md regla dura 8 y PLAN-CONTENIDO.md §2.1/§2.2. Antes de C0
   estas catorce pantallas usaban la numeración anterior del código;
   C0 las renumeró junto con layouts.css/router.js/quiz.js, sin cambiar
   contenido. Dos ajustes no fueron solo renombrar: s04 usaba el layout
   de "término de glosario" (antes L11), que dejó de existir como layout
   propio (ya está resuelto como componente de T5, `.termino-glosario` +
   `.modal`, usable dentro de cualquier layout) — se movió a L04, el
   mismo layout de texto plano que s01/s08/s10. s09 usaba el layout de
   "proceso/línea de tiempo" (antes L09), que dejó de ser un layout
   propio (ahora es `datos.tipo:'proceso'` dentro de L04) — se movió ahí
   por el mismo motivo. La interacción de s07 pasó de I02 a I01 porque
   el brief define I01 como opción única e I02 como verdadero/falso, al
   revés de como T6 los había construido.

   Relleno tomado del guion de «Introducción a la inversión en
   acciones».

   T4 suma s05/s06 (L03, L02): las dos únicas pantallas con `media`,
   para ejercitar el reproductor real de extremo a extremo (no solo
   en la kitchen sink) — navegar hasta ahí en src/index.html reproduce
   video con subtítulos VTT y transcripción descargable de verdad. El
   video es el mismo relleno de stock que ya usaba L01 (public/videos/),
   no el material real de Jose.

   `media.vtt` lleva el TEXTO WebVTT completo, no una ruta de archivo:
   media.js arma un <track> con un Blob a partir de ese texto. Un
   <track src="archivo.vtt"> apuntando a un archivo real falla bajo
   file:// en Chromium ("file:" URLs son cada una su propio origen
   único, incluso entre archivos hermanos) — verificado con Playwright
   al construir T4. Mismo motivo por el que este archivo entero es
   .js y no .json + fetch.

   T6 suma s07 (L06): única pantalla con `interaccion`, para ejercitar
   quiz.js de extremo a extremo en src/index.html (intentos, bloque de
   retroalimentación, reporte a cmi.interactions) y no solo en la
   kitchen sink. Usa I01 (opción única); el catálogo completo vive
   documentado en el encabezado de quiz.js, con todos los tipos
   representados en la kitchen sink.

   T7 suma s08 (L04 + datos "variacion"), s09 (L04 + datos "proceso") y
   s10 (L04 + datos "barras"), para ejercitar charts.js de extremo a
   extremo en src/index.html. s08 y s09 retoman el mismo ejemplo de
   Petrocaribe de s06 (compra a $1.000, sube a $1.500 ocho meses
   después) para que la variación (+50 %) y el desglose en pasos sean
   consistentes con lo que el estudiante ya vio en video — no un dato
   nuevo sin conexión. El catálogo completo (cifra, tabla, variación,
   línea, barras, distribución, proceso), con la forma exacta de
   `pantalla.datos` por tipo, vive documentado en el encabezado de
   charts.js; los siete están representados en la kitchen sink.

   T8 suma s11 (L06 + interacción I10, calculadora paramétrica), para
   ejercitar la primera interacción insignia de extremo a extremo en
   src/index.html. Retoma la valorización de Petrocaribe de s08/s09
   pero hacia adelante: en vez de recalcular lo ya ocurrido, el
   estudiante ajusta el dividendo esperado y las tasas para estimar
   cuánto debería valer la acción hoy (modelo de descuento de
   dividendos). La forma exacta de `interaccion.datos` para I10 vive
   documentada en el encabezado de quiz.js junto al resto del catálogo.

   T8 suma también s12 (L06 + interacción I11, boleta de compra), la
   segunda de las cuatro interacciones insignia. Retoma el mismo precio
   de mercado primario de Petrocaribe ($1.000) para que el estudiante
   decida entre una orden a mercado o una orden límite y explore cuándo
   una orden límite se ejecuta y cuándo queda pendiente.

   T8 cierra con s13 (L06 + interacción I09, línea de tiempo ordenable)
   y s14 (L06 + interacción I12, distribución de capital) — la tercera
   y cuarta de las cuatro interacciones insignia, con lo que T8 queda
   completa. s13 retoma la cápsula 1 (los tres mercados de s01) con las
   etapas de una operación repo, en un orden deliberadamente revuelto
   para que el estudiante las reordene; el orden correcto vive en
   `ordenCorrecto`, documentado junto al resto del catálogo I09–I12 en
   el encabezado de quiz.js. s14 retoma esos mismos tres mercados
   (renta variable, renta fija, derivados) como las categorías de un
   portafolio que el estudiante arma repartiendo 100 % entre ellas —
   reusa OVA.charts.crear({tipo:'distribucion'}) de T7 para la vista
   viva en vez de un gráfico nuevo.

   C1 (4 sep) suma las siete pantallas que exigían layout nuevo: s00
   (L01, portada de unidad — se agrega al principio del arreglo, no al
   final como el resto, porque es literalmente la portada; su id
   "s00" no rompe nada, state.js/router.js navegan por posición en el
   arreglo, no por el texto del id) y, al final, s15 (L05, tarjetas
   comparativas — 3, para probar el rango 2–4 con un número que la
   kitchen sink no cubre, que muestra 4), s16 (L07, pregunta), s17
   (L08, resultado y retroalimentación — con datos estáticos por ahora;
   C4 los hará dinámicos), s18 (L09, ideas clave sin media, el caso
   nuevo que C1 le agregó al layout — la kitchen sink cubre el caso
   con media), s19 (L11, recursos descargables) y s20 (L10, cierre de
   unidad — al final de verdad, es el cierre).

   C3 (4 sep) suma el tipo de media "avatar" (imagen fija + audio
   opcional + subtítulos opcionales + transcripción obligatoria — ver
   el catálogo completo en el encabezado de media.js). s21 (L02) y s22
   (L03) lo ejercitan como cualquier otro layout con una sola zona de
   media: uno con audio real (`public/audio/demo-avatar.mp3`, un tono
   de prueba generado con ffmpeg, no locución de Jose) y otro sin — s22
   es la pantalla que demuestra la degradación de la sección 3.2 de
   PLAN-CONTENIDO.md, transcripción directa sin reproductor, viéndose
   terminada.

   s00 (L01, la portada) se quedó solo con su `media.tipo:"video"` de
   siempre — pedido explícito del usuario, primero mantener el video en
   loop en vez de la foto fija del avatar, y después que esta pantalla
   en particular no lleva narración de avatar en absoluto. L01 sigue
   aceptando un campo `avatar` independiente de `media` (mismo contrato
   que `media.tipo:'avatar'` sin el "tipo"), que `PLANTILLAS.L01` monta
   de verdad dentro de `.layout__panel` cuando la pantalla lo trae — ver
   la nota completa junto a esa plantilla en router.js — pero ninguna
   pantalla de este contenido de prueba lo ejercita hoy; queda cableado
   para cuando una portada real sí lo necesite. Las imágenes de
   `public/img/avatar/` (nomenclatura `avatar-{plano}-{fondo}-{n}.webp`,
   acordada con Juan) todavía no existen — s21/s22 apuntan ahí de todos
   modos, a propósito: el código tiene que degradar limpio a la
   ausencia del archivo, no evitarla usando otra imagen que sí exista.
   ============================================================ */
window.OVA_CONTENIDO = {
  "id": "u1-contexto-mercado",
  "titulo": "Contexto sobre el mercado, la bolsa y las acciones",
  "unidad": 1,
  "pantallas": [
    {
      "id": "s00",
      "layout": "L01",
      "titulo": "Contexto: el mercado, la bolsa y las acciones",
      "kicker": "Unidad 1",
      "cuerpo": [
        "¿Quieres aprender los fundamentos de la inversión en acciones? Es muy probable que en algún momento hayas querido obtener rentabilidad por tu capital, pero la falta de experiencia no te ha dejado aventurarte en el mercado accionario."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/woman_Businesswoman_1920x1010.mp4"
      },
      "progreso": true
    },
    {
      "id": "s01",
      "layout": "L04",
      "titulo": "Los tres mercados de Bolsa de Valores de Colombia",
      "kicker": "Unidad 1 · Cápsula 1",
      "cuerpo": [
        "En Colombia el sistema financiero está compuesto por varios mercados. Uno de ellos es el mercado de capitales, donde se transan los títulos valor de las empresas que emiten activos como acciones, bonos y derivados.",
        "Bolsa de Valores de Colombia administra estos activos por medio de tres mercados: renta variable, renta fija y derivados. El foco de este curso está en el mercado de renta variable, es decir, en la inversión en acciones."
      ],
      "progreso": true
    },
    {
      "id": "s02",
      "layout": "L12",
      "titulo": "77 %",
      "kicker": "Contexto",
      "cuerpo": [
        "de los colombianos ahorra guardando el efectivo en su casa, y solo el 9 % lo hace a través de la inversión en activos financieros, según el Banco de Desarrollo de América Latina."
      ],
      "progreso": true
    },
    {
      "id": "s03",
      "layout": "L13",
      "titulo": "Invertir sin fronteras",
      "kicker": "Dato",
      "cuerpo": [
        "A través del Mercado Global Colombiano (MGC), los inversionistas pueden comprar y vender valores extranjeros listados en mercados internacionales por medio de una sociedad comisionista de bolsa local."
      ],
      "progreso": true
    },
    {
      "id": "s04",
      "layout": "L04",
      "titulo": "Acción",
      "kicker": "Glosario",
      "cuerpo": [
        "Título valor participativo que representa un porcentaje mínimo de propiedad de una empresa. Su titular participa de la rentabilidad del negocio como dueño de una fracción de la compañía."
      ],
      "progreso": true
    },
    {
      "id": "s05",
      "layout": "L03",
      "titulo": "¿Qué es una acción?",
      "kicker": "Unidad 1 · Video",
      "cuerpo": [
        "Una acción es un título valor participativo que representa un porcentaje mínimo de propiedad de una empresa. Si adquieres una acción, es como si fueras dueño de una mínima parte de esa compañía."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/woman_Businesswoman_1920x1010.mp4",
        "vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:01.800\nBienvenida a la Academia Virtual nuam.\n\n00:00:01.800 --> 00:00:03.600\nEste es un video de relleno para probar\n\n00:00:03.600 --> 00:00:05.100\nsubtítulos y transcripción reales.",
        "transcripcion": "Bienvenida a la Academia Virtual nuam.\nEste es un video de relleno para probar subtítulos y transcripción reales."
      },
      "progreso": true
    },
    {
      "id": "s06",
      "layout": "L02",
      "titulo": "Valorización de una acción",
      "kicker": "Unidad 1 · Cápsula 2",
      "cuerpo": [
        "La empresa Petrocaribe vende cada acción a $1.000 en el mercado primario. Un inversionista compra 500 acciones y, ocho meses después, el precio sube a $1.500 en el mercado secundario."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/woman_Businesswoman_1920x1010.mp4",
        "vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:01.800\nBienvenida a la Academia Virtual nuam.\n\n00:00:01.800 --> 00:00:03.600\nEste es un video de relleno para probar\n\n00:00:03.600 --> 00:00:05.100\nsubtítulos y transcripción reales.",
        "transcripcion": "Bienvenida a la Academia Virtual nuam.\nEste es un video de relleno para probar subtítulos y transcripción reales."
      },
      "progreso": true
    },
    {
      "id": "s07",
      "layout": "L06",
      "titulo": "Antes de seguir, ¿cuánto sabes?",
      "kicker": "Evaluación rápida",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p1-mercado",
          "enunciado": "¿Cuál de los siguientes mercados administra Bolsa de Valores de Colombia?",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "Renta variable" },
            { "id": "b", "texto": "Criptomonedas" },
            { "id": "c", "texto": "Bienes raíces" }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Renta variable es el mercado de las acciones, el foco de este curso.",
            "incorrecto": "BVC administra renta variable, renta fija y derivados — ninguno de esos es criptomonedas ni bienes raíces."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "s08",
      "layout": "L04",
      "titulo": "El resultado: una valorización del 50 %",
      "kicker": "Unidad 1 · Resultado",
      "cuerpo": [
        "Retomando el ejemplo de Petrocaribe: el precio subió de $1.000 a $1.500 en ocho meses. Esa diferencia, expresada como variación, es la cifra que un inversionista revisa primero al evaluar una acción."
      ],
      "datos": {
        "tipo": "variacion",
        "valor": 50,
        "unidad": " %",
        "etiqueta": "valorización de la acción de Petrocaribe en ocho meses"
      },
      "progreso": true
    },
    {
      "id": "s09",
      "layout": "L04",
      "titulo": "Cómo se calcula la valorización",
      "kicker": "Unidad 1 · Cápsula 2",
      "cuerpo": [
        "El cálculo completo, paso a paso, sobre el mismo ejemplo."
      ],
      "datos": {
        "tipo": "proceso",
        "pasos": [
          {
            "titulo": "Compra en el mercado primario",
            "detalle": "Petrocaribe vende cada acción a $1.000; un inversionista compra 500."
          },
          {
            "titulo": "Ocho meses después",
            "detalle": "El precio sube a $1.500 en el mercado secundario."
          },
          {
            "titulo": "Cálculo de la valorización",
            "detalle": "La diferencia es $500: 500/1.000 = 50 % de valorización."
          }
        ]
      },
      "progreso": true
    },
    {
      "id": "s10",
      "layout": "L04",
      "titulo": "Renta variable frente a otros activos",
      "kicker": "Unidad 1 · Comparación",
      "cuerpo": [
        "Ningún mercado rinde igual todos los años, y ninguno está libre de riesgo. Esta es la rentabilidad anual promedio por tipo de activo administrado por BVC en el ejemplo de este curso."
      ],
      "datos": {
        "tipo": "barras",
        "titulo": "Rentabilidad anual promedio por tipo de activo",
        "unidad": " %",
        "puntos": [
          { "etiqueta": "Renta variable", "valor": 12.4 },
          { "etiqueta": "Renta fija", "valor": 6.1 },
          { "etiqueta": "Derivados", "valor": -2.3 }
        ]
      },
      "progreso": true
    },
    {
      "id": "s11",
      "layout": "L06",
      "titulo": "Calcula el valor de una acción por su dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I10",
        "datos": {
          "id": "u1-p2-valorizacion-dividendo",
          "enunciado": "Ajusta el dividendo esperado del próximo año y las tasas para estimar cuánto debería valer hoy una acción de Petrocaribe, según el modelo de descuento de dividendos.",
          "formula": "valor_accion_dividendo",
          "entradas": [
            { "id": "dividendo", "etiqueta": "Dividendo esperado (próximo año)", "unidad": " COP", "min": 20, "max": 200, "paso": 5, "valorInicial": 60 },
            { "id": "tasaCrecimiento", "etiqueta": "Crecimiento esperado del dividendo", "unidad": " %", "min": 0, "max": 10, "paso": 0.5, "valorInicial": 4, "decimales": 1 },
            { "id": "tasaDescuento", "etiqueta": "Tasa de descuento (rendimiento requerido)", "unidad": " %", "min": 1, "max": 20, "paso": 0.5, "valorInicial": 10, "decimales": 1 }
          ],
          "salida": { "etiqueta": "Valor estimado de la acción", "unidad": " COP", "decimales": 0 }
        }
      },
      "progreso": true
    },
    {
      "id": "s12",
      "layout": "L06",
      "titulo": "Decide tu boleta de compra",
      "kicker": "Unidad 1 · Cápsula 2",
      "interaccion": {
        "tipo": "I11",
        "datos": {
          "id": "u1-p3-boleta-compra",
          "enunciado": "Vas a comprar acciones de Petrocaribe. Elige el tipo de orden y ajusta los precios para ver cuándo se ejecutaría tu boleta.",
          "mercado": { "etiqueta": "Precio de mercado (simulado)", "unidad": " COP", "min": 800, "max": 1800, "paso": 10, "valorInicial": 1000 },
          "limite": { "etiqueta": "Tu precio límite de compra", "unidad": " COP", "min": 800, "max": 1800, "paso": 10, "valorInicial": 950 }
        }
      },
      "progreso": true
    },
    {
      "id": "s13",
      "layout": "L06",
      "titulo": "Ordena una operación repo",
      "kicker": "Unidad 1 · Cápsula 1",
      "interaccion": {
        "tipo": "I09",
        "datos": {
          "id": "u1-p4-orden-repo",
          "enunciado": "Ordena las etapas de una operación repo, desde el pacto inicial hasta el cierre.",
          "operacion": "Operación repo",
          "eventos": [
            { "id": "vencimiento", "texto": "Al vencimiento, el originador recompra el título pagando el monto inicial más intereses (pata final)." },
            { "id": "pacto", "texto": "Las partes pactan el título, el plazo y la tasa de la operación repo." },
            { "id": "uso", "texto": "Durante el plazo, el receptor puede usar el título como si fuera propio." },
            { "id": "transferencia", "texto": "El originador transfiere el título y recibe el dinero pactado (pata inicial)." }
          ],
          "ordenCorrecto": ["pacto", "transferencia", "uso", "vencimiento"]
        }
      },
      "progreso": true
    },
    {
      "id": "s14",
      "layout": "L06",
      "titulo": "Arma tu portafolio",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I12",
        "datos": {
          "id": "u1-p5-distribucion-portafolio",
          "enunciado": "Ajusta el porcentaje que destinarías a cada uno de los tres mercados de BVC hasta que la suma llegue a 100 %.",
          "categorias": [
            { "id": "rentaVariable", "etiqueta": "Renta variable", "valorInicial": 40 },
            { "id": "rentaFija", "etiqueta": "Renta fija", "valorInicial": 45 },
            { "id": "derivados", "etiqueta": "Derivados", "valorInicial": 15 }
          ]
        }
      },
      "progreso": true
    },
    {
      "id": "s15",
      "layout": "L05",
      "titulo": "¿Qué tan dispuesto estás a asumir riesgo?",
      "kicker": "Perfil de riesgo",
      "tarjetas": [
        { "titulo": "Conservador", "texto": "Prioriza preservar el capital y tolera variaciones mínimas en el corto plazo." },
        { "titulo": "Moderado", "texto": "Busca equilibrio entre crecimiento y estabilidad, con variaciones moderadas." },
        { "titulo": "Agresivo", "texto": "Prioriza el crecimiento y tolera variaciones altas a cambio de mayor rentabilidad esperada." }
      ],
      "progreso": true
    },
    {
      "id": "s16",
      "layout": "L07",
      "titulo": "¿Qué diferencia al mercado primario del secundario?",
      "kicker": "Cápsula 1",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p6-mercado-primario-secundario",
          "enunciado": "Un inversionista compra acciones directamente de la empresa emisora, en su primera emisión. ¿En qué mercado ocurre esa compra?",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "Mercado primario" },
            { "id": "b", "texto": "Mercado secundario" },
            { "id": "c", "texto": "Mercado de derivados" }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "El mercado primario es donde la empresa emite y vende acciones por primera vez, directamente a los inversionistas.",
            "incorrecto": "El mercado primario es donde la empresa emite y vende acciones por primera vez; el secundario es donde esas acciones se negocian después, entre inversionistas."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "s17",
      "layout": "L08",
      "titulo": "Así te fue en la evaluación rápida",
      "kicker": "Resultado",
      "cuerpo": [
        "Este es un resumen de tus respuestas en la evaluación de esta cápsula."
      ],
      "resultado": {
        "cifra": { "valor": "4/5", "etiqueta": "respuestas correctas", "porcentaje": 80 },
        "retro": {
          "tipo": "brand",
          "titulo": "Buen dominio del contenido",
          "texto": "Identificas con claridad los conceptos básicos del mercado de acciones. Sigue reforzando con la práctica de las siguientes cápsulas."
        }
      },
      "progreso": true
    },
    {
      "id": "s18",
      "layout": "L09",
      "titulo": "Lo esencial de esta cápsula",
      "kicker": "Ideas clave",
      "cuerpo": [
        "Una acción es un título de propiedad, no de deuda.",
        "Su rentabilidad no se conoce de forma anticipada.",
        "El precio se mueve según la oferta y la demanda en el mercado secundario."
      ],
      "progreso": true
    },
    {
      "id": "s19",
      "layout": "L11",
      "titulo": "Plantilla: mi perfil de riesgo",
      "kicker": "Recurso descargable",
      "cuerpo": [
        "Un formato práctico para identificar si tu perfil de inversión es conservador, moderado o agresivo antes de tomar una decisión."
      ],
      "recursos": [
        { "titulo": "Plantilla: mi perfil de riesgo", "meta": "PDF · 180 KB", "href": "#", "icono": "description" }
      ],
      "progreso": true
    },
    {
      "id": "s21",
      "layout": "L02",
      "titulo": "Antes de seguir, un mensaje del equipo docente",
      "kicker": "Unidad 1 · Avatar",
      "cuerpo": [
        "El avatar es imagen fija más audio, nunca video (regla dura 10 de CLAUDE.md): esta pantalla ejercita el reproductor real, con controles, subtítulos y transcripción."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-medio-confondo-2.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:02.500\nBienvenida a la Academia Virtual nuam.\n\n00:00:02.500 --> 00:00:06.000\nEste es un tono de prueba para ejercitar el reproductor de avatar de C3.",
        "transcripcion": "Bienvenida a la Academia Virtual nuam.\nEste es un tono de prueba para ejercitar el reproductor de avatar de C3, no la locución real de Jose."
      },
      "progreso": true
    },
    {
      "id": "s22",
      "layout": "L03",
      "titulo": "Todavía sin locución grabada",
      "kicker": "Unidad 1 · Avatar sin audio",
      "cuerpo": [
        "Esta pantalla no trae \"audio\" en su media — el caso real mientras Juan graba las locuciones (PLAN-CONTENIDO.md §3.2). Degrada a imagen más transcripción directa, sin reproductor: tiene que verse terminada, no rota."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-1.webp",
        "transcripcion": "Esta es la locución completa de la pantalla, escrita por Jose, mostrada directamente porque el audio todavía no existe. Cuando Juan lo grabe, esta misma transcripción pasa a vivir dentro de un reproductor real, sin que el contenido cambie."
      },
      "progreso": true
    },
    {
      "id": "s20",
      "layout": "L10",
      "titulo": "Ya conoces el contexto del mercado",
      "kicker": "Fin de la unidad 1",
      "cuerpo": [
        "Identificaste los tres mercados de Bolsa de Valores de Colombia, qué es una acción y la diferencia entre acciones ordinarias y preferenciales."
      ],
      "logro": {
        "titulo": "¡Completaste la Unidad 1!",
        "texto": "Contexto sobre el mercado, la bolsa y las acciones."
      },
      "progreso": true
    }
  ]
};
