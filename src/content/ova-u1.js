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

   T7 suma s08 (L02 + datos "variacion"), s09 (L09 + datos "proceso") y
   s10 (L02 + datos "barras"), para ejercitar charts.js de extremo a
   extremo en src/index.html. s08 y s09 retoman el mismo ejemplo de
   Petrocaribe de s06 (compra a $1.000, sube a $1.500 ocho meses
   después) para que la variación (+50 %) y el desglose en pasos sean
   consistentes con lo que el estudiante ya vio en video — no un dato
   nuevo sin conexión. El catálogo completo (cifra, tabla, variación,
   línea, barras, distribución, proceso), con la forma exacta de
   `pantalla.datos` por tipo, vive documentado en el encabezado de
   charts.js; los siete están representados en la kitchen sink.

   T8 suma s11 (L10 + interacción I10, calculadora paramétrica), para
   ejercitar la primera interacción insignia de extremo a extremo en
   src/index.html. Retoma la valorización de Petrocaribe de s08/s09
   pero hacia adelante: en vez de recalcular lo ya ocurrido, el
   estudiante ajusta el dividendo esperado y las tasas para estimar
   cuánto debería valer la acción hoy (modelo de descuento de
   dividendos). La forma exacta de `interaccion.datos` para I10 vive
   documentada en el encabezado de quiz.js junto al resto del catálogo.

   T8 suma también s12 (L10 + interacción I11, boleta de compra), la
   segunda de las cuatro interacciones insignia. Retoma el mismo precio
   de mercado primario de Petrocaribe ($1.000) para que el estudiante
   decida entre una orden a mercado o una orden límite y explore cuándo
   una orden límite se ejecuta y cuándo queda pendiente.
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
    },
    {
      "id": "s08",
      "layout": "L02",
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
      "layout": "L09",
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
      "layout": "L02",
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
      "layout": "L10",
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
      "layout": "L10",
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
    }
  ]
};
