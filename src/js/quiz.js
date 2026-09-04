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
       - Base de C1 (cápsula de "los tres mercados"). `eventos` llega en
         un orden que NO es el correcto —el contenido decide el
         desorden inicial, igual que `pasos`/`orden` en I05 (T6)—;
         `ordenCorrecto` es la secuencia cronológica real.
       - Reusa `.linea-tiempo` (T1.5/T7) para el armazón visual (nodo +
         contenido), siempre en su variante vertical: la horizontal
         (`--horizontal`, T7) se diseñó para un diagrama de solo
         lectura con texto centrado, no para filas con controles de
         reordenar — mezclar los dos habría exigido pelear contra ese
         layout en vez de reusarlo limpio.
       - La alternativa de teclado al arrastre, explícita en PLAN.md,
         son dos .boton-icono reales por paso ("Mover antes"/"Mover
         después", texto en .u-oculto-visualmente, mismo patrón que el
         botón del drawer en index.html) que intercambian el paso con
         su vecino inmediato — sin arrastre, sin manejador de tecla a
         mano, el navegador ya resuelve foco y activación de un
         <button>. El arrastre nativo (draggable, dragstart/dragover/
         drop) es una mejora progresiva solo de mouse sobre el mismo
         estado; ambos caminos llaman a la misma función de reordenar.
         Cada movimiento se anuncia con OVA.a11y.anunciar() (la región
         compartida de a11y.js, no una región propia) y el foco vuelve
         al botón del paso movido en su nueva posición — nunca se
         pierde tras reordenar.
       - Única de las cuatro insignia con una respuesta objetivamente
         correcta o incorrecta (a diferencia del explorador de
         escenarios de I10/I11): «Comprobar orden» sí evalúa contra
         ordenCorrecto y reporta el resultado real (correct/wrong, no
         siempre neutral) vía tipoScorm: 'sequencing' — el mismo mapeo
         que ya usa I05 para el tipo SCORM, aplicado aquí porque el
         dato de fondo es el mismo (secuenciar). Sigue sin tocar
         cmi.core.score: eso es exclusivo de las preguntas gradables del
         catálogo de arriba, ninguna insignia lo toca. No hay bloqueo ni límite de
         intentos — se puede reordenar y volver a comprobar cuantas
         veces se quiera, mismo criterio que I10/I11.

     I12 distribucion_capital { enunciado?, categorias:[{id,etiqueta,valorInicial}] }
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

     I07 tarjetas_volteables { enunciado?, tarjetas:[{frente,reverso}], retroalimentacion? }
       - Una `<button aria-expanded>` por tarjeta (pedido explícito del
         cierre de C5 en PLAN-CONTENIDO.md) — Enter/Espacio y el foco
         vienen gratis del navegador, mismo criterio que el resto del
         catálogo. Cada tarjeta guarda dos caras (`.calc-tarjeta__cara`)
         como hijos directos del botón; volver a pulsar la vuelve a
         tapar — no es un candado de una sola vía como el bloqueo de una
         pregunta gradable, es una ficha que se consulta cuantas veces
         se quiera, mismo espíritu que I10–I12.
       - El ícono del botón cambia de texto ('help' → 'task_alt') junto
         con el texto visible al voltear — nunca solo un color — y cada
         volteo se anuncia por `OVA.a11y.anunciar()` (la región
         compartida de a11y.js, no una región propia), mismo patrón que
         los botones "Mover antes/después" de I09.
       - Sin arrastre y sin evaluación: no hay "correcta". Al voltear
         las tarjetas completas al menos una vez, se revela
         `retroalimentacion` (si el contenido la trae) en un
         `.calc-resumen` (`role="status"`) y se reporta una sola vez a
         `cmi.interactions` (tipoScorm 'other', neutral) — el mismo
         criterio de "reportar al completar la exploración" que usa I08.
       - `datos.id` opcional, igual que el resto del catálogo.

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

     I13 test_perfil { enunciado?, preguntas:[{enunciado,opciones:[{texto,puntos}]}], resultados:[{minimo,maximo?,categoria,etiqueta,texto}], variable?, aviso? }
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

  function formatearNumero(valor, decimales) {
    var n = Number(valor);
    var d = decimales == null ? 0 : decimales;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: d,
      maximumFractionDigits: d
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
    // (documentado en el encabezado del archivo).
    valor_accion_dividendo: function (valores) {
      var dividendo = valores.dividendo;
      var r = valores.tasaDescuento / 100;
      var g = valores.tasaCrecimiento / 100;
      if (!(r - g > 0)) {
        return { error: 'La tasa de descuento debe ser mayor que la de crecimiento para que exista un valor.' };
      }
      return { valor: dividendo / (r - g) };
    }
  };

  function construirCalculadoraParametrica(idBase, idScorm, datos) {
    var formula = FORMULAS_CALCULADORA[datos.formula];
    if (!formula) {
      throw new Error('La fórmula "' + datos.formula + '" no existe en el catálogo de la calculadora paramétrica.');
    }
    var entradas = datos.entradas || [];
    var salida = datos.salida || {};

    var raiz = crear_('div', 'calc-calculadora');
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

    var resultado = crear_('div', 'calc-calculadora__resultado');
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoEtiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta', salida.etiqueta || '');
    var resultadoValor = document.createElement('output');
    resultadoValor.className = 'tipo-display-2 calc-calculadora__resultado-valor';
    resultadoTexto.appendChild(resultadoEtiqueta);
    resultadoTexto.appendChild(resultadoValor);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var acciones = crear_('div', 'calc-acciones');
    var botonRegistrar = crear_('button', 'boton', 'Registrar valorización');
    botonRegistrar.type = 'button';
    acciones.appendChild(botonRegistrar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    var ultimoCalculo = null;

    function recalcular() {
      Object.keys(controles).forEach(function (id) {
        var c = controles[id];
        c.output.textContent = textoEntrada(c.entrada, parseFloat(c.input.value));
      });
      var resultadoFormula = formula(valoresActuales());
      if (resultadoFormula.error) {
        ultimoCalculo = null;
        resultado.dataset.estado = 'error';
        resultadoIcono.textContent = 'error';
        resultadoValor.textContent = resultadoFormula.error;
        botonRegistrar.disabled = true;
      } else {
        ultimoCalculo = resultadoFormula.valor;
        resultado.dataset.estado = 'ok';
        resultadoIcono.textContent = 'insights';
        resultadoValor.textContent = formatearNumero(resultadoFormula.valor, salida.decimales) + (salida.unidad || '');
        botonRegistrar.disabled = false;
      }
    }

    Object.keys(controles).forEach(function (id) {
      controles[id].input.addEventListener('input', recalcular);
    });
    recalcular();

    function registrar() {
      if (ultimoCalculo === null) return;
      var textoValor = formatearNumero(ultimoCalculo, salida.decimales) + (salida.unidad || '');
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
      resumen.textContent = (salida.etiqueta || 'Resultado') + ' registrado: ' + textoValor + '.';
    }

    botonRegistrar.addEventListener('click', registrar);

    return raiz;
  }

  /* I11, boleta de compra (precio de mercado contra precio límite, base
     de C2). Reusa la misma cáscara `.calc-calculadora` que I10 dejó
     (enunciado, `.calc-calculadora__entradas`, resultado, acciones,
     resumen) — es literalmente "el patrón" que I10 debía establecer. Lo
     único nuevo es el selector de tipo de orden (fieldset/legend con dos
     <input type="radio"> nativos, mismo criterio que el catálogo de
     preguntas: el grupo de radios y su navegación con flechas vienen gratis del navegador).
     Regla de ejecución de una orden de COMPRA: a mercado siempre se
     ejecuta al precio de mercado vigente; a límite se ejecuta solo si el
     precio de mercado no supera el límite que definió el comprador — si
     lo supera, queda pendiente. "Pendiente" no es un error (no bloquea
     el envío ni usa el color de error): es un resultado legítimo de una
     orden límite, el mismo punto pedagógico del ejercicio. */
  function construirBoletaCompra(idBase, idScorm, datos) {
    var mercadoCfg = datos.mercado || {};
    var limiteCfg = datos.limite || {};
    var nombreTipo = idBase + '-boleta-tipo';

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var fieldsetTipo = document.createElement('fieldset');
    fieldsetTipo.className = 'calc-boleta__tipo';
    fieldsetTipo.appendChild(crear_('legend', 'calc-campo__etiqueta', 'Tipo de orden'));
    var opcionesTipo = crear_('div', 'calc-boleta__opciones');

    var radioMercado = document.createElement('input');
    radioMercado.type = 'radio';
    radioMercado.name = nombreTipo;
    radioMercado.value = 'mercado';
    radioMercado.id = idBase + '-tipo-mercado';
    var labelMercado = crear_('label', 'calc-opcion');
    labelMercado.setAttribute('for', radioMercado.id);
    labelMercado.appendChild(radioMercado);
    labelMercado.appendChild(document.createTextNode('A mercado'));

    var radioLimite = document.createElement('input');
    radioLimite.type = 'radio';
    radioLimite.name = nombreTipo;
    radioLimite.value = 'limite';
    radioLimite.id = idBase + '-tipo-limite';
    // Límite por defecto: es el caso que de verdad enseña la diferencia
    // (a mercado siempre se ejecuta, no hay nada que explorar ahí).
    radioLimite.checked = true;
    var labelLimite = crear_('label', 'calc-opcion');
    labelLimite.setAttribute('for', radioLimite.id);
    labelLimite.appendChild(radioLimite);
    labelLimite.appendChild(document.createTextNode('Límite'));

    opcionesTipo.appendChild(labelMercado);
    opcionesTipo.appendChild(labelLimite);
    fieldsetTipo.appendChild(opcionesTipo);
    raiz.appendChild(fieldsetTipo);

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

    var mercado = construirCampo('mercado', mercadoCfg);
    var limite = construirCampo('limite', limiteCfg);

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
    // oración explicativa ("Queda pendiente: …"), no un número corto.
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

    function tipoElegido() {
      return radioLimite.checked ? 'limite' : 'mercado';
    }

    function recalcular() {
      mercado.output.textContent = textoValor(mercado.cfg, parseFloat(mercado.input.value));
      limite.output.textContent = textoValor(limite.cfg, parseFloat(limite.input.value));

      var tipo = tipoElegido();
      // El precio límite solo importa para una orden límite: deshabilitado
      // (no oculto, sigue en el árbol de accesibilidad) cuando no aplica —
      // mismo criterio que .boton:disabled ya establecido en T2.
      limite.input.disabled = tipo !== 'limite';

      var precioMercado = parseFloat(mercado.input.value);
      var precioLimite = parseFloat(limite.input.value);
      var ejecutada = tipo === 'mercado' || precioMercado <= precioLimite;
      ultimoResultado = { tipo: tipo, ejecutada: ejecutada, precioMercado: precioMercado, precioLimite: precioLimite };

      if (ejecutada) {
        resultado.dataset.estado = 'ejecutada';
        resultadoIcono.textContent = 'check_circle';
        resultadoValor.textContent = 'Se ejecuta a ' + textoValor(mercado.cfg, precioMercado) +
          (tipo === 'limite' ? ' (tu límite era ' + textoValor(limite.cfg, precioLimite) + ').' : ' (precio de mercado).');
      } else {
        resultado.dataset.estado = 'pendiente';
        resultadoIcono.textContent = 'schedule';
        resultadoValor.textContent = 'Queda pendiente: el precio de mercado (' + textoValor(mercado.cfg, precioMercado) +
          ') supera tu límite (' + textoValor(limite.cfg, precioLimite) + ').';
      }
    }

    mercado.input.addEventListener('input', recalcular);
    limite.input.addEventListener('input', recalcular);
    radioMercado.addEventListener('change', recalcular);
    radioLimite.addEventListener('change', recalcular);
    recalcular();

    function enviar() {
      var r = ultimoResultado;
      var pregunta = {
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () {
          return 'tipo=' + r.tipo + ',precioMercado=' + r.precioMercado + ',precioLimite=' + r.precioLimite;
        },
        textoCorrecta: function () { return null; }
      };
      reportarSCORM(pregunta, 'neutral');
      if (datos.variable && datos.variable.nombre) {
        OVA.state.establecerVariable(datos.variable.nombre, {
          tipo: r.tipo,
          ejecutada: r.ejecutada,
          precioMercado: r.precioMercado,
          precioLimite: r.precioLimite
        });
      }
      resumen.textContent = r.ejecutada
        ? 'Boleta enviada: se ejecutó a ' + textoValor(mercado.cfg, r.precioMercado) + '.'
        : 'Boleta enviada: quedó pendiente (no se ejecutó).';
    }

    botonEnviar.addEventListener('click', enviar);

    return raiz;
  }

  /* I09, línea de tiempo ordenable (secuenciar etapas de una operación
     —repo, TTV—, base de C1). Reusa `.linea-tiempo` (T1.5/T7) para el
     nodo/contenido de cada paso, siempre en su variante vertical (la
     `--horizontal` de T7 es de solo lectura, centrada, no pensada para
     llevar controles). La alternativa de teclado al arrastre que exige
     PLAN.md son dos `.boton-icono` por paso que intercambian con el
     vecino inmediato; el arrastre nativo (mouse) llama a la misma
     función de reordenar. A diferencia de I10/I11 (exploradores de
     escenario sin "correcta"), aquí sí hay un orden objetivamente
     correcto: «Comprobar orden» evalúa contra `ordenCorrecto` y
     reporta correct/wrong de verdad, sin tocar cmi.core.score (eso
     sigue siendo exclusivo de las preguntas gradables) ni bloquear el widget. */
  function construirLineaTiempoOrdenable(idBase, idScorm, datos) {
    var eventos = datos.eventos || [];
    var ordenCorrecto = datos.ordenCorrecto || [];
    var textos = {};
    eventos.forEach(function (evento) { textos[evento.id] = evento.texto; });
    var orden = eventos.map(function (evento) { return evento.id; });

    var raiz = crear_('div', 'calc-calculadora');
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));
    if (datos.operacion) raiz.appendChild(crear_('p', 'tipo-h5', datos.operacion));

    var lista = crear_('ol', 'linea-tiempo calc-linea-tiempo');
    raiz.appendChild(lista);

    var arrastrado = null;

    function mover(indice, delta) {
      var destino = indice + delta;
      if (destino < 0 || destino >= orden.length) return;
      var id = orden.splice(indice, 1)[0];
      orden.splice(destino, 0, id);
      renderizar();
      OVA.a11y.anunciar('"' + textos[id] + '" ahora en la posición ' + (destino + 1) + ' de ' + orden.length + '.');
      var pasoNuevo = lista.children[destino];
      var botones = pasoNuevo.querySelectorAll('.boton-icono');
      var preferido = delta < 0 ? botones[0] : botones[1];
      if (preferido && !preferido.disabled) preferido.focus();
      else if (botones[0] && !botones[0].disabled) botones[0].focus();
      else if (botones[1]) botones[1].focus();
    }

    function renderizar() {
      lista.textContent = '';
      orden.forEach(function (id, i) {
        var li = crear_('li', 'linea-tiempo__paso calc-linea-tiempo__paso');
        li.draggable = true;

        var nodo = crear_('span', 'linea-tiempo__nodo', String(i + 1));
        nodo.setAttribute('aria-hidden', 'true');
        li.appendChild(nodo);

        var contenido = crear_('div', 'linea-tiempo__contenido');
        contenido.appendChild(crear_('p', 'tipo-cuerpo-sm', textos[id]));
        li.appendChild(contenido);

        var controles = crear_('div', 'calc-linea-tiempo__controles');

        var antes = crear_('button', 'boton-icono');
        antes.type = 'button';
        var iconoAntes = crear_('span', 'icono', 'arrow_upward');
        iconoAntes.setAttribute('aria-hidden', 'true');
        antes.appendChild(iconoAntes);
        antes.appendChild(crear_('span', 'u-oculto-visualmente', 'Mover "' + textos[id] + '" antes'));
        antes.disabled = i === 0;
        (function (indice) { antes.addEventListener('click', function () { mover(indice, -1); }); })(i);

        var despues = crear_('button', 'boton-icono');
        despues.type = 'button';
        var iconoDespues = crear_('span', 'icono', 'arrow_downward');
        iconoDespues.setAttribute('aria-hidden', 'true');
        despues.appendChild(iconoDespues);
        despues.appendChild(crear_('span', 'u-oculto-visualmente', 'Mover "' + textos[id] + '" después'));
        despues.disabled = i === orden.length - 1;
        (function (indice) { despues.addEventListener('click', function () { mover(indice, 1); }); })(i);

        controles.appendChild(antes);
        controles.appendChild(despues);
        li.appendChild(controles);

        (function (indice) {
          li.addEventListener('dragstart', function () { arrastrado = indice; });
          li.addEventListener('dragover', function (evento) { evento.preventDefault(); });
          li.addEventListener('drop', function (evento) {
            evento.preventDefault();
            if (arrastrado === null || arrastrado === indice) return;
            mover(arrastrado, indice - arrastrado);
            arrastrado = null;
          });
        })(i);

        lista.appendChild(li);
      });
    }

    renderizar();

    var acciones = crear_('div', 'calc-acciones');
    var botonComprobar = crear_('button', 'boton', 'Comprobar orden');
    botonComprobar.type = 'button';
    acciones.appendChild(botonComprobar);
    raiz.appendChild(acciones);

    var resultado = crear_('div', 'calc-calculadora__resultado');
    resultado.hidden = true;
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoValor = document.createElement('output');
    resultadoValor.className = 'tipo-h5 calc-calculadora__resultado-valor';
    resultadoTexto.appendChild(resultadoValor);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    function ordenIgual(a, b) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    function comprobar() {
      var correcto = ordenIgual(orden, ordenCorrecto);
      resultado.hidden = false;
      resultado.dataset.estado = correcto ? 'correcto' : 'incorrecto';
      resultadoIcono.textContent = correcto ? 'check_circle' : 'cancel';
      resultadoValor.textContent = correcto
        ? 'El orden es correcto.'
        : 'Todavía no es el orden correcto — sigue ajustando con los botones o arrastrando.';
      var pregunta = {
        idScorm: idScorm,
        tipoScorm: 'sequencing',
        textoRespuesta: function () { return orden.join(','); },
        textoCorrecta: function () { return ordenCorrecto.join(','); }
      };
      reportarSCORM(pregunta, correcto ? 'correcto' : 'incorrecto');
      resumen.textContent = correcto
        ? 'Resultado registrado: orden correcto.'
        : 'Resultado registrado: orden incorrecto. Puedes seguir intentando.';
    }

    botonComprobar.addEventListener('click', comprobar);

    return raiz;
  }

  /* I12, distribución de capital (armar un portafolio, base de C3 junto
     con I10). Reusa OVA.charts.crear({tipo:'distribucion'}) de T7 para
     la barra apilada en vivo en vez de duplicar ese SVG — cada slider
     recalcula los segmentos y reemplaza la figura completa. Validación
     de dominio con el mismo patrón que el error de I10: la suma debe
     ser exactamente 100, si no lo es el resultado pasa a
     data-estado="error" y el registro se deshabilita mientras dure. */
  function construirDistribucionCapital(idBase, idScorm, datos) {
    var categorias = datos.categorias || [];
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
      var etiqueta = crear_('label', 'calc-campo__etiqueta', cat.etiqueta);
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

    var acciones = crear_('div', 'calc-acciones');
    var botonRegistrar = crear_('button', 'boton', 'Registrar distribución');
    botonRegistrar.type = 'button';
    acciones.appendChild(botonRegistrar);
    raiz.appendChild(acciones);

    var resumen = crear_('p', 'tipo-cuerpo-sm calc-resumen');
    resumen.setAttribute('role', 'status');
    raiz.appendChild(resumen);

    var totalValido = false;

    function recalcular() {
      var total = 0;
      var segmentos = [];
      Object.keys(controles).forEach(function (id) {
        var c = controles[id];
        var v = parseFloat(c.input.value);
        c.output.textContent = formatearNumero(v, 0) + ' %';
        total += v;
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
        Object.keys(controles).length + ' categorías.';
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

    var tarjetas = tarjetasDatos.map(function (datosTarjeta, indice) {
      var boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'calc-tarjeta';
      boton.setAttribute('aria-expanded', 'false');

      var icono = crear_('span', 'icono calc-tarjeta__icono', 'help');
      icono.setAttribute('aria-hidden', 'true');
      boton.appendChild(icono);

      var caraFrente = crear_('span', 'calc-tarjeta__cara calc-tarjeta__cara--frente');
      caraFrente.appendChild(crear_('span', 'tipo-h5', datosTarjeta.frente));
      var caraReverso = crear_('span', 'calc-tarjeta__cara calc-tarjeta__cara--reverso', datosTarjeta.reverso);
      caraReverso.hidden = true;
      boton.appendChild(caraFrente);
      boton.appendChild(caraReverso);

      grilla.appendChild(boton);
      return { boton: boton, icono: icono, caraFrente: caraFrente, caraReverso: caraReverso, volteada: false };
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
      t.caraFrente.hidden = nuevo;
      t.caraReverso.hidden = !nuevo;
      t.icono.textContent = nuevo ? 'task_alt' : 'help';
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
    if (datos.enunciado) raiz.appendChild(crear_('p', 'calc-calculadora__enunciado tipo-cuerpo', datos.enunciado));

    var entradas = crear_('div', 'calc-calculadora__entradas');
    raiz.appendChild(entradas);

    var respuestas = new Array(preguntas.length).fill(null);

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
    var resultadoIcono = crear_('span', 'icono calc-calculadora__resultado-icono');
    resultadoIcono.setAttribute('aria-hidden', 'true');
    var resultadoTexto = crear_('div', 'calc-calculadora__resultado-texto');
    var resultadoEtiqueta = crear_('p', 'calc-calculadora__resultado-etiqueta');
    var resultadoValor = document.createElement('output');
    resultadoValor.className = 'tipo-h5 calc-calculadora__resultado-valor';
    var resultadoAviso = crear_('p', 'tipo-cuerpo-sm calc-calculadora__resultado-aviso');
    resultadoAviso.hidden = true;
    resultadoTexto.appendChild(resultadoEtiqueta);
    resultadoTexto.appendChild(resultadoValor);
    resultadoTexto.appendChild(resultadoAviso);
    resultado.appendChild(resultadoIcono);
    resultado.appendChild(resultadoTexto);
    raiz.appendChild(resultado);

    var acciones = crear_('div', 'calc-acciones');
    var botonVer = crear_('button', 'boton', 'Ver resultado');
    botonVer.type = 'button';
    botonVer.disabled = true;
    acciones.appendChild(botonVer);
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

      if (match) {
        resultado.dataset.estado = 'ok';
        resultadoIcono.textContent = 'task_alt';
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
        resultadoIcono.textContent = 'error';
        resultadoEtiqueta.textContent = 'No se pudo calcular tu perfil';
        resultadoValor.textContent = 'El puntaje obtenido no coincide con ningún resultado configurado.';
        resumen.textContent = 'No se registró resultado: revisa el contenido de esta pregunta.';
      }

      reportarSCORM({
        idScorm: idScorm,
        tipoScorm: 'other',
        textoRespuesta: function () { return respuestas.join(','); },
        textoCorrecta: function () { return null; }
      }, 'neutral');
    }

    botonVer.addEventListener('click', verResultado);

    return raiz;
  }

  // A pesar del nombre (heredado de T8, cuando solo cubría I09–I12), esta
  // tabla es "constructores de widget autónomo, sin fieldset/Comprobar/
  // Reintentar" — C5 sumó I07/I08/I13 aquí por la misma razón que I09–I12,
  // no porque sean piezas insignia de unidad. Ver el bloque C5 en el
  // encabezado del archivo.
  var CONSTRUCTORES_INSIGNIA = {
    I07: construirTarjetasVolteables,
    I08: construirComparadorColumnas,
    I09: construirLineaTiempoOrdenable,
    I10: construirCalculadoraParametrica,
    I11: construirBoletaCompra,
    I12: construirDistribucionCapital,
    I13: construirTestPerfil
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
  function crear(interaccion) {
    if (!interaccion || !interaccion.tipo) {
      throw new Error('La interacción no trae "tipo".');
    }
    var datos = interaccion.datos || {};
    var idBase = 'quiz' + (++contadorInstancias);
    var idScorm = datos.id || idBase;

    // Las interacciones insignia (T8) no son preguntas: no pasan por el
    // fieldset/Comprobar/Reintentar/retro de abajo, arman su propio DOM
    // completo y se devuelven directo — ver la nota de arquitectura en
    // el encabezado del archivo.
    var constructorInsignia = CONSTRUCTORES_INSIGNIA[interaccion.tipo];
    if (constructorInsignia) {
      return constructorInsignia(idBase, idScorm, datos);
    }

    var constructor = CONSTRUCTORES[interaccion.tipo];
    if (!constructor) {
      throw new Error('El tipo de interacción "' + interaccion.tipo + '" no existe en el catálogo I01–I05 (ni en completar/numerica/autoevaluacion) ni en I07/I08/I09–I13.');
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
