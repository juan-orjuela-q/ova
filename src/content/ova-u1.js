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
   - **`c2-comprobacion` / `c4-comprobacion`** — L07 · I01 con
     enunciado y opciones marcados como provisionales de forma
     visible (no una pregunta inventada que parezca real): Jose
     todavía no entregó el enunciado real de estas dos comprobaciones.
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
   - **I10/I11**: entradas/salidas y sus `unidad` con el criterio de
     `quiz.js` ("unidad" es sufijo con espacio inicial: `" COP"`,
     `" %"`, `" acciones"`).
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
            }
          }
        }
      },
      "progreso": true
    },
    {
      "id": "p10-tutor",
      "layout": "L03",
      "titulo": "Pendiente de guion",
      "unidad": "Unidad 1",
      "capsula": "Apertura",
      "kicker": "Unidad 1 · Apertura",
      "media": {
        "tipo": "video",
        "src": "../public/videos/tutor/p10-tutor-pendiente.mp4"
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
          "texto": "Contexto del mercado"
        },
        {
          "titulo": "Cápsula 2",
          "texto": "Valorización en acciones"
        },
        {
          "titulo": "Cápsula 3",
          "texto": "El dividendo"
        },
        {
          "titulo": "Cápsula 4",
          "texto": "El perfil de riesgo"
        }
      ],
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
        "Video pendiente de producción (Jonás). Guion, cuerpo y transcripción pendientes de Jose (DI) — ver PLAN-ESTRUCTURA.md §6."
      ],
      "media": {
        "tipo": "video",
        "src": "../public/videos/capsulas/c1-contexto-mercado.mp4"
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
        "src": "../public/videos/capsulas/c2-valorizacion-acciones.mp4"
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
          "enunciado": "Contenido provisional — enunciado pendiente de Jose (DI). Este marcador se reemplaza cuando llegue el guion real.",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "Opción provisional A" },
            { "id": "b", "texto": "Opción provisional B" },
            { "id": "c", "texto": "Opción provisional C" }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Contenido provisional.",
            "incorrecto": "Contenido provisional."
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
        "src": "../public/videos/capsulas/c3-dividendo.mp4"
      },
      "progreso": true
    },
    {
      "id": "p24",
      "layout": "L06",
      "titulo": "Calcula el dividendo por acción",
      "unidad": "Unidad 1",
      "capsula": "Cápsula 3",
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
        "src": "../public/videos/capsulas/c4-perfil-riesgo.mp4"
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
          "enunciado": "Contenido provisional — enunciado pendiente de Jose (DI). Este marcador se reemplaza cuando llegue el guion real.",
          "intentos": 2,
          "opciones": [
            { "id": "a", "texto": "Opción provisional A" },
            { "id": "b", "texto": "Opción provisional B" },
            { "id": "c", "texto": "Opción provisional C" }
          ],
          "correcta": "a",
          "retroalimentacion": {
            "correcto": "Contenido provisional.",
            "incorrecto": "Contenido provisional."
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
      "kicker": "Unidad 1 · Simulador",
      "interaccion": {
        "tipo": "I11",
        "datos": {
          "id": "u1-p42-boleta-orden",
          "enunciado": "Una orden a mercado se ejecuta al mejor precio disponible; una orden límite fija el precio máximo de compra (o mínimo de venta) y puede quedar expuesta si el mercado no lo alcanza. Completa la boleta y observa el resultado: ejecutada o expuesta.",
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
    }
  ]
};
