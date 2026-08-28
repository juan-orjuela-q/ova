/* ============================================================
   router.js — navegación entre pantallas y motor de contenido.

   Dos trabajos: 1) traducir cada pantalla del JSON en el árbol DOM
   de su layout (el catálogo PLANTILLAS de abajo) y 2) decidir cuál
   pantalla está activa a partir del hash de la URL, montarla en
   #app y avisarle a state.js/a11y.js del cambio.

   Por qué hash y no history.pushState: el hash sobrevive un F5 sin
   ayuda de JS (la URL ya lo trae) y no depende de que el servidor
   sepa resolver rutas — imprescindible para abrir desde file:// y
   para un paquete SCORM que no tiene servidor propio.

   Catálogo de layouts: esta sesión solo implementa L02, L05, L06 y
   L11 —los que usa el JSON de prueba de T2—. Cualquier otro código,
   aunque exista en el catálogo L01–L13 de CLAUDE.md, todavía no
   tiene plantilla aquí y cae por la misma rama de fallo ruidoso que
   un código inventado: cada tarea futura (T3+) que dependa de un
   layout nuevo agrega su entrada a PLANTILLAS, nunca reinterpreta
   esta función. El mismo patrón aplica cuando media.js/quiz.js
   agreguen interacción — no existe todavía porque el JSON de prueba
   no la usa.

   Nada de innerHTML con texto del contenido: todo nodo de texto se
   arma con createElement/textContent.
   ============================================================ */
