# Storyboard Master v2 — Introducción a la inversión en acciones

**Fecha de versión:** 2026-09-03  
**Fuente canónica para producción IA/humana:** este archivo.  
**Alcance:** Unidad 1 completa + piezas insignia Repo, Orden y Portafolio.  
**Nota:** los ejemplos usan emisores ficticios y no constituyen recomendación de inversión.

## Objetivos de aprendizaje

- **OA1:** Diferenciar renta variable, renta fija y derivados en el contexto del mercado de capitales.
- **OA2:** Explicar qué es una acción y qué derechos puede otorgar al inversionista.
- **OA3:** Calcular valorización/desvalorización y dividendo por acción en casos sencillos.
- **OA4:** Comparar acciones ordinarias y preferenciales desde derechos políticos y económicos.
- **OA5:** Reconocer el perfil de riesgo orientativo y usarlo para reflexionar sobre decisiones de inversión.
- **OA6:** Comprender de forma introductoria repos, órdenes y portafolios como vista previa de unidades posteriores.

## Ficha maestra de emisores ficticios

| Emisor | Sector | Riesgo didáctico | Precio base | Supuestos | Uso |
|---|---|---:|---:|---|---|
| Petrocaribe | Energía | Alto | $1.000.00 | Sensible a precio de energía y volatilidad externa | Valorización. portafolio. orden simulada |
| Andina Cementos | Materiales e infraestructura | Medio | $1.500.00 | Ligada a construcción e inversión en infraestructura | Propiedad fraccionada. portafolio |
| Banco del Sur | Financiero | Medio-bajo | $1.200.00 | Negocio diversificado. menor volatilidad didáctica | Orden simulada. portafolio |

## Biblioteca de fuentes

| ID | Tipo | Nombre | Uso | URL / ubicación | Consulta |
|---|---|---|---|---|---|
| SRC-BRIEF-V2 | brief | BRIEF-DI-v2_nuam.md | Reglas de producción, QA, layout e interacciones | /mnt/data/BRIEF-DI-v2_nuam.md | 2026-09-03 |
| SRC-GUION-U1 | guion | Guion fuente, Unidad 1 | Conceptos base de renta variable, acción, valorización, dividendo, tipos de acciones y perfiles | /mnt/data/Guion_Curso  como invertir en acciones.docx | 2026-09-03 |
| SRC-GUION-U2 | guion | Guion fuente, Unidad 2 | Conceptos de mercado, repo, TTV e instituciones | /mnt/data/Guion_Curso  como invertir en acciones.docx | 2026-09-03 |
| SRC-GUION-U3 | guion | Guion fuente, Unidad 3 | Conceptos de orden de mercado, orden límite e intermediarios | /mnt/data/Guion_Curso  como invertir en acciones.docx | 2026-09-03 |
| SRC-NUAM | oficial | nuam — sitio institucional | Integración de las bolsas de Santiago, Colombia y Lima | https://www.nuam.com/ | 2026-09-03 |
| SRC-WB-FINDEX | autoridad | World Bank — Global Findex Database 2025 | Dato de ahorro formal en economías en desarrollo, 2024 | https://www.worldbank.org/en/publication/globalfindex | 2026-09-03 |
| SRC-SFC | oficial | Superintendencia Financiera de Colombia — acerca de la SFC | Supervisor del sistema financiero y mercado de valores colombiano | https://www.superfinanciera.gov.co/publicaciones/60607/nuestra-entidadacerca-de-la-sfc-60607/ | 2026-09-03 |
| SRC-SFC-BVC | oficial | SFC — Bolsa de Valores de Colombia | Bolsa autorizada en Colombia | https://www.superfinanciera.gov.co/publicaciones/10090664/bolsa-de-valores-de-colombia-10090664/ | 2026-09-03 |
| SRC-SFC-DECEVAL | oficial | SFC — Depósito Centralizado de Valores | Depósito Centralizado de Valores de Colombia — Deceval | https://www.superfinanciera.gov.co/publicaciones/10090681/deposito-centralizado-de-valores-10090681/ | 2026-09-03 |
| SRC-BVL-AGENTES | oficial | Bolsa de Valores de Lima — agentes | Sociedades agentes de bolsa como intermediarios bursátiles en Perú | https://www.bvl.com.pe/mercado/agentes | 2026-09-03 |
| SRC-BVL-CAVALI | oficial | Bolsa de Valores de Lima — CAVALI | CAVALI como registro, transferencia, custodia, compensación y liquidación de valores | https://www.bvl.com.pe/quienes-somos/quienes-somos-bvl/cavali | 2026-09-03 |
| SRC-SMV | oficial | Superintendencia del Mercado de Valores — Perú | Supervisor peruano del mercado de valores | https://www.smv.gob.pe/ | 2026-09-03 |
| SRC-CMF-ACCIONES | oficial | CMF Educa — fiscalización del mercado accionario | Fiscalización de oferta pública de acciones, mercados e intermediarios en Chile | https://www.cmfchile.cl/educa/602/w3-article-833.html | 2026-09-03 |
| SRC-CMF-INTERMED | oficial | CMF Educa — intermediarios de valores | Intermediarios inscritos en Registro de Corredores de Bolsa y Agentes de Valores | https://www.cmfchile.cl/educa/602/w3-article-585.html | 2026-09-03 |
| SRC-CMF-DCV | oficial | CMF — Depósito Central de Valores S.A. | Depósito Central de Valores S.A. como depósito de valores en Chile | https://www.cmfchile.cl/institucional/mercados/entidad.php?control=svs&mercado=V&tipoentidad=DCVAL&rut=96666140&vig=VI | 2026-09-03 |

## Pantallas


---

### P01 — Unidad 1: Mercado, bolsa y acciones

```yaml
id: P01
unidad_capsula: Unidad 1 / Apertura
proposito: Abrir la unidad y ubicar al estudiante en el propósito general.
objetivo: navegación
origen:
  - ADAPTADO
layout: L01
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 0
  total_seg: 16
  texto: audio 0:16 + interacción 0:00 = total 0:16
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P01

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Abrir la unidad y ubicar al estudiante en el propósito general.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L01

**TÍTULO EN PANTALLA:** Unidad 1: Mercado, bolsa y acciones

**TEXTO EN PANTALLA:**

Antetítulo: Introducción a la inversión en acciones
Entradilla: Aprende el contexto básico del mercado accionario, qué es una acción, cómo se generan valorización y dividendos, y qué perfil de riesgo debes reconocer antes de invertir.
Botón: Comenzar

**LOCUCIÓN:**

Te damos la bienvenida a la primera unidad. Antes de comprar una acción, necesitas entender el mercado en el que estás entrando, qué derechos obtienes y por qué toda inversión exige información, criterio y control del riesgo. [0:16]  
Palabras: 39; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:00 = total 0:16

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Abrir la unidad y ubicar al estudiante en el propósito general. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P02 — Objetivos de aprendizaje

```yaml
id: P02
unidad_capsula: Unidad 1 / Apertura
proposito: Presentar objetivos medibles de aprendizaje.
objetivo: navegación
origen:
  - NUEVO
layout: L04
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 18
  interaccion_seg: 0
  total_seg: 18
  texto: audio 0:18 + interacción 0:00 = total 0:18
recurso: motion
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P02

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Presentar objetivos medibles de aprendizaje.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L04

**TÍTULO EN PANTALLA:** Objetivos de aprendizaje

**TEXTO EN PANTALLA:**

Al finalizar esta unidad podrás:
1. Diferenciar renta variable, renta fija y derivados.
2. Explicar qué es una acción y qué derechos puede otorgar.
3. Calcular valorización y dividendo por acción en casos sencillos.
4. Comparar acciones ordinarias y preferenciales.
5. Reconocer tu punto de partida frente al riesgo.

**LOCUCIÓN:**

En esta unidad construirás una base práctica. Primero ubicarás las acciones dentro del mercado de capitales. Luego aprenderás qué significa ser accionista, cómo se gana o se pierde dinero por precio y dividendos, y qué preguntas debes hacerte antes de invertir. [0:18]  
Palabras: 43; duración estimada: 0:18.

**DURACIÓN DE EXPERIENCIA:** audio 0:18 + interacción 0:00 = total 0:18

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** Motion corto de 25–35 segundos; mostrar transición conceptual con números y etiquetas exactas del texto en pantalla.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P03 — Invertir empieza por cambiar la forma de ahorrar

```yaml
id: P03
unidad_capsula: Unidad 1 / Apertura
proposito: Activar interés con un dato verificable sobre ahorro formal.
objetivo: navegación
origen:
  - ADAPTADO
layout: L12
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
  - SRC-WB-FINDEX
duracion:
  audio_seg: 27
  interaccion_seg: 0
  total_seg: 27
  texto: audio 0:27 + interacción 0:00 = total 0:27
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P03

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Activar interés con un dato verificable sobre ahorro formal.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1, SRC-WB-FINDEX

**LAYOUT:** L12

**TÍTULO EN PANTALLA:** Invertir empieza por cambiar la forma de ahorrar

**TEXTO EN PANTALLA:**

En 2024, solo 40% de los adultos en economías en desarrollo ahorró en una cuenta financiera.
Atribución: World Bank Global Findex 2025.

**LOCUCIÓN:**

Invertir empieza por ordenar la forma de ahorrar. Según Global Findex, en dos mil veinticuatro solo cuatro de cada diez adultos en economías en desarrollo ahorraron en una cuenta financiera. Ese dato no significa que todos deban comprar acciones; significa que existe una oportunidad enorme para pasar de guardar dinero sin plan a construir hábitos financieros formales, con objetivos, información y control del riesgo. [0:27]  
Palabras: 66; duración estimada: 0:27.

**DURACIÓN DE EXPERIENCIA:** audio 0:27 + interacción 0:00 = total 0:27

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P04 — Antes de empezar: mide tu punto de partida

```yaml
id: P04
unidad_capsula: Unidad 1 / Apertura
proposito: Preparar la prueba diagnóstica sin ansiedad evaluativa.
objetivo: navegación
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 13
  interaccion_seg: 0
  total_seg: 13
  texto: audio 0:13 + interacción 0:00 = total 0:13
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P04

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Preparar la prueba diagnóstica sin ansiedad evaluativa.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Antes de empezar: mide tu punto de partida

