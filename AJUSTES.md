# AJUSTES.md — backlog de ajustes puntuales sobre D0–D8

Entre el cierre de D8 y el arranque de D9 (movimiento, `PLAN-REDISENO.md`), Juan
va a pedir ajustes puntuales sobre componentes y tipos de pantalla ya
construidos, sesión a sesión. Este archivo es ese backlog: no altera la
numeración D0–D10 ni sus decisiones (`PLAN-REDISENO.md` §0 sigue sin
re-discutirse).

Cada ítem se cierra con el mismo criterio de siempre (kitchen sink, teclado,
320px, contraste, cero hex nuevo). Cuando la tanda de ajustes esté agotada, se
consolida en una sola entrada de `ESTADO.md` y recién ahí arranca D9. Si un
ajuste cambia una regla dura, sube a `CLAUDE.md`, no se queda aquí.

---

## 1 · Fondos decorativos por pantalla — cerrado 6 sep

**Pedido.** Para todas las pantallas del curso salvo la portada y las que
tengan fondo totalmente naranja, agregar alguno de los fondos de
`public/img/backgrounds/background-*.webp`, `position: center center`,
`size: cover`, `attachment: fixed`.

**Decisión de alcance, confirmada con Juan antes de tocar código.** El pedido
nombraba solo "fondo totalmente naranja" (L12, `--surface-brand` a sangre),
pero L13 (`--surface-inverse` a sangre, texto `--text-on-inverse` blanco)
tiene el mismo problema aunque no sea naranja: los 7 archivos son gradientes
casi blancos, y ponerlos detrás de texto blanco rompe el contraste igual que
lo rompería el naranja (regla dura 2 de `CLAUDE.md`, no negociable). Juan
confirmó excluir L13 también, con el mismo tratamiento que L01/L12: superficie
sólida, sin imagen.

**Qué se hizo, en `layouts.css`, un solo bloque nuevo antes de la sección
L01:**

- Fondo aplicado a `.layout--l02` .. `.layout--l11` (los diez layouts que no
  fijan su propio `background` en superficie a sangre). Rotación fija de las
  7 imágenes por número de layout (`l02→1, l03→2, … l08→7, l09→1, l10→2,
  l11→3`), no aleatoria ni dependiente del contenido — es una decisión de
  esta tarea, no del contrato de contenido: no se agregó ningún campo nuevo a
  `ova-u1.js` para esto.
- L01, L12 y L13 no necesitaron una regla de exclusión propia: los tres ya
  fijan `background` en shorthand (color sólido) más abajo en el mismo
  archivo, y el shorthand resetea `background-image` a `none` sin que haga
  falta anularlo a mano. Quedan documentados en el comentario del bloque de
  todos modos, para que quede explícito por qué no están en la lista.
- Ruta de los assets: `url("../../public/img/backgrounds/background-N.webp")`
  — relativa a `src/styles/layouts.css`, no al documento (a diferencia de las
  rutas de `content/ova-u1.js`, que sí son relativas al documento porque las
  arma JS en tiempo de ejecución). Confirmado con Playwright que las 7
  cargan sin 404 bajo `file://`.
- Nota de plataforma documentada en el CSS, no resuelta: iOS Safari no
  soporta `background-attachment: fixed` y lo degrada a scroll normal. Es
  una limitación conocida del motor de ese navegador, no un bug de este
  cambio, y no se compensa con JS (violaría la regla dura 4 para un efecto
  que casi no se nota en un fondo casi blanco).

**Verificado con Playwright, `dev/kitchen-sink.html` y `src/index.html` por
`file://`:** los 13 layouts en la kitchen sink muestran el fondo esperado por
`getComputedStyle` (`background-image`/`-attachment`/`-size`/`-position`) —
L01/L12/L13 en `none`/`scroll`/`auto`, L02–L11 con la imagen que les toca y
`fixed`/`cover`/`center center`; las 7 imágenes decodifican bien (`naturalWidth
1920`); cero errores de consola nuevos (los tres `ERR_FILE_NOT_FOUND` que
arroja la kitchen sink son placeholders deliberados de otras secciones —
`avatar-demo-inexistente.webp`, etc. — preexistentes, no de este cambio);
320px sin scroll horizontal en `src/index.html` (`scrollWidth === clientWidth`
en la portada). No se corrió el recorrido completo de las 49 pantallas de
`src/index.html` con clic real (el script de verificación no encontró
"Siguiente" visible en la portada a 320×640, limitación del script, no del
CSS) — pendiente de un vistazo visual rápido en una sesión futura si hace
falta más confianza, pero el mecanismo (clase de layout → imagen) es el mismo
que ya prueba la kitchen sink pantalla por pantalla.

**Nada de esto tocó `tokens.css`, `index.html`, `router.js` ni el contrato de
contenido.** Cero hex nuevo (los `url()` son assets `.webp` existentes, no
colores).

---

## 2 · Layouts que no llegaban al ancho completo — cerrado 6 sep

**Encontrado al revisar el ajuste #1.** El fondo dejó visible un problema que
ya existía antes de él: L06, L07, L08 y L10 fijaban su propio `max-width` en
la raíz `.layout--l0X` (56rem, 40rem, 40rem y 46rem respectivamente), y L09
hacía lo mismo en su variante sin media (42rem). Esto contradecía la decisión
ya tomada el 27 ago (`ESTADO.md`) de quitarle el `max-width` a `.layout` para
que los 13 layouts fueran "de lado a lado de la pantalla" — cuatro layouts
nuevos, construidos después de esa decisión (C1, 4 sep), no la siguieron.
Con el fondo fijo de #1 puesto en la raíz, el problema se volvió visible: la
imagen solo cubría la caja angosta, no la pantalla completa.

**Arreglo, en `layouts.css`: el ancho de lectura se mueve de la raíz a los
hijos.** Mismo patrón en los cinco casos — se quita el `max-width` de
`.layout--l0X` y se agrega `width:100%; max-width:Nrem; margin-inline:auto;`
a los elementos visibles de ese layout (`kicker`, `titulo`, `cuerpo`,
`datos`, `interaccion`, según cuáles use cada uno). Funciona porque todos son
hijos flex directos de `.layout` (o hijos de grid en el caso de L09): el
margen automático desactiva el `stretch` del eje cruzado y centra la caja en
vez de dejarla pegada al borde — no hizo falta ninguna regla nueva de
alineación, es el mismo mecanismo que `.layout--l08`/`.layout--l10` ya usaban
para su `.layout__cuerpo`, solo que ahora también cubre kicker/título/
interacción/datos.

`text-align: center` (L08, L10) se quedó en la raíz sin tocar: no limita
ancho, solo alinea texto heredado, así que no era parte del problema.

L09 es el único caso sin `margin-inline:auto` a propósito: su variante sin
media no se centra, se lee pegada al margen igual que L02/L03/L04/L11 — el
`max-width:42rem` se movió a kicker/título/cuerpo tal cual, sin agregar
centrado donde no lo había.

**Verificado con Playwright, `dev/kitchen-sink.html` por `file://` a 1280px:**
`.layout--l06/l07/l08/l09/l10` miden los mismos 1232px de ancho que
`.layout--l02` (antes, l06/l07/l08/l10 medían 896/640/640/736px — su
`max-width` viejo en píxeles); capturas de los cuatro confirmando visualmente
que el fondo llega a los dos bordes y el contenido queda centrado a su ancho
de lectura de siempre. Cero elemento de `.layout--l06/l07/l08/l09/l10` (raíz
o descendiente) desborda a 320px. Cero hex nuevo, cero archivo fuera de
`layouts.css`.

**Hallazgo aparte, no corregido — fuera de alcance de este ajuste.** A 320px
la kitchen sink sí desborda horizontalmente, pero en secciones que este
ajuste no toca: `.media-audio__controles` (sección "Componentes"),
`.dato-tabla` (sección "Datos y gráficos") y un `.boton--outline` de
demo. Ninguno de los tres pertenece a los layouts L01–L13 ni a este ajuste;
queda anotado aquí para no perderlo, a la espera de que Juan pida corregirlo
como su propio ítem del backlog.

---

## 3 · Suprimir el audio de la portada — cerrado 6 sep

**Pedido.** Quitar el audio de la portada (L01, pantalla p01).

**Dos audios distintos en esa pantalla, solo uno era el pedido.** L01 tiene
`pantalla.media` (el video de fondo — decorativo, en loop y ya mudo por
diseño desde C3, no reproduce sonido nunca) y, por separado,
`pantalla.avatar` (la narración real: foto fija + audio + transcripción,
montada dentro de `.layout__panel` con `OVA.media.crear({tipo:'avatar', …})`).
El pedido es sobre este segundo — el único que de verdad suena.

**Arreglo, en `content/ova-u1.js`: se quitó el campo `audio` del objeto
`avatar` de p01**, dejando `imagen` y `transcripcion`. No hizo falta tocar
ningún `.js`: `crearAvatar()` en `media.js` ya tiene resuelta esta
degradación (regla dura 10 — toda pantalla con locución muestra su
transcripción con o sin audio): sin `datos.audio`, no crea `<audio>` ni
controles y muestra la transcripción directa en vez de colapsada, con la
clase `media-audio--sin-audio`. Es el mismo camino que ya usan las pantallas
sin narración de producción todavía (D8), solo que aquí es a propósito y
permanente, no un placeholder a la espera de un archivo.

**Verificado con Playwright, `src/index.html` por `file://`:** la portada ya
no tiene ningún `<audio>` ni bloque de controles; la transcripción se
muestra completa de una vez (no en `<details>` colapsado); cero errores de
consola. No se tocó `media.js`, `router.js` ni ningún CSS.

**Corrección el mismo día: Juan pidió quitar también la transcripción.** No
alcanza con vaciar `avatar.transcripcion`: `crearAvatar()` la exige junto con
`imagen` (regla dura 10 — sin transcripción no hay avatar válido) y sin ella
lanza `console.error` + `PLANTILLAS.L01` revienta con una `Error` visible en
`#app`, la misma falla ruidosa que exige `CLAUDE.md` para no renderizar a
medias. La narración de la portada no es un placeholder de producción
esperando su archivo — es una pieza que no va en esta pantalla, punto — así
que el arreglo correcto es quitar el objeto `avatar` completo de p01 en
`content/ova-u1.js`, no vaciar sus campos. `PLANTILLAS.L01` ya contempla este
caso (`if (pantalla.avatar) {…}`): sin el campo, simplemente no monta nada.
Reverificado con Playwright: `document.querySelector('.media-audio')` es
`null` en la portada, cero errores de consola.

---

## 4 · Rediseño de la barra superior — tanda 2, sobre Figma — cerrado 6 sep

**Pedido.** Referencia visual en `ref-ajustes/tanda-2/` (`TopBar-desktop.png`,
`TopBar-mobile-2estados.png`) más especificaciones exactas de Figma dadas en
tres partes: (1) botón de menú y bloque de título/breadcrumb, (2) orden y
estilo de las herramientas de la derecha, (3) reflow completo en mobile.

**Botón de menú.** Círculo de 48×48 (`--sp-12`), fondo `--surface-brand`,
ícono blanco (`--text-on-brand-display`). Blanco sobre naranja 500 mide
3.48:1 — no cumple 4.5:1 de texto normal, pero un ícono sin texto visible
solo necesita el 3:1 de WCAG 1.4.11 (objeto gráfico esencial), mismo criterio
que ya usa `--text-on-brand-display` en los botones grandes de marca. Nueva
clase de tamaño puro `.boton-icono--grande` (48px + ícono a 24px) y de color
`.boton-icono--menu`, las dos en `components.css`.

