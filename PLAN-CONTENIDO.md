# Plan de implementación del contenido — OVA Unidad 1

Este plan cubre el tramo que `PLAN.md` no cubría: montar el diseño instruccional
real de Jose (`disenoInstruccional/`, v2 del 3 de septiembre) sobre el motor que
cerró T1–T9. `PLAN.md` sigue siendo la historia de cómo se construyó el motor;
este archivo es lo que queda por hacer.

**Regla de oro: el contenido de Jose se respeta.** Ni una pantalla se recorta,
ni un texto se reescribe, ni una interacción se sustituye por otra más barata.
Donde el motor no llega, se amplía el motor.

Entrega: **martes 8 de septiembre de 2026.** Quedan viernes 4, fin de semana y
lunes 7.

---

## 1. Qué entregó Jose

47 pantallas (P01–P47), 11:53 de locución escrita, 23:28 de recorrido total
(audio + interacción). Nueve bloques:

| Bloque | Pantallas | Duración |
|---|---|---|
| Unidad 1 / Apertura | P01–P11 | 4,8 min |
| Unidad 1 / Cápsula 1 · ¿En qué mercado estás entrando? | P12–P15 | 2,0 min |
| Unidad 1 / Cápsula 2 · Qué es una acción | P16–P19 | 1,4 min |
| Unidad 1 / Cápsula 3 · Valorización y dividendo | P20–P25 | 3,3 min |
| Unidad 1 / Cápsula 4 · Tipos de acciones y perfil | P26–P31 | 3,2 min |
| Unidad 1 / Cierre | P32–P35 | 1,4 min |
| Unidad 2 / Pieza insignia · Repo | P36–P39 | 2,5 min |
| Unidad 3 / Pieza insignia · Tu primera orden | P40–P43 | 2,3 min |
| Unidad 5 / Pieza insignia · Arma tu portafolio | P44–P47 | 2,4 min |

Las cuatro cápsulas caen dentro del rango de microlearning del RFP (3–5 min con
interacción incluida). Cada cápsula tiene al menos una interacción. Los
descargables (calculadora XLSX con fórmulas abiertas, checklist, hoja de perfil,
glosario tri-país de 18 términos) están escritos y no repiten el curso.

Además viene con lo que casi nunca viene: `payload_interaccion` con datos
completos —opciones, retros correcta e incorrecta, fórmulas, tabla de verdad de
la boleta, matriz de retro del portafolio, casos de prueba—, campo de
accesibilidad por pantalla y una matriz de QA. Es material montable, no un
guion que haya que interpretar.

---

## 2. El hallazgo que ordena todo el plan

**`BRIEF-DI.md` y el código implementan catálogos distintos con los mismos
códigos.** El brief se escribió el 31 de agosto, dos días después de que
`layouts.css` y `quiz.js` fijaran los suyos, y nadie los cruzó. Jose escribió
las 47 pantallas contra el catálogo del brief.

No es un error de Jose y no es un error del código: son dos verdades con la
misma numeración. Si se monta el contenido tal cual, la mitad de las pantallas
renderiza el layout equivocado y cinco preguntas de opción múltiple salen como
verdadero/falso.

**Decisión (Juan, 4 sep): renumerar el código al brief.** El brief es lo que
usó Jose, lo que está en el PPTX del storyboard y lo que se muestra en la
propuesta. Después de C0, «L05» significa lo mismo en el guion, en el CSS, en
el router y en la kitchen sink.

### 2.1 Layouts — mapa de renumeración

