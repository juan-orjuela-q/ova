# PLAN-ESTRUCTURA.md — reestructura del recorrido (E0–E7)

Plan vigente desde el **10 de septiembre de 2026**, después de la revisión del
demo con el equipo. Corre después de `PLAN-REDISENO.md` (D0–D6 cerradas; D7,
D9 y D10 quedan pendientes y **no** se retoman hasta cerrar este plan).

Lo que cambia no es el motor ni el sistema visual: cambia **qué pantallas
existen, en qué orden y bajo qué agrupador**. El recorrido pasa de 50 a 26
pantallas, la Unidad 1 se reorganiza alrededor de las 4 cápsulas de video que
está montando Jonás, y desaparecen dos de las tres piezas insignia.

---

## 0. Decisiones ya tomadas — no se re-discuten

1. **Las cuatro cápsulas del OVA son las cuatro cápsulas de video de Jonás**, no
   las cuatro del DI de Jose. Contexto del mercado / Valorización en acciones /
   El dividendo / El perfil de riesgo. Cada una abre con una pantalla L03 cuyo
   video todavía no existe.
2. **La apertura del diagnóstico (P04) se conserva como pantalla propia.** Las
   cinco preguntas (P05–P09) y el resultado (P10) se funden en **una sola
   pantalla**: batería de preguntas + bloque de resultado al terminar.
3. **El botón Siguiente queda bloqueado hasta completar esa actividad.** Es un
   mecanismo del motor declarado por la pantalla, no un caso especial escrito a
   mano para el diagnóstico.
4. **Los ítems de primer nivel sin pantalla son etiquetas de agrupación**, no
   destinos: Antes de empezar, Apertura, Cápsula 1–4, Cierre, Simulador. Se
   implementan con el campo `capsula` que D1 ya usa para el drawer y las migas
   de pan — no se inventa un nivel nuevo de jerarquía.
5. **Las piezas insignia Repo (U2) y Arma tu portafolio (U5) salen del OVA.**
   Solo queda la boleta de orden (P42), ahora bajo la etiqueta Simulador y
   dentro de la Unidad 1. Consecuencia externa en §6 — hay que tocar la
   propuesta.
6. **Las 26 pantallas que salen van a un banco archivado**, no al historial de
   git: `src/content/ova-u1-archivo.js`, que `index.html` no carga. Recuperar
   una pantalla es moverla de vuelta, no hacer arqueología.
7. **Los ids de pantalla no se renumeran.** El número del pie es la posición en
   el arreglo y se recalcula solo; los ids (`p13`, `p22`, …) son el hash de la
   URL y la clave de progreso. Las pantallas nuevas estrenan ids por rol
   (`p10-tutor`, `c1-video`), no por número: renumerar dos veces es cómo se
   rompió el catálogo en C0.

---

## 1. El recorrido nuevo — 26 pantallas

`#` es el número que mostrará el pie. "Origen" es el número actual del pie.

