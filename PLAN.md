# Plan de construcción del OVA

Nueve tareas. Cada una es una sesión de Claude Code con una condición de cierre
verificable. El orden importa: T1 a T3 son cimientos y todo lo demás depende de
ellos.

Antes de empezar cualquier tarea, Claude Code debe haber leído `CLAUDE.md`.

---

## T1 · Andamiaje y sistema visual

Estructura de carpetas, `tokens.css` con el bloque completo del UI Kit,
`base.css`, `layouts.css` con los trece layouts, plantilla `index.html`, y la
primera versión de `dev/kitchen-sink.html` mostrando la escala tipográfica, las
seis superficies y los trece layouts con contenido de relleno.

**Cierre:** la kitchen sink abre en el navegador, muestra los trece layouts, y
cada uno reflowea correctamente a 320 px. Ningún hex fuera de `tokens.css`.

**Nota para la sesión:** pegar el bloque de tokens del UI Kit tal cual. No pedir
que se derive ni se reinterprete.

---

## T2 · Motor

`router.js`, `state.js`, `storage.js`, `scorm.js`, `a11y.js` y el cargador de
`content/ova-u1.json`. Con un JSON de prueba de cuatro pantallas que solo usen
layouts ya construidos.

**Cierre:** se navega entre las cuatro pantallas, el progreso persiste al
recargar, el foco salta al encabezado de cada pantalla nueva y se anuncia el
cambio. Abierto desde `file://` funciona igual que servido.

**Esta es la tarea más delicada del proyecto.** Vale la pena hacerla despacio.

---

## T3 · Chrome del OVA

Barra superior con título y progreso, barra inferior de navegación, drawer de
índice, barra de progreso, skip link y landmarks, indicador de guardado y botón
de reanudar.

**Cierre:** recorrido completo con teclado desde el skip link hasta el último
control, sin trampas de foco en el drawer.

---

## T4 · Reproductor de media

Controles propios sobre `<video>`: play, tiempo, velocidad, subtítulos VTT,
panel de transcripción, pantalla completa. Un solo reproductor activo a la vez.
La caja es `aspect-ratio: 16/9` de ancho fluido.

**Cierre:** operable solo con teclado, subtítulos conmutables, transcripción
visible y descargable. Funciona dentro de un iframe con `allowfullscreen`.

---

## T5 · Componentes de contenido

Tarjeta de cápsula con sus tres estados, chip, callout, acordeón, modal, término
de glosario, tarjeta de recurso descargable, insignia, aviso de logro.

**Cierre:** todos en la kitchen sink con sus estados. El modal devuelve el foco
al elemento que lo abrió.

---

## T6 · Motor de evaluación

`quiz.js` con los tipos I01 a I08 y el bloque de retroalimentación I14. Banco de
preguntas, intentos configurables, reporte a SCORM vía `cmi.interactions`.

**Cierre:** las preguntas usan `fieldset` y `legend` reales, la retro se anuncia
por `aria-live`, y el estado correcto o incorrecto se lee sin ver el color.

---

## T7 · Datos y gráficos

Cifra destacada, tabla, variación sube y baja, gráfico de línea, de barras y de
distribución, diagrama de proceso. En SVG.

**Cierre:** cada gráfico tiene alternativa textual o tabla equivalente. La
variación lleva flecha, signo y color.

---

## T8 · Interacciones insignia

Cuatro sesiones separadas, no una. En este orden:

- **I10 calculadora paramétrica** — la más simple, sirve de patrón. Base de la
  cápsula 3, valorización y dividendo.
- **I11 boleta de compra** — precio de mercado contra precio límite. Base de C2.
- **I09 línea de tiempo** — Repo y TTV. Base de C1. Necesita alternativa de
  teclado al arrastre.
- **I12 distribución de capital** — portafolio. Base de C3, y la primera que se
  cae si el plan se atrasa.

**Cierre de cada una:** operable con teclado sin arrastrar, estado anunciado,
resultado reportado al motor de estado.

---

## T9 · Empaquetado y auditoría

`imsmanifest.xml`, script de empaquetado que genera el zip SCORM y la copia
standalone, prueba de carga en el Moodle de Pablo, auditoría WCAG completa y
correcciones.

**Cierre:** el paquete sube a Moodle, reporta avance y notas, y la copia
standalone funciona en URL directa sin errores en consola.

**Hacer esto el viernes 4, no el lunes 7.** Si el reporte SCORM falla, hay que
rehacer el wrapper y eso no cabe en un fin de semana.

---

## Cómo trabajar cada sesión

- Una tarea por sesión. No encadenar T5 y T6 en la misma conversación.
- Empezar cada sesión con la condición de cierre, no con la lista de archivos.
  «Quiero que la kitchen sink muestre X y que se recorra con teclado» produce
  mejor código que «crea estos cinco archivos».
- Terminar cada sesión actualizando la kitchen sink. Si no está ahí, no existe.
- Al final de cada sesión, pedir explícitamente la revisión de accesibilidad de
  lo que se acaba de construir. No confiar en que se hizo sola.
- Cuando algo del plan ya no encaje, cambiar `CLAUDE.md` en vez de explicarlo de
  nuevo en la siguiente sesión.

## Lo que bloquea a quién

- T1 bloquea absolutamente todo. Es lo primero.
- T2 bloquea T3 a T8.
- T9 depende de que Pablo tenga el Moodle en pie: coordinarlo desde ya.
- El contenido de Jose no bloquea nada hasta T8. Todo lo anterior se construye
  con relleno tomado del guion de BVC que ya está en `Recursos/`.