| Brief (destino) | Qué es | Pantallas | CSS actual que lo cubre | Acción |
|---|---|---|---|---|
| **L01** | Portada de unidad | P01 | `.layout--l01` | falta plantilla en `router.js` |
| **L02** | Media protagonista + texto debajo | 9 | `.layout--l04` | renombrar l04→l02 |
| **L03** | Media a un lado, texto al otro | 4 | `.layout--l03` | sin cambio |
| **L04** | Lectura larga con imagen de apoyo | P02 | `.layout--l02` | renombrar l02→l04, admitir `media` opcional |
| **L05** | Tarjetas comparativas (2–4) | 5 | `.layout--l07` | renombrar l07→l05, soportar 3 y 4 tarjetas; falta plantilla |
| **L06** | Interacción a pantalla completa | 6 | `.layout--l10` | renombrar l10→l06 |
| **L07** | Pregunta | 9 | misma base que L06 | variante de chrome sobre l06 |
| **L08** | Resultado y retroalimentación | 4 | — | **nuevo** (reusa `.callout` y `.anillo` de T5) |
| **L09** | Ideas clave (3–5) | 2 | `.layout--l08` (checklist con media) | renombrar l08→l09, media pasa a opcional |
| **L10** | Cierre de unidad y siguiente paso | P35 | `.layout--l13` | renombrar l13→l10; falta plantilla |
| **L11** | Recursos descargables | P34 | `.layout--l12` | renombrar l12→l11; falta plantilla |
| **L12** | Corte naranja, un dato que golpea | P03 | `.layout--l05` (cifra destacada) | renombrar l05→l12 sobre `--surface-brand` |
| **L13** | Corte oscuro, cierre o transición | 3 | `.layout--l06` (cita/dato) | renombrar l06→l13 sobre `--surface-inverse` |

Un solo layout es nuevo de verdad (L08, resultado y retroalimentación). Dos del código pierden su casilla y **bajan de categoría, no se
borran**: `.layout--l09` (proceso / línea de tiempo) ya está resuelto por
`OVA.charts.crear({tipo:'proceso'})`, así que pasa a ser un tipo de `datos`
dentro de L02/L04; `.layout--l11` (término de glosario) ya existe como
componente de T5 y se usa dentro de cualquier layout.

### 2.1.1 La renumeración es una permutación, no una lista de reemplazos

Este es el error que va a cometer quien haga C0 con prisa. Los códigos no se
mueven a casillas libres: se intercambian entre sí.

```
l01→l01   l02→l04   l03→l03   l04→l02   l05→l12   l06→l13   l07→l05
l08→l09   l09→(datos 'proceso')   l10→l06   l11→(componente glosario)
l12→l11   l13→l10
I01↔I02
```

`l02→l04` y `l04→l02` son un intercambio; `l05→l12→l11→…` es una cadena. Un
buscar-y-reemplazar secuencial las destruye en silencio: el primer reemplazo
crea las colisiones que el segundo pisa. **Renombrar en dos fases** — todo a un
token temporal (`lXX-tmp`) y luego del token al destino — y verificar al final
que no queda ningún `-tmp` en el árbol. Lo mismo para `I01`/`I02`.

### 2.2 Interacciones — mapa de renumeración

| Brief (destino) | Qué es | Pantallas | Estado real | Acción |
|---|---|---|---|---|
| **I01** | Opción múltiple, respuesta única | P05, P07, P09, P15, P25 | existe como I02 | renumerar |
| **I02** | Verdadero o falso | P06, P08, P19, P38 | existe como I01 | renumerar |
| **I03** | Opción múltiple, varias respuestas | — | coincide | sin cambio |
| **I04** | Emparejamiento | — | coincide | sin cambio |
| **I05** | Ordenar secuencia | — | coincide | sin cambio |
| **I06** | Zonas sensibles sobre imagen | — | no existe | **no se construye**: ninguna pantalla lo pide |
| **I07** | Tarjetas volteables | P13 | no existe | **construir** |
| **I08** | Comparador de dos columnas | P28 | no existe | **construir** |
| **I09** | Línea de tiempo **recorrible** | P37 | existe *ordenable* | **adaptar**: recorrido de 3 momentos con estado inicial y final |
| **I10** | Calculadora paramétrica | P22, P24 | existe, 1 fórmula y 1 salida | **ampliar**: 2 fórmulas nuevas, salidas múltiples |
| **I11** | Formulario de decisión (boleta) | P42 | existe, solo compra | **ampliar**: comprar/vender, saldo, títulos, vigencia, 3 estados |
| **I12** | Distribución de capital | P46 | existe, valida suma 100 | **ampliar**: emisores con riesgo, reglas y matriz de retro |
| **I13** | Test de perfil con resultado | P30 | no existe | **construir** |
| **I14** | Bloque de retroalimentación | compartido | existe | sin cambio |

Los tres tipos huérfanos del código (`completar`, `numerica`,
`autoevaluacion`) están probados y funcionan: se conservan con nombre, fuera
del rango numerado del brief. Borrar código que funciona no ahorra nada.

---

## 3. Lo que el motor todavía no sabe hacer

