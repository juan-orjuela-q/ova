/* ============================================================
   quiz.js — motor de evaluación (T6).

   Implementa el catálogo de interacciones I01–I08 (preguntas) y el
   bloque de retroalimentación I14, compartido por las ocho. Este
   archivo es la fuente de verdad de ese catálogo — igual que
   layouts.css lo es para L01–L13 — porque CLAUDE.md no fijó de
   antemano qué es cada tipo I01–I08 (solo nombra I09–I12, las
   interacciones insignia de T8, e I14, el bloque de retro). El
   catálogo de abajo es una decisión tomada en esta sesión, no una
   especificación previa; queda documentada aquí y en ESTADO.md para
   poder corregirla sin arqueología de código si la lectura no era la
   correcta.

   Cada interacción del contrato de contenido sigue siendo un objeto
   {tipo, datos} — una pregunta por pantalla, igual que cada
   interacción insignia I09–I12 de T8 ocupa su propia pantalla
   (L10, "interacción a pantalla completa"). "Banco de preguntas"
   (PLAN.md) es este catálogo de constructores por tipo, no una
   estructura de varias preguntas dentro de una sola pantalla:
   inventar esa estructura habría cambiado la forma {tipo, datos} que
   ya fija CLAUDE.md sin necesidad real — el banco vive repartido en
   pantallas, no apilado en una.

   Catálogo (todos con datos.id opcional, datos.intentos opcional
   —0/ausente = ilimitados— y datos.retroalimentacion.correcto/
   incorrecto opcional para el texto largo del bloque I14):

     I01 verdadero_falso  { enunciado, respuestaCorrecta:bool }
     I02 opcion_unica     { enunciado, opciones:[{id,texto}], correcta:id }
     I03 opcion_multiple  { enunciado, opciones:[{id,texto}], correctas:[id…] }
     I04 relacionar       { enunciado, izquierda:[{id,texto}], derecha:[{id,texto}], pares:{idIzq:idDer} }
     I05 ordenar          { enunciado, pasos:[{id,texto}] (orden mostrado), orden:[id…] (correcto) }
     I06 completar        { enunciado, respuestas:[texto…] (aceptadas) }
     I07 numerica         { enunciado, respuesta:number, tolerancia:number=0, unidad:string }
     I08 autoevaluacion   { enunciado, escala:[{valor,texto}] } — sin respuesta correcta, no cuenta en la nota.

   Ningún tipo usa arrastre: I04/I05 (los dos "de orden") resuelven con
   <select>, no drag-and-drop — mismo criterio que T8 exige de forma
   explícita para I09 ("alternativa de teclado al arrastre"), aplicado
   aquí desde el origen en vez de corregirlo después.

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
     evaluar() ('correcto'|'incorrecto'|null — null es I08, no
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

  var CONSTRUCTORES = {
    I01: construirVerdaderoFalso,
    I02: construirOpcionUnica,
    I03: construirOpcionMultiple,
    I04: construirRelacionar,
    I05: construirOrdenar,
    I06: construirCompletar,
    I07: construirNumerica,
    I08: construirAutoevaluacion
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
    var constructor = CONSTRUCTORES[interaccion.tipo];
    if (!constructor) {
      throw new Error('El tipo de interacción "' + interaccion.tipo + '" no existe en el catálogo I01–I08.');
    }
    var datos = interaccion.datos || {};
    var idBase = 'quiz' + (++contadorInstancias);
    var idScorm = datos.id || idBase;
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
