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