Cuatro huecos reales, ninguno cosmético.

**3.1 Estado compartido entre pantallas.** Cuatro pantallas de Jose dependen de
lo que pasó antes: P10 lee los aciertos del diagnóstico de cinco preguntas
(P05–P09), P31 lee el perfil de riesgo de I13 (P30), P43 lee el resultado de la
boleta (P42) y **P46/P47 cruzan el perfil de riesgo con la distribución del
portafolio** en una matriz de seis reglas. Hoy `quiz.js` no persiste ni siquiera
el intento entre recargas. Se agrega una capa de **variables de contenido** en
`state.js`, persistida junto al progreso y reportada a SCORM como cualquier otro
avance. Es lo que hace que el demo se sienta adaptativo en vez de lineal, y es
la diferencia visible frente a un Rise.

**3.2 El avatar no es video, es imagen + audio.** 14 pantallas llevan avatar
(P01, P04, P10, P12, P16, P20, P26, P31, P35, P36, P40, P43, P44, P47).
`media.js` solo sabe renderizar `tipo: "video"`; `.media-audio` sigue siendo la
maqueta sin cablear de T1.5. Se construye el reproductor de audio y un tipo
`avatar` = imagen fija + pista de audio + subtítulos + transcripción, que
**degrada limpio a imagen + transcripción cuando el audio todavía no existe**.
Esa degradación es el placeholder: no hay pantalla rota mientras se produce.

**3.3 I10 devuelve un solo número.** Jose pide cinco resultados en P22 (monto
invertido, diferencia por acción, variación porcentual, ganancia o pérdida,
monto final) y cuatro en P24. Y las dos fórmulas que necesita —valorización y
dividendo por acción— no están en `FORMULAS_CALCULADORA`, que hoy solo tiene el
modelo de descuento de dividendos. Se amplían las dos cosas.

**3.4 La boleta de I11 es media boleta.** Hoy: comprar, mercado o límite, dos
resultados. Jose especifica una tabla de verdad de ocho filas con
comprar/vender, saldo, títulos disponibles, vigencia y tres resultados
(ejecutada, expuesta, rechazada). El armazón sirve; la lógica se reescribe
contra la tabla de Jose, con sus casos de prueba.

---

## 4. Diseño: el marco fijo

**Problema observado (Juan):** el OVA reflowea bien y aguanta zoom de texto,
pero las pantallas cambian tanto de alto entre una y otra que navegar cansa.

**Decisión revisada (Juan, 4 sep — sustituye el «alto mínimo proporcional» que
este plan traía antes): marco fijo del alto del viewport, con las dos barras
fijas y el scroll en el medio.** Elimina el salto de altura por completo en vez
de acotarlo, y de paso borra toda la aritmética de `vw` del CSS.

El 16:9 deja de ser una regla de CSS y pasa a ser dos cosas distintas:

- **Configuración de Moodle (Pablo).** El contenedor del SCORM tiene
  `max-width: 1390px`; hay que fijar el alto del reproductor en ~780 px para
  que la caja salga en 16:9. Es un ajuste del módulo, no del OVA. **Coordinarlo
  con Pablo en C9**, porque un alto por defecto de 500 px arruina la
  composición de todas las pantallas.
- **Presupuesto de autoría.** 1390×780 menos las dos barras es el espacio real
  de contenido. Los presupuestos de texto por layout de `BRIEF-DI.md` §4 están
  calculados para eso.

```css
/* base.css — marco del OVA */
body {
  display: grid;
  grid-template-rows: auto 1fr auto;   /* barra · pantalla · navegación */
  block-size: 100dvh;                  /* caja fija, no min-height */
  overflow: hidden;                    /* el documento no scrollea nunca */
}
#app {
  overflow-y: auto;                    /* el scroll vive aquí */
  min-block-size: 0;                   /* sin esto el grid no deja encoger */
}
.layout { min-block-size: 100%; justify-content: center; }  /* contenido al centro */
```

### 4.1 Portada a sangre

L01 va **sin barra superior ni barra inferior**: pantalla completa de verdad.
El único camino hacia adelante es su botón «Comenzar», que es exactamente como
Jose escribió P01. El skip link se conserva. No hay progreso ni drawer que
esconder porque en la pantalla 1 todavía no hay nada que reanudar.

