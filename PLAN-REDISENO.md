# PLAN-REDISENO.md — jerarquía, chrome, preferencias y movimiento (D0–D10)

Plan vigente a partir del 5 de septiembre de 2026, sobre el motor ya montado
(T1–T9) y el contenido real ya convertido (C0–C7). No sustituye a
`PLAN-CONTENIDO.md`: C8 (descargables) y C9 (empaquetado y Moodle) siguen
pendientes ahí y se cierran después de esto.

Entrega: 8 de septiembre de 2026. Quedan lunes 7 y martes 8.

## 0. Qué se decidió antes de escribir esto

Hallazgos del código, verificados el 5 de septiembre, y las decisiones de Juan
sobre cada uno. No se re-discuten.

1. **La retícula de 12 columnas no existe y no se construye.** `.layout` es
   `flex-direction: column` con `padding-inline: var(--sp-6)`; cada layout que
   necesita más de una columna declara su propio `grid-template-areas` dentro de
   su propio `@media` — decisión deliberada de T1, documentada en el encabezado
   de `layouts.css`. **Decisión: solo se sube el padding lateral de escritorio a
   40px (D4).** Montar una retícula real tocaría los 13 layouts y las 47
   pantallas a tres días de la entrega, y el beneficio es de handoff, no del
   demo.

2. **De los 28 archivos de media que referencia el contenido existe uno.** Las
   14 imágenes de avatar apuntan a `.webp` inexistentes, las 5 infografías a
   `.svg` inexistentes y 4 de los 5 videos a `.mp4` inexistentes; ninguna
   pantalla tiene `media.audio`. Todo degrada limpio a `.media-marcador` o a
   transcripción directa (es el placeholder de producción que exige la regla
   dura 10), pero el curso no se puede *ver*. **Decisión: capa completa de
   assets dummy generados desde lo que ya hay en `public/` (D8), de primera, y
   con lista explícita de qué sustituir después.**

3. **La jerarquía no existe como dato.** Hoy vive en un string plano
   (`kicker: "Unidad 1 · Cápsula 2"`) y P01 ni siquiera lo sigue. Pero
   `storyboard_data_v2.json` trae `unidad_capsula` estructurado y **los nombres
   reales de las cápsulas están en el título de la primera pantalla de cada
   una** ("Cápsula 1: ¿En qué mercado estás entrando?"). **Decisión: se añaden
   `unidad` y `capsula` al contrato de contenido y se regenera (D1).** El
   breadcrumb dice el nombre real, no "Cápsula 1", y el drawer se agrupa gratis.

4. **El OVA no es una unidad: son 47 pantallas que cubren la Unidad 1 completa
   más tres vistas previas de las unidades 2, 3 y 5.** El eyebrow dirá "Unidad
   5" a mitad del recorrido, y eso es correcto. **Decisión: el % se calcula
   sobre el OVA entero (D3)**; el `aria-label` "Progreso de la unidad" es un
   error que se corrige en la misma tarea.

5. **`progreso: true` está en las 47 pantallas y `router.js` nunca lo lee.**
   Campo muerto del contrato. **Decisión: se activa como denominador del % y
   las dos pantallas nuevas van con `progreso: false` (D3, D7)** — leer el
   tutorial no es avanzar en el curso.

6. **Las pantallas nuevas no renumeran nada.** Entran como `p01a`
   (accesibilidad) y `p01b` (tutorial). P01–P47 es el idioma común con el
   storyboard de Jose, el PPTX de producción y `QA_Matriz_v2.md`.

7. **Preferencias del curso, no overlay de accesibilidad.** Los overlays
   comerciales (AccessiBe, UserWay) tienen rechazo firmado por la comunidad de
   accesibilidad y han generado demandas; meter uno contradice justo el
   argumento que Appicua está vendiendo. Lo que se construye son cuatro
   controles propios, reales, que tocan el DOM del OVA: tamaño de texto,
   movimiento reducido, transcripción siempre visible y autolocución (D5).

8. **El disparador del movimiento no puede ser el scroll.** El scroll vive en
   `#app`, no en el documento, y casi ninguna pantalla scrollea (cada layout
   mide `min-block-size: 100%`): un `IntersectionObserver` clásico casi nunca
   dispararía. **Las entradas van al montar la pantalla, escalonadas** — que es
   además lo que ya pide el ítem 2 del inventario de movimiento de `CLAUDE.md`.