**TEXTO EN PANTALLA:**

Responde cinco preguntas rápidas. No tienen nota; sirven para que identifiques qué conceptos ya conoces y cuáles debes reforzar durante la unidad.

**LOCUCIÓN:**

Antes de entrar al contenido, responde una prueba diagnóstica. No busca calificarte. Su propósito es mostrarte qué tan familiarizado estás con conceptos como acción, dividendo, renta variable y tipos de acciones. [0:13]  
Palabras: 33; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:00 = total 0:13

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Preparar la prueba diagnóstica sin ansiedad evaluativa. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P05 — Diagnóstico 1

```yaml
id: P05
unidad_capsula: Unidad 1 / Apertura
proposito: Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.
objetivo: diagnóstico
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 25
  total_seg: 39
  texto: audio 0:14 + interacción 0:25 = total 0:39
recurso: ninguno
interaccion: I01
dependencias:
  []
qa: OK
```

**ID:** P05

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Diagnóstico 1

**TEXTO EN PANTALLA:**

Una acción es un:

**LOCUCIÓN:**

Responde la primera pregunta. Una acción no es una promesa de pago como un bono. Es una participación mínima en una empresa, y por eso pertenece al mundo de los títulos participativos. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:25 = total 0:39

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I01

**PAYLOAD DE INTERACCIÓN:**

I01 | Enunciado: Una acción es un: | Opciones: A. Título participativo; B. Título de deuda; C. Cuenta de ahorro | Correcta: A | Retro correcta: Muy bien. Una acción representa una participación en la propiedad de una empresa. | Retro incorrecta: Recuerda que una acción no promete un interés fijo; representa una parte de una empresa.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P06 — Diagnóstico 2

```yaml
id: P06
unidad_capsula: Unidad 1 / Apertura
proposito: Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.
objetivo: diagnóstico
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 11
  interaccion_seg: 25
  total_seg: 36
  texto: audio 0:11 + interacción 0:25 = total 0:36
recurso: ninguno
interaccion: I02
dependencias:
  []
qa: OK
```

**ID:** P06

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Diagnóstico 2

**TEXTO EN PANTALLA:**

Una acción preferencial normalmente no otorga voto en asamblea.

**LOCUCIÓN:**

Piensa en la diferencia entre derechos políticos y económicos. Una acción preferencial suele fortalecer los derechos económicos, pero normalmente limita o elimina el voto en asamblea. [0:11]  
Palabras: 28; duración estimada: 0:11.

**DURACIÓN DE EXPERIENCIA:** audio 0:11 + interacción 0:25 = total 0:36

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I02

**PAYLOAD DE INTERACCIÓN:**

I02 | Afirmación: Una acción preferencial normalmente no otorga voto en asamblea. | Respuesta: Verdadero | Retro correcta: Correcto. La preferencial suele priorizar derechos económicos y no el voto. | Retro incorrecta: Recuerda: la preferencial suele sacrificar voto a cambio de preferencias económicas.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P07 — Diagnóstico 3

```yaml
id: P07
unidad_capsula: Unidad 1 / Apertura
proposito: Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.
objetivo: diagnóstico
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 25
  total_seg: 40
  texto: audio 0:15 + interacción 0:25 = total 0:40
recurso: ninguno
interaccion: I01
dependencias:
  []
qa: OK
```

**ID:** P07

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Diagnóstico 3

**TEXTO EN PANTALLA:**

¿Cuál es la principal diferencia entre renta fija y renta variable?

**LOCUCIÓN:**

La tercera pregunta contrasta dos formas de invertir. En renta fija la rentabilidad pactada suele conocerse desde el inicio. En renta variable, el resultado depende del precio de venta y de los dividendos recibidos. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:25 = total 0:40

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I01

**PAYLOAD DE INTERACCIÓN:**

I01 | Opciones: A. La renta fija siempre gana más; B. En renta fija se conoce la rentabilidad pactada desde el inicio; C. La renta variable no tiene riesgo | Correcta: B | Retro correcta: Excelente. En renta variable no sabes de antemano cuánto ganarás o perderás. | Retro incorrecta: La clave es la certeza inicial: renta fija pacta condiciones; renta variable depende del mercado.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P08 — Diagnóstico 4

```yaml
id: P08
unidad_capsula: Unidad 1 / Apertura
proposito: Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.
objetivo: diagnóstico
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 11
  interaccion_seg: 25
  total_seg: 36
  texto: audio 0:11 + interacción 0:25 = total 0:36
recurso: ninguno
interaccion: I02
dependencias:
  []
qa: OK
```

**ID:** P08

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Diagnóstico 4

**TEXTO EN PANTALLA:**

Un dividendo permite recibir una porción de las utilidades distribuidas por la empresa.

**LOCUCIÓN:**

Esta pregunta revisa un derecho económico básico. El dividendo existe cuando la empresa obtiene utilidades y el órgano correspondiente decide repartir una parte entre los accionistas. [0:11]  
Palabras: 28; duración estimada: 0:11.

**DURACIÓN DE EXPERIENCIA:** audio 0:11 + interacción 0:25 = total 0:36

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I02

**PAYLOAD DE INTERACCIÓN:**

I02 | Afirmación: Un dividendo permite recibir una porción de las utilidades distribuidas por la empresa. | Respuesta: Verdadero | Retro correcta: Muy bien. El dividendo proviene de utilidades distribuidas. | Retro incorrecta: Recuerda que el dividendo es un pago al accionista cuando la empresa decide repartir utilidades.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P09 — Diagnóstico 5

```yaml
id: P09
unidad_capsula: Unidad 1 / Apertura
proposito: Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.
objetivo: diagnóstico
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 13
  interaccion_seg: 25
  total_seg: 38
  texto: audio 0:13 + interacción 0:25 = total 0:38
recurso: ninguno
interaccion: I01
dependencias:
  []
qa: OK
```

**ID:** P09

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Diagnosticar conocimientos previos sobre conceptos que se enseñarán en la unidad.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Diagnóstico 5

**TEXTO EN PANTALLA:**

Para comprar acciones necesitas hacerlo mediante un intermediario o una plataforma autorizada.

**LOCUCIÓN:**

La última pregunta te recuerda que el acceso al mercado no ocurre de manera informal. Las órdenes se canalizan por entidades o plataformas autorizadas según las reglas de cada mercado. [0:13]  
Palabras: 32; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:25 = total 0:38

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I01

**PAYLOAD DE INTERACCIÓN:**

I01 | Opciones: A. Verdadero; B. Falso; C. Solo si inviertes grandes montos | Correcta: A | Retro correcta: Correcto. Debes usar una entidad o plataforma autorizada. | Retro incorrecta: No se compra directamente “por fuera” del mercado; se usan intermediarios autorizados.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P10 — Tu punto de partida

```yaml
id: P10
unidad_capsula: Unidad 1 / Apertura
proposito: Interpretar el resultado diagnóstico como punto de partida.
objetivo: diagnóstico
origen:
  - NUEVO
layout: L08
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 0
  total_seg: 14
  texto: audio 0:14 + interacción 0:00 = total 0:14
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P10

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Interpretar el resultado diagnóstico como punto de partida.

**OBJETIVO DE APRENDIZAJE:** diagnóstico

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L08

**TÍTULO EN PANTALLA:** Tu punto de partida

**TEXTO EN PANTALLA:**

Si acertaste 0-2: empieza con calma y toma nota de los conceptos base.
Si acertaste 3-4: tienes una buena base inicial.
Si acertaste 5: aprovecha la unidad para ordenar y aplicar lo que ya sabes.

**LOCUCIÓN:**

Tu resultado no te encasilla. Solo te ayuda a estudiar mejor. Si algunas respuestas no fueron correctas, perfecto: esta unidad está diseñada para explicar los conceptos desde cero y llevarlos a ejemplos prácticos. [0:14]  
Palabras: 35; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:00 = total 0:14

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Interpretar el resultado diagnóstico como punto de partida. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P11 — Las cuatro cápsulas de la unidad

```yaml
id: P11
unidad_capsula: Unidad 1 / Apertura
proposito: Mostrar la ruta de microlearning de la unidad.
objetivo: navegación
origen:
  - NUEVO
layout: L05
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 0
  total_seg: 14
  texto: audio 0:14 + interacción 0:00 = total 0:14
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P11

**UNIDAD / CÁPSULA:** Unidad 1 / Apertura

**PROPÓSITO DE LA PANTALLA:** Mostrar la ruta de microlearning de la unidad.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L05

**TÍTULO EN PANTALLA:** Las cuatro cápsulas de la unidad

**TEXTO EN PANTALLA:**

1. ¿En qué mercado estás entrando?
2. Qué es una acción
3. Valorización y dividendo
4. Ordinarias, preferenciales y tu perfil

**LOCUCIÓN:**

La unidad se divide en cuatro cápsulas cortas. Cada una inicia con una idea central, desarrolla un concepto aplicable y cierra con una interacción para que verifiques si puedes usar lo aprendido. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:00 = total 0:14

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P12 — Cápsula 1: ¿En qué mercado estás entrando?

