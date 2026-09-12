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

   C7 (conversión del storyboard real) reemplazó por completo el
   contenido de prueba de C0–C6 (s00–s26) por las 47 pantallas reales
   de Jose (`disenoInstruccional/storyboard_data_v2.json`, v2 del
   3 sep) — p01..p47, en el mismo orden del storyboard.

   **E4 (10 sep, PLAN-ESTRUCTURA.md §5) — reestructura del recorrido,
   de 50 a 26 pantallas.** El motor no cambió; cambió qué pantallas
   existen, en qué orden y bajo qué agrupador. Decisiones tomadas
   contra PLAN-ESTRUCTURA.md §0–§1, detalle completo en ESTADO.md:

   - **26 pantallas quedan, 26 salen.** Las 26 que salen (p12, p14,
     p16–p21, p23, p26–p28, p31, p33, p35–p41, p43–p47) están
     recortadas aquí, no reescritas — E5 las movió a
     `src/content/ova-u1-archivo.js` (índice.html no lo carga).
     Recuperar una pantalla es moverla de vuelta desde ese banco, no
     hacer arqueología de git.
   - **Las cuatro cápsulas son las de Jonás (video), no las de Jose
     (DI):** Contexto del mercado / Valorización en acciones / El
     dividendo / El perfil de riesgo. `capsula` pasa a ser
     "Cápsula 1".."Cápsula 4" uniforme (antes tenía el nombre largo
     del DI) — igual que "Antes de empezar", "Apertura", "Cierre" y
     "Simulador" ya no son `capsula: null` (E3).
   - **`p05-diagnostico` (I15)** funde los antiguos p05–p10 (cinco
     preguntas + resultado) en una sola pantalla — ver el catálogo
     I15 en el encabezado de `quiz.js`. Los ids de pregunta
     (`u1-p05-diagnostico-1..5`) no cambian: Pablo ya los tiene
     mapeados. `bloqueaAvance: true` — la única pantalla del
     recorrido que lo usa hoy.
   - **Cuatro pantallas de video nuevas** (`c1-video`..`c4-video`,
     L03): el video de Jonás todavía no existe y Jose todavía no
     entregó guion/cuerpo/transcripción para ellas (PLAN-ESTRUCTURA.md
     §6) — el `cuerpo` de cada una es un aviso explícito de "pendiente",
     no texto inventado que parezca definitivo. `media.src` apunta a
     la ruta que va a usar el archivo real (`public/videos/capsulas/`)
     para que enganchar el video producido sea solo reemplazar el
     archivo, no tocar el contenido.
   - **`p10-tutor`** — pantalla nueva, pendiente de guion de Jose.
     `titulo:"Pendiente de guion"` en vez de vacío de verdad: `app.js`
     exige `pantalla.titulo` no vacío (falla ruidoso si no), así que un
     `""` literal tumbaría el arranque completo de la OVA en vez de
     quedar como marcador de esta sola pantalla — el marcador de texto
     es el "en blanco" que puede existir sin romper la validación.
     `cuerpo` sí queda ausente (opcional en L03). `media` igual de
     pendiente que las cuatro de video, mismo criterio.
   - **`c2-comprobacion` / `c4-comprobacion`** — L07 · I01. Ambas ya
     tienen enunciado real (`c2` desde el 12 sep con el ejercicio de
     valorización de la acción Alpha; `c4` desde el 12 sep con el
     ejercicio de perfil de riesgo del inversor de 28 años), sin
     marcador de "provisional" pendiente.
   - **P11 rebautizada**: las cuatro tarjetas ahora nombran las
     cápsulas de Jonás en vez de las preguntas del DI viejo.
   - **P42 (Simulador) autosuficiente.** P41 ("mercado vs. límite"),
     que explicaba la distinción que la boleta pide aplicar, se va al
     banco. En vez de traerla de vuelta (rompería el conteo fijo de
     26), el `enunciado` de la interacción I11 absorbe esa explicación
     — PLAN-ESTRUCTURA.md §5 deja las dos opciones abiertas, esta es
     la que no agrega una pantalla. También cambia de Unidad 3 a
     Unidad 1 / Simulador: Repo y Portafolio (las otras dos piezas
     insignia) salen del OVA, la boleta es la única que queda.
   - **P32 (Ideas clave) corregida.** La idea "Ordinarias y
     preferenciales otorgan derechos distintos" ya no tiene detrás
     ninguna pantalla que la enseñe (P27/P28 se van al banco) y la
     Cápsula 4 ahora es perfil de riesgo, no tipos de acción. Se
     reemplaza por una idea sobre los tres perfiles (P29/P30, que sí
     se quedan).
   - **`perfil_riesgo` sin lector en el Cierre** — PLAN-ESTRUCTURA.md
     §5 punto 3 lo deja como decisión pendiente de Juan (volver a
     nombrar el perfil obtenido en el Cierre tiene poco costo, pero
     ninguna de las dos pantallas de Cierre que quedan, L09/L11, tiene
     hoy una ranura de resultado). **No se resolvió en esta sesión** —
     sigue abierto.
   - **Bump de `id`** a `u1-contexto-mercado-v2`: `storage.js` guarda
     progreso por `contenidoId`, así que un progreso guardado contra
     las 50 pantallas viejas no debe convivir a medias con el
     recorrido nuevo.

   Mapa rápido de decisiones de C7, detalle completo en ESTADO.md:

   - **Kicker**: `unidad_capsula` del storyboard con " / " → " · "
     (p. ej. "Unidad 1 / Cápsula 2" → "Unidad 1 · Cápsula 2"), igual en
     las 47 salvo p01 (la portada usa el antetítulo real de Jose,
     "Introducción a la inversión en acciones", no una etiqueta de
     unidad).
   - **Cuerpo**: el campo `texto` del storyboard partido por línea.
     L09 (ideas clave) le quita el "N. " inicial porque router.js ya
     antepone su propio ícono de check por ítem — repetir el número
     sería un segundo marcador para la misma idea.
   - **Avatar**: `imagen` sale de la asignación de plano/fondo de
     `PLAN-CONTENIDO.md` §5. `transcripcion` es la `locucion` del
     storyboard, con la marca de tiempo final quitada; sin `audio`
     todavía (Juan las graba por separado) — degrada a imagen +
     transcripción directa, el placeholder de producción que exige la
     regla dura 10 de CLAUDE.md, no un hueco.
   - **Motion sin avatar**: `media.tipo:'video'` apuntando a
     `public/videos/motion/pNN-slug.mp4`, todavía sin producir a
     propósito. Sin `vtt`: `transcripcion` (la locución completa) es
     la alternativa textual real, sin inventar cues.
   - **Infografía**: `media.tipo:'imagen'` apuntando a
     `public/img/infografia/pNN-slug.svg`, todavía sin producir.
     `alt: ''` a propósito: el texto real de la pantalla ya vive en
     `cuerpo`, y no existe un diagrama que describir todavía.
   - **L05 con interacción incrustada** (p13, antes también p28):
     `pantalla.interaccion` reemplaza a `pantalla.tarjetas`.
   - **L05 con nota** (p29): `pantalla.nota`, capacidad de C7 en
     `PLANTILLAS.L05`.
   - **L08 dinámico**: `resultado.variable` + `resultado.reglas` sobre
     una variable de contenido — mecanismo de C4/E1, resuelto por
     `OVA.resultado` (resultado.js) desde E1.
   - **Intentos de las preguntas I01/I02**: `2`, uniforme.
   - **I10**: entradas/salidas y sus `unidad` con el criterio de
     `quiz.js` ("unidad" es sufijo con espacio inicial: `" COP"`,
     `" %"`, `" acciones"`).
   - **I11 (ajustes tanda 16)**: contrato nuevo, ya no lleva `unidad`
     sino `moneda` ("$", neutro para los tres países, mismo criterio
     que I16 adoptó en la tanda 15). Las cifras del ejercicio salen de
     las capturas de boleta real que entregó Jose: Petrocaribe,
     demanda 980, oferta 1000. **Pendiente**: `costos.comision.
     porcentaje` (1 %) y `costos.impuesto.porcentaje` (19 %) son
     provisionales —Juan los confirma con Jose—; en la captura la
     comisión era la misma cifra comprando y vendiendo, así que no se
     podía deducir la regla. Saldo (150.000) y títulos disponibles
     (120) están calibrados para que los tres estados de la tabla de
     verdad se alcancen en las dos operaciones sin salirse de los
     rangos de los campos.
   - **`p01-bienvenida`**: L03 con `media.tipo:'retrato'` en vez de
     video/avatar dispara la variante `.layout--l03--retrato`;
     `progreso:false` porque es arranque, igual que p01a/p01b.

   Resto de las notas de arquitectura (JSONP en vez de .json, `media.vtt`
   como texto WebVTT completo, etc.) no cambiaron y no se repiten aquí —
   ver el historial de este archivo en git si hace falta ese detalle.
   ============================================================ */
