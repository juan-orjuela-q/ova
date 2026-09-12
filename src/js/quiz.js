/* ============================================================
   quiz.js — motor de evaluación (T6).

   Implementa el catálogo de interacciones I01–I05 (preguntas, más tres
   tipos probados y funcionales sin número — ver más abajo) y el bloque
   de retroalimentación I14, compartido por todas. Este archivo es la
   fuente de verdad de ese catálogo — igual que layouts.css lo es para
   L01–L13 — porque CLAUDE.md no fijó de antemano qué es cada tipo (solo
   nombra I09–I12, las interacciones insignia de T8, e I14, el bloque de
   retro). El catálogo de abajo fue una decisión tomada en T6, no una
   especificación previa; queda documentada aquí y en ESTADO.md para
   poder corregirla sin arqueología de código si la lectura no era la
   correcta.

   Numeración: la de BRIEF-DI.md (CLAUDE.md, regla dura 8). C0 (4 sep)
   renumeró I01/I02 — T6 los había construido al revés (I01 era
   verdadero_falso, I02 era opcion_unica) — y le quitó el número a
   completar/numerica/autoevaluacion, porque el brief reserva I06/I07/I08
   para otros tres tipos. De esos tres, I06 (zonas sensibles sobre imagen)
   sigue sin construirse — ninguna pantalla de Jose lo pide, ver
   PLAN-CONTENIDO.md §2.2 — pero I07 (tarjetas volteables) e I08
   (comparador de dos columnas) sí se construyeron, en C5 (ver su bloque
   de documentación más abajo, junto a I13). Los tres tipos sin número
   (completar/numerica/autoevaluacion) siguen probados y funcionando por
   su nombre en vez de por código: borrar código que funciona no ahorra
   nada.

   Cada interacción del contrato de contenido sigue siendo un objeto
   {tipo, datos} — una pregunta por pantalla, igual que cada
   interacción insignia I09–I12 de T8 ocupa su propia pantalla
   (L06, "interacción a pantalla completa"). "Banco de preguntas"
   (PLAN.md) es este catálogo de constructores por tipo, no una
   estructura de varias preguntas dentro de una sola pantalla:
   inventar esa estructura habría cambiado la forma {tipo, datos} que
   ya fija CLAUDE.md sin necesidad real — el banco vive repartido en
   pantallas, no apilado en una.

   Catálogo (todos con datos.id opcional, datos.intentos opcional
   —0/ausente = ilimitados— y datos.retroalimentacion.correcto/
   incorrecto opcional para el texto largo del bloque I14):

     I01 opcion_unica     { enunciado, opciones:[{id,texto}], correcta:id }
     I02 verdadero_falso  { enunciado, respuestaCorrecta:bool }
     I03 opcion_multiple  { enunciado, opciones:[{id,texto}], correctas:[id…] }
     I04 relacionar       { enunciado, izquierda:[{id,texto}], derecha:[{id,texto}], pares:{idIzq:idDer} }
     I05 ordenar          { enunciado, pasos:[{id,texto}] (orden mostrado), orden:[id…] (correcto) }
     completar            { enunciado, respuestas:[texto…] (aceptadas) } — sin número (el brief usa I06 para otra cosa).
     numerica             { enunciado, respuesta:number, tolerancia:number=0, unidad:string } — sin número (el brief usa I07 para otra cosa).
     autoevaluacion       { enunciado, escala:[{valor,texto}] } — sin número (el brief usa I08 para otra cosa); sin respuesta correcta, no cuenta en la nota.

   Ningún tipo usa arrastre: I04/I05 (los dos "de orden") resuelven con
   <select>, no drag-and-drop — mismo criterio que T8 exige de forma
   explícita para I09 ("alternativa de teclado al arrastre"), aplicado
   aquí desde el origen en vez de corregirlo después.

   C4 — datos.variable, opcional en cualquiera de las ocho de arriba
   (I01–I05 más completar/numerica/autoevaluacion): escribe en la
   variable de contenido de state.js (ver el encabezado de state.js)
   cuando la respuesta queda "correcta" — nunca en incorrecta ni
   neutral, así que autoevaluacion (que jamás devuelve "correcto") no
   tiene forma útil de usar este campo.
     datos.variable: { nombre, modo?, valor? }
       - modo "contar" (por defecto): suma 1 a la variable, arrancando
         en 0 si no existía — el caso de aciertos_diagnostico, una
         pregunta por pantalla que va sumando.
       - modo "fijar": asigna literalmente datos.variable.valor —
         para una sola pregunta que decide un valor categórico en vez
         de acumular (p. ej. una pregunta que por sí sola fija un
         perfil, a diferencia de I13, que lo hace con varias).
   La escritura pasa por comprobar() (única función que conoce el
   resultado real de evaluar()), no por cada constructor.

   Reporte a SCORM: cada "Comprobar" agrega una fila a
   cmi.interactions (id, type, student_response, correct_responses,
   result, time) vía scorm.js, y en preguntas gradables actualiza
   cmi.core.score.raw/min/max — la nota que T9 necesita para "reporta
   avance y notas". El formato de student_response/correct_responses
   es una serialización simple (ids separados por comas, "clave.valor"
   para relacionar/ordenar), no la gramática completa de patrones de
   SCORM 1.2 por tipo de interacción: decisión deliberada, Moodle basa
   la calificación real en cmi.core.score.raw, no en parsear ese
   patrón, y la gramática completa de los nueve tipos no tenía retorno
   para este proyecto.

   No se persiste el intento entre recargas: cada montaje empieza en
   cero, igual que media.js no restaura la posición de reproducción.
   Si una revisión futura lo pide, es tarea aparte.

   ---------------------------------------------------------------------
   T8 — interacciones insignia (I09–I12). CLAUDE.md/PLAN.md pidieron
   cuatro sesiones separadas, en orden I10 → I11 → I09 → I12; las cuatro
   están hechas. No hay archivo dedicado a I09–I12 en la Estructura de
   CLAUDE.md, y router.js ya solo conoce un punto de entrada para
   cualquier `interaccion` (crearInteraccion → OVA.quiz.crear) — así que
   estas cuatro viven aquí también, no en un archivo nuevo.

   A diferencia del catálogo de preguntas de arriba, una interacción
   insignia NO es una pregunta con intentos/Comprobar/Reintentar: es un
   widget exploratorio con su propio armado y su propio momento de
   reporte a SCORM. `crear()` las despacha por una tabla aparte
   (CONSTRUCTORES_INSIGNIA) antes de asumir que todo lo demás es una
   pregunta del catálogo de arriba; cada constructor de este
   grupo arma su DOM completo (no un <fieldset> para que crear() lo
   envuelva) y decide él mismo cuándo llamar a reportarSCORM() — I09/I11/
   I12 (sesiones futuras) siguen el mismo patrón de despacho.

     I10 calculadora_parametrica { enunciado?, formula, entradas, salida }
       (contrato de T8; C6 lo amplía — `salida` pasa a `salidas`, arreglo,
       y suma `mensajes`/`accion` opcionales, y el catálogo suma dos
       fórmulas — ver el bloque "C6" más abajo, es el contrato vigente)
       - `formula` sale de un catálogo cerrado en FORMULAS_CALCULADORA
         (hoy un solo miembro, 'valor_accion_dividendo') — mismo criterio
         que el catálogo de charts.js: el contenido elige un tipo ya
         implementado, el motor no evalúa expresiones arbitrarias.
       - `entradas`: [{ id, etiqueta, unidad?, min, max, paso,
         valorInicial, decimales? }, …] — un <input type="range"> por
         entrada (mismo criterio que el scrubber de media.js: teclado,
         Home/Fin/RePág/AvPág y el rol de slider vienen gratis del
         navegador, "sin arrastrar" queda resuelto por construcción) más
         un <output> nativo emparejado (for=id) para leer el valor en
         vivo — <output> ya tiene rol ARIA implícito "status", así que el
         valor de cada slider se anuncia solo, sin aria-live escrito a
         mano.
       - 'valor_accion_dividendo' exige exactamente estos tres ids en
         `entradas` (modelo de descuento de dividendos / Gordon):
         `dividendo` (dividendo esperado del próximo año, D1),
         `tasaCrecimiento` y `tasaDescuento` (puntos porcentuales, ej. 4
         = 4 %). valor = dividendo / ((tasaDescuento − tasaCrecimiento) /
         100); si tasaDescuento ≤ tasaCrecimiento no hay valor real
         (crecimiento no sostenible bajo ese descuento) y el resultado
         pasa a un estado de error — texto explícito, nunca solo un NaN
         o un color, y el botón de registrar se deshabilita mientras
         dure.
       - `salida`: { etiqueta, unidad?, decimales? } — `unidad` es sufijo,
         igual que en charts.js (ej. " COP"), no símbolo antepuesto.
         (C6: ahora `salidas`, arreglo de esta misma forma más `id`.)
       - El resultado también es un <output> (mismo motivo: es
         literalmente el resultado de un cálculo) que se recalcula en
         cada `input` de cualquier slider — la retroalimentación en vivo
         es el punto pedagógico del componente, no un extra. El botón
         «Registrar valorización» es la acción discreta que exige el
         cierre de T8 ("resultado reportado al motor de estado"): arma
         un objeto mínimo compatible con reportarSCORM() (idScorm,
         tipoScorm:'other', textoRespuesta() serializa entradas.id=valor
         separadas por coma, textoCorrecta() null — no hay "correcta" en
         un explorador de escenarios, mismo criterio que autoevaluacion) y anuncia
         el registro en un párrafo role="status" propio (`.calc-resumen`,
         mismo patrón que `.quiz-resumen`). No hay intentos ni bloqueo
         definitivo: se puede ajustar y volver a registrar cuantas veces
         se quiera, cada click agrega una fila nueva a cmi.interactions,
         igual que cada Comprobar/Reintentar de una pregunta gradable.
       - Familia de clases nueva `.calc-` (agregada a la lista de
         CLAUDE.md) — ninguna reutiliza `.quiz-` a propósito: son
         familias de componentes distintas aunque compartan el mismo
         punto de entrada en JS.

     I11 boleta_compra { enunciado?, mercado, limite }
       (contrato de T8; C6 lo reemplaza por completo —comprar/vender,
       escenario con saldo/títulos, precioActual/precioLimite/cantidad,
       tres resultados— ver el bloque "C6" más abajo, es el contrato
       vigente)
       - Base de C2 (cápsula de "valorización de una acción"). Reusa
         literalmente la cáscara `.calc-calculadora` que I10 dejó
         (enunciado, `.calc-calculadora__entradas`, resultado, acciones,
         resumen) — es "el patrón" que PLAN.md le pedía establecer a I10.
       - `mercado`/`limite`: mismo objeto `{ etiqueta?, unidad?, min,
         max, paso, valorInicial, decimales? }` que las `entradas` de
         I10, un slider cada uno. `mercado` simula el precio de mercado
         vigente en el momento de enviar la boleta (el estudiante lo
         mueve para explorar escenarios, no es un dato fijo); `limite`
         es el precio máximo que el comprador está dispuesto a pagar.
       - Tipo de orden: "A mercado" / "Límite" — un <fieldset>/<legend>
         con dos <input type="radio"> nativos (mismo criterio que el
         catálogo de preguntas: el grupo y su navegación con flechas
         vienen gratis del navegador), límite marcado por defecto porque es el caso que
         enseña la diferencia. El slider de límite se deshabilita
         (nunca se oculta) cuando el tipo es "a mercado".
       - Regla de ejecución (orden de COMPRA): a mercado siempre se
         ejecuta al precio de mercado vigente; a límite se ejecuta solo
         si el precio de mercado no supera el límite — si lo supera,
         queda pendiente. "Pendiente" NO es un estado de error (a
         diferencia del dominio inválido de I10): no bloquea «Enviar
         boleta», usa un ícono neutro (`schedule`) y el estilo por
         defecto de `.calc-calculadora__resultado`, no el rojo de error
         — es un resultado legítimo de una orden límite, el punto
         pedagógico del ejercicio. "Ejecutada" sí tiene su propio
         verde (`check_circle`), mismo patrón que `.quiz-retro
         [data-estado="correcto"]`.
       - Mismo mecanismo de reporte que I10: «Enviar boleta» arma un
         objeto compatible con reportarSCORM() (tipoScorm 'other',
         sin correct_responses) y puede reenviarse cuantas veces se
         quiera tras ajustar los sliders.
       - C4: `datos.variable.nombre` opcional — a diferencia del
         "modo contar/fijar" de las preguntas de arriba, aquí no hace
         falta modo: cada «Enviar boleta» fija esa variable de
         contenido directo con el resultado computado ({ tipo,
         ejecutada, precioMercado, precioLimite }), sobreescribiendo
         el envío anterior. Es la base de resultado_boleta —
         PLAN-CONTENIDO.md §3.1, P43 leyendo el resultado de P42.

     I09 linea_tiempo_ordenable { enunciado?, operacion?, eventos:[{id,texto}], ordenCorrecto:[id…] }
       (contrato de T8 — arrastre/reordenar con orden correcto. C6 lo
       REEMPLAZA por completo, no lo amplía: el brief no pide reordenar,
       pide recorrer momentos con estado inicial y final. Este
       constructor ya no existe; ver `linea_tiempo_recorrible` en el
       bloque "C6" más abajo, es el contrato vigente. Se deja esta
       entrada como registro de por qué I09 se ve distinto de lo que
       T8 documentó, no como contrato usable.)

     I12 distribucion_capital { enunciado?, categorias:[{id,etiqueta,valorInicial}] }
       (contrato de T8; C6 le suma `reglas`/`aviso` opcionales —la
       matriz de retro por perfil de riesgo— sin tocar lo de abajo, ver
       el bloque "C6" más abajo)
       - Base de C3 (junto con I10) — portafolio: reparte un total fijo
         de 100 % entre categorías (retoma los tres mercados de s01:
         renta variable, renta fija, derivados). Un <input
         type="range"> 0–100 por categoría, mismo criterio que I10/I11.
       - Reusa OVA.charts.crear({tipo:'distribucion', …}) de T7 para la
         vista viva, en vez de duplicar el SVG de barra apilada: cada
         input recalcula los segmentos y reemplaza la figura completa.
         Es la misma barra apilada + leyenda de texto real que ya
         construyó T7 (charts.js sigue siendo la única fuente de
         verdad de ese dibujo), ahora alimentada con datos que cambian
         en vivo en vez de estáticos.
       - Validación de dominio, mismo patrón que el error de I10 (tasa
         de descuento ≤ crecimiento): si la suma de las categorías no
         es exactamente 100, .calc-calculadora__resultado pasa a
         data-estado="error" (ícono + texto, nunca solo el borde) y
         «Registrar distribución» se deshabilita mientras dure. Al
         llegar a 100 el botón se habilita y el resultado muestra el
         total en su estilo neutro por defecto (data-estado="ok",
         igual que I10 en su estado válido).
       - Reporte igual a I10/I11: tipoScorm 'other', sin
         correct_responses (no hay una única distribución "correcta"
         en un ejercicio de armar portafolio), reenviable cuantas veces
         se quiera con la distribución vigente.

   ---------------------------------------------------------------------
   C5 (PLAN-CONTENIDO.md) — I07, I08, I13. Ninguna de las tres es una
   pregunta gradable (I01–I05) ni una pieza insignia de unidad (I09–I12
   son las cuatro de T8, de las piezas insignia de las unidades 2/3/5):
   son interacciones normales de cápsula de la Unidad 1 que tampoco
   encajan en el patrón fieldset/Comprobar/Reintentar porque ninguna
   tiene un "correcto/incorrecto" por opción — I07/I08 son exploración
   sin evaluación e I13 es un test que agrega puntos a una categoría, no
   una respuesta correcta. Por eso las tres se despachan por la misma
   tabla que I09–I12 (CONSTRUCTORES_INSIGNIA, ver la nota de arquitectura
   más abajo) en vez de por CONSTRUCTORES: arman su propio DOM completo y
   deciden ellas mismas cuándo reportar a SCORM, aunque numéricamente el
   brief las ubique fuera del rango I09–I12.

     I07 tarjetas_volteables { enunciado?, tarjetas:[{frente,reverso,imagen?,alt?}], retroalimentacion? }
       - Una `<button aria-expanded>` por tarjeta (pedido explícito del
         cierre de C5 en PLAN-CONTENIDO.md) — Enter/Espacio y el foco
         vienen gratis del navegador, mismo criterio que el resto del
         catálogo. Cada tarjeta guarda dos caras (`.calc-tarjeta__cara`)
         dentro de un `.calc-tarjeta__interior` que gira en 3D
         (`rotateY`, `backface-visibility: hidden`) cuando cambia
         `aria-expanded` — proporción 4:5, cara frontal naranja con el
         `frente` en blanco arriba y la ilustración (opcional, decorativa)
         a sangre abajo, cara reverso gris con el `frente` repetido en
         texto oscuro, `reverso` como definición y la misma ilustración
         reducida a un círculo que se superpone a una franja inferior con
         sombra (mismo `--shadow-card` que la tarjeta de audio, invertido).
         Volver a pulsar la vuelve a tapar — no es un candado de una sola
         vía como el bloqueo de una pregunta gradable, es una ficha que se
         consulta cuantas veces se quiera, mismo espíritu que I10–I12. La
         cara no visible se marca `aria-hidden` (el giro 3D solo la oculta
         visualmente, no del árbol de accesibilidad) y cada volteo se
         anuncia por `OVA.a11y.anunciar()` (la región compartida de
         a11y.js, no una región propia), mismo patrón que los botones
         "Mover antes/después" de I09. La duración del giro usa
         `--dur-slow`, así que respeta movimiento reducido (SO o panel de
         preferencias) igual que el resto del catálogo. `imagen` sigue el
         mismo criterio de degradación que `crearIlustracionTarjeta` de
         router.js: si falla al cargar, se quita y la tarjeta se queda con
         su texto.
       - Sin arrastre y sin evaluación: no hay "correcta". Al voltear
         las tarjetas completas al menos una vez, se revela
         `retroalimentacion` (si el contenido la trae) en un
         `.calc-resumen` (`role="status"`) y se reporta una sola vez a
         `cmi.interactions` (tipoScorm 'other', neutral) — el mismo
         criterio de "reportar al completar la exploración" que usa I08.
       - `datos.id` opcional, igual que el resto del catálogo.
       - Ajustes tanda 12 (p13, pedido de Juan): el título de cada cara
         (`.calc-tarjeta__titulo-frente`/`-reverso`) va centrado y en
         `--font-display` (PT Serif), no en la tipografía de UI del resto
         del catálogo — mismo criterio que kicker/título de pantalla. La
         definición del reverso sube de `tipo-cuerpo-sm` a `tipo-cuerpo`
         y el círculo de la ilustración reducida de 4.5rem a 5.5rem (ver
         la nota de `.calc-tarjeta__icono-circulo` en components.css
         para la cuenta que evita que vuelva a recortarse contra
         `overflow: hidden`).

     I08 comparador_columnas { enunciado?, columnas:[textoIzq,textoDer], filas:[{etiqueta,izquierda,derecha}] }
       - Nace de un problema real de layout, no de decoración: dos
         columnas lado a lado no reflowean limpio a 320px (regla dura 7
         de CLAUDE.md prohíbe el scroll horizontal, y una tabla nativa de
         dos columnas angostas con etiquetas largas lo produce). En vez
         de una `<table>`, cada fila es un `<button aria-pressed>` que
         siempre muestra las dos columnas apiladas con su etiqueta de
         columna repetida en texto (`"Ordinarias: …" / "Preferenciales:
         …"`) — nunca se oculta ninguna, así que zoom de texto 200% y
         320px no tienen nada que recortar. Pulsar una fila la marca
         como "en foco de comparación" (ícono + `aria-pressed` juntos,
         nunca solo el borde) y arma la comparación como una oración en
         un `.calc-resumen` (`role="status"`) — la interacción real que
         pide el cierre de C5, no una tabla de solo lectura. Una fila
         activa a la vez; pulsarla de nuevo la desactiva y vacía el
         resumen.
       - Reporta a `cmi.interactions` (tipoScorm 'other', neutral) una
         sola vez, al pasar por todas las filas al menos una vez —
         mismo criterio de "completar la exploración" que I07.
       - Sin arrastre, sin evaluación, `datos.id` opcional.

     I13 test_perfil { enunciado?, preguntas:[{enunciado,opciones:[{texto,puntos}]}], resultados:[{minimo,maximo?,categoria,etiqueta,texto,imagen?,alt?}], variable?, aviso? }
       - Reusa la cáscara `.calc-calculadora` (I10–I12): un
         `<fieldset>`/`<legend>` con radios (`.calc-opcion`, mismo grupo
         nativo que el selector de tipo de orden de I11) por pregunta,
         resultado final en el mismo bloque `.calc-calculadora__resultado`.
       - «Ver resultado» empieza deshabilitado (mismo patrón que
         «Registrar distribución» en I12) y se habilita cuando las
         `preguntas.length` están respondidas — nunca se puede calcular
         un resultado a medias.
       - Al pulsarlo: suma los `puntos` de las opciones elegidas y busca
         en `resultados` (evaluado en orden, primera que matchea gana —
         mismo criterio que `resultado.reglas` de L08/C4) la que cumple
         `minimo <= total <= maximo` (`maximo` opcional = sin techo).
         Sin match, el resultado pasa a `data-estado="error"` (ícono +
         texto, nunca solo el borde) en vez de mostrar un resultado
         inventado — un catálogo de `resultados` mal armado por el
         contenido no debe fabricar una categoría falsa.
       - `datos.variable` (nombre de variable de contenido, opcional):
         al llegar a un resultado válido, fija esa variable directo con
         `categoria` — sin "modo contar/fijar" (eso es solo del catálogo
         de preguntas gradables I01–I05/completar/numerica/
         autoevaluacion, ver `actualizarVariableContenido` más arriba),
         mismo criterio que I11 fijó `resultado_boleta` en `enviar()`
         (nota dejada por C4 en PLAN-CONTENIDO.md §6 para cuando
         existiera I13: "una llamada directa a
         OVA.state.establecerVariable(...) sin tocar quiz.js fuera de
         esa llamada"). Reenviable cuantas veces se quiera, cada envío
         sobreescribe el anterior — igual que I11/I12.
       - `datos.aviso` (opcional): texto de descargo, añadido como nota
         aparte del resultado — el orientativo/no-regulatorio que trae
         el payload real de Jose (P30, "no reemplaza el perfilamiento
         formal de un intermediario").
       - Reporte a SCORM igual a I10–I12: tipoScorm 'other', sin
         correct_responses (no hay una única respuesta "correcta" en un
         test de autopercepción).
       - Ajustes tanda 14 (11 sep): al pulsar «Ver resultado» las
         preguntas (`entradas`) y ese mismo botón se ocultan — la vista
         pasa a ser SOLO el resultado, mismo criterio que
         `construirCuestionario` (I15) de arriba, no un bloque que se
         agrega debajo de las preguntas ya respondidas. El resultado
         gana el foco (`tabIndex=-1` + `.focus()`, mismo patrón que
         `OVA.a11y.enfocarEncabezado()` entre pantallas) porque el
         botón que lo tenía desaparece. `resultados[].imagen`/`.alt`
         (opcionales) ilustran el perfil obtenido — mismo mecanismo de
         degradación que `crearIlustracionTarjeta` de router.js (si la
         imagen falla al cargar, se quita y el ícono de siempre
         (task_alt/error) vuelve a ser lo único que marca el estado).
         Un botón «Volver a tomar el test» (`boton--outline`, mismo
         estilo que «Reintentar») reaparece las preguntas, limpia todas
         las respuestas (radios incluidos) y devuelve el foco a
         `entradas` — reenviable cuantas veces se quiera, igual que el
         resto de I13.

   ---------------------------------------------------------------------
   C6 (PLAN-CONTENIDO.md) — I09, I10, I11, I12 ampliadas contra los
   payloads reales de Jose (disenoInstruccional/storyboard_data_v2.json:
   P37 para I09, P22/P24 para I10, P42 para I11, P46 para I12). Los
   cuatro siguen despachando por CONSTRUCTORES_INSIGNIA sin cambiar esa
   tabla de forma; esta sección documenta el contrato nuevo de cada
   uno. Nota de proceso: esta sesión no tuvo Playwright disponible (a
   diferencia de T1–T8/C0–C5) — la verificación es lectura de código
   más los casos_prueba de Jose calculados a mano contra cada fórmula
   y regla, dejados como valores iniciales de los sliders/estado de la
   kitchen sink para que el primer render ya muestre el resultado
   esperado sin tocar nada. Detalle en ESTADO.md.

   I09 — de "ordenable" a "recorrible". El brief (P37) no pide
   reordenar pasos: pide recorrer tres momentos con un estado inicial y
   un estado final, cada uno mostrando qué cambia y qué resultado deja.
   Es una interacción distinta, no una opción nueva de la misma —
   `construirLineaTiempoOrdenable` (arrastre + botones "mover antes/
   después" + "orden correcto") queda reemplazada por
   `construirLineaTiempoRecorrible`. Ninguna otra pantalla del
   storyboard usa I09 (confirmado por búsqueda contra
   storyboard_data_v2.json), así que no hay contenido real que dependa
   del modo anterior; a diferencia de completar/numerica/autoevaluacion
   (que sí se conservaron sin número porque no cuesta nada mantener
   código que funciona y algo lo usa), aquí no queda nada que lo use —
   mantenerlo en paralelo sería la abstracción sin necesidad real que
   evita CLAUDE.md.

     I09 linea_tiempo_recorrible { enunciado?, estadoInicial, momentos:[{titulo,descripcion,cambia?,resultado?}], estadoFinal, retro? }
       - Un panel único (`.calc-recorrido__panel`) muestra un paso a la
         vez —estado inicial, cada momento, estado final, en ese
         orden— con «Anterior»/«Siguiente» (`.boton--outline`/`.boton`,
         deshabilitados en los extremos, nunca ocultos: mismo criterio
         que `.boton:disabled` desde T2). Sin arrastre ni teclado
         especial que inventar: son botones reales.
       - Cada cambio de paso se anuncia con `OVA.a11y.anunciar()` (la
         región compartida, no una propia) con el título/estado nuevo —
         mismo patrón que I07 y que el I09 anterior. El indicador
         visual "Paso X de Y" es `aria-hidden` porque el anuncio ya
         cubre esa información en prosa.
       - Al llegar al estado final por primera vez: si `retro` viene en
         los datos, se muestra en `.calc-resumen[role=status]`, y se
         reporta una sola vez a `cmi.interactions` (tipoScorm 'other',
         neutral, textoRespuesta "recorrido completo") — mismo criterio
         de "reportar al completar la exploración" que I07/I08. Volver
         atrás con «Anterior» no reporta de nuevo ni oculta el resumen
         ya mostrado.
       - Sin "correcta": es exploratorio, como I10/I11/I12 — no
         evaluado como I05.

   I10 — salidas múltiples y catálogo de fórmulas ampliado. Hasta C6
   `datos.salida` era un objeto único; P22/P24 piden cinco y tres
   resultados simultáneos del mismo cálculo. `datos.salida` (singular)
   pasa a `datos.salidas` (arreglo); cada fórmula de
   FORMULAS_CALCULADORA devuelve ahora `{ valores: {id: number, …} }`
   —un valor por cada id de `datos.salidas`— en vez de `{ valor }`, o
   `{ error }` igual que antes. El único consumidor de la forma vieja
   (`valor_accion_dividendo`, s11) se actualizó al contrato nuevo sin
   cambiar su matemática.

     I10 calculadora_parametrica { enunciado?, formula, entradas, salidas, mensajes?, accion?, variante?, mostrarAccion? }
       - `accion` (opcional): texto del botón de registro —antes fijo
         en "Registrar valorización", hoy con varias fórmulas no todas
         valorizan; por defecto "Registrar resultado".
       - `mostrarAccion` (opcional, tanda 13): por defecto true. En
         false quita el botón "Registrar resultado" y el `.calc-resumen`
         enteros — Juan lo pidió para p22 y p24 porque el botón no hacía
         nada perceptible (solo un evento SCORM neutral en segundo
         plano). `botonRegistrar`/`resumen` quedan `null` y todo el
         código que los toca (recalcular, registrar) hace guardia
         primero.
       - `variante` (opcional, tanda 13): agrega
         `calc-calculadora--<variante>` a la raíz. Dos valores existen
         (ver components.css): `"dashboard"` (p22, cinco salidas en dos
         columnas — la última ocupa las dos como fila de cierre) y
         `"dashboard-3col"` (p24, tres salidas en tres columnas, una
         cada una). Las dos son controles fijos a la izquierda,
         resultados en cuadrícula a la derecha desde 64em, con router.js
         agregando además `layout--l06--ancho` al layout cuando
         `datos.variante` empieza por `"dashboard"` (más ancho que el
         56rem estándar de L06). Por debajo de 64em ninguna hace nada —
         cae al apilado estándar de `.calc-calculadora`. Un tercer valor
         necesitaría su propia regla `grid-template-columns` en
         components.css; no hay mecanismo genérico de "N columnas" —no
         hizo falta con solo dos pantallas usándolo.
       - `salidas[].acento` (opcional, tanda 13): `"gris"` o `"naranja"`
         — agrega `calc-calculadora__resultado--<acento>` a esa fila.
         Solo tiene efecto visual dentro de una variante tablero; en la
         calculadora estándar (p42) el campo no cambia nada.
       - `salidas`: [{ id, etiqueta, unidad?, decimales?, acento? }, …] — un
         `.calc-calculadora__resultado` por salida (mismas clases de
         siempre, ahora repetidas), todas dentro de un único
         `<output class="calc-calculadora__resultados">` envolvente en
         vez de un `<output>` por salida: cinco regiones en vivo
         anunciando cada una en cada arrastre de slider sería ruido
         para un lector de pantalla; un solo `<output>` que agrupa las
         salidas anuncia un bloque de texto por recálculo, mismo
         criterio de fondo ("el resultado se anuncia en vivo") con
         menos interrupciones.
       - `mensajes` (opcional): `{ positivo?, cero?, negativo? }` — la
         fórmula decide su propio `signo` ('positivo'/'cero'/
         'negativo') según cuál de sus salidas es la que importa
         pedagógicamente (variación % en `valorizacion`, dividendo por
         acción en `dividendo_por_accion`); el motor solo hace el
         lookup `mensajes[signo]` y lo muestra en
         `.calc-calculadora__mensaje` bajo los resultados, en vivo con
         cada recálculo. Sin `mensajes` en los datos no se muestra
         nada (opcional; `valor_accion_dividendo` no lo usa).
       - Catálogo `FORMULAS_CALCULADORA`, tres miembros:
         - `valor_accion_dividendo` (T8, sin cambios de matemática):
           exige `dividendo`/`tasaCrecimiento`/`tasaDescuento`, una
           sola salida `valor`. Domain error si tasaDescuento ≤
           tasaCrecimiento, igual que siempre.
         - `valorizacion` (P22): exige exactamente `precio_compra`,
           `precio_venta`, `acciones` —los ids del payload de Jose tal
           cual, sin traducir a camelCase, para que C7 no tenga que
           reescribirlos—. Cinco salidas: `monto_invertido`,
           `diferencia_por_accion`, `variacion_porcentual`,
           `ganancia_perdida`, `monto_final_bruto`. Sin estado de
           error: los sliders del payload ya excluyen precio_compra = 0
           (mínimo 1), así que la variación porcentual nunca divide
           por cero.
         - `dividendo_por_accion` (P24): exige `utilidad_neta`,
           `porcentaje_repartir`, `acciones_totales`,
           `acciones_estudiante` (mismos ids que el payload). Tres
           salidas: `monto_a_repartir`, `dividendo_por_accion`,
           `dividendo_estudiante`. Tampoco tiene estado de error, mismo
           motivo (acciones_totales mínimo 1 en el payload).
       - Casos de prueba de Jose, verificados a mano: valorizacion
         (1000,1500,500) → 50 %, $250.000 de ganancia; (1000,800,500)
         → −20 %, −$100.000; (1000,1000,500) → 0 %, $0.
         dividendo_por_accion(20000000,50,1500,100) → $6.666,67 por
         acción, $666.666,67 del estudiante; (5000000,0,1500,100) → $0;
         (40000000,30,3600,100) → $3.333,33 por acción, $333.333,33 del
         estudiante. Los tres casos de cada fórmula quedan como los
         valores iniciales de tres instancias en la kitchen sink, una
         por caso, para que el primer render ya muestre el resultado
         esperado.

   I11 — tabla de verdad de ocho filas, no solo "compra". Hasta C6 solo
   existía comprar/mercado/límite con dos resultados (ejecutada/
   pendiente); P42 pide comprar y vender, con saldo/títulos disponibles
   como restricción adicional, y tres resultados (ejecutada/expuesta/
   rechazada). `construirBoletaCompra` queda reemplazada por
   `construirBoletaOrden`, misma cáscara `.calc-calculadora`.

     I11 boleta_compra { enunciado?, emisor?, escenario:{saldo,titulosDisponibles}, precioActual, precioLimite, cantidad, variable? }
       - `precioActual`/`precioLimite`/`cantidad`: el mismo objeto
         slider de siempre (`{etiqueta?, unidad?, min,max,paso,
         valorInicial, decimales?}`); `escenario.saldo`/
         `escenario.titulosDisponibles` son datos fijos del ejercicio
         (no sliders —el "campo" real de Jose que sí varía es la
         cantidad, no el saldo disponible—), mostrados en una línea de
         contexto encima de los controles junto con `emisor` si viene.
       - Selector de operación (Comprar/Vender), además del de tipo
         (Mercado/Límite) que ya existía —mismo `<fieldset>` con radios
         nativos, comprar marcado por defecto.
       - `datos.vigencia` NO se construyó: ninguna fila de la tabla de
         verdad de Jose ni ningún caso_prueba distingue por vigencia
         —solo aparece en el texto de "expuesta" ("vigente hasta que el
         precio llegue o venza", texto fijo, igual que lo describe P43.
         Añadir un campo que no cambia ningún resultado sería
         decoración, no la interacción que pide el cierre de C6. Si el
         storyboard real termina necesitando que la vigencia sí afecte
         el resultado, hay que decirlo explícitamente —lectura propia,
         documentada para poder corregirla sin arqueología de código,
         mismo criterio que el botón de reanudar en T3.
       - Regla de ejecución, la tabla de verdad completa de P42:
         comprar prioriza el saldo sobre el precio (saldo insuficiente
         → rechazada siempre, sin mirar el tipo de orden); con saldo
         suficiente, mercado siempre ejecuta, límite ejecuta solo si
         límite ≥ precio actual (si no, expuesta). Vender es el espejo:
         títulos insuficientes → rechazada siempre; con títulos
         suficientes, mercado siempre ejecuta, límite ejecuta solo si
         límite ≤ precio actual (si no, expuesta). El costo/producto de
         la operación es `precioActual × cantidad` (se ejecuta "al
         precio disponible estimado", el texto de Jose) —el precio
         límite nunca es el precio de ejecución, solo la condición que
         decide si se ejecuta.
       - Estados nuevos de `.calc-calculadora__resultado`: `rechazada`
         (rojo, ícono `block` —mismo tratamiento de color que
         `incorrecto`, con su propia regla CSS porque significa algo
         distinto) y `expuesta` (neutro, ícono `schedule` —el mismo
         "pendiente" de antes, renombrado a la palabra que usa Jose).
         `ejecutada` no cambió.
       - `datos.variable`: mismo mecanismo que antes (fija el objeto
         completo del resultado en `enviar()`), con un campo más:
         `{ operacion, tipo, estado, cantidad, precioActual,
         precioLimite }` —sigue siendo la base de resultado_boleta.
       - Casos de prueba de Jose, verificados a mano: comprar/mercado/
         5 acciones con saldo 10.000 y precio 1.200 (costo 6.000 ≤
         saldo) → ejecutada; comprar/límite $1.100 con precio actual
         1.200 (límite < precio) → expuesta; vender 20 acciones con
         solo 8 títulos disponibles → rechazada (títulos insuficientes,
         sin importar el tipo). Los tres quedan como los valores
         iniciales de tres instancias en la kitchen sink.

   I12 — matriz de retroalimentación por perfil de riesgo. Hasta C6
   solo validaba que la suma diera 100 %; P46 pide que, además, la
   herramienta reaccione según el `perfil_riesgo` que dejó I13 (C5) en
   `OVA.state` —la cadena "perfil de riesgo → portafolio" que
   PLAN-CONTENIDO.md marca como parte innegociable del demo.

     I12 distribucion_capital { enunciado?, categorias:[{id,etiqueta,riesgo?,valorInicial}], reglas?:[{perfil,condiciones:[condicion,…],retro}], aviso? }
       - Sin `reglas` o sin `perfil_riesgo` todavía en `OVA.state` (el
         estudiante no ha llegado a I13), el componente se comporta
         exactamente como antes de C6: valida la suma a 100 % y no
         muestra ninguna retro de perfil —la variable puede no existir
         todavía y eso no es un error, es el mismo estado "sin dato"
         que ya establecieron L08/C4.
       - Con `perfil_riesgo` conocido, `reglas` se evalúa filtrando por
         `regla.perfil === perfil` y, dentro de esas, la primera cuyas
         `condiciones` cumplan TODAS (AND implícito, mismo criterio que
         "primera que aplica gana" de `resultado.reglas` en L08 e I13)
         —nunca la más específica ni la de mayor puntaje, el orden del
         arreglo es la prioridad, a cargo del contenido.
       - Cada `condicion` es una de dos formas: `{ emisor:id,
         operador:'>'|'>='|'<'|'<='|'entre', valor?, min?, max? }`
         (compara el porcentaje de un emisor) o `{
         tipo:'ningunoSupera'|'algunoSupera', valor }` (compara contra
         todos los emisores a la vez) —el vocabulario mínimo que pide
         la matriz real de P46 ("Petrocaribe > 40 %", "ninguno > 60 %",
         "un emisor > 60 %", "Petrocaribe 30–60 %"). No es un parser de
         lenguaje natural: C7 traduce el texto de Jose a esta forma una
         sola vez al convertir P46, igual que ya tradujo las
         condiciones de `resultado.reglas` en L08.
       - Sin match dentro del perfil (posible: los seis renglones de
         Jose no cubren cada combinación, p. ej. agresivo con
         Petrocaribe < 30 %), se muestra un aviso genérico ("Revisa la
         coherencia entre tu perfil y esta distribución.") en vez de
         fabricar una categoría de retro que Jose no escribió —mismo
         principio que el "sin match" de I13.
       - La retro (o el genérico) se recalcula en vivo con cada slider,
         en `.calc-calculadora__retro` bajo el total —visible solo
         cuando la suma es 100 % (con la suma incompleta no hay
         distribución real que evaluar). `datos.aviso` (el descargo "No
         constituye recomendación de inversión") se muestra siempre que
         hay una retro, mismo patrón que `datos.aviso` en I13. Al
         pulsar «Registrar distribución» el resumen (`role=status`)
         repite la retro vigente, así que se anuncia una vez de forma
         explícita en vez de depender del recálculo en vivo (que no es
         `role=status`, para no inundar de anuncios cada arrastre de
         slider —mismo razonamiento que el `<output>` único de I10).
       - Caso de prueba de Jose, verificado a mano: perfil conservador
         con Petrocaribe en 45 % → matchea la primera regla de
         conservador ("Petrocaribe > 40 %") antes que la segunda. La
         kitchen sink fija `perfil_riesgo` con
         `OVA.state.establecerVariable()` antes de montar tres
         instancias de I12 —una por perfil— para poder ver las seis
         reglas sin depender de responder I13 primero.

   ---------------------------------------------------------------------
   E1 (PLAN-ESTRUCTURA.md §2) — I15 cuestionario. Única excepción al
   contrato "una pregunta por pantalla" que fija CLAUDE.md (la letra se
   corrige en E7, no antes): varias preguntas gradables del catálogo de
   arriba (CONSTRUCTORES, I01–I05/completar/numerica/autoevaluacion —
   nunca CONSTRUCTORES_INSIGNIA, I15 no admite otra I15 ni I07/I08/I09–
   I13 dentro de "preguntas") dentro de una sola interacción, con un
   bloque de resultado compartido al terminar. Se despacha por
   CONSTRUCTORES_INSIGNIA como I07/I08/I13: arma su propio DOM completo
   (varios <form> independientes, uno por pregunta, más el bloque de
   resultado) y decide ella misma cuándo reportar.

     I15 cuestionario {
       enunciado?,
       preguntas: [ { tipo:'I01'|'I02'|…, datos:{…} } … ],  // misma
         forma que cada tipo ya documenta arriba; datos.id de cada una
         sigue siendo el id real que reporta cmi.interactions (p. ej.
         "u1-p05-diagnostico-1..5", que Pablo ya tiene mapeados) — I15
         no los toca ni los renumera.
       variable?: { nombre, modo?, valor? },  // acumulador ÚNICO (mismo
         objeto que datos.variable del catálogo de arriba — ver el
         bloque C4): se aplica a CADA pregunta que resuelva "correcto",
         en vez de que las cinco repitan su propio "variable".
       resultado?: { variable, campo?, reglas?, cifra?, retro?,
                     locucion? }  // todo menos "locucion" es el mismo
         objeto que ya resuelve OVA.resultado.resolver() para
         PLANTILLAS.L08 (resultado.js) — "reusar, no duplicar" la regla
         "primera que aplica gana". Sin "resultado", la batería reporta
         la nota y se acaba sin cifra/callout.
         "locucion" (ajustes tanda 10) es el mismo contrato de
         media.tipo 'avatar' sin el campo "tipo" —imagen, audio?, vtt?,
         variante?, transcripcion— y la monta esta interacción, no
         router.js: el audio comenta el resultado, así que pertenece a
         la vista de resultado y no a la pantalla.
     }

   Reusa los constructores de pregunta que ya existen (CONSTRUCTORES) —
   no reimplementa I01 ni I02. Cinco trampas, verificadas con Playwright
   antes de dar la tarea por cerrada (ver ESTADO.md):

   1. cmi.core.score.raw pisado cinco veces. Cada pregunta reporta su
      propia fila a cmi.interactions (reportarSCORM, igual que siempre)
      pero NINGUNA llama a actualizarNota(): eso pisaría cinco veces
      cmi.core.score.raw y la nota final sería la de la última
      respondida. I15 calcula la nota una sola vez, al resolver la
      última pregunta, como porcentaje de aciertos sobre el total.
   2. El intento no se persiste entre recargas (T6, sin cambios) — con
      cinco preguntas eso dejaría al estudiante "encerrado" tras un F5
      a media batería (visitada pero sin forma de completarla). I15
      marca la terminación de la BATERÍA COMPLETA (no cada pregunta) en
      una variable de contenido dedicada (idScorm + "-completo",
      state.js ya la persiste y ya la reporta) y, al montar, si esa
      marca ya está en true, arranca con las cinco preguntas bloqueadas
      —sin reconstruir qué se respondió, eso sí se pierde— y el bloque
      de resultado visible de una, sin repetir el reporte a
      cmi.interactions ni recalcular la nota.
   3. Alto: cinco preguntas con sus retros no caben en ~780px del
      contenedor SCORM. Es scroll real dentro de #app (regla dura 9),
      no un contenedor propio con su propio overflow. El contador "N de
      5" va pegado a cada pregunta, no arriba del todo — se ve sin
      volver arriba aunque el estudiante esté a mitad de la lista.
   4. Revelar sin robar el foco: ninguna llamada a .focus() en todo el
      constructor — la retro de cada pregunta (ya existente, I14) y el
      bloque de resultado final son role="status", se anuncian solos,
      igual que el resto del catálogo.
   5. El resultado no es solo color: la cifra final lleva etiqueta
      (charts.js) y el callout ícono + título (resultado.js) — mismos
      componentes que ya cumplían la regla en L08.

   ---------------------------------------------------------------------
   Ajustes tanda 10 — una pregunta a la vez y resultado aparte.

   La batería sigue siendo UNA pantalla (eso no cambió: el recorrido de
   26 pantallas de PLAN-ESTRUCTURA.md no crece), pero dentro de ella se
   ve una sola pregunta. Al resolverse, la retroalimentación queda en
   pantalla y aparece "Siguiente pregunta"; en la quinta, "Ver mi
   resultado". Ese clic oculta la lista entera y el enunciado, y deja la
   vista de resultado: encabezado, cifra, callout y la carta de locución
   (variante avatar-sm en p05-diagnostico).

   Dos consecuencias que corrigen notas de arriba:

   - **La trampa 3 deja de aplicar como estaba escrita.** Con una
     pregunta visible, el alto del contenedor SCORM ya no es el problema
     que era; el contador sigue pegado a cada pregunta igual, ahora
     porque es lo único que dice por dónde va.
   - **La trampa 4 cambia de solución, no de principio.** El bloque de
     resultado ya no lleva role="status": no se revela solo, se llega
     con un clic, y el botón que tenía el foco desaparece con la lista.
     Dejar el foco caer al <body> sería peor que moverlo, así que la
     vista de resultado estrena un `<h3>Tu resultado</h3>` con
     `tabIndex = -1` que recibe el foco — mismo patrón que
     OVA.a11y.enfocarEncabezado() entre pantallas. Al montar con la
     batería ya completa (trampa 2) no se enfoca nada: ahí nadie hizo
     clic. El cambio de pregunta se anuncia con OVA.a11y.anunciar()
     porque el contenedor que recibe el foco no es un encabezado.

   `alCompletar()` (E2, abajo) sigue disparándose al RESOLVER la última
   pregunta, no al abrir el resultado: bloqueaAvance mide "respondió la
   actividad", y la vista de resultado es lectura, no un requisito más.

   ---------------------------------------------------------------------
   E2 (PLAN-ESTRUCTURA.md §3) — bloqueaAvance. crear(interaccion, opciones)
   admite un segundo argumento opcional, `{ alCompletar }`: el canal
   mínimo de vuelta desde una interacción hacia router.js, para el caso
   "el botón Siguiente queda inerte hasta terminar esta actividad". El
   motor (quiz.js) no decide cuándo una interacción "está completa" —
   eso lo sabe cada constructor, no un bus de eventos genérico:
     - Preguntas del catálogo (CONSTRUCTORES): crear() llama a
       alCompletar() la primera vez que comprobar() bloquea la pregunta
       (acierto, agotó intentos o no es gradable) — el mismo momento en
       que hoy oculta "Comprobar" para siempre.
     - I15 (construirCuestionario, la única que lo usa hoy — ver E4 en
       PLAN-ESTRUCTURA.md): llama a alCompletar() al resolver la última
       pregunta de la batería, y también al montar si la marca de
       finalización ya estaba en true (trampa 2 de E1) — un F5 después
       de terminar no debe dejar "Siguiente" bloqueado de nuevo.
     - El resto de CONSTRUCTORES_INSIGNIA (I07–I13) reciben el mismo
       `alCompletar` como argumento pero ninguno lo llama todavía: son
       exploratorias, sin "completo" definido, y ninguna pantalla real
       las usa con bloqueaAvance — si una futura sí lo necesita, ese
       constructor decide su propio momento, no se inventa uno aquí.
   Sin `opciones` (el caso de siempre, sin bloqueaAvance), alCompletar
   es un no-op — ninguna interacción existente cambia de comportamiento.

   ---------------------------------------------------------------------
   Ajustes tanda 15 (12 sep) — I16 simulador_dividendos. Segundo tipo
   fuera de BRIEF-DI.md, después de I15: el DI rehízo el ejercicio de p24
   (pantalla 18) porque la calculadora paramétrica no cumplía el objetivo
   pedagógico. Reemplaza a I10/`dividendo_por_accion` SOLO en esa
   pantalla — I10 y su fórmula quedan intactas (p22 las sigue usando, y
   la kitchen sink conserva las tres instancias de I10). Despacha por
   CONSTRUCTORES_INSIGNIA como I07–I13/I15. El contrato completo y el
   porqué de un tipo propio en vez de cuatro campos opcionales nuevos en
   I10 están documentados junto a su constructor
   (construirSimuladorDividendos), no aquí — mismo criterio que el resto
   de las insignia.
   ============================================================ */
