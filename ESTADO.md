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
- [ ] T3 · Chrome del OVA
- [ ] T4 · Reproductor de media
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

## Pendientes y avisos

- El contenido de Jose no bloquea nada hasta T8.
- T9 necesita el Moodle de Pablo en pie. Coordinarlo antes del viernes 4.
- L02–L13 no tuvieron la crítica de diseño ni el catálogo de componentes que
  preveía el punto 1 de T1.5 (ver decisión del 28 ago) — quedó descartado,
  no diferido a otra sesión.
- El motor (T2) solo tiene plantillas de render para L02, L05, L06 y L11.
  Cualquier tarea que monte una pantalla con otro layout (L01, L03, L04, L07,
  L08, L09, L10, L12, L13) necesita agregar su entrada a `PLANTILLAS` en
  `router.js` antes de que esa pantalla renderice — hoy cae en el estado de
  error visible, a propósito.
- T3 (chrome) recibe el `.nav-inferior` ya cableado por T2, tal cual está en
  `index.html`; ahí se agrega la barra superior, el drawer y el skip link
  alrededor de lo que ya existe, no se reescribe la navegación básica.