**Título de pantalla / breadcrumb.** Se reemplazó el `<ol>` de tres ítems
(Unidad › Cápsula › Tema, con la alternancia "cápsula como ítem actual")
por dos párrafos simples: un eyebrow "Unidad › Cápsula" en una sola línea
(PT Serif 700 12px, `--text-on-inverse-2`, mayúsculas, tracking 0.1em —
deliberadamente no reutiliza `.eyebrow`, que es Figtree) y debajo el nombre
de la pantalla actual, siempre visible (Figtree 700 20px = `--text-h4`,
tracking 4% pedido en Figma). La excepción vieja de "primera pantalla de
cápsula esconde el tema" ya no hace falta: `tituloSinPrefijo(pantalla.titulo)`
coincide con `pantalla.capsula` en ese caso, así que el título de abajo
repite el mismo texto del eyebrow sin verse como un error. `actualizarMigas()`
en `router.js` se simplificó a juego. El separador "›" sigue en su propio
`<span aria-hidden="true">`, igual que antes.

**Herramientas de la derecha.** Se quitó el indicador de guardado
(`#nav-guardado`, `.nav-barra__guardado`, `actualizarGuardado()` en
router.js) — no aportaba nada al estudiante. La pista de la barra de
progreso pasó de gris 800 a gris 700 (naranja 500 sobre gris 700 mide
3.12:1, sigue cumpliendo 3:1). El botón Reanudar (`.boton--outline.boton--
inverse`) fija alto a 48px, padding lateral 16px, gap 8px e ícono a 24px —
la tipografía del label (500, 16px, tracking 2%) ya era la que pedía Figma,
no cambió. Los tres botones de preferencias/autolocución/pantalla completa
comparten la nueva variante `.boton-icono--relleno`: gris 700 en reposo,
ícono blanco fijo; en hover, gris 500 más un anillo del mismo gris separado
del botón por un hueco — dos `box-shadow` apilados, no `outline`, porque
`outline` es el que exige la regla dura de foco visible y pisarlo ahí
arriesgaba que un hover y un foco por teclado se anularan entre sí.
`#nav-pantalla-completa` ganó `aria-pressed` real (antes solo cambiaba
ícono/texto) para poder mostrar el mismo punto de "activado" que ya tenía
sentido en autolocución. El punto naranja de 8×8 (`[aria-pressed="true"]::
after`) es un refuerzo visual además del ícono y el texto accesible, nunca
el único código del estado (regla dura 3) — por eso no se agregó en
`#pref-abrir`, que usa `aria-expanded` para "popover abierto", un estado
distinto de "preferencia activada". El ícono de `#pref-abrir` cambió de
`tune` a `accessibility_new` para ser fiel a la referencia de Figma.

**Mobile (≤39.999em, mismo corte que ya usaba la miga vieja).** El marcado
no cambia entre anchos, solo la disposición: `.nav-barra` pasa a grid de dos
filas (menú+migas arriba a todo el ancho; utilidades abajo, separadas por una
línea blanca de 1px a sangre respecto al padding de la barra). Dentro de
utilidades, los íconos y el grupo progreso/reanudar intercambian su posición
visual con `order` sin tocar el DOM ni el tabulador (siguen en el mismo orden
que en desktop). El grupo de progreso se empuja a la derecha con
`margin-inline-start:auto`, no con `justify-content:space-between`, a
propósito: así, si el contenido no entra en una sola línea a 320px real (no
el ancho del mockup de Figma — verificado con Playwright que a 320px sí hace
falta envolver), `.nav-barra__utilidades` puede pasar a dos líneas
(`flex-wrap`) y el grupo de progreso se sigue empujando a su propio borde
derecho en vez de quedar pegado a la izquierda igual que los íconos. Cuando
reanudar está visible, `router.js` agrega la clase `.nav-barra--reanudando`
a `.nav-barra`, que en mobile oculta el progreso (no caben los dos); en
desktop, sin ese media query, los dos siguen mostrándose juntos como pide el
Figma.

**Verificado con Playwright, `src/index.html` y `dev/kitchen-sink.html` por
`file://`:** capturas en desktop (1280px) y mobile (320px y 390px) sobre una
pantalla real con cápsula (`p13`, no su primera pantalla) confirman colores
computados exactos (menú `rgb(255,66,1)`, relleno `rgb(61,61,61)` = gris
700), texto de migas correcto, foco visible (`outline: 3px solid
rgb(255,66,1)`) en los tres botones nuevos y en Reanudar, alto de Reanudar
en 48px, y el punto naranja (`::after`, 8×8, `border-radius:999px`) solo
con `aria-pressed="true"`. A 320px `scrollWidth === clientWidth` (sin scroll
horizontal) y las utilidades envuelven a dos líneas con el progreso
igual de bien alineado a la derecha; a 390px entran en una sola línea, igual
que el mockup. Simulado el ciclo "avanzar y volver atrás" para forzar el
estado de reanudar: aparece `.nav-barra--reanudando`, el progreso se oculta
y "Reanudar" queda a la derecha, igual que el estado 2 de la referencia
mobile. Cero errores de consola nuevos en `src/index.html` (los tres
`ERR_FILE_NOT_FOUND` de la kitchen sink son los placeholders preexistentes ya
documentados en el ajuste 1). Kitchen sink actualizada en la misma tarea:
sección de migas con sus estados (con cápsula, sin cápsula, truncado) ahora
siempre sobre `--surface-inverse` porque el componente ya no se usa sobre
superficie clara; sección de barra superior con el marcado nuevo completo;
demo de preferencias/autolocución con las clases e ícono nuevos.

