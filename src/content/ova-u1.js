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

   Pantallas de prueba para el cierre de T2: cuatro pantallas con
   layouts ya construidos en T1/T1.5 (L02, L05, L06, L11), sin media
   ni interacción — esas piezas llegan en T4/T5/T6. Relleno tomado
   del guion de «Introducción a la inversión en acciones».

   T4 suma s05/s06 (L03, L04): las dos únicas pantallas con `media`,
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

   T6 suma s07 (L10): única pantalla con `interaccion`, para ejercitar
   quiz.js de extremo a extremo en src/index.html (intentos, bloque de
   retroalimentación, reporte a cmi.interactions) y no solo en la
   kitchen sink. Usa I02 (opción única); el catálogo completo I01–I08
   vive documentado en el encabezado de quiz.js, con las ocho
   representadas en la kitchen sink.
   ============================================================ */
window.OVA_CONTENIDO = {
  "id": "u1-contexto-mercado",
  "titulo": "Contexto sobre el mercado, la bolsa y las acciones",
  "unidad": 1,
  "pantallas": [
    {
      "id": "s01",
      "layout": "L02",
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
      "layout": "L05",
      "titulo": "77 %",
      "kicker": "Contexto",
      "cuerpo": [
        "de los colombianos ahorra guardando el efectivo en su casa, y solo el 9 % lo hace a través de la inversión en activos financieros, según el Banco de Desarrollo de América Latina."
      ],
      "progreso": true
    },
    {
      "id": "s03",
      "layout": "L06",
      "titulo": "Invertir sin fronteras",
      "kicker": "Dato",
      "cuerpo": [
        "A través del Mercado Global Colombiano (MGC), los inversionistas pueden comprar y vender valores extranjeros listados en mercados internacionales por medio de una sociedad comisionista de bolsa local."
      ],
      "progreso": true
    },
    {
      "id": "s04",
      "layout": "L11",
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
      "layout": "L04",
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
      "layout": "L10",
      "titulo": "Antes de seguir, ¿cuánto sabes?",
      "kicker": "Evaluación rápida",
      "interaccion": {
        "tipo": "I02",
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
    }
  ]
};