## 1. Reglas que este plan no toca

Todo `CLAUDE.md` sigue vigente sin excepción. En particular y por ser lo que
más fácil se rompe en estas tareas:

- Ningún hexadecimal fuera de `tokens.css`. Ninguna duración ni `cubic-bezier`
  fuera de `tokens.css`.
- WCAG 2.1 AA es criterio de implementación. El color nunca es el único código
  de un estado. `outline: none` prohibido.
- Sin frameworks, sin bundler, sin dependencias de red en ejecución. Scripts
  clásicos que cuelgan de `window.OVA.<nombre>`, cargados en orden en
  `index.html`.
- Solo `transform` y `opacity` se animan. Nada en bucle en la periferia. Nada
  rutinario por encima de 320 ms.
- La kitchen sink se actualiza **en la misma tarea** que crea el componente.

---

## 2. Tareas

### D0 · Higiene de rama

Hay 10 archivos modificados sin commitear sobre `c7-conversion-storyboard`.
Cerrar eso (commit en la rama de C7) y abrir `d-rediseno-chrome` desde ahí.
Nada de este plan empieza sobre un árbol sucio.

**Cierre:** `git status` limpio, rama nueva creada.

---

### D1 · Jerarquía como dato: Unidad › Cápsula › Tema

**Contrato de contenido.** Dos campos nuevos por pantalla, opcionales:

```json
"unidad": "Unidad 1",
"capsula": "¿En qué mercado estás entrando?"
```

`capsula` es `null` en Apertura y Cierre. En las tres piezas insignia lleva el
nombre de la pieza sin su prefijo ("Anatomía de un Repo", "Tu primera orden",
"Arma tu portafolio"). `kicker` **se conserva**: es lo que pintan los layouts
dentro de la pantalla, y no es lo mismo que el breadcrumb del chrome.

**Regeneración.** Con el mismo script de conversión de C7, desde
`storyboard_data_v2.json`: `unidad_capsula` (`"Unidad 1 / Cápsula 2"`) se parte
en `unidad` y en la etiqueta de sección; el **nombre** de la cápsula sale del
título de su primera pantalla, quitando lo que va antes de los dos puntos.

| `unidad_capsula` | `unidad` | `capsula` |
|---|---|---|
| Unidad 1 / Apertura | Unidad 1 | `null` |
| Unidad 1 / Cápsula 1 | Unidad 1 | ¿En qué mercado estás entrando? |
| Unidad 1 / Cápsula 2 | Unidad 1 | Qué es una acción |
| Unidad 1 / Cápsula 3 | Unidad 1 | Valorización y dividendo |
| Unidad 1 / Cápsula 4 | Unidad 1 | Tipos de acciones y perfil |
| Unidad 1 / Cierre | Unidad 1 | `null` |
| Unidad 2 / Pieza insignia Repo | Unidad 2 | Anatomía de un Repo |
| Unidad 3 / Pieza insignia Orden | Unidad 3 | Tu primera orden |
| Unidad 5 / Pieza insignia Portafolio | Unidad 5 | Arma tu portafolio |

**Breadcrumb en la barra superior.** Sustituye a `#nav-barra-titulo`, que hoy
es un `<p>` con el título pelado. Dos líneas:

- arriba, la unidad, con `.tipo-etiqueta` (eyebrow);
- abajo, `Cápsula › Tema` — o solo `Tema` cuando `capsula` es `null`.

Marcado: `<nav aria-label="Ubicación">` con `<ol>` de dos o tres ítems, el
último con `aria-current="page"`. El separador `›` es un `<span
aria-hidden="true">` — un carácter decorativo no se lee.

**Truncado.** Se trunca la cápsula, nunca el tema: la cápsula lleva
`min-width: 0; overflow: hidden; text-overflow: ellipsis` y el tema
`flex-shrink: 0` hasta donde alcance. Por debajo de 40em el breadcrumb colapsa
a una sola línea (unidad como eyebrow, tema debajo, cápsula oculta) — la
cápsula sigue disponible en el drawer.

**Excepción de la primera pantalla de cápsula.** Cuando el título de la
pantalla y el nombre de la cápsula coinciden, el breadcrumb muestra solo la
cápsula. Repetir el mismo texto dos veces separado por un `›` es ruido.

