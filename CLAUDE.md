# OVA nuam — instrucciones del proyecto

Objeto de aprendizaje virtual en HTML para el demo de la Academia Virtual nuam
(Appicua, RFP agosto 2026). Se empaqueta como SCORM 1.2 para Moodle y además se
sirve como sitio estático en URL directa. Entrega: 8 de septiembre de 2026.

## Archivos del proyecto

- `CLAUDE.md` — las reglas. Cambia solo cuando cambia una regla.
- `PLAN.md` — cómo se construyó el motor (T1–T9). Cerrado el 29 de agosto.
- `PLAN-CONTENIDO.md` — montar el diseño instruccional de Jose (47 pantallas)
  sobre el motor. Tareas C0–C9; C0–C7 cerradas, C8 y C9 pendientes.
- `PLAN-REDISENO.md` — jerarquía Unidad › Cápsula › Tema, barra superior
  inverse, progreso en %, preferencias del curso, autolocución, dos pantallas
  nuevas y movimiento. Tareas D0–D10; D0–D6 cerradas, D7/D9/D10 pendientes y
  **pausadas** hasta cerrar `PLAN-ESTRUCTURA.md`.
- `PLAN-ESTRUCTURA.md` — **el plan vigente** (10 sep): reestructura del
  recorrido de 50 a 26 pantallas alrededor de las cuatro cápsulas de video.
  Tareas E0–E7, todas cerradas menos avisos externos pendientes (§6). Su
  sección 0 lleva las decisiones ya tomadas: no se re-discuten.
- `ESTADO.md` — qué está hecho y qué se decidió. Se actualiza al cerrar cada sesión.
- `disenoInstruccional/` — el paquete de Jose (v2, 3 sep). Es la fuente del
  contenido, pero quedó **superado** por `PLAN-ESTRUCTURA.md`: 26 de sus 47
  pantallas se archivaron (`src/content/ova-u1-archivo.js`) y faltan guion
  para tres pantallas nuevas. Donde siga vigente: no se reescribe, no se
  recorta, no se sustituye una interacción por otra más barata. Donde el
  motor no llega, se amplía el motor.

Lee `ESTADO.md` y `PLAN-ESTRUCTURA.md` al empezar cualquier sesión (y
`PLAN-CONTENIDO.md` si tocas contenido, catálogos o empaquetado).

## Reglas duras

Estas no se negocian ni se re-discuten en cada sesión.

1. **Nunca escribas un valor hexadecimal en el código.** Todo color sale de
   `src/styles/tokens.css`. Si necesitas un color que no existe ahí, para y
   pregunta: probablemente la respuesta es que ese color no se puede usar.
2. **WCAG 2.1 AA es requisito de implementación, no revisión final.** Cada
   componente nace accesible o no se da por terminado.
3. **El color nunca es el único código de un estado.** Todo estado lleva además
   icono y texto. Sin excepción.
4. **Nada de frameworks.** HTML, CSS y JavaScript nativo. Sin React, sin Vue, sin
   build step de bundler. El OVA tiene que abrir desde `file://` y desde un
   paquete SCORM sin servidor de por medio.
5. **Sin dependencias externas en tiempo de ejecución**, salvo Google Fonts.
   Nada de CDN de scripts: el OVA debe funcionar sin red una vez cargado.
6. **`outline: none` está prohibido.** El foco siempre visible.
7. **Responsive real, no lienzo escalado.** Prohibido `transform: scale()` sobre
   el contenedor de contenido. Debe reflowear a 320 px y aguantar zoom de texto
   al 200 % sin scroll horizontal.
8. **Los catálogos L01–L13 e I01–I14 son los de `BRIEF-DI.md`**, que es contra
   lo que Jose escribió las 47 pantallas. El código tuvo otros hasta el 4 de
   septiembre; C0 los renumeró. Ver la tabla de equivalencias en
   `PLAN-CONTENIDO.md` §2 antes de tocar `layouts.css` o `quiz.js`. **I15, I16 e
   I17 son las excepciones:** no están en `BRIEF-DI.md`. I15 lo agregó
   `PLAN-ESTRUCTURA.md` (E1) para la batería de diagnóstico; I16 (simulador
   de dividendos) lo agregó el rediseño del ejercicio de p24 que entregó el
   DI el 12 de septiembre; I17 (simulador de portafolio) lo agregó el
   segundo artefacto del DI, montado ese mismo día como pantalla 27 —
   ver "El contrato de contenido". Sumar un tipo al
   catálogo es la excepción, no el camino por defecto: solo cuando el DI
   entrega una interacción nueva que ningún tipo existente monta sin
   deformarse.