| # | Etiqueta | id | Layout / Interacción | Origen | Estado |
|---|---|---|---|---|---|
| 1 | — (portada) | `p01` | L01 | 1 | igual |
| 2 | Antes de empezar | `p01-bienvenida` | L03 | 2 | igual |
| 3 | Antes de empezar | `p01a` | L09 | 3 | igual |
| 4 | Antes de empezar | `p01b` | L09 | 4 | igual |
| 5 | Antes de empezar | `p02` | L03 | 5 | cambia `capsula`/`kicker` |
| 6 | Apertura | `p03` | L12 | 6 | igual |
| 7 | Apertura | `p04` | L02 | 7 | igual |
| 8 | Apertura | `p05-diagnostico` | L06 · **I15** | 8–13 | **fusión, nueva** |
| 9 | Apertura | `p10-tutor` | L03 | — | **nueva, en blanco** |
| 10 | Apertura | `p11` | L05 | 14 | tarjetas reescritas |
| 11 | Cápsula 1: Contexto del mercado | `c1-video` | L03 | — | **nueva, video pendiente** |
| 12 | Cápsula 1 | `p13` | L05 · I07 | 16 | igual |
| 13 | Cápsula 1 | `p15` | L07 · I01 | 18 | igual |
| 14 | Cápsula 2: Valorización en acciones | `c2-video` | L03 | — | **nueva, video pendiente** |
| 15 | Cápsula 2 | `p22` | L06 · I10 | 25 | igual |
| 16 | Cápsula 2 | `c2-comprobacion` | L07 · I01 | — | **nueva, contenido pendiente** |
| 17 | Cápsula 3: El dividendo | `c3-video` | L03 | — | **nueva, video pendiente** |
| 18 | Cápsula 3 | `p24` | L06 · I10 | 27 | igual |
| 19 | Cápsula 3 | `p25` | L07 · I01 | 28 | igual |
| 20 | Cápsula 4: El perfil de riesgo | `c4-video` | L03 | — | **nueva, video pendiente** |
| 21 | Cápsula 4 | `p29` | L05 | 32 | igual |
| 22 | Cápsula 4 | `p30` | L06 · I13 | 33 | igual |
| 23 | Cápsula 4 | `c4-comprobacion` | L07 · I01 | — | **nueva, contenido pendiente** |
| 24 | Cierre | `p32` | L09 | 35 | revisar ideas (§5) |
| 25 | Cierre | `p34` | L11 | 37 | igual |
| 26 | Simulador | `p42` | L06 · I11 | 45 | cambia `unidad`/`capsula`/`kicker` |

**Al banco (26):** p12, p14, p16, p17, p18, p19, p20, p21, p23, p26, p27, p28,
p31, p33, p35, p36, p37, p38, p39, p40, p41, p43, p44, p45, p46, p47.

**Denominador del progreso:** 23 (p01-bienvenida, p01a y p01b siguen con
`progreso: false`, decisión de D3).

---

## 2. E1 · Batería de preguntas en una pantalla (I15)

Hoy el contrato dice, literalmente, *una pregunta por pantalla* (CLAUDE.md,
"El contrato de contenido"; encabezado de `quiz.js`). Esta tarea abre la
excepción, y por eso **cambia una regla**: CLAUDE.md se edita en E7, no se deja
la contradicción viva.

**Forma.** Un tipo nuevo del catálogo, `I15 cuestionario`, despachado por
`CONSTRUCTORES_INSIGNIA` (igual que I07/I08/I13: arma su DOM completo y decide
él cuándo reportar). Reusa los constructores de pregunta que ya existen — no se
reimplementa I01 ni I02.

```
I15 cuestionario {
  enunciado?,
  preguntas: [ { tipo: 'I01'|'I02'|…, datos: {…} } … ],   // la forma de siempre
  variable?,                                              // acumulador, p. ej. aciertos_diagnostico
  resultado?: { variable, reglas:[…] }                    // el mismo objeto que hoy lee L08
}
```

**Reusar, no duplicar.** El bloque de resultado (cifra + callout) hoy vive
dentro de `PLANTILLAS.L08` en `router.js`, contra `obtenerResultado()`. Se
extrae a una función compartida (`OVA.resultado.construir(resultado)`) que usan
L08 **y** I15. Sin eso habría dos implementaciones de la misma regla
"primera que aplica gana" y divergirían en la primera corrección.

**Trampas de esta tarea:**

1. **`cmi.core.score.raw` se pisa cinco veces.** Hoy `actualizarNota()` escribe
   100 o 0 por pregunta comprobada. Con cinco en una pantalla, la nota final
   sería la de la última respondida. I15 debe reportar cada pregunta como fila
   de `cmi.interactions` (con sus ids actuales `u1-p05-diagnostico-1..5`, que
   Pablo ya tiene mapeados) y calcular `score.raw` una sola vez, al cerrar la
   batería, como porcentaje de aciertos.
2. **El intento no se persiste entre recargas** (decisión de T6). Con el
   Siguiente bloqueado eso deja al estudiante encerrado tras un F5: la pantalla
   figura visitada y la actividad vuelve a cero. I15 marca su terminación en
   una variable de contenido (`state.js` ya persiste y ya reporta), y al montar
   comprueba esa marca: si ya está completa, arranca desbloqueada y mostrando
   el resultado.