**Drawer.** `construirDrawer()` pasa a agrupar: un `<h3>` por unidad y, dentro,
un `<h4>` por cápsula con su `<ul>` de pantallas. `aria-current="step"` en el
ítem activo se conserva tal cual. Los grupos son encabezados reales, no
`<div>`, para que un lector de pantalla pueda saltar de cápsula en cápsula.

**Cierre:** el breadcrumb aparece en la kitchen sink en sus tres formas (con
cápsula, sin cápsula, truncado); se recorre con teclado; a 320px no hay scroll
horizontal; axe-core en cero.

---

### D2 · Barra superior inverse

`.nav-barra` pasa a `--surface-inverse`. Consecuencias en cadena, todas
resueltas con tokens que ya existen:

- Texto principal `--text-on-inverse`; el eyebrow de la unidad y el estado de
  guardado, `--text-on-inverse-2` (gris 400, que sobre inverse **sí** es texto
  informativo válido — ver la nota del token).
- **Track de la barra de progreso: gris 800.** Hoy es gris 100 justamente
  porque `CLAUDE.md` prohíbe naranja sobre gris 200–600. Naranja 500 sobre
  `--nuam-grey-800` mide 3.9:1: cumple los 3:1 de componente no textual. El
  relleno sigue siendo naranja 500.
- `.boton--outline` necesita variante inverse (borde `--border-inverse`,
  etiqueta blanca): la usa "Reanudar", que vive en esta barra.
- `.boton-icono` dentro de la barra: icono blanco, superficie de hover gris
  800.
- El anillo de foco no cambia: naranja 500 sobre gris 950 mide 5.65:1.

La barra inferior **no** cambia: sigue clara. El contraste entre las dos barras
es lo que separa "dónde estoy" (arriba, negro) de "cómo avanzo" (abajo, claro),
y además el botón primario naranja de "Siguiente" necesita fondo claro.

**Cierre:** la barra aparece en la kitchen sink en su variante inverse con
todos sus controles; matriz de contraste de los cinco pares nuevos anotada en
`ESTADO.md`; axe-core en cero.

---

### D3 · Progreso en porcentaje

- `actualizarProgreso()` calcula sobre las pantallas con `progreso !== false`,
  no sobre `inst.total`. Esto activa el campo muerto del contrato y deja fuera
  del denominador las dos pantallas nuevas de D7.
- Texto visible: `«N % completado»`.
- `role="progressbar"` con `aria-valuemin="0"`, `aria-valuemax="100"`,
  `aria-valuenow` el porcentaje y `aria-valuetext="N % completado — X de Y
  pantallas"`. El porcentaje solo es legible con la cuenta detrás.
- La etiqueta pasa de "Progreso de la unidad" a "Progreso del curso".
- `#nav-paso` de la barra inferior conserva "Pantalla N de M": es donde vive la
  cuenta fina, y no se pierde.
- La animación del relleno sigue siendo `scaleX` con `--dur-slow` (ítem 4 del
  inventario de movimiento). No se toca.

**Cierre:** avanzar una pantalla mueve el número y el relleno; el
`aria-valuetext` se anuncia completo; las pantallas `progreso: false` no mueven
el porcentaje.

---

### D4 · Padding lateral de escritorio

```css
@media (min-width: 48em) {
  .layout { padding-inline: var(--sp-10); }
}
```

Verificar los tres layouts que tienen padding propio y podrían duplicarlo: L01
(portada a sangre, tiene su propio marco), L12 y L13 (superficies de marca e
inversa a ancho completo). Ninguno debería heredar el cambio.

**Cierre:** las 49 pantallas recorridas a 1280px sin desalineaciones; reflow a
320px intacto; zoom de texto al 200 % intacto.

---

### D5 · Preferencias del curso

Módulo nuevo `src/js/preferencias.js`, cargado antes de `router.js`. Cuatro
claves, persistidas con `storage.js` bajo el mismo `contenidoId` que el
progreso:

| clave | valores | efecto |
|---|---|---|
| `tamanoTexto` | `100` \| `125` \| `150` | multiplicador del `font-size` del root |
| `movimientoReducido` | `true` \| `false` | override manual de `prefers-reduced-motion` |
| `transcripcionVisible` | `true` \| `false` | abre el `<details>` de transcripción en todas las pantallas |
| `autolocucion` | `true` \| `false` | ver D6 |

