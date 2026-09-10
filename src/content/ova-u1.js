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

   C7 (conversión del storyboard real) reemplaza por completo el
   contenido de prueba de C0–C6 (s00–s26) por las 47 pantallas reales
   de Jose (`disenoInstruccional/storyboard_data_v2.json`, v2 del
   3 sep) — p01..p47, en el mismo orden del storyboard. El contenido de
   prueba cumplió su función (ejercitar cada layout/interacción de
   extremo a extremo antes de que existiera contenido real) y queda en
   el historial de git, no en este archivo: mantenerlo en paralelo sería
   contenido muerto, y la kitchen sink ya cubre cada pieza del motor por
   separado sin depender de este archivo.

   Generado con un script de conversión (no a mano): las partes
   mecánicas del storyboard (parseo de los payloads en formato "A | B |
   C" de I01/I02/I07/I08, el reformateo de los payloads JSON de
   I09/I10/I11/I12/I13 a la forma exacta que documenta quiz.js) se
   traducen sin intervención; las partes que el storyboard no fija de
   forma estructurada (asignación de imagen de avatar por pantalla,
   rutas de motion/infografía todavía sin producir, rangos de slider no
   especificados por Jose, el empaquetado de cifra/retro de L08) son
   decisiones de autoría de esta sesión, tomadas contra las reglas
   fijadas en `PLAN-CONTENIDO.md` y documentadas en la lista de revisión
   de `ESTADO.md` — no se inventó nada que no estuviera ya decidido en
   una sesión anterior o anotado ahí como pendiente de producción.

   Mapa rápido de decisiones, detalle completo en ESTADO.md:

   - **Kicker**: `unidad_capsula` del storyboard con " / " → " · "
     (p. ej. "Unidad 1 / Cápsula 2" → "Unidad 1 · Cápsula 2"), igual en
     las 47 salvo p01 (la portada usa el antetítulo real de Jose,
     "Introducción a la inversión en acciones", no una etiqueta de
     unidad).
   - **Cuerpo**: el campo `texto` del storyboard partido por línea.
     L09 (ideas clave) le quita el "N. " inicial porque router.js ya
     antepone su propio ícono de check por ítem — repetir el número
     sería un segundo marcador para la misma idea.
   - **Avatar** (14 pantallas: p01, p04, p10, p12, p16, p20, p26, p31,
     p35, p36, p40, p43, p44, p47): `imagen` sale de la asignación de
     plano/fondo de `PLAN-CONTENIDO.md` §5 (abierto/medio/primerplano ×
     con o sin fondo), numerada secuencialmente dentro de cada grupo —
     14 referencias contra ~12 imágenes reales que Juan produce; qué
     archivo numerado reutiliza para cuáles pantallas es su decisión,
     no una regla del motor. `transcripcion` es la `locucion` del
     storyboard, con la marca de tiempo final ("[0:16]") quitada; sin
     `audio` todavía (Juan las graba por separado, PLAN-CONTENIDO.md
     §7) — degrada a imagen + transcripción directa, el placeholder de
     producción que exige la regla dura 10 de CLAUDE.md, no un hueco.
   - **Motion sin avatar** (p02, p17, p21, p23): `media.tipo:'video'`
     apuntando a `public/videos/motion/pNN-slug.mp4`, todavía sin
     producir a propósito (mismo criterio que las imágenes de avatar:
     degrada limpio en vez de sustituirse por un video que no es el
     que corresponde). Sin `vtt`: no hay dato real de sincronización
     por escena para fabricar subtítulos con marcas de tiempo
     honestas — `transcripcion` (la locución completa) es la
     alternativa textual real, sin inventar cues.
   - **Infografía** (p14, p27, p33, p41, p45 — las cinco cuyo layout,
     L02/L03, exige `media`; p03/p11/p18/p29 usan L05/L12, que no
     tienen ranura de media y no la necesitan): `media.tipo:'imagen'`
     (catálogo nuevo de `media.js`, C7) apuntando a
     `public/img/infografia/pNN-slug.svg`, todavía sin producir.
     `alt: ''` a propósito: el texto real de la pantalla ya vive en
     `cuerpo`, y no existe un diagrama que describir todavía —
     inventar un texto alternativo para un diagrama que no existe
     describiría algo que no está. Cuando Juan entregue el SVG real,
     quien lo enganche le agrega el `alt` que describe esa estructura
     visual concreta.
   - **L05 con interacción incrustada** (p13, p28): el storyboard real
     ubica I07/I08 en L05, no en L06 — resuelve la nota abierta que
     dejó C5 en `PLAN-CONTENIDO.md`. `pantalla.interaccion` reemplaza
     a `pantalla.tarjetas`; el `enunciado` de la interacción lleva el
     `texto` completo del storyboard porque L05 con interacción no
     rinde un `cuerpo` aparte.
   - **L05 con nota** (p29): el storyboard trae un disclaimer de una
     línea ("es un perfil orientativo, no regulatorio") que no es una
     cuarta tarjeta comparable — `pantalla.nota`, capacidad nueva de
     C7 en `PLANTILLAS.L05`.
   - **L08 dinámico** (p10, p31, p43, p47): `resultado.variable` +
     `resultado.reglas` sobre `aciertos_diagnostico` (p10, mecanismo de
     C4), `perfil_riesgo` (p31/p47, categórico) y `resultado_boleta`
     (p43, un objeto — usa `resultado.campo:'estado'`, capacidad nueva
     de C7 en `obtenerResultado()`). Los títulos y el empaquetado de
     cada regla en título+cuerpo son autoría de esta sesión sobre las
     frases reales de Jose (mismo criterio editorial que `s17` ya
     estableció en C4), no texto inventado.
   - **Diagnóstico → aciertos_diagnostico** (p05–p09 escriben la
     variable; p10 la lee): el storyboard no declara esta dependencia
     en su campo `dependencias` (queda vacío en las cinco), pero
     `PLAN-CONTENIDO.md` §3.1 la fija explícitamente ("P10 lee los
     aciertos del diagnóstico de cinco preguntas P05–P09") y el propio
     texto de p10 (umbrales 0–2/3–4/5) solo tiene sentido contra un
     diagnóstico de cinco preguntas.
   - **Intentos de las preguntas I01/I02** (p05–p09, p15, p19, p25,
     p38): `2`, uniforme — el storyboard no fija un número; se adoptó
     el mismo valor que ya usaban `s07`/`s16` en el contenido de
     prueba, no una cifra nueva sin precedente.
   - **I10 (p22, p24) e I11 (p42)**: entradas/salidas y sus `unidad`
     con el criterio de `quiz.js` ("unidad" es sufijo con espacio
     inicial: `" COP"`, `" %"`, `" acciones"`); `decimales` por salida
     y los rangos de slider de precioActual/precioLimite/cantidad en
     p42 (el storyboard de P42 no trae min/max/paso, solo el escenario)
     son autoría de esta sesión, con el mismo criterio que ya usó C6
     para poblar la kitchen sink: el valor inicial reproduce el
     escenario/caso de prueba real de Jose (p42 arranca en el caso
     "expuesta", el que enseña la diferencia entre mercado y límite).
   - **I12 (p46)**: `categorias`/`reglas`/`aviso` son literalmente los
     que C6 ya había validado a mano contra este mismo payload en
     `s14`/`s26` del contenido de prueba — se reusan tal cual, no se
     re-derivan.
   - **P03** (L12): el storyboard trae una segunda línea de atribución
     ("World Bank Global Findex 2025") que L12 no tiene dónde mostrar
     (kicker/título/cuerpo, sin una ranura de fuente) — queda fuera por
     ahora, anotado en la lista de revisión de ESTADO.md, no se
     extendió el layout para un solo caso sin verificar antes con Jose
     si la atribución debe ser visible o basta con la trazabilidad de
     `Storyboard_Master_v2.md`.
   - **P34** (L11): los cuatro `recursos` llevan `href:'#'` sin
     archivo real detrás — C8 los engancha.
   - **`p01-bienvenida`** (ajustes tanda 4, 6 sep): pantalla nueva de
     Juan, no del storyboard de Jose — va entre p01 (portada) y p01a
     (accesibilidad). L03 con `media.tipo:'retrato'` en vez de
     video/avatar dispara la variante `.layout--l03--retrato`
     (retícula de 12 columnas, ver layouts.css) en vez del 50/50
     normal de L03; `progreso:false` porque es arranque, igual que
     p01a/p01b.

   Resto de las notas de arquitectura (JSONP en vez de .json, `media.vtt`
   como texto WebVTT completo, etc.) no cambiaron de C0–C6 y no se
   repiten aquí — ver el historial de este archivo en git si hace falta
   ese detalle.
   ============================================================ */
window.OVA_CONTENIDO = {
  "id": "u1-contexto-mercado",
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
        "audio": "../public/audio/loc1_objetivos.mp3",
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
        "imagen": "../public/img/avatar/avatar-abierto-confondo-1.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "En 2024, solo 40% de los adultos en economías en desarrollo ahorró en una cuenta financiera."
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
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-1.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "Antes de entrar al contenido, responde una prueba diagnóstica. No busca calificarte. Su propósito es mostrarte qué tan familiarizado estás con conceptos como acción, dividendo, renta variable y tipos de acciones."
      },
      "progreso": true
    },
    {
      "id": "p05",
      "layout": "L07",
      "titulo": "Diagnóstico 1",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p05-diagnostico-1",
          "enunciado": "Una acción es un:",
          "intentos": 2,
          "opciones": [
            {
              "id": "a",
              "texto": "Título participativo"
            },
            {
              "id": "b",
              "texto": "Título de deuda"
            },
            {
              "id": "c",
              "texto": "Cuenta de ahorro"
            }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Muy bien. Una acción representa una participación en la propiedad de una empresa.",
            "incorrecto": "Recuerda que una acción no promete un interés fijo; representa una parte de una empresa."
          },
          "variable": {
            "nombre": "aciertos_diagnostico"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p06",
      "layout": "L07",
      "titulo": "Diagnóstico 2",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "interaccion": {
        "tipo": "I02",
        "datos": {
          "id": "u1-p06-diagnostico-2",
          "enunciado": "Una acción preferencial normalmente no otorga voto en asamblea.",
          "intentos": 2,
          "respuestaCorrecta": true,
          "retroalimentacion": {
            "correcto": "Correcto. La preferencial suele priorizar derechos económicos y no el voto.",
            "incorrecto": "Recuerda: la preferencial suele sacrificar voto a cambio de preferencias económicas."
          },
          "variable": {
            "nombre": "aciertos_diagnostico"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p07",
      "layout": "L07",
      "titulo": "Diagnóstico 3",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p07-diagnostico-3",
          "enunciado": "¿Cuál es la principal diferencia entre renta fija y renta variable?",
          "intentos": 2,
          "opciones": [
            {
              "id": "a",
              "texto": "La renta fija siempre gana más"
            },
            {
              "id": "b",
              "texto": "En renta fija se conoce la rentabilidad pactada desde el inicio"
            },
            {
              "id": "c",
              "texto": "La renta variable no tiene riesgo"
            }
          ],
          "correcta": "b",
          "retroalimentacion": {
            "correcto": "Excelente. En renta variable no sabes de antemano cuánto ganarás o perderás.",
            "incorrecto": "La clave es la certeza inicial: renta fija pacta condiciones; renta variable depende del mercado."
          },
          "variable": {
            "nombre": "aciertos_diagnostico"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p08",
      "layout": "L07",
      "titulo": "Diagnóstico 4",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "interaccion": {
        "tipo": "I02",
        "datos": {
          "id": "u1-p08-diagnostico-4",
          "enunciado": "Un dividendo permite recibir una porción de las utilidades distribuidas por la empresa.",
          "intentos": 2,
          "respuestaCorrecta": true,
          "retroalimentacion": {
            "correcto": "Muy bien. El dividendo proviene de utilidades distribuidas.",
            "incorrecto": "Recuerda que el dividendo es un pago al accionista cuando la empresa decide repartir utilidades."
          },
          "variable": {
            "nombre": "aciertos_diagnostico"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p09",
      "layout": "L07",
      "titulo": "Diagnóstico 5",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "interaccion": {
        "tipo": "I01",
        "datos": {
          "id": "u1-p09-diagnostico-5",
          "enunciado": "Para comprar acciones necesitas hacerlo mediante un intermediario o una plataforma autorizada.",
          "intentos": 2,
          "opciones": [
            {
              "id": "a",
              "texto": "Verdadero"
            },
            {
              "id": "b",
              "texto": "Falso"
            },
            {
              "id": "c",
              "texto": "Solo si inviertes grandes montos"
            }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Correcto. Debes usar una entidad o plataforma autorizada.",
            "incorrecto": "No se compra directamente “por fuera” del mercado; se usan intermediarios autorizados."
          },
          "variable": {
            "nombre": "aciertos_diagnostico"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p10",
      "layout": "L08",
      "titulo": "Tu punto de partida",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-2.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "Tu resultado no te encasilla. Solo te ayuda a estudiar mejor. Si algunas respuestas no fueron correctas, perfecto: esta unidad está diseñada para explicar los conceptos desde cero y llevarlos a ejemplos prácticos."
      },
      "resultado": {
        "variable": "aciertos_diagnostico",
        "reglas": [
          {
            "minimo": 5,
            "cifra": {
              "etiqueta": "respuestas correctas de 5"
            },
            "retro": {
              "tipo": "brand",
              "titulo": "Aprovecha para ordenar y aplicar",
              "texto": "Aprovecha la unidad para ordenar y aplicar lo que ya sabes."
            }
          },
          {
            "minimo": 3,
            "cifra": {
              "etiqueta": "respuestas correctas de 5"
            },
            "retro": {
              "tipo": "nota",
              "titulo": "Buena base inicial",
              "texto": "Tienes una buena base inicial."
            }
          },
          {
            "minimo": 0,
            "cifra": {
              "etiqueta": "respuestas correctas de 5"
            },
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
          "texto": "Vuelve atrás y responde las cinco preguntas del diagnóstico para ver tu resultado aquí."
        }
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
          "texto": "¿En qué mercado estás entrando?"
        },
        {
          "titulo": "Cápsula 2",
          "texto": "Qué es una acción"
        },
        {
          "titulo": "Cápsula 3",
          "texto": "Valorización y dividendo"
        },
        {
          "titulo": "Cápsula 4",
          "texto": "Ordinarias, preferenciales y tu perfil"
        }
      ],
      "progreso": true
    },
    {
      "id": "p12",
      "layout": "L02",
      "titulo": "Cápsula 1: ¿En qué mercado estás entrando?",
      "unidad": "Unidad 1",
      "capsula": "¿En qué mercado estás entrando?",
      "kicker": "Unidad 1 · Cápsula 1",
      "cuerpo": [
        "Primero ubicaremos las acciones dentro del mercado de capitales y diferenciaremos tres grandes familias: renta variable, renta fija y derivados."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-medio-confondo-1.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "Antes de hablar de acciones, necesitas ver el mapa general. En el mercado de capitales se negocian instrumentos que conectan a quienes necesitan financiación con quienes buscan invertir. Las acciones hacen parte de la renta variable."
      },
      "progreso": true
    },
    {
      "id": "p13",
      "layout": "L05",
      "titulo": "Tres familias del mercado",
      "unidad": "Unidad 1",
      "capsula": "¿En qué mercado estás entrando?",
      "kicker": "Unidad 1 · Cápsula 1",
      "interaccion": {
        "tipo": "I07",
        "datos": {
          "id": "u1-p13-tres-familias",
          "enunciado": "Renta variable: resultado no garantizado; depende del precio y dividendos.\nRenta fija: condiciones de pago pactadas desde el inicio.\nDerivados: contratos cuyo valor depende de otro activo.",
          "tarjetas": [
            {
              "frente": "Renta variable",
              "reverso": "Resultado no garantizado"
            },
            {
              "frente": "Renta fija",
              "reverso": "Pagos o condiciones pactadas"
            },
            {
              "frente": "Derivados",
              "reverso": "Contratos sobre otro activo"
            }
          ],
          "retroalimentacion": "Bien. Las acciones pertenecen a renta variable porque su rentabilidad no se conoce al comprar."
        }
      },
      "progreso": true
    },
    {
      "id": "p14",
      "layout": "L03",
      "titulo": "Dónde encaja la inversión en acciones",
      "unidad": "Unidad 1",
      "capsula": "¿En qué mercado estás entrando?",
      "kicker": "Unidad 1 · Cápsula 1",
      "cuerpo": [
        "Las acciones son el instrumento característico de la renta variable. Puedes ganar por valorización o dividendos, pero también puedes perder si el precio baja o si la empresa no distribuye utilidades."
      ],
      "media": {
        "tipo": "imagen",
        "src": "../public/img/infografia/p14-renta-variable.svg",
        "alt": ""
      },
      "progreso": true
    },
    {
      "id": "p15",
      "layout": "L07",
      "titulo": "Comprobación cápsula 1",
      "unidad": "Unidad 1",
      "capsula": "¿En qué mercado estás entrando?",
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
      "id": "p16",
      "layout": "L02",
      "titulo": "Cápsula 2: Qué es una acción",
      "unidad": "Unidad 1",
      "capsula": "Qué es una acción",
      "kicker": "Unidad 1 · Cápsula 2",
      "cuerpo": [
        "Ahora veremos por qué una acción te convierte en propietario de una fracción de una empresa y qué implica ser accionista."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-medio-confondo-2.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "Una acción es un título participativo. Cuando compras una acción, compras una fracción muy pequeña de una empresa emisora. Esa participación puede darte derechos económicos y, según el tipo de acción, derechos políticos."
      },
      "progreso": true
    },
    {
      "id": "p17",
      "layout": "L02",
      "titulo": "Propiedad fraccionada",
      "unidad": "Unidad 1",
      "capsula": "Qué es una acción",
      "kicker": "Unidad 1 · Cápsula 2",
      "cuerpo": [
        "Ejemplo: si Andina Cementos emite 1.000.000 de acciones y tú compras 100, tienes una participación pequeña, pero real, en la compañía."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/motion/p17-propiedad-fraccionada.mp4",
        "transcripcion": "Imagina que Andina Cementos está dividida en un millón de partes iguales llamadas acciones. Si compras cien, tu participación es pequeña, pero existe. Esa propiedad fraccionada es la base de los derechos del accionista."
      },
      "progreso": true
    },
    {
      "id": "p18",
      "layout": "L05",
      "titulo": "Tres ventajas de ser accionista",
      "unidad": "Unidad 1",
      "capsula": "Qué es una acción",
      "kicker": "Unidad 1 · Cápsula 2",
      "tarjetas": [
        {
          "titulo": "Valorización",
          "texto": "Participar en valorizaciones si el precio sube."
        },
        {
          "titulo": "Dividendos",
          "texto": "Recibir dividendos cuando se reparten utilidades."
        },
        {
          "titulo": "Derechos políticos",
          "texto": "Acceder a derechos políticos en ciertos tipos de acciones."
        }
      ],
      "progreso": true
    },
    {
      "id": "p19",
      "layout": "L07",
      "titulo": "Comprobación cápsula 2",
      "unidad": "Unidad 1",
      "capsula": "Qué es una acción",
      "kicker": "Unidad 1 · Cápsula 2",
      "interaccion": {
        "tipo": "I02",
        "datos": {
          "id": "u1-p19-comprobacion-capsula2",
          "enunciado": "Comprar una acción equivale a prestar dinero a una empresa con interés fijo.",
          "intentos": 2,
          "respuestaCorrecta": false,
          "retroalimentacion": {
            "correcto": "Correcto. La acción es participación, no deuda con interés fijo.",
            "incorrecto": "Recuerda: una acción te vuelve accionista; un bono se parece más a un préstamo."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p20",
      "layout": "L02",
      "titulo": "Cápsula 3: Valorización y dividendo",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "cuerpo": [
        "Esta cápsula explica las dos fuentes básicas de retorno en acciones: vender a mayor precio y recibir parte de utilidades distribuidas."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-medio-confondo-3.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "Ahora entraremos a la pieza más práctica de la unidad. Aprenderás a calcular una valorización simple y un dividendo por acción. Estos cálculos no predicen el futuro, pero ayudan a entender de dónde viene la rentabilidad."
      },
      "progreso": true
    },
    {
      "id": "p21",
      "layout": "L02",
      "titulo": "El caso Petrocaribe: de $1.000 a $1.500",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "cuerpo": [
        "Compras 500 acciones de Petrocaribe a $1.000 cada una. Ocho meses después, el precio sube a $1.500. La diferencia por acción es $500 y la valorización es 50%."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/motion/p21-caso-petrocaribe.mp4",
        "transcripcion": "Supongamos que compras acciones de Petrocaribe a mil pesos cada una. Más adelante, el precio sube a mil quinientos. La diferencia es quinientos por acción. Al dividir quinientos entre mil, la valorización es cincuenta por ciento."
      },
      "progreso": true
    },
    {
      "id": "p22",
      "layout": "L06",
      "titulo": "Calcula tú la valorización",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I10",
        "datos": {
          "id": "u1-p22-valorizacion",
          "enunciado": "Mueve el precio de compra y el precio de venta para ver cómo cambia la valorización.",
          "formula": "valorizacion",
          "entradas": [
            {
              "id": "precio_compra",
              "etiqueta": "Precio de compra",
              "unidad": " COP",
              "min": 1,
              "max": 10000,
              "paso": 10,
              "valorInicial": 1000,
              "decimales": 0
            },
            {
              "id": "precio_venta",
              "etiqueta": "Precio de venta",
              "unidad": " COP",
              "min": 1,
              "max": 10000,
              "paso": 10,
              "valorInicial": 1500,
              "decimales": 0
            },
            {
              "id": "acciones",
              "etiqueta": "Número de acciones",
              "unidad": " acciones",
              "min": 1,
              "max": 10000,
              "paso": 1,
              "valorInicial": 500,
              "decimales": 0
            }
          ],
          "salidas": [
            {
              "id": "monto_invertido",
              "etiqueta": "Monto invertido",
              "unidad": " COP",
              "decimales": 0
            },
            {
              "id": "diferencia_por_accion",
              "etiqueta": "Diferencia por acción",
              "unidad": " COP",
              "decimales": 0
            },
            {
              "id": "variacion_porcentual",
              "etiqueta": "Variación porcentual",
              "unidad": " %",
              "decimales": 1
            },
            {
              "id": "ganancia_perdida",
              "etiqueta": "Ganancia/pérdida por precio",
              "unidad": " COP",
              "decimales": 0
            },
            {
              "id": "monto_final_bruto",
              "etiqueta": "Monto final bruto",
              "unidad": " COP",
              "decimales": 0
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
      "id": "p23",
      "layout": "L02",
      "titulo": "El dividendo: reparto de utilidades",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "cuerpo": [
        "Banco del Sur genera utilidades. La asamblea decide qué porcentaje se reparte. El dividendo por acción se calcula dividiendo el monto a repartir entre el número de acciones."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/motion/p23-dividendo-reparto.mp4",
        "transcripcion": "El dividendo depende de utilidades y de la decisión de repartirlas. Si una empresa gana dinero, puede distribuir una parte entre sus accionistas. Pero también puede decidir repartir menos o no repartir, por ejemplo para fortalecer la operación."
      },
      "progreso": true
    },
    {
      "id": "p24",
      "layout": "L06",
      "titulo": "Calcula el dividendo por acción",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
      "kicker": "Unidad 1 · Cápsula 3",
      "interaccion": {
        "tipo": "I10",
        "datos": {
          "id": "u1-p24-dividendo-por-accion",
          "enunciado": "Ajusta utilidad neta, porcentaje a repartir y número de acciones. Observa el dividendo estimado por acción.",
          "formula": "dividendo_por_accion",
          "entradas": [
            {
              "id": "utilidad_neta",
              "etiqueta": "Utilidad neta",
              "unidad": " COP",
              "min": 0,
              "max": 1000000000,
              "paso": 100000,
              "valorInicial": 20000000,
              "decimales": 0
            },
            {
              "id": "porcentaje_repartir",
              "etiqueta": "Porcentaje a repartir",
              "unidad": " %",
              "min": 0,
              "max": 100,
              "paso": 1,
              "valorInicial": 50,
              "decimales": 1
            },
            {
              "id": "acciones_totales",
              "etiqueta": "Acciones totales",
              "unidad": " acciones",
              "min": 1,
              "max": 10000000,
              "paso": 1,
              "valorInicial": 1500,
              "decimales": 0
            },
            {
              "id": "acciones_estudiante",
              "etiqueta": "Acciones que posees",
              "unidad": " acciones",
              "min": 0,
              "max": 1000000,
              "paso": 1,
              "valorInicial": 100,
              "decimales": 0
            }
          ],
          "salidas": [
            {
              "id": "monto_a_repartir",
              "etiqueta": "Monto a repartir",
              "unidad": " COP",
              "decimales": 0
            },
            {
              "id": "dividendo_por_accion",
              "etiqueta": "Dividendo por acción",
              "unidad": " COP",
              "decimales": 2
            },
            {
              "id": "dividendo_estudiante",
              "etiqueta": "Dividendo estimado del estudiante",
              "unidad": " COP",
              "decimales": 2
            }
          ],
          "mensajes": {
            "positivo": "El ejercicio genera dividendo estimado.",
            "cero": "No hay dividendo si la utilidad o el porcentaje a repartir es cero.",
            "negativo": "No aplica; los inputs válidos no deben producir dividendos negativos."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p25",
      "layout": "L07",
      "titulo": "Comprobación cápsula 3",
      "unidad": "Unidad 1",
      "capsula": "Valorización y dividendo",
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
      "id": "p26",
      "layout": "L02",
      "titulo": "Cápsula 4: Tipos de acciones y perfil",
      "unidad": "Unidad 1",
      "capsula": "Tipos de acciones y perfil",
      "kicker": "Unidad 1 · Cápsula 4",
      "cuerpo": [
        "Ahora conectaremos los derechos de las acciones con tu perfil de riesgo y tus objetivos de inversión."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-medio-confondo-4.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "No todas las acciones otorgan exactamente los mismos derechos. Además, no todos los inversionistas toleran el riesgo de la misma manera. Por eso, antes de invertir debes conocer el instrumento y conocerte como inversionista."
      },
      "progreso": true
    },
    {
      "id": "p27",
      "layout": "L03",
      "titulo": "Derechos políticos y económicos",
      "unidad": "Unidad 1",
      "capsula": "Tipos de acciones y perfil",
      "kicker": "Unidad 1 · Cápsula 4",
      "cuerpo": [
        "Derechos políticos: participación y voto cuando aplica.",
        "Derechos económicos: dividendos y beneficios patrimoniales cuando se generan y aprueban."
      ],
      "media": {
        "tipo": "imagen",
        "src": "../public/img/infografia/p27-derechos-politicos-economicos.svg",
        "alt": ""
      },
      "progreso": true
    },
    {
      "id": "p28",
      "layout": "L05",
      "titulo": "Ordinarias frente a preferenciales",
      "unidad": "Unidad 1",
      "capsula": "Tipos de acciones y perfil",
      "kicker": "Unidad 1 · Cápsula 4",
      "interaccion": {
        "tipo": "I08",
        "datos": {
          "id": "u1-p28-ordinarias-preferenciales",
          "enunciado": "Ordinarias: suelen incluir voto y participación en dividendos.\nPreferenciales: suelen priorizar derechos económicos y limitar el voto.\nAmbas pueden comprarse y venderse en el mercado si están listadas.",
          "columnas": [
            "Acciones ordinarias",
            "Acciones preferenciales"
          ],
          "filas": [
            {
              "etiqueta": "Voto",
              "izquierda": "normalmente sí",
              "derecha": "normalmente no"
            },
            {
              "etiqueta": "Dividendos",
              "izquierda": "proporcionales",
              "derecha": "preferencia económica"
            },
            {
              "etiqueta": "Prioridad en liquidación",
              "izquierda": "menor",
              "derecha": "mayor después de acreedores"
            },
            {
              "etiqueta": "Enfoque",
              "izquierda": "participación",
              "derecha": "ingreso preferente"
            }
          ]
        }
      },
      "progreso": true
    },
    {
      "id": "p29",
      "layout": "L05",
      "titulo": "Los tres perfiles de riesgo",
      "unidad": "Unidad 1",
      "capsula": "Tipos de acciones y perfil",
      "kicker": "Unidad 1 · Cápsula 4",
      "tarjetas": [
        {
          "titulo": "Conservador",
          "texto": "Prioriza preservar capital y liquidez."
        },
        {
          "titulo": "Moderado",
          "texto": "Acepta fluctuaciones razonables y diversifica."
        },
        {
          "titulo": "Agresivo",
          "texto": "Tolera mayor volatilidad por potencial de retorno."
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
      "capsula": "Tipos de acciones y perfil",
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
                {
                  "texto": "Vender para evitar más pérdida",
                  "puntos": 1
                },
                {
                  "texto": "Revisar y esperar si el objetivo sigue vigente",
                  "puntos": 2
                },
                {
                  "texto": "Comprar más si el análisis lo justifica",
                  "puntos": 3
                }
              ]
            },
            {
              "enunciado": "¿Cuál es tu horizonte principal?",
              "opciones": [
                {
                  "texto": "Menos de un año",
                  "puntos": 1
                },
                {
                  "texto": "Entre uno y tres años",
                  "puntos": 2
                },
                {
                  "texto": "Más de tres años",
                  "puntos": 3
                }
              ]
            },
            {
              "enunciado": "¿Qué tan importante es tener liquidez inmediata?",
              "opciones": [
                {
                  "texto": "Muy importante",
                  "puntos": 1
                },
                {
                  "texto": "Medianamente importante",
                  "puntos": 2
                },
                {
                  "texto": "Poco importante para este capital",
                  "puntos": 3
                }
              ]
            },
            {
              "enunciado": "¿Qué prefieres al invertir?",
              "opciones": [
                {
                  "texto": "Preservar capital",
                  "puntos": 1
                },
                {
                  "texto": "Equilibrar riesgo y retorno",
                  "puntos": 2
                },
                {
                  "texto": "Buscar mayor retorno aceptando volatilidad",
                  "puntos": 3
                }
              ]
            }
          ],
          "resultados": [
            {
              "minimo": 4,
              "maximo": 6,
              "categoria": "conservador",
              "etiqueta": "Perfil conservador",
              "texto": "Prioriza preservar capital y reducir pérdidas; debe cuidar concentración y liquidez."
            },
            {
              "minimo": 7,
              "maximo": 9,
              "categoria": "moderado",
              "etiqueta": "Perfil moderado",
              "texto": "Acepta fluctuaciones razonables y busca equilibrio entre crecimiento y control de riesgo."
            },
            {
              "minimo": 10,
              "maximo": 12,
              "categoria": "agresivo",
              "etiqueta": "Perfil agresivo",
              "texto": "Tolera mayor volatilidad por potencial de retorno, pero necesita análisis y límites de concentración."
            }
          ],
          "variable": "perfil_riesgo",
          "aviso": "Resultado orientativo y educativo; no reemplaza el perfilamiento formal de un intermediario."
        }
      },
      "progreso": true
    },
    {
      "id": "p31",
      "layout": "L08",
      "titulo": "Tu resultado",
      "unidad": "Unidad 1",
      "capsula": "Tipos de acciones y perfil",
      "kicker": "Unidad 1 · Cápsula 4",
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-3.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "Tu resultado resume tu tolerancia inicial al riesgo. Úsalo como punto de partida, no como sentencia. En inversiones reales, tu perfil debe confirmarse con una entidad autorizada y actualizarse si cambian tus objetivos o circunstancias."
      },
      "resultado": {
        "variable": "perfil_riesgo",
        "reglas": [
          {
            "valor": "conservador",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil conservador",
              "texto": "Prioriza estabilidad y liquidez. Este resultado es orientativo y no reemplaza asesoría profesional."
            }
          },
          {
            "valor": "moderado",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil moderado",
              "texto": "Busca equilibrio entre riesgo y retorno. Este resultado es orientativo y no reemplaza asesoría profesional."
            }
          },
          {
            "valor": "agresivo",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil agresivo",
              "texto": "Acepta volatilidad alta por mayor retorno potencial. Este resultado es orientativo y no reemplaza asesoría profesional."
            }
          }
        ],
        "retro": {
          "tipo": "nota",
          "titulo": "Responde el test de perfil",
          "texto": "Vuelve a la pantalla anterior y responde el test de perfil de riesgo para ver tu resultado aquí."
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
        "Ordinarias y preferenciales otorgan derechos distintos.",
        "Invertir exige objetivos, información y perfil de riesgo."
      ],
      "progreso": true
    },
    {
      "id": "p33",
      "layout": "L02",
      "titulo": "Las tres bolsas de nuam",
      "unidad": "Unidad 1",
      "capsula": "Cierre",
      "kicker": "Unidad 1 · Cierre",
      "cuerpo": [
        "Colombia: Bolsa de Valores de Colombia | Supervisor: SFC | Depósito: Deceval.",
        "Perú: Bolsa de Valores de Lima | Supervisor: SMV | Depósito: CAVALI.",
        "Chile: Bolsa de Santiago | Supervisor: CMF | Depósito: DCV."
      ],
      "media": {
        "tipo": "imagen",
        "src": "../public/img/infografia/p33-tres-bolsas-nuam.svg",
        "alt": ""
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
      "id": "p35",
      "layout": "L10",
      "titulo": "Qué sigue después de esta unidad",
      "unidad": "Unidad 1",
      "capsula": "Cierre",
      "kicker": "Unidad 1 · Cierre",
      "cuerpo": [
        "En la siguiente unidad profundizarás en conceptos del mercado bursátil: mercado primario y secundario, operaciones de contado, repos, transferencia temporal de valores y actores del ecosistema."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-4.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "Ya tienes la base. En adelante podrás estudiar cómo se ejecutan operaciones, quiénes participan en el mercado y qué debes verificar antes de enviar una orden. El siguiente paso es pasar del concepto a la operación."
      },
      "logro": {
        "titulo": "¡Completaste la Unidad 1!",
        "texto": "Contexto sobre el mercado, la bolsa y las acciones."
      },
      "progreso": true
    },
    {
      "id": "p36",
      "layout": "L13",
      "titulo": "Vista previa Unidad 2: Anatomía de un Repo",
      "unidad": "Unidad 2",
      "capsula": "Anatomía de un Repo",
      "kicker": "Unidad 2 · Pieza insignia Repo",
      "cuerpo": [
        "Objetivo: convertir una explicación densa en una línea de tiempo recorrible de tres momentos: inicio, plazo y regreso."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-abierto-confondo-2.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "Esta pieza funciona como una vista previa de la unidad dos. Un repo puede entenderse como una venta de acciones con pacto de recompra. La interacción mostrará qué cambia de manos al inicio, durante el plazo y al cierre."
      },
      "progreso": true
    },
    {
      "id": "p37",
      "layout": "L06",
      "titulo": "Repo paso a paso",
      "unidad": "Unidad 2",
      "capsula": "Anatomía de un Repo",
      "kicker": "Unidad 2 · Pieza insignia Repo",
      "interaccion": {
        "tipo": "I09",
        "datos": {
          "id": "u1-p37-repo-recorrido",
          "enunciado": "Recorre la operación y mira qué entrega cada parte en cada momento.",
          "estadoInicial": "Inversionista A necesita liquidez y posee acciones. Inversionista B tiene dinero disponible.",
          "momentos": [
            {
              "titulo": "Operación inicial",
              "descripcion": "A entrega acciones y B entrega dinero.",
              "cambia": "acciones de A a B; dinero de B a A",
              "resultado": "A obtiene liquidez; B recibe acciones bajo pacto."
            },
            {
              "titulo": "Durante el plazo",
              "descripcion": "Las acciones quedan inmovilizadas bajo condiciones pactadas.",
              "cambia": "no hay nueva entrega; se mantiene obligación de regreso",
              "resultado": "Las partes esperan vencimiento."
            },
            {
              "titulo": "Operación de regreso",
              "descripcion": "A recompra y B recibe dinero más rendimiento pactado.",
              "cambia": "acciones vuelven a A; dinero+rendimento va a B",
              "resultado": "La operación se cierra."
            }
          ],
          "estadoFinal": "Las acciones retornan al vendedor inicial y el comprador recibe el pago acordado.",
          "retro": "El rasgo esencial es el pacto de recompra, no la venta definitiva."
        }
      },
      "progreso": true
    },
    {
      "id": "p38",
      "layout": "L07",
      "titulo": "Comprobación Repo",
      "unidad": "Unidad 2",
      "capsula": "Anatomía de un Repo",
      "kicker": "Unidad 2 · Pieza insignia Repo",
      "interaccion": {
        "tipo": "I02",
        "datos": {
          "id": "u1-p38-comprobacion-repo",
          "enunciado": "En un repo, las acciones se entregan con un pacto de recompra futura.",
          "intentos": 2,
          "respuestaCorrecta": true,
          "retroalimentacion": {
            "correcto": "Correcto. El pacto de recompra diferencia el repo de una venta definitiva.",
            "incorrecto": "Revisa la secuencia: entrega inicial y recompra pactada al regreso."
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p39",
      "layout": "L09",
      "titulo": "Cierre pieza Repo",
      "unidad": "Unidad 2",
      "capsula": "Anatomía de un Repo",
      "kicker": "Unidad 2 · Pieza insignia Repo",
      "cuerpo": [
        "El repo busca liquidez.",
        "Las acciones sirven como activo de respaldo.",
        "Hay operación inicial y de regreso.",
        "El precio de regreso incorpora el rendimiento acordado."
      ],
      "progreso": true
    },
    {
      "id": "p40",
      "layout": "L13",
      "titulo": "Vista previa Unidad 3: Tu primera orden",
      "unidad": "Unidad 3",
      "capsula": "Tu primera orden",
      "kicker": "Unidad 3 · Pieza insignia Orden",
      "cuerpo": [
        "Objetivo: practicar la diferencia entre orden a mercado y orden límite antes de enviar una instrucción real."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-abierto-confondo-3.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "La tercera unidad debe llevar al estudiante de la teoría a la acción. Esta vista previa propone una boleta simulada para entender qué ocurre cuando eliges precio de mercado o precio límite."
      },
      "progreso": true
    },
    {
      "id": "p41",
      "layout": "L03",
      "titulo": "Mercado vs límite",
      "unidad": "Unidad 3",
      "capsula": "Tu primera orden",
      "kicker": "Unidad 3 · Pieza insignia Orden",
      "cuerpo": [
        "Orden a mercado: busca ejecución rápida al mejor precio disponible.",
        "Orden límite: fija el precio máximo de compra o mínimo de venta; puede no ejecutarse."
      ],
      "media": {
        "tipo": "imagen",
        "src": "../public/img/infografia/p41-mercado-vs-limite.svg",
        "alt": ""
      },
      "progreso": true
    },
    {
      "id": "p42",
      "layout": "L06",
      "titulo": "Simula tu primera orden",
      "unidad": "Unidad 3",
      "capsula": "Tu primera orden",
      "kicker": "Unidad 3 · Pieza insignia Orden",
      "interaccion": {
        "tipo": "I11",
        "datos": {
          "id": "u1-p42-boleta-orden",
          "enunciado": "Completa la boleta y observa el resultado: ejecutada o expuesta.",
          "emisor": "Banco del Sur",
          "escenario": {
            "saldo": 10000,
            "titulosDisponibles": 8
          },
          "precioActual": {
            "etiqueta": "Precio actual (mercado)",
            "unidad": " COP",
            "min": 800,
            "max": 1800,
            "paso": 10,
            "valorInicial": 1200
          },
          "precioLimite": {
            "etiqueta": "Tu precio límite",
            "unidad": " COP",
            "min": 800,
            "max": 1800,
            "paso": 10,
            "valorInicial": 1100
          },
          "cantidad": {
            "etiqueta": "Cantidad",
            "unidad": " acciones",
            "min": 1,
            "max": 50,
            "paso": 1,
            "valorInicial": 5
          },
          "variable": {
            "nombre": "resultado_boleta"
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p43",
      "layout": "L08",
      "titulo": "Resultado de la orden",
      "unidad": "Unidad 3",
      "capsula": "Tu primera orden",
      "kicker": "Unidad 3 · Pieza insignia Orden",
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-5.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "El resultado de una orden depende de sus condiciones. Lo importante es revisar cantidad, precio, vigencia, costos y saldo antes de confirmar. En la vida real, una orden confirmada tiene trazabilidad."
      },
      "resultado": {
        "variable": "resultado_boleta",
        "campo": "estado",
        "reglas": [
          {
            "valor": "ejecutada",
            "retro": {
              "tipo": "nota",
              "titulo": "Ejecutada",
              "texto": "tu instrucción encontró condiciones de mercado."
            }
          },
          {
            "valor": "expuesta",
            "retro": {
              "tipo": "nota",
              "titulo": "Expuesta",
              "texto": "queda vigente hasta que el precio llegue o venza."
            }
          },
          {
            "valor": "rechazada",
            "retro": {
              "tipo": "alerta",
              "titulo": "Rechazada",
              "texto": "faltan datos o no hay saldo/títulos suficientes."
            }
          }
        ],
        "retro": {
          "tipo": "nota",
          "titulo": "Envía tu boleta",
          "texto": "Vuelve a la pantalla anterior y envía tu boleta para ver el resultado aquí."
        }
      },
      "progreso": true
    },
    {
      "id": "p44",
      "layout": "L13",
      "titulo": "Vista previa Unidad 5: Arma tu portafolio",
      "unidad": "Unidad 5",
      "capsula": "Arma tu portafolio",
      "kicker": "Unidad 5 · Pieza insignia Portafolio",
      "cuerpo": [
        "Objetivo: repartir capital entre tres emisores ficticios y recibir retroalimentación según el perfil obtenido en P30."
      ],
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-abierto-confondo-4.webp",
        "audio": "../public/audio/demo-avatar.mp3",
        "transcripcion": "La quinta unidad debe cerrar con práctica. Esta pieza permite repartir capital entre tres emisores ficticios. La retroalimentación usará el perfil obtenido antes para sugerir si la distribución es coherente con tu tolerancia al riesgo."
      },
      "progreso": true
    },
    {
      "id": "p45",
      "layout": "L03",
      "titulo": "Tres emisores ficticios",
      "unidad": "Unidad 5",
      "capsula": "Arma tu portafolio",
      "kicker": "Unidad 5 · Pieza insignia Portafolio",
      "cuerpo": [
        "Petrocaribe: alto riesgo, sensible a precios de energía.",
        "Andina Cementos: riesgo medio, ligado a infraestructura y construcción.",
        "Banco del Sur: riesgo medio-bajo, negocio financiero diversificado."
      ],
      "media": {
        "tipo": "imagen",
        "src": "../public/img/infografia/p45-tres-emisores.svg",
        "alt": ""
      },
      "progreso": true
    },
    {
      "id": "p46",
      "layout": "L06",
      "titulo": "Distribuye $10.000",
      "unidad": "Unidad 5",
      "capsula": "Arma tu portafolio",
      "kicker": "Unidad 5 · Pieza insignia Portafolio",
      "interaccion": {
        "tipo": "I12",
        "datos": {
          "id": "u1-p46-portafolio",
          "enunciado": "Asigna porcentajes a Petrocaribe, Andina Cementos y Banco del Sur. La suma debe ser 100%.",
          "categorias": [
            {
              "id": "petrocaribe",
              "etiqueta": "Petrocaribe",
              "riesgo": "alto",
              "valorInicial": 34
            },
            {
              "id": "andinaCementos",
              "etiqueta": "Andina Cementos",
              "riesgo": "medio",
              "valorInicial": 33
            },
            {
              "id": "bancoDelSur",
              "etiqueta": "Banco del Sur",
              "riesgo": "medio-bajo",
              "valorInicial": 33
            }
          ],
          "reglas": [
            {
              "perfil": "conservador",
              "condiciones": [
                {
                  "emisor": "petrocaribe",
                  "operador": ">",
                  "valor": 40
                }
              ],
              "retro": "La distribución luce agresiva para un perfil conservador; revisa concentración y pérdida tolerable."
            },
            {
              "perfil": "conservador",
              "condiciones": [
                {
                  "emisor": "bancoDelSur",
                  "operador": ">=",
                  "valor": 50
                },
                {
                  "tipo": "ningunoSupera",
                  "valor": 60
                }
              ],
              "retro": "La distribución es más coherente con preservación relativa, aunque sigue expuesta a renta variable."
            },
            {
              "perfil": "moderado",
              "condiciones": [
                {
                  "tipo": "ningunoSupera",
                  "valor": 60
                }
              ],
              "retro": "La distribución muestra diversificación básica compatible con un perfil moderado."
            },
            {
              "perfil": "moderado",
              "condiciones": [
                {
                  "tipo": "algunoSupera",
                  "valor": 60
                }
              ],
              "retro": "Revisa concentración; un perfil moderado suele buscar equilibrio."
            },
            {
              "perfil": "agresivo",
              "condiciones": [
                {
                  "emisor": "petrocaribe",
                  "operador": "entre",
                  "min": 30,
                  "max": 60
                }
              ],
              "retro": "La exposición a riesgo alto puede ser coherente, siempre que haya análisis y límites."
            },
            {
              "perfil": "agresivo",
              "condiciones": [
                {
                  "emisor": "petrocaribe",
                  "operador": ">",
                  "valor": 60
                }
              ],
              "retro": "Alta concentración: incluso un perfil agresivo debería justificar y monitorear ese riesgo."
            }
          ],
          "aviso": "No constituye recomendación de inversión."
        }
      },
      "progreso": true
    },
    {
      "id": "p47",
      "layout": "L08",
      "titulo": "Retro de portafolio",
      "unidad": "Unidad 5",
      "capsula": "Arma tu portafolio",
      "kicker": "Unidad 5 · Pieza insignia Portafolio",
      "media": {
        "tipo": "avatar",
        "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-6.webp",
        "audio": "../public/audio/loc1_objetivos.mp3",
        "transcripcion": "La retroalimentación del portafolio debe educar, no recomendar. El estudiante aprende a revisar coherencia entre perfil y asignación. En inversiones reales se requiere información adicional, costos, horizonte, asesoría y reglas aplicables."
      },
      "resultado": {
        "variable": "perfil_riesgo",
        "reglas": [
          {
            "valor": "conservador",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil conservador",
              "texto": "Cuida concentración y liquidez. Ninguna retroalimentación equivale a una recomendación de inversión."
            }
          },
          {
            "valor": "moderado",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil moderado",
              "texto": "Busca equilibrio y diversificación. Ninguna retroalimentación equivale a una recomendación de inversión."
            }
          },
          {
            "valor": "agresivo",
            "retro": {
              "tipo": "nota",
              "titulo": "Perfil agresivo",
              "texto": "Tolera más volatilidad, pero no ignora concentración. Ninguna retroalimentación equivale a una recomendación de inversión."
            }
          }
        ],
        "retro": {
          "tipo": "nota",
          "titulo": "Arma tu portafolio",
          "texto": "Vuelve a la pantalla anterior y reparte tu capital para ver la retroalimentación aquí."
        }
      },
      "progreso": true
    }
  ]
};