(function () {
  'use strict';

  var CATALOGO_LAYOUTS = [
    'L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07',
    'L08', 'L09', 'L10', 'L11', 'L12', 'L13'
  ];

  var contenidoActual = null;

  /* ---- Construcción de DOM por layout --------------------------- */

  function crearKicker(texto) {
    var span = document.createElement('span');
    span.className = 'layout__kicker tipo-etiqueta';
    span.textContent = texto;
    return span;
  }

  function crearTitulo(texto, clase) {
    // Siempre <h2> real: cada pantalla es una sección nueva y el
    // foco de a11y.js necesita un encabezado de verdad, no un <p>
    // con apariencia de título (regla dura 2 de CLAUDE.md).
    var el = document.createElement('h2');
    el.className = 'layout__titulo ' + clase;
    el.textContent = texto;
    return el;
  }

  function crearCuerpo(parrafos, claseTexto) {
    var div = document.createElement('div');
    div.className = 'layout__cuerpo';
    (parrafos || []).forEach(function (texto) {
      var p = document.createElement('p');
      p.className = claseTexto;
      p.textContent = texto;
      div.appendChild(p);
    });
    return div;
  }

  function crearRaiz(modificador) {
    var raiz = document.createElement('div');
    // .layout--transicion es la animación de cambio de pantalla
    // (item 1 del inventario de movimiento); .layout__* heredan la
    // entrada escalonada que ya define layouts.css (item 2).
    raiz.className = 'layout layout--' + modificador + ' layout--transicion';
    return raiz;
  }

  var PLANTILLAS = {};

  PLANTILLAS.L02 = function (pantalla) {
    var raiz = crearRaiz('l02');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo'));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L05 = function (pantalla) {
    var raiz = crearRaiz('l05');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-display-2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo-lg'));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L06 = function (pantalla) {
    var raiz = crearRaiz('l06');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h3');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo'));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L11 = function (pantalla) {
    var raiz = crearRaiz('l11');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo-lg'));
    return { raiz: raiz, titulo: titulo };
  };

  /* ---- Montaje ------------------------------------------------- */

  function limpiarApp() {
    var app = document.getElementById('app');
    while (app.firstChild) app.removeChild(app.firstChild);
    return app;
  }

  function fallarPantalla(pantalla, motivo) {
    console.error('[OVA] ' + motivo + ' (pantalla "' + (pantalla && pantalla.id) + '").');
    var app = limpiarApp();
    var aviso = document.createElement('div');
    aviso.className = 'u-contenedor';
    aviso.setAttribute('role', 'alert');
    var titulo = document.createElement('p');
    titulo.className = 'tipo-h3';
    titulo.textContent = 'No se pudo mostrar esta pantalla';
    var texto = document.createElement('p');
    texto.className = 'tipo-cuerpo';
    texto.textContent = motivo;
    aviso.appendChild(titulo);
    aviso.appendChild(texto);
    app.appendChild(aviso);
    return null;
  }

  function montarPantalla(pantalla) {
    if (CATALOGO_LAYOUTS.indexOf(pantalla.layout) === -1) {
      return fallarPantalla(pantalla, 'El layout "' + pantalla.layout + '" no existe en el catálogo L01–L13.');
    }
    var plantilla = PLANTILLAS[pantalla.layout];
    if (!plantilla) {
      return fallarPantalla(pantalla, 'El layout "' + pantalla.layout + '" es válido pero todavía no está implementado en el motor.');
    }
    var resultado = plantilla(pantalla);
    var app = limpiarApp();
    app.appendChild(resultado.raiz);
    return resultado;
  }

  /* ---- Navegación ------------------------------------------------ */

  function idDesdeHash() {
    var hash = window.location.hash.replace(/^#/, '');
    return hash || null;
  }

  function actualizarNavInferior(inst) {
    var botonAnterior = document.getElementById('nav-anterior');
    var botonSiguiente = document.getElementById('nav-siguiente');
    var paso = document.getElementById('nav-paso');
    if (botonAnterior) botonAnterior.disabled = inst.esPrimera;
    if (botonSiguiente) botonSiguiente.disabled = inst.esUltima;
    if (paso) paso.textContent = 'Pantalla ' + (inst.indice + 1) + ' de ' + inst.total;
  }

  function navegarA(id, opciones) {
    opciones = opciones || {};
    var ok = OVA.state.ir(id);
    if (!ok) {
      console.error('[OVA] No existe una pantalla con id "' + id + '" en el contenido cargado.');
      return false;
    }

    var pantalla = OVA.state.actual();
    var resultado = montarPantalla(pantalla);

    if (opciones.actualizarHistorial !== false && window.location.hash.replace(/^#/, '') !== id) {
      window.location.hash = id;
    }

    var inst = OVA.state.instantanea();
    actualizarNavInferior(inst);
    document.title = pantalla.titulo + ' · ' + contenidoActual.titulo;

    // En la carga inicial no se roba el foco: el usuario todavía no
    // ha interactuado con la página. En cada navegación posterior sí,
    // para que quien usa lector de pantalla note el cambio de sección.
    if (!opciones.esInicial && resultado && resultado.titulo) {
      OVA.a11y.enfocarEncabezado(resultado.titulo);
      OVA.a11y.anunciar('Pantalla ' + (inst.indice + 1) + ' de ' + inst.total + ': ' + pantalla.titulo);
    }

    return true;
  }

  function siguiente() {
    var inst = OVA.state.instantanea();
    if (inst.esUltima) return false;
    return navegarA(contenidoActual.pantallas[inst.indice + 1].id);
  }

  function anterior() {
    var inst = OVA.state.instantanea();
    if (inst.esPrimera) return false;
    return navegarA(contenidoActual.pantallas[inst.indice - 1].id);
  }

  function alCambiarHash() {
    var id = idDesdeHash();
    var actual = OVA.state.actual();
    if (id && (!actual || id !== actual.id)) {
      navegarA(id, { actualizarHistorial: false });
    }
  }

  function configurarNavInferior() {
    var botonAnterior = document.getElementById('nav-anterior');
    var botonSiguiente = document.getElementById('nav-siguiente');
    if (botonAnterior) botonAnterior.addEventListener('click', anterior);
    if (botonSiguiente) botonSiguiente.addEventListener('click', siguiente);
  }

  function init(contenido) {
    contenidoActual = contenido;
    OVA.state.init(contenido.pantallas, {
      contenidoId: contenido.id,
      idInicial: idDesdeHash()
    });
    configurarNavInferior();
    window.addEventListener('hashchange', alCambiarHash);
    navegarA(OVA.state.actual().id, { esInicial: true });
  }

  window.OVA = window.OVA || {};
  window.OVA.router = {
    init: init,
    siguiente: siguiente,
    anterior: anterior
  };
})();