**Se aplican como atributos en `<html>`** (`data-texto="125"`,
`data-movimiento="reducido"`, `data-transcripcion="visible"`), nunca como
estilos inline: el CSS sigue mandando y el estado es inspeccionable.

**Movimiento reducido manual.** `tokens.css` ya colapsa duraciones y
desplazamientos dentro de `@media (prefers-reduced-motion: reduce)`. El
override duplica exactamente ese bloque bajo `:root[data-movimiento="reducido"]`
— mismos tokens, mismos valores, 1 ms y no 0 para no romper los listeners de
`animationend`. Es la única duplicación aceptable del media query, y va anotada
como tal.

**Tamaño de texto — la parte delicada.** Todos los tokens tipográficos son
`rem`, así que un multiplicador en el root escala la tipografía entera. El
problema es el marco fijo: `body.ova-marco` mide `100dvh` con las dos barras
clavadas, y ya tiene una salida de emergencia (`@media (max-height: 36em)`
desarma el marco) calibrada contra 320×568 al 200 % de zoom. **Un control
propio reproduce ese mismo caso sin que el media query se entere, porque la
ventana no cambia de tamaño.** Solución: el punto de corte sube con la escala
—`36em` a 100 %, `45em` a 125 %, `54em` a 150 %— vía tres reglas hermanas
prefijadas por `:root[data-texto="…"]`. Verificar con Playwright los nueve
cruces de (320/768/1280) × (100/125/150).

**Dos superficies, un solo componente.** `.pref-panel` se monta dos veces:

1. **Barra superior**, detrás de un botón `tune` con `aria-expanded` y
   `aria-controls`. Popover simple, no `role="dialog"`: no es modal, no atrapa
   foco, se cierra con Escape y con clic fuera.
2. **Incrustado en la pantalla p01a** (D7), a tamaño completo.

El estado es único y vive en `preferencias.js`; los dos montajes se suscriben y
se redibujan juntos. Cambiar una preferencia en la pantalla la deja cambiada en
el panel de la barra, y al revés.

Cada control es un elemento nativo real (`<input type="radio">` para el tamaño,
`<input type="checkbox">` para los tres toggles) dentro de un `<fieldset>` con
`<legend>` — la operación por teclado la da el navegador, no un manejador
propio. Mismo criterio que el reproductor de `media.js`.

**Cierre:** el panel aparece en la kitchen sink con sus dos montajes y sus
estados; cada preferencia sobrevive a un recargue; los nueve cruces de
ancho × escala verificados; axe-core en cero.

---

### D6 · Autolocución

**Solo audio, nunca video.** Un video que arranca solo es intrusivo y además
pesa; la locución del avatar no.

`media.js` gana una función expuesta —`OVA.media.reproducirEn(raiz)`— que
localiza el `<audio>` de una raíz recién montada y lo reproduce. `crear()`
sigue devolviendo la raíz, sin cambiar su firma.

`router.js`, al terminar de montar una pantalla: si `preferencias.autolocucion`
es `true` y la pantalla trae `media.tipo === 'avatar'` con `audio`, llama a
`reproducirEn()`.

Cuatro cosas que hay que hacer bien:

1. **La promesa de `play()` puede ser rechazada.** La política de autoplay del
   navegador bloquea el audio con sonido sin gesto previo del usuario. Como el
   toggle nace **apagado** y encenderlo *es* un gesto, en la práctica funciona
   desde la pantalla siguiente; pero un rechazo no puede reventar en consola ni
   dejar el reproductor en un estado mentiroso — se captura y el botón de play
   se queda como está, listo para pulsarse.
2. **Nunca robar el foco.** No se llama a `.focus()` sobre el reproductor en
   ningún momento. El foco lo sigue moviendo `a11y.enfocarEncabezado()` al
   título de la pantalla, como hoy.
3. **No anunciar por `aria-live` que la locución empezó.** Hablar encima del
   audio que acaba de arrancar es ruido, no ayuda. El anuncio de cambio de
   pantalla que ya existe es suficiente.
4. **Un solo reproductor activo.** `pausarOtros()` ya lo garantiza y no hace
   falta tocarlo.