9. **Marco fijo, scroll en el medio.** El documento no scrollea: `body` mide
   `100dvh` con `overflow: hidden`, las dos barras quedan fijas y el scroll
   vive en `#app`. La portada (L01) es la excepción: va sin barras, a sangre.
   El 16:9 no es CSS — es el alto que Pablo configura en el módulo SCORM de
   Moodle (~780 px sobre los 1390 del contenedor) y el presupuesto de autoría
   de `BRIEF-DI.md` §4. Ver `PLAN-CONTENIDO.md` §4, incluidas sus cuatro
   trampas: región con scroll alcanzable por teclado, `fullscreenEnabled`
   antes de mostrar el botón de pantalla completa, revelado sin robar foco y
   zoom de texto al 200 % con las barras fijas.
10. **El avatar es imagen fija + audio, no video.** Y toda pantalla con
   locución muestra su transcripción aunque el audio todavía no exista: esa
   degradación es el placeholder de producción, no un estado roto.

## Restricciones de color que la gente rompe

El naranja de marca tiene la luminancia de un gris 450. De ahí sale todo esto:

- Naranja 500 **no es texto de cuerpo** sobre ninguna superficie clara. Para
  texto y enlaces sobre claro va el naranja 700.
- **Ningún naranja sobre superficies del gris 200 al 600.** Ni relleno, ni borde,
  ni icono. No llega ni a 3:1.
- **No existe el botón naranja pequeño.** La etiqueta blanca sobre naranja solo
  cumple como texto grande: mínimo 19 px en peso 700.
- **La regla anterior no es solo del botón.** Cualquier componente con texto
  informativo sobre relleno naranja-500 —eyebrow, chip, badge— tiene el mismo
  problema de contraste si el texto es chico. Ahí el naranja va de borde o de
  texto (naranja-700) sobre un fondo neutro, nunca de relleno. En código, la
  variante bloqueada por tamaño (p. ej. `.boton--naranja` sin `.boton--grande`)
  se deja deliberadamente sin estilos propios en vez de validarse en JS: cae al
  tratamiento por defecto (relleno negro) en lugar de romper el contraste en
  silencio. Sigue este mismo patrón para cualquier componente nuevo con la
  misma restricción.
- El verde 500 y el rojo 500 son para rellenos e iconos. Como texto sobre claro
  van los 700.
- El gris 400 no es texto informativo sobre superficies claras. Sobre superficie
  inverse sí.
- Sobre superficie naranja: cuerpo en gris 950, blanco solo en display.

**Secundarios (ajustes tanda 16).** `tokens.css` tiene cuatro colores
expresivos —cyan, verde 91, amarillo y azul— que Juan abrió para
simuladores y piezas de datos. Tres reglas, en el mismo archivo junto a
su declaración: **no codifican estado** (acierto sigue siendo verde
500/700 y error rojo 500/700); cyan, verde 91 y amarillo son **rellenos
con texto gris 950**, nunca texto sobre claro (miden entre 1,1:1 y
1,5:1 contra blanco), y el azul es el espejo —relleno con texto blanco,
y el único que además sirve de texto sobre superficie clara—; y **el
naranja sigue mandando**: entran donde hay que distinguir dos cosas que
no son acierto ni error, no reemplazan la marca ni la escala neutral.

**El anillo de foco puede cambiar de color, nunca apagarse.** El anillo
naranja 500 desaparece sobre un relleno naranja y mide 2,39:1 sobre el
cyan —por debajo del 3:1 de WCAG 1.4.11—. Dentro de un relleno de marca
o secundario pasa a gris 950. Hoy solo lo hace la cabecera de I11; si
aparece otro componente con relleno de color, sigue este patrón en vez
de dejar el anillo por defecto.

**El tablero oscuro no es decoración: es lo que hace legible la paleta
secundaria.** Cyan, verde 91 y amarillo miden entre 1,1:1 y 1,5:1 contra
blanco, así que como serie de un gráfico sobre superficie clara no llegan
al 3:1 que WCAG 1.4.11 exige a un elemento gráfico significativo. Sobre
gris 950 miden 13,5:1, 14,7:1 y 17,5:1. Por eso el tablero de I17 es
oscuro (y el de cualquier gráfico que necesite más de dos series lo será
también); sobre claro solo hay tres colores de serie disponibles —naranja
500 (3,48:1), azul 500 (10,4:1) y la escala de grises—.

## Estructura