### 4.2 Pantalla completa

Botón en la barra superior, disponible en todo el recorrido, más una segunda
aparición en la portada: en L01 el botón aparece a los pocos segundos, para
ofrecer el modo inmersivo justo cuando el estudiante está entrando.

### 4.3 Las cuatro trampas de esta tarea

Ninguna es opcional y las cuatro se verifican antes de cerrar C2.

1. **Una región con scroll necesita ser alcanzable con teclado.** `#app` con
   `overflow-y: auto` scrollea con rueda y con dedo, pero quien navega solo con
   teclado no puede llegar a ella en Safari si no es focalizable. Lleva
   `tabindex="0"` y nombre accesible. `#app` ya tiene `tabindex="-1"` como
   destino del skip link: pasa a `0`, no se le agrega un segundo contenedor.
2. **`requestFullscreen()` puede estar bloqueado dentro de Moodle.** El iframe
   del módulo SCORM no siempre trae `allowfullscreen`, y ahí la API falla en
   silencio. Detectar con `document.fullscreenEnabled` y **ocultar el botón si
   es false** — nunca dejar un botón que no hace nada. T4 ya se peleó con esto
   para el video: reusar ese criterio, no inventar otro.
3. **El botón que aparece solo en la portada no puede robar el foco.** Se
   revela en una posición fija del DOM, no se inserta después del elemento que
   tiene el foco. Bajo `prefers-reduced-motion` aparece sin transición, y
   nunca es la única vía: el de la barra superior cubre el resto del recorrido.
4. **Zoom de texto al 200 % con las barras fijas.** Es donde este modelo se
   rompe: dos barras fijas más texto al doble pueden dejar una rendija de
   contenido. Verificar que a 200 % siga entrando al menos un párrafo entre las
   dos barras; si no, que las barras dejen de ser fijas por debajo de cierto
   alto. Scroll vertical dentro de una región es conforme; contenido recortado
   o inalcanzable no lo es.

## 5. Producción audiovisual

**Decisión (Juan): se produce el contenido completo, con placeholders donde
todavía no haya pieza.** El código nunca espera un archivo: cada pantalla se ve
completa y usable con lo que haya.

**Avatar — 12 imágenes, no 14 renders.** Juan produce unas 12 imágenes del
avatar en tres planos (primer plano, plano medio, plano abierto), con y sin
fondo, y se mezclan a lo largo del recorrido. Criterio de asignación, para que
la variación signifique algo en vez de ser decoración:

| Función | Pantallas | Plano |
|---|---|---|
| Apertura de unidad o de pieza insignia | P01, P36, P40, P44 | abierto, con fondo |
| Apertura de cápsula | P12, P16, P20, P26 | medio, con fondo |
| Instrucción y resultado | P04, P10, P31, P35, P43, P47 | primer plano, sin fondo sobre superficie de marca |

Nomenclatura: `public/img/avatar/avatar-{abierto|medio|primerplano}-{fondo|sinfondo}-{n}.webp`.

**Locución.** Juan produce las que alcance. El código las toma como
`media.audio` opcional; sin audio, la pantalla muestra la imagen y el texto de
la locución como transcripción visible. **La transcripción existe en las 47
pantallas desde el primer día**, porque Jose escribió la locución completa —
eso convierte una carencia de producción en evidencia de accesibilidad.

**Motion (6): P02, P13, P17, P21, P23, P37.** P21 (valorización) y P23
(dividendo) son las que enseñan el cálculo y valen render real. Las otras
cuatro se resuelven con SVG animado propio sobre `charts.js`, dentro del
inventario de movimiento de `CLAUDE.md`.

**Infografías (9): P03, P11, P14, P18, P27, P29, P33, P41, P45.** Todas son
diagramas de estructura, no ilustración: se construyen en SVG con los tokens,
no como imagen exportada. Salen accesibles y pesan nada.

**Nota de contenido, no de código.** P33 («Las tres bolsas de nuam») sí nombra
BVC, SFC, Deceval, BVL, SMV, CAVALI, Bolsa de Santiago, CMF y DCV. Contradice
en apariencia la regla de neutralización del brief, pero es deliberado y está
validado en la matriz de QA: es el mapa regional de nuam, el único sitio del
curso donde nombrar las tres plazas es correcto. **No neutralizar esa
pantalla.**

---