```yaml
id: P12
unidad_capsula: Unidad 1 / Cápsula 1
proposito: Abrir la cápsula 1 y presentar el mapa conceptual del mercado.
objetivo: OA1
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P12

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 1

**PROPÓSITO DE LA PANTALLA:** Abrir la cápsula 1 y presentar el mapa conceptual del mercado.

**OBJETIVO DE APRENDIZAJE:** OA1

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Cápsula 1: ¿En qué mercado estás entrando?

**TEXTO EN PANTALLA:**

Primero ubicaremos las acciones dentro del mercado de capitales y diferenciaremos tres grandes familias: renta variable, renta fija y derivados.

**LOCUCIÓN:**

Antes de hablar de acciones, necesitas ver el mapa general. En el mercado de capitales se negocian instrumentos que conectan a quienes necesitan financiación con quienes buscan invertir. Las acciones hacen parte de la renta variable. [0:15]  
Palabras: 38; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Abrir la cápsula 1 y presentar el mapa conceptual del mercado. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P13 — Tres familias del mercado

```yaml
id: P13
unidad_capsula: Unidad 1 / Cápsula 1
proposito: Comparar tres familias de instrumentos financieros.
objetivo: OA1
origen:
  - ADAPTADO
layout: L05
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 35
  total_seg: 51
  texto: audio 0:16 + interacción 0:35 = total 0:51
recurso: motion
interaccion: I07
dependencias:
  []
qa: OK
```

**ID:** P13

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 1

**PROPÓSITO DE LA PANTALLA:** Comparar tres familias de instrumentos financieros.

**OBJETIVO DE APRENDIZAJE:** OA1

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L05

**TÍTULO EN PANTALLA:** Tres familias del mercado

**TEXTO EN PANTALLA:**

Renta variable: resultado no garantizado; depende del precio y dividendos.
Renta fija: condiciones de pago pactadas desde el inicio.
Derivados: contratos cuyo valor depende de otro activo.

**LOCUCIÓN:**

La renta variable no ofrece una ganancia asegurada. La renta fija suele pactar condiciones desde el inicio. Los derivados son contratos más especializados cuyo valor depende de otro activo, como una acción, una moneda o una tasa. [0:16]  
Palabras: 39; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:35 = total 0:51

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** Motion corto de 25–35 segundos; mostrar transición conceptual con números y etiquetas exactas del texto en pantalla.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente; navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I07

**PAYLOAD DE INTERACCIÓN:**

I07 | Tarjetas: Renta variable / Resultado no garantizado; Renta fija / Pagos o condiciones pactadas; Derivados / Contratos sobre otro activo | Retro general: Bien. Las acciones pertenecen a renta variable porque su rentabilidad no se conoce al comprar.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P14 — Dónde encaja la inversión en acciones

```yaml
id: P14
unidad_capsula: Unidad 1 / Cápsula 1
proposito: Ubicar las acciones dentro de la renta variable.
objetivo: OA1
origen:
  - ADAPTADO
layout: L03
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 0
  total_seg: 16
  texto: audio 0:16 + interacción 0:00 = total 0:16
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P14

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 1

**PROPÓSITO DE LA PANTALLA:** Ubicar las acciones dentro de la renta variable.

**OBJETIVO DE APRENDIZAJE:** OA1

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L03

**TÍTULO EN PANTALLA:** Dónde encaja la inversión en acciones

**TEXTO EN PANTALLA:**

Las acciones son el instrumento característico de la renta variable. Puedes ganar por valorización o dividendos, pero también puedes perder si el precio baja o si la empresa no distribuye utilidades.

**LOCUCIÓN:**

Invertir en acciones significa aceptar incertidumbre. Puedes beneficiarte si el precio sube o si la empresa distribuye dividendos, pero también puedes perder si el precio baja o si las condiciones de la empresa o del mercado se deterioran. [0:16]  
Palabras: 40; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:00 = total 0:16

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P15 — Comprobación cápsula 1

```yaml
id: P15
unidad_capsula: Unidad 1 / Cápsula 1
proposito: Comprobar la diferencia clave de renta variable.
objetivo: OA1
origen:
  - NUEVO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 25
  total_seg: 39
  texto: audio 0:14 + interacción 0:25 = total 0:39
recurso: ninguno
interaccion: I01
dependencias:
  []
qa: OK
```

**ID:** P15

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 1

**PROPÓSITO DE LA PANTALLA:** Comprobar la diferencia clave de renta variable.

**OBJETIVO DE APRENDIZAJE:** OA1

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Comprobación cápsula 1

**TEXTO EN PANTALLA:**

¿Por qué las acciones pertenecen a renta variable?

**LOCUCIÓN:**

Cerramos la primera cápsula con una idea esencial: una acción no promete una rentabilidad fija. Su resultado depende del mercado, de la empresa y de la decisión de comprar, mantener o vender. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:25 = total 0:39

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I01

**PAYLOAD DE INTERACCIÓN:**

I01 | Opciones: A. Porque su precio y dividendos no están garantizados; B. Porque siempre pagan interés fijo; C. Porque solo se compran a corto plazo | Correcta: A | Retro correcta: Correcto. La rentabilidad de una acción se conoce realmente al vender y sumar dividendos recibidos. | Retro incorrecta: Recuerda: en acciones no hay interés fijo ni ganancia garantizada.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P16 — Cápsula 2: Qué es una acción

```yaml
id: P16
unidad_capsula: Unidad 1 / Cápsula 2
proposito: Abrir la cápsula 2 y conectar acción con propiedad.
objetivo: OA2
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 0
  total_seg: 14
  texto: audio 0:14 + interacción 0:00 = total 0:14
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P16

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 2

**PROPÓSITO DE LA PANTALLA:** Abrir la cápsula 2 y conectar acción con propiedad.

**OBJETIVO DE APRENDIZAJE:** OA2

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Cápsula 2: Qué es una acción

**TEXTO EN PANTALLA:**

Ahora veremos por qué una acción te convierte en propietario de una fracción de una empresa y qué implica ser accionista.

**LOCUCIÓN:**

Una acción es un título participativo. Cuando compras una acción, compras una fracción muy pequeña de una empresa emisora. Esa participación puede darte derechos económicos y, según el tipo de acción, derechos políticos. [0:14]  
Palabras: 35; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:00 = total 0:14

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Abrir la cápsula 2 y conectar acción con propiedad. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P17 — Propiedad fraccionada

```yaml
id: P17
unidad_capsula: Unidad 1 / Cápsula 2
proposito: Explicar propiedad fraccionada mediante un ejemplo ficticio.
objetivo: OA2
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: motion
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P17

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 2

**PROPÓSITO DE LA PANTALLA:** Explicar propiedad fraccionada mediante un ejemplo ficticio.

**OBJETIVO DE APRENDIZAJE:** OA2

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Propiedad fraccionada

**TEXTO EN PANTALLA:**

Ejemplo: si Andina Cementos emite 1.000.000 de acciones y tú compras 100, tienes una participación pequeña, pero real, en la compañía.

**LOCUCIÓN:**

Imagina que Andina Cementos está dividida en un millón de partes iguales llamadas acciones. Si compras cien, tu participación es pequeña, pero existe. Esa propiedad fraccionada es la base de los derechos del accionista. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** Motion corto de 25–35 segundos; mostrar transición conceptual con números y etiquetas exactas del texto en pantalla.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P18 — Tres ventajas de ser accionista

```yaml
id: P18
unidad_capsula: Unidad 1 / Cápsula 2
proposito: Sintetizar beneficios y riesgos asociados a ser accionista.
objetivo: OA2
origen:
  - ADAPTADO
layout: L05
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 17
  interaccion_seg: 0
  total_seg: 17
  texto: audio 0:17 + interacción 0:00 = total 0:17
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P18

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 2

**PROPÓSITO DE LA PANTALLA:** Sintetizar beneficios y riesgos asociados a ser accionista.

**OBJETIVO DE APRENDIZAJE:** OA2

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L05

**TÍTULO EN PANTALLA:** Tres ventajas de ser accionista

**TEXTO EN PANTALLA:**

1. Participar en valorizaciones si el precio sube.
2. Recibir dividendos cuando se reparten utilidades.
3. Acceder a derechos políticos en ciertos tipos de acciones.

**LOCUCIÓN:**

Ser accionista puede darte tres beneficios. El primero es la valorización si vendes a un precio mayor. El segundo es el dividendo cuando se reparten utilidades. El tercero, en acciones con voto, es participar en ciertas decisiones de la empresa. [0:17]  
Palabras: 42; duración estimada: 0:17.

**DURACIÓN DE EXPERIENCIA:** audio 0:17 + interacción 0:00 = total 0:17

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P19 — Comprobación cápsula 2

```yaml
id: P19
unidad_capsula: Unidad 1 / Cápsula 2
proposito: Desmontar la idea de que el dividendo es garantizado.
objetivo: OA2
origen:
  - NUEVO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 25
  total_seg: 39
  texto: audio 0:14 + interacción 0:25 = total 0:39
recurso: ninguno
interaccion: I02
dependencias:
  []
qa: OK
```

**ID:** P19

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 2

**PROPÓSITO DE LA PANTALLA:** Desmontar la idea de que el dividendo es garantizado.

**OBJETIVO DE APRENDIZAJE:** OA2

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Comprobación cápsula 2

**TEXTO EN PANTALLA:**

Comprar una acción equivale a prestar dinero a una empresa con interés fijo.

**LOCUCIÓN:**

Esta afirmación ayuda a separar acciones de deuda. En una acción no eres acreedor con interés fijo; eres propietario de una fracción y asumes el riesgo de la empresa y del mercado. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:25 = total 0:39

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I02

**PAYLOAD DE INTERACCIÓN:**

I02 | Afirmación: Comprar una acción equivale a prestar dinero a una empresa con interés fijo. | Respuesta: Falso | Retro correcta: Correcto. La acción es participación, no deuda con interés fijo. | Retro incorrecta: Recuerda: una acción te vuelve accionista; un bono se parece más a un préstamo.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P20 — Cápsula 3: Valorización y dividendo

```yaml
id: P20
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Abrir la cápsula 3 y preparar los cálculos prácticos.
objetivo: OA3
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P20

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Abrir la cápsula 3 y preparar los cálculos prácticos.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Cápsula 3: Valorización y dividendo

