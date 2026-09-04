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
- [ ] C3 · Media: avatar y audio
- [ ] C4 · Estado compartido
- [ ] C5 · Interacciones nuevas
- [ ] C6 · Interacciones ampliadas
- [ ] C7 · Conversión del storyboard a contenido
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