3. **Alto.** Cinco preguntas con sus retros no caben en el presupuesto de ~780px
   del contenedor SCORM. Es scroll dentro de `#app`, que la regla dura 9 permite
   — pero la región con scroll tiene que seguir siendo alcanzable por teclado
   (trampa 1 de PLAN-CONTENIDO §4.3) y el contador "3 de 5" tiene que verse sin
   volver arriba.
4. **Revelar sin robar el foco.** Al comprobar una pregunta, la retro aparece
   debajo; el foco se queda donde está y el cambio se anuncia por `aria-live`,
   igual que ya hace el bloque I14.
5. **El resultado no es solo color.** El callout ya cumple (ícono + título +
   texto); la cifra también lleva etiqueta.

**Kitchen sink:** I15 entra en `dev/kitchen-sink.html` con sus tres estados
(sin empezar, a medias, completa con resultado) en esta misma tarea, no después.

---

## 3. E2 · Bloqueo del avance hasta completar

**Forma.** Campo opcional de pantalla: `bloqueaAvance: true`. El motor no
inventa la condición: la interacción avisa cuándo está completa.

- `quiz.js`: `crear(interaccion, { alCompletar })` — un segundo argumento
  opcional. Hoy no existe ningún canal de vuelta desde una interacción; este es
  el mínimo que resuelve el caso sin inventar un bus de eventos.
- `router.js`: si la pantalla trae `bloqueaAvance` y la interacción no está
  completa, el botón Siguiente queda inerte.

**Trampas:**