**TEXTO EN PANTALLA:**

Esta cápsula explica las dos fuentes básicas de retorno en acciones: vender a mayor precio y recibir parte de utilidades distribuidas.

**LOCUCIÓN:**

Ahora entraremos a la pieza más práctica de la unidad. Aprenderás a calcular una valorización simple y un dividendo por acción. Estos cálculos no predicen el futuro, pero ayudan a entender de dónde viene la rentabilidad. [0:15]  
Palabras: 38; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Abrir la cápsula 3 y preparar los cálculos prácticos. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P21 — El caso Petrocaribe: de $1.000 a $1.500

```yaml
id: P21
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Mostrar valorización y desvalorización con el caso Petrocaribe.
objetivo: OA3
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: motion
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P21

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Mostrar valorización y desvalorización con el caso Petrocaribe.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** El caso Petrocaribe: de $1.000 a $1.500

**TEXTO EN PANTALLA:**

Compras 500 acciones de Petrocaribe a $1.000 cada una. Ocho meses después, el precio sube a $1.500. La diferencia por acción es $500 y la valorización es 50%.

**LOCUCIÓN:**

Supongamos que compras acciones de Petrocaribe a mil pesos cada una. Más adelante, el precio sube a mil quinientos. La diferencia es quinientos por acción. Al dividir quinientos entre mil, la valorización es cincuenta por ciento. [0:15]  
Palabras: 38; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** MOTION 0:40: escena 1 compra 500 acciones Petrocaribe a $1.000; escena 2 precio sube a $1.500; escena 3 fórmula 50%; escena 4 precio baja a $800 y resultado -20%.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P22 — Calcula tú la valorización

```yaml
id: P22
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Practicar el cálculo de valorización/desvalorización.
objetivo: OA3
origen:
  - NUEVO
layout: L06
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 45
  total_seg: 59
  texto: audio 0:14 + interacción 0:45 = total 0:59
recurso: ninguno
interaccion: I10
dependencias:
  []
qa: OK
```

**ID:** P22

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Practicar el cálculo de valorización/desvalorización.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** Calcula tú la valorización

**TEXTO EN PANTALLA:**

Mueve el precio de compra y el precio de venta para ver cómo cambia la valorización.

**LOCUCIÓN:**

Ahora practica el cálculo. La fórmula es precio de venta menos precio de compra, dividido entre el precio de compra. Si el resultado es positivo, hay valorización. Si es negativo, hay desvalorización. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:45 = total 0:59

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I10

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I10 Calculadora paramétrica",
  "variables": [
    {
      "id": "precio_compra",
      "nombre": "Precio de compra",
      "unidad": "$",
      "min": 1,
      "max": 10000,
      "paso": 10,
      "inicial": 1000,
      "decimales": 0
    },
    {
      "id": "precio_venta",
      "nombre": "Precio de venta",
      "unidad": "$",
      "min": 1,
      "max": 10000,
      "paso": 10,
      "inicial": 1500,
      "decimales": 0
    },
    {
      "id": "acciones",
      "nombre": "Número de acciones",
      "unidad": "acciones",
      "min": 1,
      "max": 10000,
      "paso": 1,
      "inicial": 500,
      "decimales": 0
    }
  ],
  "formula": "Variación % = (Precio venta - Precio compra) / Precio compra; Resultado = (Precio venta - Precio compra) × Número de acciones",
  "resultados": [
    "Monto invertido",
    "Diferencia por acción",
    "Variación porcentual",
    "Ganancia/pérdida por precio",
    "Monto final bruto"
  ],
  "validaciones": [
    "precio_compra > 0",
    "precio_venta > 0",
    "acciones > 0",
    "no permitir división por cero"
  ],
  "mensajes": {
    "positivo": "La acción se valorizó en el periodo del ejercicio.",
    "cero": "El precio no cambió; no hay ganancia ni pérdida por precio.",
    "negativo": "La acción se desvalorizó; el resultado por precio es negativo."
  },
  "casos_prueba": [
    {
      "input": "1000,1500,500",
      "resultado": "50%; $250.000"
    },
    {
      "input": "1000,800,500",
      "resultado": "-20%; -$100.000"
    },
    {
      "input": "1000,1000,500",
      "resultado": "0%; $0"
    }
  ]
}
```

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P23 — El dividendo: reparto de utilidades

```yaml
id: P23
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Explicar cómo se calcula y decide un dividendo.
objetivo: OA3
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 0
  total_seg: 16
  texto: audio 0:16 + interacción 0:00 = total 0:16
recurso: motion
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P23

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Explicar cómo se calcula y decide un dividendo.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** El dividendo: reparto de utilidades

**TEXTO EN PANTALLA:**

Banco del Sur genera utilidades. La asamblea decide qué porcentaje se reparte. El dividendo por acción se calcula dividiendo el monto a repartir entre el número de acciones.

**LOCUCIÓN:**

El dividendo depende de utilidades y de la decisión de repartirlas. Si una empresa gana dinero, puede distribuir una parte entre sus accionistas. Pero también puede decidir repartir menos o no repartir, por ejemplo para fortalecer la operación. [0:16]  
Palabras: 40; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:00 = total 0:16

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** MOTION 0:35: empresa genera utilidad; asamblea define porcentaje; monto a repartir se divide entre acciones; estudiante recibe según acciones que posee.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P24 — Calcula el dividendo por acción

```yaml
id: P24
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Practicar el cálculo de dividendo por acción.
objetivo: OA3
origen:
  - NUEVO
layout: L06
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 13
  interaccion_seg: 45
  total_seg: 58
  texto: audio 0:13 + interacción 0:45 = total 0:58
recurso: ninguno
interaccion: I10
dependencias:
  []
qa: OK
```

**ID:** P24

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Practicar el cálculo de dividendo por acción.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** Calcula el dividendo por acción

**TEXTO EN PANTALLA:**

Ajusta utilidad neta, porcentaje a repartir y número de acciones. Observa el dividendo estimado por acción.

**LOCUCIÓN:**

Practica el segundo cálculo. Primero multiplicas la utilidad neta por el porcentaje que se repartirá. Luego divides ese monto entre el número de acciones. Así obtienes el dividendo por acción. [0:13]  
Palabras: 32; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:45 = total 0:58

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I10

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I10 Calculadora paramétrica",
  "variables": [
    {
      "id": "utilidad_neta",
      "nombre": "Utilidad neta",
      "unidad": "$",
      "min": 0,
      "max": 1000000000,
      "paso": 100000,
      "inicial": 20000000,
      "decimales": 0
    },
    {
      "id": "porcentaje_repartir",
      "nombre": "Porcentaje a repartir",
      "unidad": "%",
      "min": 0,
      "max": 100,
      "paso": 1,
      "inicial": 50,
      "decimales": 0
    },
    {
      "id": "acciones_totales",
      "nombre": "Acciones totales",
      "unidad": "acciones",
      "min": 1,
      "max": 10000000,
      "paso": 1,
      "inicial": 1500,
      "decimales": 0
    },
    {
      "id": "acciones_estudiante",
      "nombre": "Acciones que posees",
      "unidad": "acciones",
      "min": 0,
      "max": 1000000,
      "paso": 1,
      "inicial": 100,
      "decimales": 0
    }
  ],
  "formula": "Monto a repartir = Utilidad neta × % a repartir; Dividendo por acción = Monto a repartir / Número total de acciones; Dividendo del estudiante = Dividendo por acción × Acciones que posee",
  "resultados": [
    "Monto a repartir",
    "Dividendo por acción",
    "Dividendo estimado del estudiante"
  ],
  "validaciones": [
    "acciones_totales > 0",
    "0 <= porcentaje_repartir <= 100",
    "acciones_estudiante >= 0"
  ],
  "mensajes": {
    "positivo": "El ejercicio genera dividendo estimado.",
    "cero": "No hay dividendo si la utilidad o el porcentaje a repartir es cero.",
    "negativo": "No aplica; los inputs válidos no deben producir dividendos negativos."
  },
  "casos_prueba": [
    {
      "input": "20.000.000,50%,1.500,100",
      "resultado": "$6.666,67 por acción; $666.666,67"
    },
    {
      "input": "5.000.000,0%,1.500,100",
      "resultado": "$0"
    },
    {
      "input": "40.000.000,30%,3.600,100",
      "resultado": "$3.333,33 por acción; $333.333,33"
    }
  ]
}
```

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P25 — Comprobación cápsula 3

```yaml
id: P25
unidad_capsula: Unidad 1 / Cápsula 3
proposito: Comprobar la comprensión integrada de valorización y dividendos.
objetivo: OA3
origen:
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 12
  interaccion_seg: 25
  total_seg: 37
  texto: audio 0:12 + interacción 0:25 = total 0:37
recurso: ninguno
interaccion: I01
dependencias:
  []
qa: OK
```

**ID:** P25

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 3

**PROPÓSITO DE LA PANTALLA:** Comprobar la comprensión integrada de valorización y dividendos.

**OBJETIVO DE APRENDIZAJE:** OA3

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Comprobación cápsula 3

**TEXTO EN PANTALLA:**

Andina Cementos reparte $12.000.000 entre 3.000 acciones. ¿Cuál es el dividendo por acción?

**LOCUCIÓN:**

Para resolver, divide el monto total a repartir entre el número de acciones. Este cálculo permite estimar cuánto recibiría cada acción antes de considerar costos o impuestos aplicables. [0:12]  
Palabras: 30; duración estimada: 0:12.

**DURACIÓN DE EXPERIENCIA:** audio 0:12 + interacción 0:25 = total 0:37

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I01

**PAYLOAD DE INTERACCIÓN:**