**Botón en la barra superior:** iconos `record_voice_over` /
`voice_over_off`, con `aria-pressed` y etiqueta que cambia. Estado también
visible en el panel de preferencias (D5) — es la misma clave.

Nace apagado. Es una decisión de conformidad, no de gusto: con el toggle
apagado por defecto no hay reproducción automática involuntaria y WCAG 1.4.2
(nivel A) ni se activa en la primera carga.

**Cierre:** con el toggle encendido, avanzar entre pantallas de avatar encadena
la locución; apagarlo la detiene; la preferencia sobrevive a un recargue; con
la promesa rechazada a mano la consola queda limpia.

---

### D7 · Pantallas nuevas: p01a (accesibilidad) y p01b (tutorial)

**Extensión mínima del contrato.** Un campo opcional `componente`, con un solo
valor por ahora (`"preferencias"`), que `router.js` monta en el hueco de
`.layout__interaccion`. No se mete como interacción I15: `CLAUDE.md` define
`interaccion` como *una pregunta por pantalla*, y esto no es una pregunta. Como
todo lo demás del contrato, un valor fuera de catálogo falla ruidoso en
consola.

**p01a · Accesibilidad.** Lista de lo que el OVA hace, en el mismo tono llano
del resto del curso: transcripción en toda pantalla con locución, contraste
verificado, recorrido completo por teclado con foco siempre visible, reflow
real hasta 320px, texto ampliable al 200 %, y movimiento que se puede reducir.
Debajo, el panel de preferencias completo. Cierra con la frase que pidió Juan:
*"Puedes volver a cambiar estas preferencias cuando quieras desde el botón de
ajustes de la barra superior."*

**p01b · Tutorial.** Los cinco controles de la barra superior (índice de la
unidad, tu ubicación en el curso, progreso con guardado automático, pantalla
completa, autolocución) y los dos de la inferior (anterior, siguiente). Cada
uno con **el icono real del control**, no una captura anotada: una captura de
la barra envejece con el primer cambio de diseño y no se puede leer con lector
de pantalla; el icono real más su nombre es autodescriptivo y se mantiene solo.

Las dos con `progreso: false`. Van después de P01, antes de P02.

**Cierre:** las dos pantallas se recorren con teclado; el panel incrustado
comparte estado con el de la barra; el porcentaje no se mueve al pasarlas.

---

### D8 · Capa de assets dummy — **va primero, después de D0**

Sin esto el curso no se puede mirar, y mirarlo es lo que desbloquea el resto de
las decisiones de diseño. Se generan archivos reales en **las rutas de
producción exactas** que ya declara el contenido, para que sustituirlos después
sea sobrescribir, no volver a editar `ova-u1.js`.

| qué | cuántos | de dónde sale |
|---|---|---|
| `public/img/avatar/avatar-*.webp` | 14 | recortes por plano de los 4 PNG reales de `public/img/avatar/` |
| `public/img/infografia/p*.svg` | 5 | placeholders dibujados con tokens, ya trazables por `stroke-dashoffset` para D9 |
| `public/videos/motion/p*.mp4` | 4 | recorte corto del `woman_Businesswoman_1920x1010.mp4` existente |
| `media.audio` en las 14 pantallas de avatar | 14 | `demo-avatar.mp3` y `loc1_objetivos.mp3`, alternados |

Los cinco SVG de infografía no son cajas grises: se dibujan de verdad con la
estructura que describe cada pantalla, con tokens y sin hex. Son lo que después
se anima en D9, y son sustituibles por el diagrama final sin tocar nada más.

**Todo queda listado en `ESTADO.md` bajo un encabezado explícito de capa de
placeholder**, con la ruta exacta de cada archivo a sustituir. Es la lista que
usa producción audiovisual.

**Cierre:** las 49 pantallas se recorren de punta a punta sin un solo
`.media-marcador` visible ni un error en consola, desde `file://`.

---

### D9 · Movimiento

Módulo nuevo `src/js/motion.js`: un orquestador único, no animaciones sueltas
por componente. Al montar una pantalla, recorre `[data-anim]` en orden de
documento y dispara la secuencia escalonada con `--stagger`. Nada depende del
scroll, por la razón del punto 8 de la sección 0.

Siete técnicas, todas dentro del inventario de movimiento de `CLAUDE.md`:

