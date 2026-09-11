# Locuciones y transcripciones — estructura E (actualizado 11 sep 2026)

Fuente única del texto hablado del OVA después de la reestructura
(`PLAN-ESTRUCTURA.md`). De aquí se copia a `media.transcripcion` (o a
`avatar.transcripcion`, o a `resultado.locucion.transcripcion` en el
diagnóstico) en `src/content/ova-u1.js`: **la transcripción no es un
archivo suelto, es contenido**, y tiene que existir aunque el audio
todavía no.

Reglas del texto: locución autosuficiente (nada de "como ves aquí" ni
"en esta lista"), sin marcas de tiempo al final, sin nombres de
entidades de un solo país.

## Nomenclatura de archivos (ajustes tanda 10)

Los audios **ya no se nombran por el id de la pantalla** sino con una
secuencia propia, `aNN-<slug>.mp3`, que es como Juan los entregó. Es a
propósito: el orden de las pantallas se movió dos veces (reestructura E)
y volvería a romper los nombres de archivo cada vez. La tabla de abajo
es el único punto donde se cruzan las dos numeraciones — si una pantalla
cambia de lugar, se corrige aquí y nada más.

"Pantalla N" es la posición en el recorrido de 26, la que ve el
estudiante en la barra inferior.

| Archivo | Pantalla | id | Dónde vive la transcripción | Componente |
|---|---|---|---|---|
| `a01-bienvenida.mp3` | 2 | `p01-bienvenida` | `avatar.transcripcion` | audio sin avatar (`variante: "sin-avatar"`) — el retrato de Claudia ya está en la otra columna |
| `a02-objetivos.mp3` | 5 | `p02` | `media.transcripcion` | avatar-lg |
| `a03-forma-de-ahorrar.mp3` | 6 | `p03` | `media.transcripcion` | avatar-md |
| `a04-punto-de-partida.mp3` | 7 | `p04` | `media.transcripcion` | avatar-md, centrado |
| `a05-diagnostico-resultado.mp3` | 8 | `p05-diagnostico` | `interaccion.datos.resultado.locucion` | avatar-sm, dentro de la vista de resultado |
| `a06-tutor.mp3` | 9 | `p10-tutor` | `avatar.transcripcion` | avatar-sm, en la columna de texto |
| `a07-capsulas.mp3` | 10 | `p11` | `avatar.transcripcion` | avatar-md, centrado al pie de las tarjetas |
| `a08-ideas-cierre.mp3` | 24 | `p32` | `media.transcripcion` | avatar-lg, segunda columna |

Los ocho archivos están en `public/audio/` y los ocho están cableados.
`demo-avatar.mp3` y `loc1_objetivos.mp3` quedaron sin uso en contenido:
se conservan como material de prueba de `dev/kitchen-sink.html`.

---

## a01 — Te damos la bienvenida (pantalla 2)

> Hola, soy Claudia. Antes de que empieces a invertir, quiero que
> entiendas bien dónde estás entrando: qué es un mercado de valores, qué
> derechos ganas al comprar una acción, y por qué ninguna decisión de
> inversión debería tomarse sin información, criterio y control del
> riesgo. Eso es justamente lo que vamos a construir juntos en esta
> primera unidad.
>
> Antes de avanzar, revisa las siguientes pantallas: ahí te cuento cómo
> está organizado el curso, qué herramientas de accesibilidad tienes
> disponibles y cómo sacarle el máximo provecho a tu tiempo. Son solo un
> par de minutos, y te van a ahorrar tiempo en todo lo que viene después.
>
> ¿Listo? Empecemos.

## a02 — Objetivos de aprendizaje (pantalla 5)

> En esta unidad construirás una base práctica. Primero ubicarás las
> acciones dentro del mercado de capitales. Luego aprenderás qué
> significa ser accionista, cómo se gana o se pierde dinero por precio y
> dividendos, y qué preguntas debes hacerte antes de invertir.

## a03 — Invertir empieza por cambiar la forma de ahorrar (pantalla 6)

> Invertir empieza por ordenar la forma de ahorrar. Según Global Findex,
> en dos mil veinticuatro solo cuatro de cada diez adultos en economías
> en desarrollo ahorraron en una cuenta financiera. Ese dato no
> significa que todos deban comprar acciones; significa que existe una
> oportunidad enorme para pasar de guardar dinero sin plan a construir
> hábitos financieros formales, con objetivos, información y control del
> riesgo.

## a04 — Antes de empezar: mide tu punto de partida (pantalla 7)

> Antes de entrar al contenido, responde una prueba diagnóstica. No
> busca calificarte. Su propósito es mostrarte qué tan familiarizado
> estás con conceptos como acción, dividendo, renta variable y tipos de
> acciones.