## 6. Tareas

Nueve tareas. Cada una es una sesión con condición de cierre verificable, mismo
criterio que `PLAN.md`. El orden importa: C0 antes que nada.

### C0 · Renumerar los catálogos al brief
`layouts.css`, `components.css`, `router.js` (claves de `PLANTILLAS`),
`quiz.js` (constructores y despacho), `dev/kitchen-sink.html`, `CLAUDE.md` y
`content/ova-u1.js` de prueba.
**Cierre:** la kitchen sink muestra los trece layouts con los nombres del
brief, las catorce pantallas de prueba siguen navegando y axe-core sigue en
cero violaciones.

### C1 · Layouts que faltan
Plantillas de render para L01, L05, L10, L11; variante de chrome L07; layouts
nuevos L08 (resultado) y L09 (ideas clave); L12 y L13 sobre sus superficies.
**Cierre:** los trece layouts renderizan desde el JSON, no solo en la kitchen
sink. Ninguno cae en el estado de error del motor.

### C2 · Caja 16:9 y navegación pegada
La sección 4, completa, incluidos los tres detalles.
**Cierre:** recorrer las pantallas de prueba en 1390×780 sin salto perceptible
de altura; a 320 px y a 200 % de zoom (cada uno por separado, criterio de T1–T9)
sin scroll horizontal.

### C3 · Media: avatar y audio
Tipo `avatar` (imagen + audio + VTT + transcripción) y reproductor de audio
real sobre `.media-audio`. Degradación a imagen + transcripción sin audio.

Tres cosas que C3 hereda y tiene que resolver, no descubrir:

- **En L01 la media dejó de ser decorativa.** C1 la trata como fondo y la saca
  del reproductor accesible, que era correcto para el relleno de stock. Pero
  P01 lleva avatar con 16 segundos de locución: en el contenido real es
  contenido, con transcripción obligatoria. L01 necesita distinguir las dos
  cosas, no elegir una.
- **El registro de instancias de `media.js` no se limpia al desmontar una
  pantalla** (hallazgo de T4, anotado en `ESTADO.md`). Se dejó pasar porque
  eran catorce pantallas de prueba; con 47 pantallas y 14 avatares, «un solo
  reproductor activo a la vez» pasa a apoyarse en referencias muertas.
  Que `router.js` avise a `media.js` al desmontar.
- **La transcripción no es un extra de accesibilidad: es el placeholder.**
  Mientras no haya audio, es lo único que lleva la locución de Jose a la
  pantalla. Tiene que verse deliberada, no como un hueco.

**Cierre:** operable solo con teclado, un reproductor activo a la vez,
transcripción visible y descargable, y una pantalla sin archivo de audio se ve
terminada, no rota.

**Cerrada 4 sep, rama `c3-media-avatar-audio` — las tres cosas de arriba,
resueltas, con una corrección a mitad de camino:** el primer intento hacía
que `media.tipo:'avatar'` reemplazara el fondo de L01 (la foto fija en vez
del video en loop); el usuario pidió mantener el video de siempre en la
portada, así que quedó separado en dos campos — `pantalla.media`
(`"video"`/`"imagen"`, el fondo decorativo de siempre, sin cambio) y
`pantalla.avatar` (objeto nuevo e independiente, mismo contrato que
`media.tipo:'avatar'` sin el campo "tipo"), que `PLANTILLAS.L01` monta
de verdad dentro de `.layout__panel` sin tocar el fondo. Fuera de L01
(cualquier layout con una sola zona de media), `media.tipo:'avatar'`
sigue siendo el campo único, sin este desdoblamiento — ver la nota de
abajo. `OVA.media.limpiarInstancias()` nueva, llamada por `router.js` en
cada navegación; la transcripción sin audio se muestra directa (no en
`<details>`) — es el placeholder, no un extra. Detalle completo en
`ESTADO.md`.

**Notas para C4/C7 sobre media (dejadas por C3):**