```
src/
  index.html            plantilla única del OVA
  styles/
    tokens.css          fuente de verdad del sistema visual
    base.css            reset, tipografía, foco, reduced-motion, utilidades
    layouts.css         los layouts L01..L13
    components.css      chrome, contenido, evaluación, datos
  js/
    app.js              arranque y montaje
    router.js           navegación entre pantallas
    state.js            progreso y máquina de estado
    storage.js          persistencia unificada
    scorm.js            wrapper SCORM 1.2 con degradación a standalone
    a11y.js             foco entre pantallas y anuncios aria-live
    media.js            reproductor
    quiz.js             motor de evaluación
    charts.js           gráficos en SVG o canvas
  content/
    ova-u1.js           contenido declarativo de la OVA (ver nota abajo)
  assets/
dev/
  kitchen-sink.html     todos los componentes en una página
build/
  package-scorm.sh      genera el zip SCORM y la copia standalone
```

## El contrato de contenido

Cada OVA es un JSON. El código no sabe de contenido; el contenido no sabe de
código. Esta separación es lo que permite que Jose entregue guion y que la OVA
se genere sin escribir HTML pantalla por pantalla.

```json
{
  "id": "u1-contexto-mercado",
  "titulo": "Contexto sobre el mercado, la bolsa y las acciones",
  "unidad": 1,
  "pantallas": [
    {
      "id": "s01",
      "layout": "L01",
      "titulo": "…",
      "kicker": "Unidad 1",
      "cuerpo": ["…"],
      "media": { "tipo": "video", "src": "…", "poster": "…", "vtt": "…", "transcripcion": "…" },
      "interaccion": { "tipo": "I01", "datos": { } },
      "progreso": true
    }
  ]
}
```

Reglas del contrato: `layout` sale del catálogo L01..L13. `interaccion.tipo`
sale del catálogo I01..I17. Si el JSON pide algo que no existe en el catálogo,
el motor falla ruidosamente en consola — nunca renderiza a medias en silencio.
Cada `interaccion` es una pregunta por pantalla (layout L10), con una sola
excepción: **I15 cuestionario** empaqueta varias preguntas gradables del
catálogo (I01–I05, completar, numerica, autoevaluacion) más un bloque de
resultado compartido al terminar, para el caso de una batería de diagnóstico.
No es una forma genérica de meter "varias preguntas en una pantalla" —
"banco de preguntas" sigue siendo el catálogo de tipos, no un lugar para
acumular preguntas sueltas fuera de ese caso. El catálogo I01–I08 (preguntas),
I14 (bloque de retroalimentación compartido), I15 (cuestionario), I16
(simulador de dividendos de p24) e I17 (simulador de portafolio de la
pantalla 27) y la forma exacta de `interaccion.datos` por
tipo están documentados en el encabezado de `quiz.js` —I16 e I17 junto a sus
constructores—, no aquí — mismo criterio que el catálogo de layouts vive en
`layouts.css`.

Una pantalla de L06 puede pedir además `ancho: "amplio"`: el layout sube su
ancho máximo de 56 rem a 88 rem desde 64 em, para interacciones que se
disponen en dos columnas (el tablero de la calculadora en p22, el simulador de
dividendos en p24, el simulador de portafolio de la pantalla 27). El ancho es del layout, no del componente, por eso viaja en
la pantalla y no en `interaccion.datos`.

Una pantalla puede llevar además `bloqueaAvance: true`: el botón Siguiente
queda `aria-disabled` (nunca `disabled`: tiene que seguir alcanzable por
teclado y anunciar por qué) hasta que la interacción avise que terminó. Es un
campo genérico del contrato — cualquier interacción puede usarlo si su
constructor sabe decidir cuándo está "completa" — no un caso especial escrito
a mano para el diagnóstico. No tiene efecto en L01: la portada no pinta la
barra inferior donde vive "Siguiente" (regla dura 9), así que pedirlo ahí es
motor fallando ruidosamente, no una combinación silenciosamente ignorada.
Detalle completo (canal `alCompletar`, candado blando desde el drawer) en los
encabezados de `quiz.js` y `router.js`.

**El archivo físico es `.js`, no `.json`.** `fetch()` y `XMLHttpRequest` no
pueden leer un archivo local bajo `file://` (Chromium lo bloquea por CORS,
verificado con Playwright al construir T2) — imposible de evitar sin violar la
regla dura 4. `content/ova-u1.js` envuelve el mismo objeto de arriba en
`window.OVA_CONTENIDO = { … };` y se carga con un `<script src>` clásico, que
sí puede leer archivos locales. El contenido en sí sigue siendo JSON puro; el
wrapper es solo el mecanismo de carga, no cambia lo que Jose entrega.

## Modos de ejecución

El mismo build corre en dos contextos y `scorm.js` los distingue solo:

- **Dentro de Moodle**: paquete SCORM subido al módulo, mismo origen que Moodle,
  la API está disponible. Reporta avance, tiempo e interacciones.