I01 | Opciones: A. $4.000; B. $3.000; C. $36.000; D. $400 | Correcta: A | Retro correcta: Correcto. $12.000.000 dividido entre 3.000 acciones da $4.000 por acción. | Retro incorrecta: Revisa la fórmula: monto a repartir / número de acciones = dividendo por acción.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P26 — Cápsula 4: Tipos de acciones y perfil

```yaml
id: P26
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Abrir la cápsula 4 y vincular derechos con decisión de inversión.
objetivo: OA4
origen:
  - ADAPTADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P26

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Abrir la cápsula 4 y vincular derechos con decisión de inversión.

**OBJETIVO DE APRENDIZAJE:** OA4

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Cápsula 4: Tipos de acciones y perfil

**TEXTO EN PANTALLA:**

Ahora conectaremos los derechos de las acciones con tu perfil de riesgo y tus objetivos de inversión.

**LOCUCIÓN:**

No todas las acciones otorgan exactamente los mismos derechos. Además, no todos los inversionistas toleran el riesgo de la misma manera. Por eso, antes de invertir debes conocer el instrumento y conocerte como inversionista. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Abrir la cápsula 4 y vincular derechos con decisión de inversión. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P27 — Derechos políticos y económicos

```yaml
id: P27
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Distinguir derechos políticos y económicos.
objetivo: OA4
origen:
  - ADAPTADO
layout: L03
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P27

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Distinguir derechos políticos y económicos.

**OBJETIVO DE APRENDIZAJE:** OA4

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L03

**TÍTULO EN PANTALLA:** Derechos políticos y económicos

**TEXTO EN PANTALLA:**

Derechos políticos: participación y voto cuando aplica.
Derechos económicos: dividendos y beneficios patrimoniales cuando se generan y aprueban.

**LOCUCIÓN:**

Los derechos políticos se relacionan con participar en decisiones, como votar en asamblea cuando el tipo de acción lo permite. Los derechos económicos se relacionan con recibir dividendos u otros beneficios patrimoniales cuando correspondan. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P28 — Ordinarias frente a preferenciales

```yaml
id: P28
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Comparar acciones ordinarias y preferenciales.
objetivo: OA4
origen:
  - ADAPTADO
layout: L05
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 35
  total_seg: 51
  texto: audio 0:16 + interacción 0:35 = total 0:51
recurso: ninguno
interaccion: I08
dependencias:
  []
qa: OK
```

**ID:** P28

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Comparar acciones ordinarias y preferenciales.

**OBJETIVO DE APRENDIZAJE:** OA4

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L05

**TÍTULO EN PANTALLA:** Ordinarias frente a preferenciales

**TEXTO EN PANTALLA:**

Ordinarias: suelen incluir voto y participación en dividendos.
Preferenciales: suelen priorizar derechos económicos y limitar el voto.
Ambas pueden comprarse y venderse en el mercado si están listadas.

**LOCUCIÓN:**

Las acciones ordinarias suelen dar voto y derechos económicos. Las preferenciales suelen fortalecer el derecho económico, por ejemplo con prioridad o dividendo mínimo, a cambio de limitar el voto. La decisión depende de lo que valores como inversionista. [0:16]  
Palabras: 40; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:35 = total 0:51

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I08

**PAYLOAD DE INTERACCIÓN:**

I08 | Columnas: Acciones ordinarias / Acciones preferenciales | Filas: Voto: normalmente sí / normalmente no; Dividendos: proporcionales / preferencia económica; Prioridad en liquidación: menor / mayor después de acreedores; Enfoque: participación / ingreso preferente

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P29 — Los tres perfiles de riesgo

```yaml
id: P29
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Presentar tres perfiles orientativos de riesgo.
objetivo: OA5
origen:
  - ADAPTADO
layout: L05
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P29

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Presentar tres perfiles orientativos de riesgo.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L05

**TÍTULO EN PANTALLA:** Los tres perfiles de riesgo

**TEXTO EN PANTALLA:**

Conservador: prioriza preservar capital y liquidez.
Moderado: acepta fluctuaciones razonables y diversifica.
Agresivo: tolera mayor volatilidad por potencial de retorno.
Nota: es un perfil orientativo, no regulatorio.

**LOCUCIÓN:**

El perfil de riesgo no es una etiqueta fija. Es una guía para alinear decisiones con tu tolerancia a pérdidas, horizonte de inversión, necesidad de liquidez y objetivos. Conocerlo ayuda a evitar decisiones impulsivas. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P30 — ¿Cuál es tu perfil?

```yaml
id: P30
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Capturar el perfil de riesgo orientativo del estudiante.
objetivo: OA5
origen:
  - NUEVO
layout: L06
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 14
  interaccion_seg: 70
  total_seg: 84
  texto: audio 0:14 + interacción 1:10 = total 1:24
recurso: ninguno
interaccion: I13
dependencias:
  - genera perfil_riesgo = conservador | moderado | agresivo
qa: OK
```

**ID:** P30

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Capturar el perfil de riesgo orientativo del estudiante.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** ¿Cuál es tu perfil?

**TEXTO EN PANTALLA:**

Responde cuatro preguntas. El resultado se usará luego para retroalimentar decisiones de portafolio.

**LOCUCIÓN:**

Completa este perfilamiento inicial. No sustituye asesoría profesional ni el perfilamiento formal de una entidad autorizada, pero te ayuda a pensar en cuatro variables: horizonte, reacción ante pérdidas, objetivo y necesidad de liquidez. [0:14]  
Palabras: 35; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 1:10 = total 1:24

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I13

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I13 Test de perfil con resultado",
  "variable": "perfil_riesgo",
  "preguntas": [
    {
      "q": "Si tu inversión baja 10% en un mes, ¿qué harías?",
      "opciones": [
        {
          "t": "Vender para evitar más pérdida",
          "p": 1
        },
        {
          "t": "Revisar y esperar si el objetivo sigue vigente",
          "p": 2
        },
        {
          "t": "Comprar más si el análisis lo justifica",
          "p": 3
        }
      ]
    },
    {
      "q": "¿Cuál es tu horizonte principal?",
      "opciones": [
        {
          "t": "Menos de un año",
          "p": 1
        },
        {
          "t": "Entre uno y tres años",
          "p": 2
        },
        {
          "t": "Más de tres años",
          "p": 3
        }
      ]
    },
    {
      "q": "¿Qué tan importante es tener liquidez inmediata?",
      "opciones": [
        {
          "t": "Muy importante",
          "p": 1
        },
        {
          "t": "Medianamente importante",
          "p": 2
        },
        {
          "t": "Poco importante para este capital",
          "p": 3
        }
      ]
    },
    {
      "q": "¿Qué prefieres al invertir?",
      "opciones": [
        {
          "t": "Preservar capital",
          "p": 1
        },
        {
          "t": "Equilibrar riesgo y retorno",
          "p": 2
        },
        {
          "t": "Buscar mayor retorno aceptando volatilidad",
          "p": 3
        }
      ]
    }
  ],
  "formula": "Suma de puntos. 4–6 conservador; 7–9 moderado; 10–12 agresivo.",
  "perfiles": {
    "conservador": "Prioriza preservar capital y reducir pérdidas; debe cuidar concentración y liquidez.",
    "moderado": "Acepta fluctuaciones razonables y busca equilibrio entre crecimiento y control de riesgo.",
    "agresivo": "Tolera mayor volatilidad por potencial de retorno, pero necesita análisis y límites de concentración."
  },
  "aviso": "Resultado orientativo y educativo; no reemplaza el perfilamiento formal de un intermediario."
}
```

**DEPENDENCIAS / VARIABLES:** genera perfil_riesgo = conservador | moderado | agresivo

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P31 — Tu resultado

```yaml
id: P31
unidad_capsula: Unidad 1 / Cápsula 4
proposito: Mostrar el resultado del perfil y guardar variable pedagógica.
objetivo: OA5
origen:
  - NUEVO
layout: L08
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  - lee perfil_riesgo de P30
qa: OK
```

**ID:** P31

**UNIDAD / CÁPSULA:** Unidad 1 / Cápsula 4

**PROPÓSITO DE LA PANTALLA:** Mostrar el resultado del perfil y guardar variable pedagógica.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L08

**TÍTULO EN PANTALLA:** Tu resultado

**TEXTO EN PANTALLA:**

Conservador: prioriza estabilidad y liquidez.
Moderado: busca equilibrio entre riesgo y retorno.
Agresivo: acepta volatilidad alta por mayor retorno potencial.
Este resultado es orientativo y no reemplaza asesoría profesional.

**LOCUCIÓN:**

Tu resultado resume tu tolerancia inicial al riesgo. Úsalo como punto de partida, no como sentencia. En inversiones reales, tu perfil debe confirmarse con una entidad autorizada y actualizarse si cambian tus objetivos o circunstancias. [0:15]  
Palabras: 37; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Mostrar el resultado del perfil y guardar variable pedagógica. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** lee perfil_riesgo de P30

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P32 — Ideas clave de la unidad