- **El contrato de `media.tipo:'avatar'`** vive documentado en el
  encabezado de `media.js`, no aquí — mismo criterio que I01–I08 vive en
  `quiz.js`. Resumen para quien escriba el script de C7: `{ tipo:'avatar',
  imagen, audio?, vtt?, transcripcion }`. `imagen` y `transcripcion` son
  obligatorios (sin imagen no hay avatar; sin transcripción no hay nada
  real que mostrar en ninguna de las dos rutas); `audio` y `vtt` son
  opcionales, y `vtt` no tiene sentido sin `audio`. Si el storyboard de
  Jose no trae datos de subtítulos por pantalla, omitir `vtt` entero —
  el reproductor funciona completo sin él (play/scrubber/transcripción),
  solo no aparece el botón CC.
- **L01 es la excepción de dos campos — P01 la va a necesitar en C7.**
  En cualquier layout con una sola zona de media, el avatar va completo
  en `pantalla.media` (`{ tipo:'avatar', imagen, audio?, vtt?,
  transcripcion }`). En L01 (la portada, dos zonas: fondo + panel) el
  avatar va en `pantalla.avatar` **sin el campo "tipo"** (`{ imagen,
  audio?, vtt?, transcripcion }`), y `pantalla.media` se queda con el
  video/imagen de fondo de siempre, sin tocar. P01 usa L01, así que C7
  arma sus dos campos por separado, no uno solo con `tipo:'avatar'`.
- **`media.audio` es una ruta real, no Blob.** A diferencia de `media.vtt`
  (que sigue siendo texto WebVTT completo, por el bloqueo de `file://` a
  `<track src>` que T4 ya documentó), un `<audio><source src="…"></audio>`
  con una ruta relativa real **sí funciona bajo `file://`** — mismo
  comportamiento que `<video src>` desde T4. Verificado con Playwright en
  C3 con un mp3 real en `public/audio/`. Si C7 (o quien produzca los
  audios finales) genera rutas a archivos reales, van directo en
  `media.audio` tal cual — no hay que envolverlas en nada.
- **Ausencia de imagen degrada sola, no hace falta lógica en el
  contenido.** Las pantallas de C3 apuntan a rutas de
  `public/img/avatar/` que no existen todavía y no rompen nada — ni
  consola, ni layout roto (`media.js`/`router.js` quitan la `<img>` al
  fallar su carga). C7 puede convertir las 47 pantallas con las rutas
  finales de Jose aunque Juan todavía no haya entregado todas las
  imágenes: cada pantalla se ve completa igual, con el círculo de avatar
  en `--surface-muted` en vez de un ícono de imagen rota.

### C4 · Estado compartido
Variables de contenido en `state.js`: `aciertos_diagnostico`, `perfil_riesgo`,
`resultado_boleta`. Persisten con el progreso y viajan a SCORM.
**Cierre:** responder P05–P09 cambia P10; P30 cambia P31 y la retro de P46/P47;
recargar la página conserva las tres.

**Cerrada 4 sep, rama `c4-estado-compartido` — el mecanismo genérico completo,
cableado de punta a punta contra las dos interacciones que ya existían
(I01–I05 e I11); `perfil_riesgo` queda probada a mano pero sin productor
real, porque I13 es C5.** Detalle completo en `ESTADO.md`; resumen para
quien siga con C5/C6/C7:

- `OVA.state.obtenerVariable(nombre)` / `establecerVariable(nombre, valor)` /
  `incrementarVariable(nombre, delta=1)` — el almacén, agnóstico de qué
  significa cada variable. Persiste en `storage.js` y se reporta a
  `cmi.suspend_data` (JSON de las tres); se restaura solo desde
  `storage.js`, igual que `lesson_location` desde T2/T3 — no es una
  inconsistencia nueva de C4.
- **Preguntas gradables (I01–I05, catálogo de quiz.js):**
  `interaccion.datos.variable: { nombre, modo?, valor? }`. Modo
  `"contar"` (por defecto) suma 1 en cada acierto — es lo que usan `s07`/
  `s16` para `aciertos_diagnostico`. Modo `"fijar"` asigna
  `datos.variable.valor` literal en vez de sumar.
- **Interacciones insignia (I09–I12):** no usan `datos.variable` — cada
  una fija su variable directo desde su propio "reportar" (I11 ya lo
  hace para `resultado_boleta` en `enviar()`). **C5, cuando construya
  I13, sigue este mismo patrón** para `perfil_riesgo`: una llamada a
  `OVA.state.establecerVariable('perfil_riesgo', categoría)` en el punto
  donde I13 reporte su resultado, sin tocar `state.js` ni `quiz.js` fuera
  de esa llamada.