(function () {
  'use strict';

  var contadorInstancias = 0;

  /* ---- Utilidades -------------------------------------------------- */

  function crear_(tag, className, texto) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (texto != null) el.textContent = texto;
    return el;
  }

  function normalizar(texto) {
    return String(texto == null ? '' : texto)
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ');
  }

  // `decimalesMax` (ajustes tanda 15, opcional): permite "0 decimales si
  // la cifra es redonda, hasta N si no" —lo que necesita I16 para que
  // $30 se lea $30 y $16,65 no se redondee a $17 y deje de cuadrar con
  // la operación que la cita—. Sin el tercer argumento, idéntica a
  // siempre: mínimo y máximo son el mismo número.
  function formatearNumero(valor, decimales, decimalesMax) {
    var n = Number(valor);
    var d = decimales == null ? 0 : decimales;
    var dMax = decimalesMax == null ? d : decimalesMax;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: d,
      maximumFractionDigits: Math.max(d, dMax)
    }).format(n);
  }

  function mismosConjuntos(a, b) {
    if (a.length !== b.length) return false;
    var sa = a.slice().sort();
    var sb = b.slice().sort();
    for (var i = 0; i < sa.length; i++) {
      if (sa[i] !== sb[i]) return false;
    }
    return true;
  }

  function horaSCORM() {
    var d = new Date();
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  // C6 (I12) — evalúa una condición de la matriz de retro contra los
  // porcentajes vigentes ({id: numero}). Ver el bloque C6 en el
  // encabezado del archivo para el vocabulario completo.
  function evaluarCondicionRiesgo(condicion, porcentajes) {
    if (condicion.tipo === 'ningunoSupera') {
      return Object.keys(porcentajes).every(function (id) { return porcentajes[id] <= condicion.valor; });
    }
    if (condicion.tipo === 'algunoSupera') {
      return Object.keys(porcentajes).some(function (id) { return porcentajes[id] > condicion.valor; });
    }
    var v = porcentajes[condicion.emisor];
    if (v == null) return false;
    switch (condicion.operador) {
      case '>': return v > condicion.valor;
      case '>=': return v >= condicion.valor;
      case '<': return v < condicion.valor;
      case '<=': return v <= condicion.valor;
      case 'entre': return v >= condicion.min && v <= condicion.max;
      default: return false;
    }
  }

  function buscarRetroPerfil(reglas, perfil, porcentajes) {
    for (var i = 0; i < reglas.length; i++) {
      var regla = reglas[i];
      if (regla.perfil !== perfil) continue;
      var cumple = (regla.condiciones || []).every(function (c) { return evaluarCondicionRiesgo(c, porcentajes); });
      if (cumple) return regla.retro;
    }
    return null;
  }

  function reportarSCORM(pregunta, resultado) {
    if (!OVA.scorm.disponible()) return;
    var n = parseInt(OVA.scorm.obtenerValor('cmi.interactions._count'), 10);
    if (isNaN(n) || n < 0) n = 0;
    var base = 'cmi.interactions.' + n + '.';
    OVA.scorm.establecerValor(base + 'id', pregunta.idScorm);
    OVA.scorm.establecerValor(base + 'type', pregunta.tipoScorm);
    OVA.scorm.establecerValor(base + 'student_response', pregunta.textoRespuesta());
    var correcta = pregunta.textoCorrecta();
    if (correcta) OVA.scorm.establecerValor(base + 'correct_responses.0.pattern', correcta);
    OVA.scorm.establecerValor(
      base + 'result',
      resultado === 'correcto' ? 'correct' : (resultado === 'incorrecto' ? 'wrong' : 'neutral')
    );
    OVA.scorm.establecerValor(base + 'time', horaSCORM());
    OVA.scorm.confirmar();
  }

  // C4 — ver el bloque "datos.variable" del encabezado. Solo se llama
  // desde comprobar() (I01–I05/completar/numerica/autoevaluacion) con
  // el resultado real de evaluar(); nunca desde una interacción
  // insignia, que no tiene un "correcto" así (I11 escribe su variable
  // directo en enviar(), sin pasar por aquí).
  function actualizarVariableContenido(cfgVariable, resultado) {
    if (!cfgVariable || !cfgVariable.nombre) return;
    if (resultado !== 'correcto') return;
    if (cfgVariable.modo === 'fijar') {
      OVA.state.establecerVariable(cfgVariable.nombre, cfgVariable.valor);
    } else {
      OVA.state.incrementarVariable(cfgVariable.nombre, 1);
    }
  }

  /* ---- Bloque de retroalimentación (I14) ---------------------------
     Compartido por las ocho preguntas. El estado nunca es solo color
     (regla dura de CLAUDE.md): ícono y texto cambian juntos. Anima con
     --dur-base (ítem 3 del inventario de movimiento — "la que más
     comunica"); role="status" para que un lector de pantalla lo
     anuncie solo, sin que quien monta la pregunta tenga que saber de
     aria-live (mismo criterio que .aviso-logro en T5). */
  function crearRetro() {
    var retro = crear_('div', 'quiz-retro');
    retro.setAttribute('role', 'status');
    retro.hidden = true;
    var icono = crear_('span', 'icono quiz-retro__icono');
    icono.setAttribute('aria-hidden', 'true');
    var texto = crear_('div', 'quiz-retro__texto');
    var titulo = crear_('p', 'quiz-retro__titulo');
    var detalle = crear_('p', 'tipo-cuerpo-sm quiz-retro__detalle');
    detalle.hidden = true;
    texto.appendChild(titulo);
    texto.appendChild(detalle);
    retro.appendChild(icono);
    retro.appendChild(texto);

    function mostrar(estado, tituloTexto, detalleTexto) {
      retro.dataset.estado = estado;
      icono.textContent = estado === 'correcto' ? 'check_circle' : (estado === 'incorrecto' ? 'cancel' : 'task_alt');
      titulo.textContent = tituloTexto;
      if (detalleTexto) {
        detalle.textContent = detalleTexto;
        detalle.hidden = false;
      } else {
        detalle.textContent = '';
        detalle.hidden = true;
      }
      retro.hidden = false;
      // Reinicia la animación si ya se jugó (reintentar tras un intento
      // anterior): quitar y forzar reflow antes de volver a agregar la
      // clase, mismo patrón que el botón de demo de la insignia en T5.
      retro.classList.remove('quiz-retro--entrada');
      void retro.offsetWidth;
      retro.classList.add('quiz-retro--entrada');
    }

    function ocultar() {
      retro.hidden = true;
      retro.classList.remove('quiz-retro--entrada');
      // Quita cualquier nota de "respuesta correcta" de un intento
      // agotado anterior: reintentar no debería dejarla colgando.
      Array.prototype.slice.call(texto.querySelectorAll('.quiz-pregunta__correcta')).forEach(function (nota) {
        nota.remove();
      });
    }

    // Agrega la nota de "respuesta correcta" (revelarCorrecta() de cada
    // tipo) dentro del propio bloque role="status": si quedara como
    // hermano en el fieldset, un lector de pantalla que reacciona a la
    // región en vivo nunca la escucharía, solo la vería quien mira la
    // pantalla — mismo espíritu de la regla dura "el color nunca es el
    // único código de un estado", extendido a "el estado se anuncia
    // completo, no a medias".
    function agregarNota(texto_) {
      var nota = crear_('p', 'tipo-cuerpo-sm quiz-pregunta__correcta', texto_);
      texto.appendChild(nota);
    }

    return { elemento: retro, mostrar: mostrar, ocultar: ocultar, agregarNota: agregarNota };
  }

  /* ---- Constructores por tipo --------------------------------------
     Cada uno arma su <fieldset>/<legend> real (cierre de PLAN.md) y
     devuelve la misma interfaz: fieldset, retro, tipoScorm, idScorm,
     textoRespuesta()/textoCorrecta() (para cmi.interactions),
     evaluar() ('correcto'|'incorrecto'|null — null es autoevaluacion, no
     gradable), bloquear()/desbloquear() y revelarCorrecta(). */

  function construirVerdaderoFalso(idBase, idScorm, datos) {
    var nombre = idBase + '-vf';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var opciones = crear_('div', 'quiz-pregunta__opciones');
    var radios = {};
    [['true', 'Verdadero'], ['false', 'Falso']].forEach(function (par) {
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = nombre;
      input.value = par[0];
      var fila = crear_('label', 'quiz-opcion');
      fila.appendChild(input);
      fila.appendChild(document.createTextNode(par[1]));
      opciones.appendChild(fila);
      radios[par[0]] = input;
    });
    fieldset.appendChild(opciones);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function seleccion() {
      return radios.true.checked ? 'true' : (radios.false.checked ? 'false' : '');
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'true-false',
      idScorm: idScorm,
      textoRespuesta: seleccion,
      textoCorrecta: function () { return String(!!datos.respuestaCorrecta); },
      evaluar: function () {
        var s = seleccion();
        return s ? (s === String(!!datos.respuestaCorrecta) ? 'correcto' : 'incorrecto') : 'incorrecto';
      },
      bloquear: function () { radios.true.disabled = true; radios.false.disabled = true; },
      desbloquear: function () { radios.true.disabled = false; radios.false.disabled = false; },
      revelarCorrecta: function () {
        retro.agregarNota('Respuesta correcta: ' + (datos.respuestaCorrecta ? 'Verdadero' : 'Falso'));
      }
    };
  }

  function construirOpcionUnica(idBase, idScorm, datos) {
    var nombre = idBase + '-ou';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var opciones = crear_('div', 'quiz-pregunta__opciones');
    var inputs = [];
    (datos.opciones || []).forEach(function (opcion) {
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = nombre;
      input.value = opcion.id;
      var fila = crear_('label', 'quiz-opcion');
      fila.appendChild(input);
      fila.appendChild(document.createTextNode(opcion.texto));
      opciones.appendChild(fila);
      inputs.push(input);
    });
    fieldset.appendChild(opciones);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function seleccion() {
      var elegido = inputs.filter(function (i) { return i.checked; })[0];
      return elegido ? elegido.value : '';
    }
    function textoOpcion(id) {
      var opcion = (datos.opciones || []).filter(function (o) { return o.id === id; })[0];
      return opcion ? opcion.texto : id;
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'choice',
      idScorm: idScorm,
      textoRespuesta: seleccion,
      textoCorrecta: function () { return datos.correcta || ''; },
      evaluar: function () {
        var s = seleccion();
        return s ? (s === datos.correcta ? 'correcto' : 'incorrecto') : 'incorrecto';
      },
      bloquear: function () { inputs.forEach(function (i) { i.disabled = true; }); },
      desbloquear: function () { inputs.forEach(function (i) { i.disabled = false; }); },
      revelarCorrecta: function () {
        retro.agregarNota('Respuesta correcta: ' + textoOpcion(datos.correcta));
      }
    };
  }

  function construirOpcionMultiple(idBase, idScorm, datos) {
    var nombre = idBase + '-om';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var opciones = crear_('div', 'quiz-pregunta__opciones');
    var inputs = [];
    (datos.opciones || []).forEach(function (opcion) {
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.name = nombre;
      input.value = opcion.id;
      var fila = crear_('label', 'quiz-opcion');
      fila.appendChild(input);
      fila.appendChild(document.createTextNode(opcion.texto));
      opciones.appendChild(fila);
      inputs.push(input);
    });
    fieldset.appendChild(opciones);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function seleccion() {
      return inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
    }
    function textoOpciones(ids) {
      return ids.map(function (id) {
        var opcion = (datos.opciones || []).filter(function (o) { return o.id === id; })[0];
        return opcion ? opcion.texto : id;
      }).join(', ');
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'choice',
      idScorm: idScorm,
      textoRespuesta: function () { return seleccion().join(','); },
      textoCorrecta: function () { return (datos.correctas || []).join(','); },
      evaluar: function () { return mismosConjuntos(seleccion(), datos.correctas || []) ? 'correcto' : 'incorrecto'; },
      bloquear: function () { inputs.forEach(function (i) { i.disabled = true; }); },
      desbloquear: function () { inputs.forEach(function (i) { i.disabled = false; }); },
      revelarCorrecta: function () {
        retro.agregarNota('Respuesta correcta: ' + textoOpciones(datos.correctas || []));
      }
    };
  }

  function construirRelacionar(idBase, idScorm, datos) {
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var filas = crear_('div', 'quiz-pregunta__filas');
    var selects = {};
    (datos.izquierda || []).forEach(function (item) {
      var selectId = idBase + '-rel-' + item.id;
      var fila = crear_('div', 'quiz-pregunta__fila');
      var label = crear_('label', 'quiz-pregunta__etiqueta', item.texto);
      label.setAttribute('for', selectId);
      var select = document.createElement('select');
      select.id = selectId;
      var vacio = crear_('option', null, 'Selecciona…');
      vacio.value = '';
      select.appendChild(vacio);
      (datos.derecha || []).forEach(function (opcionDer) {
        var opt = crear_('option', null, opcionDer.texto);
        opt.value = opcionDer.id;
        select.appendChild(opt);
      });
      fila.appendChild(label);
      fila.appendChild(select);
      filas.appendChild(fila);
      selects[item.id] = select;
    });
    fieldset.appendChild(filas);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function seleccion() {
      var r = {};
      Object.keys(selects).forEach(function (id) { r[id] = selects[id].value; });
      return r;
    }
    function formatearPares(pares) {
      return Object.keys(pares).map(function (k) { return k + '.' + pares[k]; }).join(',');
    }
    function textoDerecha(id) {
      var opcion = (datos.derecha || []).filter(function (o) { return o.id === id; })[0];
      return opcion ? opcion.texto : id;
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'matching',
      idScorm: idScorm,
      textoRespuesta: function () { return formatearPares(seleccion()); },
      textoCorrecta: function () { return formatearPares(datos.pares || {}); },
      evaluar: function () {
        var sel = seleccion();
        var pares = datos.pares || {};
        var claves = Object.keys(pares);
        for (var i = 0; i < claves.length; i++) {
          if (!sel[claves[i]] || sel[claves[i]] !== pares[claves[i]]) return 'incorrecto';
        }
        return 'correcto';
      },
      bloquear: function () { Object.keys(selects).forEach(function (id) { selects[id].disabled = true; }); },
      desbloquear: function () { Object.keys(selects).forEach(function (id) { selects[id].disabled = false; }); },
      revelarCorrecta: function () {
        var pares = datos.pares || {};
        var texto = Object.keys(pares).map(function (izqId) {
          var izq = (datos.izquierda || []).filter(function (o) { return o.id === izqId; })[0];
          return (izq ? izq.texto : izqId) + ' → ' + textoDerecha(pares[izqId]);
        }).join('; ');
        retro.agregarNota('Respuesta correcta: ' + texto);
      }
    };
  }

  function construirOrdenar(idBase, idScorm, datos) {
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var filas = crear_('div', 'quiz-pregunta__filas');
    var pasos = datos.pasos || [];
    var entradas = [];
    pasos.forEach(function (paso) {
      var selectId = idBase + '-ord-' + paso.id;
      var fila = crear_('div', 'quiz-pregunta__fila');
      var label = crear_('label', 'quiz-pregunta__etiqueta', paso.texto);
      label.setAttribute('for', selectId);
      var select = document.createElement('select');
      select.id = selectId;
      var vacio = crear_('option', null, 'Posición…');
      vacio.value = '';
      select.appendChild(vacio);
      for (var p = 1; p <= pasos.length; p++) {
        var opt = crear_('option', null, String(p));
        opt.value = String(p);
        select.appendChild(opt);
      }
      fila.appendChild(label);
      fila.appendChild(select);
      filas.appendChild(fila);
      entradas.push({ id: paso.id, select: select });
    });
    fieldset.appendChild(filas);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function ordenElegido() {
      return entradas.slice().sort(function (a, b) {
        var pa = parseInt(a.select.value, 10);
        var pb = parseInt(b.select.value, 10);
        return (isNaN(pa) ? 999 : pa) - (isNaN(pb) ? 999 : pb);
      }).map(function (e) { return e.id; });
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'sequencing',
      idScorm: idScorm,
      textoRespuesta: function () { return ordenElegido().join(','); },
      textoCorrecta: function () { return (datos.orden || []).join(','); },
      evaluar: function () {
        var elegido = ordenElegido();
        var correcto = datos.orden || [];
        if (entradas.some(function (e) { return !e.select.value; })) return 'incorrecto';
        if (elegido.length !== correcto.length) return 'incorrecto';
        for (var i = 0; i < correcto.length; i++) {
          if (elegido[i] !== correcto[i]) return 'incorrecto';
        }
        return 'correcto';
      },
      bloquear: function () { entradas.forEach(function (e) { e.select.disabled = true; }); },
      desbloquear: function () { entradas.forEach(function (e) { e.select.disabled = false; }); },
      revelarCorrecta: function () {
        var orden = datos.orden || [];
        entradas.forEach(function (e) {
          var posicion = orden.indexOf(e.id) + 1;
          if (posicion > 0) e.select.value = String(posicion);
        });
        var texto = orden.map(function (id) {
          var paso = pasos.filter(function (p) { return p.id === id; })[0];
          return paso ? paso.texto : id;
        }).join(' → ');
        retro.agregarNota('Orden correcto: ' + texto);
      }
    };
  }

  function construirCompletar(idBase, idScorm, datos) {
    var inputId = idBase + '-comp';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var campo = crear_('div', 'quiz-pregunta__campo');
    var label = crear_('label', 'quiz-pregunta__etiqueta', 'Tu respuesta');
    label.setAttribute('for', inputId);
    var input = document.createElement('input');
    input.type = 'text';
    input.id = inputId;
    input.autocomplete = 'off';
    campo.appendChild(label);
    campo.appendChild(input);
    fieldset.appendChild(campo);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'fill-in',
      idScorm: idScorm,
      textoRespuesta: function () { return input.value; },
      textoCorrecta: function () { return (datos.respuestas || [])[0] || ''; },
      evaluar: function () {
        var v = normalizar(input.value);
        if (!v) return 'incorrecto';
        var aceptadas = (datos.respuestas || []).map(normalizar);
        return aceptadas.indexOf(v) !== -1 ? 'correcto' : 'incorrecto';
      },
      bloquear: function () { input.disabled = true; },
      desbloquear: function () { input.disabled = false; },
      revelarCorrecta: function () {
        retro.agregarNota('Respuesta correcta: ' + (datos.respuestas || []).join(' / '));
      }
    };
  }

  function construirNumerica(idBase, idScorm, datos) {
    var inputId = idBase + '-num';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var campo = crear_('div', 'quiz-pregunta__campo');
    var label = crear_('label', 'quiz-pregunta__etiqueta', 'Tu respuesta');
    label.setAttribute('for', inputId);
    var input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.id = inputId;
    campo.appendChild(label);
    campo.appendChild(input);
    if (datos.unidad) {
      var unidadId = idBase + '-num-unidad';
      var unidad = crear_('span', 'quiz-pregunta__unidad', datos.unidad);
      unidad.id = unidadId;
      input.setAttribute('aria-describedby', unidadId);
      campo.appendChild(unidad);
    }
    fieldset.appendChild(campo);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    function textoConUnidad(valor) {
      return String(valor) + (datos.unidad ? ' ' + datos.unidad : '');
    }

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'numeric',
      idScorm: idScorm,
      textoRespuesta: function () { return input.value; },
      textoCorrecta: function () { return String(datos.respuesta); },
      evaluar: function () {
        var v = parseFloat(input.value);
        if (isNaN(v)) return 'incorrecto';
        var tolerancia = datos.tolerancia || 0;
        return Math.abs(v - datos.respuesta) <= tolerancia ? 'correcto' : 'incorrecto';
      },
      bloquear: function () { input.disabled = true; },
      desbloquear: function () { input.disabled = false; },
      revelarCorrecta: function () {
        retro.agregarNota('Respuesta correcta: ' + textoConUnidad(datos.respuesta));
      }
    };
  }

  function construirAutoevaluacion(idBase, idScorm, datos) {
    var nombre = idBase + '-auto';
    var fieldset = crear_('fieldset', 'quiz-pregunta');
    fieldset.appendChild(crear_('legend', 'quiz-pregunta__enunciado tipo-h5', datos.enunciado));
    var opciones = crear_('div', 'quiz-pregunta__escala');
    var inputs = [];
    (datos.escala || []).forEach(function (item) {
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = nombre;
      input.value = String(item.valor);
      var fila = crear_('label', 'quiz-opcion quiz-opcion--escala');
      fila.appendChild(input);
      fila.appendChild(document.createTextNode(item.texto));
      opciones.appendChild(fila);
      inputs.push(input);
    });
    fieldset.appendChild(opciones);
    var retro = crearRetro();
    fieldset.appendChild(retro.elemento);

    return {
      fieldset: fieldset,
      retro: retro,
      tipoScorm: 'likert',
      idScorm: idScorm,
      // Sin respuesta correcta: la escala es autoevaluación, no
      // evaluación. evaluar() devuelve null a propósito — es la única
      // señal que usa comprobar() para no calificarla ni reportar
      // correct_responses.
      textoRespuesta: function () {
        var elegido = inputs.filter(function (i) { return i.checked; })[0];
        return elegido ? elegido.value : '';
      },
      textoCorrecta: function () { return null; },
      evaluar: function () { return null; },
      bloquear: function () { inputs.forEach(function (i) { i.disabled = true; }); },
      desbloquear: function () { inputs.forEach(function (i) { i.disabled = false; }); },
      revelarCorrecta: function () {}
    };
  }

  /* ---- Interacciones insignia (T8) ----------------------------------
     I10, la primera de las cuatro (I10 → I11 → I09 → I12, orden de
     PLAN.md). Ver la nota de arquitectura en el encabezado del archivo:
     no son preguntas, así que no pasan por el fieldset/Comprobar/
     Reintentar compartido — cada una arma su propio DOM completo. */

  // Catálogo cerrado de fórmulas para I10: el contenido elige un
  // nombre ya implementado, nunca una expresión arbitraria (mismo
  // criterio que el catálogo de tipos de charts.js). Cada fórmula recibe
  // los valores actuales de las entradas (objeto id → number) y devuelve
  // { valor } o { error } — nunca un NaN silencioso.
  var FORMULAS_CALCULADORA = {
    // Modelo de descuento de dividendos (Gordon): valor = D1 / (r − g).
    // Exige los ids dividendo/tasaCrecimiento/tasaDescuento en `entradas`
    // (documentado en el encabezado del archivo). Una sola salida: 'valor'.
    valor_accion_dividendo: function (valores) {
      var dividendo = valores.dividendo;
      var r = valores.tasaDescuento / 100;
      var g = valores.tasaCrecimiento / 100;
      if (!(r - g > 0)) {
        return { error: 'La tasa de descuento debe ser mayor que la de crecimiento para que exista un valor.' };
      }
      return { valores: { valor: dividendo / (r - g) } };
    },

    // C6 (P22) — valorización/desvalorización de una compra de acciones.
    // Exige los ids precio_compra/precio_venta/acciones (tal cual el
    // payload de Jose). Cinco salidas: monto_invertido,
    // diferencia_por_accion, variacion_porcentual, ganancia_perdida,
    // monto_final_bruto. Sin estado de error: precio_compra > 0 por el
    // mínimo del slider (documentado en el encabezado del archivo).
    valorizacion: function (valores) {
      var compra = valores.precio_compra;
      var venta = valores.precio_venta;
      var acciones = valores.acciones;
      var diferencia = venta - compra;
      var variacion = (diferencia / compra) * 100;
      return {
        valores: {
          monto_invertido: compra * acciones,
          diferencia_por_accion: diferencia,
          variacion_porcentual: variacion,
          ganancia_perdida: diferencia * acciones,
          monto_final_bruto: venta * acciones
        },
        signo: variacion > 0 ? 'positivo' : (variacion < 0 ? 'negativo' : 'cero')
      };
    },

    // C6 (P24) — dividendo por acción y dividendo estimado del
    // estudiante. Exige utilidad_neta/porcentaje_repartir/
    // acciones_totales/acciones_estudiante (ids del payload de Jose).
    // Tres salidas: monto_a_repartir, dividendo_por_accion,
    // dividendo_estudiante. Sin estado de error (acciones_totales > 0
    // por el mínimo del slider).
    dividendo_por_accion: function (valores) {
      var montoARepartir = valores.utilidad_neta * (valores.porcentaje_repartir / 100);
      var dividendoPorAccion = montoARepartir / valores.acciones_totales;
      var dividendoEstudiante = dividendoPorAccion * valores.acciones_estudiante;
      return {
        valores: {
          monto_a_repartir: montoARepartir,
          dividendo_por_accion: dividendoPorAccion,
          dividendo_estudiante: dividendoEstudiante
        },
        signo: dividendoPorAccion > 0 ? 'positivo' : (dividendoPorAccion < 0 ? 'negativo' : 'cero')
      };
    }
  };

  function construirCalculadoraParametrica(idBase, idScorm, datos) {
    var formula = FORMULAS_CALCULADORA[datos.formula];
    if (!formula) {
      throw new Error('La fórmula "' + datos.formula + '" no existe en el catálogo de la calculadora paramétrica.');
    }
    var entradas = datos.entradas || [];
    var salidas = datos.salidas || [];
    var mensajes = datos.mensajes || null;
    // Ajustes tanda 13 (p22): variante opcional, ver la nota "variante
    // tablero" en el bloque C6 de arriba. Sin datos.variante, idéntica a
    // siempre — es lo que sigue montando p24 (dividendos) sin tocar su
    // contenido.
    var mostrarAccion = datos.mostrarAccion !== false;

    var raiz = crear_('div', 'calc-calculadora' + (datos.variante ? ' calc-calculadora--' + datos.variante : ''));
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var campos = crear_('div', 'calc-calculadora__entradas');
    raiz.appendChild(campos);

    var controles = {};
    entradas.forEach(function (entrada) {
      var controlId = idBase + '-calc-' + entrada.id;
      var valorId = controlId + '-valor';

      var campo = crear_('div', 'calc-campo');
      var cabecera = crear_('div', 'calc-campo__cabecera');
      var etiqueta = crear_('label', 'calc-campo__etiqueta', entrada.etiqueta);
      etiqueta.setAttribute('for', controlId);
      var valor = document.createElement('output');
      valor.className = 'calc-campo__valor';
      valor.id = valorId;
      valor.setAttribute('for', controlId);
      cabecera.appendChild(etiqueta);
      cabecera.appendChild(valor);
      campo.appendChild(cabecera);

      // input[type="range"] nativo, no un div a medida: el teclado
      // (flechas, Inicio/Fin, RePág/AvPág) y el rol de slider vienen
      // gratis del navegador — "operable con teclado sin arrastrar"
      // (cierre de T8) queda resuelto por construcción, mismo criterio
      // que el scrubber de media.js.
      var control = document.createElement('input');
      control.type = 'range';
      control.id = controlId;
      control.min = String(entrada.min);
      control.max = String(entrada.max);
      control.step = String(entrada.paso);
      control.value = String(entrada.valorInicial);
      control.className = 'calc-campo__control';
      control.setAttribute('aria-describedby', valorId);
      campo.appendChild(control);
      campos.appendChild(campo);

      controles[entrada.id] = { input: control, output: valor, entrada: entrada };
    });

    function valoresActuales() {
      var v = {};
      Object.keys(controles).forEach(function (id) {
        v[id] = parseFloat(controles[id].input.value);
      });
      return v;
    }

    function textoEntrada(entrada, num) {
      return formatearNumero(num, entrada.decimales) + (entrada.unidad || '');
    }

    // C6 — un único <output> envolvente para todas las salidas (más el
    // mensaje contextual, si lo hay) en vez de un <output> por salida:
    // ver la nota "menos interrupciones" del bloque C6 en el
    // encabezado del archivo.
    var resultados = document.createElement('output');
    resultados.className = 'calc-calculadora__resultados';
    raiz.appendChild(resultados);

    var filasResultado = salidas.map(function (salidaCfg) {
      // Ajustes tanda 13 (p22): acento gris/naranja opcional por salida,
      // solo tiene efecto visual dentro de .calc-calculadora--dashboard
      // (components.css) — en la calculadora estándar el campo, si
      // llegara a existir, no cambia nada.
      var fila = crear_('div', 'calc-calculadora__resultado' + (salidaCfg.acento ? ' calc-calculadora__resultado--' + salidaCfg.acento : ''));
      var icono = crear_('span', 'icono calc-calculadora__resultado-icono');
      icono.setAttribute('aria-hidden', 'true');
      var texto = crear_('div', 'calc-calculadora__resultado-texto');
      var etiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta', salidaCfg.etiqueta || '');
      var valor = crear_('p', 'tipo-h5 calc-calculadora__resultado-valor');
      texto.appendChild(etiqueta);
      texto.appendChild(valor);
      fila.appendChild(icono);
      fila.appendChild(texto);
      resultados.appendChild(fila);
      return { fila: fila, icono: icono, valor: valor, cfg: salidaCfg };
    });

    var mensajeParrafo = crear_('p', 'tipo-cuerpo-sm calc-calculadora__mensaje');
    mensajeParrafo.hidden = true;
    resultados.appendChild(mensajeParrafo);

    // Ajustes tanda 13 (p22): mostrarAccion:false quita "Registrar
    // resultado" entero (botón y resumen) — Juan pidió eliminar la
    // funcionalidad porque el botón no hacía nada perceptible para el
    // estudiante (solo un evento SCORM neutral en segundo plano). Sigue
    // existiendo para p24 (dividendos), que no pidió el cambio.
    var botonRegistrar = null;
    var resumen = null;
    if (mostrarAccion) {
      var acciones = crear_('div', 'calc-acciones');
      botonRegistrar = crear_('button', 'boton', datos.accion || 'Registrar resultado');
      botonRegistrar.type = 'button';
      acciones.appendChild(botonRegistrar);
      raiz.appendChild(acciones);

      resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
      resumen.setAttribute('role', 'status');
      raiz.appendChild(resumen);
    }

    var ultimoCalculo = null;

    function recalcular() {
      Object.keys(controles).forEach(function (id) {
        var c = controles[id];
        c.output.textContent = textoEntrada(c.entrada, parseFloat(c.input.value));
      });
      var resultadoFormula = formula(valoresActuales());
      if (resultadoFormula.error) {
        ultimoCalculo = null;
        resultados.dataset.estado = 'error';
        mensajeParrafo.hidden = true;
        filasResultado.forEach(function (f, i) {
          f.fila.hidden = i > 0;
          if (i === 0) {
            // El dataset.estado vive en la fila (.calc-calculadora__resultado),
            // no en el <output> envolvente: son las reglas CSS ya
            // existentes de error/incorrecto (compartidas con I11/I12/I13)
            // las que leen ese atributo.
            f.fila.dataset.estado = 'error';
            f.icono.textContent = 'error';
            f.valor.textContent = resultadoFormula.error;
          }
        });
        if (botonRegistrar) botonRegistrar.disabled = true;
      } else {
        ultimoCalculo = resultadoFormula.valores;
        resultados.dataset.estado = 'ok';
        filasResultado.forEach(function (f) {
          f.fila.hidden = false;
          delete f.fila.dataset.estado;
          f.icono.textContent = 'insights';
          f.valor.textContent = formatearNumero(resultadoFormula.valores[f.cfg.id], f.cfg.decimales) + (f.cfg.unidad || '');
        });
        var texto = mensajes && resultadoFormula.signo ? mensajes[resultadoFormula.signo] : null;
        if (texto) {
          mensajeParrafo.textContent = texto;
          mensajeParrafo.hidden = false;
        } else {
          mensajeParrafo.hidden = true;
        }
        if (botonRegistrar) botonRegistrar.disabled = false;
      }
    }

    Object.keys(controles).forEach(function (id) {
      controles[id].input.addEventListener('input', recalcular);
    });
    recalcular();

    function registrar() {
      if (ultimoCalculo === null) return;
      var textoValores = salidas.map(function (s) {
        return s.etiqueta + ': ' + formatearNumero(ultimoCalculo[s.id], s.decimales) + (s.unidad || '');
      }).join('; ');
      var pregunta = {
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () {
          var v = valoresActuales();
          return Object.keys(v).map(function (id) { return id + '=' + v[id]; }).join(',');
        },
        textoCorrecta: function () { return null; }
      };
      reportarSCORM(pregunta, 'neutral');
      resumen.textContent = 'Resultado registrado: ' + textoValores + '.';
    }

    if (mostrarAccion) botonRegistrar.addEventListener('click', registrar);

    return raiz;
  }

  /* I11, boleta de orden (comprar/vender contra la tabla de verdad de
     ocho filas de P42, C6). Reusa la cáscara `.calc-calculadora` que
     T8 dejó (enunciado, `.calc-calculadora__entradas`, resultado,
     acciones, resumen); ver el bloque C6 en el encabezado del archivo
     para el contrato completo de `datos` y la tabla de verdad. */
  function construirBoletaOrden(idBase, idScorm, datos) {
    var escenario = datos.escenario || {};
    var nombreOperacion = idBase + '-boleta-operacion';
    var nombreTipo = idBase + '-boleta-tipo';

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    if (datos.emisor || escenario.saldo != null || escenario.titulosDisponibles != null) {
      var partes = [];
      if (datos.emisor) partes.push('Emisor: ' + datos.emisor + '.');
      if (escenario.saldo != null) partes.push('Saldo disponible: ' + formatearNumero(escenario.saldo, 0) + ' COP.');
      if (escenario.titulosDisponibles != null) partes.push('Títulos disponibles para vender: ' + formatearNumero(escenario.titulosDisponibles, 0) + '.');
      raiz.appendChild(crear_('p', 'tipo-cuerpo-sm calc-boleta__escenario', partes.join(' ')));
    }

    function construirGrupoRadio(nombre, etiquetaLeyenda, opciones, valorInicial) {
      var fieldset = document.createElement('fieldset');
      fieldset.className = 'calc-boleta__tipo';
      fieldset.appendChild(crear_('legend', 'calc-campo__etiqueta', etiquetaLeyenda));
      var contenedor = crear_('div', 'calc-boleta__opciones');
      var inputs = {};
      opciones.forEach(function (opcion) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = nombre;
        input.value = opcion.valor;
        input.id = idBase + '-' + nombre + '-' + opcion.valor;
        input.checked = opcion.valor === valorInicial;
        var label = crear_('label', 'calc-opcion');
        label.setAttribute('for', input.id);
        label.appendChild(input);
        label.appendChild(document.createTextNode(opcion.texto));
        contenedor.appendChild(label);
        inputs[opcion.valor] = input;
      });
      fieldset.appendChild(contenedor);
      raiz.appendChild(fieldset);
      return inputs;
    }

    var operacionInputs = construirGrupoRadio(nombreOperacion, 'Operación', [
      { valor: 'comprar', texto: 'Comprar' },
      { valor: 'vender', texto: 'Vender' }
    ], 'comprar');
    // Límite por defecto: es el caso que de verdad enseña la diferencia
    // (a mercado siempre se ejecuta, no hay nada que explorar ahí).
    var tipoInputs = construirGrupoRadio(nombreTipo, 'Tipo de orden', [
      { valor: 'mercado', texto: 'A mercado' },
      { valor: 'limite', texto: 'Límite' }
    ], 'limite');

    var campos = crear_('div', 'calc-calculadora__entradas');
    raiz.appendChild(campos);

    function construirCampo(id, cfg) {
      var controlId = idBase + '-boleta-' + id;
      var valorId = controlId + '-valor';
      var campo = crear_('div', 'calc-campo');
      var cabecera = crear_('div', 'calc-campo__cabecera');
      var etiqueta = crear_('label', 'calc-campo__etiqueta', cfg.etiqueta);
      etiqueta.setAttribute('for', controlId);
      var salida = document.createElement('output');
      salida.className = 'calc-campo__valor';
      salida.id = valorId;
      salida.setAttribute('for', controlId);
      cabecera.appendChild(etiqueta);
      cabecera.appendChild(salida);
      campo.appendChild(cabecera);
      var control = document.createElement('input');
      control.type = 'range';
      control.id = controlId;
      control.min = String(cfg.min);
      control.max = String(cfg.max);
      control.step = String(cfg.paso);
      control.value = String(cfg.valorInicial);
      control.className = 'calc-campo__control';
      control.setAttribute('aria-describedby', valorId);
      campo.appendChild(control);
      campos.appendChild(campo);
      return { input: control, output: salida, cfg: cfg };
    }

    var precioActual = construirCampo('precioActual', datos.precioActual || {});
    var precioLimite = construirCampo('precioLimite', datos.precioLimite || {});
    var cantidad = construirCampo('cantidad', datos.cantidad || {});

    function textoValor(cfg, num) {
      return formatearNumero(num, cfg.decimales) + (cfg.unidad || '');
    }

    var resultado = crear_('div', 'calc-calculadora__resultado');
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoEtiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta', 'Estado de tu orden');
    var resultadoValor = document.createElement('output');
    // tipo-h5, no tipo-display-2 como en I10: aquí el resultado es una
    // oración explicativa ("Queda expuesta: …"), no un número corto.
    resultadoValor.className = 'tipo-h5 calc-calculadora__resultado-valor';
    resultadoTexto.appendChild(resultadoEtiqueta);
    resultadoTexto.appendChild(resultadoValor);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var acciones = crear_('div', 'calc-acciones');
    var botonEnviar = crear_('button', 'boton', 'Enviar boleta');
    botonEnviar.type = 'button';
    acciones.appendChild(botonEnviar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    var ultimoResultado = null;

    function operacionElegida() {
      return operacionInputs.vender.checked ? 'vender' : 'comprar';
    }
    function tipoElegido() {
      return tipoInputs.limite.checked ? 'limite' : 'mercado';
    }

    // La tabla de verdad de ocho filas de P42 (ver el bloque C6 en el
    // encabezado del archivo): comprar prioriza el saldo sobre el
    // precio, vender prioriza los títulos disponibles sobre el precio;
    // con esa restricción cumplida, mercado siempre ejecuta y límite
    // ejecuta solo si el precio de mercado no deja al límite "peor
    // parado" que el precio vigente.
    function evaluarOrden(operacion, tipo, precioActualNum, precioLimiteNum, cantidadNum) {
      if (operacion === 'comprar') {
        var costo = precioActualNum * cantidadNum;
        if (escenario.saldo != null && costo > escenario.saldo) return 'rechazada';
        if (tipo === 'mercado') return 'ejecutada';
        return precioLimiteNum >= precioActualNum ? 'ejecutada' : 'expuesta';
      }
      if (escenario.titulosDisponibles != null && cantidadNum > escenario.titulosDisponibles) return 'rechazada';
      if (tipo === 'mercado') return 'ejecutada';
      return precioLimiteNum <= precioActualNum ? 'ejecutada' : 'expuesta';
    }

    function recalcular() {
      precioActual.output.textContent = textoValor(precioActual.cfg, parseFloat(precioActual.input.value));
      precioLimite.output.textContent = textoValor(precioLimite.cfg, parseFloat(precioLimite.input.value));
      cantidad.output.textContent = textoValor(cantidad.cfg, parseFloat(cantidad.input.value));

      var operacion = operacionElegida();
      var tipo = tipoElegido();
      // El precio límite solo importa para una orden límite: deshabilitado
      // (no oculto, sigue en el árbol de accesibilidad) cuando no aplica —
      // mismo criterio que .boton:disabled ya establecido en T2.
      precioLimite.input.disabled = tipo !== 'limite';

      var precioActualNum = parseFloat(precioActual.input.value);
      var precioLimiteNum = parseFloat(precioLimite.input.value);
      var cantidadNum = parseFloat(cantidad.input.value);
      var estado = evaluarOrden(operacion, tipo, precioActualNum, precioLimiteNum, cantidadNum);
      ultimoResultado = {
        operacion: operacion, tipo: tipo, estado: estado,
        cantidad: cantidadNum, precioActual: precioActualNum, precioLimite: precioLimiteNum
      };

      resultado.dataset.estado = estado;
      if (estado === 'ejecutada') {
        resultadoIcono.textContent = 'check_circle';
        resultadoValor.textContent = 'Ejecutada: tu instrucción encontró condiciones de mercado, a ' +
          textoValor(precioActual.cfg, precioActualNum) + '.';
      } else if (estado === 'expuesta') {
        resultadoIcono.textContent = 'schedule';
        resultadoValor.textContent = 'Expuesta: queda vigente hasta que el precio llegue a tu límite (' +
          textoValor(precioLimite.cfg, precioLimiteNum) + ') o venza.';
      } else {
        resultadoIcono.textContent = 'block';
        resultadoValor.textContent = operacion === 'comprar'
          ? 'Rechazada: no hay saldo suficiente para esta cantidad al precio actual.'
          : 'Rechazada: no dispones de la cantidad de títulos indicada.';
      }
    }

    precioActual.input.addEventListener('input', recalcular);
    precioLimite.input.addEventListener('input', recalcular);
    cantidad.input.addEventListener('input', recalcular);
    operacionInputs.comprar.addEventListener('change', recalcular);
    operacionInputs.vender.addEventListener('change', recalcular);
    tipoInputs.mercado.addEventListener('change', recalcular);
    tipoInputs.limite.addEventListener('change', recalcular);
    recalcular();

    function enviar() {
      var r = ultimoResultado;
      var pregunta = {
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () {
          return 'operacion=' + r.operacion + ',tipo=' + r.tipo + ',estado=' + r.estado +
            ',cantidad=' + r.cantidad + ',precioActual=' + r.precioActual + ',precioLimite=' + r.precioLimite;
        },
        textoCorrecta: function () { return null; }
      };
      reportarSCORM(pregunta, 'neutral');
      if (datos.variable && datos.variable.nombre) {
        OVA.state.establecerVariable(datos.variable.nombre, {
          operacion: r.operacion, tipo: r.tipo, estado: r.estado,
          cantidad: r.cantidad, precioActual: r.precioActual, precioLimite: r.precioLimite
        });
      }
      resumen.textContent = 'Boleta enviada: ' + r.estado + '.';
    }

    botonEnviar.addEventListener('click', enviar);

    return raiz;
  }

  /* I09, línea de tiempo recorrible (recorrer los momentos de una
     operación —repo, TTV— con estado inicial y final, C6). Reemplaza
     la versión "ordenable" de T8: ver el bloque C6 en el encabezado
     del archivo para la razón del cambio y el contrato completo de
     `datos`. Un panel muestra un paso a la vez; «Anterior»/«Siguiente»
     avanzan, sin arrastre ni teclado especial que inventar. */
  function construirLineaTiempoRecorrible(idBase, idScorm, datos) {
    var momentos = datos.momentos || [];
    // Pasos: [inicial, ...momentos, final]. Los de los extremos son
    // texto plano (estado_inicial/estado_final de Jose); los del medio
    // llevan título/descripción/qué cambia/resultado.
    var pasos = [{ tipo: 'inicial', texto: datos.estadoInicial }]
      .concat(momentos.map(function (m) { return { tipo: 'momento', datos: m }; }))
      .concat([{ tipo: 'final', texto: datos.estadoFinal }]);

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var recorrido = crear_('div', 'calc-recorrido');
    raiz.appendChild(recorrido);

    var indicador = crear_('p', 'tipo-cuerpo-sm calc-recorrido__indicador');
    indicador.setAttribute('aria-hidden', 'true');
    recorrido.appendChild(indicador);

    var panel = crear_('div', 'calc-recorrido__panel');
    recorrido.appendChild(panel);

    var acciones = crear_('div', 'calc-acciones');
    var botonAnterior = crear_('button', 'boton boton--outline', 'Anterior');
    botonAnterior.type = 'button';
    var botonSiguiente = crear_('button', 'boton', 'Siguiente');
    botonSiguiente.type = 'button';
    acciones.appendChild(botonAnterior);
    acciones.appendChild(botonSiguiente);
    recorrido.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    resumen.hidden = true;
    raiz.appendChild(resumen);

    var actual = 0;
    var completado = false;

    function etiquetaPaso(paso) {
      if (paso.tipo === 'inicial') return 'Estado inicial';
      if (paso.tipo === 'final') return 'Estado final';
      return paso.datos.titulo;
    }

    function renderizarPaso(anunciar) {
      var paso = pasos[actual];
      panel.textContent = '';
      panel.dataset.tipo = paso.tipo;

      var eyebrow = crear_('p', 'eyebrow eyebrow--subtle', paso.tipo === 'momento' ? 'Momento' : etiquetaPaso(paso));
      panel.appendChild(eyebrow);

      if (paso.tipo === 'momento') {
        panel.appendChild(crear_('p', 'tipo-h5', paso.datos.titulo));
        panel.appendChild(crear_('p', 'tipo-cuerpo', paso.datos.descripcion));
        if (paso.datos.cambia) {
          var cambia = crear_('p', 'tipo-cuerpo-sm calc-recorrido__detalle');
          cambia.appendChild(crear_('strong', null, 'Qué cambia: '));
          cambia.appendChild(document.createTextNode(paso.datos.cambia));
          panel.appendChild(cambia);
        }
        if (paso.datos.resultado) {
          var res = crear_('p', 'tipo-cuerpo-sm calc-recorrido__detalle');
          res.appendChild(crear_('strong', null, 'Resultado: '));
          res.appendChild(document.createTextNode(paso.datos.resultado));
          panel.appendChild(res);
        }
      } else {
        panel.appendChild(crear_('p', 'tipo-cuerpo', paso.texto));
      }

      indicador.textContent = 'Paso ' + (actual + 1) + ' de ' + pasos.length;
      botonAnterior.disabled = actual === 0;
      botonSiguiente.disabled = actual === pasos.length - 1;

      if (anunciar) {
        OVA.a11y.anunciar('Paso ' + (actual + 1) + ' de ' + pasos.length + ': ' + etiquetaPaso(paso) +
          (paso.tipo === 'momento' ? '. ' + paso.datos.descripcion : '. ' + paso.texto));
      }

      if (actual === pasos.length - 1 && !completado) {
        completado = true;
        if (datos.retro) {
          resumen.hidden = false;
          resumen.textContent = datos.retro;
        }
        reportarSCORM({
          idScorm: idScorm,
          tipoScorm: 'other',
          textoRespuesta: function () { return 'recorrido completo'; },
          textoCorrecta: function () { return null; }
        }, 'neutral');
      }
    }

    botonAnterior.addEventListener('click', function () {
      if (actual === 0) return;
      actual -= 1;
      renderizarPaso(true);
    });
    botonSiguiente.addEventListener('click', function () {
      if (actual === pasos.length - 1) return;
      actual += 1;
      renderizarPaso(true);
    });

    renderizarPaso(false);

    return raiz;
  }

  /* I12, distribución de capital (armar un portafolio, base de C3 junto
     con I10). Reusa OVA.charts.crear({tipo:'distribucion'}) de T7 para
     la barra apilada en vivo en vez de duplicar ese SVG — cada slider
     recalcula los segmentos y reemplaza la figura completa. Validación
     de dominio con el mismo patrón que el error de I10: la suma debe
     ser exactamente 100, si no lo es el resultado pasa a
     data-estado="error" y el registro se deshabilita mientras dure.
     C6 suma la matriz de retro por perfil de riesgo — ver el bloque C6
     en el encabezado del archivo para el contrato completo de
     `datos.reglas`. */
  function construirDistribucionCapital(idBase, idScorm, datos) {
    var categorias = datos.categorias || [];
    var reglas = datos.reglas || [];
    var TOTAL_OBJETIVO = 100;

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var campos = crear_('div', 'calc-calculadora__entradas');
    raiz.appendChild(campos);

    var controles = {};
    categorias.forEach(function (cat) {
      var controlId = idBase + '-dist-' + cat.id;
      var valorId = controlId + '-valor';

      var campo = crear_('div', 'calc-campo');
      var cabecera = crear_('div', 'calc-campo__cabecera');
      var etiqueta = crear_('label', 'calc-campo__etiqueta', cat.etiqueta + (cat.riesgo ? ' — riesgo ' + cat.riesgo : ''));
      etiqueta.setAttribute('for', controlId);
      var valor = document.createElement('output');
      valor.className = 'calc-campo__valor';
      valor.id = valorId;
      valor.setAttribute('for', controlId);
      cabecera.appendChild(etiqueta);
      cabecera.appendChild(valor);
      campo.appendChild(cabecera);

      var control = document.createElement('input');
      control.type = 'range';
      control.id = controlId;
      control.min = '0';
      control.max = '100';
      control.step = '1';
      control.value = String(cat.valorInicial != null ? cat.valorInicial : 0);
      control.className = 'calc-campo__control';
      control.setAttribute('aria-describedby', valorId);
      campo.appendChild(control);
      campos.appendChild(campo);

      controles[cat.id] = { input: control, output: valor, etiqueta: cat.etiqueta };
    });

    var vista = crear_('div', 'calc-calculadora__vista');
    raiz.appendChild(vista);

    var resultado = crear_('div', 'calc-calculadora__resultado');
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoEtiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta');
    var resultadoValor = document.createElement('output');
    resultadoValor.className = 'tipo-h5 calc-calculadora__resultado-valor';
    resultadoTexto.appendChild(resultadoEtiqueta);
    resultadoTexto.appendChild(resultadoValor);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var retroPerfil = crear_('p', 'tipo-cuerpo-sm calc-calculadora__retro');
    retroPerfil.hidden = true;
    raiz.appendChild(retroPerfil);
    var avisoPerfil = crear_('p', 'tipo-cuerpo-sm calc-calculadora__resultado-aviso');
    avisoPerfil.hidden = true;
    if (datos.aviso) avisoPerfil.textContent = datos.aviso;
    raiz.appendChild(avisoPerfil);

    var acciones = crear_('div', 'calc-acciones');
    var botonRegistrar = crear_('button', 'boton', 'Registrar distribución');
    botonRegistrar.type = 'button';
    acciones.appendChild(botonRegistrar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    var totalValido = false;
    var retroVigente = null;

    function recalcular() {
      var total = 0;
      var segmentos = [];
      var porcentajes = {};
      Object.keys(controles).forEach(function (id) {
        var c = controles[id];
        var v = parseFloat(c.input.value);
        c.output.textContent = formatearNumero(v, 0) + ' %';
        total += v;
        porcentajes[id] = v;
        segmentos.push({ etiqueta: c.etiqueta, valor: v });
      });

      vista.textContent = '';
      vista.appendChild(OVA.charts.crear({ tipo: 'distribucion', segmentos: segmentos }));

      totalValido = total === TOTAL_OBJETIVO;
      resultadoValor.textContent = formatearNumero(total, 0) + ' %';
      if (totalValido) {
        resultado.dataset.estado = 'ok';
        resultadoIcono.textContent = 'check_circle';
        resultadoEtiqueta.textContent = 'Total asignado';
      } else {
        resultado.dataset.estado = 'error';
        resultadoIcono.textContent = 'error';
        resultadoEtiqueta.textContent = 'Debes asignar exactamente ' + TOTAL_OBJETIVO + ' % en total';
      }
      botonRegistrar.disabled = !totalValido;

      // Matriz de retro por perfil: solo tiene sentido con la suma
      // completa y con un perfil_riesgo ya conocido (I13, C5) — sin
      // eso, sigue comportándose exactamente como antes de C6.
      retroVigente = null;
      if (totalValido && reglas.length) {
        var perfil = OVA.state.obtenerVariable('perfil_riesgo');
        if (perfil) {
          retroVigente = buscarRetroPerfil(reglas, perfil, porcentajes) ||
            'Revisa la coherencia entre tu perfil (' + perfil + ') y esta distribución.';
        }
      }
      if (retroVigente) {
        retroPerfil.textContent = retroVigente;
        retroPerfil.hidden = false;
        avisoPerfil.hidden = !datos.aviso;
      } else {
        retroPerfil.hidden = true;
        avisoPerfil.hidden = true;
      }
    }

    Object.keys(controles).forEach(function (id) {
      controles[id].input.addEventListener('input', recalcular);
    });
    recalcular();

    function registrar() {
      if (!totalValido) return;
      var pregunta = {
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () {
          return Object.keys(controles).map(function (id) { return id + '=' + controles[id].input.value; }).join(',');
        },
        textoCorrecta: function () { return null; }
      };
      reportarSCORM(pregunta, 'neutral');
      resumen.textContent = 'Distribución registrada: ' + TOTAL_OBJETIVO + ' % asignado entre ' +
        Object.keys(controles).length + ' categorías.' + (retroVigente ? ' ' + retroVigente : '');
    }

    botonRegistrar.addEventListener('click', registrar);

    return raiz;
  }

  /* C5 — I07, tarjetas volteables. Ver el bloque de documentación C5 en
     el encabezado del archivo. */
  function construirTarjetasVolteables(idBase, idScorm, datos) {
    var tarjetasDatos = datos.tarjetas || [];

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var grilla = crear_('div', 'calc-tarjetas');
    raiz.appendChild(grilla);

    // Ilustración opcional por tarjeta: mismo criterio de degradación
    // que crearIlustracionTarjeta (router.js) — si falla al cargar se
    // quita en vez de dejar el ícono de imagen rota.
    function crearIlustracion(datosTarjeta, clase) {
      if (!datosTarjeta.imagen) return null;
      var img = document.createElement('img');
      img.className = clase;
      img.src = datosTarjeta.imagen;
      img.alt = datosTarjeta.alt || '';
      img.loading = 'lazy';
      img.addEventListener('error', function () {
        if (img.parentNode) img.parentNode.removeChild(img);
      });
      return img;
    }

    var tarjetas = tarjetasDatos.map(function (datosTarjeta, indice) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'calc-tarjeta';
      boton.setAttribute('aria-expanded', 'false');

      var interior = crear_('span', 'calc-tarjeta__interior');
      boton.appendChild(interior);

      // Cara frontal: título en blanco sobre naranja, ilustración a
      // sangre abajo (frame 33/38/39 de la referencia de Juan).
      var caraFrente = crear_('span', 'calc-tarjeta__cara calc-tarjeta__cara--frente');
      caraFrente.appendChild(crear_('span', 'tipo-h5 calc-tarjeta__titulo-frente', datosTarjeta.frente));
      var ilustracionFrente = crearIlustracion(datosTarjeta, 'calc-tarjeta__ilustracion');
      if (ilustracionFrente) caraFrente.appendChild(ilustracionFrente);

      // Cara reverso: fondo gris claro, título oscuro + definición
      // centrados, y la misma ilustración reducida a un círculo que se
      // superpone a la franja inferior con sombra.
      var caraReverso = crear_('span', 'calc-tarjeta__cara calc-tarjeta__cara--reverso');
      caraReverso.setAttribute('aria-hidden', 'true');
      var cuerpoReverso = crear_('span', 'calc-tarjeta__cuerpo-reverso');
      cuerpoReverso.appendChild(crear_('span', 'tipo-h5 calc-tarjeta__titulo-reverso', datosTarjeta.frente));
      // Ajustes tanda 12: tipo-cuerpo, no tipo-cuerpo-sm — Juan pidió más
      // tamaño para la definición del reverso que el resto del catálogo
      // usa por defecto en tarjetas.
      cuerpoReverso.appendChild(crear_('span', 'tipo-cuerpo calc-tarjeta__definicion', datosTarjeta.reverso));
      caraReverso.appendChild(cuerpoReverso);
      var pie = crear_('span', 'calc-tarjeta__pie');
      var ilustracionReverso = crearIlustracion(datosTarjeta, 'calc-tarjeta__ilustracion-mini');
      if (ilustracionReverso) {
        var circulo = crear_('span', 'calc-tarjeta__icono-circulo');
        circulo.appendChild(ilustracionReverso);
        pie.appendChild(circulo);
      }
      caraReverso.appendChild(pie);

      interior.appendChild(caraFrente);
      interior.appendChild(caraReverso);

      grilla.appendChild(boton);
      return { boton: boton, interior: interior, caraFrente: caraFrente, caraReverso: caraReverso, volteada: false };
    });

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    resumen.hidden = true;
    raiz.appendChild(resumen);

    var reportada = false;

    function todasVolteadas() {
      return tarjetas.every(function (t) { return t.volteada; });
    }

    function alternar(indice) {
      var t = tarjetas[indice];
      var d = tarjetasDatos[indice];
      var expandido = t.boton.getAttribute('aria-expanded') === 'true';
      var nuevo = !expandido;
      t.boton.setAttribute('aria-expanded', String(nuevo));
      // El giro 3D (CSS, sobre .calc-tarjeta__interior) es lo único que
      // decide qué cara se ve — aria-hidden es aparte porque
      // backface-visibility solo oculta visualmente, no del árbol de
      // accesibilidad.
      t.caraFrente.setAttribute('aria-hidden', String(nuevo));
      t.caraReverso.setAttribute('aria-hidden', String(!nuevo));
      OVA.a11y.anunciar((nuevo ? 'Mostrando: ' : 'Volviendo a: ') + (nuevo ? d.reverso : d.frente));
      if (nuevo) t.volteada = true;

      if (!reportada && todasVolteadas()) {
        reportada = true;
        if (datos.retroalimentacion) {
          resumen.hidden = false;
          resumen.textContent = datos.retroalimentacion;
        } else {
          OVA.a11y.anunciar('Revisaste las ' + tarjetas.length + ' tarjetas.');
        }
        reportarSCORM({
          idScorm: idScorm,
          tipoScorm: 'other',
          textoRespuesta: function () { return 'volteadas=' + tarjetas.length; },
          textoCorrecta: function () { return null; }
        }, 'neutral');
      }
    }

    tarjetas.forEach(function (t, indice) {
      t.boton.addEventListener('click', function () { alternar(indice); });
    });

    return raiz;
  }

  /* C5 — I08, comparador de dos columnas. Ver el bloque de
     documentación C5 en el encabezado del archivo. */
  function construirComparadorColumnas(idBase, idScorm, datos) {
    var columnas = datos.columnas || ['Columna A', 'Columna B'];
    var filasDatos = datos.filas || [];

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var encabezado = crear_('div', 'calc-comparador__encabezado');
    encabezado.setAttribute('aria-hidden', 'true');
    encabezado.appendChild(crear_('span', 'calc-comparador__encabezado-item', columnas[0]));
    encabezado.appendChild(crear_('span', 'calc-comparador__encabezado-item', columnas[1]));
    raiz.appendChild(encabezado);

    var lista = crear_('ul', 'calc-comparador__filas');
    raiz.appendChild(lista);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    resumen.hidden = true;
    raiz.appendChild(resumen);

    var activa = null;
    var visitadas = {};
    var reportada = false;

    var filas = filasDatos.map(function (filaDatos, indice) {
      var li = document.createElement('li');
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'calc-comparador__fila';
      boton.setAttribute('aria-pressed', 'false');

      var icono = crear_('span', 'icono calc-comparador__fila-icono', 'chevron_right');
      icono.setAttribute('aria-hidden', 'true');
      boton.appendChild(icono);

      var textoWrap = crear_('span', 'calc-comparador__fila-texto');
      textoWrap.appendChild(crear_('span', 'tipo-h5 calc-comparador__fila-etiqueta', filaDatos.etiqueta));
      var valores = crear_('span', 'calc-comparador__fila-valores');
      valores.appendChild(crear_('span', 'calc-comparador__valor', columnas[0] + ': ' + filaDatos.izquierda));
      valores.appendChild(crear_('span', 'calc-comparador__valor', columnas[1] + ': ' + filaDatos.derecha));
      textoWrap.appendChild(valores);
      boton.appendChild(textoWrap);

      li.appendChild(boton);
      lista.appendChild(li);
      return { boton: boton, icono: icono };
    });

    function revisarCompletado() {
      if (reportada) return;
      if (Object.keys(visitadas).length < filas.length) return;
      reportada = true;
      reportarSCORM({
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () { return 'filas=' + filas.length; },
        textoCorrecta: function () { return null; }
      }, 'neutral');
    }

    function seleccionar(indice) {
      if (activa != null) {
        filas[activa].boton.setAttribute('aria-pressed', 'false');
        filas[activa].boton.classList.remove('calc-comparador__fila--activa');
        filas[activa].icono.textContent = 'chevron_right';
      }
      if (activa === indice) {
        activa = null;
        resumen.hidden = true;
        resumen.textContent = '';
        return;
      }
      activa = indice;
      visitadas[indice] = true;
      var f = filasDatos[indice];
      filas[indice].boton.setAttribute('aria-pressed', 'true');
      filas[indice].boton.classList.add('calc-comparador__fila--activa');
      filas[indice].icono.textContent = 'task_alt';
      resumen.hidden = false;
      resumen.textContent = 'Comparando ' + f.etiqueta + ' — ' + columnas[0] + ': ' + f.izquierda + '. ' + columnas[1] + ': ' + f.derecha + '.';
      revisarCompletado();
    }

    filas.forEach(function (f, indice) {
      f.boton.addEventListener('click', function () { seleccionar(indice); });
    });

    return raiz;
  }

  /* C5 — I13, test de perfil con resultado. Ver el bloque de
     documentación C5 en el encabezado del archivo. */
  function construirTestPerfil(idBase, idScorm, datos) {
    var preguntas = datos.preguntas || [];
    var resultados = datos.resultados || [];

    var raiz = crear_('div', 'calc-calculadora');
    var enunciadoEl = datos.enunciado
      ? crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado)
      : null;
    if (enunciadoEl) raiz.appendChild(enunciadoEl);

    var entradas = crear_('div', 'calc-calculadora__entradas');
    entradas.tabIndex = -1;
    raiz.appendChild(entradas);

    var respuestas = new Array(preguntas.length).fill(null);
    var todasLasEntradas = [];

    var grupos = preguntas.map(function (pregunta, indice) {
      var nombre = idBase + '-perfil-' + indice;
      var fieldset = document.createElement('fieldset');
      fieldset.className = 'calc-boleta__tipo';
      fieldset.appendChild(crear_('legend', 'calc-campo__etiqueta', pregunta.enunciado));
      var opciones = crear_('div', 'calc-test__opciones');
      (pregunta.opciones || []).forEach(function (opcion, indiceOpcion) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = nombre;
        input.id = nombre + '-' + indiceOpcion;
        todasLasEntradas.push(input);
        var label = crear_('label', 'calc-opcion');
        label.setAttribute('for', input.id);
        label.appendChild(input);
        label.appendChild(document.createTextNode(opcion.texto));
        opciones.appendChild(label);
        input.addEventListener('change', function () {
          respuestas[indice] = opcion.puntos;
          recalcularValidez();
        });
      });
      fieldset.appendChild(opciones);
      entradas.appendChild(fieldset);
      return fieldset;
    });

    var resultado = crear_('div', 'calc-calculadora__resultado');
    resultado.hidden = true;
    resultado.tabIndex = -1;
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    // Ajustes tanda 14: ilustración del perfil, mismo mecanismo de
    // degradación que crearIlustracionTarjeta (router.js) — si
    // resultados[].imagen falta o la carga falla, se quita y el ícono
    // de siempre vuelve a ser lo único que marca el estado.
    var resultadoImagen = document.createElement('img');
    resultadoImagen.className = 'calc-calculadora__resultado-imagen';
    resultadoImagen.hidden = true;
    resultadoImagen.loading = 'lazy';
    resultadoImagen.addEventListener('error', function () {
      resultadoImagen.hidden = true;
      resultadoIcono.hidden = false;
    });
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoEtiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta');
    var resultadoValor = document.createElement('output');
    resultadoValor.className = 'tipo-h5 calc-calculadora__resultado-valor';
    var resultadoAviso = crear_('p', 'tipo-cuerpo-sm calc-calculadora__resultado-aviso');
    resultadoAviso.hidden = true;
    resultadoTexto.appendChild(resultadoEtiqueta);
    resultadoTexto.appendChild(resultadoValor);
    resultadoTexto.appendChild(resultadoAviso);
    resultado.appendChild(resultadoImagen);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var acciones = crear_('div', 'calc-acciones');
    var botonVer = crear_('button', 'boton', 'Ver resultado');
    botonVer.type = 'button';
    botonVer.disabled = true;
    var botonReiniciar = crear_('button', 'boton boton--outline', 'Volver a tomar el test');
    botonReiniciar.type = 'button';
    botonReiniciar.hidden = true;
    acciones.appendChild(botonVer);
    acciones.appendChild(botonReiniciar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    function recalcularValidez() {
      botonVer.disabled = respuestas.some(function (r) { return r == null; });
    }

    function buscarResultado(total) {
      for (var i = 0; i < resultados.length; i++) {
        var r = resultados[i];
        if (total >= r.minimo && (r.maximo == null || total <= r.maximo)) return r;
      }
      return null;
    }

    function verResultado() {
      if (botonVer.disabled) return;
      var total = respuestas.reduce(function (a, b) { return a + b; }, 0);
      var match = buscarResultado(total);
      resultado.hidden = false;

      // Ajustes tanda 14: la vista pasa a ser solo el resultado — las
      // preguntas y este mismo botón se ocultan en vez de dejar el
      // resultado colgando debajo de un cuestionario ya respondido.
      entradas.hidden = true;
      if (enunciadoEl) enunciadoEl.hidden = true;
      botonVer.hidden = true;
      botonReiniciar.hidden = false;

      if (match) {
        resultado.dataset.estado = 'ok';
        resultadoIcono.hidden = !!match.imagen;
        resultadoIcono.textContent = 'task_alt';
        if (match.imagen) {
          resultadoImagen.src = match.imagen;
          resultadoImagen.alt = match.alt || '';
          resultadoImagen.hidden = false;
        } else {
          resultadoImagen.hidden = true;
        }
        resultadoEtiqueta.textContent = match.etiqueta || match.categoria;
        resultadoValor.textContent = match.texto || '';
        if (datos.aviso) {
          resultadoAviso.hidden = false;
          resultadoAviso.textContent = datos.aviso;
        }
        if (datos.variable) OVA.state.establecerVariable(datos.variable, match.categoria);
        resumen.textContent = 'Resultado registrado: perfil ' + (match.categoria || match.etiqueta) + '.';
      } else {
        resultado.dataset.estado = 'error';
        resultadoImagen.hidden = true;
        resultadoIcono.hidden = false;
        resultadoIcono.textContent = 'error';
        resultadoEtiqueta.textContent = 'No se pudo calcular tu perfil';
        resultadoValor.textContent = 'El puntaje obtenido no coincide con ningún resultado configurado.';
        resumen.textContent = 'No se registró resultado: revisa el contenido de esta pregunta.';
      }

      // El botón que tenía el foco (botonVer) acaba de ocultarse — el
      // resultado lo recoge, mismo criterio que
      // OVA.a11y.enfocarEncabezado() entre pantallas.
      resultado.focus();

      reportarSCORM({
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () { return respuestas.join(','); },
        textoCorrecta: function () { return null; }
      }, 'neutral');
    }

    function reiniciar() {
      respuestas = respuestas.map(function () { return null; });
      todasLasEntradas.forEach(function (input) { input.checked = false; });
      resultado.hidden = true;
      resultado.dataset.estado = '';
      resultadoAviso.hidden = true;
      entradas.hidden = false;
      if (enunciadoEl) enunciadoEl.hidden = false;
      botonReiniciar.hidden = true;
      botonVer.hidden = false;
      recalcularValidez();
      resumen.textContent = '';
      entradas.focus();
    }

    botonVer.addEventListener('click', verResultado);
    botonReiniciar.addEventListener('click', reiniciar);

    return raiz;
  }

  /* ---- I15 cuestionario (E1) — ver el bloque de documentación en el
     encabezado del archivo para el contrato completo y las cinco
     trampas. Cada pregunta reutiliza su constructor de CONSTRUCTORES
     (definido más abajo; se lee en tiempo de montaje, no aquí arriba,
     así que el orden de declaración no importa) montado dentro de su
     propio <form> — mismo patrón de Comprobar/Reintentar que crear(),
     pero sin su envoltorio de una sola pregunta: aquí hay cinco en
     paralelo y ninguna llama a actualizarNota() por separado (trampa 1). */
  function construirCuestionario(idBase, idScorm, datos, alCompletar) {
    alCompletar = typeof alCompletar === 'function' ? alCompletar : function () {};
    var preguntasCfg = datos.preguntas || [];
    if (!preguntasCfg.length) {
      throw new Error('I15 cuestionario necesita al menos una pregunta en "preguntas".');
    }
    var total = preguntasCfg.length;
    // Trampa 2 — la marca de la BATERÍA completa, no de cada pregunta.
    var claveCompletado = idScorm + '-completo';
    var yaCompleto = !!OVA.state.obtenerVariable(claveCompletado);

    var raiz = crear_('div', 'quiz-cuestionario');
    var enunciado = datos.enunciado
      ? crear_('p', 'tipo-cuerpo quiz-cuestionario__enunciado', datos.enunciado)
      : null;
    if (enunciado) raiz.appendChild(enunciado);

    var lista = crear_('div', 'quiz-cuestionario__lista');
    raiz.appendChild(lista);

    // Ajustes tanda 10 — el resultado es una VISTA APARTE, no un bloque
    // que aparece debajo de las preguntas: al terminar la batería la
    // lista se oculta entera y queda solo esto. Por eso ya no lleva
    // role="status" (la trampa 4 de E1, pensada para cuando el bloque
    // se revelaba sin que el estudiante hiciera nada): ahora se llega
    // con un clic explícito en "Ver mi resultado", así que lo correcto
    // es mover el foco al encabezado de la vista nueva — si no,
    // desaparece el botón que tenía el foco y este se cae al <body>.
    // Con `tabIndex = -1` es focalizable por script pero no una parada
    // de Tab, mismo patrón que OVA.a11y.enfocarEncabezado() usa entre
    // pantallas.
    var bloqueResultado = crear_('div', 'quiz-cuestionario__resultado');
    bloqueResultado.hidden = true;
    var tituloResultado = crear_('h3', 'tipo-h3 quiz-cuestionario__resultado-titulo', 'Tu resultado');
    tituloResultado.tabIndex = -1;
    bloqueResultado.appendChild(tituloResultado);
    raiz.appendChild(bloqueResultado);

    var resueltas = 0;
    var aciertos = 0;
    // Ajustes tanda 10 — una pregunta a la vez. `items` guarda los
    // contenedores en orden para poder mostrar uno y ocultar el resto;
    // `activa` es el índice visible. No es un "paso" persistido: si el
    // estudiante recarga a mitad de la batería vuelve a empezar desde la
    // primera, igual que antes (quiz.js no persiste el intento, T6).
    var items = [];
    var activa = 0;

    function actualizarNotaFinal() {
      if (!OVA.scorm.disponible()) return;
      var porcentaje = Math.round((aciertos / total) * 100);
      OVA.scorm.establecerValor('cmi.core.score.raw', String(porcentaje));
      OVA.scorm.establecerValor('cmi.core.score.min', '0');
      OVA.scorm.establecerValor('cmi.core.score.max', '100');
      OVA.scorm.confirmar();
    }

    // Trampa 5 — reusa OVA.resultado.resolver()/construir() (resultado.js):
    // misma cifra con etiqueta + callout con ícono y título que L08, sin
    // reimplementar la regla "primera que aplica gana".
    function mostrarResultado(opciones) {
      opciones = opciones || {};
      // Sin "resultado" en los datos, la batería reporta la nota y se
      // acaba sin cifra/callout — no hay nada que revelar, así que el
      // bloque (vacío) se queda oculto en vez de aparecer en blanco.
      // Ajustes tanda 10: la lista se oculta igual. La vista de
      // preguntas ya cumplió su función y dejarla ahí, con las cinco
      // bloqueadas y sin botones, no es "el resultado aparte" que pide
      // el guion — es la misma pantalla con basura al final.
      lista.hidden = true;
      if (enunciado) enunciado.hidden = true;
      if (!datos.resultado) return;
      var efectivo = OVA.resultado.resolver(datos.resultado);
      var piezas = OVA.resultado.construir(efectivo);
      if (piezas.cifra) bloqueResultado.appendChild(piezas.cifra);
      if (piezas.callout) bloqueResultado.appendChild(piezas.callout);
      // Ajustes tanda 10 — locución del resultado. Mismo contrato que
      // media.tipo 'avatar' (ver el encabezado de media.js) sin el campo
      // "tipo": aquí la carta de audio es parte del resultado, no de la
      // pantalla, así que la monta la interacción y no router.js. Si
      // falla (falta transcripción, p. ej.) media.js ya lo dijo en
      // consola — el resultado se muestra igual, sin la carta: no vale
      // la pena tirar la pantalla entera por el audio.
      if (datos.resultado.locucion) {
        var carta = OVA.media.crear({
          tipo: 'avatar',
          imagen: datos.resultado.locucion.imagen,
          audio: datos.resultado.locucion.audio,
          vtt: datos.resultado.locucion.vtt,
          variante: datos.resultado.locucion.variante,
          transcripcion: datos.resultado.locucion.transcripcion
        });
        if (carta) {
          var envoltura = crear_('div', 'quiz-cuestionario__locucion');
          envoltura.appendChild(carta);
          bloqueResultado.appendChild(envoltura);
        }
      }
      bloqueResultado.hidden = false;
      // Solo en el camino interactivo: al montar con la batería ya
      // completa (trampa 2 de E1, un F5 después de terminar) nadie hizo
      // nada, no hay foco que recuperar y robarlo sería justo lo que
      // aplicarAutolocucion() y el resto del motor evitan al montar.
      if (opciones.enfocar) tituloResultado.focus();
    }

    function alResolverPregunta(acierto) {
      resueltas++;
      if (acierto) aciertos++;
      if (resueltas >= total) {
        actualizarNotaFinal();
        OVA.state.establecerVariable(claveCompletado, true);
        // alCompletar() acá y no al abrir la vista de resultado: la
        // batería YA está respondida, que es lo que bloqueaAvance mide.
        // El resultado es una pantalla de lectura, no un requisito más.
        alCompletar();
      }
    }

    // Ajustes tanda 10 — avanza a la pregunta `indice` (o al resultado,
    // si ya no quedan). Mueve el foco al contenedor de la pregunta
    // nueva: sin esto el foco se queda en un botón que acaba de
    // ocultarse y se cae al <body>. El anuncio por aria-live lo hace
    // OVA.a11y.anunciar() porque el contenedor no es un encabezado y un
    // lector de pantalla no diría nada al enfocarlo.
    function mostrarPregunta(indice) {
      items.forEach(function (item, i) {
        item.hidden = i !== indice;
      });
      activa = indice;
      var item = items[indice];
      if (!item) return;
      item.focus();
      OVA.a11y.anunciar('Pregunta ' + (indice + 1) + ' de ' + total + '.');
    }

    preguntasCfg.forEach(function (cfg, indice) {
      var constructor = CONSTRUCTORES[cfg.tipo];
      if (!constructor) {
        throw new Error('I15: el tipo de pregunta "' + cfg.tipo + '" no existe en el catálogo I01–I05 (ni en completar/numerica/autoevaluacion).');
      }
      var subDatos = cfg.datos || {};
      var subIdBase = idBase + '-p' + (indice + 1);
      var subIdScorm = subDatos.id || subIdBase;
      var pregunta = constructor(subIdBase, subIdScorm, subDatos);

      // Trampa 3 — el contador va pegado a esta pregunta, no arriba del
      // todo del cuestionario: se ve sin volver a subir el scroll.
      var item = crear_('form', 'quiz-cuestionario__item');
      item.setAttribute('novalidate', 'novalidate');
      // Ajustes tanda 10: focalizable por script (no parada de Tab) para
      // que mostrarPregunta() pueda llevarle el foco al cambiar de
      // pregunta — ver la nota de mostrarPregunta().
      item.tabIndex = -1;
      item.appendChild(crear_('p', 'tipo-etiqueta quiz-cuestionario__contador', 'Pregunta ' + (indice + 1) + ' de ' + total));
      item.appendChild(pregunta.fieldset);

      var acciones = crear_('div', 'quiz-acciones');
      var botonComprobar = crear_('button', 'boton', 'Comprobar');
      botonComprobar.type = 'submit';
      var botonReintentar = crear_('button', 'boton boton--outline', 'Reintentar');
      botonReintentar.type = 'button';
      botonReintentar.hidden = true;
      // Ajustes tanda 10 — con una pregunta a la vez hace falta un paso
      // explícito para avanzar: sin él, o se salta solo la
      // retroalimentación que el estudiante acaba de recibir, o la
      // pregunta resuelta se queda en pantalla sin nada que hacer. El
      // texto cambia en la última porque lo que viene no es otra
      // pregunta.
      var esUltima = indice === total - 1;
      var botonContinuar = crear_(
        'button',
        'boton',
        esUltima ? 'Ver mi resultado' : 'Siguiente pregunta'
      );
      botonContinuar.type = 'button';
      botonContinuar.hidden = true;
      var iconoContinuar = crear_('span', 'boton__icono', 'arrow_forward');
      iconoContinuar.setAttribute('aria-hidden', 'true');
      botonContinuar.appendChild(iconoContinuar);
      acciones.appendChild(botonComprobar);
      acciones.appendChild(botonReintentar);
      acciones.appendChild(botonContinuar);
      item.appendChild(acciones);
      // Ajustes tanda 10: todas menos la primera arrancan ocultas.
      item.hidden = indice !== 0;
      items.push(item);
      lista.appendChild(item);

      var intentosMaximos = subDatos.intentos || 0;
      var intentosUsados = 0;
      var resuelta = false;

      function textoRetro(estado) {
        var custom = subDatos.retroalimentacion && subDatos.retroalimentacion[estado];
        if (estado === 'correcto') return { titulo: 'Correcto', detalle: custom };
        if (estado === 'incorrecto') return { titulo: 'Incorrecto', detalle: custom };
        return { titulo: 'Respuesta registrada', detalle: custom };
      }

      function comprobar(evento) {
        if (evento) evento.preventDefault();
        if (resuelta) return;
        intentosUsados++;

        var resultado = pregunta.evaluar();
        var msg = textoRetro(resultado || 'neutral');
        pregunta.retro.mostrar(resultado || 'neutral', msg.titulo, msg.detalle);
        reportarSCORM(pregunta, resultado);
        // Trampa 1 — sin actualizarNota() aquí: la nota se calcula una
        // sola vez en actualizarNotaFinal(), al cerrar la batería.
        actualizarVariableContenido(datos.variable, resultado);

        pregunta.bloquear();
        botonComprobar.hidden = true;

        var agotado = intentosMaximos > 0 && intentosUsados >= intentosMaximos;
        var acierto = resultado === 'correcto';

        if (acierto || agotado) {
          resuelta = true;
          botonReintentar.hidden = true;
          if (resultado === 'incorrecto') pregunta.revelarCorrecta();
          alResolverPregunta(acierto);
          // Ajustes tanda 10: el paso siguiente queda a mano del
          // estudiante, con la retroalimentación de esta pregunta
          // todavía en pantalla.
          botonContinuar.hidden = false;
        } else {
          botonReintentar.hidden = false;
        }
      }

      function continuar() {
        if (esUltima) {
          mostrarResultado({ enfocar: true });
          return;
        }
        mostrarPregunta(indice + 1);
      }

      function reintentar() {
        pregunta.desbloquear();
        pregunta.retro.ocultar();
        botonReintentar.hidden = true;
        botonComprobar.hidden = false;
      }

      item.addEventListener('submit', comprobar);
      botonReintentar.addEventListener('click', reintentar);
      botonContinuar.addEventListener('click', continuar);

      // Trampa 2 — batería ya completa en una visita anterior: no hay
      // forma de reconstruir qué se respondió (el intento no se
      // persiste, T6), así que cada pregunta arranca bloqueada y sin
      // retro individual, sin repetir el reporte a cmi.interactions ni
      // recalcular la nota.
      if (yaCompleto) {
        pregunta.bloquear();
        botonComprobar.hidden = true;
        resuelta = true;
      }
    });

    if (yaCompleto) {
      mostrarResultado();
      // E2, trampa 2 de E1: un F5 después de terminar arranca ya
      // desbloqueada — alCompletar() no es solo para el momento en que
      // el estudiante termina en vivo.
      alCompletar();
    }

    return raiz;
  }


  /* ---- I16 · Simulador de dividendos (ajustes tanda 15) --------------
     Reemplaza a I10/`dividendo_por_accion` en p24 (pantalla 18). El DI
     rehízo el ejercicio porque la calculadora paramétrica no cumplía el
     objetivo pedagógico: cuatro sliders sueltos dejaban al estudiante
     moviendo números sin entender de dónde sale su dividendo. La versión
     nueva fija el escenario (una empresa, 1.000 acciones, 100 tuyas =
     10 %) y deja solo las dos decisiones que enseñan el concepto —cuánto
     gana la empresa y qué porcentaje reparte—, muestra la operación
     debajo de cada cifra y explica con texto qué significa el reparto
     elegido.

     No es una variante de I10 sino un tipo propio, misma decisión que
     I11/I12/I13: su DOM no es "sliders + salidas" sino escenario fijo +
     dos pasos numerados + barra de reparto + retroalimentación
     contextual + idea de cierre. Meterlo en I10 habría sido cuatro
     campos opcionales nuevos usados por una sola pantalla (el mismo
     argumento que ya cerró la discusión de "N columnas genéricas" en
     ajustes tanda 13). I10 queda intacta y la sigue usando p22.

     La fórmula es fija —no sale de FORMULAS_CALCULADORA—: este tipo ES
     el reparto de utilidades, igual que I11 ES la tabla de verdad de una
     boleta de orden.

     I16 simulador_dividendos { enunciado?, contexto?, acciones, pasos,
                                resultados?, salidas, umbrales?, retro?,
                                idea?, nota? }
       - `acciones`: { totales, estudiante } — el escenario fijo. No son
         sliders a propósito: la participación del estudiante tiene que
         quedarse quieta para que se lea que su dividendo es siempre el
         mismo porcentaje del monto repartido.
       - `contexto`: [{ etiqueta, valor }, …] — las tarjetas de marco del
         ejercicio (empresa, participación). Solo texto, sin cálculo.
       - `pasos`: exactamente dos, en este orden: [0] utilidad de la
         empresa, [1] porcentaje a repartir. Cada uno { titulo,
         descripcion?, control: { etiqueta, min, max, paso, valorInicial,
         prefijo?, sufijo?, decimales? } }. El paso [1] acepta además
         `reparto: { titulo, etiquetaRepartido, etiquetaRetenido }` y
         pinta la barra de destino de las ganancias. El orden importa
         porque la fórmula es fija; si `pasos` no trae dos entradas el
         motor falla ruidosamente, no renderiza a medias.
       - `salidas`: exactamente tres { id, etiqueta, decimales?,
         decimalesMax?, acento? }
         con los ids fijos `monto_a_repartir`, `dividendo_por_accion` y
         `dividendo_estudiante`. `acento` es el mismo vocabulario de
         ajustes tanda 13 ("gris" = superficie inverse, "naranja" =
         superficie de marca); aquí el naranja va en la tercera, que es
         la que el DI destaca (lo que le llega al estudiante).
       - `umbrales`: { alto, bajo } — cortes de porcentaje repartido para
         la retroalimentación. Por defecto 80 y 20, los del artefacto.
       - `retro`: { cero, alto, bajo, equilibrio, sinReparto? }, cada uno
         { icono, titulo, texto }. `texto` admite los marcadores `{repartido}` y
         `{retenido}` con el porcentaje vivo. El estado se comunica por
         ícono + título + texto además del color (regla dura 3): el color
         nunca va solo.
       - `idea` / `nota`: cierre pedagógico y pie del ejercicio.

     Sin botón de registro ni reporte a SCORM: es exploratoria, igual que
     quedó p24 con `mostrarAccion: false` en ajustes tanda 13. Un único
     <output> envolvente para las tres cifras, el mensaje y la barra —el
     mismo criterio de "menos interrupciones" que I10 (ver el bloque C6):
     tres regiones vivas anunciando en cada arrastre serían ruido. */
  function construirSimuladorDividendos(idBase, idScorm, datos) {
    var pasos = datos.pasos || [];
    var salidas = datos.salidas || [];
    if (pasos.length !== 2) {
      throw new Error('I16 (simulador de dividendos) necesita exactamente dos pasos: utilidad y porcentaje a repartir.');
    }
    if (salidas.length !== 3) {
      throw new Error('I16 (simulador de dividendos) necesita exactamente tres salidas: monto_a_repartir, dividendo_por_accion y dividendo_estudiante.');
    }
    var acciones = datos.acciones || {};
    var accionesTotales = Number(acciones.totales);
    var accionesEstudiante = Number(acciones.estudiante);
    if (!(accionesTotales > 0)) {
      throw new Error('I16 (simulador de dividendos) necesita "acciones.totales" mayor que cero.');
    }
    var umbrales = datos.umbrales || {};
    var umbralAlto = umbrales.alto == null ? 80 : Number(umbrales.alto);
    var umbralBajo = umbrales.bajo == null ? 20 : Number(umbrales.bajo);
    var retro = datos.retro || {};

    function formatearControl(control, valor) {
      return (control.prefijo || '') + formatearNumero(valor, control.decimales) + (control.sufijo || '');
    }

    var raiz = crear_('div', 'calc-dividendos');
    if (datos.enunciado) {
      raiz.appendChild(crear_('p', 'calc-dividendos__enunciado tipo-cuerpo', datos.enunciado));
    }

    // Marco fijo del ejercicio. <ul> real: son datos hermanos, no prosa
    // suelta, y un lector de pantalla anuncia "lista de 2 elementos".
    if (datos.contexto && datos.contexto.length) {
      var contexto = crear_('ul', 'calc-dividendos__contexto');
      datos.contexto.forEach(function (item) {
        var li = crear_('li', 'calc-dividendos__contexto-item');
        li.appendChild(crear_('p', 'eyebrow calc-dividendos__contexto-etiqueta', item.etiqueta));
        li.appendChild(crear_('p', 'tipo-h5 calc-dividendos__contexto-valor', item.valor));
        contexto.appendChild(li);
      });
      raiz.appendChild(contexto);
    }

    var columnaControles = crear_('div', 'calc-dividendos__controles');
    raiz.appendChild(columnaControles);

    var campos = [];
    var barra = null;
    pasos.forEach(function (paso, indice) {
      var control = paso.control || {};
      var controlId = idBase + '-sim-' + indice;
      var valorId = controlId + '-valor';

      var bloque = crear_('div', 'calc-dividendos__paso');
      var cabecera = crear_('div', 'calc-dividendos__paso-cabecera');
      // El número es decorativo: el orden ya lo da el propio texto de
      // cada título ("¿Cuánto ganó…?" / "¿Cuánto reparte…?") y no hay
      // nada que contar para un lector de pantalla.
      var numero = crear_('span', 'calc-dividendos__paso-numero', String(indice + 1));
      numero.setAttribute('aria-hidden', 'true');
      var textoPaso = crear_('div', 'calc-dividendos__paso-texto');
      // h3 real: la pantalla monta su título en h2 (router.js,
      // crearTitulo), así que estos dos son el nivel siguiente.
      textoPaso.appendChild(crear_('h3', 'tipo-h4 calc-dividendos__paso-titulo', paso.titulo || ''));
      if (paso.descripcion) {
        textoPaso.appendChild(crear_('p', 'tipo-cuerpo-sm calc-dividendos__paso-descripcion', paso.descripcion));
      }
      cabecera.appendChild(numero);
      cabecera.appendChild(textoPaso);
      bloque.appendChild(cabecera);

      var campo = crear_('div', 'calc-campo');
      var filaEtiqueta = crear_('div', 'calc-campo__cabecera');
      var etiqueta = crear_('label', 'calc-campo__etiqueta', control.etiqueta || '');
      etiqueta.setAttribute('for', controlId);
      var salidaValor = document.createElement('output');
      salidaValor.className = 'calc-campo__valor calc-dividendos__campo-valor';
      salidaValor.id = valorId;
      salidaValor.setAttribute('for', controlId);
      filaEtiqueta.appendChild(etiqueta);
      filaEtiqueta.appendChild(salidaValor);
      campo.appendChild(filaEtiqueta);

      // input[type="range"] nativo por el mismo motivo que I10: teclado
      // y rol de slider vienen del navegador, no de un div a medida.
      var input = document.createElement('input');
      input.type = 'range';
      input.id = controlId;
      input.min = String(control.min);
      input.max = String(control.max);
      input.step = String(control.paso);
      input.value = String(control.valorInicial);
      input.className = 'calc-campo__control';
      input.setAttribute('aria-describedby', valorId);
      campo.appendChild(input);

      var rango = crear_('p', 'tipo-caption calc-dividendos__rango');
      rango.setAttribute('aria-hidden', 'true');
      rango.appendChild(crear_('span', null, formatearControl(control, Number(control.min))));
      rango.appendChild(crear_('span', null, formatearControl(control, Number(control.max))));
      campo.appendChild(rango);
      bloque.appendChild(campo);

      if (paso.reparto) {
        var reparto = crear_('div', 'calc-dividendos__reparto');
        reparto.appendChild(crear_('p', 'eyebrow calc-dividendos__reparto-titulo', paso.reparto.titulo || 'Destino de las ganancias'));
        var pista = crear_('div', 'calc-dividendos__barra');
        pista.setAttribute('aria-hidden', 'true');
        var segRepartido = crear_('span', 'calc-dividendos__barra-segmento calc-dividendos__barra-segmento--repartido');
        var segRetenido = crear_('span', 'calc-dividendos__barra-segmento calc-dividendos__barra-segmento--retenido');
        pista.appendChild(segRepartido);
        pista.appendChild(segRetenido);
        reparto.appendChild(pista);
        // La leyenda lleva el porcentaje en texto, no solo el color del
        // segmento: la barra es aria-hidden y el dato vive aquí (regla
        // dura 3 — el color nunca es el único código).
        var leyenda = crear_('ul', 'calc-dividendos__leyenda');
        var itemRepartido = crear_('li', 'calc-dividendos__leyenda-item');
        var puntoRepartido = crear_('span', 'calc-dividendos__punto calc-dividendos__punto--repartido');
        puntoRepartido.setAttribute('aria-hidden', 'true');
        var textoRepartido = crear_('span', 'calc-dividendos__leyenda-texto');
        itemRepartido.appendChild(puntoRepartido);
        itemRepartido.appendChild(textoRepartido);
        var itemRetenido = crear_('li', 'calc-dividendos__leyenda-item');
        var puntoRetenido = crear_('span', 'calc-dividendos__punto calc-dividendos__punto--retenido');
        puntoRetenido.setAttribute('aria-hidden', 'true');
        var textoRetenido = crear_('span', 'calc-dividendos__leyenda-texto');
        itemRetenido.appendChild(puntoRetenido);
        itemRetenido.appendChild(textoRetenido);
        leyenda.appendChild(itemRepartido);
        leyenda.appendChild(itemRetenido);
        reparto.appendChild(leyenda);
        bloque.appendChild(reparto);
        barra = {
          repartido: segRepartido,
          retenido: segRetenido,
          textoRepartido: textoRepartido,
          textoRetenido: textoRetenido,
          etiquetaRepartido: paso.reparto.etiquetaRepartido || 'Dividendos',
          etiquetaRetenido: paso.reparto.etiquetaRetenido || 'Ganancias retenidas'
        };
      }

      columnaControles.appendChild(bloque);
      campos.push({ input: input, output: salidaValor, control: control });
    });

    var columnaResultados = document.createElement('output');
    columnaResultados.className = 'calc-dividendos__resultados';
    raiz.appendChild(columnaResultados);

    if (datos.resultados && datos.resultados.titulo) {
      var cabeceraResultados = crear_('div', 'calc-dividendos__resultados-cabecera');
      cabeceraResultados.appendChild(crear_('h3', 'tipo-h4', datos.resultados.titulo));
      if (datos.resultados.descripcion) {
        cabeceraResultados.appendChild(crear_('p', 'tipo-cuerpo-sm calc-dividendos__paso-descripcion', datos.resultados.descripcion));
      }
      columnaResultados.appendChild(cabeceraResultados);
    }

    // Tres hijos sueltos y no un envoltorio de texto: el orden del DOM
    // (etiqueta → cifra → operación) es el orden de lectura que quiere un
    // lector de pantalla, y la retícula de components.css es la que pone
    // la cifra a la derecha sin alterarlo.
    var tarjetas = salidas.map(function (salida) {
      var tarjeta = crear_('div', 'calc-dividendos__resultado' + (salida.acento ? ' calc-dividendos__resultado--' + salida.acento : ''));
      tarjeta.appendChild(crear_('p', 'calc-dividendos__resultado-etiqueta', salida.etiqueta || ''));
      var valor = crear_('p', 'tipo-h3 calc-dividendos__resultado-valor');
      var operacion = crear_('p', 'tipo-cuerpo-sm calc-dividendos__resultado-operacion');
      tarjeta.appendChild(valor);
      tarjeta.appendChild(operacion);
      columnaResultados.appendChild(tarjeta);
      return { valor: valor, operacion: operacion, cfg: salida };
    });

    var panelRetro = crear_('div', 'calc-dividendos__retro');
    var iconoRetro = crear_('span', 'icono calc-dividendos__retro-icono');
    iconoRetro.setAttribute('aria-hidden', 'true');
    var textoRetro = crear_('div', 'calc-dividendos__retro-texto');
    var tituloRetro = crear_('p', 'tipo-h5 calc-dividendos__retro-titulo');
    var detalleRetro = crear_('p', 'tipo-cuerpo-sm');
    textoRetro.appendChild(tituloRetro);
    textoRetro.appendChild(detalleRetro);
    panelRetro.appendChild(iconoRetro);
    panelRetro.appendChild(textoRetro);
    columnaResultados.appendChild(panelRetro);

    if (datos.idea) {
      var idea = crear_('p', 'tipo-cuerpo calc-dividendos__idea');
      idea.appendChild(crear_('strong', null, datos.idea.titulo || 'Idea clave:'));
      idea.appendChild(document.createTextNode(' ' + datos.idea.texto));
      raiz.appendChild(idea);
    }
    if (datos.nota) {
      raiz.appendChild(crear_('p', 'tipo-caption calc-dividendos__nota', datos.nota));
    }

    // Cada operación cita la cifra de la tarjeta anterior: se formatea
    // con los decimales de ESA salida, no con los de la propia, para que
    // el número escrito en la operación sea idéntico al que se ve arriba.
    function salidaPorId(id) {
      for (var i = 0; i < salidas.length; i++) {
        if (salidas[i].id === id) return salidas[i];
      }
      return {};
    }

    function formatearSalida(id, valor) {
      var cfg = salidaPorId(id);
      return (campos[0].control.prefijo || '') + formatearNumero(valor, cfg.decimales, cfg.decimalesMax);
    }

    function interpolar(texto, repartido, retenido) {
      return String(texto == null ? '' : texto)
        .replace(/\{repartido\}/g, formatearNumero(repartido, 0))
        .replace(/\{retenido\}/g, formatearNumero(retenido, 0));
    }

    function recalcular() {
      var utilidad = parseFloat(campos[0].input.value);
      var repartido = parseFloat(campos[1].input.value);
      var retenido = 100 - repartido;

      campos.forEach(function (campo) {
        campo.output.textContent = formatearControl(campo.control, parseFloat(campo.input.value));
      });

      var montoARepartir = utilidad * (repartido / 100);
      var dividendoPorAccion = montoARepartir / accionesTotales;
      var dividendoEstudiante = dividendoPorAccion * accionesEstudiante;
      var moneda = campos[0].control.prefijo || '';
      var totalesTexto = formatearNumero(accionesTotales, 0);
      var propiasTexto = formatearNumero(accionesEstudiante, 0);

      var valores = {
        monto_a_repartir: montoARepartir,
        dividendo_por_accion: dividendoPorAccion,
        dividendo_estudiante: dividendoEstudiante
      };
      // La operación se arma con las cifras vivas, no con un texto del
      // contenido: es la parte que el DI pidió mostrar —"de dónde sale
      // este número"— y tiene que cambiar con cada arrastre.
      var operaciones = {
        monto_a_repartir: moneda + formatearNumero(utilidad, 0) + ' × ' + formatearNumero(repartido, 0) + ' %',
        dividendo_por_accion: formatearSalida('monto_a_repartir', montoARepartir) + ' ÷ ' + totalesTexto + ' acciones',
        dividendo_estudiante: formatearSalida('dividendo_por_accion', dividendoPorAccion) + ' × ' + propiasTexto + ' acciones'
      };

      tarjetas.forEach(function (t) {
        t.valor.textContent = formatearSalida(t.cfg.id, valores[t.cfg.id]);
        t.operacion.textContent = operaciones[t.cfg.id];
      });

      if (barra) {
        barra.repartido.style.inlineSize = repartido + '%';
        barra.retenido.style.inlineSize = retenido + '%';
        barra.textoRepartido.textContent = barra.etiquetaRepartido + ' · ' + formatearNumero(repartido, 0) + ' %';
        barra.textoRetenido.textContent = barra.etiquetaRetenido + ' · ' + formatearNumero(retenido, 0) + ' %';
      }

      // "sinReparto" (repartió 0 % de una utilidad que sí existe) es un
      // caso distinto de "cero" (no hubo utilidad): en el primero la
      // empresa decidió reinvertir todo, en el segundo no había nada que
      // decidir, y el texto de uno no sirve para el otro. Es opcional —
      // sin `retro.sinReparto` en el contenido cae en el tramo bajo, que
      // es el comportamiento del artefacto del DI.
      var estado;
      if (utilidad === 0) estado = 'cero';
      else if (repartido === 0 && retro.sinReparto) estado = 'sinReparto';
      else if (repartido >= umbralAlto) estado = 'alto';
      else if (repartido <= umbralBajo) estado = 'bajo';
      else estado = 'equilibrio';

      var cfgRetro = retro[estado] || {};
      panelRetro.dataset.estado = estado;
      iconoRetro.textContent = cfgRetro.icono || 'lightbulb';
      tituloRetro.textContent = cfgRetro.titulo || '';
      detalleRetro.textContent = interpolar(cfgRetro.texto, repartido, retenido);
    }

    campos.forEach(function (campo) {
      campo.input.addEventListener('input', recalcular);
    });
    recalcular();

    return raiz;
  }

  // A pesar del nombre (heredado de T8, cuando solo cubría I09–I12), esta
  // tabla es "constructores de widget autónomo, sin fieldset/Comprobar/
  // Reintentar" — C5 sumó I07/I08/I13 aquí por la misma razón que I09–I12,
  // no porque sean piezas insignia de unidad; E1 suma I15 por la misma
  // razón otra vez, y ajustes tanda 15 suma I16 (simulador de dividendos,
  // p24) por tercera vez. Ver el bloque C5/E1 en el encabezado del
  // archivo y el bloque de I16 junto a su constructor.
  var CONSTRUCTORES_INSIGNIA = {
    I07: construirTarjetasVolteables,
    I08: construirComparadorColumnas,
    I09: construirLineaTiempoRecorrible,
    I10: construirCalculadoraParametrica,
    I11: construirBoletaOrden,
    I12: construirDistribucionCapital,
    I13: construirTestPerfil,
    I15: construirCuestionario,
    I16: construirSimuladorDividendos
  };

  // Numeración del brief tras C0 (ver la nota al inicio del archivo):
  // I01/I02 van al revés de como los construyó T6, y completar/numerica/
  // autoevaluacion se dispatchan por nombre, no por número — el brief no
  // les reserva código. I06 (zonas sensibles sobre imagen) sigue sin
  // construirse; I07/I08/I13 se despachan por CONSTRUCTORES_INSIGNIA, no
  // por esta tabla (ver la nota junto a esa tabla).
  var CONSTRUCTORES = {
    I01: construirOpcionUnica,
    I02: construirVerdaderoFalso,
    I03: construirOpcionMultiple,
    I04: construirRelacionar,
    I05: construirOrdenar,
    completar: construirCompletar,
    numerica: construirNumerica,
    autoevaluacion: construirAutoevaluacion
  };

  /* ---- Montaje ------------------------------------------------------
     Une el fieldset de la pregunta con las acciones (Comprobar/
     Reintentar), el resumen de intentos y el reporte a SCORM. Una
     interacción por instancia — a diferencia de "un solo reproductor
     activo" en media.js, aquí no hay nada que deba ser único: la
     kitchen sink monta las ocho a la vez sin registro compartido. */
  function crear(interaccion, opciones) {
    if (!interaccion || !interaccion.tipo) {
      throw new Error('La interacción no trae "tipo".');
    }
    var datos = interaccion.datos || {};
    var idBase = 'quiz' + (++contadorInstancias);
    var idScorm = datos.id || idBase;
    // E2 — ver el bloque de documentación al inicio del archivo. Sin
    // `opciones.alCompletar`, no-op: ninguna interacción existente
    // cambia de comportamiento.
    var alCompletar = (opciones && typeof opciones.alCompletar === 'function')
      ? opciones.alCompletar
      : function () {};

    // Las interacciones insignia (T8) no son preguntas: no pasan por el
    // fieldset/Comprobar/Reintentar/retro de abajo, arman su propio DOM
    // completo y se devuelven directo — ver la nota de arquitectura en
    // el encabezado del archivo.
    var constructorInsignia = CONSTRUCTORES_INSIGNIA[interaccion.tipo];
    if (constructorInsignia) {
      return constructorInsignia(idBase, idScorm, datos, alCompletar);
    }

    var constructor = CONSTRUCTORES[interaccion.tipo];
    if (!constructor) {
      throw new Error('El tipo de interacción "' + interaccion.tipo + '" no existe en el catálogo I01–I05 (ni en completar/numerica/autoevaluacion) ni en I07/I08/I09–I13/I15/I16.');
    }
    var pregunta = constructor(idBase, idScorm, datos);

    var raiz = crear_('form', 'quiz-interaccion');
    raiz.setAttribute('novalidate', 'novalidate');
    raiz.appendChild(pregunta.fieldset);

    var intentosMaximos = datos.intentos || 0;
    var intentosUsados = 0;
    var bloqueada = false;

    var acciones = crear_('div', 'quiz-acciones');
    var botonComprobar = crear_('button', 'boton', 'Comprobar');
    botonComprobar.type = 'submit';
    var botonReintentar = crear_('button', 'boton boton--outline', 'Reintentar');
    botonReintentar.type = 'button';
    botonReintentar.hidden = true;
    acciones.appendChild(botonComprobar);
    acciones.appendChild(botonReintentar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm quiz-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    function textoRetro(estado) {
      var custom = datos.retroalimentacion && datos.retroalimentacion[estado];
      if (estado === 'correcto') return { titulo: 'Correcto', detalle: custom };
      if (estado === 'incorrecto') return { titulo: 'Incorrecto', detalle: custom };
      return { titulo: 'Respuesta registrada', detalle: custom };
    }

    function actualizarNota(resultado) {
      if (resultado === null || !OVA.scorm.disponible()) return;
      OVA.scorm.establecerValor('cmi.core.score.raw', resultado === 'correcto' ? '100' : '0');
      OVA.scorm.establecerValor('cmi.core.score.min', '0');
      OVA.scorm.establecerValor('cmi.core.score.max', '100');
      OVA.scorm.confirmar();
    }

    function comprobar(evento) {
      if (evento) evento.preventDefault();
      if (bloqueada) return;
      intentosUsados++;

      var resultado = pregunta.evaluar();
      var msg = textoRetro(resultado || 'neutral');
      pregunta.retro.mostrar(resultado || 'neutral', msg.titulo, msg.detalle);
      reportarSCORM(pregunta, resultado);
      actualizarNota(resultado);
      actualizarVariableContenido(datos.variable, resultado);

      pregunta.bloquear();
      botonComprobar.hidden = true;

      var agotado = intentosMaximos > 0 && intentosUsados >= intentosMaximos;
      var noGradable = resultado === null;
      var acierto = resultado === 'correcto';

      if (acierto || noGradable || agotado) {
        bloqueada = true;
        botonReintentar.hidden = true;
        if (resultado === 'incorrecto') pregunta.revelarCorrecta();
        resumen.textContent = noGradable
          ? 'Respuesta registrada.'
          : (acierto ? '¡Correcto!' : 'Se acabaron los intentos (' + intentosUsados + ').');
        alCompletar();
      } else {
        botonReintentar.hidden = false;
        resumen.textContent = 'Incorrecto. Intento ' + intentosUsados + ' de ' + intentosMaximos + '. Puedes volver a intentarlo.';
      }
    }

    function reintentar() {
      pregunta.desbloquear();
      pregunta.retro.ocultar();
      botonReintentar.hidden = true;
      botonComprobar.hidden = false;
      resumen.textContent = '';
    }

    raiz.addEventListener('submit', comprobar);
    botonReintentar.addEventListener('click', reintentar);

    return raiz;
  }

  window.OVA = window.OVA || {};
  window.OVA.quiz = {
    crear: crear
  };
})();