1. **Transición entre pantallas** (`--dur-slow`) — reforzada: salida de la
   saliente antes de la entrada de la nueva, no un corte. Es la animación más
   importante del OVA y hoy es la más pobre.
2. **Line reveal en títulos** — `clip-path` sobre cada línea, escalonado.
   Acotado a títulos de una o dos líneas y recalculado en `resize`: aplicarlo a
   párrafos es frágil porque al 200 % de zoom las líneas se reflowean y el corte
   queda en mitad de una palabra.
3. **Subrayado que se dibuja** bajo kicker y título — `transform: scaleX` sobre
   un `::after` con `transform-origin: left`. No `background-size`: eso no es
   ni transform ni opacity.
4. **Stagger de listas, tarjetas y opciones de quiz** (`--dur-base`,
   `--shift-sm`) — ya existe el token, falta aplicarlo consistentemente.
5. **Trazado progresivo de los SVG de infografía** — `stroke-dashoffset` sobre
   los trazos, relleno por opacidad después. Es donde está el golpe real: son
   9 pantallas del recorrido y es lo que hace que un diagrama se lea como una
   explicación en vez de como una imagen.
6. **Contador de cifras** en L05 (cifra destacada) y L08 (resultado) —
   interpolación del número con `--dur-reveal`. El valor final se escribe en el
   DOM desde el primer frame para que un lector de pantalla nunca lea un
   número intermedio.
7. **Retroalimentación de quiz** (`--dur-base`) reforzada — es la que más
   comunica del OVA, según el propio inventario.

Restricciones que se verifican, no que se asumen:

- Ningún valor de duración ni curva fuera de `tokens.css`.
- Solo `transform` y `opacity`.
- Nada en bucle en la periferia mientras alguien lee.
- Bajo movimiento reducido —el media query o el override de D5— se conserva la
  opacidad y se pierde el desplazamiento: el cambio de estado sigue siendo
  perceptible. Nunca `animation: none`.
- **Cada cambio de estado que se comunica con movimiento se comunica también
  por `aria-live` o por atributo ARIA.** Una animación que solo se ve no
  informa a quien no la ve.

**Cierre:** sección de movimiento nueva en la kitchen sink con las siete
técnicas y su estado reducido al lado; recorrido completo con
`prefers-reduced-motion: reduce` activo; ningún `animationend` colgado.

---

### D10 · Verificación

No es una tarea de cierre simbólica: es la que decide si esto entra el 8.

1. Kitchen sink completa, con todo lo nuevo y sus estados.
2. Recorrido de las 49 pantallas con teclado, foco visible en cada parada.
3. Reflow a 320px sin scroll horizontal, en las tres escalas de texto.
4. Zoom de texto del navegador al 200 % **cruzado** con las tres escalas
   propias — nueve combinaciones.
5. `grep` de hexadecimales, duraciones y `cubic-bezier` fuera de `tokens.css`.
6. axe-core en cero sobre las 49 pantallas.
7. Apertura desde `file://` sin servidor.
8. Paquete SCORM regenerado y cargado en el Moodle de Pablo.

---

## 3. Orden y ruta crítica

```
D0 higiene
 └─ D8 assets dummy        ← primero: sin esto no se puede ver el curso
     ├─ D1 jerarquía ─┐
     ├─ D2 barra negra ├─ chrome, en paralelo
     ├─ D3 progreso %  │
     └─ D4 padding ────┘
         └─ D5 preferencias
             ├─ D6 autolocución
             └─ D7 pantallas nuevas
                 └─ D9 movimiento
                     └─ D10 verificación
```

**La ruta crítica es D5 → D9.** Las preferencias son la tarea con más riesgo
técnico oculto (el cruce de tamaño de texto con el marco fijo), y el movimiento
es la que no se puede apurar sin que se note. D1–D4 son mecánicas y podrían
recortarse a D4 sola si el tiempo aprieta; D9 no se recorta, se hace con menos
técnicas — el orden en que se sacrifican es 6, 2, 3, y nunca 1 ni 5.

**Línea de corte:** si el lunes 7 al mediodía D5 no está cerrada, el tamaño de
texto sale del alcance (quedan tres preferencias) y su casilla se documenta en
la declaración de accesibilidad como "control del navegador", que es una
respuesta conforme.