- **L08 (`router.js`, `obtenerResultado()`):** `pantalla.resultado.variable`
  + `pantalla.resultado.reglas` (arreglo, primera que aplica gana — orden
  de más exigente a menos): `{ valor: x, cifra?, retro? }` para
  categóricos (igualdad estricta) o `{ minimo: n, cifra?, retro? }` para
  contadores (`variable >= n`). Sin variable con valor o sin regla que
  matchee, cae al `resultado.cifra`/`resultado.retro` estático de
  siempre — ese es el estado "todavía sin dato". Dentro de la cifra
  elegida, omitir `cifra.valor` la completa con el valor vivo de la
  variable. Ejemplo real en `content/ova-u1.js`, `s17`.
- **C6, la matriz de P46/P47 no es de aquí.** Cruzar `perfil_riesgo` con
  la distribución del portafolio (`PLAN-CONTENIDO.md` §3.1) es lógica de
  **I12 ampliada** (`construirDistribucionCapital` en `quiz.js`), no del
  mecanismo de `reglas` de L08 — ese resuelve una variable contra un
  layout de resultado, no dos variables cruzadas dentro de una
  interacción. `OVA.state.obtenerVariable('perfil_riesgo')` ya está
  disponible para que C6 lo use ahí directamente.

### C5 · Interacciones nuevas
I07 tarjetas volteables, I08 comparador de dos columnas, I13 test de perfil.
Ninguna con arrastre; I07 con `<button>` real por tarjeta y `aria-expanded`.
**Cierre:** las tres en la kitchen sink con sus estados, recorridas con teclado,
estado anunciado por ARIA y no solo por color.

### C6 · Interacciones ampliadas
I09 a modo recorrido, I10 con fórmulas `valorizacion` y `dividendo_por_accion`
y salidas múltiples, I11 contra la tabla de verdad de ocho filas, I12 con
matriz de retro por perfil.
**Cierre:** los casos de prueba que Jose dejó en los payloads pasan, uno por
uno, comprobados a mano en la kitchen sink.

### C7 · Conversión del storyboard a contenido
Script determinista `storyboard_data_v2.json` → `content/ova-u1.js`, con reglas
de parseo por layout. **Lo que no parsee limpio no se adivina: sale a una lista
de revisión.** Después, revisión pantalla por pantalla de las 47.
**Cierre:** las 47 pantallas navegan de P01 a P47 sin una sola caída al estado
de error del motor, y la revisión de las 47 está firmada.

### C8 · Descargables y recursos
Los cuatro descargables de Jose enganchados en P34 (L11): calculadora XLSX,
checklist, hoja de perfil, glosario tri-país. PDF etiquetados, no imágenes.
**Cierre:** los cuatro se descargan desde el OVA, en Moodle y en URL directa.

### C9 · Empaquetado, auditoría y Moodle
Regenerar el paquete, auditoría axe-core sobre las 47 pantallas, prueba real en
el Moodle de Pablo con libro de calificaciones.
**Cierre:** el de T9 de `PLAN.md`, ahora con contenido real.

---

## 7. Cronograma

| Día | Código | Producción (Juan / Jose) |
|---|---|---|
| **Vie 4** | C0, C1, C2 | Avatar: las 12 imágenes |
| **Sáb 5** | C3, C4 | Locuciones que alcancen |
| **Dom 6** | C5, C6 | Motion P21 y P23 |
| **Lun 7** | C7 (conversión + revisión de las 47), C8 | Infografías SVG |
| **Mar 8** | C9 y entrega | — |

**Ruta crítica: C0 → C1 → C7.** Sin renumeración no se puede convertir, y sin
conversión no hay demo. C0 y C1 tienen que quedar hoy.

**Línea de corte, en este orden si el plan se atrasa.** Se recorta producción,
nunca contenido ni pantallas:

1. Motion real de P21/P23 → SVG animado.
2. Audio de las pantallas que no sean apertura → imagen + transcripción.
3. I12 con matriz de retro completa → I12 con retro única (es la última que
   entra y la primera que se cae, igual que en `PLAN.md`).

Lo que **no** se recorta bajo ninguna circunstancia: las 47 pantallas, las
retros correcta e incorrecta de cada pregunta, la transcripción de las 47, y la
cadena perfil de riesgo → portafolio. Eso es el demo.
