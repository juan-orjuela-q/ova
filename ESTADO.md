# Estado del proyecto

Lee este archivo al empezar cualquier sesión. `PLAN.md` dice qué hay que hacer;
este dice qué está hecho y qué se decidió por el camino.

Actualízalo al cerrar cada sesión: una línea por tarea y las decisiones que
cambien algo para el futuro. Si una decisión cambia una **regla**, va a
`CLAUDE.md` en vez de aquí.

---

## Tareas

- [x] **T1 · Andamiaje y sistema visual** — completada 27 ago
- [x] **T1.5 · Refinamiento visual, movimiento y navegación en maqueta** — completada 28 ago
- [x] **T2 · Motor** — completada 28 ago
- [x] **T3 · Chrome del OVA** — completada 28 ago
- [x] **T4 · Reproductor de media** — completada 29 ago
- [x] **T5 · Componentes de contenido** — completada 29 ago
- [x] **T6 · Motor de evaluación** — completada 29 ago
- [x] **T7 · Datos y gráficos** — completada 29 ago
- [x] **T8 · Interacciones insignia** — completada 29 ago (I10/I11 el mismo día, I09/I12 después)
- [x] **T9 · Empaquetado y auditoría** — completada 29 ago. Empaquetado y
      auditoría WCAG verificados, y el paquete SCORM carga y funciona en el
      Moodle de Pablo.

**El track del OVA está cerrado, cinco días antes de lo planeado.** Lo que sigue
ya no es código: es contenido real, producción audiovisual, las capas de Moodle
que lleva Pablo, los descargables y los documentos de la propuesta. Ver la
sección siguiente.

---

## Tareas de contenido (C0–C9)

Ver `PLAN-CONTENIDO.md` — es el plan vigente sobre el que corren estas tareas.

- [x] **C0 · Renumerar los catálogos al brief** — completada 4 sep
- [x] **C1 · Layouts que faltan** — completada 4 sep
- [x] **C2 · Caja 16:9 y navegación pegada** — completada 4 sep
- [x] **C3 · Media: avatar y audio** — completada 4 sep
- [x] **C4 · Estado compartido** — completada 4 sep, rama `c4-estado-compartido`
- [x] **C5 · Interacciones nuevas** — completada 4 sep, rama `c5-interacciones-nuevas`
- [x] **C6 · Interacciones ampliadas** — completada 4 sep, rama `c6-interacciones-ampliadas`
- [x] **C7 · Conversión del storyboard a contenido** — completada 4 sep,
      rama `c7-conversion-storyboard`
- [ ] C8 · Descargables y recursos
- [ ] C9 · Empaquetado, auditoría y Moodle

---

## Decisiones tomadas

**27 ago — Catálogo de componentes atómicos/moleculares (T1.5, parte 1 de 2).**
Antes de pulir L02–L13 hacía falta construir las piezas: no había nada real
que aplicar, solo texto plano y cajas `.ks-marcador`. Se agregó a
`components.css` la matriz de botón (`.boton--blanco/--naranja/--outline/--grande`,
combinables; `.boton--naranja` sin `.boton--grande` cae al relleno negro por
defecto — ver la regla nueva en `CLAUDE.md`), `.eyebrow` (píldora, variantes
`--subtle/--outline/--inverse`), `.numero-indice` + `.regla` (badges estilo
grid suizo, tomado de una referencia de Behance), `.tarjeta`, `.anillo` (cifra
en anillo, decorativo — el motor de gráficos real es T7), y las moléculas de
navegación/media en maqueta: `.nav-migas`, `.nav-barra`, `.nav-inferior`,
`.nav-drawer`, `.media-audio`, `.media-video-*`, `.linea-tiempo`. Todo
documentado en la nueva sección "Componentes" de la kitchen sink, verificado
con Playwright: 320 px sin scroll horizontal, zoom de texto 200 % (encontró y
corrigió un bug real: el anillo de cifra tenía tamaño fijo en px mientras el
número crecía en rem — ahora el SVG también está en rem), recorrido de
teclado por los 25 elementos focusables nuevos, cero hex nuevo.

**No se tocó `tokens.css` ni la disposición de L02–L13.** Decisión de alcance
tomada con el usuario: T1.5 ya traía tres cosas (pulir layouts, movimiento,
chrome de navegación) y sumar un sistema de componentes nuevo antes de
aplicarlo era más de lo presupuestado. Se dividió: esta sesión deja el
catálogo listo y validado; aplicarlo a L02–L13 (punto 1 de T1.5) y el
movimiento sobre esos layouts (punto 2) quedan para la siguiente sesión. El
punto 3 de T1.5 (chrome de navegación en maqueta) queda resuelto con esta
misma sesión, porque las piezas que pidió el usuario (migas, barras, drawer)
son ese punto.


**27 ago — Tokens de movimiento.** Se añadió el bloque de Movimiento a
`tokens.css` y la sección correspondiente a `CLAUDE.md`. Inventario cerrado de
siete cosas que se animan. Los valores son revisables una sola vez, en T1.5;
después son ley.

**27 ago — L01 rediseñado y escalón tipográfico fuera de tokens.css.** L01
pasó de portada centrada sin media a portada a pantalla completa: panel de
texto (naranja, 65%) y panel de media (45%) traslapados 10%, con
`union_graf_nuam.svg` / `_mobile.svg` (en `public/graf/`, todavía sin mover a
`src/assets/` como documenta `CLAUDE.md`) dibujado encima de la costura. Se
agregaron `.tipo-portada-titulo` y `.tipo-portada-cuerpo` en `base.css`
(72px/24px aprox.) porque T1.5 prohíbe tocar `tokens.css` esta sesión — son
un escalón de tipografía fuera del sistema de tokens, pendiente de
reconciliar la próxima vez que se revise la escala completa. También se quitó
el `max-width: 75rem` de `.layout` (afecta los 13 layouts): ahora van de lado
a lado de la pantalla: la lectura la sigue acotando el `max-width` propio de
cada `.layout__cuerpo`, no el contenedor. Verificado con Playwright headless:
reflow a 320px sin scroll horizontal, zoom de texto a 200% sin que el
gráfico tape el título/cuerpo (el límite de ancho del texto en desktop usa
`min(rem, %)` — el `%` es lo que de verdad protege bajo zoom, porque la
posición del gráfico está en vh/vw y no crece con la fuente).

---

**28 ago — Ajustes de componentes: escala tipográfica, eyebrow y anillo.**
Tres cambios pedidos sobre lo construido el día anterior:

- **Escala tipográfica de escritorio, sí se tocó `tokens.css`.** La nota de
  T1.5 de "no tocar tokens.css" era del alcance de esa sesión (ajuste
  espacial de layouts); esto es una instrucción directa y explícita del
  usuario, así que tiene prioridad. Cuerpo a 18px desde 48em (antes 16px en
  todos los anchos), con toda la escala recalculada en consecuencia para
  no invertir la jerarquía (el detalle completo queda comentado en
  `tokens.css`, junto al bloque `@media (min-width: 48em)`). Piso duro de
  14px: a diferencia del cuerpo, esto se aplicó también en móvil —label y
  caption estaban en 12px/13px ahí, quedaron en 14px en todos los anchos—.
  `--text-button` (19px/600) queda fuera a propósito: no es un peldaño de
  la escala tipográfica, es el mínimo de contraste del botón naranja que
  exige `CLAUDE.md`, y tocarlo desalinearía ese número del texto de la
  regla.
- **Eyebrow sin pill.** `.eyebrow--subtle` ya no lleva fondo ni
  `border-radius`; `.eyebrow--outline` cambió de caja con borde a un
  subrayado —se seguía leyendo como botón chico incluso sin el matiz de
  color naranja pequeño. `--inverse` no cambió (ya no tenía fondo propio).
- **Anillo de cifra más grande y con más aire interior.** El SVG pasó de
  7.5rem a 10rem y el trazo se adelgazó de 12 a 10 (mismo radio 52, mismo
  viewBox). El número y el signo de porcentaje ya no comparten una sola
  clase de tipografía: `.anillo__numero` (display-2) y `.anillo__signo`
  (h4, más chico y en secundario) son dos elementos separados en el
  markup.

**28 ago — Sistema de movimiento sobre los layouts (T1.5, punto 2 de 3).**
Los tokens de movimiento ya existían (decisión del 27 ago); esta sesión los
aplicó. Dos cosas, las mismas del inventario de siete de `CLAUDE.md`:

- **Entrada de contenido escalonada**, en `layouts.css`. Un solo
  `@keyframes layout-entrada` (opacity + `translateY(--shift-sm)`, nunca
  width/height/top/left) aplicado a las seis clases reutilizables del
  catálogo (`.layout__kicker/titulo/cuerpo/media/figura/interaccion`), no
  layout por layout: como las trece variantes ya comparten esos nombres
  (documentado en el header de `layouts.css`), una sola regla cubre L01–L13
  sin duplicar nada. El escalón seguido es el de lectura (kicker → título →
  cuerpo → media/figura → interacción) y no el orden del DOM —en L12
  `.layout__figura` va primero en el markup pero entra en el mismo tercio
  que `.layout__media`—, porque es la jerarquía visual la que importa. No se
  duplicó el media query de `prefers-reduced-motion`: como `--dur-base` y
  `--shift-sm` ya colapsan en `tokens.css`, la animación hereda ese
  comportamiento sola.
- **Micro-interacciones de controles**, en `base.css`/`components.css`. Los
  botones y el CC del video ya tenían transición de un ajuste anterior; esta
  sesión le sumó `--dur-fast` a lo que le faltaba: enlace genérico (`a`,
  `base.css`), migas de pan, ítem del drawer, disclosure de transcripción, y
  play/velocidad/pantalla-completa/CC del chrome de video (estos tres
  últimos no tenían ningún estado de hover, se les agregó `opacity: 0.7` en
  vez de inventar un color nuevo).

Verificado con Playwright: emulando `prefers-reduced-motion: reduce`, la
duración de la animación cae al mínimo del navegador y `--shift-sm` mide
`0px` (sin desplazamiento, la opacidad sigue cambiando); sin emular, el
escalón real es `--stagger` × posición (kicker 0ms, cuerpo 90ms, confirmado
por cómputo); 320px y zoom de texto 200% sin scroll horizontal; los cinco
controles nuevos con `--dur-fast` (120ms) confirmado en `transition-duration`
computado. Cero hex nuevo en los cuatro archivos tocados. Se agregó una
sección "Movimiento" a la kitchen sink (documental, sin marcado nuevo que
mostrar: la entrada se ve al recargar la página y el hover se prueba sobre
los controles que ya existen en "Componentes").

**28 ago — T1.5 cerrada, con el punto 1 incompleto por decisión del usuario.**
De los tres puntos del alcance en `PLAN.md`, el 2 (movimiento) y el 3 (chrome
en maqueta) están hechos y verificados. El punto 1 —pulir los trece layouts
con una crítica de diseño previa— solo se hizo para L01 (27 ago); L02–L13
siguen siendo el andamiaje estructural de T1 con relleno, sin pasar por esa
crítica ni por el catálogo de componentes (botón, eyebrow, tarjeta, etc.). El
usuario pidió cerrar T1 y T1.5 igual: T1.5 ya se había pasado del día
presupuestado en `PLAN.md`, y el catálogo de componentes queda listo y
validado en la kitchen sink para aplicarse layout por layout a medida que
cada uno se use de verdad, en vez de como una pasada de pulido aparte. Si
algún layout necesita esa crítica antes de T5, hay que pedirla explícitamente
— no va a pasar sola.

**28 ago — T2 cerrada: motor de navegación, con un cambio de arquitectura no
negociable descubierto en el camino.**

