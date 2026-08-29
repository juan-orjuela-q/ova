/* ============================================================
   router.js — navegación entre pantallas, motor de contenido y
   chrome del OVA (T3: barra superior, drawer de índice, reanudar).

   Tres trabajos: 1) traducir cada pantalla del JSON en el árbol DOM
   de su layout (el catálogo PLANTILLAS de abajo), 2) decidir cuál
   pantalla está activa a partir del hash de la URL, montarla en
   #app y avisarle a state.js/a11y.js del cambio, y 3) mantener el
   chrome alrededor de #app (título, progreso, guardado, drawer,
   reanudar) en sincronía con cada navegación — vive aquí y no en un
   archivo aparte porque toda esa sincronía cuelga del mismo evento
   (navegarA) que ya gestiona esta pieza.

   Por qué hash y no history.pushState: el hash sobrevive un F5 sin
   ayuda de JS (la URL ya lo trae) y no depende de que el servidor
   sepa resolver rutas — imprescindible para abrir desde file:// y
   para un paquete SCORM que no tiene servidor propio.

   Catálogo de layouts: T2 implementó L02, L05, L06 y L11 (los que
   usaba su JSON de prueba); T4 agrega L03 y L04, los dos únicos con
   columna de media; T6 agrega L10, el único con columna de
   interacción (delega en OVA.quiz.crear, catálogo I01–I08 — ver
   quiz.js; T8 agrega I10/I11 por el mismo punto de entrada); T7 agrega L09 (columna de datos obligatoria, diagrama de
   proceso) y hace "datos" opcional en L02 (delega en OVA.charts.crear,
   catálogo cifra/tabla/variación/línea/barras/distribución/proceso —
   ver charts.js). Cualquier otro código, aunque exista en el catálogo
   L01–L13 de CLAUDE.md, todavía no tiene plantilla aquí y cae por la
   misma rama de fallo ruidoso que un código inventado: cada tarea
   futura que dependa de un layout nuevo agrega su entrada a
   PLANTILLAS, nunca reinterpreta esta función.

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
  // Elemento que tenía el foco antes de abrir el drawer (T3): cerrar por
  // Escape, backdrop o el botón "Cerrar" se lo devuelve. Cerrar por haber
  // elegido una pantalla de la lista no lo usa — ahí el foco lo toma
  // enfocarEncabezado() de la pantalla nueva, sería un salto de foco doble.
  var elementoAntesDelDrawer = null;

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

  // T4: única entrada de layout que renderiza pantalla.media. Solo
  // sabe construir video (OVA.media.crear falla ruidoso para
  // cualquier otro tipo.tipo); si la pantalla no trae media en
  // absoluto, cae por fallarPantalla igual que un layout inventado —
  // L03/L04 no tienen sentido sin su columna de media.
  function crearMedia(media) {
    if (!media) throw new Error('Esta pantalla no trae "media" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__media';
    var reproductor = OVA.media.crear(media);
    if (!reproductor) throw new Error('No se pudo construir el reproductor de media (ver consola).');
    contenedor.appendChild(reproductor);
    return contenedor;
  }

  // T6: única entrada de layout que renderiza pantalla.interaccion.
  // Delega en OVA.quiz.crear, que falla ruidoso si interaccion.tipo no
  // existe en el catálogo I01–I08/I10/I11 — mismo criterio que crearMedia
  // con media.tipo. Sin interaccion en absoluto, también falla: L10 no
  // tiene sentido sin ella. (T8 agrega I10/I11, las dos primeras de las
  // cuatro interacciones insignia, por el mismo punto de entrada.)
  function crearInteraccion(interaccion) {
    if (!interaccion) throw new Error('Esta pantalla no trae "interaccion" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__interaccion';
    var nodo = OVA.quiz.crear(interaccion);
    if (!nodo) throw new Error('No se pudo construir la interacción (ver consola).');
    contenedor.appendChild(nodo);
    return contenedor;
  }

  // T7: única entrada de layout que renderiza pantalla.datos. Delega en
  // OVA.charts.crear, que falla ruidoso si datos.tipo no existe en el
  // catálogo de charts.js — mismo criterio que crearMedia con media.tipo
  // y crearInteraccion con interaccion.tipo. A diferencia de esas dos,
  // si "datos" es obligatorio o no lo decide quien llama, no esta
  // función: PLANTILLAS.L09 la llama siempre (el layout no tiene sentido
  // sin su diagrama), PLANTILLAS.L02 solo si pantalla.datos existe.
  function crearDatos(datos) {
    if (!datos) throw new Error('Esta pantalla no trae "datos" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__datos';
    var nodo = OVA.charts.crear(datos);
    if (!nodo) throw new Error('No se pudo construir el gráfico (ver consola).');
    contenedor.appendChild(nodo);
    return contenedor;
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
    // T7: "datos" es opcional en L02 (a diferencia de L09, más abajo) —
    // s01 sigue siendo puro texto sin él, s08/s10 lo agregan.
    if (pantalla.datos) raiz.appendChild(crearDatos(pantalla.datos));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L03 = function (pantalla) {
    var raiz = crearRaiz('l03');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo'));
    raiz.appendChild(crearMedia(pantalla.media));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L04 = function (pantalla) {
    // .layout--l04 .layout__media usa order:-1 (layouts.css) para
    // aparecer primero visualmente; el DOM sigue el orden de lectura
    // kicker → título → cuerpo → media (mismo criterio que .layout__figura
    // en L12 — es la jerarquía visual la que decide el orden en pantalla,
    // no el orden del documento).
    var raiz = crearRaiz('l04');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo'));
    raiz.appendChild(crearMedia(pantalla.media));
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

  // T7: L09 exige "datos" (igual que L03/L04 exigen "media" y L10 exige
  // "interaccion") — es el layout que PLAN.md/layouts.css nombran
  // explícitamente para el diagrama de proceso, no tiene sentido sin él.
  // El cuerpo es opcional: una intro corta antes del diagrama, no el
  // contenido principal de la pantalla.
  PLANTILLAS.L09 = function (pantalla) {
    var raiz = crearRaiz('l09');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    if (pantalla.cuerpo && pantalla.cuerpo.length) {
      raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo'));
    }
    raiz.appendChild(crearDatos(pantalla.datos));
    return { raiz: raiz, titulo: titulo };
  };

  PLANTILLAS.L10 = function (pantalla) {
    // Sin .layout__cuerpo a propósito: L10 es "interacción a pantalla
    // completa" (layouts.css), kicker + título compactos y centrados,
    // la interacción ocupa el espacio principal — igual que su
    // marcador en la kitchen sink desde T1.5.
    var raiz = crearRaiz('l10');
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearInteraccion(pantalla.interaccion));
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
    // Desde T4 una plantilla puede fallar en tiempo real (media.tipo
    // inválido, media ausente en un layout que la exige): el mismo
    // criterio de "nunca renderizar a medias en silencio" aplica aquí,
    // no solo al layout inexistente.
    var resultado;
    try {
      resultado = plantilla(pantalla);
    } catch (error) {
      return fallarPantalla(pantalla, error.message);
    }
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

  /* ---- Chrome: barra superior (T3) -------------------------------
     Título, barra de progreso y estado de guardado. La barra de
     progreso es un div propio con role="progressbar", no un
     <progress> nativo: el ítem 4 del inventario de movimiento exige
     animar su avance con --dur-slow, y solo transform/opacity pueden
     animarse (nunca width) — un <progress> no expone su relleno
     interno para transicionarlo así entre navegadores. El track usa
     --surface-subtle-2 (gris 100), no --surface-muted (gris 200):
     CLAUDE.md prohíbe naranja de relleno sobre superficies del gris
     200 al 600, y este relleno es naranja. */
  function actualizarBarraSuperior(pantalla) {
    var titulo = document.getElementById('nav-barra-titulo');
    if (titulo) titulo.textContent = pantalla.titulo;
  }

  function actualizarProgreso(inst) {
    var barra = document.getElementById('nav-progreso');
    var relleno = document.getElementById('nav-progreso-relleno');
    var texto = document.getElementById('nav-progreso-texto');
    var completadas = inst.visitadas.length;
    var fraccion = inst.total ? completadas / inst.total : 0;
    if (barra) {
      barra.setAttribute('aria-valuemax', String(inst.total));
      barra.setAttribute('aria-valuenow', String(completadas));
      barra.setAttribute('aria-valuetext', completadas + ' de ' + inst.total + ' pantallas');
    }
    if (relleno) relleno.style.transform = 'scaleX(' + fraccion + ')';
    if (texto) texto.textContent = completadas + ' / ' + inst.total + ' pantallas';
  }

  function actualizarGuardado() {
    var icono = document.getElementById('nav-guardado-icono');
    var texto = document.getElementById('nav-guardado-texto');
    // El color nunca es el único código de un estado (regla dura de
    // CLAUDE.md): el ícono y el texto cambian juntos según si
    // localStorage de verdad está disponible, no solo si state.js
    // *intentó* guardar.
    var ok = OVA.storage.disponible();
    if (icono) icono.textContent = ok ? 'cloud_done' : 'cloud_off';
    if (texto) texto.textContent = ok ? 'Guardado' : 'No se pudo guardar en este dispositivo';
  }

  /* ---- Chrome: botón de reanudar (T3) -----------------------------
     Aparece solo cuando el estudiante usó el drawer o "Anterior" para
     revisar una pantalla ya vista y su posición actual quedó detrás de
     la más avanzada — sin esto, volver al punto real exige contar
     clics en "Siguiente". Oculto con `hidden`, no con clases de
     visibilidad, para que además salga del orden de tabulación. */
  function actualizarReanudar(inst) {
    var boton = document.getElementById('nav-reanudar');
    if (!boton) return;
    boton.hidden = inst.masAvanzada <= inst.indice;
  }

  function reanudar() {
    var inst = OVA.state.instantanea();
    var pantalla = contenidoActual.pantallas[inst.masAvanzada];
    if (pantalla) navegarA(pantalla.id);
  }

  /* ---- Chrome: drawer de índice (T3) -------------------------------
     Lista generada una vez por contenido; cada navegación solo
     actualiza estado/aria-current de los items ya construidos. Estados
     con ícono y texto, nunca solo color (regla dura de CLAUDE.md): no
     hay estado "bloqueado" aquí —eso es entre unidades, lo resuelve
     Moodle (fuera de alcance)—, dentro de una unidad toda pantalla es
     alcanzable. */
  function construirDrawer(contenido) {
    var titulo = document.getElementById('drawer-titulo');
    var lista = document.getElementById('drawer-lista');
    if (titulo) titulo.textContent = contenido.titulo;
    if (!lista) return;
    while (lista.firstChild) lista.removeChild(lista.firstChild);
    contenido.pantallas.forEach(function (pantalla) {
      var item = document.createElement('a');
      item.className = 'nav-drawer__item';
      item.href = '#' + pantalla.id;
      var icono = document.createElement('span');
      icono.className = 'icono';
      icono.setAttribute('aria-hidden', 'true');
      item.appendChild(icono);
      item.appendChild(document.createTextNode(' ' + pantalla.titulo));
      lista.appendChild(item);
    });
  }

  function actualizarDrawer(inst) {
    var lista = document.getElementById('drawer-lista');
    if (!lista) return;
    Array.prototype.forEach.call(lista.children, function (item, indice) {
      var pantalla = contenidoActual.pantallas[indice];
      var esActual = indice === inst.indice;
      var visitada = inst.visitadas.indexOf(pantalla.id) !== -1;
      var estado = esActual ? 'actual' : (visitada ? 'completado' : 'pendiente');
      item.dataset.estado = estado;
      if (esActual) {
        item.setAttribute('aria-current', 'step');
      } else {
        item.removeAttribute('aria-current');
      }
      var icono = item.querySelector('.icono');
      if (icono) {
        icono.textContent = estado === 'completado' ? 'check_circle' :
          (estado === 'actual' ? 'radio_button_checked' : 'radio_button_unchecked');
      }
    });
  }

  function drawerEstaAbierto() {
    var drawer = document.getElementById('drawer');
    return !!drawer && !drawer.hidden;
  }

  function alTecladoDrawer(evento) {
    if (evento.key === 'Escape') {
      cerrarDrawer();
      return;
    }
    var drawer = document.getElementById('drawer');
    if (drawer) OVA.a11y.ciclarFocoEn(drawer, evento);
  }

  function abrirDrawer() {
    var drawer = document.getElementById('drawer');
    var backdrop = document.getElementById('drawer-backdrop');
    var boton = document.getElementById('drawer-abrir');
    var cerrar = document.getElementById('drawer-cerrar');
    if (!drawer || drawerEstaAbierto()) return;
    elementoAntesDelDrawer = document.activeElement;
    drawer.hidden = false;
    if (backdrop) backdrop.hidden = false;
    if (boton) boton.setAttribute('aria-expanded', 'true');
    if (cerrar) cerrar.focus();
    document.addEventListener('keydown', alTecladoDrawer);
  }

  function cerrarDrawer(opciones) {
    opciones = opciones || {};
    var drawer = document.getElementById('drawer');
    var backdrop = document.getElementById('drawer-backdrop');
    var boton = document.getElementById('drawer-abrir');
    if (!drawer || !drawerEstaAbierto()) return;
    drawer.hidden = true;
    if (backdrop) backdrop.hidden = true;
    if (boton) boton.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', alTecladoDrawer);
    if (opciones.devolverFoco !== false && elementoAntesDelDrawer) {
      elementoAntesDelDrawer.focus();
    }
    elementoAntesDelDrawer = null;
  }

  function configurarDrawer() {
    var boton = document.getElementById('drawer-abrir');
    var cerrar = document.getElementById('drawer-cerrar');
    var backdrop = document.getElementById('drawer-backdrop');
    var lista = document.getElementById('drawer-lista');
    if (boton) boton.addEventListener('click', abrirDrawer);
    if (cerrar) cerrar.addEventListener('click', function () { cerrarDrawer(); });
    if (backdrop) backdrop.addEventListener('click', function () { cerrarDrawer(); });
    if (lista) {
      lista.addEventListener('click', function (evento) {
        if (evento.target.closest('.nav-drawer__item')) {
          // No se devuelve el foco al botón que abrió el drawer: la
          // navegación que dispara este clic (vía hashchange, más abajo)
          // ya mueve el foco al encabezado de la pantalla elegida.
          cerrarDrawer({ devolverFoco: false });
        }
      });
    }
  }

  function configurarBarraSuperior() {
    var reanudarBoton = document.getElementById('nav-reanudar');
    if (reanudarBoton) reanudarBoton.addEventListener('click', reanudar);
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
    actualizarBarraSuperior(pantalla);
    actualizarProgreso(inst);
    actualizarGuardado();
    actualizarReanudar(inst);
    actualizarDrawer(inst);
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
    // Un hash que no es id de ninguna pantalla (el ancla del skip link,
    // "#app", es el caso real) no es un error de navegación: se ignora
    // en silencio en vez de loguear un fallo por algo que no lo es. Ver
    // el mismo razonamiento en el fallback de idInicial en state.js.
    if (!id || !OVA.state.existe(id)) return;
    var actual = OVA.state.actual();
    if (!actual || id !== actual.id) {
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
    construirDrawer(contenido);
    configurarDrawer();
    configurarBarraSuperior();
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