```yaml
id: P32
unidad_capsula: Unidad 1 / Cierre
proposito: Consolidar ideas clave de la unidad.
objetivo: síntesis
origen:
  - ADAPTADO
layout: L09
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 16
  interaccion_seg: 0
  total_seg: 16
  texto: audio 0:16 + interacción 0:00 = total 0:16
recurso: ninguno
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P32

**UNIDAD / CÁPSULA:** Unidad 1 / Cierre

**PROPÓSITO DE LA PANTALLA:** Consolidar ideas clave de la unidad.

**OBJETIVO DE APRENDIZAJE:** síntesis

**ORIGEN:** ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L09

**TÍTULO EN PANTALLA:** Ideas clave de la unidad

**TEXTO EN PANTALLA:**

1. Las acciones pertenecen a la renta variable.
2. Una acción representa propiedad fraccionada.
3. El retorno puede venir de precio y dividendos.
4. Ordinarias y preferenciales otorgan derechos distintos.
5. Invertir exige objetivos, información y perfil de riesgo.

**LOCUCIÓN:**

Recuerda estas cinco ideas. Las acciones no garantizan ganancias. Te hacen dueño de una fracción de una empresa. Puedes ganar por valorización y dividendos, pero también perder. Por eso debes invertir con información, objetivos y perfil claro. [0:16]  
Palabras: 39; duración estimada: 0:16.

**DURACIÓN DE EXPERIENCIA:** audio 0:16 + interacción 0:00 = total 0:16

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** lectura lineal sin dependencia visual.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P33 — Las tres bolsas de nuam

```yaml
id: P33
unidad_capsula: Unidad 1 / Cierre
proposito: Demostrar el enfoque regional de nuam con bolsas, supervisores y depósitos.
objetivo: navegación
origen:
  - NUEVO
  - VERIFICADO
layout: L02
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
  - SRC-NUAM
  - SRC-SFC
  - SRC-SFC-BVC
  - SRC-SFC-DECEVAL
  - SRC-SMV
  - SRC-BVL-CAVALI
  - SRC-CMF-ACCIONES
  - SRC-CMF-DCV
duracion:
  audio_seg: 36
  interaccion_seg: 0
  total_seg: 36
  texto: audio 0:36 + interacción 0:00 = total 0:36
recurso: infografía: mapa simple con tres países, una bolsa por país y dos etiquetas: supervisor y depósito de valores.
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P33

**UNIDAD / CÁPSULA:** Unidad 1 / Cierre

**PROPÓSITO DE LA PANTALLA:** Demostrar el enfoque regional de nuam con bolsas, supervisores y depósitos.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** NUEVO, VERIFICADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1, SRC-NUAM, SRC-SFC, SRC-SFC-BVC, SRC-SFC-DECEVAL, SRC-SMV, SRC-BVL-CAVALI, SRC-CMF-ACCIONES, SRC-CMF-DCV

**LAYOUT:** L02

**TÍTULO EN PANTALLA:** Las tres bolsas de nuam

**TEXTO EN PANTALLA:**

Colombia: Bolsa de Valores de Colombia | Supervisor: SFC | Depósito: Deceval.
Perú: Bolsa de Valores de Lima | Supervisor: SMV | Depósito: CAVALI.
Chile: Bolsa de Santiago | Supervisor: CMF | Depósito: DCV.

**LOCUCIÓN:**

nuam conecta tres plazas del mercado de capitales: Colombia, Perú y Chile. En Colombia, la bolsa es la Bolsa de Valores de Colombia, el supervisor es la Superintendencia Financiera de Colombia y el depósito es Deceval. En Perú, la bolsa es la Bolsa de Valores de Lima, el supervisor es la Superintendencia del Mercado de Valores y el depósito es CAVALI. En Chile, la bolsa es la Bolsa de Santiago, el supervisor es la Comisión para el Mercado Financiero y el depósito es el DCV. [0:36]  
Palabras: 87; duración estimada: 0:36.

**DURACIÓN DE EXPERIENCIA:** audio 0:36 + interacción 0:00 = total 0:36

**RECURSO AUDIOVISUAL:** infografía: mapa simple con tres países, una bolsa por país y dos etiquetas: supervisor y depósito de valores.

**BRIEF AUDIOVISUAL:** Recurso audiovisual por definir según producción.

**ACCESIBILIDAD:** lectura lineal sin dependencia visual.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P34 — Recursos para llevarte

```yaml
id: P34
unidad_capsula: Unidad 1 / Cierre
proposito: Presentar los recursos descargables útiles después del curso.
objetivo: navegación
origen:
  - NUEVO
layout: L11
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: ninguno
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P34

**UNIDAD / CÁPSULA:** Unidad 1 / Cierre

**PROPÓSITO DE LA PANTALLA:** Presentar los recursos descargables útiles después del curso.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L11

**TÍTULO EN PANTALLA:** Recursos para llevarte

**TEXTO EN PANTALLA:**

1. Calculadora de valorización y dividendos: practicar fórmulas.
2. Checklist antes de tu primera orden: evitar omisiones.
3. Hoja de perfil y objetivos: ordenar decisiones.
4. Glosario de los tres mercados: entender términos por país.

**LOCUCIÓN:**

Además del contenido de la unidad, tendrás cuatro herramientas para usar después. No son copias del curso. Son apoyos prácticos para calcular, verificar, definir objetivos y entender el lenguaje básico de los tres mercados. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** lectura lineal sin dependencia visual.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P35 — Qué sigue después de esta unidad

```yaml
id: P35
unidad_capsula: Unidad 1 / Cierre
proposito: Cerrar la unidad y anticipar la siguiente.
objetivo: navegación
origen:
  - NUEVO
layout: L10
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U1
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P35

**UNIDAD / CÁPSULA:** Unidad 1 / Cierre

**PROPÓSITO DE LA PANTALLA:** Cerrar la unidad y anticipar la siguiente.

**OBJETIVO DE APRENDIZAJE:** navegación

**ORIGEN:** NUEVO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U1

**LAYOUT:** L10

**TÍTULO EN PANTALLA:** Qué sigue después de esta unidad

**TEXTO EN PANTALLA:**

En la siguiente unidad profundizarás en conceptos del mercado bursátil: mercado primario y secundario, operaciones de contado, repos, transferencia temporal de valores y actores del ecosistema.
Botón: Ir a la Unidad 2

**LOCUCIÓN:**

Ya tienes la base. En adelante podrás estudiar cómo se ejecutan operaciones, quiénes participan en el mercado y qué debes verificar antes de enviar una orden. El siguiente paso es pasar del concepto a la operación. [0:15]  
Palabras: 38; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Cerrar la unidad y anticipar la siguiente. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P36 — Vista previa Unidad 2: Anatomía de un Repo

```yaml
id: P36
unidad_capsula: Unidad 2 / Pieza insignia Repo
proposito: Introducir la pieza insignia sobre repo.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L13
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U2
duracion:
  audio_seg: 17
  interaccion_seg: 0
  total_seg: 17
  texto: audio 0:17 + interacción 0:00 = total 0:17
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P36

**UNIDAD / CÁPSULA:** Unidad 2 / Pieza insignia Repo

**PROPÓSITO DE LA PANTALLA:** Introducir la pieza insignia sobre repo.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U2

**LAYOUT:** L13

**TÍTULO EN PANTALLA:** Vista previa Unidad 2: Anatomía de un Repo

**TEXTO EN PANTALLA:**

Objetivo: convertir una explicación densa en una línea de tiempo recorrible de tres momentos: inicio, plazo y regreso.

**LOCUCIÓN:**

Esta pieza funciona como una vista previa de la unidad dos. Un repo puede entenderse como una venta de acciones con pacto de recompra. La interacción mostrará qué cambia de manos al inicio, durante el plazo y al cierre. [0:17]  
Palabras: 41; duración estimada: 0:17.

**DURACIÓN DE EXPERIENCIA:** audio 0:17 + interacción 0:00 = total 0:17

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Introducir la pieza insignia sobre repo. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P37 — Repo paso a paso

```yaml
id: P37
unidad_capsula: Unidad 2 / Pieza insignia Repo
proposito: Visualizar la mecánica de repo como línea de tiempo.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L06
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U2
duracion:
  audio_seg: 14
  interaccion_seg: 70
  total_seg: 84
  texto: audio 0:14 + interacción 1:10 = total 1:24
recurso: motion
interaccion: I09
dependencias:
  []
qa: OK
```

**ID:** P37

**UNIDAD / CÁPSULA:** Unidad 2 / Pieza insignia Repo

**PROPÓSITO DE LA PANTALLA:** Visualizar la mecánica de repo como línea de tiempo.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U2

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** Repo paso a paso

**TEXTO EN PANTALLA:**

Recorre la operación y mira qué entrega cada parte en cada momento.

**LOCUCIÓN:**

En un repo, una parte necesita liquidez y entrega acciones. La otra entrega dinero. Ambas acuerdan que las acciones serán recompradas en una fecha posterior, con una suma que incorpora el rendimiento pactado. [0:14]  
Palabras: 35; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 1:10 = total 1:24

**RECURSO AUDIOVISUAL:** motion

**BRIEF AUDIOVISUAL:** MOTION/I09: línea de tiempo con operación inicial, plazo y regreso; flechas de acciones, dinero y rendimiento; aclarar que es conceptual regional.

**ACCESIBILIDAD:** subtítulos y transcripción; texto alternativo/descripción equivalente; navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I09

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I09 Línea de tiempo recorrible",
  "estado_inicial": "Inversionista A necesita liquidez y posee acciones. Inversionista B tiene dinero disponible.",
  "momentos": [
    {
      "id": "M1",
      "titulo": "Operación inicial",
      "descripcion": "A entrega acciones y B entrega dinero.",
      "cambia": "acciones de A a B; dinero de B a A",
      "resultado": "A obtiene liquidez; B recibe acciones bajo pacto."
    },
    {
      "id": "M2",
      "titulo": "Durante el plazo",
      "descripcion": "Las acciones quedan inmovilizadas bajo condiciones pactadas.",
      "cambia": "no hay nueva entrega; se mantiene obligación de regreso",
      "resultado": "Las partes esperan vencimiento."
    },
    {
      "id": "M3",
      "titulo": "Operación de regreso",
      "descripcion": "A recompra y B recibe dinero más rendimiento pactado.",
      "cambia": "acciones vuelven a A; dinero+rendimento va a B",
      "resultado": "La operación se cierra."
    }
  ],
  "estado_final": "Las acciones retornan al vendedor inicial y el comprador recibe el pago acordado.",
  "retro": "El rasgo esencial es el pacto de recompra, no la venta definitiva."
}
```

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P38 — Comprobación Repo

