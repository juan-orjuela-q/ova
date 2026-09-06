/* ============================================================
   preferencias.js — preferencias del curso (D5, PLAN-REDISENO.md).

   Cuatro controles reales, no un overlay comercial (sección 0.7 del
   plan): tamaño de texto, movimiento reducido, transcripción siempre
   visible y autolocución (el disparo del audio en sí es D6; aquí solo
   se guarda la preferencia). Estado único en este módulo, persistido
   con storage.js bajo el mismo contenidoId que el progreso; dos
   superficies pueden montar el mismo panel (`crearPanel()`) y quedan
   sincronizadas porque las dos se suscriben al mismo estado.

   Se aplica como atributos en <html> (`data-texto`, `data-movimiento`,
   `data-transcripcion`), nunca como estilos inline: el CSS de
   tokens.css/base.css sigue mandando y el estado queda inspeccionable
   en el DOM. Cargado antes de router.js para que estos atributos
   existan desde el primer render, sin depender de que el router
   termine de inicializar.
   ============================================================ */
(function () {
  'use strict';

  var CONTENIDO_ID = (window.OVA_CONTENIDO && window.OVA_CONTENIDO.id) || 'ova';

  var DEFECTOS = {
    tamanoTexto: 100,
    movimientoReducido: false,
    transcripcionVisible: false,
    autolocucion: false
  };

  var guardado = OVA.storage.obtener(CONTENIDO_ID, 'preferencias', {});
  var estado = {
    tamanoTexto: [100, 125, 150].indexOf(guardado.tamanoTexto) !== -1 ? guardado.tamanoTexto : DEFECTOS.tamanoTexto,
    movimientoReducido: guardado.movimientoReducido === true,
    transcripcionVisible: guardado.transcripcionVisible === true,
    autolocucion: guardado.autolocucion === true
  };

  var suscriptores = [];

  function obtener() {
    return {
      tamanoTexto: estado.tamanoTexto,
      movimientoReducido: estado.movimientoReducido,
      transcripcionVisible: estado.transcripcionVisible,
      autolocucion: estado.autolocucion
    };
  }

  function persistir() {
    OVA.storage.establecer(CONTENIDO_ID, 'preferencias', estado);
  }

  // Tres atributos en <html>, cada uno presente solo cuando se aparta
  // del valor por defecto — mismo criterio que `hidden` en vez de una
  // clase siempre presente: su sola existencia ya dice algo. `data-texto`
  // es la excepción (siempre presente): tokens.css/base.css lo leen con
  // tres valores posibles, no con presencia/ausencia.
  function aplicar() {
    var raiz = document.documentElement;
    raiz.setAttribute('data-texto', String(estado.tamanoTexto));
    if (estado.movimientoReducido) {
      raiz.setAttribute('data-movimiento', 'reducido');
    } else {
      raiz.removeAttribute('data-movimiento');
    }
    if (estado.transcripcionVisible) {
      raiz.setAttribute('data-transcripcion', 'visible');
    } else {
      raiz.removeAttribute('data-transcripcion');
    }
  }

  function notificar() {
    var snapshot = obtener();
    suscriptores.forEach(function (fn) {
      fn(snapshot);
    });
  }

  function establecer(clave, valor) {
    if (!Object.prototype.hasOwnProperty.call(DEFECTOS, clave)) {
      console.error('[OVA] OVA.preferencias.establecer: "' + clave + '" no es una preferencia conocida.');
      return;
    }
    estado[clave] = valor;
    persistir();
    aplicar();
    notificar();
  }

  function suscribir(fn) {
    suscriptores.push(fn);
    return function cancelar() {
      var idx = suscriptores.indexOf(fn);
      if (idx !== -1) suscriptores.splice(idx, 1);
    };
  }

  aplicar();

  /* ---- Panel (D5) -----------------------------------------------------
     Un solo montaje real hoy: el popover de la barra superior (ver
     configurarPopover). p01a incrustaba una segunda copia a tamaño
     completo hasta AJUSTES.md tanda 5 (ítem 14) — router.js la reemplazó
     por un aviso corto que señala este mismo botón, así que crearPanel()
     ya no se llama dos veces en la práctica, pero sigue admitiendo más de
     un montaje simultáneo a propósito (cada llamada arma su propio árbol
     de controles nativos reales — radio/checkbox dentro de fieldset+
     legend, mismo criterio que quiz.js — y se suscribe al mismo estado):
     si algo vuelve a incrustarlo en el futuro, los dos montajes quedan
     sincronizados sin que ninguno sea dueño del dato. */
  var contadorPanel = 0;

  function crearOpcionTexto(prefijo, valor, radios) {
    var etiqueta = document.createElement('label');
    etiqueta.className = 'pref-panel__opcion';
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = prefijo + '-tamano-texto';
    input.value = String(valor);
    input.addEventListener('change', function () {
      if (input.checked) establecer('tamanoTexto', valor);
    });
    var texto = document.createElement('span');
    texto.textContent = valor + ' %';
    etiqueta.appendChild(input);
    etiqueta.appendChild(texto);
    radios[valor] = input;
    return etiqueta;
  }

  function crearToggle(clave, texto) {
    var etiqueta = document.createElement('label');
    etiqueta.className = 'pref-panel__opcion';
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.addEventListener('change', function () {
      establecer(clave, input.checked);
    });
    var span = document.createElement('span');
    span.textContent = texto;
    etiqueta.appendChild(input);
    etiqueta.appendChild(span);
    return { nodo: etiqueta, input: input };
  }

  function crearPanel() {
    contadorPanel += 1;
    var prefijo = 'pref-panel-' + contadorPanel;

    var raiz = document.createElement('div');
    raiz.className = 'pref-panel';

    var grupoTexto = document.createElement('fieldset');
    grupoTexto.className = 'pref-panel__grupo';
    var leyendaTexto = document.createElement('legend');
    leyendaTexto.textContent = 'Tamaño de texto';
    grupoTexto.appendChild(leyendaTexto);
    var opcionesTexto = document.createElement('div');
    opcionesTexto.className = 'pref-panel__opciones';
    var radiosTexto = {};
    [100, 125, 150].forEach(function (valor) {
      opcionesTexto.appendChild(crearOpcionTexto(prefijo, valor, radiosTexto));
    });
    grupoTexto.appendChild(opcionesTexto);

    var grupoToggles = document.createElement('fieldset');
    grupoToggles.className = 'pref-panel__grupo';
    var leyendaToggles = document.createElement('legend');
    leyendaToggles.textContent = 'Otras preferencias';
    grupoToggles.appendChild(leyendaToggles);
    var movimiento = crearToggle('movimientoReducido', 'Reducir el movimiento de la interfaz');
    var transcripcion = crearToggle('transcripcionVisible', 'Mostrar siempre la transcripción');
    var autolocucion = crearToggle('autolocucion', 'Autolocución: reproducir el audio del avatar al llegar a cada pantalla');
    grupoToggles.appendChild(movimiento.nodo);
    grupoToggles.appendChild(transcripcion.nodo);
    grupoToggles.appendChild(autolocucion.nodo);

    raiz.appendChild(grupoTexto);
    raiz.appendChild(grupoToggles);

    function actualizarControles(snapshot) {
      Object.keys(radiosTexto).forEach(function (valor) {
        radiosTexto[valor].checked = Number(valor) === snapshot.tamanoTexto;
      });
      movimiento.input.checked = snapshot.movimientoReducido;
      transcripcion.input.checked = snapshot.transcripcionVisible;
      autolocucion.input.checked = snapshot.autolocucion;
    }

    actualizarControles(obtener());
    suscribir(actualizarControles);

    return raiz;
  }

  /* ---- Popover (D5): solo para el montaje de la barra superior -------
     No es un modal: no atrapa foco (a diferencia del drawer/modal, que
     sí lo hacen a propósito), se cierra con Escape o con un clic fuera.
     El listener de clic se registra en captura y recién después de
     abrir, así que el propio clic que abre el popover nunca lo cierra
     de inmediato (ya terminó de propagarse por document antes de que
     este listener exista). */
  function configurarPopover(boton, contenedor) {
    if (!boton || !contenedor) return null;

    function abierto() {
      return !contenedor.hidden;
    }

    function alTeclado(evento) {
      if (evento.key !== 'Escape') return;
      cerrar();
      boton.focus();
    }

    function alClicFuera(evento) {
      if (contenedor.contains(evento.target) || boton.contains(evento.target)) return;
      cerrar();
    }

    function abrir() {
      if (abierto()) return;
      contenedor.hidden = false;
      boton.setAttribute('aria-expanded', 'true');
      document.addEventListener('keydown', alTeclado);
      document.addEventListener('click', alClicFuera, true);
    }

    function cerrar() {
      if (!abierto()) return;
      contenedor.hidden = true;
      boton.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', alTeclado);
      document.removeEventListener('click', alClicFuera, true);
    }

    boton.addEventListener('click', function () {
      if (abierto()) cerrar();
      else abrir();
    });

    return { abrir: abrir, cerrar: cerrar };
  }

  window.OVA = window.OVA || {};
  window.OVA.preferencias = {
    obtener: obtener,
    establecer: establecer,
    suscribir: suscribir,
    crearPanel: crearPanel,
    configurarPopover: configurarPopover
  };
})();