1. **`disabled` no sirve aquí.** Un botón deshabilitado sale del orden de
   tabulación y no anuncia por qué. Va `aria-disabled="true"` + el click sin
   efecto + una nota visible junto al botón con ícono y texto ("Completa la
   actividad para continuar"). Al desbloquear, anuncio por `aria-live`.
2. **El drawer sigue abierto.** Un estudiante puede saltar la pantalla desde el
   índice o cambiando el hash. Es un candado blando, deliberado: bloquear el
   índice contradice "dentro de una unidad toda pantalla es alcanzable" (D1) y
   el bloqueo duro entre unidades es de Moodle, no del OVA. Queda documentado,
   no se tapa.
3. **La portada esconde la barra inferior** (regla dura 9): `bloqueaAvance` en
   L01 no tendría dónde pintarse. El motor falla ruidosamente si el contenido lo
   pide ahí, en vez de ignorarlo en silencio.

**Kitchen sink:** el estado bloqueado/desbloqueado de la barra inferior entra en
la misma tarea.

---

## 4. E3 · Las etiquetas como agrupador

Barato: el mecanismo ya está construido. D1 agrupa el drawer por `unidad`
(`<h3>`) y por `capsula` (`<h4>`), y pinta las migas Unidad › Cápsula › Tema.
Lo único que cambia es que **ahora casi ninguna pantalla tiene `capsula: null`**:
Antes de empezar, Apertura, Cierre y Simulador dejan de ser huecos y pasan a ser
etiquetas con nombre.

- Ninguna etiqueta es enlace, en ningún nivel — ya es así por construcción
  (las migas nunca fueron enlaces; los `<h4>` del drawer son encabezados).
- La portada conserva `capsula: null` y queda sola antes de la primera etiqueta.
- Los `kicker` de cada pantalla se alinean con su etiqueta ("Unidad 1 ·
  Cápsula 2", "Unidad 1 · Cierre", …).
- Revisar la rama de `actualizarMigas()` que oculta el ítem de cápsula: con la
  estructura nueva casi nunca se usa. Y la regla "si el título es igual al
  nombre de la cápsula, muestra solo la cápsula" queda muerta (ninguna pantalla
  se llama como su etiqueta): se quita o se deja documentada como inactiva, no
  a medio camino.
- `unidad` pasa a tener un solo valor ("Unidad 1") al salir Repo y Portafolio:
  el `<h3>` del drawer queda único. Se conserva el agrupador — es lo que hará
  falta cuando entren U2 y U3.

---

## 5. E4 · Contenido, y E5 · Banco archivado

**E4.** Reescribir `src/content/ova-u1.js` con el orden de §1:

- **P11 (pantalla 10)** — las cuatro tarjetas pasan a los nombres nuevos:
  Contexto del mercado / Valorización en acciones / El dividendo / El perfil de
  riesgo.
- **P42 (pantalla 26)** — `unidad: 'Unidad 1'`, `capsula: 'Simulador'`,
  `kicker: 'Unidad 1 · Simulador'`. Hoy dice Unidad 3.
- **Las cuatro pantallas de video** — L03, `media.tipo: 'video'` apuntando a
  `public/videos/capsulas/cNN-slug.mp4`, sin producir todavía: degradan a
  placeholder + transcripción, que es el estado de producción correcto (regla
  dura 10), no un hueco.
- **`p10-tutor`** — L03 con título y cuerpo en blanco y media pendiente. Marcada
  en el archivo como pendiente de guion, para que no se confunda con un olvido.
- **`c2-comprobacion` y `c4-comprobacion`** — L07 · I01 con el enunciado
  pendiente de Jose. Se dejan con un enunciado provisional visible como
  provisional, nunca con texto inventado que parezca definitivo.
- **Bumpear el `id` del contenido** a `u1-contexto-mercado-v2`. `storage.js`
  guarda por `contenidoId`: sin el bump, un progreso guardado con las 50
  pantallas viejas convive a medias con el recorrido nuevo (ids visitados que
  ya no existen). Con el bump, arranca limpio.

**E5.** `src/content/ova-u1-archivo.js` con las 26 pantallas retiradas, con
encabezado que diga qué es, de qué fecha viene y por qué no se carga.
`index.html` **no** lo referencia.

**Coherencia de contenido — tres huecos que abre la reestructura:**

1. **P32 "Ideas clave"** dice "Ordinarias y preferenciales otorgan derechos
   distintos", pero P27 y P28 se van al banco y la cápsula 4 ahora es el perfil
   de riesgo. Esa idea se reemplaza o se elimina.
2. **P42 "Simula tu primera orden"** se queda sin P41 (mercado vs límite), que
   era donde se explicaba la diferencia que la boleta pide aplicar. O el
   enunciado de la boleta se vuelve autosuficiente, o vuelve P41.
3. **`perfil_riesgo`** lo escribe I13 (P30) y ya no lo lee nadie: P31, P46 y
   P47 se van. El estado compartido — el argumento de "adaptativo" del demo —
   queda sostenido solo por el diagnóstico. Con poco costo, el Cierre puede
   volver a nombrar el perfil obtenido. Decisión de Juan.

---

## 5.b Dónde van las locuciones, transcripciones y videos nuevos

**La regla ya existe y no cambia: el archivo se llama como el id de la
pantalla.** Es la misma que siguen los motion (`p17-propiedad-fraccionada.mp4`)
y las infografías (`p14-renta-variable.svg`). Las pantallas nuevas estrenan ids
por rol, así que sus archivos también: `c1-contexto`, `c2-valorizacion`,
`c3-dividendo`, `c4-perfil` (antes `cNN-video` en §1 — se renombran para que el
id sirva de nombre de archivo).

| Qué | Dónde | Cómo se llama |
|---|---|---|
| Locución de avatar | `public/audio/` | `<id>-<slug>.mp3` |
| Video de cápsula | `public/videos/capsulas/` | `<id>-<slug>.mp4` |
| Foto del tutor | `public/img/avatar/` | `p10-tutor-<nombre>.webp` |
| Transcripción | `src/content/ova-u1.js` → `media.transcripcion` | no es archivo |
| Subtítulos | `src/content/ova-u1.js` → `media.vtt` | no es archivo |

**Ni la transcripción ni los subtítulos son archivos sueltos.** La
transcripción es contenido y vive en el JSON; `media.vtt` guarda el **texto**
WebVTT, no una ruta, porque un `<track src="archivo.vtt">` real falla bajo
`file://` en Chromium (T4, y la misma razón por la que el contenido es `.js` y
no `.json`). Si Producción entrega archivos `.vtt`, se pega su contenido.

El texto hablado se redacta y se revisa en
`disenoInstruccional/locuciones-estructura-e.md`, un bloque por pantalla con su
nombre de archivo y su estado. De ahí se copia al contenido: un solo lugar que
editar cuando cambia una locución, en vez de buscarla dentro de un archivo de
69 KB.

**Ocho locuciones de avatar en la estructura nueva:** `p01-bienvenida`, `p02`,
`p03`, `p04`, `p05-diagnostico` (el cierre de la batería, texto heredado de la
antigua P10), `p10-tutor`, `p32` (ideas clave) y `p42` si se decide que lleve.
Los cuatro videos de cápsula traen su locución dentro del video, pero **igual
necesitan transcripción** en su pantalla — la regla dura 10 no distingue.

---

## 6. Fuera del OVA — a quién hay que avisar

- **La propuesta comercial dice tres piezas insignia.** Con Repo y Portafolio
  fuera, queda una. O se ajusta el texto de la propuesta, o se recuperan del
  banco antes de presentar. **Es la consecuencia más cara de esta reestructura
  y no se resuelve en el código.**
- **Jose (DI):** el paquete v2 de 47 pantallas queda superado. Necesita guion
  para `p10-tutor`, para las dos comprobaciones nuevas y texto de apoyo
  (título, cuerpo, transcripción) para las cuatro pantallas de video. No hace
  falta un DI v3 completo: una hoja delta contra esta tabla alcanza.
- **Jonás (video):** las cuatro cápsulas dejan de ser material de apoyo y pasan
  a ser la columna del recorrido, montadas en L03 (media a un lado, texto al
  otro) — no a pantalla completa. Los motion de P17/P21/P23 salen.
- **Pablo (Moodle):** el paquete SCORM cambia de 50 a 26 pantallas. Afecta el
  umbral de completitud, el XP calibrado a nivel 8 y los informes que cuentan
  pantallas o interacciones. Los ids de las cinco preguntas del diagnóstico se
  conservan a propósito para no romper su mapeo.

---

## 7. E6 · Verificación, y E7 · Documentación

**E6** — además de los cinco criterios de siempre (kitchen sink, recorrido
completo con teclado y foco visible, reflow a 320px, zoom de texto al 200%,
ningún hex nuevo, `prefers-reduced-motion`):

- Recorrer las 26 pantallas seguidas y confirmar que el pie numera 1–26 y el
  progreso llega a 100% con 23 en el denominador.
- Diagnóstico: responder mal a propósito, recargar a media batería, comprobar
  que no queda encerrado y que el resultado que muestra es el que corresponde.
- Migas y drawer en las nueve etiquetas, incluida la portada sin etiqueta.
- Subir el paquete al Moodle de Pablo y verificar `cmi.interactions`,
  `score.raw` y `lesson_status` — es donde se ve si la trampa 1 de E1 quedó
  bien resuelta.

**E7** — CLAUDE.md (el contrato de contenido deja de decir "una pregunta por
pantalla" sin excepción; entra el catálogo I15 y el campo `bloqueaAvance`),
ESTADO.md (tareas y decisiones), y una nota al inicio de PLAN-CONTENIDO.md y
BRIEF-DI.md advirtiendo que la lista de 47 pantallas quedó superada por este
plan.

---

## 8. Orden y peso

| Tarea | Depende de | Peso |
|---|---|---|
| E0 · rama `e-reestructura` | — | minutos |
| E1 · I15 cuestionario (+ kitchen sink) | E0 | **1 día** |
| E2 · `bloqueaAvance` (+ kitchen sink) | E1 | ½ día |
| E3 · etiquetas | E0 | 2 horas |
| E4 · contenido nuevo | E1, E2, E3 | ½ día |
| E5 · banco archivado | E4 | 1 hora |
| E6 · verificación | E4, E5 | ½ día |
| E7 · documentación y avisos | E6 | 2 horas |

**≈ 3 días de código y contenido**, sin contar producción audiovisual ni los
guiones que faltan. E1 es la única tarea con riesgo real: es la primera vez que
el motor pone varias preguntas en una pantalla, y las trampas 1 y 2 de §2 son
las que se descubren tarde si no se atacan primero.

E3 puede adelantarse en paralelo a E1: no se tocan los mismos archivos y deja el
recorrido visible con la estructura nueva antes de que exista el cuestionario.