```yaml
id: P38
unidad_capsula: Unidad 2 / Pieza insignia Repo
proposito: Comprobar el rasgo esencial del repo.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L07
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U2
duracion:
  audio_seg: 12
  interaccion_seg: 25
  total_seg: 37
  texto: audio 0:12 + interacción 0:25 = total 0:37
recurso: ninguno
interaccion: I02
dependencias:
  []
qa: OK
```

**ID:** P38

**UNIDAD / CÁPSULA:** Unidad 2 / Pieza insignia Repo

**PROPÓSITO DE LA PANTALLA:** Comprobar el rasgo esencial del repo.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U2

**LAYOUT:** L07

**TÍTULO EN PANTALLA:** Comprobación Repo

**TEXTO EN PANTALLA:**

En un repo, las acciones se entregan con un pacto de recompra futura.

**LOCUCIÓN:**

Verifica la idea esencial del repo. No es una venta definitiva de acciones. Su rasgo clave es el acuerdo de recompra en una fecha y condiciones previamente establecidas. [0:12]  
Palabras: 30; duración estimada: 0:12.

**DURACIÓN DE EXPERIENCIA:** audio 0:12 + interacción 0:25 = total 0:37

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I02

**PAYLOAD DE INTERACCIÓN:**

I02 | Afirmación: En un repo, las acciones se entregan con un pacto de recompra futura. | Respuesta: Verdadero | Retro correcta: Correcto. El pacto de recompra diferencia el repo de una venta definitiva. | Retro incorrecta: Revisa la secuencia: entrega inicial y recompra pactada al regreso.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P39 — Cierre pieza Repo

```yaml
id: P39
unidad_capsula: Unidad 2 / Pieza insignia Repo
proposito: Cerrar la pieza de repo con recordación.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L09
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U2
duracion:
  audio_seg: 13
  interaccion_seg: 0
  total_seg: 13
  texto: audio 0:13 + interacción 0:00 = total 0:13
recurso: ninguno
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P39

**UNIDAD / CÁPSULA:** Unidad 2 / Pieza insignia Repo

**PROPÓSITO DE LA PANTALLA:** Cerrar la pieza de repo con recordación.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U2

**LAYOUT:** L09

**TÍTULO EN PANTALLA:** Cierre pieza Repo

**TEXTO EN PANTALLA:**

1. El repo busca liquidez.
2. Las acciones sirven como activo de respaldo.
3. Hay operación inicial y de regreso.
4. El precio de regreso incorpora el rendimiento acordado.

**LOCUCIÓN:**

Para recordar un repo, piensa en liquidez temporal respaldada por acciones. Lo importante es no confundirlo con una venta definitiva: existe un compromiso de regreso y condiciones pactadas entre las partes. [0:13]  
Palabras: 33; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:00 = total 0:13

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** lectura lineal sin dependencia visual.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P40 — Vista previa Unidad 3: Tu primera orden

```yaml
id: P40
unidad_capsula: Unidad 3 / Pieza insignia Orden
proposito: Introducir la pieza insignia de primera orden.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L13
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U3
duracion:
  audio_seg: 14
  interaccion_seg: 0
  total_seg: 14
  texto: audio 0:14 + interacción 0:00 = total 0:14
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P40

**UNIDAD / CÁPSULA:** Unidad 3 / Pieza insignia Orden

**PROPÓSITO DE LA PANTALLA:** Introducir la pieza insignia de primera orden.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U3

**LAYOUT:** L13

**TÍTULO EN PANTALLA:** Vista previa Unidad 3: Tu primera orden

**TEXTO EN PANTALLA:**

Objetivo: practicar la diferencia entre orden a mercado y orden límite antes de enviar una instrucción real.

**LOCUCIÓN:**

La tercera unidad debe llevar al estudiante de la teoría a la acción. Esta vista previa propone una boleta simulada para entender qué ocurre cuando eliges precio de mercado o precio límite. [0:14]  
Palabras: 34; duración estimada: 0:14.

**DURACIÓN DE EXPERIENCIA:** audio 0:14 + interacción 0:00 = total 0:14

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Introducir la pieza insignia de primera orden. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P41 — Mercado vs límite

```yaml
id: P41
unidad_capsula: Unidad 3 / Pieza insignia Orden
proposito: Diferenciar orden a mercado y orden límite.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L03
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U3
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P41

**UNIDAD / CÁPSULA:** Unidad 3 / Pieza insignia Orden

**PROPÓSITO DE LA PANTALLA:** Diferenciar orden a mercado y orden límite.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U3

**LAYOUT:** L03

**TÍTULO EN PANTALLA:** Mercado vs límite

**TEXTO EN PANTALLA:**

Orden a mercado: busca ejecución rápida al mejor precio disponible.
Orden límite: fija el precio máximo de compra o mínimo de venta; puede no ejecutarse.

**LOCUCIÓN:**

Una orden a mercado prioriza la ejecución, aunque el precio final puede variar. Una orden límite prioriza el precio definido por ti, pero puede quedar expuesta si el mercado no llega a ese valor. [0:15]  
Palabras: 36; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía simple con jerarquía: concepto principal, 2–4 bloques y nota educativa. No depender solo de color.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P42 — Simula tu primera orden

```yaml
id: P42
unidad_capsula: Unidad 3 / Pieza insignia Orden
proposito: Simular una boleta de orden con resultado determinístico.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L06
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U3
duracion:
  audio_seg: 15
  interaccion_seg: 80
  total_seg: 95
  texto: audio 0:15 + interacción 1:20 = total 1:35
recurso: ninguno
interaccion: I11
dependencias:
  []
qa: OK
```

**ID:** P42

**UNIDAD / CÁPSULA:** Unidad 3 / Pieza insignia Orden

**PROPÓSITO DE LA PANTALLA:** Simular una boleta de orden con resultado determinístico.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U3

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** Simula tu primera orden

**TEXTO EN PANTALLA:**

Completa la boleta y observa el resultado: ejecutada o expuesta.

**LOCUCIÓN:**

Ahora toma una decisión. El emisor será Banco del Sur. El precio actual es mil doscientos. Si compras a mercado, la orden se ejecuta según disponibilidad. Si compras con límite menor al precio actual, queda esperando. [0:15]  
Palabras: 38; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 1:20 = total 1:35

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I11

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I11 Formulario de decisión",
  "escenario": {
    "emisor": "Banco del Sur",
    "precio_actual": 1200,
    "saldo": 10000,
    "titulos_disponibles": 8,
    "hora_mercado": "mercado abierto"
  },
  "campos": [
    "operación comprar/vender",
    "tipo mercado/límite",
    "cantidad",
    "precio límite si aplica",
    "vigencia si aplica"
  ],
  "tabla_verdad": [
    [
      "Comprar",
      "Mercado",
      "saldo suficiente",
      "Ejecutada",
      "Compra al precio disponible estimado."
    ],
    [
      "Comprar",
      "Mercado",
      "saldo insuficiente",
      "Rechazada",
      "No hay saldo suficiente para cantidad y costos."
    ],
    [
      "Comprar",
      "Límite >= precio actual",
      "saldo suficiente",
      "Ejecutada",
      "El límite permite ejecutar al precio actual o mejor."
    ],
    [
      "Comprar",
      "Límite < precio actual",
      "saldo suficiente",
      "Expuesta",
      "Queda vigente hasta que el precio baje al límite o venza."
    ],
    [
      "Vender",
      "Mercado",
      "títulos suficientes",
      "Ejecutada",
      "Vende al precio disponible estimado."
    ],
    [
      "Vender",
      "Mercado",
      "títulos insuficientes",
      "Rechazada",
      "No posees la cantidad indicada."
    ],
    [
      "Vender",
      "Límite <= precio actual",
      "títulos suficientes",
      "Ejecutada",
      "El límite permite vender al precio actual o mejor."
    ],
    [
      "Vender",
      "Límite > precio actual",
      "títulos suficientes",
      "Expuesta",
      "Queda vigente hasta que el precio suba al límite o venza."
    ]
  ],
  "casos_prueba": [
    "Comprar mercado 5 acciones: ejecutada",
    "Comprar límite $1.100: expuesta",
    "Vender 20 acciones: rechazada"
  ]
}
```

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P43 — Resultado de la orden

```yaml
id: P43
unidad_capsula: Unidad 3 / Pieza insignia Orden
proposito: Explicar los posibles resultados de una orden.
objetivo: OA6
origen:
  - NUEVO
  - ADAPTADO
layout: L08
fuentes:
  - SRC-BRIEF-V2
  - SRC-GUION-U3
duracion:
  audio_seg: 13
  interaccion_seg: 0
  total_seg: 13
  texto: audio 0:13 + interacción 0:00 = total 0:13
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P43

**UNIDAD / CÁPSULA:** Unidad 3 / Pieza insignia Orden

**PROPÓSITO DE LA PANTALLA:** Explicar los posibles resultados de una orden.

**OBJETIVO DE APRENDIZAJE:** OA6

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2, SRC-GUION-U3

**LAYOUT:** L08

**TÍTULO EN PANTALLA:** Resultado de la orden

**TEXTO EN PANTALLA:**

Ejecutada: tu instrucción encontró condiciones de mercado.
Expuesta: queda vigente hasta que el precio llegue o venza.
Rechazada: faltan datos o no hay saldo/títulos suficientes.

**LOCUCIÓN:**

El resultado de una orden depende de sus condiciones. Lo importante es revisar cantidad, precio, vigencia, costos y saldo antes de confirmar. En la vida real, una orden confirmada tiene trazabilidad. [0:13]  
Palabras: 33; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:00 = total 0:13

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Explicar los posibles resultados de una orden. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P44 — Vista previa Unidad 5: Arma tu portafolio

```yaml
id: P44
unidad_capsula: Unidad 5 / Pieza insignia Portafolio
proposito: Introducir la pieza insignia de portafolio.
objetivo: OA5
origen:
  - NUEVO
  - ADAPTADO