**Hallazgo aparte, no corregido — pendiente de decisión de Juan.** La
pantalla `p01b` ("Cómo se recorre este curso", tutorial de arranque) lista
`{ "icono": "cloud_done", "texto": "Progreso: el curso se guarda solo y
muestra cuánto llevas avanzado." }` en `content/ova-u1.js` — describe el
indicador de guardado que este ajuste acaba de quitar de la barra. Es
contenido de Jose (`disenoInstruccional/`, contrato de contenido): no se
tocó sin instrucción explícita. Queda anotado para que Juan decida si el
texto se ajusta (p. ej. dejarlo enfocado solo en "muestra cuánto llevas
avanzado", que sigue siendo cierto) o si el ícono/bullet se retira del
guion.

---

## 5 · Tipografía del drawer de índice y botón de cerrar — cerrado 6 sep

**Pedido.** En el menú desplegado (drawer de índice, `#drawer`): el nombre
del curso en PT Serif, altas y bajas, gris 950; el subtítulo de unidad
también en PT Serif; el de cápsula se queda en Figtree; título y los dos
subtítulos en gris 950, los ítems de pantalla en un gris más claro para que
la jerarquía se sienta. Además, subir el botón de cerrar un poco hacia
arriba y hacia la derecha.

**Qué se hizo, en `components.css`:**

- `.nav-drawer__titulo` (`#drawer-titulo`, el nombre del curso —
  `contenido.titulo`, no el de la unidad): pasó de `--text-label` (Figtree
  700 14px, mayúsculas, tracking) a `700 1.125rem/1.3 var(--font-display)`
  (PT Serif, 18px) sin `text-transform` — altas y bajas reales, como pidió
  Juan— y de `--text-tertiary` (gris 500) a `--text-primary` (gris 950).
- `.nav-drawer__grupo-unidad` (`<h3>`): mismo cambio de familia a PT Serif,
  mismo tamaño de antes (14px), mayúsculas y tracking sin tocar —Juan no
  pidió quitarle las mayúsculas a este nivel, solo al nombre del curso— y
  color a `--text-primary`.
- `.nav-drawer__grupo-capsula` (`<h4>`): se queda en Figtree
  (`--text-body-sm`, 600) tal cual pedido; solo sube de `--text-secondary`
  a `--text-primary` para quedar parejo con el resto de los subtítulos.
- `.nav-drawer__item`: baja de `--text-primary` a `--text-secondary` (gris
  600, 7.7:1 sobre `--surface-default`) — antes ítems y subtítulos
  compartían el mismo gris y no había jerarquía visual entre "grupo" e
  "ítem"; el estado `[aria-current="step"]` sigue marcando la pantalla
  actual con fondo + negrita, no con color, así que no necesitó ningún
  ajuste aparte.
- Botón de cerrar: nueva clase `.nav-drawer__cerrar` (agregada junto a
  `.boton-icono` en `index.html` y en la demo de `kitchen-sink.html`) con
  `transform: translate(var(--sp-1), calc(-1 * var(--sp-1)))` — un nudge de
  4px arriba y 4px a la derecha respecto a su posición normal en el flex de
  la cabecera. `transform`, no `top`/`left`: es el único de los dos que
  permite el inventario de movimiento de `CLAUDE.md`, y de paso no mueve el
  flujo del layout ni el tamaño de la caja.

**Verificado con Playwright, `src/index.html` por `file://`:** con el drawer
abierto sobre una pantalla real (`p13`), `getComputedStyle` confirma
`#drawer-titulo` en PT Serif/18px/700, `text-transform:none`, color
`rgb(11,11,11)` (gris 950), con el texto real del curso ("Contexto sobre el
mercado, la bolsa y las acciones") en altas y bajas; `.nav-drawer__grupo-
unidad` en PT Serif + `uppercase` + gris 950; `.nav-drawer__grupo-capsula`
en Figtree + gris 950; `.nav-drawer__item` en `rgb(83,83,83)` (gris 600).
El botón de cerrar se desplaza 4px a la derecha respecto a su posición sin
`transform` (comprobado comparando su `boundingBox` contra el borde de
`.nav-drawer__cabecera`). Foco por teclado verificado con una apertura real
del drawer vía teclado (Tab + Enter sobre el botón de menú, que es como
`router.js` mueve el foco a `#drawer-cerrar` al abrir): el anillo sigue
siendo el mismo `outline: 3px solid` naranja de siempre — el `transform` no
lo altera. Cero errores de consola. No se tocó `router.js` ni el contrato de
contenido.

---

## 6 · Ajustes menores: punto de estado, espaciado y ancho del drawer — cerrado 6 sep

**Pedido.** Cuatro retoques puntuales sobre lo ya cerrado en los ítems 4 y 5:
(1) el punto naranja de "activado" en autolocución/pantalla completa, al
doble de grande; (2) más espacio entre cada subtítulo del drawer y su lista
de ítems justo debajo (no el espacio dentro de cada ítem); (3) el nombre del
curso un poco más grande; (4) el drawer un poco más ancho en escritorio.

**Qué se hizo, en `components.css`:**

- Punto de `.boton-icono--relleno[aria-pressed="true"]::after`: de 8×8
  (`--sp-2`) a 16×16 (`--sp-4`), con el offset de esquina ajustado de -2px a
  -3px para que siga viéndose prendido de la punta del círculo en vez de
  quedar descentrado al crecer.
- Espacio subtítulo→ítems: **no era un problema de `gap`.** `.nav-drawer`
  es flex con `gap: var(--sp-1)`, pero sus únicos hijos directos son
  `.nav-drawer__cabecera` y el `<nav id="drawer-lista">` — los `<h3>`/`<h4>`/
  `<ul>` viven todos DENTRO de ese `<nav>`, que es flujo de bloque normal,
  sin `gap` propio. El primer intento (subir el `gap` de `.nav-drawer`) no
  cambiaba nada ahí —confirmado con Playwright midiendo la distancia real
  entre un `<h3>` y su `<ul>`: 0px— así que el arreglo correcto fue el
  margen inferior de los propios encabezados: `.nav-drawer__grupo-unidad` y
  `.nav-drawer__grupo-capsula` pasaron de `margin-block: <top> 0` a
  `margin-block: <top> var(--sp-3)` (12px). El margen de arriba —contra el
  grupo anterior— no se tocó.
- `.nav-drawer__titulo`: 1.125rem → 1.25rem (18px → 20px), mismo peso y
  familia (PT Serif 700) de tanda 2.
- Ancho del drawer en escritorio: nuevo `@media (min-width: 48em)` —mismo
  corte que ya usa `tokens.css` para subir la escala tipográfica de
  escritorio— que sube `max-width` de 22rem a 26rem tanto en `.nav-drawer`
  (también la caja estática de la kitchen sink) como en la instancia real
  `.nav-drawer--flotante`. Sin cambios por debajo de 48em: en mobile el
  drawer se queda en 22rem/100vw como antes.

**Verificado con Playwright, `src/index.html` por `file://`:** con
autolocución activada, `getComputedStyle(..., '::after')` mide 16×16 en el
punto. Con el drawer abierto a 1280px, `.nav-drawer--flotante` mide
`max-width: 416px` (26rem) y `#drawer-titulo` mide `font-size: 20px`; la
distancia real entre `.nav-drawer__grupo-unidad`/`__grupo-capsula` y su
`<ul>` siguiente (medida con `getBoundingClientRect`, no asumida) es 12px,
antes 0px. Capturas confirmando visualmente el punto más visible y el
drawer con más aire y más ancho. Cero errores de consola. No se tocó
`router.js`, `index.html` (salvo lo ya hecho en el ítem 5) ni el contrato de
contenido.

---

## 7 · Progreso y barra inferior en una sola línea en mobile — cerrado 6 sep

**Pedido.** Encontrado por Juan probando en mobile: (1) en la barra
superior, el label de progreso ("X % completado") va al lado de la barra —
en mobile eso sobra ancho; que vaya encima. (2) En la barra inferior,
"Anterior" / "Pantalla X de Y" / "Siguiente" no caben en una sola línea en
mobile; el label del medio se puede acortar a "X/Y".

**Progreso (`components.css`, dentro del mismo `@media (max-width:
39.999em)` que ya reestructura `.nav-barra` en tanda 2):**
`.nav-barra__progreso` pasa de `flex-direction: row` a `column` (label
arriba, barra debajo) — solo en ese media query, desktop no cambia. Efecto
colateral bueno, no buscado a propósito: al angostarse el bloque de
progreso, `.nav-barra__utilidades` ya no necesita envolver a dos líneas ni
siquiera a 320px real (antes sí lo hacía, ver ítem 4) — todo el chrome de la
barra superior queda en una sola línea en mobile.

**Barra inferior (`index.html`, `router.js`, `components.css`):** `#nav-
paso` pasó de un solo texto a dos versiones del mismo dato: `#nav-paso-
completo` ("Pantalla X de Y") y `#nav-paso-corto` ("X/Y"), cada una en su
propio `<span>`. `components.css` alterna cuál se ve por `display:none` /
`display:inline` según el mismo corte de 39.999em — `display:none` ya saca
el texto oculto del árbol de accesibilidad, así que no hace falta ningún
`aria-hidden` manual, y el anuncio completo para lector de pantalla sigue
viniendo de `OVA.a11y.anunciar()` en cada navegación, sin depender de este
texto visual. `router.js` (`actualizarNavInferior`) ahora llena las dos
versiones en cada navegación. Además, en el mismo media query: `.nav-
inferior` pasa a `flex-wrap: nowrap` (antes envolvía) y tanto `.nav-inferior`
como sus dos botones recortan el padding lateral (`--sp-6`→`--sp-3` en la
barra, `1.5em`→`--sp-3` en los botones) — el contenido de los botones
(ícono + "Anterior"/"Siguiente") no se tocó, solo el aire alrededor.

**Verificado con Playwright, `src/index.html` por `file://`, tres anchos
(320/375/390px):** `scrollWidth === clientWidth` en los tres (sin scroll
horizontal); `.nav-barra__progreso` mide `flex-direction: column`;
`#nav-paso-completo` en `display:none` y `#nav-paso-corto` visible con texto
"15/49"; `.nav-inferior` en `flex-wrap: nowrap` con "Anterior", el paso y
"Siguiente" en la misma fila (mismo `y` de `boundingBox`, sin superposición
de rects). A 1280px, revertido: `.nav-barra__progreso` vuelve a `row`,
`#nav-paso-completo` visible con "Pantalla 15 de 49" y `#nav-paso-corto`
oculto — desktop no cambió. Cero errores de consola. Kitchen sink
actualizada con el marcado nuevo de `#nav-paso` en la misma tarea.

---

## 8 · Componente "retrato" (imagen con máscara o marco) — cerrado 6 sep

**Pedido.** Componente nuevo de imagen para dar dinamismo al proyecto, con
dos familias, según las referencias de `ref-ajustes/tanda-3/`: **máscara**
(foto de persona sin fondo, con un `::after` detrás que cubre el 50%
inferior del alto — plano de color o, más adelante, otra imagen) y **marco**
(foto con su propio fondo, solo recortada). Dos formas compartidas: círculo
(exclusiva de marco, 1:1) y "diagonal" (esquina superior-izquierda e
inferior-derecha redondeadas, ~48px — el resto de las combinaciones se
resolvió con Juan antes de tocar código, igual que el ítem 4:

- **Alcance:** componente independiente por ahora — no toca `crearAvatar()`
  ni `media-audio`, aunque está pensado para reemplazarlo más adelante.
- **Contrato:** cuarto tipo del catálogo de `media.js` (junto a
  video/avatar/imagen), no un campo nuevo en `pantalla`: `pantalla.media =
  { tipo:'retrato', src, alt?, variante, forma, fondo? }`. Reutiliza
  `crearMedia()`/`OVA.media.crear()`, que ya está cableado en los 13
  layouts — cero cambios en `router.js`.
- **Fondo "otra imagen":** asset dedicado (los 5 fondos reales de Juan
  todavía no existen) — mientras tanto cae a un placeholder fijo
  (`public/img/backgrounds/background-1.webp`, reutilizado del ajuste #1).
  Si el contenido ya trae su propio `fondo.src`, se respeta.
- **Nomenclatura:** familia `.imagen-` en `components.css`.

**Qué se hizo:**

- `tokens.css`: nuevo `--r-xl: 48px` junto a `--r-sm/md/lg` (el radio
  diagonal, para no escribir 48px suelto — regla dura 1 es de hex, pero el
  criterio de "todo sale de un token" ya era el patrón de este archivo).
- `media.js`: `crearRetrato(datos)` + registro en `crear()`. Valida
  `src` (obligatorio), `variante` (`"marco"`/`"mascara"`) y `forma` según
  la variante (`RETRATO_FORMAS`: marco → circulo/diagonal, mascara →
  diagonal/semicirculo) y `fondo.tipo`/`fondo.valor` cuando aplica —
  cualquier combinación fuera de catálogo hace `console.error` + `null`,
  mismo patrón que el resto del archivo (y `crearMedia()` ya convierte ese
  `null` en el `Error` visible que exige el contrato de contenido).
  Degrada igual que avatar/imagen: si la foto no carga, se quita la
  `<img>` (sin marcador propio todavía — a diferencia de avatar/imagen,
  las fotos reales de Juan en `public/img/avatar/` ya existen hoy, así que
  no hay caso real que ejercite esa ruta).
- `components.css`: bloque `.imagen` nuevo. `.imagen--mascara` usa
  `isolation: isolate` + `::after` con `z-index:-1` y la foto con
  `z-index:1` — el truco estándar para que un pseudo-elemento pinte detrás
  de un hermano sin escaparse del stacking context del componente (nada de
  esto toca el `z-index` de chrome/modal). "diagonal" comparte
  `border-radius: var(--r-xl) 0 var(--r-xl) 0` entre máscara y marco;
  "semicírculo" usa `border-radius: 0 0 50% 50% / 0 0 100% 100%` (radio
  vertical al 100% de su propio alto, no una esquina redondeada normal);
  "círculo" en marco usa `--r-pill` sobre `aspect-ratio:1/1`. Los tres
  fondos planos van directo a tokens existentes (`--surface-brand`,
  `--surface-inverse`, `--nuam-grey-500` — este último referenciado
  directo, patrón ya usado en el foco doble de `components.css`).
- **Trampa encontrada y corregida:** un `url()` fijado por JS dentro de
  una variable CSS (`--imagen-fondo-src`) se resuelve contra la hoja de
  estilos donde se *consume* la variable (`components.css`, en
  `src/styles/`), no contra el documento — un `fondo.src` de contenido
  como `'../public/…'` (relativo al documento, mismo criterio que el resto
  del contrato) resolvía mal (`src/public/…`, 404). Arreglo: `crearRetrato`
  lo pasa por `new URL(fondo.src, document.baseURI).href` antes de meterlo
  en la variable, para que la ruta ya llegue absoluta y no dependa de cuál
  hoja de estilos gane la resolución.
- `dev/kitchen-sink.html`: sección nueva con las 10 combinaciones válidas
  (marco×{círculo, diagonal}; máscara×{diagonal, semicírculo}×{naranja,
  gris oscuro, gris, fondo imagen} — la última con `fondo.src` propio para
  probar el arreglo de arriba, el resto con el placeholder). Fotos reales
  de Juan: `avatar-abierto-confondo-1.webp` (marco, con fondo) y
  `avatar-sin-fondo-plano-primer-saluda.png` (máscara, sin fondo, el
  archivo que ya trae el aire arriba/lados que pide este componente).

**Verificado con Playwright, `dev/kitchen-sink.html` por `file://`:** las
10 combinaciones muestran la clase, `border-radius`, `background`/
`background-image` y `z-index` esperados por `getComputedStyle` (máscara:
`::after` en `height:50%`, `z-index:-1`, foto en `z-index:1`); las cuatro
combinaciones inválidas probadas a mano (`marco`+`semicirculo`,
`mascara`+`circulo`, sin `src`, `fondo.valor` fuera de catálogo) devuelven
`null` con su `console.error` — nunca una caja rota o a medias. Cero
overflow horizontal del bloque nuevo a 320px (`#c-imagen` mide
`scrollWidth === clientWidth` y ningún descendiente sobresale de 320px) —
el overflow global que sigue midiendo la página a ese ancho es el mismo
hallazgo ya documentado y fuera de alcance del ítem 2
(`.media-audio__controles`/`.dato-tabla`/botón de demo). Cero errores de
consola nuevos (los `ERR_FILE_NOT_FOUND` que quedan son los tres
placeholders preexistentes ya documentados en el ajuste 1). Capturas a
1280px y 320px confirmando visualmente el parecido con las tres
referencias de `ref-ajustes/tanda-3/`. No se tocó `router.js`, `state.js`
ni el contenido real de `content/ova-u1.js` — el catálogo queda listo para
usarse, pero ninguna pantalla real lo pide todavía.

**Pendiente, fuera de alcance de este ítem:**

- Los 5 fondos dedicados para `fondo.tipo:'imagen'` — hoy cae al
  placeholder de `public/img/backgrounds/`. Cuando Juan los entregue, se
  agregan a `content/ova-u1.js` vía `fondo.src`; no hace falta tocar
  `media.js` ni `components.css`.
- El reemplazo de `crearAvatar()`/`media-audio` por este componente —
  decisión explícita de Juan de dejarlo para una tarea aparte.
- Ningún estado de "foto sin cargar" propio (marcador con ícono, como
  avatar/imagen) — no hay caso real que lo ejercite todavía porque las
  fotos de `public/img/avatar/` ya existen; se agrega si aparece un caso
  real que lo necesite.

---

## 9 · Pantalla nueva "Te damos la bienvenida" — tanda 4, cerrado 6 sep

**Pedido.** Pantalla nueva justo después de la portada (no viene del
storyboard de Jose): avatar en máscara a la izquierda, texto de bienvenida
a la derecha, sobre la retícula exacta de `ref-ajustes/tanda-4/
referencia-tanda-4.png` (12 columnas, margen 40px, medianil 40px, imagen y
texto de 5 columnas cada uno).

**Dos decisiones de alcance, confirmadas con Juan antes de tocar código**
(mismo criterio que el ítem 4): el catálogo L01–L13 está cerrado contra
`BRIEF-DI.md` (regla dura 8) y esta pantalla no viene de ahí, así que había
que decidir cómo encajarla. Juan eligió **no** abrir un layout nuevo (L14)
ni construir una retícula de 12 columnas reusable: la pantalla es una
**variante de L03** ("media a un lado, texto al otro"), y la retícula vive
solo dentro de esa variante — L02–L13 no se tocan.

**Qué se hizo:**

- `router.js` (`PLANTILLAS.L03`): agrega la clase `.layout--l03--retrato`
  solo cuando `pantalla.media.tipo === 'retrato'` — no es un campo nuevo
  del contrato, se deriva del mismo `media.tipo` que ya decide qué
  construye `OVA.media.crear()`. Las 4 pantallas reales que usan L03 con
  video/avatar no cambian: siguen con el 50/50 de siempre.
- `layouts.css`: dentro del mismo `@media (min-width: 48em)` de L03,
  `.layout--l03--retrato` redefine `grid-template-columns` a
  `repeat(12, 1fr)` con `column-gap: var(--sp-10)` (40px — el mismo token
  que ya usan margen/medianil de otros componentes, no un valor nuevo) y
  reubica los `grid-template-areas`: retrato en columnas 1–5, texto en
  6–10, columnas 11–12 sin usar a propósito (el margen derecho extra que
  trae la referencia de Juan). Un solo gutter de 40px entre los dos
  bloques — no una columna vacía de por medio. Regla aparte,
  `.layout--l03--retrato .layout__cuerpo p:first-child { font-weight:
  700 }` para "¡Hola, soy Claudia!": sigue siendo el mismo campo `cuerpo`
  de siempre, no un componente de texto distinto.
- `content/ova-u1.js`: pantalla nueva `p01-bienvenida` (L03), entre `p01`
  (portada) y `p01a` (accesibilidad) — kicker "Antes de empezar" igual
  que sus vecinas, `progreso: false` (es arranque, no cuenta avance,
  mismo criterio que p01a/p01b). `media` usa el catálogo "retrato" del
  ítem 8 (`variante: 'mascara'`, `forma: 'diagonal'`, `fondo` sin
  especificar — cae al naranja por defecto, que es el que pide la
  referencia) con la foto real que ya usa la kitchen sink desde el ítem 8
  (`avatar-sin-fondo-plano-primer-saluda.png`). Texto de cuerpo tomado
  literal de la referencia.
- `dev/kitchen-sink.html`: segundo ejemplo dentro del bloque L03 (mismo
  patrón que el par de ejemplos de L05) con la variante montada de
  verdad vía `OVA.media.crear()`.

**Verificado con Playwright, `src/index.html` (navegando a
`#p01-bienvenida`) y `dev/kitchen-sink.html`, por `file://`:** a 1280px,
`getComputedStyle` confirma `grid-template-columns` en 12 pistas de
63.33px con `column-gap: 40px`; la imagen ocupa de x=40 (el margen del
`.layout`) a x=516.66 (5 columnas + 4 medianiles internos, la matemática
esperada de un elemento que abarca varias pistas de grid); el texto
empieza en x=556.66 (un solo medianil de 40px después) y termina en
x=1033.33, dejando el resto del viewport libre a la derecha — la misma
retícula que describió Juan, confirmada con `getBoundingClientRect`, no
asumida. Primer párrafo en `font-weight: 700`, los otros dos en el peso
normal. La foto carga (`naturalWidth: 1254`, sin roturas) con la clase
`imagen imagen--mascara imagen--diagonal imagen--fondo-naranja`. A 320px,
`.layout--l03` cae a `display: flex` (apilado, sin la retícula de
escritorio) y `scrollWidth === clientWidth` (sin scroll horizontal); zoom
de texto al 200% tampoco desborda. Foco visible verificado sobre
"Siguiente". Cero errores de consola nuevos en ambas páginas (los tres
`ERR_FILE_NOT_FOUND` de la kitchen sink son los placeholders preexistentes
ya documentados en el ítem 1). Cero hex nuevo — el único valor de
espaciado es `var(--sp-10)`, que ya existía en `tokens.css`.

**Pendiente, fuera de alcance de este ítem.** El componente "retrato" (y
por lo tanto esta pantalla) no tiene locución propia — es una foto
estática con texto, sin audio ni transcripción de narración, tal como se
ve en la referencia. Si más adelante Juan quiere que Claudia narre esta
pantalla en voz, hay que decidir aparte cómo encaja el audio con este
componente (el ítem 8 ya dejó anotado que reemplazar `crearAvatar()` por
"retrato" es una tarea propia, todavía no hecha).

---

## 10 · Gap entre kicker/título/cuerpo — tanda 4, cerrado 6 sep

**Pedido.** Al recorrer `p01-bienvenida`, Juan notó demasiado aire entre
"Antes de empezar" (kicker), "Te damos la bienvenida" (título) y "¡Hola,
soy Claudia!" (primera línea de cuerpo) — y que era un patrón general de
"cuando hay bloques de texto", no solo de esa pantalla. Pidió un sistema
que agrupe esos elementos con su propio gap (sugirió 16px).

**Por qué era el gap y no un ajuste puntual.** Antes de esta tarea,
kicker/título/cuerpo eran tres hermanos sueltos de `.layout` (flex
column) y heredaban su `gap: var(--sp-6)` (24px) — el mismo valor que
separa el bloque de texto completo de media/datos/interacción. Ese 24px
tiene sentido para diferenciar zonas de la pantalla, no para separar un
kicker de su título. `CLAUDE.md` prohíbe márgenes por elemento para
separar hermanos ("nada de márgenes por elemento para separar
hermanos"), así que la única forma correcta de darle a ese trío un gap
distinto es agruparlo en su propio contenedor con su propio `gap` — no
había atajo de una sola línea de CSS.

**Alcance, decidido antes de tocar código.** Se aplica solo donde
kicker+título+cuerpo (o su equivalente de lectura — lista, texto
condicional) son hermanos apilados de verdad: L02, L03 (+variante
retrato del ítem 9), L04, L08, L09, L10, L11, L13. Quedan fuera:

- **L01** (portada) — ya tiene su propio arreglo de panel, no pasa por
  el gap genérico de `.layout`.
- **L05/L06/L07** — nunca tienen `cuerpo` (tarjetas/interacción ocupan
  su lugar); agrupar kicker+título solos no era lo que Juan señaló.
- **L12** — título y cuerpo van lado a lado a propósito (el número
  grande junto a su explicación en la misma fila del grid, no
  apilados). Agruparlos los habría apilado, rompiendo esa disposición.

**Qué se hizo:**

- `layouts.css`: `.layout__texto` nuevo — `display:flex;
  flex-direction:column; gap:var(--sp-4)` (16px, el mismo valor que ya
  usa `.layout__cuerpo` entre sus propios párrafos — un solo ritmo de
  aire en todo el bloque de lectura, no dos). `min-width:0` para que un
  párrafo largo no fuerce el ancho del hijo de grid/flex que lo
  contiene.
- `router.js`: helper nuevo `envolverTexto(elementos)` — arma el
  `<div class="layout__texto">` y filtra los elementos ausentes
  (kicker opcional, cuerpo condicional en L08). Cada `PLANTILLAS.LXX`
  tocada arma sus nodos igual que antes y los pasa por
  `envolverTexto()` en vez de hacer tres `appendChild` sueltos. **L09
  es un caso aparte a propósito:** el kicker se queda *fuera* del
  contenedor — en L09 ocupa su propia fila a todo el ancho por encima
  de las dos columnas (lista + media), no el primer renglón de un
  bloque apilado como en el resto; solo título+lista comparten
  `.layout__texto` ahí.
- `layouts.css`, L03/L03--retrato/L09/L11 (los cuatro layouts con grid
  real): `grid-template-areas` pasó de tres áreas (`kicker`/`titulo`/
  `cuerpo`) a una sola (`texto`) — `grid-area` solo puede ir en hijos
  directos del contenedor de grid, y ahora kicker+título+cuerpo son
  nietos, no hijos. Esto simplificó los templates (menos filas), no los
  complicó.
- **Bug real encontrado por Playwright al verificar el gap, no
  hipotético — arreglado en el mismo commit.** Al consolidar las filas
  de L09/L11, el gap entre kicker y `.layout__texto` en pantallas
  cortas (`p01b`, `p32` — sin media, sin componente) medía 166px en vez
  de 24px. Causa: `align-content` por defecto es `normal`, que en un
  grid de filas `auto` dentro de un contenedor de alto fijo
  (`.layout` mide `min-block-size:100%` de `#app`) se comporta como
  `stretch` — reparte el alto sobrante del contenedor entre las filas
  `auto` en vez de dejarlas a su tamaño de contenido real. No es un bug
  de esta tarea (ya existía con tres filas separadas en vez de una),
  solo se volvió visible al concentrarse en un solo hueco en vez de
  repartirse entre dos. Arreglado con `align-content: start` en
  `.layout--l09` y `.layout--l11`. L03 no lo necesitaba: su variante de
  este ítem quedó en una sola fila de grid, sin gap entre filas que
  inflar.
- `dev/kitchen-sink.html`: los ocho bloques de layout tocados (más las
  cuatro variantes de L09) llevan ahora el mismo `<div class=
  "layout__texto">` a mano, para que la kitchen sink siga siendo un
  espejo real del DOM que arma `router.js` — sin esto, sus ejemplos
  estáticos de L03/L09/L11 se habrían roto en el grid (ningún elemento
  suelto tiene ya `grid-area` propio en esos tres).

**Verificado con Playwright, `src/index.html` (once pantallas reales:
`p01-bienvenida`, `p01a`, `p01b`, `p02`, `p04`, `p10`, `p14`, `p32`,
`p34`, `p35`, `p36` — cubren los ocho layouts tocados y los cuatro casos
de L09) y `dev/kitchen-sink.html`, por `file://`:** `getBoundingClientRect`
mide 16px entre kicker→título y título→cuerpo en las ocho pantallas
donde van agrupados; en las tres de L09 con kicker separado, kicker→
`.layout__texto` mide los 24px de siempre y título→lista (dentro del
contenedor) mide 16px. El gap hacia media/datos/interacción, donde
existe, se mantiene en 24px sin cambios en las once. Cero scroll
horizontal a 320px ni con zoom de texto al 200% en `p01-bienvenida`,
`p32` y `p34`. Cero errores de consola nuevos en ninguna de las dos
páginas (los tres `ERR_FILE_NOT_FOUND` de la kitchen sink son los
placeholders preexistentes ya documentados en el ítem 1). Cero hex
nuevo — el único valor de espaciado nuevo es `var(--sp-4)`, que ya
existía en `tokens.css`.

**Hallazgo aparte, no corregido — fuera de alcance de este ítem.** L12
usa `align-items:center` sobre el mismo patrón de filas `auto` que
causó el bug de arriba en L09/L11 — no se verificó si también sufre el
mismo inflado de `align-content:normal`, porque L12 no se tocó hoy (su
título y cuerpo van lado a lado a propósito, ver arriba). Queda
anotado por si Juan lo nota al revisar esa pantalla.

---

## 11 · Corrección: retícula de `p01-bienvenida` recostada a la izquierda — cerrado 6 sep

**Pedido.** La retícula de 12 columnas del ítem 9 (imagen + texto, 5
columnas cada una) quedaba pegada al margen izquierdo, con las dos
columnas libres juntas a la derecha. Tenía que quedar centrada: 1
columna de margen, 5 de retrato, 5 de texto, 1 columna de margen —
simétrico a los dos lados.

**Qué se hizo, en `layouts.css`:** `grid-template-areas` de
`.layout--l03--retrato` pasó de `"media×5 texto×5 . ."` (las dos
columnas sin usar juntas al final) a `". media×5 texto×5 ."` (una sin
usar antes del retrato, otra después del texto). Un solo carácter de
diferencia en el patrón, mismo mecanismo de siempre.

**Verificado con Playwright, `src/index.html` (`#p01-bienvenida`) por
`file://`:** margen izquierdo y derecho miden 143.33px y 143.34px
(prácticamente idénticos, la diferencia es redondeo de subpíxel);
retrato y texto miden 476.67px y 476.66px cada uno (los mismos 5
columnas de antes, sin cambio de ancho); el medianil entre ambos sigue
en 40px. Sin scroll horizontal a 320px; sin overflow nuevo en la
kitchen sink; cero errores de consola nuevos.

---

## 12 · Centrado vertical entre columnas enfrentadas — cerrado 6 sep

**Pedido.** Regla general: siempre que un bloque tenga dos columnas
enfrentadas (media/texto en L03, figura/texto en L11, texto/media en
L09), sus ítems deben quedar centrados verticalmente entre sí, no
alineados arriba.

**Qué se hizo, en `layouts.css`:** los tres grids de dos columnas que
`align-items: start` dejaba pegados arriba —`.layout--l03` (cubre
también la variante `--retrato` del ítem 9, que no fija su propio
`align-items`), `.layout--l09` y `.layout--l11`— pasan a `align-items:
center`. `.layout--l12` ya usaba `center` desde C2 (4 sep, cifra grande
junto a su explicación) — queda como estaba, ya cumplía la regla antes
de que se pidiera. En L09 y L11 el cambio solo se nota en la fila de
dos columnas: la otra fila (kicker a todo el ancho en L09;
interacción/recursos a todo el ancho en L11) es un solo ítem por fila,
centrarlo o no da igual.

**Verificado con Playwright, `src/index.html` (`p01-bienvenida`, `p14`
—L03—, `p34` —L11—) y `dev/kitchen-sink.html` (L09 con media, el único
caso real con `.layout__media` para probar) por `file://`:** el centro
vertical (`top + height/2`) de cada columna contra la otra difiere en
0.01px o menos (redondeo de subpíxel) en los cuatro casos — centrado
real, no aproximado. Sin scroll horizontal a 320px, sin overflow nuevo
en la kitchen sink, cero errores de consola nuevos. Cero hex nuevo (un
solo valor de alineación, sin tocar `tokens.css`).

---

## 13 · Reproductor de avatar/audio: sombra y tres variantes de figura — tanda 7, cerrado 6 sep

**Pedido.** Mejorar `.media-audio` (el reproductor de avatar/audio de C3):
(1) sombra en la carta, en las cuatro variantes; (2) tres variantes nuevas
de figura que reemplazan el círculo chico de siempre por una foto grande
superpuesta a la carta — `avatar-sm`, `avatar-md`, `avatar-lg` —, con
geometría exacta dictada por Juan (tamaño y desfase en px contra los
bordes de la carta) y una cuarta variante "sin avatar" que es la carta de
siempre, solo con la sombra nueva.

**Geometría, tal cual la dictó Juan (verificada con Playwright, no
asumida):**

- **avatar-sm** — figura 120×120, centrada horizontalmente, se mete 24px
  en la carta (sobresale los 96px restantes por encima). Radio 16px en
  las tres esquinas salvo la inferior-izquierda, recta.
- **avatar-md** — círculo 240×240, arriba a la derecha: 48px de desfase
  contra el borde derecho de la carta, 164px contra el borde superior (se
  mete 76px). Va **detrás** de la carta.
- **avatar-lg** — cuadrado 480×480 (Juan lo aclaró en dos pasos: primero
  dio el desfase superior, 432px; al preguntar si ese número era el
  tamaño completo o solo el desfase, confirmó 480×480 con 48px de
  traslape — 480 − 48 = 432, el número ya dado), mismo desfase derecho de
  48px que avatar-md. Radio 16px en las cuatro esquinas — a diferencia de
  avatar-sm, sin excepción. También detrás de la carta.
- En **avatar-md y avatar-lg, la esquina superior-derecha de la carta va
  recta** (sin radio): con radio, la figura circular/cuadrada que la
  atraviesa dejaría asomar un triángulo del fondo detrás de ella.

**Decisión de arquitectura: `.media-avatar` es un envoltorio nuevo, padre
de `.media-audio`, no un hijo suyo.** El efecto "detrás de la carta" de
avatar-md/avatar-lg necesita que la carta pinte *después* que la figura en
el orden de apilamiento. Un hijo con `z-index` negativo dentro de
`.media-audio` no sirve: el fondo de un contenedor con `position:relative`
pinta antes que cualquiera de sus hijos, incluidos los de z-index
negativo — la figura seguiría viéndose encima del propio fondo de la
carta. Con la figura como hermana *anterior* de la carta (ambas dentro de
`.media-avatar`, que sí es `position:relative`) y la carta sin `position`
propio (in-flow), la carta pinta encima de la figura con z-index negativo
sin que su propio fondo entre en el problema. avatar-sm no necesita
z-index: un elemento posicionado ya pinta encima de uno sin posicionar por
defecto, y ahí la figura va al frente, no detrás.

`.media-audio` pierde su `max-width` propio dentro de `.media-avatar`
(pasa a `width:100%`, y el `max-width:26rem` se mueve al envoltorio): así
la figura, posicionada contra los bordes de `.media-avatar`, siempre
coincide con los bordes reales de la carta en vez de con un contenedor
más ancho.

**`media.js` (`crearAvatar`):** nuevo campo opcional `datos.variante`
("sm"/"md"/"lg"). Sin él, la carta se queda exactamente como estaba antes
de esta tarea — el círculo chico de `.media-audio__avatar` inline, sin
tocar — más la sombra nueva: es la lectura literal de "para la variante
sin avatar, simplemente se le va a agregar la sombra". Con variante, el
círculo chico no se construye (las dos rutas no conviven) y
`envolverConFigura()` arma `.media-avatar` con la figura grande y mete
adentro la carta ya armada; se llama en los dos puntos de retorno de
`crearAvatar` (la rama sin audio y la rama con audio) para que las cuatro
combinaciones de variante × con/sin audio funcionen igual. Ningún
contenido real de `content/ova-u1.js` fija `variante` todavía — mismo
criterio que el componente "retrato" del ítem 8: el catálogo queda listo
y verificado en la kitchen sink, pendiente de que una pantalla real lo
pida.

**`tokens.css`:** `--shadow-card` (el `box-shadow` exacto que dio Juan,
tokenizado igual que radios/duraciones para no repetir el `rgba()` suelto)
y `--r-avatar: 16px` (no encaja en la escala sm/md/lg/xl existente —
queda entre md=12 y lg=20 — así que es un token nuevo e independiente,
documentado, en vez de forzarlo dentro de la escala).

**Hallazgo verificado, no corregido — sin impacto en la regla dura 7.**
avatar-lg (480px) es más ancho que `.media-avatar` en viewports angostos,
así que a 320px su borde izquierdo cae en X negativo (fuera de pantalla).
Medido con Playwright de forma aislada (el demo de avatar-lg solo, sin
nada más en `<body>`): `scrollWidth` se queda en 320px igual que
`clientWidth` — un elemento hijo con posición negativa no extiende el
scroll horizontal de una página LTR, así que esto **no** viola la regla
dura 7 ("sin scroll horizontal a 320px"), verificado empíricamente y no
solo asumido. Sí significa que la foto se recorta invisible por la
izquierda a ese ancho — sin especificación de Juan sobre el comportamiento
en mobile, no se inventó ningún tratamiento responsive por decisión propia
(mismo criterio que el resto del proyecto: estas decisiones se confirman
con Juan, no se resuelven a ciegas). Queda anotado para cuando haya una
pantalla real con avatar-lg y aparezca el caso de verdad.

**Kitchen sink:** sección "Reproductor de avatar/audio" ampliada con tres
instancias reales (`avatar-sm`/`avatar-md`/`avatar-lg`, con una foto real
de `public/img/avatar/` en vez del placeholder inexistente que usan las
dos instancias viejas, para poder verificar tamaño/recorte/posición con
Playwright y no solo el color de fondo del vacío) y texto explicando la
sombra y las tres variantes. Nueva clase de andamiaje
`.ks-muestras--avatar-figuras` (solo en esta página): sin ella, la figura
de avatar-lg (sobresale 432px sobre la carta, espacio que
`position:absolute` no reserva en el flujo) se montaba encima del párrafo
anterior porque las muestras van una tras otra sin el aire propio de una
pantalla real — bug de espaciado de la kitchen sink, no del componente,
arreglado con `padding-top` en el contenedor de las tres muestras nuevas.

**Verificado con Playwright, `dev/kitchen-sink.html` y `src/index.html`
por `file://`:** geometría exacta de las tres variantes contra los números
de Juan, medida con `getBoundingClientRect`/`getComputedStyle` (no
asumida): avatar-sm 96px sobre la carta + 24px de traslape + radio
`16px 16px 16px 0px` + centrada; avatar-md 164px sobre + 48px del borde
derecho + `border-radius:999px` + `z-index:-1` + esquina de la carta en
`20px 0px 20px 20px`; avatar-lg 432px sobre + 48px del borde derecho +
480×480 + radio `16px` uniforme + `z-index:-1` + misma esquina recta de
la carta. Los tres botones de play y el `<summary>` de transcripción
siguen totalmente clicables (`elementFromPoint` en su centro devuelve el
control mismo, no la figura) y el orden de Tab no cambia ni la figura
entra en él (es `aria-hidden`, sin nada focalizable). Pantalla real `p04`
(avatar sin variante): sombra aplicada, círculo chico intacto, sin figura
grande, cero errores de consola — sin regresión sobre las trece pantallas
reales que ya usan `tipo:"avatar"`. Cero hex nuevo en los cuatro archivos
tocados (`tokens.css`, `components.css`, `media.js`,
`dev/kitchen-sink.html`).

---

## 14 · Tanda 8: gap de tarjetas p01a, ancho máximo p01b, p02 a dos columnas con avatar — cerrado 6 sep

**Pedido.** Tres retoques puntuales, identificados contando pantallas desde
la portada (confirmado con Juan antes de tocar código, dado que el conteo
real no es 1:1 con los ids del contenido): pantalla 3 = `p01a` (tarjetas de
accesibilidad), pantalla 4 = `p01b` (lista de controles de navegación),
pantalla 5 = `p02` (objetivos de aprendizaje). (1) En p01a, reducir a la
mitad el gap entre las tarjetas. (2) En p01b, que el contenido no se
expanda tanto en escritorio: limitar el ancho máximo del eyebrow, el
título y el contenedor de ítems. (3) En p02, pasar a la disposición de dos
columnas de L03 (Juan dijo "L02"; confirmado con Juan que se refería a
L03, el único layout de dos columnas 50/50 — L02 en el código es "media
arriba, texto debajo", una sola columna), con la locución de avatar-lg a
la izquierda en vez del video, el contenido a la derecha, y un componente
nuevo de "listado enriquecido": números en círculos grandes (~40px), PT
Serif bold, círculo negro y número naranja.

**1 · Gap de tarjetas en p01a, en `layouts.css`.** `.layout--l09__grilla`
(la grilla de tarjetas de accesibilidad, AJUSTES.md tanda 5 ítem 13) tenía
`gap: var(--sp-10)` (40px) tanto en la versión apilada de mobile como en
la de grid de escritorio — las dos declaraciones bajaron a
`var(--sp-5)` (20px, la mitad exacta). El separador entre el encabezado y
la grilla (`.layout--l09--tarjetas`, un bloque distinto) se quedó en
`--sp-10`: no es "el gap entre las cards", es el aire antes de la grilla.

**2 · Ancho máximo compartido en p01b, en `layouts.css`.** Antes de este
ajuste, `.layout--l09:not(:has(.layout__media))` ya acotaba kicker/título/
`.layout__cuerpo` a 42rem (AJUSTES.md #2), pero `.layout__cuerpo--controles`
(el contenedor de ítems de p01b, deliberadamente sin la clase
`.layout__cuerpo` desde tanda 6 para no heredar ese tope) no tenía ningún
límite — se expandía a los 72rem del `.layout` completo mientras el
título se quedaba en 42rem, dos anchos distintos en el mismo bloque de
lectura. Arreglo: `.layout__cuerpo--controles` gana su propio
`max-width: 72rem` (mismo valor que ya usa la grilla de tarjetas de p01a,
no uno inventado), y una regla nueva —`.layout--l09:has(.layout__cuerpo--controles)
.layout__kicker`/`.layout__titulo`— sube esos dos de 42rem al mismo
72rem, solo cuando `.layout__cuerpo--controles` está presente (no afecta a
`p32`, la otra pantalla real sin media de L09, que sigue en 42rem con su
lista de ideas clave). Las dos reglas de 42rem y 72rem para kicker/título
empatan en especificidad (misma cantidad de clases): la de 72rem gana por
venir después en el archivo, no por ser más específica — documentado en
el propio CSS para que no se reordene por accidente.

**3 · p02 a dos columnas con avatar, en `router.js`/`layouts.css`/
`components.css`/`content/ova-u1.js`.**

- **Layout de la pantalla:** `p02` pasa de `L04` (lectura larga, media
  apilada debajo) a `L03` (dos columnas 50/50). Nueva variante
  `.layout--l03--avatar`, con el mismo mecanismo que ya usa
  `.layout--l03--retrato` (AJUSTES.md #9): `router.js` la agrega solo
  cuando `media.tipo === 'avatar'` — un tipo que ninguna de las cuatro
  pantallas reales de L03 había usado hasta ahora (todas usan
  `tipo:"imagen"`), así que no hay riesgo de tocarlas. La variante
  intercambia `grid-template-areas` de `"texto media"` a `"media texto"`:
  mismas dos columnas 1fr/1fr de siempre, solo cambiadas de lado.
- **Media:** el video mudo de motion (`p02-objetivos-aprendizaje.mp4`) se
  reemplaza por `media.tipo:"avatar"` con `variante:"lg"` (el catálogo de
  AJUSTES.md tanda 7) y la foto `avatar-medio-confondo-1.webp` — la misma
  que ya usa la demo de las tres variantes de figura en la kitchen sink,
  no una nueva. Sin `audio`: no existe locución grabada para esta
  pantalla todavía, así que degrada a transcripción visible sin colapsar
  (regla dura 10), el mismo estado de placeholder de producción que ya
  usan otras pantallas reales (C7, L08/L10). La `transcripcion` es la
  misma que ya tenía el video, verbatim.
- **Listado enriquecido, componente nuevo.** El contrato de `p02` ya no
  mete los cinco objetivos como texto plano numerado a mano dentro de
  `cuerpo` ("1. Diferenciar…"); pasan a un campo nuevo `pantalla.lista`
  (array de strings, sin el número — opcional, sibling de `cuerpo`, mismo
  criterio que "tarjetas"/"controles" en L09). `crearListaEnriquecida()`
  en `router.js` arma un `<ol class="lista-enriquecida">` real: el `<ol>`
  nativo es lo que le da a un lector de pantalla "1 de 5, 2 de 5…", y el
  número visual de cada círculo lleva `aria-hidden="true"` para no
  duplicarlo — mismo patrón que el ícono de check de `crearListaIdeas()`.
  CSS nuevo en `components.css`: círculo `--sp-10` (40px) con
  `background: var(--surface-inverse)` (negro) y
  `color: var(--nuam-orange-300)` (el naranja que `tokens.css` ya reserva
  para texto sobre superficie inverse, no uno nuevo), número en
  `700 1.25rem var(--font-display)` (PT Serif bold). Contraste
  naranja-300 sobre gris-950 calculado: 6.9:1, muy por encima del 3:1 que
  exigiría como texto grande y del 4.5:1 de texto normal.

**Verificado con Python + Playwright** (el proyecto usa Playwright vía
Node en sesiones anteriores; este entorno no tenía el paquete de Node
instalado, así que esta sesión corrió los mismos chequeos con el
Playwright de Python ya presente en la máquina — mismo motor Chromium,
misma metodología), abriendo `src/index.html` y `dev/kitchen-sink.html`
por `file://`:

- p01a: `.layout--l09__grilla` mide `gap: 20px` computado, y la distancia
  real entre la primera y segunda tarjeta (`getBoundingClientRect`) es
  20.0px tanto en la grilla de escritorio (1280px) como apiladas en
  mobile (375px, distancia vertical). 375px sin scroll horizontal.
- p01b: `getComputedStyle(...).maxWidth` de kicker, título y
  `.layout__cuerpo--controles` mide `1152px` (72rem) los tres, a 1280px.
  320px sin scroll horizontal.
- p02: la raíz tiene `layout--l03` y `layout--l03--avatar`;
  `grid-template-areas` computado es `"media texto"`; el rectángulo de
  `.layout__media` (`left: 40`) queda a la izquierda del de
  `.layout__texto` (`left: 652`) a 1280px; `.media-avatar--lg` se monta
  de verdad. Cinco `.lista-enriquecida__item` reales; el círculo mide
  `40px × 40px`, fondo `rgb(11, 11, 11)` (`--surface-inverse`), texto
  `rgb(255, 112, 67)` (`--nuam-orange-300`), fuente `"PT Serif"` peso
  `700`, `border-radius: 999px`; el contenedor es un `<OL>` real y el
  número lleva `aria-hidden="true"`. 320px sin scroll horizontal.
- Kitchen sink: sección nueva "Lista enriquecida" (3 ítems de ejemplo) y
  tercer ejemplo de L03 ("variante avatar") ambos presentes en el DOM.
- Cero errores de consola nuevos en las cinco páginas comprobadas (los
  `ERR_FILE_NOT_FOUND` de la kitchen sink son los placeholders
  preexistentes ya documentados en el ajuste 1). Cero hex nuevo en los
  cinco archivos tocados (`layouts.css`, `components.css`, `router.js`,
  `content/ova-u1.js`, `dev/kitchen-sink.html`).

**Corrección el mismo día: el ancho máximo de p01b quedó bien pero el
bloque se leía pegado al margen izquierdo — Juan pidió que se centrara
completo, como si llevara `margin-inline:auto`.** Las tres piezas
(`.layout__cuerpo--controles`, kicker y título) ya tenían su `max-width:
72rem` de arriba; les faltaba el `margin-inline: auto` para que ese ancho
menor se centrara en vez de quedarse contra el borde izquierdo (el
comportamiento por defecto de un hijo de `.layout`/`.layout__texto` en
flex-column es `align-items: stretch`, que sin márgenes automáticos
ocupa todo el ancho — con `max-width` puesto, "estirarse" simplemente lo
deja pegado a la izquierda). Se agregó `margin-inline: auto` a las tres
reglas de 72rem ya existentes, sin tocar nada más. Verificado con
Playwright: a 1280px y 1920px, el margen izquierdo y derecho de kicker
(157.7px de ancho), título (459px) y `.layout__cuerpo--controles`
(1152px) miden exactamente igual entre sí (`getBoundingClientRect`, no
asumido) — centrado real, no aproximado. `p32` (la otra pantalla real de
L09 sin media, que sigue en 42rem sin centrar por AJUSTES.md #2) se
comprobó como control: su kicker sigue pegado al margen izquierdo
(40px vs 888px de margen derecho a 1600px), confirmando que el cambio no
se filtró fuera de la variante de p01b. 320px sin scroll horizontal,
cero errores de consola nuevos.

**Segunda corrección: los textos de p01b no quedaban alineados entre sí —
arrancaban en una x distinta por fila.** No era un problema de
centrado: la imagen de cada control tenía `flex: 0 1 18.5rem` (ancho fijo
pensado, ver el comentario original de la clase), pero el texto de al
lado no tenía ningún `flex` propio — por defecto un flex item usa
`flex-basis:auto`, que para texto es su ancho sin envolver (potencialmente
muy ancho, una frase completa en una sola línea). Con imagen y texto
compitiendo por el mismo espacio y los dos con `flex-shrink` activo, el
algoritmo de flexbox repartía el achique entre ambos según ese tamaño
hipotético — y como cada frase mide distinto, cada fila encogía la imagen
en una proporción distinta (verificado con Playwright antes del arreglo:
anchos reales de imagen entre 181px y 237px según la fila, nunca los
296px del `flex-basis` declarado). Arreglo: el texto de cada control
gana su propia clase (`layout__controles-texto`, agregada en
`router.js` junto a `tipo-cuerpo`) con `flex: 1 1 0%; min-width: 0` — al
sacar al texto del reparto de achique (su tamaño hipotético pasa a ser 0,
no compite por nada), toda la imagen se queda en su `flex-basis` de
296px sin excepción, y el texto simplemente toma el espacio que sobra y
envuelve con normalidad. Verificado con Playwright: las cuatro imágenes
de la columna izquierda y las cinco de la derecha miden `296px` de ancho
cada una (antes, entre 181 y 237px, distinto por fila); los cuatro
textos de la izquierda arrancan los cuatro en `x=376`, los cinco de la
derecha en `x=972` (antes, un valor distinto por fila) — alineación real,
no aproximada. 320px sin scroll horizontal, cero errores de consola.
Kitchen sink actualizada en la misma tarea (misma clase agregada a los
nueve `<span>` estáticos, para seguir siendo un espejo real del DOM que
arma `router.js`).

**Tercera corrección: p01b cambia de lista (icono + texto lado a lado) a
grilla 3×3 (icono centrado arriba, texto centrado debajo).** El arreglo
de alineación anterior funcionaba (los textos quedaban en la misma x),
pero a Juan no le gustó la disposición en sí, no el detalle de
alineación — pidió una grilla de 3×3 con el icono arriba y el texto
abajo, ambos centrados.

- **`router.js`:** `crearColumnaControles()` desaparece —ya no hace falta
  partir el arreglo en dos mitades para dos columnas lado a lado—;
  `crearListaControles()` ahora arma un único `<ul class="layout__cuerpo--
  controles">` plano con los nueve `<li>` en el orden real de contenido.
  El orden de un grid ya los reparte en filas de 3 solo (fila 1: ítems
  1-2-3, fila 2: 4-5-6, fila 3: 7-8-9) sin necesidad de decidir la
  partición a mano.
- **`layouts.css`:** `.layout__cuerpo--controles` pasa de
  `flex-direction:column` (mobile) + grid de 2 columnas (escritorio) a
  grid de 1 columna (mobile, apilado) + grid de 3 columnas (`repeat(3,
  1fr)`, desde 48em) — el tope de `max-width:72rem` y el
  `margin-inline:auto` de la corrección anterior se conservan tal cual,
  solo cambia cuántas columnas reparte. `.layout__controles-columna`
  (el `<ul>` intermedio de cada mitad) se elimina: ya no hace falta,
  todo es un único nivel de lista. `.layout__controles-item` pasa de fila
  (`flex-direction:row`, icono+texto lado a lado, con el divisor
  `border-block-end` de una lista) a columna (`flex-direction:column;
  align-items:center; text-align:center`) — sin divisor: una grilla de
  tarjetas no se lee como una lista con separadores entre filas.
  `.layout__controles-imagen` pierde el ancho fijo de 18.5rem/
  `object-position:left` (ya no hace falta alinear contra una columna de
  texto al lado — cada icono está solo, centrado, sobre su propio
  texto): se queda solo con el alto nativo de 4.5rem y
  `object-fit:contain`. `.layout__controles-texto` pierde el `flex:1 1
  0%` (ya no compite por espacio horizontal con nada) y gana
  `max-width:20rem` para que el texto centrado no se estire de más en la
  columna ancha de mobile de una sola pista.
- **Decisión propia, sin pedirle a Juan:** se quitó el divisor
  (`border-block-end`) entre ítems que tenía la disposición en lista —
  una grilla de tarjetas centradas no pide el mismo tratamiento visual
  que una lista de filas. Si Juan prefiere alguna separación entre
  celdas, es un ajuste aparte.

**Verificado con Playwright, `src/index.html` y `dev/kitchen-sink.html`
por `file://`:** a 1280px, los nueve `.layout__controles-item` caen en
exactamente 3 valores de `top` (filas) y 3 de `left` (columnas) —
`getBoundingClientRect`, no asumido—; en cada ítem el centro horizontal
del ícono coincide con el centro horizontal del texto (±2px) y el ícono
queda arriba (`top` menor) del texto; el texto mide `text-align:center`
computado. El contenedor es un `<UL>` real con exactamente 9 `<li>` (no
dos listas de 4/5). A 320px, `grid-template-columns` computa a una sola
pista y no hay scroll horizontal (`scrollWidth === clientWidth`). Kitchen
sink actualizada con el mismo marcado plano de 9 ítems. Cero errores de
consola nuevos, cero hex nuevo.

**Cuarto ajuste, sobre la grilla ya aprobada: más espacio bajo el título
y Reanudar antes de Anterior.**

- **Espacio bajo el título, en `layouts.css`.** `.layout__cuerpo--
  controles` ganó `margin-block-start: var(--sp-6)`, que se suma al
  `gap:var(--sp-4)` que `.layout__texto` ya pone entre título y cuerpo
  (tanda 4) — el total queda en 40px (`--sp-10`), el mismo separador que
  ya usa p01a entre su encabezado y su grilla de tarjetas
  (`.layout--l09--tarjetas`): mismo criterio, no un valor inventado. Solo
  afecta a p01b (la clase es específica de su contenedor de controles),
  no al resto de L09.
- **Orden de los controles, en `content/ova-u1.js`.** El arreglo
  `controles` de p01b se reordenó para que Reanudar quede justo antes de
  Anterior (y por lo tanto la última fila de la grilla agrupa los tres
  controles con forma de botón: Reanudar, Anterior, Siguiente — antes
  Reanudar quedaba suelto en la fila de arriba, entre Progreso y
  Accesibilidad, sin relación visual con los otros dos botones de
  navegación). No se tocó `router.js` ni `layouts.css`: el orden de un
  `<ul>` en grid ya reparte los ítems en filas de 3 según su posición en
  el arreglo, así que reordenar el contenido basta.

**Verificado con Playwright, `src/index.html` y `dev/kitchen-sink.html`
por `file://`:** el texto "Reanudar…" aparece en el índice 6 del arreglo
de nueve y "Anterior…" en el 7 — inmediatamente después, no solo "antes"
en algún punto anterior. La distancia real entre el borde inferior del
`<h2>` y el borde superior de la grilla (`getBoundingClientRect`) mide
40.0px. 320px sin scroll horizontal. Kitchen sink actualizada con el
mismo orden. Cero errores de consola nuevos, cero hex nuevo.

**Quinto ajuste: el componente de avatar-sm/md/lg se solapaba con otros
elementos de la pantalla — caso real aparecido en p02.** Tanda 7 ya había
anotado esto como pendiente ("Hallazgo verificado, no corregido... Queda
anotado para cuando haya una pantalla real con avatar-lg y aparezca el
caso de verdad") — p02 (este mismo tanda 8) es esa pantalla real.

**Causa.** La figura de `.media-avatar` es `position:absolute`, así que
el sobresaliente que dicta su geometría (tanda 7: avatar-sm 96px arriba,
avatar-md 164px, avatar-lg 432px arriba + 112px a la izquierda del ancho
máximo de la carta) no lo reserva el flujo normal — nada empujaba al
elemento anterior en la pantalla para dejarle aire. En p02 esto se veía
como el avatar tapando el borde izquierdo de la pantalla; en la kitchen
sink, como avatar-lg montado encima de avatar-md.

**Arreglo, en `components.css` — el espacio pasa a ser del componente,
no de cada página que lo usa:** `.media-avatar--sm/--md/--lg` ganan
`margin-block-start` igual al sobresaliente vertical de cada una (96px,
164px, 432px) y `.media-avatar--lg` además `margin-inline-start: 112px`
(el único de los tres con sobrante horizontal: 480px de figura + 48px de
desfase derecho = 528px, 112px más que los 416px de ancho máximo de la
carta — sm y md no necesitan margen horizontal, sus cuentas dan un
sobrante negativo o nulo al ancho máximo del componente). Documentado en
el propio CSS: el margen fijo asume que la carta llega a su ancho máximo
de 26rem (416px) — en un contenedor más angosto que eso el sobrante
crece más allá del margen fijo, el mismo límite ya aceptado en tanda 7,
sin especificación de Juan sobre ese caso.

**Kitchen sink:** las tres muestras de avatar-sm/md/lg pasaron de
compartir una fila (`.ks-muestras`, flex-wrap) a apilarse en columna
(`.ks-muestras--apilado`, clase nueva) — tres tarjetas de hasta 416px no
caben en una sola línea de 1200px, así que el flex las encogía en vez de
envolverlas (hallazgo real: encogidas a 322px, el margen fijo del
componente ya no alcanzaba a compensar el sobrante, que crece según el
límite ya conocido de arriba). Dos trampas de flexbox encontradas y
corregidas armando este apilado, ambas documentadas en el propio CSS:
(1) `.ks-muestras` trae `align-items:center` en su regla base — hay que
pisarlo a `stretch` explícito, si no cada tarjeta vuelve a encogerse a su
ancho de contenido (322px) en vez de llenar el contenedor como un bloque
normal (que es como se ve en la pantalla real). (2) la regla base también
trae `flex-wrap:wrap`, que con `flex-direction:column` no envuelve en
más filas sino en más COLUMNAS si el contenido no cabe en la altura
disponible — sin `flex-wrap:nowrap` explícito, las tres tarjetas
terminaban compartiendo una columna más ancha que el propio contenedor,
desbordando 320px real (encontrado y corregido con Playwright antes de
cerrar, no hipotético). Se retiró `.ks-muestras--avatar-figuras`
(`padding-top:28rem`), el parche de espaciado vertical que tanda 7 había
puesto en esta misma página — ya no hace falta, el espacio vive en el
componente.

**Verificado con Playwright, `dev/kitchen-sink.html` y `src/index.html`
por `file://`:** en la kitchen sink a 1280px, las tres `.media-avatar`
miden `416px` (antes 322px), sin solapamiento vertical entre las tres
(`getBoundingClientRect`, 16px de separación real entre cada una) y
ninguna figura sale del contenedor externo por ningún lado (izquierda,
derecha). A 320px, el bloque de las tres muestras ya no desborda su
propio contenedor (`maxRight === contenedor.right`, comprobado) — el
scrollWidth de toda la página sigue por encima de 320px, pero por las
mismas causas ya documentadas y fuera de alcance del ajuste #2
(`.dato-tabla`, etc.), no por este componente. En `src/index.html`, p02
a 1280px: la figura del avatar-lg ya no invade la columna de texto
(`.layout__texto`), no sale por encima de la caja del layout ni por la
izquierda de su columna de media — coincide exactamente con el borde de
su propia columna (`figura.left === media_col.left`, sin aproximar). A
320px, p02 sigue sin scroll horizontal (`scrollWidth === clientWidth`).
Cero errores de consola nuevos en ninguna de las dos páginas, cero hex
nuevo.

**Sexto ajuste, sobre el arreglo del ítem anterior: en avatar-md y
avatar-lg la figura pasa a asomar por la derecha de la carta en vez de
quedar por dentro.** Pedido explícito de Juan, con la implementación ya
especificada por él: en `components.css`,

- **`.media-avatar--md`** gana `padding-right: 3rem` (48px) — la carta
  (`.media-audio`, todavía en `width:100%` del envoltorio) se encoge ese
  mismo ancho; la figura pasa de `right:48px` a `right:0`, midiéndose
  ahora contra el borde del envoltorio (`.media-avatar`) en vez del borde
  ya encogido de la carta. Sin cambio de margen: la figura (240px) sigue
  cabiendo entera dentro de los 416px del envoltorio aunque ahora asome
  48px más allá del borde derecho de la carta encogida.
- **`.media-avatar--lg`** pierde el `margin-inline-start: 112px` que el
  ajuste anterior le había puesto; la figura pasa de `right:48px` a
  `right:0`. La carta no encoge aquí (sin padding nuevo): sigue en sus
  416px completos. Efecto verificado, no solo calculado: el sobrante por
  la izquierda baja de 112px a 64px (480 − 416) pero no desaparece —
  decisión de Juan, aceptando esa franja en vez del margen fijo que lo
  compensaba a cero.

**Verificado con Playwright, `dev/kitchen-sink.html` y `src/index.html`
por `file://`:** en la kitchen sink a 1280px, avatar-md mide carta
40–408 (368px, encogida por el padding) y figura 216–456 (240px, borde
derecho en 456 = borde del envoltorio, ninguno de los dos se sale de él);
avatar-lg mide carta 40–456 (416px completos) y figura -24–456 (480px,
borde derecho también en 456, borde izquierdo 64px antes del envoltorio).
Ninguna figura sale del envoltorio por la derecha en ninguna de las tres
variantes. En `src/index.html`, p02 (avatar-lg real): la figura sigue sin
invadir la columna de texto (`figura.right=456` vs `texto.left=652`) y el
sobrante por la izquierda de la columna de media mide exactamente 64px
(`media_col.left=40` menos `figura.left=-24`) — el número que predice la
cuenta, no aproximado. 320px sin scroll horizontal en `src/index.html`
(el sobrante en negativo de la figura no extiende el `scrollWidth` de una
página LTR, mismo hallazgo ya verificado en tanda 7). Cero errores de
consola nuevos, cero hex nuevo.

**Séptimo ajuste: p02 pasa del 50/50 simple a la misma retícula de 12
columnas que p01-bienvenida (1 + 5 + 5 + 1), con las columnas
invertidas.** Pedido señalando "la pantalla 2" (p01-bienvenida, el mismo
conteo desde la portada que ya usamos en este backlog) como la
referencia de retícula a copiar.

**Qué se hizo, en `layouts.css`:** `.layout--l03--avatar` deja de heredar
el `grid-template-columns:1fr 1fr` del 50/50 base de L03 y pasa a
`repeat(12, 1fr)` con `column-gap: var(--sp-10)` — la misma retícula
exacta que ya usa `.layout--l03--retrato` (AJUSTES.md #9/#11), mismo
token de medianil, sin valor nuevo. La única diferencia contra
`--retrato` es el orden de las áreas: `--retrato` es
`". media×5 texto×5 ."` (media a la izquierda); `--avatar` pasa a
`". texto×5 media×5 ."` (contenido a la izquierda, locución a la
derecha) — invertida a propósito, como pidió Juan.

**Verificado con Playwright, `src/index.html` y `dev/kitchen-sink.html`
por `file://`:** en p02 a 1280px, `grid-template-columns` computa a doce
pistas de 63.33px con `column-gap:40px`; `.layout__texto` mide 476.67px
de ancho (5 columnas) empezando en el margen izquierdo del layout, y
`.layout__media` mide lo mismo (476.66px) terminando en el margen
derecho — texto a la izquierda, media a la derecha, confirmado con
`getBoundingClientRect`. El margen a cada lado mide 143.33px/143.34px
(prácticamente idéntico, diferencia de redondeo de subpíxel) y el
medianil entre las dos columnas mide 40px. Contra p01-bienvenida como
control: su propio margen izquierdo mide 143.328125px, **el mismo número
exacto** que el margen de p02 — confirma que es la misma retícula, no una
parecida. 320px sin scroll horizontal. Kitchen sink actualizada (texto
descriptivo, sin cambio de marcado — la clase ya trae la retícula nueva
sola). Cero errores de consola nuevos, cero hex nuevo.

**Octavo ajuste: p02 gana el placeholder de audio que le faltaba.**
`PLAN-REDISENO.md` (D8) documenta que las 14 pantallas de avatar de la
unidad llevan uno de dos clips de relleno alternados
(`demo-avatar.mp3`/`loc1_objetivos.mp3`) mientras no exista locución real
grabada — p02 se quedó afuera de ese reparto porque se convirtió a
avatar en esta misma tanda 8, después de que D8 ya lo hubiera hecho.
Juan confirmó cerrar esa inconsistencia asignándole `loc1_objetivos.mp3`
(coincide con el tema de la pantalla, "Objetivos de aprendizaje" — sin
evidencia de que se grabara para ella a propósito, `PLAN-REDISENO.md`
dice que los dos clips se alternaron sin relación con el contenido real,
pero el nombre calza). La imagen (`avatar-medio-confondo-1.webp`) no
cambia: es del pool compartido de fotos por encuadre que ya reutilizan
varias pantallas (p12 también la usa), no un asset por pantalla.

**Qué se hizo:** se agregó `"audio": "../public/audio/loc1_objetivos.mp3"`
al objeto `media` de p02 en `content/ova-u1.js`, y el mismo campo al
ejemplo de la kitchen sink (`l03-avatar-media`) para que siga siendo un
espejo real del contenido.

**Verificado con Playwright, `src/index.html` y `dev/kitchen-sink.html`
por `file://`:** p02 monta un `<audio>` real con
`src=".../loc1_objetivos.mp3"`, `.media-audio` ya no lleva la clase
`--sin-audio`, y la transcripción vuelve a ser el `<details>` colapsable
de siempre (en vez del texto directo que exige regla dura 10 sin audio).
Mismo resultado en la kitchen sink. 320px sin scroll horizontal. Cero
errores de consola nuevos, cero hex nuevo.

**No verificado con la misma confianza que el resto del archivo: zoom de
texto al 200% a 320px.** La técnica disponible en este entorno
(`documentElement.style.fontSize = '200%'`, sin el navegador real de
Node-Playwright de sesiones anteriores) es más agresiva que un zoom de
texto real y **ya desborda a 320px en pantallas sin tocar** (`p03`, `p14`,
`p32`, comprobado como control) — no es una regresión de esta tanda, es
una limitante de la técnica de prueba disponible hoy. Sin scroll
horizontal confirmado en cambio a 320px y 1280px sin zoom, y a 1280px con
el zoom crudo de la prueba. Pendiente de una verificación real de zoom de
texto (con el Playwright de Node, cuando esté disponible) si Juan quiere
más confianza en ese punto específico.

---

## 15 · Tanda 9: L12 con avatar (p03) — cerrado 6 sep

**Pedido.** Referencia en `ref-ajustes/tanda-9/referencia-tanda9.png`:
redibujar `p03` ("Invertir empieza por cambiar la forma de ahorrar",
hoy `L12` sin avatar) sobre una retícula de 12 columnas — margen, 5
columnas de kicker+título en gris oscuro, una columna de separación,
4 columnas con locución en avatar-md y debajo el cuerpo en blanco, margen.

**Cuatro decisiones de alcance, confirmadas con Juan antes de tocar
código** (mismo criterio que los ítems 4/9 de tandas anteriores):

1. **Variante nueva, no reemplazo de L12.** `L12` hoy solo lo usa `p03`,
   pero con título blanco (display) y cuerpo oscuro — exactamente al
   revés de lo pedido. Se optó por `.layout--l12--avatar`, activada por
   `router.js` solo cuando `media.tipo === 'avatar'` (mismo mecanismo que
   `.layout--l03--avatar`/`--retrato`, AJUSTES.md #9/tanda 8): `L12` base
   queda intacto para una futura pantalla de "cifra que golpea" sin
   locución.
2. **Contraste del cuerpo blanco (regla dura 2).** El cuerpo de la
   referencia se ve al tamaño normal de `tipo-cuerpo-lg` (18-20px/400),
   que sobre naranja-500 en blanco no llega al mínimo de contraste
   (`--text-on-brand-display` solo cumple a ≥19px/700 o ≥24px/400,
   `tokens.css`). Se subió a 24px fijo en todos los anchos —no un
   `clamp` que pueda bajar de 24 en mobile— sin tocar el peso.
3. **Fondo naranja sólido, sin la textura de rayas de la referencia.**
   Juan aclaró que la textura era solo una guía de retícula de Figma
   para él, no un asset a implementar — `L12` sigue excluido de imagen
   de fondo (AJUSTES.md #1), cero riesgo de contraste nuevo.
4. **Avatar y audio de `p03`, mismo patrón que `p02` en tanda 8** (`p03`
   no estaba entre las 14 pantallas de avatar de D8): foto sin usar
   todavía en contenido real (`avatar-abierto-confondo-1.webp`) y el
   clip placeholder que le tocaba alternar (`demo-avatar.mp3`, ya que
   `p02` y `p04` —sus vecinas— ya usan `loc1_objetivos.mp3`).

**Qué se hizo:**

- **`router.js` (`PLANTILLAS.L12`)** se bifurca según `media.tipo`. Sin
  avatar, el comportamiento es idéntico a antes (kicker/título/cuerpo
  sueltos). Con avatar: kicker+título van juntos en `.layout__texto`
  (sin cuerpo ahí — cambio respecto al patrón de L03, donde `texto` sí
  incluye el cuerpo); el cuerpo se agrega dentro del mismo
  `.layout__media` que ya arma `crearMedia()`, después del reproductor,
  para que avatar y texto blanco apilen en una sola área de grid en vez
  de necesitar un contenedor nuevo.
- **`layouts.css`**, bloque nuevo después de L12 base: `grid-template-
  columns: repeat(12, 1fr)` + `column-gap: var(--sp-10)` (40px, mismo
  token que `--retrato`/`--avatar` de L03) con
  `grid-template-areas: ". texto×5 . media×4 ."` — la única variante del
  catálogo con un carril de separación explícito entre bloques de
  contenido, además del `column-gap` normal entre columnas (a diferencia
  de L03, que solo usa el `column-gap` como separador). Fuera del media
  query: `color: var(--text-on-brand)` + `white-space: normal` en
  `.layout__titulo` (pisa el `nowrap` y el blanco de L12 base, pensado
  para un número corto, no para un titular de tres líneas);
  `.layout__media` pasa a `flex-column` con `gap: var(--sp-6)` (24px, el
  mismo valor ya documentado para separar zonas); su `.layout__cuerpo`
  gana `color: var(--text-on-brand-display)` y sus párrafos
  `font-size: 1.5rem`.
- **`content/ova-u1.js`**: `p03` gana el objeto `media` (avatar, variante
  `md`, foto + audio + transcripción — la transcripción es el mismo
  texto breve del `cuerpo`, coherente con un clip de ~15s).
- **`dev/kitchen-sink.html`**: segundo ejemplo dentro del bloque L12
  (mismo patrón que el segundo ejemplo de L03), con un script propio
  —no el `montar()` genérico, que solo aprecia el reproductor— que arma
  reproductor + cuerpo dentro de `.layout__media` en el mismo orden que
  `router.js`, para que la kitchen sink siga siendo un espejo real del
  DOM.

**Verificado con Playwright (Node, `chromium`, instalado en el
scratchpad de la sesión), `src/index.html` (navegando a `#p03`) y
`dev/kitchen-sink.html`, por `file://`:**

- A 1280px, `grid-template-columns` computa a 12 pistas de 66px con
  `column-gap: 40px`; el bloque de texto mide 490px (5 columnas + 4
  medianiles internos) y el de media 384px (4 columnas + 3 medianiles);
  el margen izquierdo y derecho miden 130px cada uno (simétrico); el
  espacio entre los dos bloques mide 146px (1 columna de 66px + 2
  `column-gap` de 40px, la cuenta esperada de un carril de separación
  explícito) — todo con `getBoundingClientRect`, no asumido. Centro
  vertical de ambos bloques idéntico (454.79px los dos), conservando la
  regla de centrado entre columnas enfrentadas (AJUSTES.md #12).
- `getComputedStyle`: título en `rgb(11,11,11)` (gris 950) y
  `white-space: normal`; kicker igual, sin cambio; cuerpo en
  `rgb(255,255,255)` a `font-size: 24px`; fondo de la raíz en
  `rgb(255,66,1)` (naranja 500) con `background-image: none` (sin
  textura). El reproductor monta de verdad (`.media-avatar__figura`
  presente, `.media-audio` sin la clase `--sin-audio` porque el audio
  placeholder sí existe) y el disclosure "Ver transcripción" está
  presente y colapsado (audio real, no el texto directo de la
  degradación sin audio).
- Recorrido de teclado real desde el primer Tab en `p03`: cae en el
  botón de play, luego el scrubber, luego "Ver transcripción", luego
  "Anterior"/"Siguiente" del chrome — los cinco con
  `outline: solid 3px` (el foco naranja de siempre, nunca `none`). No
  hay nada focalizable entre kicker/título/cuerpo (son texto plano), así
  que el primer Tab entra directo al reproductor — mismo comportamiento
  que cualquier otra pantalla real de avatar.
- 320px: `scrollWidth === clientWidth` en `src/index.html` (sin scroll
  horizontal), `.layout--l12` en `display:flex` (apilado: texto arriba,
  avatar+cuerpo debajo, sin condición nueva que probar — hereda el
  `flex-column` de base). En la kitchen sink, el subárbol de
  `.layout--l12--avatar` no desborda (`right` máximo de sus
  descendientes en 272px, la raíz en 296px) — el `scrollWidth` global de
  la página sí supera 320px, pero por los mismos tres elementos ya
  documentados y fuera de alcance del ajuste #2
  (`.dato-tabla`, `.media-audio__controles`, un `.boton--outline` de
  demo), confirmado elemento por elemento con `getBoundingClientRect`
  antes de descartarlos.
- Zoom de texto 200% con la misma técnica (y la misma limitante) que
  tanda 8: `p03` desborda a 502px de `scrollWidth`, pero un control sin
  tocar (`p04`) desborda casi igual (501px) con la misma técnica — no es
  una regresión de este ajuste, es la limitante ya documentada de
  `documentElement.style.fontSize` como sustituto de un zoom de texto
  real.
- Cero errores de consola nuevos en ambas páginas (los tres
  `ERR_FILE_NOT_FOUND` de la kitchen sink son los placeholders
  preexistentes ya documentados en el ajuste 1). Cero hex nuevo en los
  cuatro archivos tocados (`router.js`, `layouts.css`,
  `content/ova-u1.js`, `dev/kitchen-sink.html`) — los colores nuevos son
  los tokens ya existentes `--text-on-brand`/`--text-on-brand-display`,
  y el tamaño nuevo (24px) es un valor de tipografía, no de color.
