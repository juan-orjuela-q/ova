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
- [ ] T5 · Componentes de contenido
- [ ] T6 · Motor de evaluación
- [ ] T7 · Datos y gráficos
- [ ] T8 · Interacciones insignia
- [ ] T9 · Empaquetado y auditoría

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

## Pendientes y avisos

- El contenido de Jose no bloquea nada hasta T8.
- T9 necesita el Moodle de Pablo en pie. Coordinarlo antes del viernes 4.
- L02–L13 no tuvieron la crítica de diseño ni el catálogo de componentes que
  preveía el punto 1 de T1.5 (ver decisión del 28 ago) — quedó descartado,
  no diferido a otra sesión.
- El motor (T2/T4) solo tiene plantillas de render para L02, L03, L04, L05,
  L06 y L11. Cualquier tarea que monte una pantalla con otro layout (L01,
  L07, L08, L09, L10, L12, L13) necesita agregar su entrada a `PLANTILLAS`
  en `router.js` antes de que esa pantalla renderice — hoy cae en el
  estado de error visible, a propósito.
- El botón de reanudar de T3 es una interpretación propia del alcance —
  ver la decisión del 28 ago—, no una especificación literal de
  `PLAN.md`. Confirmar con el usuario si el comportamiento esperado era
  otro.
- T5 debería reutilizar lo que T3 dejó genérico en vez de duplicarlo:
  `.boton-icono` (componentes.css) para cualquier botón redondo de solo
  ícono, y `OVA.a11y.elementosFocalizables()`/`ciclarFocoEn()` para el
  foco atrapado del modal de T5 (mismo patrón que el drawer).
- `OVA.media.crear()` solo sabe renderizar `media.tipo === "video"` —
  `.media-audio` sigue siendo la maqueta sin cablear de T1.5, porque
  PLAN.md no pide un reproductor de audio en T4 ("Controles propios sobre
  `<video>`"). Si en algún momento se necesita audio real, es tarea
  aparte, no una extensión silenciosa de media.js.
- El registro de instancias de `media.js` (para "un solo reproductor
  activo a la vez") no se limpia cuando el router desmonta una pantalla:
  guarda referencias a `<video>` ya desconectados del DOM indefinidamente.
  No es un bug funcional hoy (un `<video>` desconectado no reproduce y
  pausarlo es inofensivo) ni previsiblemente grave para una unidad de
  pocas pantallas, pero si una unidad crece mucho vale la pena que T9
  revise si conviene que `router.js` avise a `media.js` al desmontar.