Antes de escribir código se probó con Playwright (Chromium) si un `<script
type="module">`, un `fetch()` y un `XMLHttpRequest` podían cargar un archivo
local bajo `file://`. Los tres fallan por CORS ("URL scheme 'file' is not
supported" / bloqueo de módulos entre orígenes) — un `<script src>` clásico sí
funciona. Esto choca de frente con dos cosas que CLAUDE.md daba por sentadas:
la convención de "JavaScript en módulos ES nativos" y que
`content/ova-u1.json` se cargara por red. Como la regla dura 4 (abrir desde
`file://` sin servidor) no se negocia y la convención de módulos sí es
convención, se resolvió a favor de la regla dura:

- **Los cinco archivos de T2 son scripts clásicos**, no módulos: cada uno es
  un IIFE que cuelga su API en `window.OVA.<nombre>` (`OVA.router`,
  `OVA.state`, `OVA.storage`, `OVA.scorm`, `OVA.a11y`), cargados en
  `index.html` en orden de dependencia. `CLAUDE.md` ya quedó actualizado con
  esta convención — no es una excepción de esta sesión, es la regla desde
  ahora para T3 en adelante también.
- **El contenido se renombró a `content/ova-u1.js`.** Envuelve el mismo JSON
  del contrato en `window.OVA_CONTENIDO = { … };` y se carga con
  `<script src>`. El contenido sigue siendo JSON puro adentro; Jose sigue sin
  tocar código. `CLAUDE.md` documenta el porqué en la sección del contrato de
  contenido.

**Qué se construyó, con ese punto de partida:**

- `storage.js` — `obtener`/`establecer` namespaced por `contenidoId`
  (`ova:<id>:<clave>`), con caída silenciosa a un objeto en memoria si
  `localStorage` no está disponible.
- `scorm.js` — descubre `window.API` subiendo por `window.parent` hasta 10
  niveles, capturando `SecurityError`; fuera de Moodle, `disponible()` es
  `false` y cada método es un no-op silencioso. Reporta
  `cmi.core.lesson_location` y `cmi.core.lesson_status` en cada navegación
  cuando sí hay LMS.
- `state.js` — dueño de índice actual, pantallas visitadas y el snapshot de
  solo lectura (`instantanea()`); persiste por `storage.js`/`scorm.js` en cada
  `ir()` y notifica a suscriptores. No sabe de URL ni de DOM.
- `a11y.js` — región `#anuncios` (`aria-live="polite"`, ya en `index.html`) y
  `enfocarEncabezado()`, que agrega `tabindex="-1"` si hace falta y mueve el
  foco.
- `router.js` — enrutamiento por **hash** (`#s01`…), no `pushState`: el hash
  sobrevive un F5 sin ayuda de JS y no depende de que nadie resuelva rutas en
  el servidor. Registro `PLANTILLAS` por código de layout (JSON → DOM con
  `createElement`/`textContent`, nunca `innerHTML`); esta sesión solo
  implementa **L02, L05, L06 y L11** —los que usa el JSON de prueba—. Cualquier
  otro código de layout, exista o no en el catálogo L01–L13, cae por la misma
  rama de fallo ruidoso (`console.error` + estado de error visible en `#app`,
  nunca un render a medias): T3+ agrega su entrada a `PLANTILLAS` según lo
  vaya necesitando. En la carga inicial no se roba el foco (el usuario no ha
  interactuado todavía); en cada navegación posterior sí se mueve el foco al
  `<h2 class="layout__titulo">` de la pantalla nueva y se anuncia por
  `aria-live`. La transición entre pantallas (ítem 1 del inventario de
  movimiento, `--dur-slow`) es una clase nueva `.layout--transicion` en
  `layouts.css`, separada de la entrada de contenido por elemento que ya
  existía (ítem 2): la kitchen sink muestra los trece layouts a la vez sin
  navegar, así que la transición de pantalla no le aplica y no se le agregó
  ahí.
- `app.js` — valida la forma mínima del contenido (`id`, `titulo`,
  `pantallas[]` con `id`/`layout`/`titulo`) antes de arrancar el router; si
  falla, `console.error` + un estado de error visible en `#app`, igual que el
  fallo por layout desconocido.
- **Nav inferior real**, en `index.html`: se reutilizó el componente
  `.nav-inferior` que T1.5 dejó como maqueta sin cablear (botones Anterior /
  Siguiente + "Pantalla X de Y") y se cableó por primera vez. No es el chrome
  completo de T3 (sin barra superior, sin drawer, sin skip link) — es lo
  mínimo que T2 necesita para poder recorrer las cuatro pantallas del cierre.
  Se agregó `.boton:disabled` a `components.css` (opacidad + `pointer-events:
  none`, sin color nuevo) porque no existía y Anterior/Siguiente lo necesitan
  en los extremos.
- JSON de prueba (`content/ova-u1.js`): cuatro pantallas de relleno BVC en
  L02, L05, L06, L11 — los cuatro layouts de texto puro que ya existían, sin
  media ni interacción (eso es T4/T6).

**Verificado con Playwright, abriendo `src/index.html` directo por
`file://` (doble clic, no servido):** las cuatro pantallas se recorren con
clic y con teclado (Tab hasta "Siguiente", Enter); foco salta al `<h2>` de
cada pantalla nueva salvo la primera; `aria-live` anuncia cada cambio;
Anterior/Siguiente se deshabilitan en los extremos; recargar a mitad de la
unidad conserva la pantalla (hash) y una visita fresca sin hash retoma desde
`localStorage` en vez de reiniciar en s01; 320px sin scroll horizontal y zoom
de texto 200% en las cuatro pantallas; `prefers-reduced-motion` colapsa la
duración de `.layout--transicion`; cero errores de consola en toda la corrida.
Cero hex nuevo en los archivos tocados.

**Kitchen sink:** T2 no es un componente visual, así que no se le fabricó una
demo estática que falsearía lo que hace. Se agregó una sección "Motor" que
explica esto, linkea a `src/index.html` como superficie de revisión real, y
documenta la nota de arquitectura de scripts clásicos / `.js` en vez de
`.json`.

**28 ago — T3 cerrada: chrome del OVA, con dos lecturas del alcance que
requirieron una decisión propia (no hubo usuario a mano para preguntar) y
una corrección de arquitectura en `state.js`/`router.js` que salió de
construir el skip link.**

**Qué se construyó:**

- **Skip link** (`base.css` `.u-skip-link`, primer elemento del `<body>` en
  `index.html`) — fuera de pantalla hasta foco, salta a `<main id="app"
  tabindex="-1">`. Cambio de posición discreto en `:focus` (sin
  `transition`), no una animación — no compite con el inventario de
  movimiento.
- **Barra superior** (`<header class="nav-barra">`, landmark banner
  implícito): botón del drawer, título de la pantalla activa, barra de
  progreso, botón de reanudar (condicional) e indicador de guardado. Todo
  el texto lo llena `router.js` en cada navegación, en las funciones nuevas
  `actualizarBarraSuperior`/`actualizarProgreso`/`actualizarGuardado`/
  `actualizarReanudar`.
- **Barra de progreso — decisión de arquitectura no trivial.** La maqueta
  de T1.5 usaba un `<progress>` nativo con `accent-color`. El ítem 4 del
  inventario de movimiento de `CLAUDE.md` exige animar su avance con
  `--dur-slow`, y la regla de movimiento prohíbe animar `width` (solo
  `transform`/`opacity`) — un `<progress>` nativo no expone su relleno para
  transicionarlo así entre navegadores. Se reemplazó por un `div` con
  `role="progressbar"` (`.barra-progreso` + `.barra-progreso__relleno` en
  `components.css`), mismo nivel de accesibilidad
  (`aria-valuemin/max/now/text`), avance real animado con
  `transform: scaleX()`. El track usa `--surface-subtle-2` (gris 100), no
  `--surface-muted` (gris 200): CLAUDE.md prohíbe naranja de relleno sobre
  superficies del gris 200 al 600, y el relleno de esta barra es naranja.
- **Indicador de guardado, honesto.** `storage.js` ahora expone
  `disponible()` (ya existía internamente como `verificarDisponibilidad`).
  El indicador muestra "Guardado"/`cloud_done` solo si `localStorage`
  funciona de verdad; si cae a memoria, dice "No se pudo guardar en este
  dispositivo"/`cloud_off` — ícono y texto cambian juntos, nunca solo
  color.
- **Botón de reanudar — interpretación propia del alcance.** `PLAN.md`
  solo dice "botón de reanudar" sin detallar el comportamiento. Se
  interpretó como red de seguridad para cuando el estudiante usa el
  drawer o "Anterior" para revisar una pantalla ya vista: aparece
  (`hidden` se quita) solo si la posición actual quedó detrás de la más
  avanzada, y lleva de vuelta a esa frontera. `state.js` expone
  `masAvanzada` en `instantanea()` (el índice máximo entre las pantallas
  visitadas) para que `router.js` decida. Si la intención real era otra
  (p. ej. un aviso de bienvenida al recargar tipo "retomaste en X"),
  hay que decirlo explícitamente — esta lectura quedó documentada
  precisamente para poder corregirla sin arqueología de código.
- **Drawer de índice**, con foco atrapado a propósito. Nuevo en
  `a11y.js`: `elementosFocalizables()` y `ciclarFocoEn()`, generales (no
  atadas al drawer) para que T5 las reuse en el modal sin duplicar la
  lógica. `router.js` los cablea: abrir mueve el foco a "Cerrar" y
  registra un listener de `keydown` que cicla Tab dentro del drawer y
  cierra con Escape; cerrar (Escape, backdrop o "Cerrar") devuelve el
  foco al botón que abrió el drawer; elegir una pantalla de la lista
  cierra el drawer pero **no** devuelve el foco ahí — lo toma
  `enfocarEncabezado()` de la pantalla nueva, sería un salto doble.
  Estados de pantalla en la lista (completada/actual/pendiente) con
  ícono y texto, nunca solo color; no hay estado "bloqueado" — eso es
  entre unidades y lo resuelve Moodle (fuera de alcance de CLAUDE.md),
  dentro de una unidad toda pantalla es libremente alcanzable.
  `.nav-drawer` es la cáscara visual compartida con la demo estática de
  la kitchen sink; `.nav-drawer--flotante` (solo en `index.html`) la
  superpone en `position: fixed` sin arrastrar eso a la demo.
- **Corrección de arquitectura, motivada por el skip link.** El router es
  por hash: un `<a href="#app">` (el skip link) cambia
  `window.location.hash` a "app", que no es id de ninguna pantalla. Sin
  arreglo, esto producía dos problemas reales, no hipotéticos: (1)
  `alCambiarHash()` llamaba a `navegarA('app', …)`, que hacía
  `console.error` por una pantalla inexistente — un error de consola por
  usar un control de accesibilidad legítimo; (2) recargar la página
  después de usar el skip link dejaba `#app` en la URL, y
  `state.js.init()` lo tomaba como `idInicial` válido-pero-inexistente,
  perdiendo el progreso guardado y reiniciando en la primera pantalla —
  esto sí rompe el cierre de T2 ("el progreso persiste al recargar").
  Arreglado en dos puntos: `state.js` expone `existe(id)`, y
  `alCambiarHash()` ahora ignora en silencio cualquier hash que no sea id
  de pantalla en vez de tratarlo como ruta inválida; `state.js.init()`
  cae al `guardado.actual` cuando el `idInicial` recibido no existe,
  en vez de rendirse directo a la pantalla 0.

**Verificado con Playwright, abriendo `src/index.html` por `file://`:**
recorrido completo con Tab desde el skip link hasta "Siguiente" en la
barra inferior sin nada inalcanzable; drawer abre con foco en "Cerrar",
Tab/Shift+Tab ciclan solo dentro de él sin escapar al fondo, Escape lo
cierra y devuelve el foco al botón que lo abrió; elegir una pantalla de
la lista cierra el drawer y deja el foco en el `<h2>` de la pantalla
nueva; la barra de progreso (`aria-valuenow`/`aria-valuetext` y el
`transform: scaleX()` computado) avanza en cada navegación; "Reanudar"
aparece solo al volver a una pantalla anterior a la más avanzada y lleva
de vuelta a esa frontera; recargar a mitad de la unidad después de haber
usado el skip link retoma el progreso guardado, no la primera pantalla;
320px sin scroll horizontal; cero errores de consola en toda la corrida.
Cero hex nuevo en los archivos tocados.

**Bug real encontrado en la primera pasada de Playwright, no hipotético:**
`hidden` no ocultaba nada. `.nav-drawer` y `.boton` fijan `display` sin
condición (`display: flex`/`inline-flex`), y un selector de atributo
(`[hidden]`, el que trae el navegador por defecto) tiene la misma
especificidad que un selector de clase — sin una regla propia, gana el
orden de aparición en el archivo, no la intención. El drawer y
"Reanudar" quedaban visibles y clicables (tapando literalmente
"Siguiente" en pantalla) aunque `hidden` estuviera puesto y
`aria-expanded`/`aria-current` cambiaran bien — el bug era solo de CSS,
la lógica de `router.js` estaba correcta desde el principio. Arreglado
con una regla nueva en `base.css`, justo después del reset de
`box-sizing`: `[hidden] { display: none !important; }` — el único
`!important` del proyecto, deliberado, porque es exactamente el caso
para el que existe. Segunda pasada de Playwright con clics reales (no
`.click()` programático) tras el arreglo: los diez puntos de la lista
de verificación de más abajo pasan, incluidos los cuatro que fallaban
antes (drawer/"Reanudar" ya no quedan visibles ni clicables por encima
del contenido con `hidden` puesto). Sin regresiones en lo que ya pasaba
antes del arreglo.

**Kitchen sink:** secciones "Componentes" actualizadas (barra superior,
barra inferior y drawer ya no son "maqueta, sin cablear"; nuevo botón de
solo ícono y barra de progreso) y nueva sección "Chrome del OVA (T3)" que
documenta qué se ve aquí en estático y qué solo puede probarse en
`src/index.html` (mismo criterio que la sección "Motor" de T2: no
falsear con JS aparte lo que depende del router real). El skip link de
la propia kitchen sink sí es una demo viva y funcional —esa página no
tiene router con hash propio, así que no choca con nada.

**29 ago — T4 cerrada: reproductor de video real, sobre lo que T1.5 había
dejado como maqueta, con un bug de arquitectura real encontrado (y resuelto)
por Playwright antes de dar la tarea por cerrada.**

**Qué se construyó:**

- **`src/js/media.js`** (nuevo) — `window.OVA.media.crear(datos)` construye
  un `<video>` sin el atributo `controls` nativo: cada control es un
  elemento HTML real (`button`, `input[type="range"]`, `details`/`summary`,
  `a[download]`), así que la operación por teclado la da el navegador, no
  un manejador de tecla escrito a mano. El scrubber es un
  `input[type="range"]` con `accent-color`, no un slider ARIA armado a
  mano — mismo razonamiento: Home/Fin/RePág/AvPág/flechas y el rol de
  slider vienen gratis, reimplementarlos es la pieza que se rompe en
  silencio. "Un solo reproductor activo a la vez" (PLAN.md) es un registro
  de instancias a nivel de módulo: cualquier `play` pausa cualquier otro
  `<video>` que este archivo haya creado en la página, sin importar cuántas
  instancias haya montadas (la kitchen sink monta cuatro a la vez y las
  cuatro comparten el registro).
- **Botón de pantalla completa condicional.** Se construye solo si
  `document.fullscreenEnabled` es `true`; si el OVA queda embebido en un
  iframe sin permiso de fullscreen, el botón directamente no aparece —
  mismo criterio que el indicador de guardado de T3 (nunca un control que
  siempre va a fallar al pulsarlo).
- **Botón de CC condicional.** Se construye solo si la pantalla trae `vtt`;
  sin subtítulos, no hay botón que no haga nada.
- **Transcripción visible y descargable.** `<details>`/`<summary>` nativo
  con los párrafos reales en el DOM, más un `<a download>` cuyo `href` es
  un `Blob` de ese mismo texto (sin red, funciona bajo `file://`).
- **`router.js`**: `PLANTILLAS.L03` y `PLANTILLAS.L04` (los dos únicos
  layouts con columna de media), más una `crearMedia()` compartida que
  delega en `OVA.media.crear` y falla ruidoso si la pantalla no trae
  `media` o si `media.tipo` no es `"video"` — `montarPantalla()` ahora
  envuelve la llamada a la plantilla en `try/catch` y cualquier error
  cae por `fallarPantalla()`, el mismo estado visible de siempre. Antes de
  T4 ninguna plantilla podía fallar en tiempo real (L02/L05/L06/L11 son
  puro texto); L03/L04 sí, porque dependen de que el contenido traiga
  `media` bien formado.
- **`content/ova-u1.js`**: dos pantallas nuevas, `s05` (L03) y `s06` (L04),
  con `media` real — para que T4 se verifique de punta a punta en
  `src/index.html`, no solo en la kitchen sink.
- **CSS (`components.css`)**: `.media-video` se reescribió sobre la misma
  familia de clases que T1.5 dejó como maqueta (`.media-video__play`,
  `__cc`, `__velocidad`, `__pantalla-completa` se mantienen; `__marcador`
  y `__scrubber__relleno` desaparecen, reemplazados por
  `.media-video__lienzo`/`__elemento` y el `input[range]` real).
  **Deliberadamente sin `max-width` propio**: PLAN.md pide "caja
  aspect-ratio 16/9 de ancho fluido" — el ancho lo decide quien monta el
  componente (`.layout__media` en L03/L04; en la kitchen sink, una clase
  de demo `.ks-media-marco` nueva, ajena al componente).

**Bug real encontrado con Playwright, no hipotético — y su arreglo:**
`<track src="archivo.vtt">` apuntando a un archivo `.vtt` real falla bajo
`file://` en Chromium ("Unsafe attempt to load URL... 'file:' URLs are
treated as unique security origins"), incluso para un archivo hermano en
la misma carpeta — cada documento `file://` es su propio origen único.
`track.cues.length` se quedaba en 0: los subtítulos nunca se dibujaban,
aunque el botón CC siguiera alternando `aria-pressed` de forma cosmética.
Es exactamente el mismo problema que ya forzó a que el contenido general
se cargue como `.js` y no `.json` + `fetch` (T2) — mismo arreglo: el
contrato de contenido cambió `media.vtt` de "ruta a un archivo" a "texto
WebVTT completo" (igual que `media.transcripcion` ya no era una ruta),
y `media.js` arma el `<track>` con un `Blob` de ese texto en vez de un
`src` a archivo. `public/videos/demo-cc.vtt` se eliminó (quedaba muerto y
engañoso: sugería una ruta que ya no se usa). Reverificado con Playwright
tras el arreglo: cero errores de consola, `track.cues.length === 3` y
`mode === "showing"` tanto en la kitchen sink como en `src/index.html`.

**Verificado con Playwright, abriendo ambas páginas por `file://`:**
recorrido de teclado completo en una instancia real de la kitchen sink
(play → scrubber → velocidad → CC → pantalla completa → transcripción),
foco visible en cada parada; Enter/Espacio alterna play/pausa; flechas en
el scrubber (foco) cambian `currentTime`; Enter en CC alterna
`aria-pressed` y `track.mode` juntos; Enter en velocidad cambia el texto
visible, el `aria-label` y `playbackRate` juntos (nunca un cambio sin el
otro — regla dura de `CLAUDE.md`); el enlace de descarga es un `<a>`
tabulable con `href` `blob:` y `download="transcripcion.txt"`. Reproducir
una segunda instancia pausa la primera (estado real de `video.paused`, no
solo visual). El botón CC no existe en absoluto en la instancia sin
`vtt` (omitido, no deshabilitado). 320px sin scroll horizontal; zoom de
texto 200% sin romper los controles; `prefers-reduced-motion` colapsa la
transición de `.media-video__play` al valor reducido de `--dur-fast`.
`.media-video__lienzo` mide 16:9 real y `.media-video` no fuerza un ancho
fijo — en la ranura ancha de L04 ocupa el contenedor completo. Fullscreen
se degrada correctamente dentro de un iframe sin permiso (el botón no se
construye) y aparece cuando el iframe sí lo permite. En `src/index.html`,
recorrer hasta s05/s06 con "Siguiente" monta un reproductor real cada vez
y no deja ningún `<video>` huérfano reproduciendo tras navegar; cero
errores de consola en toda la corrida. Cero hex nuevo en los archivos
tocados.

**Kitchen sink:** el bloque "Chrome de video (maqueta)" de T1.5 pasó a
"Reproductor de video (T4, cableado real)" — a diferencia de "Motor" y
"Chrome del OVA", esta pieza no depende del router con hash, así que sí
puede montarse viva en la página (dos instancias reales via
`OVA.media.crear()`, una con subtítulos y otra sin —para probar que el
botón CC se omite—, más las dos instancias dentro de L03/L04 en la
sección de layouts). Es el primer `<script>` real que corre en
`dev/kitchen-sink.html`.

**29 ago — T5 cerrada: nueve componentes de contenido, con un atómo
transversal generalizado y dos bugs reales encontrados por Playwright antes
de dar la tarea por cerrada.**

**Qué se construyó, todo en `components.css`:**

- **Chip** — etiqueta de metadato/filtro. Mismo candado de contraste que ya
  resolvió el botón naranja pequeño y el eyebrow (CLAUDE.md nombra al chip
  explícitamente en esa regla): `.chip--brand` es borde + naranja-700 sobre
  fondo neutro, nunca relleno naranja-500. Estado seleccionado
  (`aria-pressed`, cuando el chip es un `<button>`) usa relleno inverso, con
  un ícono de check además del color.
- **Callout** — caja de énfasis con tres tipos (nota, importante, alerta).
  El tipo nunca se distingue solo por el borde de color: el ícono cambia y
  el título lo dice en palabras. Íconos en naranja-500/rojo-500 (fills e
  iconos, permitido por tokens.css), títulos en naranja-700/rojo-700 (texto
  sobre claro).
- **Acordeón** — `<details>`/`<summary>` nativo, mismo criterio que la
  transcripción de audio/video de T4: Enter/Espacio gratis del navegador.
  Chevron propio que rota con `transform` en `--dur-fast`, marcador nativo
  removido.
- **Modal + término de glosario** — la única pieza de T5 cableada de verdad
  (no maqueta), porque el cierre de PLAN.md lo exige explícitamente: "el
  modal devuelve el foco al elemento que lo abrió". Mismo patrón que
  `abrirDrawer`/`cerrarDrawer` de T3 (`role="dialog"` + `aria-modal`,
  ciclado con `OVA.a11y.ciclarFocoEn`, Escape/backdrop/«Cerrar» como las
  tres salidas), cableado en un script propio al final de la kitchen sink
  — el modal no vive en router.js porque no es parte fija del chrome,
  cualquier pantalla que lo necesite (T6/T8) debe copiar este mismo patrón,
  no inventar uno nuevo. El disparador es `.termino-glosario`, un
  `<button>` (no `<a>`: no navega, abre una superposición) incrustado en
  texto de cuerpo real.
- **Tarjeta de recurso descargable** — maqueta sin cablear, mismo criterio
  que `.media-audio` de T1.5: el archivo real lo trae el contenido de Jose
  en T8, no esta tarea.
- **Insignia** — dos estados (bloqueada/desbloqueada) y el modificador
  `.insignia--revelando`, que dispara la animación de `--dur-reveal` (ítem
  5 del inventario de movimiento, el único momento celebratorio). Se le
  agregó un botón de demo real en la kitchen sink ("Simular desbloqueo")
  para poder verificar la animación y su degradación bajo
  `prefers-reduced-motion` con Playwright, en vez de solo describirla en
  prosa.
- **Aviso de logro** — tarjeta de cierre que envuelve una insignia
  desbloqueada, `role="status"` porque en uso real (L13, cierre de unidad)
  aparece dinámicamente y debe anunciarse sola.
- **Tarjeta de cápsula, sus tres estados** — completada / disponible /
  bloqueada, con prefijo `cap-` (familia documentada en CLAUDE.md). Es la
  única entidad del OVA con un estado bloqueado de verdad: CLAUDE.md deja
  fuera de alcance el bloqueo *entre* unidades (lo resuelve Moodle) pero no
  el bloqueo *entre* cápsulas de una misma unidad, que sí es del motor.
  Bloqueada es un `<div>`, no un `<a>`: sin `href` queda fuera del orden de
  tabulación de forma nativa, mismo criterio que `.boton:disabled`.

**Generalización, no duplicación.** `.drawer-backdrop` (T3) se renombró a
`.backdrop`, un atómo transversal sin prefijo: el modal necesitaba
exactamente el mismo fondo atenuado y clonar tres líneas de CSS no tenía
sentido pudiendo reusarlas. Solo cambió la clase; el `id="drawer-backdrop"`
que usa `router.js` con `getElementById` no se tocó, así que T3 no se
rompió — confirmado con la misma corrida de Playwright que verificó el
drawer real en `src/index.html`.

**Dos bugs reales encontrados con Playwright, no hipotéticos:**

1. **El backdrop tapaba la caja del modal.** `.backdrop` trae `z-index: 200`
   fijo (calibrado en T3 contra el resto del chrome a nivel de `body`).
   Dentro de `.modal` — que abre su propio contexto de apilamiento por
   `position: fixed` + `z-index: 300` — ese 200 se comparaba contra
   `.modal__caja`, que solo tenía `z-index: 1`: el backdrop pintaba
   *encima* de la caja entera y el botón «Cerrar» quedaba visible pero
   sin poder pulsarse. Arreglado subiendo `.modal__caja` a `z-index: 201`
   — el mismo número que ya usa `.nav-drawer--flotante` contra el mismo
   backdrop, no un valor inventado.
2. **Regresión propia en 320px.** El botón de demo de la insignia
   ("Simular desbloqueo (--dur-reveal)") desbordaba 9px a 320px de ancho
   — `.boton` fija `white-space: nowrap` a propósito y el texto era
   demasiado largo para el espacio disponible. Se acortó a "Simular
   desbloqueo" (el resto de la explicación ya está en el párrafo de abajo).

**Verificado con Playwright, abriendo `dev/kitchen-sink.html` por
`file://`:** los nueve componentes presentes con sus estados (conteos
verificados por selector, incluida cada variante de chip/callout y cada
estado de cap-tarjeta/insignia); recorrido de teclado real hasta el
término de glosario (Tab, no clic) y apertura con Enter; foco entra al
modal (único focalizable: «Cerrar», así que el ciclo de Tab no escapa a la
página de atrás); las tres salidas —Escape, backdrop (clic en una esquina
real, no en el centro que coincide con la caja) y «Cerrar»— cierran el
modal y devuelven el foco al término en los tres casos; acordeón alterna
con Enter sobre el `<summary>` enfocado; botón de insignia agrega
`.insignia--revelando` y la animación mide `0.48s` (el token `--dur-reveal`
sin escribir el valor a mano) en una pasada normal y `0.00001s` con
`prefers-reduced-motion: reduce` emulado, sin duplicar el media query;
chip presionado cambia `aria-pressed` y fondo juntos
(`rgb(11,11,11)` = `--surface-inverse`); 320px sin scroll horizontal
(`scrollWidth === clientWidth`, confirmado tras el arreglo de la
regresión); zoom de texto 200% sin scroll horizontal; cero errores de
consola en toda la corrida. Cero hex nuevo en los tres archivos tocados
(`components.css`, `kitchen-sink.html`, `index.html` por el rename de
`.backdrop`).

**Integración en layouts existentes.** Los dos marcadores de kitchen-sink
que decían explícitamente "(marcador — T5)" se reemplazaron por los
componentes reales: L12 ahora usa `.tarjeta-recurso` de verdad y L13 usa
`.aviso-logro` con una insignia desbloqueada adentro. El resto de
L01–L11 no se tocó — no tenían marcador de T5, y CLAUDE.md ya dejó
registrado que L02–L13 no pasaron por una crítica de diseño aparte
(decisión del 28 ago).

**29 ago — T6 cerrada: motor de evaluación, con el catálogo I01–I08 diseñado
en esta sesión (no venía especificado) y verificado de punta a punta con
Playwright, incluido el reporte real a `cmi.interactions` contra una API
SCORM simulada.**

**Decisión de lectura, la más importante de la sesión.** `PLAN.md` pide
"quiz.js con los tipos I01 a I08 y el bloque de retroalimentación I14. Banco
de preguntas, intentos configurables" sin decir qué es cada tipo —
`CLAUDE.md` solo nombra I09–I12 (las interacciones insignia de T8) e I14, no
I01–I08. Antes de escribir código se decidió qué catálogo construir, y esa
decisión quedó documentada en el encabezado de `quiz.js` (no en `CLAUDE.md`,
mismo criterio que el catálogo de layouts vive en `layouts.css` y no ahí):

- **I01 verdadero/falso, I02 opción única, I03 opción múltiple, I04
  relacionar, I05 ordenar, I06 completar espacio en blanco, I07 respuesta
  numérica, I08 autoevaluación (escala, sin nota).** Los siete primeros
  mapean 1 a 1 contra los tipos de `cmi.interactions.n.type` de SCORM 1.2
  (`true-false`, `choice` ×2, `matching`, `sequencing`, `fill-in`,
  `numeric`), y el octavo contra `likert` — el reporte a SCORM sale
  directo de esa correspondencia en vez de inventar un mapeo aparte.
- **"Banco de preguntas" no es una estructura de varias preguntas dentro de
  una sola pantalla.** El contrato de contenido ya fija `interaccion` como
  un objeto `{tipo, datos}` singular (T2). Envolver varias preguntas ahí
  habría cambiado esa forma sin necesidad real: se interpretó "banco" como
  el catálogo de tipos que implementa `quiz.js`, con una pregunta por
  pantalla (layout L10, "interacción a pantalla completa") — el mismo
  patrón que I09–I12 en T8, cada una ocupando su propia pantalla. Si la
  intención real era varias preguntas por pantalla, hay que decirlo
  explícitamente, igual que quedó registrada la lectura propia del botón
  de reanudar en T3.
- **Ningún tipo usa arrastre.** I04 (relacionar) e I05 (ordenar) —los dos
  "de orden"— resuelven con `<select>` en vez de drag-and-drop. `PLAN.md`
  exige esto de forma explícita para I09 en T8 ("alternativa de teclado al
  arrastre"); se aplicó aquí desde el origen en los dos tipos de T6 que
  tenían el mismo problema, en vez de construir con arrastre y corregirlo
  después.

**Qué se construyó:**

- **`src/js/quiz.js`** (nuevo) — `window.OVA.quiz.crear(interaccion)`
  construye un `<form novalidate>` con el `<fieldset>`/`<legend>` real de
  la pregunta (cierre de `PLAN.md`), el bloque de retroalimentación I14
  (`.quiz-retro`, compartido por las ocho, `role="status"` para
  anunciarse solo — mismo criterio que `.aviso-logro` en T5), y los
  botones «Comprobar»/«Reintentar». Cada constructor de tipo
  (`construirVerdaderoFalso`… `construirAutoevaluacion`) devuelve la misma
  interfaz (`evaluar()`, `textoRespuesta()`/`textoCorrecta()` para SCORM,
  `bloquear()`/`desbloquear()`, `revelarCorrecta()`) para que el montaje
  no necesite saber de qué tipo es la pregunta que está calificando.
  `revelarCorrecta()` agrega su nota de "Respuesta correcta: …" con
  `retro.agregarNota()`, dentro del propio `.quiz-retro` (`role="status"`)
  en vez de como hermano en el fieldset — si quedara afuera, un lector de
  pantalla que reacciona a la región en vivo nunca la anunciaría, solo la
  vería quien mira la pantalla (mismo espíritu de la regla dura del color
  nunca siendo el único código, extendido a que el estado se anuncie
  completo).
  `evaluar()` devuelve `null` solo en I08 (autoevaluación): esa señal es
  la que usa `comprobar()` para no calificarla, no reportar
  `correct_responses` y no tocarle la nota.
- **Intentos configurables** (`datos.intentos`, 0/ausente = ilimitados).
  Al agotarse o acertar, `comprobar()` bloquea los controles y —si la
  respuesta quedó incorrecta— revela la respuesta correcta con
  `revelarCorrecta()`; con intentos de sobra y respuesta incorrecta,
  aparece «Reintentar», que reactiva los controles sin borrar la
  selección anterior (el intento no se descuenta al reintentar, solo al
  comprobar).
- **Reporte a SCORM vía `cmi.interactions`.** Cada «Comprobar» agrega una
  fila nueva (id, type, student_response, correct_responses.0.pattern,
  result, time) leyendo `cmi.interactions._count` para saber el próximo
  índice, y en preguntas gradables actualiza
  `cmi.core.score.raw/min/max` con 100/0 según acierto — la nota que T9
  necesita para "reporta avance y notas". El formato de
  student_response/correct_responses es una serialización simple (ids
  separados por comas, `clave.valor` para relacionar/ordenar), no la
  gramática completa de patrones de SCORM 1.2 por tipo de interacción:
  decisión deliberada, documentada en `quiz.js` — Moodle basa la
  calificación real en `cmi.core.score.raw`, no en parsear ese patrón.
- **`router.js`**: `PLANTILLAS.L10` (único layout con columna de
  interacción) y `crearInteraccion()`, que delega en `OVA.quiz.crear()` y
  falla ruidoso si la pantalla no trae `interaccion` — mismo patrón que
  `crearMedia()` con `media.tipo` en T4.
- **`content/ova-u1.js`**: pantalla nueva `s07` (L10, I02 con dos
  intentos) para que T6 se verifique de punta a punta en
  `src/index.html`, no solo en la kitchen sink — mismo criterio que
  `s05`/`s06` en T4.
- **CSS (`components.css`)**: familia `.quiz-` nueva (`.quiz-interaccion`,
  `.quiz-pregunta`, `.quiz-opcion`, `.quiz-retro`…). `.quiz-opcion` usa
  `accent-color` en el radio/checkbox en vez de un estilo de
  "seleccionado" aparte — mismo criterio que el scrubber de `media.js` en
  T4. El bloque de retroalimentación anima con `--dur-base` al aparecer
  (ítem 3 del inventario de movimiento, "la que más comunica"); el
  `@keyframes quiz-retro-entrada` es el mismo patrón opacity+translateY
  que `layout-entrada`, sin duplicar el media query de movimiento
  reducido.

**Verificado con Playwright (dos páginas, tres corridas):**

- `dev/kitchen-sink.html`: nueve instancias reales de `.quiz-interaccion`
  (las ocho I01–I08 más la de L10) sin errores de consola. Recorrido
  completo con teclado sobre I02 sin un solo clic — foco en el primer
  radio, flechas arriba/abajo mueven la selección nativa del grupo, Tab
  cae directo en «Comprobar» (nada inalcanzable entre medias), Enter
  comprueba. `:focus-visible` con contorno real (nunca `outline: none`).
  Nueve `<fieldset>` con nueve `<legend>` hijos directos (uno por
  pregunta). I01 con `intentos:1` bloquea y revela la respuesta correcta
  en el primer fallo; I03 con `intentos:2` deja «Reintentar» visible tras
  el primer fallo y llega a `correcto` en el segundo intento sin perder
  las casillas ya marcadas; I06 compara "Acción" contra "acción" ignorando
  tilde/mayúsculas (normalización NFD); I08 nunca queda en
  `correcto`/`incorrecto`, siempre `neutral`. 320 px sin scroll horizontal
  y zoom de texto 200 % sin romper el layout de ninguna de las nueve.
  Bajo `prefers-reduced-motion: reduce`, la animación del bloque de
  retroalimentación mide `0.00001s` (el colapso ya existente de
  `--dur-base` en `tokens.css`, sin media query duplicado).
- `src/index.html`, con una API SCORM 1.2 simulada inyectada en
  `window.API` antes de cargar la página (mismo mecanismo que usará
  Moodle): navegar hasta `s07` monta la interacción real; fallar la
  primera vez agrega `cmi.interactions.0.*` completo (id
  `u1-p1-mercado`, type `choice`, student_response `b`, pattern `a`,
  result `wrong`, time con formato `HH:MM:SS`) y dobla
  `cmi.core.score.raw` a `0`; reintentar y acertar agrega
  `cmi.interactions.1.*` con `result: correct` y sube el score a `100`,
  bloquea los radios y oculta ambos botones. Cero errores de consola en
  toda la corrida.

**Kitchen sink:** sección "Motor de evaluación (T6)" nueva dentro de
"Componentes", con las ocho preguntas montadas de verdad vía
`OVA.quiz.crear()` (mismo criterio que el reproductor de video de T4 y el
modal de T5: no depende del router/hash, así que puede vivir aquí sin
falsear su comportamiento). El marcador de L10 ("Interacción I0X — marcador
quiz.js en T6") se reemplazó por el mismo ejemplo que `s07`, montado por
`router.js` de verdad en `src/index.html` y replicado aquí solo para
mostrarlo sin navegar.

**29 ago — T7 cerrada: datos y gráficos, sin librería externa (decisión
tomada antes de escribir código, ver más abajo), catálogo de siete tipos
diseñado en esta sesión y verificado de punta a punta con Playwright.**

**Decisión previa a la implementación: nada de Highcharts/D3/similares.**
El usuario preguntó si convenía una librería especializada antes de
empezar. La respuesta salió directo de las reglas duras 4 y 5 de
CLAUDE.md: ninguna de esas librerías puede cargarse desde CDN (regla 5,
sin dependencias externas salvo Google Fonts) y aunque se autoalojaran,
meter una librería completa para siete tipos de gráfico simples choca
con el espíritu de la regla 4 (nada de frameworks). La estructura del
proyecto ya reservaba `js/charts.js` "en SVG o canvas", y T5 dejó
`.anillo` explícitamente como "decorativo — el motor de gráficos real es
T7", así que ya estaba decidido que sería vanilla SVG.

**Decisión de contrato de contenido, la más importante de la sesión.**
Igual que T6 con `interaccion`, PLAN.md no fijó la forma de estos siete
tipos — es una decisión de esta sesión, documentada en el encabezado de
`charts.js` (mismo criterio que el catálogo I01–I08 vive en `quiz.js` y
no en CLAUDE.md):

- **Campo nuevo `pantalla.datos`, plano** (`{tipo, ...campos propios}`),
  hermano de `media`/`interaccion`. Se decidió plano como `media` y no
  anidado como `interaccion.datos` para evitar el trabalenguas
  `datos.datos`; `OVA.charts.crear(datos)` recibe el objeto completo tal
  cual, cada constructor de tipo ignora `tipo`.
- **Catálogo:** `cifra`, `tabla`, `variacion`, `linea`, `barras`,
  `distribucion`, `proceso` — nombres tomados directo del orden de
  PLAN.md. La forma exacta de cada uno está documentada en el
  encabezado de `charts.js`.
- **Elemento reutilizable nuevo `.layout__datos`** (layouts.css), mismo
  patrón que `.layout__media` (T4) y `.layout__interaccion` (T6):
  `router.js` expone `crearDatos()`, que delega en `OVA.charts.crear()`
  y falla ruidoso si `datos.tipo` no existe en el catálogo — mismo
  criterio que `crearMedia`/`crearInteraccion`. Se agregó al grupo de
  animación de entrada (ítem 2 del inventario de movimiento) junto con
  media/figura, mismo escalón.
- **L09 pasa a tener plantilla real** (no la tenía desde T2/T4/T6): es
  el layout que layouts.css nombra explícitamente para "proceso / línea
  de tiempo", así que exige `datos` igual que L03/L04 exigen `media`. Se
  eliminó el CSS especulativo que T1/T1.5 habían dejado ahí
  (`.layout--l09 .layout__cuerpo ol` en fila a 48em) porque nada en el
  motor generaba jamás un `<ol>` dentro de `.layout__cuerpo` — CSS
  muerto reemplazado por la implementación real.
- **`datos` es opcional en L02** (a diferencia de L09): s01 sigue siendo
  texto puro sin él; s08/s10 lo agregan. Acotado al mismo ancho de
  lectura que `.layout__cuerpo` (`.layout--l02 .layout__datos {
  max-width: 42rem }`) porque en L02 el gráfico acompaña texto denso, no
  es el protagonista de la pantalla como en L09.

**Reuso, no duplicación — dos componentes de T1.5 que ya anticipaban
este trabajo:**

- **`cifra` con `porcentaje` es el motor real de `.anillo`** (T5,
  decorativo/estático desde entonces). `construirCifra()` genera
  exactamente la misma cáscara (`.anillo`, `.anillo__cifra`,
  `.anillo__numero`, mismo SVG r=52/viewBox 120, mismo truco de color
  por `style` en vez del atributo `stroke` porque los atributos de
  presentación SVG no leen `var()` de forma consistente entre
  navegadores — hallazgo que T5 ya había documentado). Sin
  `porcentaje`, es solo el número grande: no todo dato destacado es una
  proporción de 100.
- **`proceso` resuelve la nota pendiente de `.linea-tiempo`.** Ese
  componente (T1.5) traía un comentario explícito: "la variante
  horizontal... se resuelve la próxima sesión, cuando se aplique dentro
  del layout real y su propio @media". `.linea-tiempo--horizontal`
  (components.css, nuevo) es exactamente ese trabajo: fila a partir de
  48em con el conector rotado, columna debajo — verificado con
  Playwright en `src/index.html` (s09 real): `flex-direction: row` a
  1024px, `column` a 320px, sin depender de que L09 le pase ninguna
  clase especial (el componente resuelve su propio breakpoint,
  reusable fuera de L09 también).

**Qué se construyó, todo nuevo en `src/js/charts.js`:**

- **`cifra`** — número real siempre visible; con `porcentaje`, anillo de
  progreso (ver arriba); sin él, bloque simple `tipo-display-2`.
- **`tabla`** — `<table>` real con `<caption>`, `<th scope="col">` y la
  primera columna de cada fila como `<th scope="row">`. Una celda puede
  ser `{variacion, unidad}` para incrustar el componente de variación
  (reuso interno, no duplicación). Envuelta en
  `.dato-tabla__envoltura` con `overflow-x:auto` **y `tabindex="0"` +
  `role="region"` + `aria-label`** — no por exceso de celo: Playwright
  encontró que esta tabla desborda su caja de verdad bajo zoom de texto
  al 200% (ver hallazgo más abajo), y sin esto un desborde real quedaba
  inalcanzable con teclado.
- **`variacion`** — ícono (arrow_upward/arrow_downward/remove) + signo
  (+/−) + color a la vez, nunca el color solo (cierre explícito de
  PLAN.md). `valor === 0` es un tercer estado neutro sin color
  semántico, no una variante de "positivo" con signo vacío.
- **`linea`/`barras`** — SVG `aria-hidden` (decorativo) + fila de
  etiquetas de eje en HTML real (a diferencia de `<text>` en SVG,
  sobrevive el zoom de texto) + `<details>`"Ver datos en tabla" con la
  tabla exacta — la alternativa textual que exige el cierre de T7.
  `barras` soporta valores negativos (barra a la izquierda del cero,
  rojo-500 en vez de naranja-500 — probado con datos reales:
  "Derivados" en −2,3%).
- **`distribucion`** — barra apilada horizontal (SVG) + leyenda en HTML
  real; la leyenda ya es la alternativa textual, sin `<details>` extra.
  Sin rampa categórica en tokens.css, la paleta cicla naranja-500 +
  escala de grises (900/500/300/700) — nunca un hex nuevo.
- **`proceso`** — ver reuso de `.linea-tiempo` arriba.
- Trazos y rellenos de SVG van por `style` referenciando `var(--token)`,
  nunca por el atributo de presentación a mano (mismo hallazgo de
  `.anillo`, aplicado a los cinco tipos que usan SVG).

**`router.js`**: `crearDatos()` (nueva), `PLANTILLAS.L09` (nueva,
exige `datos`) y `PLANTILLAS.L02` (ahora acepta `datos` opcional).

**`content/ova-u1.js`**: tres pantallas nuevas — `s08` (L02 + variación),
`s09` (L09 + proceso) y `s10` (L02 + barras) — para ejercitar
`charts.js` de extremo a extremo en `src/index.html`, no solo en la
kitchen sink (mismo criterio que T4/T6). `s08`/`s09` retoman el mismo
ejemplo de Petrocaribe que ya usaba `s06` (compra a $1.000, sube a
$1.500) para que la variación (+50%) y el desglose en pasos sean
consistentes con lo que el estudiante ya vio en video, no un dato nuevo
sin conexión. `cifra`, `tabla`, `linea` y `distribucion` no se
enchufaron al router esta sesión (mismo criterio que la mayoría de los
componentes de T5: kitchen-sink-only está bien para un componente que
no depende del router) — si una pantalla real de contenido los necesita
antes de T9, agregar su entrada a `PLANTILLAS` es directo.

**Hallazgo real de Playwright, no hipotético — y su alcance.** Se probó
la kitchen sink completa (las siete secciones de T1–T7 a la vez) a
320px **y** zoom de texto 200% **simultáneamente** — una condición más
estricta que la que describe el cierre de cada tarea anterior en este
archivo ("320px sin scroll horizontal" y "zoom de texto 200%" se
verificaron siempre por separado, nunca combinados). Bajo esa condición
combinada, `document.documentElement.scrollWidth` sí desborda
(418px en un viewport de 320px). Aislado con Playwright: **la sección
de T7 por sí sola no desborda** (elemento más a la derecha en 296px,
dentro del viewport); quitar el bloque de la tabla de T7 por completo
deja el mismo desborde de 418px — el causante son botones/`.media-audio`/
`.media-video` de T1–T4, que sí desbordan individualmente bajo esa
combinación (encontrado con un barrido de `getBoundingClientRect()`
sobre todo `body *`). No se tocó ese CSS: es anterior a esta sesión y
la condición combinada no es la que describe CLAUDE.md ni la que
verificó ninguna tarea previa. Queda anotado en pendientes para la
auditoría de T9, que si va a probar 320px+zoom200% a la vez sobre la
página completa, va a encontrar esto.

**Verificado con Playwright (dos páginas, un script de diagnóstico):**

- `dev/kitchen-sink.html`: los siete tipos presentes y montados de
  verdad vía `OVA.charts.crear()` (cero errores de consola); anillo con
  texto real "77 %" + SVG `aria-hidden`; tabla con 3 filas, 3 `<th
  scope="row">`, 3 `<th scope="col">` y 3 celdas de variación
  incrustadas; variación con los tres signos (positivo/negativo/neutro)
  — íconos `arrow_upward`/`arrow_downward`/`remove` confirmados y color
  computado real (`rgb(10,115,64)` = verde-700, `rgb(196,34,23)` =
  rojo-700, `rgb(83,83,83)` = gris-600/texto secundario); línea con SVG
  `aria-hidden`, 5 ejes en HTML y `<details>` con 5 filas de tabla
  oculta, abierto con foco + Enter (teclado, no clic); barras con 3
  `<rect>` (relleno naranja-500 en las dos positivas, rojo-500 en la
  negativa) y su propio `<details>`; distribución con 3 `<rect>` y
  leyenda de texto real ("Renta variable — 45 %..."); proceso con 3
  pasos y la clase `linea-tiempo--horizontal` puesta. `prefers-reduced-motion`
  colapsa la animación de entrada a `1e-05s` (el mismo colapso ya
  existente de tokens.css, sin media query duplicado). 320px sin scroll
  horizontal y zoom de texto 200% **por separado** sin desborde (ver
  hallazgo de arriba sobre la condición combinada). Cero hex nuevo
  (`charts.js`, `components.css`, `layouts.css` verificados por grep).
- `src/index.html`, con una API SCORM simulada como en T6: recorrer
  hasta `s08` monta la variación real (signo "positivo", foco en el
  `<h2>` de la pantalla, igual que toda navegación desde T3); `s09`
  monta `PLANTILLAS.L09` con 3 pasos reales y `.linea-tiempo` en `row`
  a 1024px / `column` a 320px (el breakpoint de
  `.linea-tiempo--horizontal` confirmado en ambos anchos, no solo
  descrito); `s10` monta 3 `<rect>` de barras con su `<details>`. Cero
  errores de consola en las diez pantallas (s01–s10) recorridas con
  clic real en "Siguiente". 320px sin scroll horizontal en s10.
- Foco de teclado en la región de tabla: `tabindex="0"` +
  `role="region"` + `aria-label` con el título real de la tabla
  confirmados por `document.activeElement`; `outline-style` en foco es
  `solid` (nunca `none`) sin CSS adicional — hereda la regla global de
  `:focus-visible` de `base.css`, no se duplicó nada nuevo.

**Kitchen sink:** nuevo bloque "Datos y gráficos (T7) — catálogo
completo, cableado real" dentro de "Componentes" (mismo nivel que el
motor de evaluación de T6, no una sección aparte), con nav link nuevo
`#c-datos`. Los siete tipos están vivos (no maqueta), montados por
`OVA.charts.crear()` en el script al final de la página — mismo
criterio que el reproductor de video (T4) y el motor de evaluación
(T6): no dependen del router/hash, así que pueden mostrarse tal cual
son.

**29 ago — T8 (I10) hecha: primera de las cuatro interacciones insignia,
calculadora paramétrica de valorización por dividendo — con una decisión
de arquitectura tomada antes de escribir código y verificada de punta a
punta con Playwright.**

**Decisión de arquitectura, la más importante de la sesión: I10 vive en
`quiz.js`, no en un archivo nuevo.** CLAUDE.md nombra I09–I12 pero no les
da archivo propio en la Estructura del proyecto, y `router.js` ya solo
tiene un punto de entrada para cualquier `interaccion` del contrato
(`crearInteraccion()` → `OVA.quiz.crear()`). Inventar un
`interacciones.js` habría duplicado ese punto de entrada sin necesidad.
Dentro de `quiz.js`, sin embargo, una interacción insignia NO es una
pregunta: no tiene intentos, ni Comprobar/Reintentar, ni un "correcto"
que revelar — es un widget exploratorio. `crear()` ahora despacha primero
contra una tabla aparte (`CONSTRUCTORES_INSIGNIA`) antes de asumir que
todo lo demás es I01–I08; cada constructor de ese grupo arma su propio
DOM completo (no un `<fieldset>` para que `crear()` lo envuelva) y decide
él mismo cuándo reportar a SCORM. I09/I11/I12 (las tres sesiones que
faltan, en ese orden) siguen el mismo patrón de despacho — es
literalmente lo que PLAN.md pide de I10, "sirve de patrón".

**Decisión de contrato de contenido — modelo de descuento de
dividendos.** "Valorización y dividendo" (PLAN.md) se leyó como el
modelo de Gordon: valor = D1 / (r − g). Documentado en el encabezado de
`quiz.js` (mismo criterio que I01–I08 y el catálogo de `charts.js`):

- `interaccion.datos = { enunciado?, formula, entradas, salida }`.
  `formula` sale de un catálogo cerrado en `FORMULAS_CALCULADORA` (hoy
  un solo miembro, `valor_accion_dividendo`) — el contenido elige un
  tipo ya implementado, el motor nunca evalúa una expresión arbitraria
  del JSON.
- `entradas`: `[{ id, etiqueta, unidad?, min, max, paso, valorInicial,
  decimales? }, …]`. `valor_accion_dividendo` exige exactamente los ids
  `dividendo` (D1, dividendo esperado del próximo año), `tasaCrecimiento`
  y `tasaDescuento` (puntos porcentuales). Si tasaDescuento ≤
  tasaCrecimiento no hay valor real (crecimiento no sostenible bajo ese
  descuento): el resultado pasa a un estado de error con ícono y texto
  explicativo — nunca un NaN silencioso ni un color solo — y el botón de
  registrar se deshabilita mientras dure.
- `salida`: `{ etiqueta, unidad?, decimales? }`, `unidad` como sufijo
  (mismo criterio que `charts.js`, ej. `" COP"`).

**Qué se construyó:**

- Cada entrada es un `<input type="range">` nativo — mismo criterio que
  el scrubber de `media.js` (T4) y `.quiz-opcion` (T6): el teclado
  (flechas, Inicio/Fin, RePág/AvPág) y el rol de slider vienen gratis
  del navegador, así que "operable con teclado sin arrastrar" (cierre
  de T8) queda resuelto por construcción, no por un manejador de tecla
  escrito a mano. Emparejado con un `<output for="…">` — elemento nativo
  con rol ARIA implícito `status`, así que el valor de cada slider se
  anuncia solo, sin `aria-live` escrito a mano.
- El resultado también es un `<output>` (mismo motivo: es literalmente
  el resultado de un cálculo), recalculado en cada `input` de cualquier
  slider — la retroalimentación en vivo es el punto pedagógico del
  componente, no un extra.
- Botón «Registrar valorización»: arma un objeto mínimo compatible con
  la `reportarSCORM()` que ya existía para I01–I08 (`idScorm`,
  `tipoScorm:'other'`, `textoRespuesta()` serializa `id=valor` de cada
  entrada separadas por coma, `textoCorrecta()` devuelve `null` — no hay
  "correcta" en un explorador de escenarios, mismo criterio que I08) y
  anuncia el registro en un párrafo `role="status"` propio
  (`.calc-resumen`). Sin intentos ni bloqueo definitivo: se puede
  ajustar y volver a registrar cuantas veces se quiera, cada click
  agrega una fila nueva a `cmi.interactions` — verificado con dos
  registros consecutivos, dos filas independientes con los valores
  vigentes en cada click. No toca `cmi.core.score`, igual que I08.
- Familia de clases nueva `.calc-` en `components.css`, agregada a la
  lista de CLAUDE.md — no reutiliza `.quiz-` a propósito, son familias
  de componente distintas aunque compartan el mismo punto de entrada en
  JS.
- `content/ova-u1.js` suma `s11` (L10 + I10): retoma la valorización de
  Petrocaribe de s08/s09 pero hacia adelante — con los valores por
  defecto (dividendo 60, crecimiento 4 %, descuento 10 %) el resultado
  inicial es exactamente 1.000 COP, el mismo precio primario que ya vio
  el estudiante en s06/s09, no una cifra nueva sin conexión.

**Verificado con Playwright — nota de infraestructura para la próxima
sesión de T8.** Esta sesión no tenía Playwright instalado como
dependencia del proyecto (no hay `package.json`); las sesiones previas
lo tenían disponible de algún otro modo que esta no heredó. Se resolvió
así: `npx --no-install playwright --version` sí encontró un Playwright
1.62.1 ya cacheado por `npx` en
`%LOCALAPPDATA%\npm-cache\_npx\<hash>\node_modules`; exportar ese path en
`NODE_PATH` antes de `node script.js` lo hace `require()`-able sin
instalar nada nuevo ni tocar el repo. Si la próxima sesión (I11) no
encuentra Playwright, este es el atajo antes de asumir que hay que
instalarlo.

Con esa configuración, dos páginas verificadas de punta a punta,
Chromium real (no simulado):

- `dev/kitchen-sink.html`: cero errores de consola; la calculadora
  monta 3 sliders + 4 `<output>` (tabindex/`for` de cada uno confirmado
  contra el id de su slider); Tab enfoca el primer slider y ArrowRight
  cambia su valor Y recalcula el resultado en vivo (sin clic, sin
  arrastre); bajar la tasa de descuento por debajo de la de crecimiento
  dispara el estado de error (ícono `error`, texto explicativo, botón
  deshabilitado) y subirla de nuevo lo revierte; Enter sobre el botón
  enfocado (no clic) registra y el párrafo `role="status"` anuncia el
  texto correcto. 320 px sin scroll horizontal (aislado: la sección
  completa de T8 mide como máximo 296 px de ancho real en un viewport
  de 320); zoom de texto 200 % aislado también sin desborde (1256 px en
  un viewport de 1280); `prefers-reduced-motion` sin errores de consola.
- `src/index.html`, con una API SCORM 1.2 simulada como en T6/T7:
  recorrer hasta `s11` monta la calculadora real con foco en el `<h2>`
  de la pantalla (mismo comportamiento de a11y.js que toda navegación
  desde T3); valor inicial 1.000 COP confirmado; registrar agrega
  `cmi.interactions.0.*` (`id` `u1-p2-valorizacion-dividendo`, `type`
  `other`, `student_response`
  `dividendo=60,tasaCrecimiento=4,tasaDescuento=10`, `result` `neutral`,
  sin `correct_responses.0.pattern`) sin tocar `cmi.core.score.raw`;
  320 px sin scroll horizontal en `s11`. Cero errores de consola en toda
  la corrida.

**Hallazgo verificado, no una regresión nueva — mismo problema que ya
documentó T7.** Bajo la condición combinada 320 px **y** zoom de texto
200 % **a la vez** sobre la kitchen sink completa (T1–T8), el
`scrollWidth` de la página desborda (444 px). Aislado con Playwright:
ocultar `#c-insignia` por completo deja el mismo desborde de 444 px sin
cambio — la sección de T8 no es la causante. El elemento que Playwright
marca como "más a la derecha" dentro de `#c-insignia` bajo esa condición
(`.boton--outline` de la nav inferior de la kitchen sink) solo alcanza
esa posición porque el desborde ya generado por componentes de T1–T4
empuja el ancho disponible de todo lo que viene después en el documento
— es el mismo mecanismo que T7 ya aisló y documentó, no un problema
nuevo del `.calc-` de esta sesión. Sigue siendo trabajo de la auditoría
de T9, no de T8.

**Kitchen sink:** nueva sección "Interacciones insignia (T8)" (mismo
nivel que el motor de evaluación de T6 y los datos de T7), con nav link
`#c-insignia`, montada de verdad vía `OVA.quiz.crear()` en su propio
`<script>` al final de la página — mismo criterio que T4/T6/T7: no
depende del router/hash, así que puede vivir viva ahí.

**29 ago — T8 (I11) hecha: boleta de compra, segunda de las cuatro
interacciones insignia — reusando literalmente la cáscara que I10 dejó
como patrón, verificada de punta a punta con Playwright.**

**La reutilización funcionó como se esperaba.** I11 comparte con I10 el
mismo contenedor `.calc-calculadora`, el mismo patrón de campo
(`.calc-campo` con slider + `<output>`), el mismo bloque de resultado
(`.calc-calculadora__resultado`), las mismas acciones/resumen
(`.calc-acciones`/`.calc-resumen`, `role="status"`) y el mismo mecanismo
de reporte (`reportarSCORM()`, tipo `other`, sin nota, reenviable). Lo
único nuevo fue el selector de tipo de orden — un `<fieldset>/<legend>`
con dos `<input type="radio">` nativos, mismo criterio que I01–I08: el
grupo y su navegación con flechas vienen gratis del navegador, sin una
sola línea de JS para el teclado.

**Regla de negocio y una distinción de estado nueva frente a I10.**
Orden de COMPRA: a mercado siempre se ejecuta al precio de mercado
vigente; a límite se ejecuta solo si el precio de mercado no supera el
límite que definió el comprador, si no, queda pendiente. A diferencia
del dominio inválido de I10 (que sí es un error: no hay valor real),
"pendiente" en I11 **no es un error** — es un resultado legítimo de una
orden límite, el punto pedagógico del ejercicio. Por eso no bloquea
«Enviar boleta» y usa el estilo neutro por defecto de
`.calc-calculadora__resultado` (ícono `schedule`) en vez del rojo de
error; solo "ejecutada" tiene su propio verde (`check_circle`), mismo
patrón que `.quiz-retro[data-estado="correcto"]`. Límite queda marcado
por defecto en el contenido de demo (mercado 1.000 COP, límite 950 COP)
para que la pantalla cargue en estado "pendiente" — es el caso que de
verdad muestra la diferencia con una orden a mercado.

**`content/ova-u1.js` suma `s12`** (L10 + I11), continuando la misma
historia de Petrocaribe (mercado en 1.000 COP, el mismo precio primario
que ya vio el estudiante en s06/s09/s11).

**Verificado con Playwright (mismo atajo de `NODE_PATH` documentado en
la entrada de I10 — sigue sin haber `package.json` en el proyecto),
Chromium real:**

- `dev/kitchen-sink.html`: cero errores de consola; estado inicial
  "pendiente" con ícono `schedule`; foco + tecla espacio en el radio
  "A mercado" cambia la selección y el slider de límite pasa a
  `disabled` en el mismo tick (nunca oculto); el estado pasa a
  "ejecutada" de inmediato (una orden a mercado siempre se ejecuta);
  `ArrowRight` sobre el grupo de radios (sin clic) vuelve a "Límite" y
  reactiva el slider; con el precio de mercado en su mínimo (tecla
  `Home` sobre el slider enfocado) el resultado es "ejecutada" con el
  texto exacto "Se ejecuta a 800 COP (tu límite era 950 COP)."; con
  `End` vuelve a "pendiente"; el botón «Enviar boleta» permanece
  habilitado en estado pendiente (confirmado, no se deshabilita); Enter
  sobre el botón enfocado registra y el `role="status"` anuncia
  "Boleta enviada: quedó pendiente (no se ejecutó)." 320 px y zoom de
  texto 200 % aislados sin desborde atribuible a esta sección (296 px y
  1256 px respectivamente, dentro de sus viewports).
- `src/index.html`, con la misma API SCORM 1.2 simulada de T6/T7:
  recorrer hasta `s12` monta la boleta real con foco en el `<h2>`;
  estado inicial "pendiente" (1.000 > 950); enviar en pendiente agrega
  `cmi.interactions.0.*` (`student_response`
  `tipo=limite,precioMercado=1000,precioLimite=950`, `result` `neutral`,
  sin tocar `cmi.core.score.raw`); cambiar a "A mercado" por clic
  recalcula a "ejecutada" en vivo y un segundo envío agrega una fila
  independiente (`cmi.interactions.1.*`,
  `tipo=mercado,precioMercado=1000,precioLimite=950`) — confirma que,
  igual que I10, se puede reenviar tantas veces como se quiera. 320 px
  sin scroll horizontal en `s12`. Cero errores de consola en toda la
  corrida.

**Kitchen sink:** nuevo bloque `#c-insignia-i11` dentro de la sección
"Interacciones insignia (T8)", montado con `OVA.quiz.crear()` en su
propio `<script>` — mismo criterio que I10.

**29 ago — T8 cerrada: I09 e I12, las dos últimas interacciones insignia.
El usuario pidió explícitamente terminar T8 tras una sesión anterior en la
que se detuvo el trabajo en vez de saltar a T9 con T8 a la mitad (T9
necesita el paquete completo, no uno con dos interacciones insignia
faltantes).**

**I09, línea de tiempo ordenable (Repo/TTV, base de C1) — la única de
las cuatro con una respuesta objetivamente correcta.** A diferencia de
I10/I11 (exploradores de escenario sin "correcta"), ordenar
cronológicamente sí tiene un resultado objetivo, así que «Comprobar
orden» evalúa contra `ordenCorrecto` y reporta `correct`/`wrong` de
verdad (tipoScorm `sequencing`, mismo mapeo que I05) — pero sigue sin
tocar `cmi.core.score` (exclusivo de I01–I08) ni bloquear el widget: se
puede reordenar y volver a comprobar cuantas veces se quiera, mismo
criterio que I10/I11. Decisiones de construcción:

- **Reusa `.linea-tiempo` (T1.5/T7) siempre en su variante vertical.**
  La `--horizontal` de T7 es de solo lectura y centra el texto —pensada
  para el diagrama de proceso—, no para filas con controles de
  reordenar; forzarla ahí habría sido pelear contra ese layout en vez
  de reusarlo limpio.
- **La alternativa de teclado al arrastre que exige `PLAN.md`, resuelta
  con controles reales, no con un manejador de tecla escrito a mano.**
  Cada paso trae dos `.boton-icono` ("Mover antes"/"Mover después",
  texto en `.u-oculto-visualmente`, mismo patrón que el botón del
  drawer en `index.html`) que intercambian el paso con su vecino
  inmediato. El arrastre nativo (`draggable`, dragstart/dragover/drop)
  es una mejora progresiva de solo mouse sobre la misma función de
  reordenar — los dos caminos convergen en el mismo código, verificado
  con Playwright: `dragTo` reordena igual que los botones.
- **Cada movimiento se anuncia por la región compartida de `a11y.js`
  (`OVA.a11y.anunciar()`), no una región `role="status"` propia** — y
  el foco vuelve al botón del paso movido en su nueva posición, nunca
  se pierde. Esto expuso un hallazgo real: `dev/kitchen-sink.html` no
  tenía el elemento `#anuncios` que sí existe en `index.html` (nada en
  la página llamaba antes a `OVA.a11y.anunciar()` fuera del router, así
  que el hueco no se había notado). Se agregó el mismo `<div id="anuncios"
  aria-live="polite">` a la kitchen sink — sin él, el anuncio se perdía
  en silencio (a11y.js no falla, solo no hay nada que rellenar).
- El número de nodo sigue `aria-hidden`: el orden real del `<ol>` ya se
  anuncia solo a quien navega por lista, no hace falta duplicarlo.

**I12, distribución de capital (armar un portafolio, base de C3 junto
con I10) — reusa `OVA.charts.crear({tipo:'distribucion'})` de T7 para
la vista viva en vez de duplicar el SVG de barra apilada.** Cada
slider (uno por categoría, retoman los tres mercados de s01: renta
variable, renta fija, derivados) recalcula los segmentos y reemplaza
la figura completa — la misma barra apilada + leyenda de texto real
que ya construyó T7, ahora con datos que cambian en vivo. Validación
de dominio con el mismo patrón que el error de I10 (tasa de descuento
≤ crecimiento): si la suma de categorías no es exactamente 100,
`.calc-calculadora__resultado` pasa a `data-estado="error"` (ícono +
texto) y «Registrar distribución» se deshabilita mientras dure; al
llegar a 100 el botón se habilita. Reporte igual a I10/I11: tipoScorm
`other`, sin `correct_responses` (no hay una única distribución
"correcta"), reenviable cuantas veces se quiera.

**Generalización, no duplicación, en `components.css`.** Los estados
verde/rojo de `.calc-calculadora__resultado` que I10 (`error`) e I11
(`ejecutada`) ya tenían se generalizaron agregando los selectores
`correcto`/`incorrecto` de I09 a las mismas reglas de color (mismo
verde-500/700 y rojo-500/700), sin duplicar el bloque completo — solo
el ajuste de tamaño de fuente del error de dominio de I10 (una
oración larga sobre un `.resultado-valor` que por defecto es
`tipo-display-2`) se dejó exclusivo de `error`, porque el
`resultado-valor` de I09 ya nace en `tipo-h5` como oración y no lo
necesita.

**Contenido de prueba:** `s13` (L10 + I09, kicker "Cápsula 1") con las
cuatro etapas de una operación repo en un orden deliberadamente
revuelto, y `s14` (L10 + I12, kicker "Cápsula 3") con los tres
mercados de s01 como categorías del portafolio, valores de demo que ya
suman 100 (40/45/15) para que la pantalla cargue en estado válido.

**Verificado con Playwright (mismo atajo de `NODE_PATH`, Chromium
real), dos páginas:**

- `dev/kitchen-sink.html`: I09 monta 4 pasos; el primer botón "Mover
  antes" nace `disabled` (es el primero); mover con teclado (foco real
  + Enter, sin clic) intercambia el paso correctamente, anuncia por
  `#anuncios` y devuelve el foco a un `.boton-icono` real, nunca lo
  pierde; arrastrar y soltar con mouse (`dragTo`) reordena igual;
  «Comprobar orden» marca `incorrecto` tras revolver y `correcto` con
  una instancia de prueba en el orden ya correcto, en ambos casos sin
  deshabilitar el botón (se puede repetir); recorrido de Tab real
  desde el primer botón habilitado hasta «Comprobar orden» sin
  paradas fuera de orden. I12 monta 3 sliders, total inicial 100 %,
  la vista viva dibuja 3 `<rect>`; mover un slider con teclado
  (`ArrowRight`/`ArrowLeft`, foco real) cambia el total, marca error y
  deshabilita «Registrar distribución» al salirse de 100, y revierte
  al volver a 100; recorrido de Tab desde el primer slider alcanza
  «Registrar distribución». 320 px y zoom de texto 200 % aislados a
  ambas secciones, sin desborde propio (0 px de diferencia en los
  cuatro casos); `prefers-reduced-motion` sin errores de consola en
  toda la página.
- `src/index.html`, con una API SCORM 1.2 simulada como en T6/T7/T8
  anteriores: `s13` monta 4 pasos con foco en el `<h2>`; comprobar
  reporta `cmi.interactions.0.type` `sequencing` con el id correcto y
  sin tocar `cmi.core.score.raw`. `s14` monta 3 sliders con total
  inicial 100 %; registrar reporta `cmi.interactions.1.type` `other`
  con el id correcto. Cero errores de consola en toda la corrida.

**Hallazgo de HTML, no relacionado con T8 en sí pero encontrado al
tocar esta misma sección — arreglado.** `dev/kitchen-sink.html` tenía
dos elementos con `id="c-insignia"` (el bloque de insignia de T5 y la
sección entera de interacciones insignia de T8): un id duplicado hace
que el navegador resuelva cualquier ancla/selector contra el primero
que aparece en el documento, así que el link de navegación
"Interacciones insignia" saltaba al bloque equivocado (el de T5) en
vez de a T8. Renombrado el contenedor de T8 a `id="c-insignia-t8"` y
actualizado el link de navegación — los ids internos
(`c-insignia-i09`…`i12`) ya eran únicos, no se tocaron.

**Kitchen sink:** sección "Interacciones insignia (T8)" ahora dice
"las cuatro, cableadas reales" en vez de anunciar que faltan I09/I12;
nuevos bloques `#c-insignia-i09` y `#c-insignia-i12` con la misma
estructura (etiqueta + intro + marco) que I10/I11, montados en su
propio `<script>` cada uno, mismo criterio que las dos anteriores.

## Pendientes y avisos

- El contenido de Jose no bloquea nada hasta T8.
- **T9 necesita el Moodle de Pablo en pie para la última prueba real —
  todo lo demás de T9 ya está hecho y verificado (ver la entrada del 29
  ago).** Coordinarlo antes del viernes 4: subir `build/out/ova-u1-scorm.zip`
  y confirmar que Moodle lo reconoce como SCORM 1.2 de un solo SCO y que
  el libro de calificaciones refleja avance y nota.
- **Cerrado por decisión explícita del usuario (29 ago): 320px + zoom de
  texto 200% *simultáneos* queda fuera del alcance del proyecto.** El
  criterio de cierre sigue siendo el de T1-T8: cada condición verificada
  por separado. Ver la entrada de T9 del 29 ago para el detalle de por
  qué se preguntó explícitamente en vez de decidirlo por cuenta propia.
  Esto reemplaza las dos anotaciones de "pendiente para la auditoría de
  T9" que dejaron T7 y T8 más abajo en este archivo.
- L02–L13 no tuvieron la crítica de diseño ni el catálogo de componentes que
  preveía el punto 1 de T1.5 (ver decisión del 28 ago) — quedó descartado,
  no diferido a otra sesión.
- El motor (T2/T4/T6/T7) solo tiene plantillas de render para L02, L03,
  L04, L05, L06, L09, L10 y L11. Cualquier tarea que monte una pantalla
  con otro layout (L01, L07, L08, L12, L13) necesita agregar su entrada a
  `PLANTILLAS` en `router.js` antes de que esa pantalla renderice — hoy cae
  en el estado de error visible, a propósito.
- El botón de reanudar de T3 es una interpretación propia del alcance —
  ver la decisión del 28 ago—, no una especificación literal de
  `PLAN.md`. Confirmar con el usuario si el comportamiento esperado era
  otro.
- ~~T5 debería reutilizar lo que T3 dejó genérico...~~ — hecho, ver la
  decisión del 29 ago: el modal reusa `.boton-icono`, `.backdrop`
  (renombrado desde `.drawer-backdrop`) y `OVA.a11y.elementosFocalizables()`/
  `ciclarFocoEn()`.
- **Hallazgo incidental de T4, no arreglado (fuera de alcance de T5).**
  Verificando 320px para T5, `.media-video__pantalla-completa` desborda
  ~15px su contenedor (`.media-video`) a ese ancho — no genera scroll
  horizontal de página porque `.media-video` tiene `overflow: hidden`
  (lo clipea), pero visualmente el ícono de pantalla completa puede
  quedar recortado en el reproductor a 320px exactos. No estaba en el
  alcance de esta tarea arreglar CSS de T4; queda para la auditoría de
  T9 o para cuando se retome T4.
- Al integrar el modal de T5 en una pantalla real (T6/T8), copiar el
  patrón de `abrirModal`/`cerrarModal` del script de la kitchen sink
  (`dev/kitchen-sink.html`, cerca del cierre del archivo) en vez de
  escribir uno nuevo — es el mismo patrón que `abrirDrawer`/`cerrarDrawer`
  de `router.js`, con las mismas tres salidas (Escape, backdrop, botón).
- ~~`OVA.media.crear()` solo sabe renderizar `media.tipo === "video"`...~~
  — hecho en C3 (4 sep): `crear()` despacha también `"avatar"` sobre
  `.media-audio`, cableada de verdad. Ver la entrada de C3 más abajo.
- ~~El registro de instancias de `media.js`... no se limpia cuando el
  router desmonta una pantalla...~~ — hecho en C3 (4 sep):
  `OVA.media.limpiarInstancias()` nueva, llamada por `router.js` en
  `limpiarApp()` en cada navegación. Ver la entrada de C3 más abajo.
- **El catálogo I01–I08 de T6 es una lectura propia, no una especificación
  literal de `PLAN.md`** — ver la decisión del 29 ago en `quiz.js` y aquí
  arriba. Confirmar con el usuario si los ocho tipos elegidos (y la
  lectura de "banco de preguntas" como una pregunta por pantalla, no
  varias por pantalla) son los que Jose necesita antes de que empiece a
  escribir guion de evaluación para ellos — corregirlo después de que haya
  contenido real escrito contra el catálogo equivocado sale caro.
- **I13 sigue sin definir.** `CLAUDE.md` nombra I09–I12 (insignia, T8) e
  I14 (retroalimentación, T6); I01–I08 los definió esta sesión. I13 no
  aparece en ningún lado — no es un error de esta sesión, ya faltaba antes,
  pero queda pendiente por si el catálogo necesita completarse a I01–I14
  sin huecos.
- **`quiz.js` no persiste el intento entre recargas ni entre visitas al
  drawer** — decisión de alcance explícita, documentada en el encabezado
  del archivo (mismo criterio que la posición de reproducción en
  `media.js`). Si el estudiante recarga a mitad de un intento o vuelve
  después de navegar a otra pantalla, la pregunta se remonta en cero:
  intentos usados y la respuesta marcada se pierden. Es aceptable para una
  pregunta suelta por pantalla; si T8 necesita retener eso entre
  interacciones más largas, es una extensión aparte, no algo que
  `quiz.js` ya resuelve.
- **`textoRespuesta()`/`textoCorrecta()` (formato reportado a
  `cmi.interactions`) usan una serialización simple, no la gramática de
  patrones completa de SCORM 1.2 por tipo** (documentado en `quiz.js`).
  Suficiente para que Moodle registre la fila y para que
  `cmi.core.score.raw` cargue la nota real, pero si T9 necesita que un
  reporte de LMS externo parsee `correct_responses.pattern` en el formato
  estricto del estándar, hay que revisarlo entonces.
- ~~**Hallazgo real de T7, no arreglado — para la auditoría de T9.**~~
  — cerrado el 29 ago por decisión explícita del usuario: 320px + zoom
  200% simultáneos queda fuera de alcance, ver la entrada de T9. Detalle
  original, sin tocar: La kitchen sink completa (T1–T7 a la vez)
  desborda horizontalmente a 320px **y** zoom de texto 200%
  **simultáneamente** (418px de `scrollWidth` en un viewport de 320px).
  Aislado con Playwright: la sección de T7 no es la causante (sola, no
  desborda; quitarla del todo deja el mismo desborde) — son
  botones/`.media-audio`/`.media-video` de T1–T4 los que desbordan bajo
  esa combinación específica. Cada tarea anterior verificó 320px y zoom
  200% por separado (nunca a la vez), que es como está descrita la
  condición en `CLAUDE.md`, así que esto no es una regresión de ninguna
  tarea puntual — pero si T9 prueba la combinación sobre la página
  completa, la va a encontrar.
- **T8 completa: I10, I11, I09 e I12 hechas**, en el orden que fijó
  PLAN.md. Las cuatro siguen el mismo patrón de despacho en `quiz.js`
  (`CONSTRUCTORES_INSIGNIA`), documentado en el encabezado del archivo.
  I09 (Repo/TTV) es la única con arrastre real (nativo, mejora
  progresiva de mouse) y su alternativa de teclado (dos `.boton-icono`
  por paso); el contenido de demo de I09/I12 usa Repo y los tres
  mercados de s01 como relleno — no es el guion final de Jose para
  las cápsulas C1/C3, igual que el resto del contenido del proyecto.
- **`cifra`, `tabla`, `linea` y `distribucion` (T7) no se enchufaron al
  router esta sesión** — viven cableados de verdad en la kitchen sink
  (vía `OVA.charts.crear()`, no maqueta) pero ninguna pantalla de
  `content/ova-u1.js` los usa todavía (solo `variacion`, `proceso` y
  `barras` sí, en s08/s09/s10). Mismo criterio que la mayoría de los
  componentes de T5. Si contenido real de Jose necesita alguno antes de
  T9, agregar la pantalla es directo: `PLANTILLAS.L02` ya acepta `datos`
  opcional.

**29 ago — T9 (empaquetado + auditoría): `imsmanifest.xml`,
`build/package-scorm.sh`, y una auditoría WCAG automatizada con axe-core
que encontró y corrigió cinco problemas reales de contraste — uno de
ellos en un componente que sí se muestra al estudiante. Falta la prueba
real en el Moodle de Pablo, que no está en manos de esta sesión.**

**Empaquetado.** `imsmanifest.xml` (raíz del proyecto) es SCORM 1.2 con
un solo SCO (`src/index.html`, el motor navega las catorce pantallas
por hash routing — Moodle nunca ve más de un SCO). `build/package-scorm.sh`
genera ambas salidas de PLAN.md desde una sola copia de staging:

- `build/out/ova-u1-scorm.zip` — para subir a Moodle.
- `build/out/standalone/` — carpeta lista para URL directa (entrada
  `standalone/src/index.html`).

**Verificación de manifiesto contra disco, no solo generación.** Antes
de empaquetar, el script compara la lista de `<file>` del manifiesto
con `find src -type f` más los assets de `public/` que el contenido
referencia hoy (hoy solo el video de s05/s06) y aborta ruidoso si no
coinciden en cualquier dirección — mismo criterio que "falla ruidoso en
consola" del contrato de contenido, aplicado al empaquetado: si alguien
agrega un archivo a `src/` o cambia qué asset de `public/` usa el
contenido y se olvida de actualizar el manifiesto, no sube a Moodle un
paquete incompleto en silencio. Probado a propósito: crear un archivo
suelto en `src/js/` y correr el script aborta con el archivo señalado
por nombre; borrarlo y volver a correr genera limpio.

**Bug real de empaquetado, encontrado por esta sesión antes de dar el
script por bueno — no hipotético.** La primera versión zipeaba
`imsmanifest.xml`, `src` y la ruta suelta del `.mp4` de `public/videos/`
directo desde la raíz del proyecto. `python -m zipfile -c` (el
fallback que se usa en esta máquina — no tiene `zip` de InfoZip
instalado, sí Python) preserva la ruta relativa de un directorio
recorrido recursivamente, pero un **archivo suelto** pasado como
argumento lo guarda por su nombre base, sin carpeta: el zip resultante
traía `woman_Businesswoman_1920x1010.mp4` en la raíz del paquete en vez
de `public/videos/woman_Businesswoman_1920x1010.mp4`, que es la ruta
que `../public/videos/...` (relativa desde `src/index.html`) necesita
para resolver. Confirmado inspeccionando el listado del zip generado
(`python -m zipfile -l`), no asumido. Arreglado copiando siempre a un
staging real (`build/out/_staging/`, con `src/`, `public/videos/` e
`imsmanifest.xml` en su lugar final) y comprimiendo desde ahí con `cd`
— así `python -m zipfile` recorre `src` y `public` como directorios de
verdad y preserva la ruta completa de todo. La misma copia de staging,
sin el manifiesto, se reutiliza para generar `standalone/` (`cp -r` en
vez de `mv`: `mv` de un directorio recién escrito falló con "Permission
denied" en esta máquina Windows, probablemente un handle todavía
abierto sobre el staging — `cp -r` no tuvo ese problema).

**Verificado con Playwright, dos veces — el zip real, no solo el
staging.** Se extrajo `build/out/ova-u1-scorm.zip` a una carpeta nueva
(`python -m zipfile -e`) y se abrió `src/index.html` ahí por `file://`,
con la misma API SCORM 1.2 simulada de T6-T8: cero errores de consola,
`<video>` con `readyState: 4` (carga completa) navegando hasta la
pantalla con media. Repetido sobre `build/out/standalone/src/index.html`
dos veces, con la API simulada y sin ella (modo URL directa): mismos
resultados en ambos casos, cero errores de consola.

**Auditoría WCAG con axe-core, no solo revisión manual — cinco
violaciones reales encontradas y corregidas, ninguna en las catorce
pantallas reales.** Sin dependencia nueva del proyecto (axe-core no se
empaqueta, es una herramienta de auditoría de esta sesión, mismo
espíritu que Playwright en T4-T8): se descargó `axe-core@4.10.2` con
`npm pack` a la carpeta de scratchpad y se inyectó con
`page.addScriptTag()` sobre Chromium real. Se corrió sobre
`dev/kitchen-sink.html` completo y sobre las catorce pantallas de
`src/index.html` (`s01`...`s14`, navegando con clics reales en
"Siguiente", más el estado del drawer abierto), con una API SCORM 1.2
simulada como en T6-T8. **Las catorce pantallas reales dieron cero
violaciones desde la primera corrida** — el catálogo de componentes
que sí llegó al motor está limpio. Las cinco violaciones estaban todas
en `dev/kitchen-sink.html` (documentación/demo) o en CSS de un layout
sin cablear:

1. **Bug real que sí afecta contenido en producción, el más importante
   de los cinco: el botón naranja grande no cumplía contraste.**
   `.boton--naranja.boton--grande` (el único botón naranja que existe
   —CLAUDE.md prohíbe el pequeño— usado potencialmente en cualquier
   pantalla de cierre/CTA) pintaba blanco sobre naranja-500 a 19px/**600**:
   3.48:1 de contraste real, medido por axe-core, contra los 4.5:1 que
   exige texto normal. `--text-on-brand-display` ya traía en su propio
   comentario en `tokens.css` la condición correcta ("solo >=19px/**700**
   o >=24px/400") y la kitchen sink ya la documentaba bien en la tarjeta
   "Brand" de la sección Superficies — el bug era que `--text-button`
   (el token que de verdad usa `.boton--grande`) se quedó en peso 600 en
   vez de 700 al definirse, y la prosa de `CLAUDE.md` copió ese 600 sin
   contrastarlo contra la condición ya documentada. Arreglado en un solo
   lugar (`--text-button` en `tokens.css`, 600→700) y corregida la
   prosa de `CLAUDE.md` ("mínimo 19 px en peso 700") para que las dos
   fuentes coincidan. Verificado visualmente con Playwright
   (`shot-boton.png` de esta sesión): el botón se ve más grueso, sigue
   siendo el mismo naranja-500, sin hex nuevo.
2. **Tres hallazgos más, todos en `dev/kitchen-sink.html`/`layouts.css`,
   ninguno alcanzaba el motor real:** el ejemplo "Deshabilitado" de la
   sección Superficies pintaba `--text-disabled` sobre un `<span>` de
   prosa suelta (2.52:1) en vez de sobre un control real deshabilitado
   — `--text-disabled` solo está exento de contraste por WCAG cuando es
   un control inactivo de verdad, no texto informativo pintado con ese
   color; se reemplazó el `<span>` por un `<button disabled>` real. La
   tarjeta "Muted" mostraba texto secundario (gris 600) sobre superficie
   muted (gris 200): 3.85:1, no llega a 4.5:1 — no es una combinación
   que use ningún componente real (confirmado por grep), pero la
   kitchen sink la presentaba como válida; se corrigió el texto a
   primario y se agregó el override de CSS que le faltaba a la tarjeta
   Muted (brand e inverse ya tenían el suyo, muted no). Y
   `.layout--l12 .layout__figura` (L12, un layout que router.js todavía
   no tiene en `PLANTILLAS` — no renderiza en el OVA real) traía fondo
   `--surface-subtle-2` con texto `--text-tertiary` encima: 4.41:1,
   por debajo del 4.5:1 por un margen mínimo — `--text-tertiary` ya
   traía la nota "solo sobre default y subtle" en `tokens.css`, subtle-2
   no está en esa lista; se cambió el fondo a `--surface-subtle`.
   Re-auditado tras cada arreglo hasta cero violaciones en ambas
   páginas.

**Decisión explícita con el usuario: 320px + zoom de texto 200% *a la
vez* queda fuera del alcance de T9, tal como venían las ocho tareas
anteriores.** La auditoría también reconfirmó el hallazgo que T7/T8
dejaron pendiente: bajo esa combinación simultánea (no cada condición
por separado), decenas de controles de toda la kitchen sink desbordan
—reproductor de video, `.boton-icono` de reordenar de I09, calculadoras
de I10-I12, incluso el aviso de logro de L13— porque `.boton`/`.boton-icono`
usan `white-space: nowrap` y a 200% de tamaño de texto el label
simplemente no cabe en 320px. Arreglarlo de verdad implica rediseñar el
comportamiento de botones e íconos bajo zoom extremo en casi todos los
componentes del proyecto — no es un ajuste de CSS puntual. Se preguntó
explícitamente al usuario cómo cerrar esto en T9 en vez de decidirlo
por cuenta propia, dado que las ocho tareas anteriores establecieron un
precedente consistente (verificar cada condición por separado) y
CLAUDE.md es ambiguo sobre si la regla es combinada. **Respuesta: mantener
el criterio de las ocho tareas anteriores** — 320px sin scroll
horizontal y zoom de texto 200% sin scroll horizontal, cada uno
verificado por su cuenta; la combinación simultánea queda documentada
como límite conocido del sistema de botones, no como bug pendiente de
T9. Con esto, el hallazgo que T7/T8 dejaban abierto queda cerrado por
decisión explícita, no solo pospuesto otra vez.

**Nota sobre el propio axe-core, no un bug del OVA.** Bajo `file://`,
axe-core intenta leer las hojas de estilo por `XMLHttpRequest` para
alguna de sus reglas internas y eso falla por CORS (mismo bloqueo de
`file://` entre orígenes que ya documentó T2 para `fetch`) — genera
ruido en la consola durante la auditoría, pero no afecta el resultado
de `color-contrast` (que sí operó correctamente, como prueban los cinco
hallazgos reales) y de todos modos axe-core no se empaqueta con el OVA:
esos errores no existen para un estudiante real.

**Lo que falta y no está en manos de esta sesión.** El cierre de T9 en
`PLAN.md` pide "el paquete sube a Moodle, reporta avance y notas" — el
reporte a `cmi.core.score`/`cmi.interactions`/`cmi.core.lesson_status`
ya está verificado de punta a punta con una API SCORM 1.2 simulada
(T6-T8 y esta sesión, sobre el zip real extraído), pero la prueba en un
Moodle real —subir `build/out/ova-u1-scorm.zip`, confirmar que Moodle
lo interpreta como SCORM 1.2 de un solo SCO y que el libro de
calificaciones refleja el progreso— necesita el entorno de Pablo, que
`PLAN.md` ya anotaba como dependencia externa ("coordinarlo desde ya").
Cuando esté listo: subir el zip tal cual sale del script (no
re-empaquetar a mano), y confirmar que el reporte de avance/nota llega
al libro de calificaciones de Moodle, no solo que el SCO abre.

---

## Qué queda para el 8 de septiembre

Seis días hábiles: lun 31, mar 1, mié 2, jue 3, vie 4 y lun 7.

**Bloqueante — contenido real.** Todo el OVA corre con relleno tomado del guion
de BVC. Falta el diseño instruccional de Jose y, sobre todo, la neutralización
de marca: quitar Bolsa de Valores de Colombia, Trii, Davivienda Homebroker,
Bancolombia e-Trading, Credicorp y los pesos colombianos. Si eso no entra, el
demo le muestra a nuam la marca de su competencia.

**Producción audiovisual (F) — sin empezar. Es la nueva ruta crítica.**
- F1 avatar HeyGen, 6 a 8 min de render. No arranca hasta que la locución esté cerrada.
- F2 cuatro piezas de motion: valorización, dividendo, estructura de mercado, ciclo del Repo.
- F3 infografías y mapa de entidades.
- F4 grabación de Jose, 60–90 s. Agendar martes 1.
- F5 subtítulos y transcripciones.

**Moodle (A1–A5, E2, E3) — Pablo.** Tema white-label, ruta con restricciones de
acceso, insignias y niveles, certificado, evaluación final en el módulo
Cuestionario, y la cohorte sembrada de ~180 estudiantes para que los informes
no salgan vacíos.

**Descargables (D1–D4).** Calculadora XLSX, checklist, hoja de perfil, glosario
tri-país.

**Propuesta (G1–G4, X3).** Guion de presentación de 12 min más versión de 3,
storyboard de muestra, ficha técnica con el licenciamiento de HeyGen **y de
Degular**, cotización del curso demo, declaración de accesibilidad.

---

**4 sep — C0 cerrada: renumeración de los catálogos L01–L13/I01–I14 a los de
BRIEF-DI.md, en rama `c0-renumeracion-catalogos`, sin tocar contenido ni
comportamiento visual/funcional — solo números, claves y comentarios.**

`BRIEF-DI-v2_nuam.md` (el documento de origen de Jose) no está en el
repositorio — vivía en `/mnt/data/` cuando se escribió, fuera del árbol del
proyecto. La tabla de equivalencias de `PLAN-CONTENIDO.md` §2.1/§2.2 ya
distila exactamente lo que hacía falta de ese brief (nombre, significado y
mapeo de cada código), así que fue la fuente única usada para esta tarea; no
hizo falta pedir el archivo.

**Alcance que se decidió mantener estrictamente mecánico.** La tabla de
equivalencias de §2.1 lista, junto a varios renombres, ajustes de
comportamiento (L04 admite `media` opcional, L09 admite `media` opcional, L05
soporta 3–4 tarjetas, L12/L13 llevan superficie de marca/inversa). Se decidió
NO aplicar ninguno de esos ajustes en C0: el cierre de la tarea en
`PLAN-CONTENIDO.md` solo pide que los trece layouts se vean con los nombres
correctos, que las catorce pantallas de prueba sigan navegando y que axe-core
siga en cero — nada de eso depende de esas mejoras, y C1 ("Layouts que
faltan") las nombra explícitamente como su propio trabajo. Meter esas mejoras
aquí habría mezclado un cambio de comportamiento con un renombrado masivo,
justo el tipo de mezcla que hace difícil revisar un diff grande. Si esa
lectura del alcance no era la correcta, es fácil de corregir: son ajustes
puntuales sobre layouts que ya quedaron con el nombre y la clase correctos.

**La permutación, resuelta a mano en vez de con token temporal.** El aviso de
`PLAN-CONTENIDO.md` §2.1.1 (renombrar en dos fases con `lXX-tmp` para no
pisar colisiones de un buscar-y-reemplazar secuencial) es la manera segura de
hacer esto con una herramienta ciega. Se optó por reescribir cada archivo con
conocimiento completo del mapeo final en vez de correr un script de
reemplazo — mismo resultado sin el riesgo, verificado al final con `grep`
recursivo sobre `src/` y `dev/` buscando cada código viejo (`layout--l0X`,
`PLANTILLAS.LXX`, `I01–I08`, ids como `l10-interaccion`) para confirmar que no
quedó ninguno; no se generó ningún `-tmp` que limpiar.

**Qué cambió, por archivo:**

- `layouts.css` — los trece modificadores `.layout--l0X` reescritos con el
  contenido que tenían sus equivalentes viejos (mapa completo en el
  encabezado del archivo). Dos bloques viejos no migraron: `.layout--l09`
  (proceso/línea de tiempo) se eliminó — ya estaba resuelto como
  `datos.tipo:'proceso'` (T7); `.layout--l11` (término de glosario) se
  eliminó — ya estaba resuelto como componente de T5
  (`.termino-glosario`+`.modal`). L07 y L08 quedaron como comentarios sin
  regla CSS (casillas nuevas del brief, sin contenido previo que migrar).
- `router.js` — `PLANTILLAS` renombrado: `L02`(antes L04), `L03`(sin
  cambio), `L04`(antes L02), `L06`(antes L10), `L12`(antes L05),
  `L13`(antes L06). Las entradas viejas `L09` y `L11` se borraron (sus
  layouts ya no existen — ver arriba). `CATALOGO_LAYOUTS` no cambió: sigue
  siendo el rango L01–L13 completo, independiente de cuáles tengan
  plantilla.
- `quiz.js` — `CONSTRUCTORES`: `I01`/`I02` intercambiados
  (`construirOpcionUnica`/`construirVerdaderoFalso`), y `I06`/`I07`/`I08`
  perdieron el número — se dispatchan por nombre (`completar`, `numerica`,
  `autoevaluacion`) porque el brief reserva esos tres códigos para tipos
  que este proyecto no construye (zonas sensibles, tarjetas volteables,
  comparador de dos columnas — ninguna pantalla de Jose los pide).
  `CONSTRUCTORES_INSIGNIA` (I09–I12) no cambió: ya coincidía con el brief.
- `content/ova-u1.js` — las catorce pantallas de prueba recodificadas
  (`layout` e `interaccion.tipo`). Dos casos no fueron solo cambiar el
  código: `s04` usaba el layout viejo de "término de glosario" (L11, ahora
  inexistente) — se movió a L04 (texto plano), la misma pantalla y el
  mismo contenido, sin la vitrina de modal que ahora vive en la kitchen
  sink; `s09` usaba el layout viejo de "proceso" (L09, ahora inexistente)
  — se movió a L04 con su mismo `datos.tipo:'proceso'`, que L04 ya sabe
  renderizar (el `datos` opcional que T7 le dio al viejo L02).
- `dev/kitchen-sink.html` — sección de layouts reordenada L01–L13 con las
  etiquetas exactas del brief; L07/L08 muestran un marcador "pendiente
  C1" en vez de una demo (no había nada que migrar). Catálogo de preguntas
  reordenado I01/I02 e ids `c-quiz-i06/07/08` renombrados a
  `c-quiz-completar/numerica/autoevaluacion`. Ids de montaje `l04-media` →
  `l02-media`, `l10-interaccion` → `l06-interaccion`.
- `components.css`, `base.css`, `charts.js` — solo comentarios: referencias
  a números de layout/interacción viejos corregidas a los nuevos (anillo de
  cifra, línea de tiempo horizontal, aviso de logro, motor de evaluación).
- `CLAUDE.md` no se tocó — la regla dura 8 ya estaba escrita dando la
  renumeración por hecha ("C0 los renumeró"), así que ya era correcta antes
  de empezar.

**Verificado con Playwright (Chromium) + axe-core, abriendo ambas páginas
por `file://`:** los trece bloques de la kitchen sink muestran las etiquetas
exactas del brief (L01 Portada de unidad … L13 Corte oscuro, cierre o
transición); cero violaciones de axe-core (`wcag2a`+`wcag2aa`) en la kitchen
sink y en `src/index.html`; las catorce pantallas de prueba (`s01`–`s14`) se
recorren de punta a punta con «Siguiente» sin caer en el estado de error del
motor ni un solo layout/interacción no reconocidos. Los únicos mensajes de
consola son ruido conocido de axe-core intentando leer las hojas de estilo
por `XMLHttpRequest` bajo `file://` (bloqueado por CORS, mismo hallazgo que
T9 ya documentó) — cero errores propios de la aplicación (`[OVA] …`) en
ninguna corrida. `grep` recursivo confirma cero rastros de la numeración
vieja en `src/` y `dev/`.

Sin verificar en esta sesión (fuera del cierre de C0, quedan para C1/C2):
recorrido de teclado completo sobre las pantallas nuevas y 320px/zoom 200%
— C0 no tocó ningún layout a nivel visual/estructural más allá de qué
clase le corresponde a cada uno, así que hereda el mismo comportamiento
responsive que ya tenían T1–T9.

---

**4 sep — C1 cerrada: los siete layouts que faltaban (L01, L05, L07, L08,
L09, L10, L11), en rama `c1-layouts-faltantes`. Los trece del catálogo
L01–L13 renderizan desde el JSON de contenido, no solo en la kitchen sink.**

**Alcance, tal como lo pidió el usuario — ni más ni menos.** El pedido
enumeró exactamente estas siete plantillas más dos ajustes puntuales (L05
soporta 2–4 tarjetas, L09 admite media opcional y pierde el comentario de
marca). `PLAN-CONTENIDO.md` §2.1 también deja pendientes de C1 el
tratamiento de superficie de L12 (`--surface-brand`) y L13
(`--surface-inverse`) — **deliberadamente no se tocaron**: no estaban en el
pedido de esta sesión y son un cambio de otra naturaleza (color/superficie,
no "falta la plantilla"). Los comentarios de `layouts.css` junto a esos dos
layouts ya no dicen "queda pendiente para C1" (esta sesión *es* C1 y no lo
hizo) — dicen que queda pendiente a secas, para no contradecirse a sí
mismos la próxima vez que alguien los lea.

**Qué se construyó, layout por layout:**

- **L01 · Portada de unidad.** Solo faltaba la plantilla (el CSS ya estaba
  terminado). Único layout con `<h1>` real (es la portada de toda la
  unidad, no una pantalla más) y con media puramente decorativa: el
  video/imagen de fondo va `aria-hidden` y en loop mudo, sin pasar por
  `OVA.media.crear()` (T4) — ese reproductor construye controles pensados
  para media con contenido instruccional, y aquí el contenido real es el
  texto del panel naranja, no el fondo. Los dos SVG de unión
  (`union_graf_nuam*.svg`, ya en `public/graf/`) son decoración fija del
  layout, no contenido: no salen del JSON. El botón "Comenzar" (o
  `pantalla.cta`, si el guion pide otro texto) llama a
  `OVA.router.siguiente()` — no es una navegación propia del layout, es el
  mismo "Siguiente" del chrome disparado desde otro lugar de la pantalla.
- **L05 · Tarjetas comparativas (2–4).** El CSS asumía siempre dos
  columnas (`flex: 1 1 0`, sin wrap); ahora es `flex: 1 1 14rem` con
  `flex-wrap`, que reparte cualquier cantidad en filas de ~14rem en vez de
  aplastar 4 tarjetas fijas en el rango 640–900px. Contrato nuevo:
  `pantalla.tarjetas` (arreglo de `{titulo, texto}`, 2 a 4 elementos) en
  vez de `cuerpo` — cada tarjeta necesita su propio título, un párrafo
  suelto no alcanza. Fuera de ese rango, falla ruidoso: el CSS no está
  pensado para 1 o 5 y no se verificó.
- **L07 · Pregunta.** La casilla más discutible del pedido: "que se sienta
  distinta de L06 sin ser otro layout". Se resolvió reusando la misma
  `crearInteraccion()`/`OVA.quiz.crear()` de L06 (mismo catálogo I01–I05)
  y cambiando solo el chrome — kicker con ícono (`help`), título alineado
  a la izquierda en vez de centrado, y el panel de la interacción como
  tarjeta con acento de marca en el borde izquierdo (mismo idioma que
  `.callout`/`.quiz-retro`, sin inventar un cuarto patrón de "estado con
  color"), en vez del relleno plano `--surface-subtle` de L06. Ancho más
  angosto (40rem contra 56rem) porque una pregunta es lectura, no un
  tablero de controles. Si esta lectura del "chrome propio" no era la que
  el usuario tenía en mente, es un cambio acotado a `layouts.css` +
  `crearKickerConIcono()` en `router.js`, nada más se apoya en ella.
- **L08 · Resultado y retroalimentación.** El único layout nuevo de
  verdad. Reusa dos piezas ya construidas en vez de inventar una tercera:
  `OVA.charts.crear({tipo:'cifra'})` (T7, el motor real del anillo) para
  la cifra de resultado y `.callout` (T5) para la retroalimentación,
  dentro de `.layout__datos`/`.layout__interaccion` (los mismos elementos
  reutilizables del inventario de movimiento, así que heredan la entrada
  escalonada sin trabajo extra). **La parte "déjalo preparado para texto
  en tiempo de ejecución" (P10/P31/P43/P47 van a leer una variable de
  contenido de C4, que todavía no existe):** se resolvió con un único
  punto de lectura, `obtenerResultado(pantalla)` en `router.js`, que hoy
  solo devuelve `pantalla.resultado` tal cual. No se construyó ninguna
  máquina de variables de contenido — eso es trabajo de C4, y adivinar su
  forma ahora habría sido diseñar para un requisito hipotético. Lo que
  deja "preparado" es que cuando C4 exista, ese es el único lugar que hay
  que tocar para mezclar el valor en vivo con — o en vez de — el del
  JSON, sin que la plantilla ni `layouts.css` se enteren del cambio.
- **L09 · Ideas clave.** Dos ajustes, no una plantilla desde cero (ya
  tenía CSS y contenido de ejemplo en la kitchen sink, pero ninguna
  entrada en `PLANTILLAS`). Media opcional: resuelto con `:has()` en CSS
  (`.layout--l09:not(:has(.layout__media))` cae a una columna) en vez de
  una clase modificadora que `router.js` tendría que acordarse de poner —
  el DOM ya dice si hay media o no, no hace falta un segundo lugar donde
  ese hecho pueda desincronizarse. El cuerpo pasó de párrafos a lista real
  (`<ul>` con ícono de check decorativo + texto): "ideas clave" son
  puntos, no prosa corrida. El comentario que nombraba "los 3 mercados de
  Bolsa de Valores de Colombia" como ejemplo se quitó, tal como se pidió
  — esa marca no va a ninguna parte del demo; el contenido de ejemplo en
  sí (que sigue nombrando BVC, igual que el resto de `content/ova-u1.js`)
  no se tocó, porque neutralizar la marca en el contenido real es trabajo
  de C7, no de C1.
- **L10 · Cierre de unidad.** Reusa `.aviso-logro`/`.insignia` de T5, que
  ya existían como maqueta pero nunca se habían cableado contra contenido
  real. "Siguiente paso" del nombre del brief se interpretó como el
  nav-inferior del chrome (T2/T3) — el layout no lleva su propio botón de
  navegación, porque no hay nada más allá del cierre de unidad que el
  motor necesite ofrecer aquí; la unidad siguiente la habilita Moodle
  (fuera de alcance, regla dura de CLAUDE.md). Si la intención real era
  otra (un botón propio de "ir a la siguiente unidad"), no hay evidencia
  de eso en `PLAN-CONTENIDO.md` ni en la kitchen sink previa — queda
  documentada esta lectura para poder corregirla sin arqueología.
  `pantalla.logro.titulo` es obligatorio: sin él no hay nada que mostrar
  en el momento celebratorio de la unidad.
- **L11 · Recursos descargables.** `pantalla.recursos` es un arreglo, no
  un objeto único — el nombre del layout ya es plural y P34 va a
  enganchar los cuatro descargables de Jose en una sola pantalla (C8):
  construir la plantilla para uno solo habría significado rehacerla en
  C8 para nada. Sin atributo `download` en el `<a>`: con un `href`
  todavía sin archivo real detrás (C8 los engancha), agregarlo dispara al
  navegador a intentar descargar la página actual en vez de no hacer
  nada — se agrega cuando el archivo real exista. La figura pasó del
  marcador de texto "PDF" de la kitchen sink a un ícono real
  (`folder_open`) dentro de la misma caja de 4rem que ya tenía CSS.

**Verificado con Playwright (Chromium) + axe-core, sobre el zip real no —
sobre `src/index.html` y `dev/kitchen-sink.html` por `file://`, con una API
SCORM 1.2 simulada como en T6–T9:**

- **Las 21 pantallas de `content/ova-u1.js`** (`s00` nueva al principio —
  L01, la portada real de la unidad — más `s01`–`s14` que ya existían y
  `s15`–`s20` nuevas al final para L05/L07/L08/L09/L11/L10, en ese orden)
  se recorren de punta a punta con «Siguiente» sin un solo layout
  cayendo al estado de error del motor y **cero errores de consola**
  (`pageerror` + `console.error`) en toda la corrida.
- **axe-core (`wcag2a`+`wcag2aa`) en cero violaciones** en cada una de
  las 21 pantallas de `src/index.html` y en `dev/kitchen-sink.html`
  completa. Sobre las siete pantallas nuevas se corrió además sin filtro
  de tags (todas las reglas de axe-core, no solo WCAG 2 A/AA): también
  cero. **Un hallazgo falso-positivo, no un bug real:** la primera
  corrida (esperando solo 150ms tras cada clic en «Siguiente», el mismo
  tiempo que ya usaban las verificaciones de T6–T9) marcó
  `color-contrast` en `s19` — desapareció por completo al esperar a que
  terminara la animación de entrada (`--dur-base` + `--stagger` × 4 ≈
  400ms) antes de auditar: axe-core estaba midiendo contraste sobre un
  elemento todavía a mitad de fundido de opacidad, no sobre el color
  final. No es una regresión de las verificaciones anteriores (que
  esperaban menos porque nada en T1–T9 tenía cuatro niveles de stagger
  apilados como L11); queda anotado por si vuelve a aparecer en C2 o C7.
- **320px sin scroll horizontal y zoom de texto 200% sin scroll
  horizontal, cada condición por separado** (mismo criterio que T1–T9 y
  la decisión explícita de T9 de no combinarlas): verificado en las 21
  pantallas de `src/index.html` y en la kitchen sink completa
  (`scrollWidth === clientWidth` en los dos casos, confirmado
  programáticamente, no solo visual).
- **Foco.** Se auditaron los elementos focalizables dentro de `#app` en
  las siete pantallas nuevas: ninguna imagen/SVG decorativo de L01 quedó
  alcanzable con Tab (el `aria-hidden` en el contenedor los saca del
  árbol de accesibilidad, confirmado programáticamente vía
  `closest('[aria-hidden="true"]')`), y el único focalizable nuevo por
  pantalla es el que se esperaba (el botón de L01, los controles de la
  pregunta de L07, el enlace de recurso de L11) más el `<h2>`/`<h1>`
  con `tabindex="-1"` que ya pone `a11y.js` en cada navegación. No se
  hizo un recorrido de Tab manual pantalla por pantalla — la auditoría
  programática cubre lo que un recorrido manual habría buscado (nada
  inesperado en el orden de tabulación); si hace falta el recorrido
  manual real con lector de pantalla, es trabajo de C9 (auditoría final).
- Capturas de pantalla de las siete pantallas nuevas y de los bloques
  nuevos de la kitchen sink revisadas visualmente (no solo con
  aserciones): confirman que L07 se lee distinto de L06, que L08 muestra
  el anillo de cifra y el callout juntos, que L05 acomoda 4 tarjetas en
  una fila a 1280px y 3 en `src/index.html`, y que L11 apila dos tarjetas
  de recurso sin recortarse.

**Cero hex nuevo** en los cuatro archivos tocados (`layouts.css`,
`router.js`, `content/ova-u1.js`, `dev/kitchen-sink.html`) — confirmado con
`git diff` + grep de patrones `#[0-9a-f]{3,6}`.

**Kitchen sink.** Los seis marcadores "pendiente C1" (L05, L07, L08, L09,
L10, L11) se reemplazaron por markup real: L05 ahora muestra 4 tarjetas
(perfil de riesgo, para probar el extremo que `content/ova-u1.js` no
cubre — ahí se usa 3), L07/L08 se montan en vivo con
`OVA.quiz.crear()`/`OVA.charts.crear()` igual que el resto de componentes
cableados de la página, L09 gana un segundo ejemplo "sin media" (el caso
nuevo que esta sesión le agregó al layout) además del que ya tenía con
media, y L11 muestra dos tarjetas de recurso para dejar constancia visual
de que el layout admite varias, no una.

**Qué queda fuera de esta sesión, explícitamente:** el tratamiento de
superficie de L12/L13 (ver arriba), el recorrido de teclado manual con
lector de pantalla (C9), y la caja 16:9/navegación pegada de la sección 4
de `PLAN-CONTENIDO.md` — eso es C2, la siguiente tarea del plan.

---

**4 sep — C2 cerrada: marco fijo del OVA, en rama
`c2-marco-fijo-navegacion`. El documento no scrollea nunca, las dos
barras quedan clavadas y el scroll vive en `#app`; L01 va sin barra
superior ni inferior; L12/L13 pasan a `--surface-brand`/`--surface-inverse`
a sangre; botón de pantalla completa en la barra superior más una
segunda aparición revelada en la portada. Antes de escribir código se
releyó §4 de `PLAN-CONTENIDO.md`: el usuario avisó que la spec había
cambiado ese mismo día (de "alto mínimo proporcional" a "marco fijo"),
así que la sesión partió de la versión vigente, no de la que traía
`ESTADO.md` en la cabeza.**

**Qué se construyó:**

- **`body`/`#app` como grid de tres filas** (`base.css`): `body`
  mide `100dvh` con `overflow:hidden` y `grid-template-rows: auto 1fr
  auto`; `#app` es la fila `1fr` con `overflow-y:auto`. `.layout` (T1,
  `layouts.css`) gana `min-block-size:100%` (llena como mínimo el alto
  fijo de `#app`, elimina el salto entre pantallas) y
  `justify-content:center` (centra contenido corto; el largo simplemente
  crece y `#app` lo scrollea). L01 sigue fijando su propio
  `min-height:100dvh` — redundante con la regla general pero inofensivo,
  no se tocó.
- **Escapado a `body.ova-marco`, no al selector `body` a secas — el
  hallazgo real de la sesión.** `base.css` es compartido con
  `dev/kitchen-sink.html` (mismo `<link>`), que es una sola página larga
  con los trece layouts y todos los componentes uno debajo del otro y
  depende de que el documento scrollee normal. La primera versión
  (`body { display:grid; block-size:100dvh; overflow:hidden }` sin
  escapar) le rompía la página entera a la kitchen sink: Playwright
  midió `body.scrollHeight` en 27815px contra un `clientHeight` de
  800px — casi todo el catálogo de componentes quedaba clipeado e
  inalcanzable, la superficie de revisión del proyecto (CLAUDE.md) rota
  en silencio. Arreglado agregando `class="ova-marco"` solo al `<body>`
  de `src/index.html` y escapando las reglas de grid a `body.ova-marco`;
  la kitchen sink recuperó su `overflow:visible`/`display:block` de
  siempre sin tocar una línea de `dev/kitchen-sink.html`. Reverificado:
  `body.scrollHeight` vuelve a ser 27815px con `clientHeight` igual (la
  página scrollea completa), cero violaciones de axe-core.
- **`#app` alcanzable por teclado (trampa 1 de §4.3).** `tabindex="-1"`
  (T3) pasó a `"0"` con `aria-label="Contenido de la pantalla"` —sigue
  siendo el destino del skip link, pero ahora también es una parada de
  Tab por derecho propio, necesaria porque una región con su propio
  scroll no es alcanzable por teclado en todos los navegadores solo con
  `overflow-y:auto`.
- **Botón de pantalla completa, dos apariciones (trampa 2 de §4.3).**
  `#nav-pantalla-completa` en la barra superior (disponible en todo el
  recorrido salvo L01) y `#nav-portada-completa`, hijo directo de
  `<body>` —no de `.layout--l01`, que tiene `overflow:hidden` para
  recortar los SVG de unión y podría clipear un `position:fixed`
  anidado según el navegador—, revelado solo en L01. Las dos comparten
  manejador de click y listener de `fullscreenchange` en `router.js`
  (`document.documentElement` como objetivo). `document.fullscreenEnabled
  || document.webkitFullscreenEnabled` decide si existen: si es falso
  (iframe de Moodle sin `allowfullscreen`), los dos quedan `hidden` para
  siempre — mismo criterio que el botón de pantalla completa de
  `media.js` en T4, verificado explícitamente simulando
  `fullscreenEnabled=false` con Playwright.
- **Revelado de la portada sin robar foco (trampa 3 de §4.3).**
  `gestionarBotonPortada()` en `router.js`: al entrar a L01 arranca
  `hidden`, un `setTimeout` de 4000ms ("a los pocos segundos") lo
  desoculta y, en el siguiente frame, agrega `.es-visible` para el
  fundido (`--dur-base`, ya colapsa a 1ms bajo `prefers-reduced-motion`
  en `tokens.css` — no se duplicó el media query). Nunca llama a
  `.focus()`. Se re-oculta y limpia el temporizador en cada navegación
  (salir de L01, o volver a entrar sin dejar un timer viejo corriendo).
- **Fallback de la trampa 4 (§4.3, zoom 200%).** `@media (max-height:
  36em)`: por debajo de esa altura visual, `body.ova-marco` vuelve a
  `display:block`/`overflow:visible` y `#app` a `overflow-y:visible` —
  el documento entero scrollea, como antes de C2, en vez de mantener dos
  barras clavadas sobre una franja demasiado angosta para leer. El punto
  de corte se ajustó verificando 320×568 con zoom de texto al 200 %
  (el caso real más angosto): con el marco fijo activo ahí, un párrafo de
  `s08` medía 665px de alto contra 568px de viewport — no entraba nada
  legible entre las barras. Con el fallback, el párrafo completo queda
  alcanzable por scroll de página y no hay scroll horizontal.
- **L01 sin barras (regla dura 9).** `actualizarChromePorLayout()` en
  `router.js`: `header.hidden`/`footer.hidden` siguen a
  `pantalla.layout === 'L01'`. Al ser `hidden` (no una clase de
  visibilidad), la fila `auto` que le correspondía en el grid de body
  colapsa a 0 sola — no hizo falta una regla de CSS aparte para ese
  caso.
- **L12 sobre `--surface-brand`, L13 sobre `--surface-inverse`, las dos
  a sangre** (`layouts.css`) — lo que C1 dejó fuera de alcance a
  propósito. El fondo va en la raíz `.layout` (que ya mide
  `min-block-size:100%` de `#app`), no en una tarjeta angosta sobre
  blanco: es lo que las convierte en cortes de verdad en vez de cajas
  flotantes. Contraste según CLAUDE.md ("sobre naranja el cuerpo va en
  gris 950, blanco solo en display"): L12 usa `--text-on-brand-display`
  (blanco) solo en el título (`tipo-display-2`, sí califica como
  "display"), `--text-on-brand` (gris 950) en kicker y cuerpo, igual que
  L01. L13 usa `--text-on-inverse` (blanco) para título/cuerpo y
  naranja-300 —no naranja-700— para el kicker: la regla de usar 700 es
  para texto sobre superficie clara, sobre inverse la pareja pensada
  para eso ya la usa la transcripción del reproductor de video (T4). Se
  retiraron el `max-width`/`padding`/`border-radius` que armaban la
  "tarjeta" de L13; el ancho de lectura lo sigue acotando
  `.layout__cuerpo` (42rem por defecto, sin cambio) más un
  `.layout__titulo { max-width: 42rem }` nuevo para que las dos líneas
  compartan columna.
- **Comentarios de L12/L13 en `layouts.css` corregidos** (ya no dicen
  "queda pendiente para C1"), y los dos párrafos correspondientes de
  `dev/kitchen-sink.html` actualizados igual.

**Dos bugs reales encontrados con Playwright antes de cerrar la tarea,
ninguno hipotético:**

1. **320px se rompió en cinco de las 21 pantallas** (`s01`, `s08`,
   `s11`, `s15`, `s16`) — confirmado que era una regresión de esta
   sesión y no algo preexistente corriendo el mismo diagnóstico contra
   `master` (limpio ahí). Causa: al pasar `body` a `display:grid`,
   `.nav-barra`/`#app`/`.nav-inferior` pasaron a ser *ítems de grid*, y
   un ítem de grid recibe un mínimo automático (`auto`) que por defecto
   es el tamaño min-content de su contenido más ancho — no 0, aunque
   `.nav-barra__titulo` adentro ya tuviera su propio `min-width:0` desde
   T3. Antes de C2 `.nav-barra` era un bloque normal sin ese piso
   automático y su flexbox interno podía encoger el título libremente;
   al volverse ítem de grid, el título dejó de importar y `.nav-barra`
   entera se negaba a bajar de ~432px en un viewport de 320px
   (confirmado inspeccionando el ancho computado con Playwright).
   Arreglado con `min-inline-size:0` explícito en los tres ítems
   (`#app` en `base.css`; `.nav-barra`/`.nav-inferior` en
   `components.css`) — el mismo problema que ya resolvía
   `min-block-size:0` en `#app`, pero en el eje horizontal.
2. **El botón de la portada se revelaba igual sin pantalla completa
   disponible.** `gestionarBotonPortada()` programaba su temporizador
   de 4000ms sin consultar si `document.fullscreenEnabled` era
   verdadero — la señal la calculaba `configurarPantallaCompleta()`
   pero solo la usaba para el botón de la barra, no para el de la
   portada. Encontrado simulando `fullscreenEnabled=false` +
   `webkitFullscreenEnabled=false` juntos con Playwright (Chromium
   expone las dos propiedades reflejando el mismo permiso real; apagar
   solo la primera no simula el caso real de un iframe sin
   `allowfullscreen`). Arreglado guardando la disponibilidad en
   `pantallaCompletaDisponible` (module-level) y consultándola también
   en `gestionarBotonPortada()`.

**Verificado con Playwright (Chromium) + axe-core, con una API SCORM
1.2 simulada, abriendo `src/index.html` y `dev/kitchen-sink.html` por
`file://`:**

- **1390×780, las 21 pantallas de `content/ova-u1.js`:** `body` nunca
  scrollea (`scrollHeight<=clientHeight` en las 21); `body.clientHeight`
  mide exactamente 780px en las 20 pantallas con chrome (sin salto
  entre ninguna); `s00` (L01) con header y footer `hidden`, el resto
  con los dos visibles.
- **320px y zoom de texto 200%, cada condición por separado, en las 21
  pantallas de `src/index.html` y en la kitchen sink completa:** cero
  scroll horizontal en ambos casos (`scrollWidth<=clientWidth`,
  confirmado programáticamente).
- **320×568 + zoom 200% simultáneos (trampa 4):** el fallback de
  `max-height:36em` se activa, un párrafo real de `s08` queda completo
  y alcanzable por scroll de página, sin scroll horizontal.
- **Teclado:** Tab desde el skip link recorre drawer-abrir →
  pantalla-completa → `#app` (nueva parada) → Anterior/Siguiente, sin
  nada inalcanzable; `#app` confirmado dentro de la secuencia de Tab.
  El drawer sigue abriendo con Enter, atrapando el foco y devolviéndolo
  con Escape al botón que lo abrió — sin regresión de T3 por los
  cambios de chrome de esta sesión.
- **Pantalla completa:** con `fullscreenEnabled` real (Chromium
  headless lo tiene), el botón de la barra aparece en toda pantalla
  salvo L01; en L01 el de la portada arranca oculto, se revela a los
  ~4s con `.es-visible`/`opacity:1`, y el foco activo tras revelarse
  sigue siendo el `<h1>` de la portada (nunca el botón). Con
  `fullscreenEnabled=false` simulado (las dos propiedades, estándar y
  `webkit`), los dos botones quedan `hidden` para siempre, incluso
  después de esperar el temporizador completo en L01.
- **axe-core (`wcag2a`+`wcag2aa`) en cero violaciones** en las 21
  pantallas de `src/index.html` y en `dev/kitchen-sink.html` completa
  (incluida la verificación aislada de L12/L13 con sus nuevos colores
  de superficie).
- Cero errores de consola (`pageerror`+`console.error` de la app; el
  ruido conocido de axe-core bajo `file://` que T9 ya documentó sigue
  ahí, sin relación con esta sesión) en toda la corrida.

**Cero hex nuevo** en los seis archivos tocados (`base.css`,
`layouts.css`, `components.css`, `router.js`, `index.html`,
`dev/kitchen-sink.html`) — todos los colores nuevos de L12/L13 salen de
tokens ya existentes (`--surface-brand`, `--surface-inverse`,
`--text-on-brand`, `--text-on-brand-display`, `--text-on-inverse`,
`--nuam-orange-300`).

**Pendiente, fuera de esta sesión.** Pablo tiene que fijar el alto del
reproductor SCORM del módulo de Moodle en ~780px (`PLAN-CONTENIDO.md`
§4 ya lo anota como coordinación de C9; un alto por defecto de 500px
arruina la composición de las 21 pantallas contra el presupuesto de
autoría de `BRIEF-DI.md` §4). El recorrido de teclado manual con lector
de pantalla real sigue siendo trabajo de C9, igual que quedó anotado al
cerrar C1.

---

**4 sep — C3 cerrada: media de avatar y audio, en rama
`c3-media-avatar-audio`. Tipo `avatar` (imagen fija + audio opcional +
subtítulos opcionales + transcripción obligatoria) sobre `.media-audio`
cableada de verdad, y las tres cosas que `PLAN-CONTENIDO.md` dejó
anotadas como herencia de C3 — resueltas, no descubiertas a mitad de
camino.**

**Qué se construyó:**

- **`media.js` generaliza su dispatcher.** `crear(datos)` ahora
  despacha por `datos.tipo` (`crearVideo`/`crearAvatar`, catálogo
  documentado en el encabezado del archivo) en vez de ser la única
  función de T4 con un guard de "solo video". `crearTranscripcionColapsada`/
  `crearTranscripcionVisible`/`crearCuerpoTranscripcion` quedaron
  extraídas como helpers compartidos entre video y avatar — el
  `<details>`/`<a download>` de video no cambió de comportamiento, solo
  de dónde vive el código.
- **`avatar`: dos rutas según `datos.audio`, no una con fallback.** Con
  audio: `<audio>` real (sin `controls` nativo, igual criterio que
  `<video>` en T4) con play, `input[type=range]` de progreso
  (`accent-color`, no una barra rellena a mano — animar `width` viola
  la prohibición del inventario de movimiento), tiempo, botón CC si hay
  `vtt` y transcripción en `<details>` colapsado. Sin audio: **cero
  controles** (mismo criterio que el CC omitido en video sin `vtt` —
  nunca un botón que no hace nada) y la transcripción **directa, sin
  colapsar** — es el único portador real de la locución mientras Juan
  graba (regla dura 10 de CLAUDE.md), así que esconderla detrás de un
  clic la habría tratado como un extra en vez del contenido principal.
  Las dos rutas comparten el círculo de avatar (`--surface-muted` de
  fondo) y, con audio, el mismo idioma visual que el reproductor de
  video de T4.
- **Subtítulos en vivo para audio — pieza que T4 no necesitaba.**
  `<video>` pinta sus propias captions nativas sobre el frame; `<audio>`
  no tiene esa superficie. Se agregó `.media-audio__captions`, un `<p>`
  actualizado a mano en cada `cuechange` del `TextTrack` (mismo Blob de
  texto WebVTT que video, mismo motivo: un `<track src="archivo.vtt">`
  real falla bajo `file://`). Deliberadamente **sin `aria-live`**: un
  lector de pantalla ya tiene la transcripción completa como su ruta
  real, y anunciar cada cambio de cue encima del audio sonando sería
  ruido, no ayuda — verificado que el criterio no rompe nada leyendo
  las cues igual (Playwright: saltar el audio a distintos `currentTime`
  actualiza el texto, apagar el CC lo vacía, reencenderlo lo retoma).
- **Registro de instancias unificado y con limpieza real (hallazgo de
  T4, cerrado).** `pausarOtros`/`instancias` no distinguen `<video>` de
  `<audio>` — los dos heredan de `HTMLMediaElement` y comparten
  `.pause()`/`.paused`, así que un solo registro alcanza para "un solo
  reproductor activo a la vez" entre cualquier combinación de los dos.
  `OVA.media.limpiarInstancias()` (nueva, expuesta) vacía el registro
  entero; `router.js` la llama desde `limpiarApp()` en cada navegación,
  antes de montar la pantalla siguiente — como el router nunca monta
  más de una pantalla a la vez, vaciar todo es correcto y más simple
  que filtrar por `isConnected`. Verificado con Playwright: reproducir
  el audio de `s21`, navegar a `s22` y volver a `s21` no deja dos
  `<audio>` compitiendo ni un registro con referencias muertas.
- **L01 separa fondo decorativo de contenido real en dos campos
  distintos — la nota más importante que `PLAN-CONTENIDO.md` dejó para
  esta sesión, con una corrección a mitad de camino.** Primer intento:
  `PLANTILLAS.L01` aceptaba `media.tipo` en
  `['video','imagen','avatar']`, y con avatar el fondo pasaba a ser la
  foto fija en vez del video en loop. El usuario pidió explícito
  mantener el video en loop de siempre en la portada — L01 es el único
  layout con dos zonas visuales (fondo + panel), y una no debería
  reemplazar a la otra solo porque la pantalla también tiene locución.
  Arreglado separando los dos campos: `pantalla.media` vuelve a ser
  exactamente lo que era en C1 (`"video"`/`"imagen"`, puramente
  decorativo, `OVA.media.crear()` ni se llama), y se agregó
  `pantalla.avatar` — un objeto independiente, mismo contrato que
  `media.tipo:'avatar'` sin el campo "tipo" — que `PLANTILLAS.L01`
  monta de verdad con `OVA.media.crear()` dentro de `.layout__panel`,
  después del cuerpo y antes del botón "Comenzar", si la pantalla lo
  trae. La tarjeta clara del avatar sobre el panel naranja no choca con
  las reglas de contraste de CLAUDE.md: es opaca, con su propio fondo
  `--surface-subtle` y su propia escala de color — el naranja de fondo
  nunca queda detrás de texto informativo.
- **`content/ova-u1.js`:** `s00` (L01, la portada real) **se queda solo
  con su `media.tipo:"video"` de siempre** (el mismo relleno de stock
  que ya usaba) — segundo pedido explícito del usuario en la misma
  sesión: primero mantener el video en vez de la foto fija, después que
  esta pantalla en particular no lleva narración de avatar en absoluto.
  El campo `pantalla.avatar` que `PLANTILLAS.L01` sabe montar (ver
  arriba) queda cableado y probado, pero **ninguna pantalla de este
  contenido de prueba lo usa hoy** — a la espera de una portada real
  que sí traiga locución. Dos pantallas nuevas antes del cierre real
  (`s20` sigue siendo el último elemento del arreglo, el cierre de
  verdad) sí ejercitan `media.tipo:'avatar'` de verdad, porque no
  comparten el problema de las dos zonas de L01: `s21` (L02, avatar
  **con** audio) y `s22` (L03, avatar **sin** audio — la pantalla que
  demuestra la degradación de la sección 3.2). Las dos apuntan a rutas
  de `public/img/avatar/avatar-{plano}-{fondo}-{n}.webp` que **todavía
  no existen**, a propósito — el código tiene que degradar limpio a la
  ausencia del archivo, no evitarla usando otra imagen que sí exista
  (pedido explícito del usuario). `s21` usa un audio real nuevo,
  `public/audio/demo-avatar.mp3` (un tono de 6s generado con `ffmpeg`,
  no locución de Jose) — confirma que `<audio><source src="…"></audio>`
  funciona bajo `file://` sin el workaround de Blob que sí hace falta
  para `<track>` (T4).
- **`components.css`:** `.media-audio` reescrita sobre controles reales
  — `.media-audio__progreso` pasó de "div + relleno por `width`" a ser
  directamente el `input[type=range]`; nuevo `.media-audio__cc`
  (variante de superficie clara del `.media-video__cc` de T4: relleno
  `--surface-inverse` activo en vez del gris 700 que usa video sobre su
  propio fondo oscuro) y `.media-audio__captions`. Se retiraron
  `.media-audio__fila`/`__info`/`__titulo` (la fila de
  título+voz de la maqueta, sin contraparte en el contrato de C3 —
  ningún campo de Jose las llena) y `.media-audio__progreso__relleno`
  (CSS muerto, reemplazado por el `input` real).
- **Kitchen sink:** "Tarjeta de audio (maqueta)" pasó a "Reproductor de
  avatar/audio (C3, cableado real)" con dos instancias reales de
  `OVA.media.crear({tipo:'avatar'})` (con y sin audio), mismo criterio
  que el reproductor de video de T4. El bloque estático de L01 en la
  sección "Layouts" no se reescribió (esa integración depende de
  `router.js`, no se falsea con markup aparte) — la nota que lo
  acompaña explica que `pantalla.avatar` existe y quedó probado, pero
  que ninguna pantalla real de `content/ova-u1.js` lo usa por ahora.

**Verificado con Playwright (Chromium) + axe-core, con una API SCORM
1.2 simulada, abriendo `src/index.html` y `dev/kitchen-sink.html` por
`file://`:**

- **Las 23 pantallas de `content/ova-u1.js`** (`s00`–`s22`) montan sin
  caer en el estado de error del motor.
- **`s00`:** sin narración de avatar (pedido explícito del usuario) —
  `.layout__panel` no monta nada nuevo; el fondo sigue siendo el video
  en loop de siempre, `aria-hidden`/`alt=""`, sin pasar por
  `OVA.media.crear()`; el botón "Comenzar" sigue presente y funcional.
  El caso avatar-dentro-de-L01 (secuencia de Tab completa hasta el
  reproductor, teclado real sobre el scrubber/CC) se verificó contra
  esta misma pantalla mientras sí tenía el campo `avatar` de prueba,
  antes de que el usuario pidiera quitarlo — ver el detalle en la
  entrada del commit anterior de esta sesión; la ruta de código no
  cambió, solo el contenido de `s00`.
- **Un solo reproductor activo a la vez, cruzando tipos:** reproducir
  el avatar de la kitchen sink y luego el video los deja con el avatar
  pausado y el video sonando — el registro unificado de `pausarOtros`
  funciona entre `<audio>` y `<video>`, no solo dentro del mismo tipo.
- **Subtítulos en vivo:** saltar el audio a distintos `currentTime`
  actualiza `.media-audio__captions` con el texto de la cue activa;
  apagar el CC la vacía; reencenderlo la retoma en el siguiente cue.
- **Degradación sin audio, verificada por estructura, no solo
  visual:** la instancia sin `audio` no tiene `.media-audio__controles`
  ni `<audio>` ni `<details>` — solo la imagen y
  `.media-audio__transcripcion-directa` con sus párrafos y el enlace de
  descarga real (`href` `blob:`, `download="transcripcion.txt"`).
- **320px y zoom de texto 200%, cada condición por separado, en las 23
  pantallas de `src/index.html`:** cero scroll horizontal en ambos
  casos.
- **axe-core (`wcag2a`+`wcag2aa`) en cero violaciones** en las 23
  pantallas de `src/index.html` y en `dev/kitchen-sink.html` completa.
- **Cero errores de consola propios de la app** en toda la corrida. Las
  únicas solicitudes que fallan de verdad son las tres imágenes de
  `public/img/avatar/` (esperado, no existen) y el ruido conocido de
  axe-core leyendo hojas de estilo por XHR bajo `file://` (T9) —
  aisladas explícitamente con `page.on('requestfailed')` para
  confirmar que no hay ninguna otra URL rota escondida detrás del
  mismo mensaje genérico de Chromium ("Failed to load resource").
- **Regresión de C2, sin romperse:** se corrió de nuevo la batería
  completa de C2 (marco fijo, trampas 1–4, pantalla completa) contra el
  código de esta sesión — sigue en cero fallos, `s00` incluida.

**Cero hex nuevo** en los cinco archivos de código tocados (`media.js`,
`router.js`, `components.css`, `content/ova-u1.js`,
`dev/kitchen-sink.html`) — todos los colores del CC/captions de audio
salen de tokens ya existentes (`--surface-inverse`, `--text-on-inverse`,
`--border-default`, `--surface-muted`, `--text-secondary`).

**Pendiente/anotado para C4 y para quien convierta el storyboard en
C7** — ver la entrada nueva en `PLAN-CONTENIDO.md` (sección "Notas para
C4/C7 sobre media") para el detalle completo: el contrato exacto de
`media.tipo:'avatar'`, qué campos son opcionales, y la confirmación de
que `media.audio` es una ruta real (no Blob) mientras que `media.vtt`
sigue siendo texto WebVTT completo.

**4 sep — C4 cerrada: variables de contenido, rama `c4-estado-compartido`,
con el catálogo I01–I05/I11 conectado al mecanismo genérico y una
decisión de alcance explícita sobre lo que sí se pudo cerrar de punta a
punta y lo que queda documentado para C5/C7.**

**Decisión de alcance, antes de escribir código.** El cierre de C4 en
`PLAN-CONTENIDO.md` §6 describe el resultado final con contenido real
("responder P05–P09 cambia P10; P30 cambia P31…"), pero P05–P47 no
existen todavía — son C7. De las tres variables, solo dos tienen hoy
una interacción real que las produzca: `aciertos_diagnostico` (el
catálogo de preguntas I01–I05, ya construido en T6) y `resultado_boleta`
(I11, ya construida en T8). `perfil_riesgo` la produce I13 (test de
perfil), que es **C5** — no existe todavía. Mismo criterio que C3 dejó
notas para C4/C7 sin construir lo que no le tocaba: C4 construye el
mecanismo genérico completo (funciona para cualquier nombre de
variable, incluida `perfil_riesgo` desde ya, probado a mano) y lo
cablea de punta a punta contra las dos interacciones que sí existen;
la nota para C5 queda en `PLAN-CONTENIDO.md`.

**Qué se construyó:**

- **`state.js` — el almacén.** Un segundo objeto plano `variables`
  (junto a `pantallas`/`indiceActual`/`visitadas`, mismo ciclo de vida:
  se carga en `init()` desde `storage.js` bajo la clave `variables`,
  namespaced por `contenidoId` igual que `progreso`). Tres funciones
  nuevas, expuestas en `OVA.state`: `obtenerVariable(nombre)`,
  `establecerVariable(nombre, valor)` (fija y persiste) e
  `incrementarVariable(nombre, delta=1)` (suma sobre el valor actual,
  arrancando en 0 si no existía — nunca `NaN` por sumar sobre
  `undefined`). `state.js` no sabe qué significan las variables ni
  quién las escribe, mismo espíritu de agnosticismo que ya tiene
  `storage.js` — es un almacén con nombre, no lógica de negocio.
- **Persistencia asimétrica, igual que el progreso — decisión
  deliberada, no un descuido.** Cada `establecerVariable()` escribe en
  `storage.js` (localStorage) y en SCORM (`cmi.suspend_data`, con las
  variables serializadas completas en JSON — SCORM 1.2 no tiene un
  slot propio para "variables de contenido" y tres claves cortas están
  lejísimos del límite de 4096 caracteres), pero `init()` solo restaura
  desde `storage.js`. Es exactamente el mismo patrón que
  `cmi.core.lesson_location` desde T2/T3: se reporta a la LMS en cada
  cambio, nunca se lee de vuelta desde la API. Si hace falta restaurar
  desde `suspend_data` (cambio de dispositivo dentro de Moodle, por
  ejemplo) es trabajo aparte — hoy ningún otro dato del OVA se restaura
  desde la LMS tampoco, no es una inconsistencia nueva de C4.
- **`quiz.js` — quién escribe.** `datos.variable` opcional en
  cualquiera de las ocho preguntas del catálogo (I01–I05 más
  completar/numerica/autoevaluacion): `{ nombre, modo?, valor? }`.
  Modo `"contar"` (por defecto) suma 1 cuando `evaluar()` devuelve
  `"correcto"` — el caso de `aciertos_diagnostico`, una pregunta por
  pantalla que va acumulando. Modo `"fijar"` asigna literalmente
  `datos.variable.valor` en vez de sumar — para una sola pregunta que
  decide un valor categórico de una vez (autoevaluacion queda fuera en
  la práctica: nunca devuelve `"correcto"`, así que este campo no tiene
  efecto ahí, documentado en el encabezado). La escritura vive en
  `comprobar()`, la única función que conoce el resultado real de
  `evaluar()` — ningún constructor de tipo individual sabe de
  variables. **I11 (boleta de compra) es distinta a propósito:** no es
  una pregunta con "correcto/incorrecto", así que no pasa por
  `comprobar()`. `datos.variable.nombre` ahí fija la variable directo
  en `enviar()` con el resultado completo (`{ tipo, ejecutada,
  precioMercado, precioLimite }`) cada vez que se envía la boleta —
  sin modo, porque cada envío siempre reemplaza al anterior.
- **`router.js` — quién lee.** `obtenerResultado()` (la función que
  `PLANTILLAS.L08` ya usaba desde C1, dejada explícitamente como "el
  único lugar que hay que tocar") ahora entiende un campo opcional
  `pantalla.resultado.variable`: si está, lee
  `OVA.state.obtenerVariable(...)` y busca en
  `pantalla.resultado.reglas` (arreglo, evaluado en orden — la primera
  que aplica gana, así que el contenido las ordena de más exigente a
  menos) la que matchea por `valor` (igualdad estricta, para
  categóricos como `perfil_riesgo`) o por `minimo` (`variable >= n`,
  para contadores como `aciertos_diagnostico`). Sin variable con valor
  todavía, o si ninguna regla matchea, cae al par `resultado.cifra`/
  `resultado.retro` estático de siempre — ese es el estado "todavía sin
  responder", no hace falta un tercer camino de código para él. Dentro
  de la cifra elegida, si el contenido omite `cifra.valor`, se completa
  con el valor vivo de la variable tal cual (así `aciertos_diagnostico`
  no se repite a mano en cada regla); si el contenido sí trae un
  `valor` propio, ese gana. `PLANTILLAS.L08` no cambió una sola línea —
  sigue leyendo `resultado.cifra`/`resultado.retro` del objeto que le
  devuelve `obtenerResultado()`, exactamente como anticipó el
  comentario de C1.
- **`content/ova-u1.js` — sin pantallas nuevas.** `s17` (L08) pasa de
  cifra/retro estáticos a `resultado.variable: 'aciertos_diagnostico'`
  con tres reglas por umbral (2/2, 1/2, 0/2) más el par estático de
  "todavía no respondiste". Se reusaron `s07` y `s16` — las dos únicas
  preguntas I01 que ya existían antes de `s17` en el recorrido —
  agregándoles `interaccion.datos.variable`, en vez de escribir
  preguntas nuevas: responder esas dos ya es, de punta a punta, el
  mismo mecanismo que P05–P09 → P10 va a necesitar con las cinco
  preguntas reales de Jose. `s12` (I11, boleta) queda conectado a
  `resultado_boleta`, pero **sin pantalla nueva que la muestre**:
  ninguna pantalla de prueba antes de C7 necesita leerla todavía (eso
  es P43, contenido real). `perfil_riesgo` no tiene productor en este
  contenido de prueba — no hay I13 todavía.

**Verificado con Playwright, abriendo `src/index.html` por `file://`
(tres corridas independientes, sin axe-core esta vez: C4 no agrega
componentes ni marcado nuevo, reusa los mismos DOM de quiz.js/router.js
que T6/T8/C1 ya auditaron — el riesgo de accesibilidad no cambió):**

- Responder `s07` (I01) correcto sube `aciertos_diagnostico` de
  `undefined` a `1`; responder `s16` incorrecto **no** lo sube (se
  queda en `1`) — el modo "contar" solo suma en acierto, nunca en
  fallo ni al reintentar sin acertar.
- `s17` con `aciertos_diagnostico=1` muestra la cifra en vivo (`"1"`,
  sin que el contenido la haya escrito a mano) y el título de la regla
  `minimo:1` ("Vas por buen camino").
- **Recargar la página a mitad del recorrido** (parado en `s17`)
  conserva `aciertos_diagnostico=1` y la pantalla actual (`#s17`) — las
  dos cosas que pide el cierre de C4 sobre persistencia.
- Volver a `s16` y responder correcto esta vez sube la variable a `2`;
  `s17` cambia de verdad a la regla `minimo:2` ("Buen dominio del
  contenido") sin recargar la página — la lectura es en vivo en cada
  montaje de la pantalla, no solo al cargar.
- `s12`: «Enviar boleta» fija `resultado_boleta` con la forma completa
  (`{tipo:"limite", ejecutada:false, precioMercado:1000,
  precioLimite:950}` con los valores por defecto del slider).
- `localStorage` (`ova:u1-contexto-mercado:variables`) trae las dos
  variables juntas tras la corrida completa.
- **Con una API SCORM 1.2 simulada** (mismo mecanismo de T6/C3):
  responder `s07` escribe `cmi.suspend_data` con
  `{"aciertos_diagnostico":1}`, JSON válido.
- **Prueba genérica del almacén, sin depender de ningún contenido:**
  `OVA.state.establecerVariable('perfil_riesgo', 'moderado')` y
  `obtenerVariable()` funcionan solos; dos llamadas a
  `incrementarVariable('contador_prueba')` sin argumento previo dan
  `2` (arranca en 0) — confirma que el mecanismo ya sirve para
  `perfil_riesgo` en cuanto C5 construya I13, sin tocar `state.js` de
  nuevo.
- 320px sin scroll horizontal en `s17` en sus dos estados (sin
  responder y en la regla de `minimo:2`); zoom de texto 200% sin scroll
  horizontal en el estado de `minimo:2`.
- Cero errores de consola en las cuatro corridas (con y sin SCORM
  simulado).

**Cero hex nuevo** en los cinco archivos tocados (`state.js`,
`quiz.js`, `router.js`, `content/ova-u1.js`, `dev/kitchen-sink.html` —
este último solo con un comentario corregido, sin CSS nuevo).

**Kitchen sink:** no se agregó sección nueva (C4 no es un componente
visual, mismo criterio que T2/T6 con el motor y el reporte a SCORM). Se
corrigió un comentario que había quedado falso: la demo estática de
L08 decía "mismos datos que s17 en content/ova-u1.js", y desde esta
sesión `s17` ya no tiene datos estáticos — el comentario ahora aclara
que la demo no depende del router y por eso no puede mostrar el
comportamiento vivo, solo el componente.

**Nota para C5:** cuando exista I13 (test de perfil), fijar
`perfil_riesgo` es una llamada directa a
`OVA.state.establecerVariable('perfil_riesgo', <categoría>)` desde su
constructor en `quiz.js` — mismo patrón que I11 usó para
`resultado_boleta` en esta sesión (una interacción insignia sin
"correcto/incorrecto" fija su variable directo al reportar, sin pasar
por `datos.variable`/modo "contar"/"fijar", que es solo para el
catálogo de preguntas gradables). Ninguna pieza de `state.js` ni de
`router.js` necesita cambiar para eso — ya está probado a mano en esta
sesión con una variable de prueba genérica.

**Nota para C6:** la matriz de retro de seis reglas que cruza
`perfil_riesgo` con la distribución del portafolio (P46/P47,
`PLAN-CONTENIDO.md` §3.1) es de **I12 ampliada**, no de
`obtenerResultado()`/L08 — el mecanismo de "reglas" que construyó C4
resuelve una variable contra un layout de resultado, no dos variables
cruzadas dentro de una interacción. C6 necesita su propia lógica de
matriz dentro de `construirDistribucionCapital`, leyendo
`OVA.state.obtenerVariable('perfil_riesgo')` con
`OVA.state.obtenerVariable` (ya disponible) pero comparando contra la
distribución que el propio widget ya tiene en memoria — no hay que
inventar nada en `state.js` para eso tampoco.

---

**4 sep — C5 cerrada: tres interacciones nuevas (I07, I08, I13), rama
`c5-interacciones-nuevas`, despachadas por la misma tabla de widget
autónomo que T8 ya usaba para I09–I12 — y tres bugs reales encontrados
y corregidos por Playwright antes de cerrar, ninguno hipotético.**

**Decisión de arquitectura, antes de escribir código.** Ninguna de las
tres tiene un "correcto/incorrecto" por opción (I07/I08 son exploración
sin evaluar, I13 suma puntos a una categoría en vez de calificar una
respuesta), así que ninguna encaja en el patrón fieldset/Comprobar/
Reintentar del catálogo de preguntas (I01–I05). Se despachan por
`CONSTRUCTORES_INSIGNIA` — la tabla que T8 había nombrado en singular
para I09–I12 y que, pese al nombre heredado, siempre fue "constructores
de widget autónomo que arman su propio DOM y deciden solo cuándo
reportar a SCORM", no "piezas insignia de unidad" en sentido estricto.
El comentario junto a la tabla en `quiz.js` quedó corregido para decir
esto explícitamente, en vez de dejar que el nombre mienta.

**Qué se construyó, todo en `quiz.js` (documentado en su propio bloque
de encabezado "C5", junto a los de I09–I12):**

- **I07, tarjetas volteables.** Cada tarjeta es un `<button
  aria-expanded>` real (pedido explícito del cierre de C5) con dos caras
  hijas (`.calc-tarjeta__cara--frente/--reverso`) alternadas por
  `hidden`; el ícono cambia de glifo (`help` → `task_alt`) junto con el
  texto visible, nunca solo color, y cada volteo se anuncia por
  `OVA.a11y.anunciar()` (la región compartida, no una propia). Es
  reversible — volver a pulsar la tapa otra vez, no hay candado de una
  sola vía. Al voltear las tres, se revela `retroalimentacion` (si el
  contenido la trae) en un `.calc-resumen` (`role="status"`) y se
  reporta una sola vez a `cmi.interactions` (tipoScorm `other`).
- **I08, comparador de dos columnas.** Nace de un problema real de
  layout, no de decoración: dos columnas angostas con etiquetas largas
  no reflowean a 320px sin scroll horizontal (regla dura 7). En vez de
  una `<table>`, cada fila es un `<button aria-pressed>` que siempre
  muestra las dos columnas apiladas con su etiqueta de columna repetida
  en texto — nunca se oculta ninguna, así que 320px y zoom 200% no
  tienen nada que recortar. Pulsar una fila la marca "en foco de
  comparación" (ícono + `aria-pressed` juntos) y arma la comparación
  como oración en un `.calc-resumen`; una fila activa a la vez, pulsarla
  de nuevo la desactiva. Reporta una sola vez a SCORM al pasar por las
  cuatro filas, mismo criterio que I07.
- **I13, test de perfil con resultado.** Reusa la cáscara
  `.calc-calculadora` de I10–I12: un `<fieldset>`/`<legend>` con radios
  (`.calc-opcion`, mismo grupo nativo que el selector de tipo de orden
  de I11) por pregunta. «Ver resultado» empieza deshabilitado (mismo
  patrón que «Registrar distribución» de I12) y se habilita solo cuando
  las cuatro preguntas están respondidas. Al pulsarlo, suma los puntos
  de las opciones elegidas y busca en `resultados` (evaluado en orden,
  primera que matchea gana) la categoría con `minimo <= total <=
  maximo`; sin match, pasa a `data-estado="error"` en vez de inventar un
  resultado. **`datos.variable` fija la variable de contenido directo
  con la categoría** (`OVA.state.establecerVariable`, sin "modo
  contar/fijar" — eso es solo del catálogo de preguntas gradables) — es
  la nota que C4 dejó pendiente explícitamente para esta sesión: la
  llamada que le faltaba a `perfil_riesgo` desde que el mecanismo
  genérico quedó listo sin productor real. `datos.aviso` agrega el
  descargo orientativo/no-regulatorio como nota aparte del resultado.
- **CSS (`components.css`):** `.calc-tarjetas`/`.calc-tarjeta` (grid de
  tarjetas volteables), `.calc-comparador__*` (filas del comparador,
  reusando el patrón de "ícono + borde cambian juntos" que ya usaba
  "ejecutada" en I11), `.calc-test__opciones` (radios en columna, a
  diferencia de la fila de `.calc-boleta__opciones` — son oraciones
  largas, no "A mercado"/"Límite") y `.calc-calculadora__resultado-aviso`
  (el descargo de I13). Ninguna clase nueva reutiliza `.quiz-` — mismo
  criterio que T8 dejó establecido para toda la familia `.calc-`.
- **`content/ova-u1.js`:** `s23` (L06, I07), `s24` (L06, I08) y `s25`
  (L06, I13), insertadas antes de `s20` (el cierre real), mismo patrón
  que C3 insertó `s21`/`s22`. Datos adaptados de los payloads reales de
  Jose para P13/P28/P30 (`disenoInstruccional/storyboard_data_v2.json`)
  — mismos textos, forma ajustada al contrato de `quiz.js`. `s25` es el
  productor real de `perfil_riesgo` que faltaba desde C4.
- **Kitchen sink:** sección nueva "Interacciones nuevas (C5)" dentro de
  "Componentes", con las tres montadas de verdad vía `OVA.quiz.crear()`
  — mismo criterio que la sección de I09–I12. Se agregaron
  `storage.js`/`state.js` a los `<script>` de la página (no hacían falta
  hasta ahora: ningún componente anterior llamaba a `OVA.state`), en el
  mismo orden de dependencia que ya usa `src/index.html`.

**Tres bugs reales encontrados con Playwright, ninguno hipotético:**

1. **`.calc-tarjetas` no reflowaba a 320px + zoom de texto 200%
   simultáneos.** `grid-template-columns: repeat(auto-fit, minmax(14rem,
   1fr))` — un mínimo de grid en `rem` puro crece con la fuente: a 200%
   de zoom, `14rem` mide 448px, más ancho que el viewport de 320px, así
   que la tarjeta no podía encoger y desbordaba. Es el mismo hallazgo
   que T1.5 dejó documentado el 27 ago para el ancho de lectura de L01
   ("el `%` es lo que de verdad protege bajo zoom, la posición en
   vw/vh no crece con la fuente"), aplicado aquí a un mínimo de grid en
   vez de a un `max-width`. Arreglado con `minmax(min(14rem, 100%),
   1fr)`. Encontrado porque la verificación de 320px/zoom 200% de esta
   sesión, a diferencia de C1–C4, corrió las dos condiciones **a la
   vez** por un orden accidental del script de verificación — combinar
   ambas trampas resultó ser más estricto que verificarlas por separado
   y encontró un bug real que un chequeo separado no habría visto. Vale
   la pena mantener esa combinación en verificaciones futuras.
2. **`OVA.state` no existía en la kitchen sink.** I13 llama a
   `OVA.state.establecerVariable()` directo desde su constructor (mismo
   patrón que I11 desde C4), pero la kitchen sink nunca había cargado
   `state.js`/`storage.js` — ningún componente anterior los necesitaba.
   `TypeError: Cannot read properties of undefined` al pulsar «Ver
   resultado». I11 tiene el mismo código desde C4 pero nunca lo había
   disparado porque su demo de la kitchen sink no le pasa
   `datos.variable` — el bug ya existía en potencia, C5 fue quien lo
   hizo real al querer demostrar `perfil_riesgo` de verdad. Arreglado
   agregando los dos scripts en el orden de dependencia correcto
   (`storage.js` → `scorm.js` → `state.js`, igual que
   `src/index.html`), no envolviendo la llamada en un guard — un guard
   habría enmascarado el mismo bug en producción si algún día
   `src/index.html` cargara los scripts en el orden equivocado.
3. **Falso positivo de axe-core por contraste, no un bug real —
   diagnosticado a fondo antes de descartarlo.** Corriendo axe-core
   sobre `s25` después de responder, recargar y navegar en fila por
   `s23`→`s24`→`s25`, salía intermitentemente (2 de cada 3 corridas)
   una violación de `color-contrast` en `.layout__kicker` y
   `.layout__titulo`, con colores que variaban entre corridas
   (`#828282`, `#a2a2a2`…) y siempre convergían hacia un gris más claro
   que el real. Aislado con ocho recorridos limpios en pantalla fresca
   (sin violación ninguna) contra el mismo recorrido con navegación
   rápida en fila (violación en 4 de 5 intentos): axe-core estaba
   sampleando el color mientras la animación de entrada del contenido
   (`layout-entrada`, ítem 2 del inventario de movimiento,
   opacity+translateY con `--dur-base`/`--stagger`) todavía estaba a
   mitad de camino — el gris "real" tras terminar el fade siempre pasa
   limpio. No es un bug de C5 ni de ningún código tocado esta sesión:
   es una limitación conocida de axe-core con contenido animado,
   confirmada haciendo que la violación desapareciera sola al esperar
   a que la transición terminara antes de auditar, sin tocar una sola
   línea de CSS. Anotado aquí para que quien audite con axe-core en C9
   sepa esperar a que la animación de entrada asiente antes de leer
   resultados de `color-contrast` — si no, va a perseguir un fantasma.

**Verificado con Playwright (Chromium) + axe-core, con una API SCORM
1.2 simulada, abriendo `dev/kitchen-sink.html` y `src/index.html` por
`file://`:**

- **Las tres, en la kitchen sink:** I07 con 3 tarjetas (volteo real con
  Enter en foco, cara reverso visible, ícono cambia a `task_alt`, retro
  general aparece tras voltear las tres, vuelve a tapar y sigue
  reversible); I08 con 4 filas (`aria-pressed` real con Enter en foco,
  resumen anuncia la comparación con el texto de las dos columnas,
  última fila activa, pulsarla de nuevo la desactiva y vacía el
  resumen); I13 con 4 preguntas («Ver resultado» deshabilitado sin
  responder, se habilita al completar las cuatro, puntaje 12 →
  `data-estado="ok"`, etiqueta "Perfil agresivo", aviso visible).
- **320px y zoom de texto 200%, acotado a `#c-nuevas-c5`** (el resto de
  la kitchen sink ya desbordaba a 320px por `.media-audio` de C3 y
  `.dato-tabla` de T7 — confirmado corriendo el mismo chequeo contra el
  estado de la rama antes de los cambios de C5, así que no es
  regresión de esta sesión ni se intentó arreglar, fuera de alcance):
  cero overflow, incluida la combinación 320px + zoom 200% a la vez que
  encontró el bug 1 de arriba.
- **`prefers-reduced-motion`:** la transición de `.calc-tarjeta`
  (compartida por `.calc-comparador__fila`, mismo `var(--dur-fast)
  var(--ease-out)`) mide `0.00001s` emulado, sin duplicar el media
  query — hereda el colapso de `tokens.css`.
- **axe-core (`wcag2a`+`wcag2aa`) en cero violaciones** en `#c-nuevas-c5`
  (con las tres interactuadas, no solo en su estado inicial) y en las
  tres pantallas nuevas de `src/index.html` (`s23`/`s24`/`s25`, con la
  espera a que la animación de entrada asiente — ver el bug 3).
- **Recorrido de teclado real (Tab, no clic) por las tres seguidas:** 3
  botones de tarjeta → 4 botones de fila → 4 entradas de grupo de radio
  (una por fieldset de pregunta — cada grupo de radios es su propia
  parada de Tab, correcto) → el foco sigue de largo al contenido
  siguiente de la página porque «Ver resultado» está `disabled` hasta
  responder las cuatro, igual que `.boton:disabled` en el resto del
  proyecto. Nada inalcanzable, nada atrapado.
- **`src/index.html`, con una API SCORM 1.2 simulada:** navegar a
  `#s23`/`#s24`/`#s25` monta cada interacción real vía
  `PLANTILLAS.L06`/`crearInteraccion()`, sin cambios en `router.js` —
  el mismo despacho genérico por `interaccion.tipo` que ya servía a
  I01–I05/I09–I12 sirve a I07/I08/I13 sin tocarlo. Responder las cuatro
  preguntas de `s25` y pulsar «Ver resultado» deja
  `OVA.state.obtenerVariable('perfil_riesgo') === 'agresivo'`
  (puntaje 12); recargar la página conserva el valor — la persistencia
  genérica de C4 funciona igual para el productor nuevo, sin tocar
  `state.js`.
- Cero errores de consola propios en toda la corrida (aislado el ruido
  conocido de axe-core bajo `file://` que T9 ya documentó, y el 404
  esperado de la imagen de avatar de C3 que todavía no existe).

**Cero hex nuevo** en los cuatro archivos tocados (`quiz.js`,
`components.css`, `content/ova-u1.js`, `dev/kitchen-sink.html`).

**Nota abierta para C7**, dejada también en `PLAN-CONTENIDO.md` junto al
cierre de C5: el storyboard real de Jose ubica P13/P28 en layout L05
("tarjetas comparativas"), no en L06 como las pantallas de prueba de
esta sesión — `PLANTILLAS.L05` hoy no tiene ranura para `interaccion`.
C7 decide si extiende L05 o convierte esas dos pantallas a L06/L07;
ninguna de las dos requiere tocar `quiz.js`, el contrato de
`interaccion.datos` para I07/I08 ya está completo y probado.

---

**4 sep — C6 cerrada: I09/I10/I11/I12 ampliadas contra los payloads
reales de Jose, en rama `c6-interacciones-ampliadas` — sin Playwright
disponible en esta sesión (a diferencia de T1–T8/C0–C5), verificado en
su lugar con lectura de código y los `casos_prueba` de Jose corridos a
mano contra la lógica extraída (Node, fuera del navegador). Detalle
completo, incluido el contrato exacto de cada tipo, en el bloque "C6"
del encabezado de `quiz.js` — resumen aquí de qué cambió y por qué.**

**I09 se reemplaza, no se amplía.** El brief (P37) no pide reordenar
pasos, pide recorrer tres momentos con estado inicial y final —una
interacción distinta a la "línea de tiempo ordenable" que T8 construyó.
Como ninguna otra pantalla del storyboard usa I09 (confirmado por
búsqueda contra `storyboard_data_v2.json`), no había contenido real que
dependiera del modo anterior: `construirLineaTiempoOrdenable` (arrastre
+ botones mover antes/después + orden correcto) se borró y
`construirLineaTiempoRecorrible` ocupa su lugar en
`CONSTRUCTORES_INSIGNIA.I09`. A diferencia de completar/numerica/
autoevaluacion (T6, conservados sin número porque algo los sigue
usando), aquí no había nada que conservar en paralelo. El widget nuevo
muestra un panel a la vez (estado inicial → cada momento → estado
final) con «Anterior»/«Siguiente», anuncia cada paso por
`OVA.a11y.anunciar()` (posición + título + descripción, no solo el
título — se agregó la posición explícita después de una relectura
propia: el indicador visual "Paso X de Y" es `aria-hidden` y sin el
número en el anuncio esa información se habría perdido para quien
navega sin pantalla) y reporta a `cmi.interactions` una sola vez al
llegar al final, con la retro de cierre si el contenido la trae.

**I10 pasa de un resultado a varios, con catálogo de fórmulas
ampliado.** `datos.salida` (objeto) pasa a `datos.salidas` (arreglo);
cada fórmula de `FORMULAS_CALCULADORA` devuelve `{ valores: {id:
number} }` en vez de `{ valor }`. Se sumaron `valorizacion` (P22, cinco
salidas: monto invertido, diferencia por acción, variación %,
ganancia/pérdida, monto final bruto) y `dividendo_por_accion` (P24,
tres salidas: monto a repartir, dividendo por acción, dividendo del
estudiante) — los ids de `entradas` son los del payload de Jose tal
cual (`precio_compra`, `utilidad_neta`, etc.), sin traducir a
camelCase, para que la conversión de C7 no tenga que reescribirlos.
Nuevo campo opcional `datos.mensajes` (positivo/cero/negativo): la
fórmula decide su propio `signo` y el motor hace el lookup, mostrado en
vivo bajo los resultados. Las salidas ya no anuncian cada una por su
cuenta: un único `<output class="calc-calculadora__resultados">`
envuelve todas las filas (más el mensaje) para que un lector de
pantalla reciba un solo anuncio por recálculo en vez de N simultáneos.
`datos.accion` (opcional) reemplaza el texto fijo "Registrar
valorización" del botón, que ya no describía bien la fórmula de
dividendo. **Bug real encontrado en revisión propia, no por
Playwright, y corregido antes de cerrar:** el estado de error (tasa de
descuento ≤ crecimiento) dejó de pintarse en rojo en el primer borrador
porque `dataset.estado` se puso en el `<output>` envolvente nuevo en
vez de en la fila `.calc-calculadora__resultado` que las reglas CSS de
`[data-estado="error"]` realmente seleccionan — las reglas CSS
heredadas de T8 nunca se tocaron, así que el bug era puramente de dónde
se escribía el atributo. Corregido escribiendo `dataset.estado` en la
fila, como siempre.

**I11 pasa de "boleta de compra" a la tabla de verdad completa de ocho
filas de P42.** `construirBoletaCompra` se reemplazó por
`construirBoletaOrden`: comprar o vender (selector nuevo, además del de
tipo mercado/límite que ya existía), un escenario fijo
(`escenario.saldo`/`escenario.titulosDisponibles`, mostrado como texto
de contexto, no sliders) y una `cantidad` que sí es slider. La regla de
ejecución evaluada a mano contra los tres `casos_prueba` de Jose:
comprar a mercado con saldo suficiente → ejecutada; comprar a límite
por debajo del precio actual → expuesta; vender más títulos de los
disponibles → rechazada (sin importar el tipo de orden, el saldo/
títulos manda antes que el precio). Estados nuevos en CSS:
`[data-estado="rechazada"]` (rojo, ícono `block`) y `expuesta` (sin
regla propia, el mismo neutro que ya tenía "pendiente"). Se decidió
deliberadamente NO construir un campo de vigencia — ninguna fila de la
tabla de verdad ni ningún caso de prueba distingue por vigencia, solo
aparece como texto fijo en la descripción de "expuesta"; añadirlo
habría sido decoración sin señal de prueba que lo respalde. Lectura
propia, documentada para poder corregirla sin arqueología de código si
el storyboard real termina necesitando que la vigencia sí afecte el
resultado.

**I12 suma la matriz de retro por perfil de riesgo de P46.** Nuevo
campo opcional `datos.reglas`: un vocabulario mínimo de condiciones
(`{emisor, operador, valor|min/max}` para comparar un emisor,
`{tipo:'ningunoSupera'|'algunoSupera', valor}` para comparar contra
todos a la vez) que cubre las seis reglas reales de Jose sin ser un
parser de lenguaje natural — C7 traduce el texto de la matriz una sola
vez, igual que ya traduce `resultado.reglas` para L08. Sin
`perfil_riesgo` todavía en `OVA.state` (I13 no respondida) o sin
`reglas` en los datos, el componente se comporta exactamente como
antes de C6: valida la suma a 100 % y no muestra nada de perfil — el
mismo "sin dato todavía" que L08/C4 ya establecieron, no un caso
especial nuevo. Con perfil conocido, la retro se recalcula en vivo bajo
el total (visible solo con la suma completa) y se repite una vez, de
forma explícita, en el resumen `role="status"` al registrar. Sin match
dentro del perfil, un mensaje genérico en vez de inventar una categoría
que Jose no escribió — mismo criterio que el "sin match" de I13.
Validado a mano contra las seis reglas de la matriz real (ver la
corrida de Node en la nota de abajo): las seis resuelven al índice de
regla esperado, incluido el caso sin match (conservador con Petrocaribe
en 34 %, que cae al genérico).

**Verificación de esta sesión, sin Playwright disponible:**

- **Sintaxis:** `node --check src/js/quiz.js` y `node --check
  src/content/ova-u1.js` sin errores; los 14 bloques `<script>` de
  `dev/kitchen-sink.html` se extrajeron y se pasaron por `new
  Function()` uno a uno, sin errores; balance de llaves de
  `components.css` verificado a cero; balance de etiquetas HTML de
  `kitchen-sink.html` comparado contra la versión de HEAD antes de
  esta sesión — el único desbalance que aparece (`<main>` sin
  `</main>` antes de `</body>`) ya existía antes de C6, no es
  regresión de esta sesión.
- **Lógica de negocio, corrida en Node fuera del navegador** (la
  fórmula/regla se copió literal desde `quiz.js`, no reimplementada
  aparte): los tres `casos_prueba` de `valorizacion` (P22) y de
  `dividendo_por_accion` (P24) dan exactamente los resultados que
  Jose documentó; los tres `casos_prueba` de la boleta (P42) dan
  ejecutada/expuesta/rechazada como corresponde; las seis reglas de la
  matriz de retro (P46) resuelven al índice esperado, incluido un caso
  sin match.
- **Cero hex nuevo** en los cuatro archivos tocados (`git diff` filtrado
  contra `#[0-9a-f]{3,8}`, cero coincidencias en líneas agregadas).
  Cero `outline: none` ni `innerHTML` nuevo.
- **Lo que falta verificar con Playwright cuando esté disponible** (no
  se dio por cerrado a ciegas, queda anotado explícitamente): recorrido
  de teclado real por los nueve controles nuevos de I11 (dos fieldsets
  más que antes) y por «Anterior»/«Siguiente» de I09; que
  `OVA.a11y.anunciar()` efectivamente llegue al lector de pantalla en
  cada paso del recorrido; 320px y zoom de texto 200% sobre el
  `<output>` envolvente de I10 (cinco filas + mensaje, más contenido
  vertical que antes) y sobre las dos fieldsets nuevas de I11;
  axe-core en las tres instancias de I12 de la kitchen sink (con la
  retro visible); que las tres instancias de I12 en paralelo de la
  kitchen sink no se pisen entre sí de forma confusa para quien las
  prueba (documentado en un comentario dentro del propio
  `kitchen-sink.html`, es una limitación de tener tres demos
  compartiendo el mismo `OVA.state`, no del componente).

**Contenido de prueba (`content/ova-u1.js`):** s11 (I10) se actualizó
al contrato nuevo sin cambiar su matemática; s12 (I11) pasa de "compra
de Petrocaribe" a la boleta completa de P42 (Banco del Sur); s13 (I09)
pasa de "ordenar etapas de un repo" a "recorrer" los momentos reales de
P37; s14 (I12) suma `reglas`/`aviso` pero se queda ANTES de s25 (I13)
a propósito, para ejercitar el camino "sin perfil todavía"; s26 (I12),
nueva, después de s25, ejercita la matriz viva contra el perfil que el
estudiante acaba de obtener. Detalle de la decisión de mantener s14
antes de s25 en el encabezado del archivo de contenido.

**Kitchen sink:** la sección "Interacciones insignia" se reescribió
completa — I10 con tres instancias (una por fórmula, cada una
arrancando en el primer `caso_prueba` real de Jose, con los otros dos
casos anotados en el título de la tarjeta para moverlos a mano); I11
con una instancia arrancando en el caso 2 (expuesta) con los otros dos
a un clic/arrastre; I09 con la operación repo de P37 tal cual; I12 con
tres instancias, una por `perfil_riesgo`, cada una fijando la variable
con `OVA.state.establecerVariable()` antes de montarse — con una nota
en el propio HTML explicando que comparten un solo `OVA.state` (como
en la app real, donde solo hay un estudiante a la vez) así que mover
sliders después de que las tres estén montadas hace que las tres lean
el último perfil fijado.

---

**4 sep (sesión siguiente) — C7 cerrada, rama `c7-conversion-storyboard`:
las 47 pantallas reales de Jose (P01–P47) reemplazan por completo el
contenido de prueba de C0–C6 en `content/ova-u1.js`, con tres huecos
reales del motor descubiertos y resueltos en el camino (no solo
conversión mecánica).**

**El script de conversión existe de verdad, pero no es 100 % automático
— y eso es correcto, no un atajo.** `disenoInstruccional/
storyboard_data_v2.json` mezcla dos formatos de `payload_interaccion`:
un formato de texto con pipes (`"I01 | Enunciado: … | Opciones: … |
Correcta: A | …"`) para I01/I02/I07/I08, y JSON estructurado para
I09–I13. Lo primero se parsea mecánicamente (mismo criterio en las
nueve pantallas que lo usan); lo segundo se reformatea mecánicamente
contra el contrato exacto de `quiz.js`. Lo que el storyboard **no**
fija de forma estructurada — qué imagen de avatar usa cada pantalla,
las rutas de motion/infografía todavía sin producir, los rangos de
slider que Jose no especificó para I11, el empaquetado de cifra/retro
de L08 — es autoría de esta sesión, tomada contra las reglas que
`PLAN-CONTENIDO.md` ya había fijado (no inventada sobre la marcha) y
documentada en el encabezado de `content/ova-u1.js` y en la lista de
pendientes más abajo. El script vive en el scratchpad de la sesión, no
en el repo — es una herramienta de conversión de un solo uso, no
código de producto; el resultado versionado es `content/ova-u1.js`.

**Tres huecos reales del motor, encontrados al convertir, no
anticipados por el plan — los tres resueltos, no rodeados:**

1. **L08/L10/L13 no tenían ninguna ranura de media.** Las ocho
   pantallas reales de esos tres layouts que llevan narración de
   avatar (P10/P31/P43/P47 en L08; P35 en L10; P36/P40/P44 en L13) no
   tenían dónde montarla — ninguna de las tres plantillas renderizaba
   `pantalla.media` en absoluto. Se agregó el mismo patrón opcional que
   L09 ya usaba (`if (pantalla.media) raiz.appendChild(crearMedia(…))`)
   a las tres, en `router.js`.
2. **L05 no tenía ranura de interacción.** Nota abierta que había
   dejado C5: el storyboard real ubica P13 (I07) y P28 (I08) en L05,
   no en L06. Se resolvió a favor de L05 (el layout que Jose eligió),
   no convirtiendo las pantallas a L06: `PLANTILLAS.L05` acepta
   `pantalla.interaccion` como alternativa a `pantalla.tarjetas` —
   I07/I08 ya son en sí mismas la disposición de tarjetas comparables
   que promete el layout, no hacía falta una tarjeta de solo lectura
   por delante. De paso, P29 trae un disclaimer de una línea que no es
   una cuarta tarjeta comparable (`pantalla.nota`, nuevo). Las dos
   capacidades llevan su propio tratamiento en `layouts.css`
   (`.layout--l05 .layout__interaccion` reusa los tokens de la caja de
   L06; `.layout--l05 .layout__nota` usa `--text-secondary`).
3. **`obtenerResultado()` solo comparaba la variable completa contra
   `resultado.reglas`.** P43 (L08) necesita leer el subcampo `estado`
   de `resultado_boleta`, que I11 fija como un objeto
   (`{operacion,tipo,estado,…}`), no un valor simple — P10/P31/P47 no
   lo necesitaban porque sus variables ya eran valores simples.
   `resultado.campo` (opcional, nuevo) le dice a `obtenerResultado()`
   qué subcampo leer antes de evaluar las reglas; sin él, el
   comportamiento es idéntico al de antes.
4. **Falta uno más, de producción, no de contrato: `media.js` no tenía
   ningún tipo para una imagen fija sin controles.** Ocho pantallas del
   storyboard real (motion sin avatar en P17/P21/P23, infografía en
   L02/L03 en P14/P27/P33/P41/P45) necesitan un recurso visual que no
   es video con controles ni avatar con locución — es una imagen o un
   video decorativo cuyo archivo real (SVG/mp4) todavía no existe.
   `media.js` suma un tercer tipo, `"imagen"` (`{tipo, src, alt?}`, sin
   controles de reproducción), y tanto "imagen" como "video" degradan
   ahora a `.media-marcador` (mismo lenguaje visual que `.layout__figura`
   de L11: `--surface-subtle` + `--text-tertiary`) cuando la fuente
   falla, en vez de una `<img>` rota o un reproductor con controles que
   nunca van a funcionar — mismo criterio que C3 ya estableció para el
   avatar. **Bug real encontrado por Playwright antes de cerrar, no
   hipotético:** el primer intento de degradar "video" solo escuchaba
   `error` en el propio `<video>`; bajo `file://` con un único
   `<source>` que no existe, Chromium llega a `networkState ===
   NETWORK_NO_SOURCE` sin disparar `error` en el `<video>` — hubo que
   escuchar también en el `<source>` (guardado contra doble disparo).
   Confirmado con Playwright tras el arreglo: `p17` (motion sin
   producir) degrada limpio a `.media-marcador` con los controles
   ocultos.

**Decisiones de contenido, la parte que de verdad importa (detalle
completo en el encabezado de `content/ova-u1.js`, no repetido aquí):**

- **Kicker**: `unidad_capsula` del storyboard (`"Unidad 1 / Cápsula
  2"` → `"Unidad 1 · Cápsula 2"`), mecánico en las 47 salvo p01 (usa el
  antetítulo real de Jose como kicker de la portada, no una etiqueta
  de unidad).
- **Avatar (14 pantallas)**: `imagen` sale de la asignación de
  plano/fondo de `PLAN-CONTENIDO.md` §5, numerada secuencialmente
  dentro de cada grupo — 14 referencias contra ~12 imágenes reales que
  Juan produce; qué archivo numerado reutiliza para cuáles pantallas
  es su decisión. `transcripcion` es la `locucion` del storyboard sin
  la marca de tiempo final; sin `audio` todavía (Juan las graba
  aparte) — degrada a imagen + transcripción directa, el placeholder
  de producción que exige la regla dura 10 de CLAUDE.md.
- **Diagnóstico → `aciertos_diagnostico`** (P05–P09 escriben, P10 lee):
  el storyboard no declara esta dependencia en su propio campo
  `dependencias` (vacío en las cinco), pero `PLAN-CONTENIDO.md` §3.1 la
  fija explícitamente y el propio texto de P10 (umbrales 0–2/3–4/5)
  solo tiene sentido contra un diagnóstico de cinco preguntas.
- **I12 (P46)** reusa tal cual `categorias`/`reglas`/`aviso` que C6 ya
  había validado a mano contra este mismo payload en `s14`/`s26` del
  contenido de prueba — no se re-derivó nada.
- **P03** (L12) pierde la línea de atribución del storyboard ("World
  Bank Global Findex 2025"): L12 no tiene una ranura de fuente aparte
  del cuerpo. Queda en la lista de revisión, no se extendió el layout
  para un solo caso sin confirmar antes con Jose si debe ser visible.

**Verificado con Playwright (el atajo de `NODE_PATH` sobre el
Playwright cacheado por `npx` seguía funcionando esta sesión), Chromium
real, dos páginas:**

- `src/index.html`: recorrido completo de las 47 pantallas de punta a
  punta con clics reales (el botón «Comenzar» de la portada en p01,
  «Siguiente» del resto) — los 47 títulos coinciden exactamente con
  los de `storyboard_data_v2.json`, en el mismo orden P01→P47, cero
  caída al estado de error del motor (`[role="alert"]` nunca
  aparece). Los únicos errores de consola son `ERR_FILE_NOT_FOUND` de
  las rutas de avatar/motion/infografía todavía sin producir — el
  degrade esperado, no un fallo. Verificado además, puntual: p42 (I11)
  arranca en el estado "expuesta" (el caso que enseña la diferencia
  entre mercado y límite); p13/p28 (L05 + interacción) montan I07/I08
  de verdad dentro de `.layout--l05`; p29 muestra la nota debajo de
  las tarjetas; p10/p31/p43/p47 muestran el avatar dentro de L08; 320px
  sin scroll horizontal en una muestra de cinco pantallas
  representativas (p01, p13, p22, p42, p46).
- `dev/kitchen-sink.html`: las cinco piezas nuevas (imagen, video
  degradado, L05 con interacción, avatar en L08/L10/L13) montan sin
  errores de consola nuevos. El desborde a 320px de la página completa
  sigue presente — es el hallazgo ya documentado por T7/T8 (la tabla
  `.dato-tabla` y componentes de T1–T4 desbordando bajo la condición
  combinada de la página entera, pendiente de la auditoría de T9/C9),
  confirmado con un barrido de `getBoundingClientRect()` que ninguno
  de los elementos nuevos de esta sesión está entre los que desbordan.

**No se corrió axe-core esta sesión** (no estaba cacheado como sí lo
estaba Playwright) — queda para C9, que de todas formas audita las 47
pantallas completas.

**Lista de revisión para Jose/Juan, antes de dar C7 por completamente
cerrado en producción (nada de esto bloquea la navegación ni el
demo, todo está documentado también en el encabezado de
`content/ova-u1.js`):**

1. Confirmar los 14 nombres de archivo de avatar asignados por esta
   sesión (`public/img/avatar/avatar-{plano}-{fondo}-{n}.webp`) contra
   las ~12 imágenes que Juan realmente produzca — puede que reasigne
   cuál archivo numerado sirve a cuáles pantallas.
2. Producir (o encargar) los cuatro motion de P02/P17/P21/P23 en
   `public/videos/motion/` y las cinco infografías de
   P14/P27/P33/P41/P45 en `public/img/infografia/` — las rutas ya
   están en el contenido, apuntando a archivos que todavía no existen
   a propósito.
3. Decidir qué hacer con la atribución de P03 ("World Bank Global
   Findex 2025") que L12 no tiene dónde mostrar hoy.
4. Los rangos de slider de precioActual/precioLimite/cantidad de la
   boleta de P42 (L11 no los trae Jose, solo el escenario) y las
   unidades/decimales de las salidas de I10 (P22/P24) son autoría de
   esta sesión — revisar que el rango se sienta bien en la práctica,
   no solo que sea matemáticamente correcto.
5. Los títulos y el empaquetado de cada regla de L08 (P10/P31/P43/P47)
   son autoría de esta sesión sobre las frases reales de Jose, no
   texto inventado — pero sí es texto nuevo (un título por regla) que
   vale la pena que alguien más lea antes de producción.
6. Pendiente de C9: pasada completa de axe-core sobre las 47 pantallas
   reales (no solo sobre contenido de prueba) y verificación de zoom
   de texto 200% sobre las cinco piezas nuevas del motor.

**Qué queda para C8/C9, en concreto:**

- **C8** engancha los cuatro descargables reales de P34 (hoy
  `href: '#'`, cuatro tarjetas sin archivo detrás) y produce/ubica los
  assets de audio/motion/infografía de la lista de arriba.
- **C9** repite el cierre de T9 (empaquetado SCORM, auditoría axe-core,
  Moodle) contra las 47 pantallas reales en vez del contenido de
  prueba — la primera vez que el paquete completo se prueba con
  contenido de producción de punta a punta.

---

## PLAN-REDISENO.md (D0–D10)

Plan vigente desde el 5 de septiembre — ver `PLAN-REDISENO.md` para las
diez tareas y el porqué de cada decisión de la sección 0. Corre después
de C7, antes de cerrar C8/C9.

- [x] **D0 · Higiene de rama** — el árbol ya estaba limpio (C7 se
      mergeó directo a `master`, commit `df90e89`); se abrió
      `d-rediseno-chrome` desde ahí el 5 sep.
- [x] **D8 · Capa de assets dummy** — completada 5 sep, sobre
      `d-rediseno-chrome`. Detalle abajo.
- [x] **D1 · Jerarquía como dato: Unidad › Cápsula › Tema** — completada
      5 sep. Detalle abajo.
- [x] **D2 · Barra superior inverse** — completada 5 sep. Detalle abajo.
- [x] **D3 · Progreso en porcentaje** — completada 5 sep. Detalle abajo.
- [x] **D4 · Padding lateral de escritorio** — completada 5 sep. Detalle abajo.
- [x] **D5 · Preferencias del curso** — completada 5 sep. Detalle abajo.
- [x] **D6 · Autolocución** — completada 6 sep. Detalle abajo.
- [ ] D7, D9, D10 · pendientes.

**5 sep — D8 cerrada: capa completa de assets dummy en rutas de
producción exactas, más un hueco real del motor encontrado al mirar el
curso completo por primera vez (L04 nunca montaba `pantalla.media`,
resuelto).**

**Por qué esta tarea va antes que las demás del plan (sección 0, punto
2):** de los 28 archivos de media que el contenido real ya referenciaba,
solo existían los 4 PNG de referencia de avatar — ninguna infografía,
ningún motion, ningún audio de avatar. El curso completo degradaba a
placeholder o a transcripción sola; no se podía *mirar*, y mirarlo es lo
que este plan necesita para las decisiones de D1–D9. Nada de esto es
producción final: es la capa que hace que sustituir sea sobrescribir un
archivo, no volver a tocar `content/ova-u1.js`.

**Herramientas de esta sesión, ninguna nueva en el proyecto —
Pillow y Playwright se usaron solo como herramientas de generación y
verificación, no quedan como dependencias del OVA (regla dura 5, que es
sobre dependencias en tiempo de ejecución del propio OVA, no sobre las
herramientas de autoría):** `pip install pillow` ya estaba disponible;
se instalaron además `cairosvg` (falló: pide `libcairo` nativo, no
disponible en Windows sin instalar aparte — abandonado) y `playwright`
(sí funcionó: reutilizó el Chromium ya cacheado en
`~/AppData/Local/ms-playwright` por una sesión anterior de Node, sin
descargar nada nuevo). `ffmpeg` ya estaba instalado en el sistema
(`~/Documents/ffmpeg`).

**Los 14 avatar — recortes reales por plano, no reencuadres
genéricos.** Los 4 PNG de `public/img/avatar/` (dos retratos de
"Claudia", uno de "Sofia", uno de gesto de cuerpo completo) se
recortaron con Pillow contra un punto de anclaje propio por foto (centro
aproximado de la cara, fijado a mano mirando cada imagen) y tres niveles
de zoom — abierto (~98% del lado menor, casi el encuadre completo),
medio (~60%) y primer plano (~30–36%, functionally sin fondo: a esa
distancia focal el óvalo de fondo que sobrevive en las esquinas queda
fuera del círculo de 48px que pinta `.media-audio__avatar` en pantalla).
Salida 640×640 webp calidad 82. Los 14 nombres exactos ya estaban
fijados por `content/ova-u1.js` (C7) y por `PLAN-CONTENIDO.md` §5 — no
se inventó nomenclatura nueva, solo se llenaron los archivos que
faltaban. **Nota real para producción:** "sin fondo" aquí es una
aproximación por recorte agresivo + máscara circular del componente, no
una separación de fondo real (rotoscopia/croma) — si el avatar llega a
mostrarse más grande que el círculo de 48px actual en algún rediseño
futuro, esa aproximación deja de sostenerse y hace falta la separación
real.

**Las 5 infografías — SVG dibujados a mano contra el contenido real de
cada pantalla, no cajas grises.** Cada una traza la estructura que la
pantalla explica, con paths de conexión reales (`class="trazo"`, con
`stroke`, ninguno solo relleno) para que D9 pueda animarlos con
`stroke-dasharray`/`stroke-dashoffset` sin rehacer el SVG:

  - `p14-renta-variable.svg` — las tres familias del mercado con
    "Acciones" anidada en renta variable, bifurcada en "Puedes ganar"
    (valorización, dividendos) y "Puedes perder" (precio a la baja, sin
    reparto) — ícono + texto + color en los dos desenlaces, nunca solo
    color (regla dura 3).
  - `p27-derechos-politicos-economicos.svg` — una acción bifurcada en
    derechos políticos (participación y voto) y económicos (dividendos y
    beneficios patrimoniales).
  - `p33-tres-bolsas-nuam.svg` — tres tarjetas (Colombia/Perú/Chile) con
    bolsa, supervisor y depósito; sin banderas a propósito (fuera de
    alcance de CLAUDE.md cualquier cosa que lea como selector de país —
    esto es contenido neutro sobre las tres bolsas, no una variación por
    país).
  - `p41-mercado-vs-limite.svg` — orden a mercado (ejecución inmediata)
    frente a orden límite (puede no ejecutarse), cada resultado con su
    propio ícono, no solo el texto.
  - `p45-tres-emisores.svg` — Petrocaribe/Andina Cementos/Banco del Sur
    con medidor de tres barras por nivel de riesgo y el nivel repetido
    como texto explícito debajo (regla dura 3: el número de barras
    llenas nunca es el único código).

  **Excepción documentada a la regla dura 1 de CLAUDE.md, la misma que
  ya cubre `public/graf/union_graf_nuam.svg` desde T1.5:** un SVG
  cargado como `media.tipo:'imagen'` (`<img src>`) es un documento aparte
  que no puede leer los custom properties de `tokens.css` del documento
  host. La paleta de los cinco se copió literal de `tokens.css` el 5 sep
  y queda anotada dentro de cada SVG (comentario con el valor exacto de
  cada token usado) para poder mantenerla en sincronía si `tokens.css`
  cambia. viewBox `0 0 1600 900` (16:9 exacto, igual que
  `.media-marcador`) para que `object-fit: cover` no recorte nada.
  Verificados renderizando cada uno con Chromium vía Playwright (ver
  herramientas arriba) — los cinco se ven completos, sin overflow, con
  el trazo de conexión donde corresponde.

**Los 4 motion — recortes reales del único video con el que cuenta el
proyecto, no clips inventados.** `public/videos/woman_Businesswoman_
1920x1010.mp4` (5.1s, sin pista de audio) recortado con ffmpeg en cuatro
ventanas de 3s con arranque escalonado (0.0/0.5/1.0/1.5s) para que los
cuatro no sean el mismo frame congelado, reencodeado a h264/libx264
(`-an`, sin audio: el original no la trae) a
`public/videos/motion/p02-objetivos-aprendizaje.mp4`,
`p17-propiedad-fraccionada.mp4`, `p21-caso-petrocaribe.mp4` y
`p23-dividendo-reparto.mp4` — los cuatro nombres que ya fijó C7.

**El audio de las 14 pantallas de avatar — cableado del contrato, no
archivos nuevos.** `public/audio/demo-avatar.mp3` (6s) y
`public/audio/loc1_objetivos.mp3` (15s) ya existían en el repo sin que
ninguna pantalla los referenciara todavía (campo `media.audio` muerto
desde C3). Se agregó `"audio"` a las 14 pantallas de avatar
(p01/p04/p10/p12/p16/p20/p26/p31/p35/p36/p40/p43/p44/p47), alternando
los dos archivos 7/7 en el orden en que aparecen. Ninguno de los dos
dura lo mismo que su transcripción — es el desfase esperado del
placeholder, no un bug: la transcripción sigue siendo la fuente real
(regla dura 10), el audio solo deja de estar mudo.

**Hueco real del motor encontrado al recorrer el curso completo por
primera vez, no anticipado por el plan — resuelto, no rodeado:**
`PLANTILLAS.L04` (router.js) nunca montaba `pantalla.media`, solo
`pantalla.datos` — un comentario propio en `layouts.css` ya lo dejaba
anotado desde T7 ("el brief pide además imagen de apoyo opcional
(media)... sigue sin admitirla, queda pendiente para C1") y C1 nunca lo
cerró. Como P02 (real, motion con transcripción) es la única pantalla
que usa L04 con `media`, esto era invisible en todas las verificaciones
anteriores (P02 nunca lanzaba error: `crearMedia` simplemente no se
llamaba) hasta que D8 le dio un archivo real a esa ruta y la pantalla
seguía sin mostrar nada. Mismo patrón que ya usan L08/L09/L10/L13
(`if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media))`);
en `layouts.css`, `.layout__media` de L04 comparte el mismo
`max-width: 42rem` que ya tenía `.layout__datos` (mismo ancho de
lectura, no un layout de imagen a ancho completo).

**Verificado con Playwright (Chromium cacheado, ver herramientas
arriba), `src/index.html` por `file://`:**

- Recorrido completo de las 47 pantallas reales con clics reales
  (`.boton--portada` en p01, `#nav-siguiente` en el resto): cero errores
  de consola, cero `pageerror`, cero `<img>` con `naturalWidth === 0`,
  cero `.media-marcador` visible sin `<img>`/`<video>` real encima (la
  condición exacta del cierre de D8).
- Pasada aparte sobre `<video>`/`<audio>` de las 47: cero
  `networkState === NETWORK_NO_SOURCE` y cero `.error` — los cuatro
  motion y las 14 pistas de avatar cargan de verdad (`readyState 4` /
  dimensiones reales confirmadas en p02: 1920×1010).
- 320px sin scroll horizontal en las ocho pantallas con media nueva
  (p01, p02, p12, p14, p27, p33, p41, p45) — `scrollWidth` de `html` y
  `body` iguales a su `clientWidth` en los ocho casos.
- `dev/kitchen-sink.html`: se ajustó `IMAGEN_AVATAR_DEMO` de
  `avatar-medio-confondo-3.webp` (que D8 acaba de producir de verdad) a
  `avatar-demo-inexistente.webp` — mismo patrón que ya usan
  `demo-tres-familias.svg` y `demo-inexistente.mp4` en el mismo archivo:
  esa demo existe justamente para mostrar la degradación a círculo
  vacío, y habría dejado de demostrarla en silencio si se apuntaba a un
  archivo que D8 volvió real. Recargada tras el cambio: exactamente 3
  `ERR_FILE_NOT_FOUND` (los tres paths deliberadamente inexistentes),
  cero error nuevo.

**Cero hex nuevo** en los dos archivos de código tocados (`router.js`,
`layouts.css` — `git diff` filtrado contra `#[0-9a-f]{3,8}`, cero
coincidencias en líneas agregadas). Los hex dentro de los cinco SVG son
la excepción documentada de arriba, no código del proyecto.

**Capa de placeholder — lista exacta para producción audiovisual**
(la que pide el cierre de D8; sustituir cualquiera de estos es
sobrescribir el archivo en su misma ruta, sin tocar
`content/ova-u1.js`):

| Ruta | Qué es hoy | Qué debe reemplazarlo |
|---|---|---|
| `public/img/avatar/avatar-abierto-confondo-{1..4}.webp` | Recorte grande de una de las 4 fotos de referencia | Fotografía real del avatar elegido, plano abierto, con fondo |
| `public/img/avatar/avatar-medio-confondo-{1..4}.webp` | Recorte medio de una de las 4 fotos de referencia | Fotografía real, plano medio, con fondo |
| `public/img/avatar/avatar-primerplano-sinfondo-{1..6}.webp` | Recorte muy cerrado (sin separación real de fondo) | Fotografía real, primer plano, con separación de fondo real |
| `public/img/infografia/p14-renta-variable.svg` | Diagrama vectorial propio, paleta de marca | Diagrama final de producción (mismas dimensiones 16:9) |
| `public/img/infografia/p27-derechos-politicos-economicos.svg` | ídem | ídem |
| `public/img/infografia/p33-tres-bolsas-nuam.svg` | ídem | ídem |
| `public/img/infografia/p41-mercado-vs-limite.svg` | ídem | ídem |
| `public/img/infografia/p45-tres-emisores.svg` | ídem | ídem |
| `public/videos/motion/p02-objetivos-aprendizaje.mp4` | Recorte de 3s de `woman_Businesswoman_1920x1010.mp4`, sin relación con el guion | Motion real de P02 |
| `public/videos/motion/p17-propiedad-fraccionada.mp4` | ídem | Motion real de P17 |
| `public/videos/motion/p21-caso-petrocaribe.mp4` | ídem | Motion real de P21 |
| `public/videos/motion/p23-dividendo-reparto.mp4` | ídem | Motion real de P23 |
| `media.audio` en las 14 pantallas de avatar | `demo-avatar.mp3`/`loc1_objetivos.mp3` alternados, sin relación con la transcripción de cada pantalla | Locución real grabada para cada una de las 14 transcripciones |

Sigue pendiente, sin cambio desde el cierre de C7 (no es parte de D8):
los cuatro descargables de P34 (`href: '#'`) y la atribución de P03 —
ambos quedan para C8.

**5 sep — D1 cerrada: Unidad › Cápsula › Tema como dato real, breadcrumb
en la barra superior y drawer agrupado, sobre `master` (rama
`d-rediseno-chrome` ya mergeada por D8).**

**Contrato de contenido.** Las 47 pantallas de `content/ova-u1.js`
suman `unidad` y `capsula`, calculados con un script propio (no a
mano) contra `unidad_capsula` de `storyboard_data_v2.json` — los
límites de cada tramo (qué rango de pantallas cae en cada cápsula) se
verificaron 1 a 1 contra el `id` del storyboard antes de escribir
nada, no se asumieron. Los valores de `capsula` son literalmente los
de la tabla de `PLAN-REDISENO.md` §D1 (no se re-derivaron del título
por código): 15 pantallas quedan con `capsula: null` (las 11 de
Apertura + las 4 de Cierre). `kicker` no se tocó — sigue siendo lo que
pintan los layouts dentro de la pantalla, campo aparte del breadcrumb
del chrome, tal como fija el plan.

**Breadcrumb real, sin enlaces.** Sustituye a `#nav-barra-titulo` (un
`<p>` plano). Es un único `<nav aria-label="Ubicación"><ol>` de 2 o 3
ítems — decisión propia no explícita en el plan: ningún nivel
(unidad/cápsula/tema) tiene una pantalla de destino dentro de la OVA,
así que son texto, no `<a>` — el índice navegable sigue siendo el
drawer. Visualmente dos líneas logradas sin un segundo contenedor:
`.nav-migas__unidad` fuerza el salto con `flex-basis:100%` dentro del
`flex-wrap:wrap` que ya traía `.nav-migas ol` de la maqueta de T1.5, y
reusa `.eyebrow.eyebrow--subtle` en vez de inventar un tratamiento de
texto nuevo (mismo criterio de "generalización, no duplicación" que ya
dejó T5 documentado). El separador "›" es un `<span aria-hidden="true">`
real del DOM, no contenido `::after` — un lector de pantalla no
siempre ignora el `::after` con texto y esto es puramente decorativo.
`router.js` (`actualizarMigas`) alterna `hidden`/`aria-current` según
tres casos: sin cápsula (Apertura/Cierre) → solo tema, sin separador;
con cápsula → "Cápsula › Tema"; primera pantalla de una cápsula (su
título, quitando el prefijo antes de los dos puntos, coincide con el
nombre de la cápsula) → solo cápsula como ítem actual, sin repetir el
mismo texto dos veces. Por debajo de 40em la cápsula se oculta por CSS
(sigue disponible en el drawer) y el tema queda solo, sin separador
colgado.

**Bug real encontrado con Playwright, no hipotético — y su arreglo:**
la primera versión de `.nav-migas__tema` usaba `flex-shrink: 0` (tal
como sugiere la letra de `PLAN-REDISENO.md` §D1, "el tema flex-shrink:0
hasta donde alcance") para que nunca se truncara con elipsis, a
diferencia de la cápsula. A 320px + zoom de texto 200% con un tema
largo ("Tres familias del mercado") eso desbordaba horizontalmente
14px (`nav-barra` medía 320px pero `scrollWidth` 413px) — `flex-shrink:
0` fija el ítem a su ancho de una sola línea sin envolver, y a esa
combinación de ancho/zoom no había espacio. La regla dura 7 de
CLAUDE.md (320px + zoom 200% sin scroll horizontal) no es negociable
así que se resolvió a favor de ella: se quitó `flex-shrink:0`, se
agregó `min-width:0`, y el tema ahora envuelve a una segunda línea de
texto en vez de truncarse o desbordar — en anchos normales no hay
diferencia visual, sigue en una sola línea. La lectura de "hasta donde
alcance" quedó siendo "nunca corta contenido con elipsis", no
"nunca ocupa una segunda línea".

**Drawer agrupado.** `construirDrawer()` recorre las pantallas y abre
un `<h3>` nuevo cada vez que cambia `unidad` y un `<h4>` cada vez que
cambia `capsula` (detección por tramo contiguo, sin mapa aparte: el
contenido ya viene ordenado). Sin `<h4>` cuando `capsula` es `null` —
esas pantallas quedan directo bajo el `<h3>` de la unidad. Encabezados
reales, no `<div>`, para que un lector de pantalla salte de grupo en
grupo. `actualizarDrawer()` pasó de iterar `lista.children` (asumía
que cada hijo era un ítem) a `lista.querySelectorAll('.nav-drawer__item')`,
porque ahora hay encabezados y `<ul>` intercalados — mismo
comportamiento de antes (estado completado/actual/pendiente con ícono
y texto), solo el selector cambió.

**Verificado con Playwright (Python, Chromium cacheado), `src/index.html`
por `file://`:** los tres casos del breadcrumb confirmados por atributo
real (no visual) en p01 (portada, sin barra), p12 (primera de cápsula
1, solo cápsula con `aria-current`), p13 (dentro de la cápsula,
"Cápsula › Tema" con separador visible) y p32 (Cierre, solo tema, sin
separador); p36 confirma que la unidad cambia a "Unidad 2" a mitad del
recorrido con su cápsula real ("Anatomía de un Repo"), no un `null`. El
drawer real trae los 4 `<h3>` esperados (Unidad 1/2/3/5) y los 7 `<h4>`
esperados (4 cápsulas + 3 piezas insignia), 47 ítems, y el ítem actual
correcto tras navegar. Corte de la miga a 320px → oculta cápsula
confirmado por `display` computado en 320/600 (oculta) y 700/1280
(visible) — el punto de corte de 40em cae exactamente entre 600 y
700px. 320px + zoom de texto 200% sin scroll horizontal en los cinco
casos anteriores tras el arreglo del bug de `flex-shrink`. Cero errores
de consola en `src/index.html` y en `dev/kitchen-sink.html` (los 3
`ERR_FILE_NOT_FOUND` de la kitchen sink son la degradación deliberada
de D8, no nuevos). Cero hex nuevo en los archivos tocados
(`content/ova-u1.js`, `index.html`, `router.js`, `components.css`,
`base.css`).

**Overflow horizontal preexistente encontrado, no introducido por
D1 — documentado, no arreglado aquí:** `dev/kitchen-sink.html` ya
desbordaba a 320px (398px de `scrollWidth`) antes de esta sesión,
por `.dato-tabla` (T7, tabla de comparación de rendimientos) —
confirmado con `git stash` contra el estado anterior a D1. Fuera de
alcance de esta tarea; lo hereda quien cierre D10 (verificación
final) o quien retome T7.

**Kitchen sink.** La sección "Migas de pan" pasó de una sola muestra
de maqueta a las tres formas que pide el cierre de D1: con cápsula,
sin cápsula, y truncado + la excepción de primera pantalla de cápsula
lado a lado. La demo de "Barra superior" (T3) reemplazó su
`<p class="nav-barra__titulo">` por el mismo componente real. La demo
de "Drawer de índice" (T3) pasó a mostrar la agrupación real
(`<h3>`/`<h4>`/`<ul>`) en vez de una lista plana de tres ítems. Los
comentarios que en `base.css`/`components.css` seguían nombrando
`.nav-barra__titulo` (ya eliminada) se actualizaron a `.nav-migas`.

**5 sep — D2 cerrada: barra superior a `--surface-inverse`, con un
hallazgo de contraste real que obligó a apartarse de la letra del
plan en un punto — documentado, no silenciado.**

**Qué se tocó, todo en `components.css` salvo lo señalado:**

- **`.nav-barra`** pasa de `--surface-default`/`--border-default` a
  `--surface-inverse`/`--border-inverse`. El borde es un divisor
  decorativo (como `.regla`), no identifica un componente por sí
  solo —el cambio de color de fondo ya separa la barra del contenido—
  así que no le aplica el mínimo de 3:1 de WCAG 1.4.11.
- **`.nav-migas` repintado, scoped a `.nav-barra .nav-migas`, no en las
  clases base.** `.nav-migas` sigue siendo el mismo componente que la
  kitchen sink muestra suelto sobre superficie clara (sección "Migas
  de pan", documentando sus tres estados desde D1) — repintar la clase
  base habría dejado esa demo ilegible. Unidad, cápsula y separador
  pasan a `--text-on-inverse-2` (gris 400); tema y el ítem con
  `aria-current="page"` pasan a `--text-on-inverse` (blanco).
- **`.nav-barra__progreso`/`.nav-barra__guardado`** de `--text-secondary`
  a `--text-on-inverse-2`, tal como pide el plan.
- **`.nav-barra .boton-icono`** (scoped, no la clase base — la reutilizan
  el drawer y el modal sobre superficie clara): ícono blanco, hover
  gris 800, active gris 700. Cubre `#drawer-abrir` y
  `#nav-pantalla-completa`, los dos únicos `.boton-icono` que viven
  dentro de la barra.
- **`.barra-progreso`** (track) de `--surface-subtle-2` (gris 100) a
  gris 800 directo en la clase base, no scoped: el componente solo
  vive dentro de `.nav-barra` en todo el proyecto (verificado por
  grep), no hacía falta duplicar la regla. Naranja 500 sobre gris 800
  mide 4.29:1 (por encima del 3:1 de componente no textual; el 3.9:1
  que estimaba `PLAN-REDISENO.md` §D2 era una cifra a ojo, la medida
  real con la fórmula de contraste de WCAG es la de arriba). El
  relleno no cambió.
- **`.boton--outline.boton--inverse`**, modificador nuevo — lo usa
  «Reanudar» (`#nav-reanudar`, `index.html`), el único
  `.boton--outline` que vive dentro de la barra (el de «Anterior» en
  la barra inferior y los de quiz.js siguen en su outline negro de
  siempre, sobre superficie clara, sin tocar).

**Hallazgo real de contraste, no hipotético — y por qué el código
final no dice lo mismo que el texto del plan.** `PLAN-REDISENO.md`
§D2 especificaba el borde de esta variante como `--border-inverse`
(gris 700). Medido de verdad contra `--surface-inverse` (gris 950) con
la fórmula de contraste relativo de WCAG dio **1.81:1** — no llega al
3:1 que exige 1.4.11 para el borde de un botón outline, que es
exactamente el rasgo visual que identifica dónde está el control (sin
relleno de por medio). `--border-inverse` está pensado para
separadores sobre fondos menos oscuros que este; contra gris 950 se
queda corto. Regla dura 2 de `CLAUDE.md` ("cada componente nace
accesible o no se da por terminado") pesa más que la letra literal del
plan, así que el borde se resolvió con `--nuam-grey-400` en su lugar
(el mismo valor que ya usa `--text-on-inverse-2`): **7.80:1**, de sobra
por encima del mínimo, sin blanco puro (que sí habría cumplido pero
se sentía como más peso visual del que pedía un botón secundario). La
etiqueta y el ícono del botón siguen siendo blancos, tal como pedía el
plan.

**Verificado con Playwright (Python, Chromium), dos páginas:**

- Los cinco pares de contraste que el cierre de D2 pide anotar, todos
  medidos con la fórmula real de WCAG (no estimados): unidad/separador
  sobre la barra 7.80:1, tema y `aria-current` 19.68:1, guardado
  7.80:1, «Reanudar» (texto) 19.68:1 y (borde, tras el arreglo de
  arriba) 7.80:1, ícono de `.boton-icono` 19.68:1, relleno naranja de
  la barra de progreso sobre su track 4.29:1. Los seis primeros son
  pares de texto/ícono (mínimo 4.5:1 o 3:1 según tamaño); el último es
  el 3:1 de componente no textual — todos cumplen.
- El anillo de foco no se tocó y sigue naranja 500 sobre gris 950;
  confirmado con Tab real (no `.focus()` programático — un intento
  inicial con `.focus()` synthetic reportaba `outline: none` falso,
  purely un artefacto de que Chromium no siempre resuelve
  `:focus-visible` para foco disparado por script; con Tab de verdad
  desde el link de saltar hasta `#drawer-abrir` y `#nav-pantalla-
  completa` en `src/index.html` el anillo aparece sólido en los dos).
- La sección "Migas de pan" de la kitchen sink (demos sueltas, fuera
  de `.nav-barra`) se verificó sin cambios tras el scoping: la unidad
  ahí sigue en naranja 700 (`rgb(204, 52, 0)`), no en gris — confirma
  que el repintado de D2 no se escapó a esa demo.
- Hover real (no solo CSS leído) sobre `#drawer-abrir` y «Reanudar» en
  la kitchen sink: los dos pasan a `rgb(39, 39, 39)` (gris 800) al
  pasar el mouse.
- 320px sin scroll horizontal en `src/index.html` (incluida una
  pantalla con la barra visible, `p02`, con y sin un proxy de zoom de
  texto al 200%); 1280px con el mismo proxy sin desbordar. Cero
  errores de consola nuevos en `src/index.html`. Cero hex nuevo en los
  tres archivos tocados (`git diff` filtrado contra `#[0-9a-f]{3,8}`,
  cero coincidencias).
- Los dos fallos que sí sigue reportando la kitchen sink no son de
  esta tarea: el desborde a 320px de `.dato-tabla` (documentado como
  preexistente en el cierre de D1) y los tres `ERR_FILE_NOT_FOUND`
  deliberados de la demo de degradación de avatar (D8). Ninguno de los
  dos cambió con D2.

**Kitchen sink.** El bloque "Barra superior" (T3/D1) ahora muestra los
seis controles reales de la barra en su variante inverse, no solo
tres: se agregaron el botón de «Reanudar» (antes documentado como "sin
demo estática aquí") y el de pantalla completa, en el mismo orden que
`index.html`. El bloque de botones ganó una entrada nueva, "Botón —
outline inverse (D2, barra superior)", junto a las de negro/blanco/
naranja que ya existían — mismo criterio de "cada modificador nuevo se
documenta en la matriz". Los tres párrafos de `ks-intro` de esa
sección se reescribieron para explicar los tokens nuevos en vez de los
de T3.

**Sigue pendiente para D3** (no tocado aquí, a propósito): el texto de
`.nav-barra__progreso` sigue diciendo "N / M pantallas" y el
`aria-label` sigue siendo "Progreso de la unidad" — D2 es solo el
repintado de la barra, D3 es quien cambia ese texto a porcentaje y
recalcula el denominador.

**5 sep — D3 cerrada: progreso en porcentaje, denominador sobre
`progreso !== false`.**

**Qué se tocó:**

- **`router.js`, `actualizarProgreso(inst)`.** Antes calculaba la
  fracción sobre `inst.visitadas.length / inst.total` (todas las
  pantallas del contenido, sin filtro). Ahora filtra
  `contenidoActual.pantallas` por `progreso !== false` para sacar el
  denominador (`total`) y cuenta cuántas de esas están en
  `inst.visitadas` para el numerador (`completadas`) — activa el campo
  muerto del contrato que documenta la sección 0 del plan. Con las 47
  pantallas actuales (ninguna trae todavía `progreso: false`, eso
  llega con p01a/p01b en D7) el filtro no cambia el total, pero la
  arquitectura ya está lista para cuando sí lo haga.
- **`aria-valuemin="0"`/`aria-valuemax="100"`/`aria-valuenow`** con el
  porcentaje redondeado (`Math.round`), y
  `aria-valuetext="N % completado — X de Y pantallas"` — el número
  solo tiene sentido con la cuenta detrás, tal como pide el cierre del
  plan. El texto visible (`#nav-progreso-texto`) pasa de "X / Y
  pantallas" a "N % completado". La etiqueta oculta visualmente
  (`#nav-progreso-etiqueta`, `index.html`) pasa de "Progreso de la
  unidad" a "Progreso del curso".
- **El relleno sigue animado con `transform: scaleX()`** sobre la
  fracción real (no el entero redondeado), sin tocar `--dur-slow` ni
  la mecánica de D2 — el plan pedía explícitamente no tocar esto.
- **`#nav-paso` (barra inferior, "Pantalla N de M") no se tocó** — es
  la cuenta fina que el propio plan pide conservar aparte del
  porcentaje.
- **Kitchen sink**: la demo estática de "Barra superior" (bloque T3/D1/
  D2) se actualizó al mismo patrón — `aria-valuemax="100"`,
  `aria-valuenow="38"`, texto visible "38 % completado", más un
  párrafo nuevo documentando la decisión de D3 junto al que ya
  explicaba por qué la barra no es un `<progress>` nativo.

**Verificado con Playwright (Python, Chromium), `src/index.html` desde
`file://`, localStorage limpio:** arranque en s01 (portada L01, sin
barra); clic en "Comenzar" monta s02 con la barra ya en
`{min:0, max:100, now:4, text:"4 % completado — 2 de 47 pantallas"}`
(2 de 47 = 4.25%, redondea a 4); "Siguiente" dos veces más sube a 6 %
(3/47) y 9 % (4/47), moviendo `aria-valuenow`, `aria-valuetext`, el
texto visible y el `scaleX()` del relleno juntos en cada navegación;
cero errores de consola en toda la corrida. `dev/kitchen-sink.html` a
320px: el overflow horizontal que reporta Playwright (`scrollWidth`
398 vs `clientWidth` 320) es preexistente y ajeno a esta tarea —
confirmado elemento por elemento: el desborde es de
`.media-audio`/`.media-audio__controles` (T4), no de
`.nav-barra__progreso`; los tres `ERR_FILE_NOT_FOUND` de consola son la
demo deliberada de degradación de avatar (D8), documentados ahí. Cero
hex nuevo, cero duración/curva nueva fuera de `tokens.css` (no se tocó
`components.css` ni `tokens.css` en esta tarea, solo `router.js`,
`index.html` y `kitchen-sink.html`).

**5 sep — D4 cerrada: padding lateral de escritorio, con las tres
excepciones de la sección 0 del plan verificadas, no solo asumidas.**

**Qué se tocó, solo `layouts.css`:**

- **`@media (min-width: 48em) { .layout { padding-inline: var(--sp-10); } }`**
  — exactamente el bloque que da `PLAN-REDISENO.md` §D4, insertado justo
  después de la regla base `.layout` (24px → 40px de aire lateral desde
  768px).
- **L01 no necesitó exclusión explícita.** `.layout--l01` ya fija su
  propio `padding` (shorthand físico, incondicional) más abajo en el
  mismo archivo; por orden de cascada (misma especificidad, declaración
  posterior gana) siempre pisa el `padding-inline` de la regla base,
  con o sin el bloque nuevo de arriba. Confirmado con Playwright, no
  solo razonado: sigue en 24px a 1280px.
- **L12 y L13 sí necesitaron exclusión a mano.** A diferencia de L01,
  estos dos layouts no fijan su propio padding — heredan el de `.layout`
  tal cual porque su tratamiento de "a sangre" es solo de `background`
  (ver los comentarios de C2 en sus propias secciones), así que sin
  intervención habrían heredado el aumento. Se agregó
  `@media (min-width: 48em) { .layout--l12 { padding-inline: var(--sp-6); } }`
  (mismo bloque para `.layout--l13`) inmediatamente después de la
  sección de cada uno, para que quede junto a la regla que describe.

**Verificado con Playwright (Node, Chromium), `src/index.html` desde
`file://`, recorriendo las 47 pantallas por hash:**

- **1280px:** `padding-inline` computado de las 44 pantallas que no son
  L01/L12/L13 es `40px` en las dos direcciones; las 3 que sí lo son
  (`p01`/L01, `p03`/L12, `p36`+`p40`+`p44`/L13) se quedan en `24px`.
  Cero desbordamiento horizontal (`scrollWidth === clientWidth`) en las
  47. Cero errores de consola.
- **320px:** cero pantallas con `scrollWidth > clientWidth` — el reflow
  de C2/D1/D2/D3 sigue intacto, el cambio es solo de escritorio.
- **1280px con `document.documentElement.style.fontSize = '200%'`**
  (proxy de zoom de texto, mismo método que usaron D1/D2): cero
  desbordamiento en las 47; muestreo de L01/L12/L13 confirma que se
  mantienen en `24px` también bajo esa condición, no solo en el caso
  base.
- Cero hex nuevo, cero duración/curva nueva (el único archivo tocado es
  `layouts.css` y el cambio es puramente de `padding-inline`).

**No se tocó la kitchen sink.** D4 no agrega un componente ni un estado
nuevo que documentar ahí — es un ajuste de espaciado sobre layouts que
la kitchen sink ya muestra completos; el cierre de la tarea lo pide
verificado en las pantallas reales (`src/index.html`), no en la
kitchen sink, que además no navega por hash y no tiene forma de
mostrar "antes/después" del breakpoint sin duplicar la demo de C2.

**5 sep — D5 cerrada: preferencias del curso, módulo nuevo
`src/js/preferencias.js`, con el cruce de tamaño de texto × marco fijo
que el propio plan marcaba como "la parte delicada" resuelto y
verificado, no solo razonado.**

**Por qué es un módulo aparte y no algo colgado de `router.js`.** Las
cuatro preferencias (tamaño de texto, movimiento reducido,
transcripción visible, autolocución) tienen que verse iguales en dos
sitios que no comparten dueño — el popover de la barra superior
(`index.html`, chrome) y el panel incrustado de p01a (D7, contenido) —
y sobrevivir a un recargue. `preferencias.js` es el único dueño del
estado; `router.js` solo monta el popover y reacciona a un cambio
(abrir la transcripción de la pantalla activa), igual que ya delega en
`OVA.quiz`/`OVA.media`/`OVA.charts` para todo lo que no es chrome fijo.
Se carga antes que `router.js` (índice de scripts, `index.html`) para
que los atributos de `<html>` existan desde el primer render.

**Qué se construyó:**

- **`src/js/preferencias.js`** (nuevo) — estado único
  `{tamanoTexto, movimientoReducido, transcripcionVisible, autolocucion}`,
  persistido con `OVA.storage` bajo el mismo `contenidoId` que el
  progreso (clave `"preferencias"`, un solo objeto — no cuatro claves
  sueltas). `establecer(clave, valor)` valida contra el catálogo de
  cuatro, persiste, aplica los atributos en `<html>` y notifica a los
  suscriptores; `crearPanel()` arma el DOM del panel (radio de tamaño +
  tres checkboxes, `fieldset`/`legend` reales) y se suscribe solo para
  mantener sus propios controles sincronizados — cada llamada a
  `crearPanel()` es un montaje independiente sobre el mismo estado, así
  que dos montajes en la misma página quedan sincronizados sin que
  ninguno sea dueño del dato (verificado con Playwright: cambiar el
  tamaño en el montaje incrustado de la kitchen sink mueve el radio
  correspondiente en el popover, sin recargar). `configurarPopover()`
  es la única pieza específica del montaje de barra superior: no
  modal, sin trampa de foco, Escape o clic fuera lo cierran (clic fuera
  vía un listener de captura en `document` que se registra recién al
  abrir, así que el clic que abre nunca se autocierra).
- **Atributos en `<html>`, no estilos inline** (`data-texto="125"`,
  `data-movimiento="reducido"`, `data-transcripcion="visible"`) —
  `data-texto` siempre presente (tres valores posibles, no
  presencia/ausencia); los otros dos solo existen cuando se apartan del
  valor por defecto, mismo criterio que `hidden` en vez de una clase
  siempre puesta.
- **Tamaño de texto, la parte delicada que marcaba el plan.** Escalar
  con `font-size` en `:root` (125%/150%) basta para toda la tipografía
  porque los tokens son `rem` — sin tocar `tokens.css` peldaño por
  peldaño. Lo que sí exigió cuidado es el hallazgo que ya anotaba
  `PLAN-REDISENO.md` §D5 y que esta sesión confirmó en vez de asumir:
  la unidad `em` de un *media query* se mide contra el tamaño de fuente
  **inicial** del navegador, no contra el `font-size` que la propia
  página le pone a `:root` — subir el root al 150% no corre ni un
  píxel el punto de corte de `max-height: 36em` de la trampa 4 de
  `PLAN-CONTENIDO.md` §4.3 (el desarme de emergencia del marco fijo).
  Solución, tal como la dejaba escrita el plan: tres bloques
  `@media (max-height: …)` hermanos en `base.css` — 36em / 45em / 54em
  (36 × la misma escala 1/1.25/1.5) — cada uno gateado por
  `:root[data-texto="…"]` en vez de una sola regla combinada, porque no
  hay forma de expresar "media feature O selector de atributo" dentro
  de un único bloque de CSS.
- **Movimiento reducido, override manual.** `tokens.css` gana un bloque
  `:root[data-movimiento="reducido"] { … }`, duplicado deliberado y
  anotado del bloque `@media (prefers-reduced-motion: reduce)` que ya
  existía (mismos valores, 1ms y no 0 — no rompe `animationend`): es la
  única duplicación aceptada de ese bloque en todo el proyecto, y
  `CLAUDE.md` ya la preveía en la sección de Movimiento.
- **Transcripción visible, resuelta en `router.js`, no en
  `preferencias.js`.** No hay forma de forzar con CSS puro el atributo
  `open` de un `<details>` (no hay propiedad de CSS para eso), así que
  el efecto vive donde ya vive todo lo demás que reacciona a cada
  pantalla activa: `aplicarTranscripcionVisible()` en `router.js`
  recorre `#app details[class$="__transcripcion"]` (sufijo de clase,
  no un id fijo — `media-video__transcripcion` y
  `media-audio__transcripcion` son dos familias distintas que
  comparten el mismo patrón desde C3) y los abre si la preferencia
  está encendida. Se llama al final de `navegarA()` (cada pantalla
  nueva nace abierta si la preferencia está prendida) y está
  suscrita a `OVA.preferencias` desde `init()` (encenderla sin navegar
  abre de inmediato la transcripción de la pantalla activa). Apagar la
  preferencia no fuerza el cierre — no hay razón para colapsar algo que
  el estudiante pudo haber abierto a mano.
- **Autolocución, solo el dato en esta tarea.** El checkbox y la
  persistencia ya existen; el disparo real del audio al montar una
  pantalla de avatar es D6, sobre `router.js`/`media.js` — no se tocó
  nada de eso aquí a propósito, D5 solo deja la preferencia lista para
  que D6 la lea.
- **`index.html`**: botón `tune` (`#pref-abrir`) + contenedor del
  popover (`#pref-popover`) dentro de `.nav-barra__preferencias`,
  después del indicador de guardado y antes de pantalla completa;
  hereda el tratamiento inverse de `.boton-icono` de D2 sin CSS nuevo
  para el botón. `<script src="js/preferencias.js">` entre `a11y.js` y
  `media.js`.
- **CSS (`components.css`)**: `.pref-panel`/`__grupo`/`__opciones`/
  `__opcion` (fieldset reseteado + `accent-color` en los inputs, mismo
  criterio que `.quiz-opcion`); `.nav-barra__preferencias` (ancla de
  posición) y `.pref-panel--popover` (flotante, `z-index: 202` — un
  escalón por encima de `.nav-drawer--flotante`/`.modal__caja`, que ya
  usan 201 contra el mismo `.backdrop`; el popover no tiene backdrop
  propio, así que no compite con esos 200/201 en la práctica, pero si
  llegara a solaparse gana el control que el estudiante acaba de
  abrir). Sin `box-shadow`: el proyecto no usa esa propiedad en
  ningún otro componente (grep confirmado antes de escribir código),
  así que el panel se separa del fondo solo con borde, igual que el
  drawer y el modal.

**Verificado con Playwright (Python, Chromium), `src/index.html` y
`dev/kitchen-sink.html` desde `file://`:**

- Atributos iniciales correctos (`data-texto="100"`, sin
  `data-movimiento` ni `data-transcripcion`); elegir 150% sube
  `data-texto` y el `font-size` computado de `<html>` pasa a `24px`
  (16 × 1.5); encender movimiento reducido manual mide
  `--dur-slow: 1ms` computado, igual que bajo
  `prefers-reduced-motion: reduce`.
- Popover: `aria-expanded` alterna con clic y con teclado (Enter sobre
  el botón enfocado); primer `Tab` dentro cae en el primer radio (sin
  trampa de foco, a diferencia del drawer/modal); flechas mueven la
  selección nativa del grupo de radios y disparan el cambio real;
  Escape y un clic en una esquina real (no en el centro, que coincide
  con el panel) cierran y devuelven el foco a `#pref-abrir` en los dos
  casos.
- Recargar la página conserva `tamanoTexto` y `movimientoReducido`
  puestos antes de recargar.
- En `p02` (motion + transcripción real, D8): el `<details>` nace
  colapsado sin la preferencia; encenderla desde el popover lo abre en
  la pantalla activa sin navegar; navegar a `p03` y volver a `p02` lo
  deja abierto de nuevo — la suscripción de `router.js` sigue viva
  pantalla tras pantalla.
- Cero desbordamiento horizontal en `src/index.html` con el popover
  **abierto**, cruzando (320/768/1280px) × (100/125/150% real vía
  panel, no simulado) — nueve combinaciones — y también con un proxy
  de zoom de texto 200% encima de esas tres escalas. Cero errores de
  consola en toda la corrida.
- `dev/kitchen-sink.html`: los dos montajes (popover e incrustado)
  quedan sincronizados en ambas direcciones; el desbordamiento a 320px
  y su crecimiento bajo zoom 200% son los mismos de siempre —
  confirmado por elemento: sigue siendo `.dato-tabla` (T7), presente
  también con el popover cerrado y sin abrir nunca. Los tres
  `ERR_FILE_NOT_FOUND` de consola son la degradación deliberada de D8,
  no nuevos.
- Estructura accesible confirmada por atributo real: `aria-controls`
  del botón coincide con el `id` del panel, dos `<fieldset>` con su
  `<legend>`, seis `<label>` con su `<input>` anidado (asociación
  nativa, sin `for`/`id` sueltos que puedan desincronizarse), el panel
  sin `role` (no es un diálogo).

**Cero hex nuevo, cero duración/curva nueva fuera de `tokens.css`**
(`git diff` filtrado contra `#[0-9a-f]{3,8}` y contra literales de
`ms`/`cubic-bezier` fuera de ese archivo, cero coincidencias en los
cinco archivos tocados).

**Kitchen sink.** Sección nueva "Preferencias del curso (D5)" después
de "Chrome del OVA (T3)": los dos montajes reales lado a lado (popover
sobre una `.nav-barra` de demo, panel incrustado dentro de
`.ks-media-marco`), con la nota de qué efecto es visible ahí mismo
(tamaño, movimiento, transcripción) y cuál es solo el dato a la espera
de D6 (autolocución).

**Pendiente para D7, no D5:** el segundo montaje incrustado de
`crearPanel()` en `index.html` (dentro de la pantalla real p01a) no
existe todavía — la pantalla misma es D7. Lo que sí queda listo es que
sea una llamada más a `OVA.preferencias.crearPanel()`, sin plantilla ni
lógica nueva que inventar cuando llegue esa tarea.

**6 sep — D6 cerrada: autolocución, solo audio, con las cuatro
precauciones del plan verificadas de punta a punta con Playwright, no
solo razonadas.**

**Qué se construyó:**

- **`OVA.media.reproducirEn(raiz)`**, nueva en `media.js` — busca el
  primer `<audio>` dentro de una raíz ya montada y llama a `.play()`.
  No cambia la firma de `crear()`: es una función aparte, porque
  `crear()` sigue devolviendo la raíz del reproductor sin saber nada de
  cuándo autorreproducir. La promesa de `play()` se captura con
  `.catch(function () {})` — un rechazo (autoplay bloqueado sin gesto
  previo, verificado real en la carga inicial: la primera pantalla de
  avatar nunca reproduce sola) no revienta en consola ni fuerza ningún
  estado del reproductor: como el ícono de play/pausa solo lo cambian
  los listeners de `play`/`pause` que ya existían en `crearAvatar()`
  (T4/C3, sin tocar), un `play()` rechazado nunca los dispara y el
  botón se queda diciendo "Reproducir", listo para pulsarse a mano —
  exactamente lo que pide el punto 1 del cierre del plan, "nunca un
  reproductor en un estado mentiroso".
- **`router.js`, `aplicarAutolocucion(pantalla, resultado)`**, llamada
  al final de `navegarA()` junto a `aplicarTranscripcionVisible()`. Dos
  formas de traer avatar con audio en el contrato — `pantalla.avatar`
  (solo L01, portada) y `pantalla.media.tipo === 'avatar'` (las otras
  13 pantallas reales, vía `crearMedia()`) — así que
  `tieneAvatarConAudio()` comprueba las dos en vez de asumir una sola
  forma; sin eso, la portada (`s01`/L01) nunca habría autorreproducido
  nada. No se llama a `.focus()` en ningún punto nuevo (el foco lo
  sigue moviendo `enfocarEncabezado()`, ya existente, un poco más
  abajo en la misma función) y no se agrega ningún `aria-live` nuevo —
  el anuncio de cambio de pantalla que ya dispara `navegarA()` es el
  único, tal como pide el punto 3 del cierre.
- **Botón dedicado en la barra superior** (`#nav-autolocucion`,
  `index.html`), no solo el checkbox del panel de preferencias:
  `record_voice_over`/`voice_over_off` + `aria-pressed`, misma clave
  que D5 — `router.js` (`configurarAutolocucion`/
  `actualizarBotonAutolocucion`) se suscribe a `OVA.preferencias` con
  el mismo patrón que ya sincroniza los dos montajes de
  `crearPanel()`, así que el botón de la barra y el checkbox del panel
  quedan sincronizados en las dos direcciones sin que ninguno sea
  dueño del dato. Sin CSS nuevo: `.nav-barra .boton-icono` (D2) ya
  cubre ícono blanco/hover gris 800 para cualquier `.boton-icono`
  dentro de `.nav-barra`, y `.nav-barra` ya es `flex` con `gap` — el
  botón nuevo cae en el flujo sin declarar una regla propia.
- **Nace apagado**, heredado de D5 (`DEFECTOS.autolocucion: false`) —
  no fue necesario tocar `preferencias.js`: la preferencia y su
  persistencia ya existían completas, D6 solo le agrega el efecto real
  y el botón dedicado.

**Verificado con Playwright (Python, Chromium), `src/index.html` y
`dev/kitchen-sink.html` desde `file://`:**

- Estado inicial del botón: `aria-pressed="false"`, ícono
  `voice_over_off`. Un clic real (gesto de usuario, no `.click()`
  disparado sin interacción previa) lo pasa a `aria-pressed="true"`,
  ícono `record_voice_over`, etiqueta "Desactivar autolocución"; el
  checkbox "Autolocución" del popover de preferencias queda marcado a
  la vez, sin recargar ni navegar.
- **Encadenamiento real, no solo el dato:** con la portada (`s01`)
  montada, un clic en el botón de autolocución (gesto de usuario) y
  luego "Siguiente" hasta `p04` (primera pantalla real con `<audio>`
  fuera de la portada) deja ese `<audio>` con `paused === false` y
  `currentTime === 0` justo después de montar — la locución arrancó
  sola. Apagar la preferencia y seguir avanzando hasta `p10` (otra
  pantalla de avatar con audio) confirma `paused === true`: sin la
  preferencia, nada se reproduce solo. Cero errores de consola en toda
  la corrida, incluida la ventana de autoplay bloqueado de la carga
  inicial.
- Teclado: `Tab` alcanza `#nav-autolocucion` con foco visible, `Enter`
  lo activa igual que un clic (`aria-pressed` pasa a `true`).
  320px de ancho con el botón visible en pantalla: `scrollWidth ===
  clientWidth` (320px), sin desbordamiento nuevo.
- `dev/kitchen-sink.html`: el botón `#ks-autolocucion` (junto al `tune`
  del popover de preferencias) reproduce la misma sincronía bidireccional
  que en `src/index.html` — confirmada contra el checkbox del montaje
  incrustado, no solo el del popover. El botón de demo nuevo ("Simular
  llegada a esta pantalla") llama a `OVA.media.reproducirEn()` sobre el
  reproductor de avatar real de la sección "Componentes" y dejó su
  `<audio>` en `paused === false`. Los tres `ERR_FILE_NOT_FOUND` que
  sigue reportando la consola son la degradación deliberada de D8
  (imagen de avatar todavía inexistente a propósito), no nuevos —
  ningún otro error apareció.

**Cero hex nuevo, cero CSS nuevo.** Los cuatro archivos tocados
(`media.js`, `router.js`, `index.html`, `kitchen-sink.html`) no tocan
`components.css` ni `tokens.css` — el botón nuevo reutiliza
`.boton-icono` y el scoping de `.nav-barra` que ya dejó D2, sin
declarar una sola regla de CSS.

**Kitchen sink.** La sección "Preferencias del curso (D5)" gana el
botón `#ks-autolocucion` junto al popover, con un párrafo que explica
la sincronía y remite el encadenamiento real (que sí depende de
navegar entre pantallas) a `src/index.html` — mismo criterio que
"Motor"/"Chrome del OVA" en T2/T3: lo que no depende del router se
demuestra vivo aquí, lo que sí depende de él se prueba en la pantalla
real. La demo de avatar de "Componentes" gana un botón ("Simular
llegada a esta pantalla") que ejercita `OVA.media.reproducirEn()` en
sí misma, que no depende de router/hash y sí puede vivir aquí sin
falsear nada.

**6 sep — D7 cerrada: dos pantallas nuevas (p01a accesibilidad, p01b
tutorial), montadas sobre L09 con tres ranuras de contrato agregadas
en vez de un layout dedicado — extensión mínima, tal como pedía el
plan, verificada con Playwright en `src/index.html` y
`dev/kitchen-sink.html`.**

**Por qué L09 y no un layout nuevo.** p01a necesita un título, una
lista de afirmaciones llanas y —debajo— el panel de preferencias
completo con una frase de cierre; p01b necesita un título y una lista
de siete controles, cada uno con su propio ícono. Las dos son, en
forma, la misma "ideas clave" que ya resuelve `PLANTILLAS.L09`
(`crearListaIdeas`) — no hacía falta un catorceavo layout para dos
pantallas que no forman parte de ninguna cápsula. Se extendió el
contrato de L09 con tres campos opcionales, todos mutuamente
compatibles con lo que ya usaba L09 (`cuerpo`/`media`) y sin tocar
ninguna de las 47 pantallas reales del storyboard:

- **`controles`** (alternativa a `cuerpo`, igual que `tarjetas`/
  `interaccion` en L05 son mutuamente excluyentes): un arreglo de
  `{icono, texto}`. `crearListaControles()` (router.js) es casi un
  calco de `crearListaIdeas()` —mismo `<ul class="layout__cuerpo">`,
  mismo `<li>` con ícono `aria-hidden` + texto— pero el ícono lo trae
  cada ítem en vez de ser un `check_circle` fijo: p01b describe
  controles reales del chrome (menú, ubicación, progreso, pantalla
  completa, autolocución, anterior, siguiente), no una lista de
  afirmaciones que comparten un solo símbolo de cumplimiento. El verde
  de `check_circle` no tiene sentido ahí, así que el `<ul>` se marca
  además con `layout__cuerpo--controles` y layouts.css le pone el
  color de ícono neutro que ya usaba `.nav-drawer__item .icono`
  (`--text-tertiary`) en vez de `--nuam-green-500`.
- **`componente`** (catálogo de un solo valor por ahora,
  `"preferencias"`): monta `OVA.preferencias.crearPanel()` — el mismo
  componente de D5, sin plantilla nueva que inventar — dentro del
  mismo `.layout__interaccion` que ya usan L05/L06/L07/L10/L11.
  `crearComponente()` (router.js) sigue el mismo criterio de
  `crearMedia`/`crearInteraccion`/`crearDatos`: falla ruidoso si el
  valor no está en el catálogo. No se llamó "interaccion" a propósito
  — CLAUDE.md define `interaccion` como una pregunta por pantalla
  (catálogo I01–I14) y el panel de preferencias no lo es.
- **`nota`**: reusa `crearNotaTarjetas()` de L05 tal cual (misma idea,
  una línea secundaria después del contenido principal) — se agregó
  `.layout--l09 .layout__nota { color: var(--text-secondary) }` en
  layouts.css, mismo tratamiento que ya tenía L05.

Orden dentro de `PLANTILLAS.L09`: kicker → título → controles/cuerpo →
media (si existe) → componente (si existe) → nota (si existe). p01a
usa cuerpo + componente + nota; p01b usa solo controles. Las tres
ranuras son opcionales y ninguna pantalla real del storyboard las usa
— C1–C7 siguen intactas.

**Contenido (`content/ova-u1.js`).** `p01a` y `p01b` se insertaron
entre `p01` y `p02`, con `unidad: "Unidad 1"` y `capsula: null` (mismo
patrón que Apertura/Cierre) y **`progreso: false` en las dos** — D3 ya
filtra el denominador del porcentaje por ese campo, así que no hizo
falta tocar `router.js` para que recorrerlas no mueva el número.
`p01a` trae seis afirmaciones llanas (transcripción, teclado,
contraste, reflow, zoom de texto, movimiento reducido),
`componente: "preferencias"` y la frase de cierre exacta que pidió
Juan. `p01b` trae los siete controles del plan (índice, ubicación,
progreso con guardado automático, pantalla completa, autolocución,
anterior, siguiente) con el ícono real de cada uno tomado de
`index.html` — con una excepción documentada aquí: la miga de pan
(`nav-migas`) no tiene ícono propio en la barra real, así que "tu
ubicación en el curso" usa `location_on` (un ícono nuevo en el
proyecto, sin catálogo que lo restrinja — Material Symbols ya se usa
por nombre libre en todo el código) en vez de inventar uno que no
existe en ningún control real. "Progreso con guardado automático" es
un solo ítem del tutorial (no dos) y usa `cloud_done`, el ícono real
del indicador de guardado (`#nav-guardado-icono`) — el plan agrupa
esas dos cosas en un mismo control.

**Verificado con Playwright (Python, Chromium), `src/index.html` y
`dev/kitchen-sink.html` desde `file://`:**

- Desde `p01` (portada, L01), el CTA "Comenzar" lleva a `p01a`; "Siguiente"
  de ahí lleva a `p01b` y luego a `p02` — el orden P01→p01a→p01b→P02 que
  pedía el plan, sin renumerar nada.
- `p01a`: 6 ítems de lista con `check_circle`, el panel de preferencias
  embebido de verdad (`.layout__interaccion .pref-panel`, no una
  maqueta) y la nota de cierre con el texto exacto. Cambiar el tamaño de
  texto a 150% **desde este panel embebido** mueve `data-texto` en
  `<html>` igual que el popover de la barra (mismo estado único de D5,
  un montaje más). Tab desde el título entra al panel: el grupo de
  radios de tamaño se navega con flechas (nativo) y un solo Tab lo saca
  al primer checkbox — nunca queda nada inalcanzable ni hace falta un
  manejador de teclado propio.
- `p01b`: 7 controles listados en el orden del plan, con los iconos
  exactos (`menu`, `location_on`, `cloud_done`, `fullscreen`,
  `record_voice_over`, `arrow_back`, `arrow_forward`) y color de ícono
  `rgb(114, 114, 114)` (`--text-tertiary` computado, confirmado
  distinto del verde de `check_circle` que sigue usando la lista de
  ideas normal).
- **Progreso, el punto que más podía romperse:** `aria-valuenow` se
  queda en el mismo número (`2`, con solo `p01` visitada) al recorrer
  `p01a` y `p01b`, y solo sube (`4`, `aria-valuetext` "2 de 47
  pantallas") al llegar a `p02` — confirma que D3 ya dejaba esto listo
  sin tocar `actualizarProgreso()`. El drawer sí lista `p01a`/`p01b`
  como completadas (ícono `check_circle`, estado de visita real) — es
  un concepto distinto del porcentaje del curso, y las dos cosas no
  tenían por qué coincidir.
- 320px de ancho en `p01a` y `p01b`: `scrollWidth − clientWidth === 0`
  en las dos, sin desbordamiento nuevo.
- `dev/kitchen-sink.html`: sección "Layouts L01–L13" → bloque L09 gana
  dos ejemplos nuevos (controles de p01b, componente/nota de p01a) con
  el panel de preferencias embebido real como tercer montaje de
  `OVA.preferencias.crearPanel()` — cambiar el tamaño de texto ahí
  mueve el radio correspondiente en el popover de la sección
  "Preferencias del curso (D5)" sin recargar, confirmando que los tres
  montajes (popover, incrustado de D5, incrustado de este ejemplo)
  siguen siendo un solo estado. Cero errores de consola nuevos en
  ninguna de las dos páginas — los tres `ERR_FILE_NOT_FOUND` que sigue
  reportando `kitchen-sink.html` son la misma degradación deliberada de
  D8 de siempre.

**Cero hex nuevo, cero duración/curva nueva fuera de `tokens.css`**
(`git diff` filtrado contra `#[0-9a-f]{3,8}` y contra literales de
`ms`/`cubic-bezier` en los cuatro archivos tocados, cero coincidencias).

**Pendiente para D9, no D7:** las dos pantallas nuevas no llevan
todavía ningún `data-anim` propio más allá de la entrada escalonada
genérica que ya heredan `.layout__kicker/titulo/cuerpo/interaccion`
(ítem 2 del inventario de movimiento) — no había nada específico de
D7 que animar aparte de eso.

---

## PLAN-ESTRUCTURA.md (E0–E7)

Plan vigente desde el 10 de septiembre — ver `PLAN-ESTRUCTURA.md`. Corre
después de D0–D6 (D7/D9/D10 quedan pendientes y no se retoman hasta
cerrar este plan). Reestructura el recorrido de 50 a 26 pantallas; no
toca el motor salvo lo que E1/E2 necesitan.

- [x] **E0 · Rama `e-reestructura` y el plan** — completada 10 sep
      (commit `de68814`).
- [x] **E1 · I15 cuestionario (+ `OVA.resultado` compartido, + kitchen
      sink)** — completada 10 sep. Detalle abajo.
- [x] **E2 · `bloqueaAvance`** — completada 10 sep. Detalle abajo.
- [ ] E3 · etiquetas como agrupador — pendiente.
- [ ] E4 · contenido nuevo (`content/ova-u1.js` con el orden de §1) —
      pendiente. **E1 no tocó `content/ova-u1.js`** a propósito: las
      pantallas p05–p10 del diagnóstico siguen siendo las cinco de
      siempre (L07 × 5 + L08) hasta que E4 las funda en `p05-diagnostico`
      (L06 · I15) — el motor ya sabe construir I15, pero nada del
      contenido real lo usa todavía.
- [ ] E5–E7 · pendientes.

**10 sep — E1 cerrada: catálogo I15 (cuestionario) en `quiz.js`, con
una extracción compartida `OVA.resultado` (archivo nuevo) que también
absorbió al `PLANTILLAS.L08` de `router.js`, verificada de punta a
punta con Playwright.**

**Qué se construyó:**

- **`src/js/resultado.js`** (nuevo) — `OVA.resultado.resolver(resultado)`
  (la regla "primera que aplica gana" contra una variable de
  `state.js`, idéntica a la que antes vivía dentro de
  `obtenerResultado()` en `router.js`) y `OVA.resultado.construir(efectivo)`
  (cifra vía `OVA.charts.crear({tipo:'cifra',…})` + callout vía
  `.callout`, T5 — el mismo candado ícono+título que ya cumplía
  `crearCalloutResultado()`). Dos funciones con responsabilidades que
  no se pisan: una decide QUÉ mostrar, la otra lo pinta — así I15
  puede resolver su propio `datos.resultado` sin pasar por una
  `pantalla` de `router.js`, que es lo que exigía la nota "reusar, no
  duplicar" del plan (§2): sin esta extracción habría dos
  implementaciones de "primera que aplica gana" divergiendo en la
  primera corrección.
- **`router.js`** — `obtenerResultado(pantalla)` quedó en tres líneas
  (el fallo ruidoso propio de L08 sin "resultado" en absoluto o sin
  cifra/retro tras resolver) delegando el resto en
  `OVA.resultado.resolver()`; `PLANTILLAS.L08` arma sus dos
  contenedores (`.layout__datos`/`.layout__interaccion`) alrededor de
  los nodos que devuelve `OVA.resultado.construir()`, sin volver a
  construirlos a mano. `mezclarCifraConVariable()` y
  `crearCalloutResultado()` se borraron de `router.js` (viven en
  `resultado.js`), no quedaron duplicadas.
- **`src/js/quiz.js`, `construirCuestionario()`** — despachada por
  `CONSTRUCTORES_INSIGNIA['I15']`, igual que I07/I08/I13: arma su
  propio DOM (`.quiz-cuestionario`), no pasa por el
  fieldset/Comprobar/Reintentar único de `crear()`. Cada pregunta de
  `datos.preguntas` se resuelve con su constructor real de
  `CONSTRUCTORES` (I01–I05/completar/numerica/autoevaluacion — nunca
  otra I15 ni I07/I08/I09–I13) dentro de su propio `<form
  class="quiz-cuestionario__item">`, con su propio Comprobar/
  Reintentar/retro (I14) — visualmente las cinco están montadas a la
  vez, apiladas, no reveladas una por una.
  - **Trampa 1 (score.raw pisado cinco veces):** cada pregunta reporta
    su fila a `cmi.interactions` (`reportarSCORM`, sin cambios) pero
    ninguna llama a `actualizarNota()` — la nota se calcula una sola
    vez, al resolver la última pregunta, como
    `Math.round(aciertos / total * 100)`.
  - **Trampa 2 (recargar a media batería no encierra):** el intento de
    cada pregunta sigue sin persistirse (T6, sin cambios), pero la
    terminación de la BATERÍA COMPLETA sí — `OVA.state.establecerVariable(idScorm + '-completo', true)`
    al resolver la quinta. Al montar, si esa marca ya está en `true`,
    las cinco preguntas arrancan bloqueadas de una (sin reconstruir
    qué se respondió — eso sí se pierde, igual que siempre) y el
    bloque de resultado se muestra directo, sin repetir el reporte a
    SCORM ni recalcular la nota.
  - **Trampa 3 (alto ~780px):** sin contenedor de scroll propio — es
    scroll real dentro de `#app` (regla dura 9). El contador "Pregunta
    N de 5" va pegado a cada `.quiz-cuestionario__item`, no arriba del
    cuestionario, así se ve sin volver arriba.
  - **Trampa 4 (foco):** ninguna llamada a `.focus()` en todo el
    constructor; la retro de cada pregunta y `.quiz-cuestionario__resultado`
    son `role="status"`, se anuncian solas.
  - **Trampa 5 (color):** la cifra final lleva etiqueta y el callout
    ícono + título — mismos componentes que ya cumplían la regla en
    L08, reusados vía `OVA.resultado.construir()`.
  - `datos.variable` (opcional, acumulador único) se aplica a CADA
    pregunta que resuelva "correcto" vía la `actualizarVariableContenido()`
    ya existente — el contenido lo declara una sola vez en vez de
    repetirlo en las cinco preguntas, a diferencia de como está hoy
    p05–p09 en `content/ova-u1.js` (que E4 todavía no tocó).
- **CSS (`components.css`)** — familia `.quiz-cuestionario*` nueva,
  después de `.quiz-retro--entrada`: `flex-direction: column` + `gap`
  en todos los niveles (regla dura de CLAUDE.md, nada de márgenes por
  hermano), divisor `border-block-start` entre preguntas en vez de
  espacio decorativo aparte.

**Verificado con Playwright (Python, Chromium), `dev/kitchen-sink.html`
y `src/index.html` por `file://`:**

- Los tres estados de I15 en la kitchen sink (`#c-i15-sin-empezar`,
  `#c-i15-a-medias` con las dos primeras resueltas por script al
  cargar, `#c-i15-completo` montada con la marca de finalización ya en
  `true` — el equivalente real de un F5 después de terminar):
  `role="status"` presente en las cinco retro más el bloque de
  resultado (seis, confirmado por atributo real); cada `<fieldset>`
  con su `<legend>`; responder las cinco preguntas a mano en
  `#c-i15-sin-empezar` (incluida la única con la respuesta correcta en
  el segundo radio, para no dar por buena una selección por defecto)
  hace aparecer el bloque de resultado con el texto exacto de la regla
  que matchea; `#c-i15-a-medias` deja el contador de la pregunta 3 en
  "Pregunta 3 de 5" sin resultado visible (2/5 no alcanza el total);
  `#c-i15-completo` arranca con los cinco "Comprobar" ocultos y el
  resultado visible de una, con el texto de la regla intermedia
  (variable fijada en 4 antes de montar).
- Foco real con `Tab` (no `.focus()` sintético — el mismo matiz que ya
  dejó documentado D2: un `.focus()` por script no siempre dispara
  `:focus-visible`) hasta el primer radio y hasta "Comprobar" de la
  primera pregunta: anillo sólido en los dos (`outlineStyle: solid`,
  `outlineWidth: 3px`), nunca `outline: none`.
- Zoom de texto 200% (proxy, `font-size` en `:root`) sobre `#c-i15`:
  sin overflow horizontal propio. `prefers-reduced-motion: reduce`
  colapsa la animación de cada `.quiz-retro` a `1e-05s` (el mismo
  token compartido de siempre, sin duplicar el media query).
- **320px — cero regresión, verificada por comparación real, no solo
  razonada:** `dev/kitchen-sink.html` sigue desbordando a 320px
  (414px de `scrollWidth` hoy; 398px en la nota de D1/D3, la
  diferencia es de sesiones posteriores no leídas en detalle esta
  vez), pero el listado elemento por elemento es **idéntico antes y
  después de esta tarea** (`git stash` contra el estado previo a E1,
  mismo conjunto de nodos desbordados: `.nav-migas__eyebrow`,
  `.media-audio`/`.media-avatar__figura`, `.dato-tabla` de T7) —
  ninguno de los nodos `.quiz-cuestionario*` aparece en esa lista.
  Overflow preexistente, ajeno a E1, heredado por quien cierre E6.
- `src/index.html`: recorrido real hasta `p10` (L08, sin responder el
  diagnóstico) sigue mostrando el estado "todavía no respondiste el
  diagnóstico" — confirma que la extracción de `obtenerResultado()`/
  `PLANTILLAS.L08` a `OVA.resultado` no cambió el comportamiento
  visible de las cuatro pantallas reales que ya usan L08 (P10/P31/
  P43/P47). Cero errores de consola en las dos páginas.
- `node --check` sobre los tres archivos `.js` tocados/nuevos (sin
  bundler en el proyecto — regla dura 4 — así que es el chequeo de
  sintaxis disponible antes de abrir el navegador).

**Cero hex nuevo, cero duración/curva nueva fuera de `tokens.css`**
(`git diff` filtrado contra `#[0-9a-f]{3,8}` y contra literales de
`ms`/`cubic-bezier`, cero coincidencias en los seis archivos tocados).

**Kitchen sink.** Sección nueva "I15 · Cuestionario (E1)" dentro de
"Componentes", después de "Interacciones nuevas (C5)": los tres
estados como exige el cierre del plan, cada uno montado con
`OVA.quiz.crear({tipo:'I15',…})` real — nada simulado con CSS. Reusa
las cinco preguntas reales del diagnóstico (mismos textos que
p05–p09) con ids de demo propios (`ks-i15-1/-2/-3`) para que los tres
montajes no compartan acumulador ni marca de finalización entre sí
dentro de la misma página (`state.js` es un singleton).

**No se tocó `content/ova-u1.js` ni `CLAUDE.md`, a propósito.** El
primero es tarea de E4 (fusionar p05–p10 reales en `p05-diagnostico`);
el segundo se corrige en E7 — el plan es explícito en que la
contradicción de "una pregunta por pantalla" se resuelve ahí, no antes
("§2: CLAUDE.md se edita en E7, no se deja la contradicción viva").
Hasta que eso pase, el motor ya sabe construir I15 pero ningún
contenido real lo usa todavía.

**10 sep — E2 cerrada: `bloqueaAvance`, canal `{alCompletar}` en
`OVA.quiz.crear()` y candado blando en `router.js`, sin Playwright
disponible en esta sesión (verificación por lectura de código y
`node --check`, mismo criterio que dejó documentado C6 cuando tampoco
lo tuvo).**

**Qué se construyó:**

- **`quiz.js` — `crear(interaccion, opciones)`.** Segundo argumento
  opcional, `{ alCompletar }` (no-op si se omite, así que ninguna
  interacción existente cambia de comportamiento). El motor no decide
  cuándo algo "está completo": cada constructor lo sabe y avisa —
  documentado en un bloque nuevo "E2" al inicio del archivo, junto al
  resto de contratos de catálogo (mismo criterio que I01–I08/I15).
  - El wrapper de preguntas (CONSTRUCTORES, I01–I05/completar/numerica/
    autoevaluacion) llama a `alCompletar()` en el mismo punto donde ya
    ocultaba "Comprobar" para siempre (acierto, agotó intentos o no
    gradable) — sin tocar nada de la lógica de intentos existente.
  - `construirCuestionario` (I15) recibe `alCompletar` como cuarto
    argumento y lo llama al resolver la última pregunta de la batería,
    y también si `yaCompleto` al montar (un F5 después de terminar no
    debe dejar "Siguiente" bloqueado otra vez — la misma trampa 2 que
    ya resolvió E1 para la nota y el reporte a SCORM, extendida aquí).
  - El resto de `CONSTRUCTORES_INSIGNIA` (I07–I13) reciben el mismo
    `alCompletar` como argumento —JS no distingue aridad, pasarlo no
    cuesta nada— pero ninguno lo llama: son exploratorias sin
    "completo" definido y ninguna pantalla real las usa con
    `bloqueaAvance` todavía. Si una futura sí lo necesita, ese
    constructor decide su propio momento — no se inventó uno genérico
    sin caso de uso real (CLAUDE.md: no diseñar para lo hipotético).
- **`router.js` — el campo `pantalla.bloqueaAvance` y el candado.**
  - `crearInteraccion(interaccion, bloqueaAvance)` arma
    `{alCompletar: manejarActividadCompleta}` solo si `bloqueaAvance`
    es verdadero y se lo pasa a `OVA.quiz.crear()`. Las tres plantillas
    que montan `interaccion` (L05, L06, L07) le pasan
    `pantalla.bloqueaAvance` — ninguna otra plantilla lo necesita
    porque ninguna otra renderiza `interaccion`.
  - `montarPantalla()` fija `bloqueoAvanceActivo` (módulo) al entrar,
    antes de cualquier `return` — así ninguna salida temprana (layout
    inexistente, no implementado, o el fallo ruidoso de la trampa 3 de
    abajo) puede heredar por descuido el bloqueo de la pantalla
    anterior. Con `pantalla.bloqueaAvance` real, lo vuelve a poner en
    `true` justo antes de construir la plantilla — si la interacción ya
    avisa que está completa durante ese mismo montaje (I15 con la
    marca puesta desde un F5 anterior), `manejarActividadCompleta()` ya
    lo devuelve a `false` antes de que la pantalla termine de armarse.
  - **Trampa 1 (nunca `disabled` real).** `actualizarBloqueoAvance()`
    pone `aria-disabled="true"/"false"` en `#nav-siguiente` y
    `hidden`/visible en la nota nueva `#nav-bloqueo-aviso` (ícono
    `lock` + "Completa la actividad para continuar", ícono y texto
    juntos — regla dura del color nunca como único código, aplicada a
    "inerte"). El botón sigue con `disabled` real de verdad SOLO en el
    extremo de siempre (`inst.esUltima`), sin tocar esa rama: son dos
    candados independientes que conviven en el mismo botón. El bloqueo
    de verdad —el que hace que el clic (o Enter/Espacio con foco en el
    botón, mismo evento) no haga nada— vive en `siguiente()`, no en el
    atributo: `aria-disabled` es puramente el reflejo/anuncio, nunca lo
    que impide el clic (un botón sin `disabled` real siempre es
    clicable, `aria-disabled` no lo previene por sí solo — de ahí que
    haga falta la guarda explícita en `siguiente()`).
  - Al desbloquear, `manejarActividadCompleta()` llama a
    `OVA.a11y.anunciar('Actividad completa. Ya puedes continuar.')` —
    pero no si la marca ya venía puesta desde antes de montar (un flag
    `construyendoPantalla`, verdadero solo durante la llamada a
    `plantilla(pantalla)`, distingue "se acaba de completar en vivo" de
    "arrancó ya completa"): anunciar en el segundo caso sería ruido
    sobre una pantalla que el estudiante ni ha visto todavía.
  - **Trampa 2 (candado blando, documentado, no tapado).** Solo
    `siguiente()` consulta `bloqueoAvanceActivo`. El drawer navega por
    `<a href="#id">` (vía `hashchange` → `alCambiarHash()` →
    `navegarA()`) y no pasa por `siguiente()`, así que una pantalla con
    `bloqueaAvance` sigue siendo saltable desde el índice o cambiando
    el hash a mano — confirmado leyendo el código de
    `configurarDrawer()`, no hizo falta tocar nada ahí. Comentario
    dejado junto a la declaración de `bloqueoAvanceActivo` explicando
    por qué es deliberado (D1: "dentro de una unidad toda pantalla es
    alcanzable"; el candado duro entre unidades es de Moodle).
  - **Trampa 3 (L01 no tiene dónde pintarlo).** `montarPantalla()`
    revienta con `fallarPantalla()` (el mismo estado de error visible
    de siempre, `role="alert"`) si una pantalla trae
    `bloqueaAvance: true` con `layout: 'L01'` — la portada esconde la
    barra inferior entera (regla dura 9), así que "Siguiente" no
    existe ahí para bloquear. Fallo ruidoso, no un `bloqueaAvance`
    ignorado en silencio.
- **`index.html` — el footer se parte en dos filas.** `.nav-inferior`
  pasa a columna con dos hijos: `.nav-inferior__fila` (lo de siempre —
  Anterior/paso/Siguiente, la fila que en mobile debe caber en una sola
  línea a 320px) y `#nav-bloqueo-aviso` (`<p hidden>`, ícono + texto),
  debajo, fuera de esa fila para no competir por el ancho que ya está
  ajustado a 320px. `#nav-siguiente` lleva `aria-describedby` apuntando
  a la nota siempre (inerte mientras está `hidden` — la mayoría de
  lectores de pantalla no exponen la descripción de un nodo oculto, así
  que no hace ruido cuando no aplica).
- **`components.css`** — `.nav-inferior__fila` hereda las reglas de
  layout que antes tenía `.nav-inferior` directo (flex, `space-between`,
  `nowrap` en mobile); `.nav-inferior__aviso` es nueva (ícono + caption
  en `--text-tertiary`, mismo tono que `.nav-inferior__paso`). Cero hex
  nuevo, cero animación: `bloqueaAvance` no está en el inventario de
  siete cosas que anima el OVA (`CLAUDE.md`) y no se le inventó una —
  es un cambio de atributo discreto, como el resto de estados ARIA del
  proyecto.

**Verificado sin Playwright (no disponible esta sesión — mismo aviso
que dejó C6):**

- `node --check` sobre `quiz.js` y `router.js`: sin errores de sintaxis.
- Lectura de código, línea por línea, de las tres trampas contra el
  texto de PLAN-ESTRUCTURA.md §3 (arriba).
- `git diff` filtrado contra `#[0-9a-f]{3,8}` y contra literales de
  `ms`/`cubic-bezier` en los cinco archivos tocados: cero coincidencias.
- Balance de etiquetas `<footer>`/`</footer>` contado a mano en
  `index.html` (1/1) y `dev/kitchen-sink.html` (2/2, la nueva y la
  existente) tras partir el footer en dos filas.
- Recorrido de código de `configurarDrawer()`/`alCambiarHash()` para
  confirmar la trampa 2 (candado blando) sin necesidad de ejecutar el
  navegador: ninguno de los dos pasa por `siguiente()`.

**Pendiente de confirmar con Playwright real en la próxima sesión (o
antes de dar E6 por cerrada):** el recorrido real de teclado sobre
`#nav-bloqueo-aviso` apareciendo/desapareciendo, el anuncio de
`aria-live` al desbloquear, 320px con la nota visible (dos líneas de
texto largo en un botón angosto) y zoom de texto 200%. La demo de la
kitchen sink (abajo) ya deja esto montado para esa verificación.

**Kitchen sink.** Dos añadidos a la sección "Chrome del OVA", dentro de
"Barra inferior": el ejemplo existente se actualizó a la nueva
estructura de dos filas sin cambiar lo que muestra, y un bloque nuevo
`#c-nav-inferior-bloqueo` con una interacción real (I02, no I15 —
para dejar claro que el mecanismo no es especial del diagnóstico) que
arranca bloqueada y suelta el candado en vivo al responder. Como
`router.js` no se carga en esta página (depende de contenido/hash
real, mismo criterio que "Motor" en T2), el script de la demo
reimplementa a mano en unas 15 líneas lo que ahí hacen
`actualizarBloqueoAvance()`/`siguiente()` — comentado como tal, para
que quien lo lea sepa que el original vive en `router.js`.

**No se tocó `CLAUDE.md`.** El campo `bloqueaAvance` se documenta ahí
en E7, junto con el resto de reglas que este plan cambia — mismo
criterio que E1 dejó sin tocar `CLAUDE.md` para I15.