layout: L13
fuentes:
  - SRC-BRIEF-V2
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P44

**UNIDAD / CÁPSULA:** Unidad 5 / Pieza insignia Portafolio

**PROPÓSITO DE LA PANTALLA:** Introducir la pieza insignia de portafolio.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2

**LAYOUT:** L13

**TÍTULO EN PANTALLA:** Vista previa Unidad 5: Arma tu portafolio

**TEXTO EN PANTALLA:**

Objetivo: repartir capital entre tres emisores ficticios y recibir retroalimentación según el perfil obtenido en P30.

**LOCUCIÓN:**

La quinta unidad debe cerrar con práctica. Esta pieza permite repartir capital entre tres emisores ficticios. La retroalimentación usará el perfil obtenido antes para sugerir si la distribución es coherente con tu tolerancia al riesgo. [0:15]  
Palabras: 37; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Introducir la pieza insignia de portafolio. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P45 — Tres emisores ficticios

```yaml
id: P45
unidad_capsula: Unidad 5 / Pieza insignia Portafolio
proposito: Presentar los emisores ficticios para práctica sin recomendación.
objetivo: OA5
origen:
  - NUEVO
  - ADAPTADO
layout: L03
fuentes:
  - SRC-BRIEF-V2
duracion:
  audio_seg: 15
  interaccion_seg: 0
  total_seg: 15
  texto: audio 0:15 + interacción 0:00 = total 0:15
recurso: infografía
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P45

**UNIDAD / CÁPSULA:** Unidad 5 / Pieza insignia Portafolio

**PROPÓSITO DE LA PANTALLA:** Presentar los emisores ficticios para práctica sin recomendación.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2

**LAYOUT:** L03

**TÍTULO EN PANTALLA:** Tres emisores ficticios

**TEXTO EN PANTALLA:**

Petrocaribe: alto riesgo, sensible a precios de energía.
Andina Cementos: riesgo medio, ligado a infraestructura y construcción.
Banco del Sur: riesgo medio-bajo, negocio financiero diversificado.

**LOCUCIÓN:**

El ejercicio usa emisores ficticios para evitar recomendaciones reales. Cada uno tiene un perfil de riesgo distinto. El reto no es adivinar el ganador, sino construir una distribución consistente con objetivos y tolerancia al riesgo. [0:15]  
Palabras: 37; duración estimada: 0:15.

**DURACIÓN DE EXPERIENCIA:** audio 0:15 + interacción 0:00 = total 0:15

**RECURSO AUDIOVISUAL:** infografía

**BRIEF AUDIOVISUAL:** Infografía de tres emisores ficticios con sector, perfil de riesgo y uso didáctico. No usar logos reales ni sugerir recomendación.

**ACCESIBILIDAD:** texto alternativo/descripción equivalente.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P46 — Distribuye $10.000

```yaml
id: P46
unidad_capsula: Unidad 5 / Pieza insignia Portafolio
proposito: Aplicar perfil de riesgo a una distribución de capital.
objetivo: OA5
origen:
  - NUEVO
  - ADAPTADO
layout: L06
fuentes:
  - SRC-BRIEF-V2
duracion:
  audio_seg: 13
  interaccion_seg: 90
  total_seg: 103
  texto: audio 0:13 + interacción 1:30 = total 1:43
recurso: ninguno
interaccion: I12
dependencias:
  - lee perfil_riesgo de P30/I13
qa: OK
```

**ID:** P46

**UNIDAD / CÁPSULA:** Unidad 5 / Pieza insignia Portafolio

**PROPÓSITO DE LA PANTALLA:** Aplicar perfil de riesgo a una distribución de capital.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2

**LAYOUT:** L06

**TÍTULO EN PANTALLA:** Distribuye $10.000

**TEXTO EN PANTALLA:**

Asigna porcentajes a Petrocaribe, Andina Cementos y Banco del Sur. La suma debe ser 100%.

**LOCUCIÓN:**

Reparte diez mil entre tres emisores. Si concentras demasiado en el activo de mayor riesgo, la herramienta lo señalará. Si diversificas de forma equilibrada, la retroalimentación será distinta según tu perfil. [0:13]  
Palabras: 33; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 1:30 = total 1:43

**RECURSO AUDIOVISUAL:** ninguno

**BRIEF AUDIOVISUAL:** No requiere recurso audiovisual. Mantener foco en texto, interacción o retroalimentación.

**ACCESIBILIDAD:** navegable por teclado; retroalimentación disponible para lector de pantalla.

**INTERACCIÓN:** I12

**PAYLOAD DE INTERACCIÓN:**

```json
{
  "tipo": "I12 Distribución de capital",
  "capital": "$10.000",
  "activos": [
    {
      "emisor": "Petrocaribe",
      "riesgo": "alto"
    },
    {
      "emisor": "Andina Cementos",
      "riesgo": "medio"
    },
    {
      "emisor": "Banco del Sur",
      "riesgo": "medio-bajo"
    }
  ],
  "reglas": [
    "La suma debe ser 100%",
    "concentración alta si un emisor supera 60%",
    "exposición alta si Petrocaribe supera 40%"
  ],
  "matriz_retro": [
    [
      "conservador",
      "Petrocaribe > 40%",
      "La distribución luce agresiva para un perfil conservador; revisa concentración y pérdida tolerable."
    ],
    [
      "conservador",
      "Banco del Sur >= 50% y ninguno >60%",
      "La distribución es más coherente con preservación relativa, aunque sigue expuesta a renta variable."
    ],
    [
      "moderado",
      "ninguno >60%",
      "La distribución muestra diversificación básica compatible con un perfil moderado."
    ],
    [
      "moderado",
      "un emisor >60%",
      "Revisa concentración; un perfil moderado suele buscar equilibrio."
    ],
    [
      "agresivo",
      "Petrocaribe 30–60%",
      "La exposición a riesgo alto puede ser coherente, siempre que haya análisis y límites."
    ],
    [
      "agresivo",
      "Petrocaribe >60%",
      "Alta concentración: incluso un perfil agresivo debería justificar y monitorear ese riesgo."
    ]
  ],
  "aviso": "No constituye recomendación de inversión."
}
```

**DEPENDENCIAS / VARIABLES:** lee perfil_riesgo de P30/I13

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

### P47 — Retro de portafolio

```yaml
id: P47
unidad_capsula: Unidad 5 / Pieza insignia Portafolio
proposito: Cerrar con retroalimentación no prescriptiva sobre portafolio.
objetivo: OA5
origen:
  - NUEVO
  - ADAPTADO
layout: L08
fuentes:
  - SRC-BRIEF-V2
duracion:
  audio_seg: 13
  interaccion_seg: 0
  total_seg: 13
  texto: audio 0:13 + interacción 0:00 = total 0:13
recurso: avatar
interaccion: ninguna
dependencias:
  []
qa: OK
```

**ID:** P47

**UNIDAD / CÁPSULA:** Unidad 5 / Pieza insignia Portafolio

**PROPÓSITO DE LA PANTALLA:** Cerrar con retroalimentación no prescriptiva sobre portafolio.

**OBJETIVO DE APRENDIZAJE:** OA5

**ORIGEN:** NUEVO, ADAPTADO

**FUENTE(S):** SRC-BRIEF-V2

**LAYOUT:** L08

**TÍTULO EN PANTALLA:** Retro de portafolio

**TEXTO EN PANTALLA:**

Conservador: cuida concentración y liquidez.
Moderado: busca equilibrio y diversificación.
Agresivo: tolera más volatilidad, pero no ignora concentración.
Ninguna retro equivale a recomendación de inversión.

**LOCUCIÓN:**

La retroalimentación del portafolio debe educar, no recomendar. El estudiante aprende a revisar coherencia entre perfil y asignación. En inversiones reales se requiere información adicional, costos, horizonte, asesoría y reglas aplicables. [0:13]  
Palabras: 33; duración estimada: 0:13.

**DURACIÓN DE EXPERIENCIA:** audio 0:13 + interacción 0:00 = total 0:13

**RECURSO AUDIOVISUAL:** avatar

**BRIEF AUDIOVISUAL:** Avatar en plano medio, tono claro y prudente. Función: Cerrar con retroalimentación no prescriptiva sobre portafolio. Locución sincronizada con subtítulos completos.

**ACCESIBILIDAD:** subtítulos y transcripción.

**INTERACCIÓN:** ninguna

**PAYLOAD DE INTERACCIÓN:**

No aplica.

**DEPENDENCIAS / VARIABLES:** Ninguna.

**NOTAS PARA DESARROLLO:** Respetar presupuesto del layout. Mantener trazabilidad con Storyboard_Master_v2.md. No convertir ejemplos ficticios en recomendación de inversión.

**QA:** OK

---

## Auditoría de duración por cápsula

| Cápsula 1 | Locución 1:01 | Interacción 1:00 | Total 2:01 | Cumple 3–5 min: No |
| Cápsula 2 | Locución 1:00 | Interacción 0:25 | Total 1:25 | Cumple 3–5 min: No |
| Cápsula 3 | Locución 1:25 | Interacción 1:55 | Total 3:20 | Cumple 3–5 min: Sí |
| Cápsula 4 | Locución 1:30 | Interacción 1:45 | Total 3:15 | Cumple 3–5 min: Sí |
| Pieza Repo | Locución 0:56 | Interacción 1:35 | Total 2:31 | Cumple 3–5 min: No aplica |
| Pieza Orden | Locución 0:57 | Interacción 1:20 | Total 2:17 | Cumple 3–5 min: No aplica |
| Pieza Portafolio | Locución 0:56 | Interacción 1:30 | Total 2:26 | Cumple 3–5 min: No aplica |