- **URL directa**: no hay API. Degrada a `localStorage`, todo funciona igual
  salvo el reporte. Nunca lanza error ni muestra advertencia al estudiante.

El descubrimiento de la API recorre `window.parent` hasta 10 niveles buscando
`API`. Si el OVA queda en otro origen que Moodle, ese acceso lanza SecurityError:
hay que capturarlo y degradar, no dejarlo reventar.

## Convenciones de código

- CSS con propiedades personalizadas y `gap`. Nada de márgenes por elemento para
  separar hermanos.
- Nombres de clase en español, en kebab-case, con prefijo por familia:
  `.cap-`, `.quiz-`, `.media-`, `.nav-`, `.dato-` (datos y gráficos, T7),
  `.calc-` (interacciones insignia, T8).
  Los átomos transversales (usados por varias familias) van sin prefijo:
  `.boton`, `.eyebrow`, `.tarjeta`, `.numero-indice`, `.regla`, `.anillo`,
  `.icono`, `.linea-tiempo`.
- JavaScript en scripts clásicos (`<script src="…">`), no módulos ES: Chromium
  bloquea por CORS la carga de `type="module"` bajo `file://` (verificado con
  Playwright al construir T2), y la regla dura 4 exige que el OVA abra sin
  servidor. Sin `import`/`export`; cada archivo es un IIFE que cuelga su API en
  `window.OVA.<nombre>` (`OVA.router`, `OVA.state`, etc.), y `index.html` los
  carga en orden de dependencia. Sin transpilación.
- Cada componente interactivo expone su estado por atributos ARIA reales, no por
  clases CSS que un lector de pantalla no ve.
- Comentarios y textos de interfaz en español.
- Nada de `innerHTML` con contenido del JSON sin escapar.

## Cómo verificar

Cada tarea se da por terminada cuando:

1. El componente aparece en `dev/kitchen-sink.html` con todos sus estados.
2. Se recorre completo con teclado, con foco visible en cada parada.
3. Reflowea a 320 px sin scroll horizontal y aguanta zoom de texto al 200 %.
4. Ningún hex nuevo fuera de `tokens.css`.
5. `prefers-reduced-motion` desactiva sus animaciones.

La kitchen sink no es opcional ni es un extra: es la superficie de revisión del
proyecto y lo que se le muestra al equipo. Se actualiza en la misma tarea que
crea el componente, nunca después.

## Movimiento

Las duraciones y curvas están en `tokens.css`. Nunca escribas un valor de
duración ni una `cubic-bezier` a mano.

**Inventario de movimiento.** El OVA anima estas siete cosas y ninguna más:

1. Transición entre pantallas — `--dur-slow`. Es la más importante del OVA.
2. Entrada del contenido al llegar a una pantalla — `--dur-base`, escalonada
   con `--stagger`, desplazamiento `--shift-sm`.
3. Retroalimentación de quiz — `--dur-base`. Es la que más comunica.
4. Avance de la barra de progreso — `--dur-slow`.
5. Desbloqueo de insignia — `--dur-reveal`. El único momento celebratorio.
6. Estados de las interacciones insignia I09 a I12.
7. Hover y press de controles — `--dur-fast`.

**Prohibido:** nada que se mueva en bucle en la periferia mientras alguien lee.
Nada que dure más de 500 ms en una interacción rutinaria. Nada de parallax.
Nada que anime `width`, `height`, `top` o `left`: solo `transform` y `opacity`.

**Movimiento reducido.** El media query ya está en `tokens.css` y colapsa las
duraciones a 1 ms y los desplazamientos a 0. No lo dupliques por componente y
no uses `animation: none`, que rompe los listeners de `animationend`. Bajo
movimiento reducido se conserva la opacidad y se pierde el desplazamiento: el
cambio de estado tiene que seguir siendo perceptible.

**El movimiento no sustituye al anuncio.** Si un cambio de estado se comunica
con una animación, también se comunica por `aria-live` o por cambio de atributo
ARIA. Una animación que solo se ve no informa a quien no la ve.

## Fuera de alcance

No construir. Si aparece en una petición, avisar en vez de implementarlo:

- Selector de país o cualquier variación de contenido por país. El contenido es
  uno solo y está neutralizado de marca. El argumento tri-país vive en el
  glosario descargable y en una infografía estática.
- Bloqueo de unidades. Eso lo resuelve Moodle con restricciones de acceso. El
  OVA solo conoce el estado bloqueado de una cápsula dentro de su propia unidad.
- Backend de cualquier tipo. No hay servidor.
- Tema oscuro completo. El sistema es claro con superficies inverse puntuales.