window.OVA_CONTENIDO = {
  "id": "u1-contexto-mercado-v2",
  "titulo": "Contexto sobre el mercado, la bolsa y las acciones",
  "unidad": 1,
  "pantallas": [
    {
      "id": "p01",
      "layout": "L01",
      "titulo": "Unidad 1: Mercado, bolsa y acciones",
      "unidad": "Unidad 1",
      "capsula": null,
      "kicker": "Introducción a la inversión en acciones",
      "cuerpo": [
        "Aprende el contexto básico del mercado accionario, qué es una acción, cómo se generan valorización y dividendos, y qué perfil de riesgo debes reconocer antes de invertir."
      ],
      "cta": "Comenzar",
      "media": {
        "tipo": "video",
        "src": "../public/videos/vid0_introduccion-claudia-mirando-a-camara.mp4"
      },
      "progreso": true
    },
    {
      "id": "p01-bienvenida",
      "layout": "L03",
      "titulo": "Te damos la bienvenida",
      "unidad": "Unidad 1",
      "capsula": "Antes de empezar",
      "kicker": "Unidad 1 · Antes de empezar",
      "cuerpo": [
        "¡Hola, soy Claudia!",
        "Y seré tu guía en esta primera unidad donde aprenderás a entender el mercado en el que estás entrando, qué derechos obtienes y por qué toda inversión exige información, criterio y control del riesgo.",
        "Pero antes que nada ve al siguiente contenido para que sepas cómo usar este curso y sacarle el máximo provecho."
      ],
      "media": {
        "tipo": "retrato",
        "src": "../public/img/avatar/avatar-sin-fondo-plano-primer-saluda.webp",
        "variante": "mascara",
        "forma": "diagonal"
      },
      "avatar": {
        "variante": "sin-avatar",
        "audio": "../public/audio/a01-bienvenida.mp3",
        "transcripcion": "Hola, soy Claudia. Antes de que empieces a invertir, quiero que entiendas bien dónde estás entrando: qué es un mercado de valores, qué derechos ganas al comprar una acción, y por qué ninguna decisión de inversión debería tomarse sin información, criterio y control del riesgo. Eso es justamente lo que vamos a construir juntos en esta primera unidad. Antes de avanzar, revisa las siguientes pantallas: ahí te cuento cómo está organizado el curso, qué herramientas de accesibilidad tienes disponibles y cómo sacarle el máximo provecho a tu tiempo. Son solo un par de minutos, y te van a ahorrar tiempo en todo lo que viene después. ¿Listo? Empecemos."
      },
      "progreso": false
    },
    {
      "id": "p01a",
      "layout": "L09",
      "titulo": "Un curso para todas las personas",
      "unidad": "Unidad 1",
      "capsula": "Antes de empezar",
      "kicker": "Unidad 1 · Antes de empezar",
      "cuerpo": [
        "Creado bajo estándares internacionales de accesibilidad digital para ofrecer una experiencia fluida, clara y sin barreras."
      ],
      "tarjetas": [
        { "icono": "../public/img/icons/ind-transcripcion.svg", "texto": "Cada pantalla con locución muestra su transcripción completa, tenga o no audio." },
        { "icono": "../public/img/icons/ind-contraste.svg", "texto": "El contraste de colores está verificado en todo el curso, incluidos los estados de las evaluaciones." },
        { "icono": "../public/img/icons/ind-teclado.svg", "texto": "Puedes recorrer el curso completo con el teclado, con el foco siempre visible." },
        { "icono": "../public/img/icons/ind-responsive.svg", "texto": "El diseño se ajusta a pantallas angostas sin perder contenido ni obligarte a hacer scroll lateral." },
        { "icono": "../public/img/icons/ind-zoomtexto.svg", "texto": "El texto se puede ampliar hasta el doble de su tamaño sin romper ningún control." },
        { "icono": "../public/img/icons/ind-animacion.svg", "texto": "Si el movimiento te resulta incómodo, puedes reducirlo sin perder ninguna información." }
      ],
      "avisoAccesibilidad": "Aquí puedes ajustar el tamaño del texto, el movimiento, la transcripción y la autolocución.",
      "progreso": false
    },
    {
      "id": "p01b",
      "layout": "L09",
      "titulo": "Cómo se recorre este curso",
      "unidad": "Unidad 1",
      "capsula": "Antes de empezar",
      "kicker": "Unidad 1 · Antes de empezar",
      "controles": [
        { "imagen": "../public/img/icons/muestra-navegacion-1-menu.svg", "texto": "Índice: abre la lista completa de pantallas de la unidad." },
        { "imagen": "../public/img/icons/muestra-navegacion-2-ubicacion.svg", "texto": "Tu ubicación: siempre ves en qué cápsula y tema estás." },
        { "imagen": "../public/img/icons/muestra-navegacion-3-indicador-progreso.svg", "texto": "Progreso: muestra en porcentaje cuánto llevas avanzado en el curso." },
        { "imagen": "../public/img/icons/muestra-navegacion-5-boton-accesibilidad.svg", "texto": "Accesibilidad: abre las preferencias de texto, movimiento y transcripción." },
        { "imagen": "../public/img/icons/muestra-navegacion-6-boton-locucion.svg", "texto": "Autolocución: actívala para que el audio de cada pantalla empiece solo." },
        { "imagen": "../public/img/icons/muestra-navegacion-7-boton-fullscreen.svg", "texto": "Pantalla completa: para ver el curso sin distracciones." },
        { "imagen": "../public/img/icons/muestra-navegacion-4-reanudar.svg", "texto": "Reanudar: te lleva directo a la última pantalla que viste." },
        { "imagen": "../public/img/icons/muestra-navegacion-8-anterior.svg", "texto": "Anterior: vuelve a la pantalla que acabas de ver." },
        { "imagen": "../public/img/icons/muestra-navegacion-9-siguiente.svg", "texto": "Siguiente: avanza a la siguiente pantalla del curso." }
      ],
      "progreso": false
    },
    {
      "id": "p02",
      "layout": "L03",
      "titulo": "Objetivos de aprendizaje",
      "unidad": "Unidad 1",
      "capsula": "Antes de empezar",
      "kicker": "Unidad 1 · Antes de empezar",
      "cuerpo": [
        "Al finalizar esta unidad podrás:"
      ],
      "lista": [
        "Diferenciar renta variable, renta fija y derivados.",
        "Explicar qué es una acción y qué derechos puede otorgar.",
        "Calcular valorización y dividendo por acción en casos sencillos.",
        "Comparar acciones ordinarias y preferenciales.",
        "Reconocer tu punto de partida frente al riesgo."
      ],
      "media": {
        "tipo": "avatar",
        "variante": "lg",
        "imagen": "../public/img/avatar/avatar-medio-confondo-1.webp",
        "audio": "../public/audio/a02-objetivos.mp3",
        "transcripcion": "En esta unidad construirás una base práctica. Primero ubicarás las acciones dentro del mercado de capitales. Luego aprenderás qué significa ser accionista, cómo se gana o se pierde dinero por precio y dividendos, y qué preguntas debes hacerte antes de invertir."
      },
      "progreso": true
    },
    {
      "id": "p03",
      "layout": "L12",
      "titulo": "Invertir empieza por cambiar la forma de ahorrar",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "cuerpo": [
        "En 2024, solo 40% de los adultos en economías en desarrollo ahorró en una cuenta financiera."
      ],
      "media": {
        "tipo": "avatar",
        "variante": "md",
        "imagen": "../public/img/avatar/avatar-abierto-confondo-5.webp",
        "audio": "../public/audio/a03-forma-de-ahorrar.mp3",
        "transcripcion": "Invertir empieza por ordenar la forma de ahorrar. Según Global Findex, en dos mil veinticuatro solo cuatro de cada diez adultos en economías en desarrollo ahorraron en una cuenta financiera. Ese dato no significa que todos deban comprar acciones; significa que existe una oportunidad enorme para pasar de guardar dinero sin plan a construir hábitos financieros formales, con objetivos, información y control del riesgo."
      },
      "progreso": true
    },
    {
      "id": "p04",
      "layout": "L02",
      "titulo": "Antes de empezar: mide tu punto de partida",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "cuerpo": [
        "Responde cinco preguntas rápidas. No tienen nota; sirven para que identifiques qué conceptos ya conoces y cuáles debes reforzar durante la unidad."
      ],
      "media": {
        "tipo": "avatar",
        "variante": "md",
        "imagen": "../public/img/avatar/avatar-medio-confondo-5.webp",
        "audio": "../public/audio/a04-punto-de-partida.mp3",
        "transcripcion": "Antes de entrar al contenido, responde una prueba diagnóstica. No busca calificarte. Su propósito es mostrarte qué tan familiarizado estás con conceptos como acción, dividendo, renta variable y tipos de acciones."
      },
      "progreso": true
    },
    {
      "id": "p05-diagnostico",
      "layout": "L06",
      "titulo": "Diagnóstico: tu punto de partida",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "bloqueaAvance": true,
      "interaccion": {
        "tipo": "I15",
        "datos": {
          "id": "u1-p05-diagnostico",
          "enunciado": "Responde las cinco preguntas. No tienen nota: te muestran qué ya sabes y qué conviene reforzar en esta unidad.",
          "variable": {
            "nombre": "aciertos_diagnostico"
          },
          "preguntas": [
            {
              "tipo": "I01",
              "datos": {
                "id": "u1-p05-diagnostico-1",
                "enunciado": "Una acción es un:",
                "intentos": 2,
                "opciones": [
                  { "id": "a", "texto": "Título participativo" },
                  { "id": "b", "texto": "Título de deuda" },
                  { "id": "c", "texto": "Cuenta de ahorro" }
                ],
                "correcta": "a",
                "retroalimentacion": {
                  "correcto": "Muy bien. Una acción representa una participación en la propiedad de una empresa.",
                  "incorrecto": "Recuerda que una acción no promete un interés fijo; representa una parte de una empresa."
                }
              }
            },
            {
              "tipo": "I02",
              "datos": {
                "id": "u1-p05-diagnostico-2",
                "enunciado": "Una acción preferencial normalmente no otorga voto en asamblea.",
                "intentos": 2,
                "respuestaCorrecta": true,
                "retroalimentacion": {
                  "correcto": "Correcto. La preferencial suele priorizar derechos económicos y no el voto.",
                  "incorrecto": "Recuerda: la preferencial suele sacrificar voto a cambio de preferencias económicas."
                }
              }
            },
            {
              "tipo": "I01",
              "datos": {
                "id": "u1-p05-diagnostico-3",
                "enunciado": "¿Cuál es la principal diferencia entre renta fija y renta variable?",
                "intentos": 2,
                "opciones": [
                  { "id": "a", "texto": "La renta fija siempre gana más" },
                  { "id": "b", "texto": "En renta fija se conoce la rentabilidad pactada desde el inicio" },
                  { "id": "c", "texto": "La renta variable no tiene riesgo" }
                ],
                "correcta": "b",
                "retroalimentacion": {
                  "correcto": "Excelente. En renta variable no sabes de antemano cuánto ganarás o perderás.",
                  "incorrecto": "La clave es la certeza inicial: renta fija pacta condiciones; renta variable depende del mercado."
                }
              }
            },
            {
              "tipo": "I02",
              "datos": {
                "id": "u1-p05-diagnostico-4",
                "enunciado": "Un dividendo permite recibir una porción de las utilidades distribuidas por la empresa.",
                "intentos": 2,
                "respuestaCorrecta": true,
                "retroalimentacion": {
                  "correcto": "Muy bien. El dividendo proviene de utilidades distribuidas.",
                  "incorrecto": "Recuerda que el dividendo es un pago al accionista cuando la empresa decide repartir utilidades."
                }
              }
            },
            {
              "tipo": "I01",
              "datos": {
                "id": "u1-p05-diagnostico-5",
                "enunciado": "Para comprar acciones necesitas hacerlo mediante un intermediario o una plataforma autorizada.",
                "intentos": 2,
                "opciones": [
                  { "id": "a", "texto": "Verdadero" },
                  { "id": "b", "texto": "Falso" },
                  { "id": "c", "texto": "Solo si inviertes grandes montos" }
                ],
                "correcta": "a",
                "retroalimentacion": {
                  "correcto": "Correcto. Debes usar una entidad o plataforma autorizada.",
                  "incorrecto": "No se compra directamente “por fuera” del mercado; se usan intermediarios autorizados."
                }
              }
            }
          ],
          "resultado": {
            "variable": "aciertos_diagnostico",
            "reglas": [
              {
                "minimo": 5,
                "cifra": { "etiqueta": "respuestas correctas de 5" },
                "retro": {
                  "tipo": "brand",
                  "titulo": "Aprovecha para ordenar y aplicar",
                  "texto": "Aprovecha la unidad para ordenar y aplicar lo que ya sabes."
                }
              },
              {
                "minimo": 3,
                "cifra": { "etiqueta": "respuestas correctas de 5" },
                "retro": {
                  "tipo": "nota",
                  "titulo": "Buena base inicial",
                  "texto": "Tienes una buena base inicial."
                }
              },
              {
                "minimo": 0,
                "cifra": { "etiqueta": "respuestas correctas de 5" },
                "retro": {
                  "tipo": "alerta",
                  "titulo": "Empieza con calma",
                  "texto": "Empieza con calma y toma nota de los conceptos base."
                }
              }
            ],
            "cifra": {
              "valor": "—",
              "etiqueta": "todavía no respondiste el diagnóstico"
            },
            "retro": {
              "tipo": "nota",
              "titulo": "Responde el diagnóstico",
              "texto": "Responde las cinco preguntas del diagnóstico para ver tu resultado aquí."
            },
            "locucion": {
              "variante": "sm",
              "imagen": "../public/img/avatar/avatar-primerplano-confondo-1.webp",
              "audio": "../public/audio/a05-diagnostico-resultado.mp3",
              "transcripcion": "Tu resultado no te encasilla. Solo te ayuda a estudiar mejor. Si algunas respuestas no fueron correctas, perfecto: esta unidad está diseñada para explicar los conceptos desde cero y llevarlos a ejemplos prácticos."
            }
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p10-tutor",
      "layout": "L03",
      "titulo": "Conoce al tutor",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "mediaLado": "fin",
      "cuerpo": [
        "José F. Mejía, FRM",
        "Ingeniero Industrial (Javeriana), Magíster en Finanzas (U. Alcalá, España), certificado como Financial Risk Manager - FRM® por GARP y certificado en Sustainable Investing por CFA Institute.",
        "Actualmente, Consultor de inversiones para BID Invest – Banco Interamericano de Desarrollo. Anteriormente, Asesor Financiero en la Agencia Nacional de Infraestructura, la Bolsa de Valores de Colombia, el Autorregulador del Mercado de Valores, INVIAS, Santander Asset Management, Repsol, entre otras.",
        "Profesor de posgrado en diversas universidades como CESA, Javeriana, Rosario, Sabana y EAFIT."
      ],
      "media": {
        "tipo": "retrato",
        "src": "../public/img/tutor-jose-fernando-mejia.webp",
        "alt": "José F. Mejía, tutor de la unidad",
        "variante": "mascara",
        "forma": "diagonal",
        "fondo": { "tipo": "color", "valor": "naranja" }
      },
      "avatar": {
        "variante": "sm",
        "imagen": "../public/img/avatar/avatar-primerplano-confondo-2.webp",
        "audio": "../public/audio/a06-tutor.mp3",
        "transcripcion": "Quiero presentarles a quien les explicará los conceptos fundamentales de esta unidad. Él es Jose Mejía. Ha trabajado tanto del lado de los inversionistas como del lado de los mercados: en la Bolsa de Valores de Colombia, en el Autorregulador del Mercado de Valores, y actualmente como consultor de inversiones para el BID Invest. Cuenta además con experiencia académica, habiendo enseñado finanzas en programas de posgrado de distintas universidades. Con esa perspectiva, que combina la práctica del mercado con la claridad para explicarlo, Jose los guiará a través de los temas de esta unidad."
      },
      "progreso": true
    },
    {
      "id": "p11",
      "layout": "L05",
      "titulo": "Las cuatro cápsulas de la unidad",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "tarjetas": [
        {
          "titulo": "Cápsula 1",
          "texto": "Contexto del mercado",
          "imagen": "../public/img/ilustraciones/capsula-1.webp"
        },
        {
          "titulo": "Cápsula 2",
          "texto": "Valorización en acciones",
          "imagen": "../public/img/ilustraciones/capsula-2.webp"
        },
        {
          "titulo": "Cápsula 3",
          "texto": "El dividendo",
          "imagen": "../public/img/ilustraciones/capsula-3.webp"
        },
        {
          "titulo": "Cápsula 4",
          "texto": "El perfil de riesgo",
          "imagen": "../public/img/ilustraciones/capsula-4.webp"
        }
      ],
      "avatar": {
        "variante": "sin-avatar",
        "audio": "../public/audio/a07-capsulas.mp3",
        "transcripcion": "La unidad se divide en cuatro cápsulas cortas. Cada una inicia con una idea central presentada por nuestro tutor, luego desarrolla un concepto aplicable y cierra con una interacción para que verifiques lo aprendido."
      },
      "progreso": true
    },
    {
      "id": "c1-video",
      "layout": "L03",
      "titulo": "Contexto del mercado",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 1",
      "kicker": "Unidad 1 · Cápsula 1",
      "cuerpo": [
        "Antes de definir qué es una acción, ubica el mercado en el que estás incursionando: cómo se organiza el sistema financiero colombiano y por qué el foco de este curso es la renta variable."
      ],
      "media": {
        "tipo": "video",
        "src": "https://proyectosappicua.com/nuam-media/capsula-1.mp4",
        "poster": "../public/videos/capsulas/capsula-1-cover.webp",
        "transcripcion": "Hola, bienvenido a la unidad 1. Antes de hablar sobre qué es una acción, es importante que conozcas el contexto del mercado en el que estás incursionando. En Colombia el sistema financiero está compuesto por varios mercados, uno de ellos es el mercado de capitales donde se transan los títulos valor de las empresas que emiten activos como acciones, bonos, derivados, entre otros. Estos activos son administrados por Bolsa de Valores de Colombia por medio de 3 mercados:\nEl mercado de renta variable, en el cual, la rentabilidad no se conoce de manera anticipada ni está garantizada, ya que depende de factores tales como el comportamiento de los mercados, el desempeño de las empresas en las que se invierte y su situación económica.\nEl mercado de renta fija, en este, desde un inicio se tiene conocimiento de la rentabilidad que se tendrá al final de la negociación ya que el interés que generan es fijo.\nY, por último, está el mercado de derivados, el cual consiste en acuerdos o contratos que se hacen entre dos partes en el presente para la compra o venta de un activo con el propósito de pagarlos en el futuro.\nNuestro foco en este curso estará puesto en el mercado de renta variable, es decir, en la inversión en acciones ya que estás son el título característico de este mercado.\nPues bien, empecemos por definir qué es una acción, estas son títulos valor participativos que representan un porcentaje mínimo de propiedad de una empresa, en otras palabras, si adquieres una acción, es como si fueras dueño de una mínima parte de la empresa. Las acciones tienen unas características muy interesantes:\nLa primera, es que como inversionista puedes comprar y vender acciones en el mercado de valores de manera fácil, rápida y segura.\nLa segunda, es que podrás recibir ganancias por la valorización de una acción y los dividendos de una empresa.\nY la tercera es que te conviertes en accionista de una compañía listada en Bolsa y esto, en algunos casos, te da derechos políticos dependiendo del tipo de acción. Esto lo veremos con más detalle más adelante."
      },
      "progreso": true
    },
    {
      "id": "p13",
      "layout": "L05",
      "titulo": "Tres familias del mercado",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 1",
      "kicker": "Unidad 1 · Cápsula 1",
      "interaccion": {
        "tipo": "I07",
        "datos": {
          "id": "u1-p13-tres-familias",
          "enunciado": "Interactúa con las tarjetas para reforzar los conceptos.",
          "tarjetas": [
            {
              "frente": "Renta variable",
              "reverso": "Son inversiones donde no conoces de antemano el rendimiento final ni tienes garantizado el capital invertido. Sus ganancias dependen de los resultados de la entidad o mercado en el que inviertes.",
              "imagen": "../public/img/ilustraciones/renta-variable.webp",
              "alt": ""
            },
            {
              "frente": "Renta fija",
              "reverso": "Son inversiones donde conoces de antemano las condiciones, el plazo y la rentabilidad esperada (o la fórmula para calcularla). Funcionan como un préstamo que haces a una entidad a cambio de intereses pactados.",
              "imagen": "../public/img/ilustraciones/renta-fija.webp",
              "alt": ""
            },
            {
              "frente": "Derivados",
              "reverso": "Son instrumentos financieros cuyo precio no es propio, sino que depende (\"deriva\") del valor de otro activo principal, llamado activo subyacente (como el oro, las divisas o el petróleo). Se usan principalmente para cobertura de riesgos o especulación.",
              "imagen": "../public/img/ilustraciones/derivados.webp",
              "alt": ""
            }
          ]
        }
      },
      "progreso": true
    },
    {
      "id": "p15",
      "layout": "L07",
      "titulo": "Comprobación cápsula 1",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 1",
      "kicker": "Unidad 1 · Cápsula 1",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p15-comprobacion-capsula1",
          "enunciado": "¿Por qué las acciones pertenecen a renta variable?",
          "intentos": 2,
          "opciones": [
            {
              "id": "a",
              "texto": "Porque su precio y dividendos no están garantizados"
            },
            {
              "id": "b",
              "texto": "Porque siempre pagan interés fijo"
            },
            {
              "id": "c",
              "texto": "Porque solo se compran a corto plazo"
            }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Correcto. La rentabilidad de una acción se conoce realmente al vender y sumar dividendos recibidos.",
            "incorrecto": "Recuerda: en acciones no hay interés fijo ni ganancia garantizada."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "c2-video",
      "layout": "L03",
      "titulo": "Valorización en acciones",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 2",
      "kicker": "Unidad 1 · Cápsula 2",
      "cuerpo": [
        "Video pendiente de producción (Jonás). Guion, cuerpo y transcripción pendientes de Jose (DI) — ver PLAN-ESTRUCTURA.md §6."
      ],
      "media": {
        "tipo": "video",
        "src": "https://proyectosappicua.com/nuam-media/capsula-2.mp4",
        "poster": "../public/videos/capsulas/capsula-2-cover.webp"
      },
      "progreso": true
    },
    {
      "id": "p22",
      "layout": "L06",
      "titulo": "Calcula tú la valorización",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 2",
      "kicker": "Unidad 1 · Cápsula 2",
      "interaccion": {
        "tipo": "I10",
        "datos": {
          "id": "u1-p22-valorizacion",
          "variante": "dashboard",
          "mostrarAccion": false,
          "enunciado": "Mueve el precio de compra y el precio de venta para ver cómo cambia la valorización.",
          "formula": "valorizacion",
          "entradas": [
            {
              "id": "precio_compra",
              "etiqueta": "Precio de compra",
              "unidad": " COP",
              "min": 1,
              "max": 10000,
              "paso": 200,
              "valorInicial": 1001,
              "decimales": 0
            },
            {
              "id": "precio_venta",
              "etiqueta": "Precio de venta",
              "unidad": " COP",
              "min": 1,
              "max": 10000,
              "paso": 200,
              "valorInicial": 1401,
              "decimales": 0
            },
            {
              "id": "acciones",
              "etiqueta": "Número de acciones",
              "unidad": " acciones",
              "min": 1,
              "max": 10000,
              "paso": 500,
              "valorInicial": 501,
              "decimales": 0
            }
          ],
          "salidas": [
            {
              "id": "monto_invertido",
              "etiqueta": "Monto invertido",
              "unidad": " COP",
              "decimales": 0,
              "acento": "gris"
            },
            {
              "id": "diferencia_por_accion",
              "etiqueta": "Diferencia por acción",
              "unidad": " COP",
              "decimales": 0,
              "acento": "naranja"
            },
            {
              "id": "variacion_porcentual",
              "etiqueta": "Variación porcentual",
              "unidad": " %",
              "decimales": 1,
              "acento": "naranja"
            },
            {
              "id": "ganancia_perdida",
              "etiqueta": "Ganancia/pérdida por precio",
              "unidad": " COP",
              "decimales": 0,
              "acento": "naranja"
            },
            {
              "id": "monto_final_bruto",
              "etiqueta": "Monto final bruto",
              "unidad": " COP",
              "decimales": 0,
              "acento": "gris"
            }
          ],
          "mensajes": {
            "positivo": "La acción se valorizó en el periodo del ejercicio.",
            "cero": "El precio no cambió; no hay ganancia ni pérdida por precio.",
            "negativo": "La acción se desvalorizó; el resultado por precio es negativo."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "c2-comprobacion",
      "layout": "L07",
      "titulo": "Comprobación cápsula 2",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 2",
      "kicker": "Unidad 1 · Cápsula 2",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-c2-comprobacion",
          "enunciado": "Compraste la acción de la empresa Alpha por $1.000 hace 6 meses. Ahora la vendes por $1.200 en el mercado secundario. ¿De cuánto fue la valorización de la acción?",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "$1.200" },
            { "id": "b", "texto": "20%" },
            { "id": "c", "texto": "10%" }
          ],
          "correcta": "b",
          "retroalimentacion": {
            "correcto": "Correcto. Se resta el precio de venta menos el de compra ($1.200 - $1.000 = $200) y esa ganancia se divide sobre el precio de compra: $200 / $1.000 = 0,2 = 20%.",
            "incorrecto": "Recuerda: la ganancia se calcula restando el precio de venta menos el de compra ($1.200 - $1.000 = $200) y luego se divide sobre el precio de compra, no sobre el de venta."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "c3-video",
      "layout": "L03",
      "titulo": "El dividendo",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 3",
      "kicker": "Unidad 1 · Cápsula 3",
      "cuerpo": [
        "Video pendiente de producción (Jonás). Guion, cuerpo y transcripción pendientes de Jose (DI) — ver PLAN-ESTRUCTURA.md §6."
      ],
      "media": {
        "tipo": "video",
        "src": "https://proyectosappicua.com/nuam-media/capsula-3.mp4",
        "poster": "../public/videos/capsulas/capsula-3-cover.webp"
      },
      "progreso": true
    },
    {
      "id": "p24",
      "layout": "L06",
      "ancho": "amplio",
      "titulo": "Calcula el dividendo por acción",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 3",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I16",
        "datos": {
          "id": "u1-p24-simulador-dividendos",
          "enunciado": "Explora cómo las ganancias de una empresa y la decisión de cuánto repartir entre los accionistas determinan el dividendo que recibes.",
          "contexto": [
            { "etiqueta": "Empresa", "valor": "La Pizzería S.A." },
            { "etiqueta": "Tu participación", "valor": "100 de 1.000 acciones = 10 % del negocio" }
          ],
          "acciones": { "totales": 1000, "estudiante": 100 },
          "pasos": [
            {
              "titulo": "¿Cuánto ganó la empresa?",
              "descripcion": "Modifica las ganancias netas obtenidas durante el año.",
              "control": {
                "etiqueta": "Ganancias netas de la empresa",
                "prefijo": "$",
                "min": 0,
                "max": 100000,
                "paso": 1000,
                "valorInicial": 50000,
                "decimales": 0
              }
            },
            {
              "titulo": "¿Cuánto decide repartir la empresa?",
              "descripcion": "El porcentaje a repartir es la parte de las ganancias que se distribuye entre los accionistas.",
              "control": {
                "etiqueta": "Porcentaje de ganancias a repartir",
                "sufijo": " %",
                "min": 0,
                "max": 100,
                "paso": 1,
                "valorInicial": 60,
                "decimales": 0
              },
              "reparto": {
                "titulo": "Destino de las ganancias",
                "etiquetaRepartido": "Dividendos",
                "etiquetaRetenido": "Ganancias retenidas"
              }
            }
          ],
          "resultados": {
            "titulo": "Resultado de tu decisión",
            "descripcion": "Los cálculos cambian automáticamente."
          },
          "salidas": [
            {
              "id": "monto_a_repartir",
              "etiqueta": "Monto total a repartir",
              "decimales": 0,
              "acento": "gris"
            },
            {
              "id": "dividendo_por_accion",
              "etiqueta": "Dividendo por acción",
              "decimales": 0,
              "decimalesMax": 2,
              "acento": "gris"
            },
            {
              "id": "dividendo_estudiante",
              "etiqueta": "Tus ganancias en el bolsillo",
              "decimales": 0,
              "decimalesMax": 2,
              "acento": "naranja"
            }
          ],
          "umbrales": { "alto": 80, "bajo": 20 },
          "retro": {
            "cero": {
              "icono": "block",
              "titulo": "Sin ganancias, no hay dividendos",
              "texto": "La empresa no generó ganancias este año, así que no hay nada que repartir: el dividendo es $0."
            },
            "alto": {
              "icono": "balance",
              "titulo": "Un pago alto hoy",
              "texto": "Gran pago para los accionistas. Pero ojo: la empresa se queda con poco dinero reservado para abrir nuevos locales o crecer."
            },
            "sinReparto": {
              "icono": "savings",
              "titulo": "Este año no se reparte nada",
              "texto": "La empresa decidió no repartir dividendos y conservar el 100 % de las ganancias. No recibes dinero hoy; tu ganancia dependerá de que ese dinero reinvertido haga subir el precio de la acción."
            },
            "bajo": {
              "icono": "potted_plant",
              "titulo": "Más recursos para reinvertir",
              "texto": "Recibes poco dinero hoy, pero la empresa guarda el {retenido} % para reinvertir y buscar generar más ganancias en el futuro."
            },
            "equilibrio": {
              "icono": "lightbulb",
              "titulo": "Busca el equilibrio",
              "texto": "La empresa reparte el {repartido} % de sus ganancias y conserva el {retenido} %. Así combina un pago a los accionistas con recursos que pueden usarse para crecer."
            }
          },
          "idea": {
            "titulo": "Idea clave:",
            "texto": "tu dividendo depende de tres cosas: cuánto gana la empresa, qué porcentaje decide repartir y cuántas acciones posees. Como tienes el 10 % de las acciones, recibes el 10 % del monto total distribuido."
          },
          "nota": "Actividad educativa — valores expresados en unidades monetarias ficticias."
        }
      },
      "progreso": true
    },
    {
      "id": "p25",
      "layout": "L07",
      "titulo": "Comprobación cápsula 3",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 3",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p25-comprobacion-capsula3",
          "enunciado": "Andina Cementos reparte $12.000.000 entre 3.000 acciones. ¿Cuál es el dividendo por acción?",
          "intentos": 2,
          "opciones": [
            {
              "id": "a",
              "texto": "$4.000"
            },
            {
              "id": "b",
              "texto": "$3.000"
            },
            {
              "id": "c",
              "texto": "$36.000"
            },
            {
              "id": "d",
              "texto": "$400"
            }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Correcto. $12.000.000 dividido entre 3.000 acciones da $4.000 por acción.",
            "incorrecto": "Revisa la fórmula: monto a repartir / número de acciones = dividendo por acción."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "c4-video",
      "layout": "L03",
      "titulo": "El perfil de riesgo",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 4",
      "kicker": "Unidad 1 · Cápsula 4",
      "cuerpo": [
        "Video pendiente de producción (Jonás). Guion, cuerpo y transcripción pendientes de Jose (DI) — ver PLAN-ESTRUCTURA.md §6."
      ],
      "media": {
        "tipo": "video",
        "src": "https://proyectosappicua.com/nuam-media/capsula-4.mp4",
        "poster": "../public/videos/capsulas/capsula-4-cover.webp"
      },
      "progreso": true
    },
    {
      "id": "p29",
      "layout": "L05",
      "titulo": "Los tres perfiles de riesgo",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 4",
      "kicker": "Unidad 1 · Cápsula 4",
      "tarjetas": [
        {
          "titulo": "Conservador",
          "texto": "Prioriza preservar capital y liquidez.",
          "imagen": "../public/img/ilustraciones/conservador.webp"
        },
        {
          "titulo": "Moderado",
          "texto": "Acepta fluctuaciones razonables y diversifica.",
          "imagen": "../public/img/ilustraciones/moderado.webp"
        },
        {
          "titulo": "Agresivo",
          "texto": "Tolera mayor volatilidad por potencial de retorno.",
          "imagen": "../public/img/ilustraciones/agresivo.webp"
        }
      ],
      "nota": "Es un perfil orientativo, no regulatorio.",
      "progreso": true
    },
    {
      "id": "p30",
      "layout": "L06",
      "titulo": "¿Cuál es tu perfil?",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 4",
      "kicker": "Unidad 1 · Cápsula 4",
      "interaccion": {
        "tipo": "I13",
        "datos": {
          "id": "u1-p30-perfil-riesgo",
          "enunciado": "Responde cuatro preguntas. El resultado se usará luego para retroalimentar decisiones de portafolio.",
          "preguntas": [
            {
              "enunciado": "Si tu inversión baja 10% en un mes, ¿qué harías?",
              "opciones": [
                { "texto": "Vender para evitar más pérdida", "puntos": 1 },
                { "texto": "Revisar y esperar si el objetivo sigue vigente", "puntos": 2 },
                { "texto": "Comprar más si el análisis lo justifica", "puntos": 3 }
              ]
            },
            {
              "enunciado": "¿Cuál es tu horizonte principal?",
              "opciones": [
                { "texto": "Menos de un año", "puntos": 1 },
                { "texto": "Entre uno y tres años", "puntos": 2 },
                { "texto": "Más de tres años", "puntos": 3 }
              ]
            },
            {
              "enunciado": "¿Qué tan importante es tener liquidez inmediata?",
              "opciones": [
                { "texto": "Muy importante", "puntos": 1 },
                { "texto": "Medianamente importante", "puntos": 2 },
                { "texto": "Poco importante para este capital", "puntos": 3 }
              ]
            },
            {
              "enunciado": "¿Qué prefieres al invertir?",
              "opciones": [
                { "texto": "Preservar capital", "puntos": 1 },
                { "texto": "Equilibrar riesgo y retorno", "puntos": 2 },
                { "texto": "Buscar mayor retorno aceptando volatilidad", "puntos": 3 }
              ]
            }
          ],
          "resultados": [
            {
              "minimo": 4,
              "maximo": 6,
              "categoria": "conservador",
              "etiqueta": "Perfil conservador",
              "texto": "Prioriza preservar capital y reducir pérdidas; debe cuidar concentración y liquidez.",
              "imagen": "../public/img/ilustraciones/conservador.webp"
            },
            {
              "minimo": 7,
              "maximo": 9,
              "categoria": "moderado",
              "etiqueta": "Perfil moderado",
              "texto": "Acepta fluctuaciones razonables y busca equilibrio entre crecimiento y control de riesgo.",
              "imagen": "../public/img/ilustraciones/moderado.webp"
            },
            {
              "minimo": 10,
              "maximo": 12,
              "categoria": "agresivo",
              "etiqueta": "Perfil agresivo",
              "texto": "Tolera mayor volatilidad por potencial de retorno, pero necesita análisis y límites de concentración.",
              "imagen": "../public/img/ilustraciones/agresivo.webp"
            }
          ],
          "variable": "perfil_riesgo",
          "aviso": "Resultado orientativo y educativo; no reemplaza el perfilamiento formal de un intermediario."
        }
      },
      "progreso": true
    },
    {
      "id": "c4-comprobacion",
      "layout": "L07",
      "titulo": "Comprobación cápsula 4",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 4",
      "kicker": "Unidad 1 · Cápsula 4",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-c4-comprobacion",
          "enunciado": "Un inversor de 28 años declara que su principal objetivo financiero es maximizar el crecimiento de su capital a largo plazo (15 a 20 años). Expresa que comprende que los mercados financieros sufren caídas periódicas y está dispuesto a asumir altas volatilidades en el valor de sus inversiones a cambio de buscar mayores rendimientos. Según estas características, ¿cuál es el perfil de riesgo que mejor describe a este inversionista?",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "Perfil Conservador" },
            { "id": "b", "texto": "Perfil Moderado" },
            { "id": "c", "texto": "Perfil Agresivo" }
          ],
          "correcta": "c",
          "retroalimentacion": {
            "correcto": "Correcto. El inversor combina un horizonte de inversión a largo plazo (15 a 20 años), tolerancia comprobada a las caídas del mercado (volatilidad) y el objetivo explícito de maximizar el crecimiento de su capital aceptando mayores riesgos: son las características del perfil agresivo.",
            "incorrecto": "Recuerda: un horizonte de largo plazo, la disposición a asumir altas volatilidades y el objetivo de maximizar el crecimiento del capital son las características que definen al perfil agresivo, no al conservador ni al moderado."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p32",
      "layout": "L09",
      "titulo": "Ideas clave de la unidad",
      "unidad": "Unidad 1",
      "capsula": "Cierre",
      "kicker": "Unidad 1 · Cierre",
      "cuerpo": [
        "Las acciones pertenecen a la renta variable.",
        "Una acción representa propiedad fraccionada.",
        "El retorno puede venir de precio y dividendos.",
        "Existen perfiles conservador, moderado y agresivo, cada uno con distinta tolerancia al riesgo.",
        "Invertir exige objetivos, información y perfil de riesgo."
      ],
      "media": {
        "tipo": "avatar",
        "variante": "lg",
        "imagen": "../public/img/avatar/avatar-medio-confondo-7.webp",
        "audio": "../public/audio/a08-ideas-cierre.mp3",
        "transcripcion": "Llegaste al final de la primera unidad. Vale la pena recoger algunos aspectos de lo que has aprendido. Las acciones pertenecen a la renta variable: no generan una promesa de lo que vas a ganar. Esa es la diferencia de fondo con un producto de renta fija. Cuando compras una acción, compras una parte de una empresa. Es una fracción pequeña, pero es propiedad e incluye derechos económicos y políticos. En acciones el retorno puede generarse por dos caminos: vía valorización del precio, si la acción llega a valer más de lo que pagaste, y vía pago de dividendos, cuando la empresa reparte utilidades. No todas las acciones otorgan los mismos derechos: las ordinarias y las preferenciales dan derechos distintos, así que conviene saber cuál de ellas estás comprando. Y, finalmente, la idea que sostiene a las cuatro anteriores: invertir no empieza por elegir una acción. Empieza por tener claro tu objetivo, buscar información y reconocer cuánto riesgo estás dispuesto a asumir. Con esa base, lo que sigue deja de ser un salto al vacío."
      },
      "progreso": true
    },
    {
      "id": "p34",
      "layout": "L11",
      "titulo": "Recursos para llevarte",
      "unidad": "Unidad 1",
      "capsula": "Cierre",
      "kicker": "Unidad 1 · Cierre",
      "cuerpo": [
        "Además del contenido de la unidad, tendrás cuatro herramientas para usar después."
      ],
      "recursos": [
        {
          "titulo": "Calculadora de valorización y dividendos",
          "meta": "Practicar fórmulas.",
          "href": "#",
          "icono": "calculate"
        },
        {
          "titulo": "Checklist antes de tu primera orden",
          "meta": "Evitar omisiones.",
          "href": "#",
          "icono": "checklist"
        },
        {
          "titulo": "Hoja de perfil y objetivos",
          "meta": "Ordenar decisiones.",
          "href": "#",
          "icono": "description"
        },
        {
          "titulo": "Glosario de los tres mercados",
          "meta": "Entender términos por país.",
          "href": "#",
          "icono": "menu_book"
        }
      ],
      "progreso": true
    },
    {
      "id": "p42",
      "layout": "L06",
      "titulo": "Simula tu primera orden",
      "unidad": "Unidad 1",
      "capsula": "Simulador",
      "kicker": "Unidad 1 \u00b7 Simulador",
      "ancho": "amplio",
      "interaccion": {
        "tipo": "I11",
        "datos": {
          "id": "u1-p42-boleta-orden",
          "enunciado": "As\u00ed se ve una boleta de orden. La demanda es el mejor precio al que alguien compra hoy y la oferta, el mejor precio al que alguien vende: entre esas dos cifras se decide todo. Una orden a mercado se ejecuta contra la punta contraria; una orden l\u00edmite fija tu precio y puede quedar expuesta si el mercado no lo alcanza. Cambia de operaci\u00f3n, de tipo, de cantidad y de precio, y mira c\u00f3mo cambian el total y el estado de tu orden.",
          "instrumento": "Petrocaribe",
          "moneda": "$",
          "mercado": {
            "demanda": 980,
            "oferta": 1000
          },
          "escenario": {
            "saldo": 150000,
            "titulosDisponibles": 120
          },
          "cantidad": {
            "etiqueta": "Cantidad",
            "min": 1,
            "max": 500,
            "paso": 1,
            "valorInicial": 100
          },
          "precio": {
            "etiqueta": "Precio",
            "min": 800,
            "max": 1200,
            "paso": 10,
            "valorInicial": 990
          },
          "costos": {
            "comision": {
              "etiqueta": "Comisi\u00f3n estimada",
              "porcentaje": 1
            },
            "impuesto": {
              "etiqueta": "Impuesto estimado",
              "porcentaje": 19
            }
          },
          "fecha": {
            "etiqueta": "Fecha de la orden"
          },
          "nota": "Petrocaribe es un emisor de ejemplo y todas las cifras son ficticias. La comisi\u00f3n (1 % del valor) y el impuesto (19 % sobre la comisi\u00f3n) son tarifas ilustrativas: cada comisionista publica las suyas.",
          "variable": {
            "nombre": "resultado_boleta"
          }
        }
      },
      "progreso": true
    }
  ]
};