## a05 — Tu punto de partida (pantalla 8, al cerrar la batería)

> Tu resultado no te encasilla. Solo te ayuda a estudiar mejor. Si
> algunas respuestas no fueron correctas, perfecto: esta unidad está
> diseñada para explicar los conceptos desde cero y llevarlos a ejemplos
> prácticos.

## a06 — Conoce al tutor (pantalla 9)

> Quiero presentarles a quien les explicará los conceptos fundamentales
> de esta unidad.
>
> Él es Jose Mejía. Ha trabajado tanto del lado de los inversionistas
> como del lado de los mercados: en la Bolsa de Valores de Colombia, en
> el Autorregulador del Mercado de Valores, y actualmente como consultor
> de inversiones para el BID Invest. Cuenta además con experiencia
> académica, habiendo enseñado finanzas en programas de posgrado de
> distintas universidades.
>
> Con esa perspectiva, que combina la práctica del mercado con la
> claridad para explicarlo, Jose los guiará a través de los temas de
> esta unidad.

**Nota de neutralización.** Es la única locución que nombra entidades de
un solo país, y es deliberado: son los empleos reales del tutor, no un
ejemplo de mercado. Mismo criterio que la excepción ya validada de P33
(el mapa regional de nuam) en `ova_arquitectura`. El cuerpo de la
pantalla, tomado de la referencia de Juan, nombra además ANI, INVIAS,
Santander Asset Management y Repsol.

## a07 — Las cuatro cápsulas de la unidad (pantalla 10)

> La unidad se divide en cuatro cápsulas cortas. Cada una inicia con una
> idea central presentada por nuestro tutor, luego desarrolla un
> concepto aplicable y cierra con una interacción para que verifiques lo
> aprendido.

## a08 — Ideas clave de la unidad (pantalla 24)

> Llegaste al final de la primera unidad. Vale la pena recoger algunos
> aspectos de lo que has aprendido.
>
> Las acciones pertenecen a la renta variable: no generan una promesa de
> lo que vas a ganar. Esa es la diferencia de fondo con un producto de
> renta fija.
>
> Cuando compras una acción, compras una parte de una empresa. Es una
> fracción pequeña, pero es propiedad e incluye derechos económicos y
> políticos.
>
> En acciones el retorno puede generarse por dos caminos: vía
> valorización del precio, si la acción llega a valer más de lo que
> pagaste, y vía pago de dividendos, cuando la empresa reparte
> utilidades.
>
> No todas las acciones otorgan los mismos derechos: las ordinarias y
> las preferenciales dan derechos distintos, así que conviene saber cuál
> de ellas estás comprando.
>
> Y, finalmente, la idea que sostiene a las cuatro anteriores: invertir
> no empieza por elegir una acción. Empieza por tener claro tu objetivo,
> buscar información y reconocer cuánto riesgo estás dispuesto a asumir.
>
> Con esa base, lo que sigue deja de ser un salto al vacío.

**⚠️ Desfase abierto con la lista en pantalla.** La cuarta idea de esta
locución habla de **acciones ordinarias y preferenciales**; la cuarta
viñeta visible de `p32` habla de **perfiles conservador, moderado y
agresivo**. No es un descuido de transcripción: la viñeta se cambió a
"perfiles" justamente porque la reestructura E archivó las pantallas que
enseñaban ordinarias/preferenciales (era uno de los tres huecos de
coherencia que dejó abiertos `PLAN-ESTRUCTURA.md`), y el audio se grabó
después con el texto anterior. La transcripción se dejó **igual al
audio**, que es lo único que no se puede editar. Decidir: o se regraba
ese tramo, o se recupera del archivo la pantalla de tipos de acción, o
se acepta el desfase para el demo.

---

## Pantallas sin locución decidida

| Pantalla | id | Estado |
|---|---|---|
| 25 · Recursos para llevarte | `p34` | sin locución; no se pidió |
| 26 · Simula tu primera orden | `p42` | sin locución; decidir si lleva |

## Videos de cápsula (locución dentro del video, Jonás)

No llevan bloque de locución aquí, pero **sí transcripción**: el texto
hablado del video va igual en `media.transcripcion` de su pantalla.

| Pantalla | id | Archivo |
|---|---|---|
| 11 | `c1-video` | `public/videos/capsulas/c1-contexto-mercado.mp4` |
| 14 | `c2-video` | `public/videos/capsulas/c2-valorizacion.mp4` |
| 17 | `c3-video` | `public/videos/capsulas/c3-dividendo.mp4` |
| 20 | `c4-video` | `public/videos/capsulas/c4-perfil-riesgo.mp4` |
