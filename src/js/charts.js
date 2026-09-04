/* ============================================================
   charts.js — datos y gráficos (T7).

   Implementa el catálogo de PLAN.md: cifra destacada, tabla,
   variación sube/baja, línea, barras, distribución y diagrama de
   proceso. Como con el catálogo de preguntas en quiz.js, CLAUDE.md no fijó de
   antemano la forma exacta de estos siete tipos — es una decisión
   tomada en esta sesión, documentada aquí para poder corregirla sin
   arqueología de código.

   Decisión de contrato de contenido: se agrega un campo hermano de
   `media`/`interaccion`, `pantalla.datos`, con forma PLANA (como
   `media`, no anidada como `interaccion.datos`) — `{tipo, ...campos
   propios del tipo}`. `OVA.charts.crear(datos)` recibe ese objeto
   completo tal cual; cada constructor de tipo solo lee las llaves
   que necesita e ignora `tipo`. router.js expone `crearDatos()` y el
   elemento reutilizable nuevo `.layout__datos` (layouts.css), mismo
   patrón que `crearMedia()`/`.layout__media` y
   `crearInteraccion()`/`.layout__interaccion`.

   Catálogo (`tipo`, campos):

     cifra        { valor, etiqueta, porcentaje? }
                  `valor` es texto real, siempre visible (nunca solo
                  en un gráfico). `porcentaje` (0–100) es opcional:
                  si viene, dibuja el anillo de progreso que T5 dejó
                  como maqueta estática en `.anillo` — este es el
                  motor real con datos vivos que ese componente ya
                  anunciaba. Sin `porcentaje`, es solo el número.

     tabla        { titulo?, columnas:[texto…], filas:[[celda…]] }
                  `<table>` real con `<caption>`/`<th scope="col">` y
                  la primera columna de cada fila como `<th
                  scope="row">`. Una celda puede ser un objeto
                  `{variacion, unidad?}` en vez de texto para
                  incrustar el componente de variación en una celda
                  (p. ej. una columna "Rendimiento").

     variacion    { valor, unidad?, etiqueta? }
                  Sube/baja con las tres señales que exige PLAN.md a
                  la vez: ícono (arrow_upward/arrow_downward/remove),
                  signo (+/−) y color (verde-700/rojo-700 texto,
                  verde-500/rojo-500 ícono — mismo patrón que
                  .callout). `valor === 0` es el estado neutro, sin
                  color semántico.

     linea        { titulo?, unidad?, puntos:[{etiqueta,valor}…] }
     barras       { titulo?, unidad?, puntos:[{etiqueta,valor}…] }
                  SVG decorativo (`aria-hidden`) + fila de etiquetas
                  de eje en HTML real (sobrevive zoom de texto, a
                  diferencia de <text> dentro del SVG) + un
                  <details>"Ver datos en tabla" con la tabla exacta —
                  la alternativa textual que exige el cierre de T7.
                  `barras` soporta valores negativos (barra a la
                  izquierda del cero, rojo-500 en vez de naranja-500).

     distribucion { titulo?, segmentos:[{etiqueta,valor}…] }
                  Barra apilada horizontal (SVG, aria-hidden) más una
                  leyenda en HTML real con texto y muestra de color
                  por segmento — la leyenda ya es la alternativa
                  textual, no necesita <details> aparte. Sin rampa
                  categórica en tokens.css: la paleta cicla
                  naranja-500 + la escala de grises (900/500/300/700),
                  nunca un hex nuevo.

     proceso      { titulo?, pasos:[texto…] | [{titulo,detalle}…] }
                  Reusa `.linea-tiempo` (T1.5, hasta ahora maqueta
                  vertical sin cablear) con el modificador nuevo
                  `--horizontal` que geometry.css aplica desde 48em —
                  la "variante horizontal... se resuelve la próxima
                  sesión" que quedó anotada en ese componente era
                  justamente este trabajo.

   Ningún tipo usa `innerHTML`: todo nodo se arma con
   createElement/createElementNS/textContent, igual que el resto del
   motor. Los colores de trazo/relleno del SVG van por `style`
   referenciando `var(--token)`, nunca por el atributo de presentación
   `stroke`/`fill` con el color a mano — los atributos de presentación
   SVG no leen custom properties de forma consistente entre
   navegadores (mismo hallazgo que ya documentó `.anillo` en T5).
   ============================================================ */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---- Utilidades -------------------------------------------------- */

  function crear_(tag, className, texto) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (texto != null) el.textContent = texto;
    return el;
  }

  function svg_(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  function formatearNumero(valor, decimales) {
    var n = Number(valor);
    var d = decimales == null ? (Number.isInteger(n) ? 0 : 1) : decimales;
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: d,
      maximumFractionDigits: d
    }).format(n);
  }

  /* ---- Cifra destacada ----------------------------------------------- */

  function construirAnillo(porcentaje) {
    var p = Math.max(0, Math.min(100, Number(porcentaje) || 0));
    var r = 52;
    var c = 2 * Math.PI * r;
    var svg = svg_('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true' });
    svg.appendChild(svg_('circle', {
      cx: 60, cy: 60, r: r, fill: 'none', 'stroke-width': 10,
      style: 'stroke: var(--surface-muted)'
    }));
    svg.appendChild(svg_('circle', {
      cx: 60, cy: 60, r: r, fill: 'none', 'stroke-width': 10, 'stroke-linecap': 'round',
      style: 'stroke: var(--nuam-orange-500)',
      'stroke-dasharray': c.toFixed(2),
      'stroke-dashoffset': (c - (c * p) / 100).toFixed(2),
      transform: 'rotate(-90 60 60)'
    }));
    return svg;
  }

  function construirCifra(datos) {
    var valorTexto = datos.valor != null ? String(datos.valor) : '';
    if (datos.porcentaje != null) {
      var envoltorio = crear_('div', 'dato-cifra dato-cifra--anillo');
      var anillo = crear_('div', 'anillo');
      anillo.appendChild(construirAnillo(datos.porcentaje));
      var cifra = crear_('span', 'anillo__cifra');
      cifra.appendChild(crear_('span', 'anillo__numero', valorTexto));
      anillo.appendChild(cifra);
      envoltorio.appendChild(anillo);
      if (datos.etiqueta) envoltorio.appendChild(crear_('p', 'tipo-cuerpo-sm dato-cifra__etiqueta', datos.etiqueta));
      return envoltorio;
    }
    var raiz = crear_('div', 'dato-cifra');
    raiz.appendChild(crear_('p', 'tipo-display-2', valorTexto));
    if (datos.etiqueta) raiz.appendChild(crear_('p', 'tipo-cuerpo-sm dato-cifra__etiqueta', datos.etiqueta));
    return raiz;
  }

  /* ---- Variación sube/baja --------------------------------------------- */

  function construirVariacion(datos) {
    var valor = Number(datos.valor);
    var signo = valor > 0 ? 'positivo' : valor < 0 ? 'negativo' : 'neutro';
    var raiz = crear_('p', 'dato-variacion');
    raiz.setAttribute('data-signo', signo);

    var icono = crear_('span', 'icono dato-variacion__icono',
      signo === 'positivo' ? 'arrow_upward' : signo === 'negativo' ? 'arrow_downward' : 'remove');
    icono.setAttribute('aria-hidden', 'true');
    raiz.appendChild(icono);

    var prefijo = signo === 'positivo' ? '+' : signo === 'negativo' ? '−' : '';
    var texto = prefijo + formatearNumero(Math.abs(valor)) + (datos.unidad || '');
    raiz.appendChild(crear_('span', 'dato-variacion__valor', texto));

    if (datos.etiqueta) raiz.appendChild(crear_('span', 'dato-variacion__etiqueta', datos.etiqueta));
    return raiz;
  }

  /* ---- Tabla (y su uso como alternativa textual de línea/barras) ------ */

  function construirTablaNodo(datos) {
    var envoltura = crear_('div', 'dato-tabla__envoltura');
    // Región enfocable: `overflow-x: auto` por sí solo no es alcanzable con
    // teclado (no hay flechas de scroll nativas sin un elemento en el
    // orden de tabulación) — bajo zoom de texto al 200% o con muchas
    // columnas, esta tabla sí desborda su caja de verdad (verificado con
    // Playwright), así que necesita poder desplazarse sin mouse.
    envoltura.setAttribute('tabindex', '0');
    envoltura.setAttribute('role', 'region');
    envoltura.setAttribute('aria-label', datos.titulo || 'Tabla de datos');
    var tabla = crear_('table', 'dato-tabla');
    if (datos.titulo) tabla.appendChild(crear_('caption', null, datos.titulo));

    var thead = document.createElement('thead');
    var filaEncabezado = document.createElement('tr');
    (datos.columnas || []).forEach(function (col) {
      var th = crear_('th', null, col);
      th.setAttribute('scope', 'col');
      filaEncabezado.appendChild(th);
    });
    thead.appendChild(filaEncabezado);
    tabla.appendChild(thead);

    var tbody = document.createElement('tbody');
    (datos.filas || []).forEach(function (fila) {
      var tr = document.createElement('tr');
      fila.forEach(function (celda, i) {
        var el = i === 0 ? document.createElement('th') : document.createElement('td');
        if (i === 0) el.setAttribute('scope', 'row');
        if (celda && typeof celda === 'object' && celda.variacion !== undefined) {
          el.appendChild(construirVariacion({ valor: celda.variacion, unidad: celda.unidad }));
        } else {
          el.textContent = celda;
        }
        tr.appendChild(el);
      });
      tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    envoltura.appendChild(tabla);
    return envoltura;
  }

  function construirAlternativaTabla(titulo, columnas, filas) {
    var detalle = crear_('details', 'dato-grafico__alternativa');
    detalle.appendChild(crear_('summary', null, 'Ver datos en tabla'));
    detalle.appendChild(construirTablaNodo({ titulo: titulo, columnas: columnas, filas: filas }));
    return detalle;
  }

  /* ---- Línea ------------------------------------------------------------ */

  function construirLinea(datos) {
    var puntos = datos.puntos || [];
    var valores = puntos.map(function (p) { return Number(p.valor); });
    var min = Math.min.apply(null, valores);
    var max = Math.max.apply(null, valores);
    if (min === max) { min -= 1; max += 1; }

    var padX = 6, top = 8, bottom = 42;
    var n = puntos.length;
    function x(i) { return n <= 1 ? 50 : padX + (i * (100 - 2 * padX)) / (n - 1); }
    function y(v) { return bottom - ((v - min) / (max - min)) * (bottom - top); }

    var svg = svg_('svg', { viewBox: '0 0 100 50', 'aria-hidden': 'true' });
    svg.appendChild(svg_('line', {
      x1: padX, y1: bottom, x2: 100 - padX, y2: bottom,
      style: 'stroke: var(--border-default)', 'stroke-width': 0.5
    }));
    var coords = puntos.map(function (p, i) { return x(i).toFixed(2) + ',' + y(Number(p.valor)).toFixed(2); }).join(' ');
    svg.appendChild(svg_('polyline', {
      points: coords, fill: 'none', style: 'stroke: var(--nuam-orange-500)',
      'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
    puntos.forEach(function (p, i) {
      svg.appendChild(svg_('circle', {
        cx: x(i).toFixed(2), cy: y(Number(p.valor)).toFixed(2), r: 1.6,
        style: 'fill: var(--nuam-orange-500)'
      }));
    });

    var figura = crear_('figure', 'dato-grafico dato-grafico--linea');
    if (datos.titulo) figura.appendChild(crear_('figcaption', 'dato-grafico__titulo', datos.titulo));
    var lienzo = crear_('div', 'dato-grafico__lienzo');
    lienzo.appendChild(svg);
    figura.appendChild(lienzo);

    var ejes = crear_('div', 'dato-grafico__ejes');
    puntos.forEach(function (p) { ejes.appendChild(crear_('span', 'dato-grafico__eje', p.etiqueta)); });
    figura.appendChild(ejes);

    figura.appendChild(construirAlternativaTabla(
      datos.titulo || 'Datos del gráfico',
      ['Punto', 'Valor' + (datos.unidad ? ' (' + datos.unidad + ')' : '')],
      puntos.map(function (p) { return [p.etiqueta, formatearNumero(Number(p.valor))]; })
    ));
    return figura;
  }

  /* ---- Barras ------------------------------------------------------------ */

  function construirBarras(datos) {
    var puntos = datos.puntos || [];
    var n = puntos.length || 1;
    var valores = puntos.map(function (p) { return Number(p.valor); });
    var maxAbs = Math.max.apply(null, valores.map(Math.abs).concat([1]));
    var hayNegativos = valores.some(function (v) { return v < 0; });
    var top = 4;
    var zeroY = hayNegativos ? 25 : 44;
    var escala = hayNegativos ? 20 : 38;

    var svg = svg_('svg', { viewBox: '0 0 100 50', 'aria-hidden': 'true' });
    svg.appendChild(svg_('line', {
      x1: 2, y1: zeroY, x2: 98, y2: zeroY,
      style: 'stroke: var(--border-default)', 'stroke-width': 0.5
    }));

    var gap = 100 / n;
    var anchoBarra = gap * 0.5;
    puntos.forEach(function (p, i) {
      var v = Number(p.valor);
      var h = Math.min((Math.abs(v) / maxAbs) * escala, zeroY - top);
      var xPos = gap * i + (gap - anchoBarra) / 2;
      var yPos = v >= 0 ? zeroY - h : zeroY;
      svg.appendChild(svg_('rect', {
        x: xPos.toFixed(2), y: yPos.toFixed(2), width: anchoBarra.toFixed(2), height: h.toFixed(2),
        rx: 1, style: 'fill: var(--nuam-' + (v >= 0 ? 'orange-500' : 'red-500') + ')'
      }));
    });

    var figura = crear_('figure', 'dato-grafico dato-grafico--barras');
    if (datos.titulo) figura.appendChild(crear_('figcaption', 'dato-grafico__titulo', datos.titulo));
    var lienzo = crear_('div', 'dato-grafico__lienzo');
    lienzo.appendChild(svg);
    figura.appendChild(lienzo);

    var ejes = crear_('div', 'dato-grafico__ejes');
    puntos.forEach(function (p) {
      var col = crear_('span', 'dato-grafico__eje');
      col.appendChild(crear_('span', 'dato-grafico__eje-etiqueta', p.etiqueta));
      col.appendChild(crear_('span', 'dato-grafico__eje-valor', formatearNumero(Number(p.valor)) + (datos.unidad || '')));
      ejes.appendChild(col);
    });
    figura.appendChild(ejes);

    figura.appendChild(construirAlternativaTabla(
      datos.titulo || 'Datos del gráfico',
      ['Categoría', 'Valor' + (datos.unidad ? ' (' + datos.unidad + ')' : '')],
      puntos.map(function (p) { return [p.etiqueta, formatearNumero(Number(p.valor))]; })
    ));
    return figura;
  }

  /* ---- Distribución -------------------------------------------------------- */

  var PALETA_DISTRIBUCION = ['--nuam-orange-500', '--nuam-grey-900', '--nuam-grey-500', '--nuam-grey-300', '--nuam-grey-700'];

  function construirDistribucion(datos) {
    var segmentos = datos.segmentos || [];
    var total = segmentos.reduce(function (s, seg) { return s + Number(seg.valor); }, 0) || 1;

    var svg = svg_('svg', { viewBox: '0 0 100 14', 'aria-hidden': 'true' });
    var cursor = 0;
    segmentos.forEach(function (seg, i) {
      var ancho = (Number(seg.valor) / total) * 100;
      svg.appendChild(svg_('rect', {
        x: cursor.toFixed(2), y: 0, width: Math.max(ancho - 0.4, 0).toFixed(2), height: 14, rx: 2,
        style: 'fill: var(' + PALETA_DISTRIBUCION[i % PALETA_DISTRIBUCION.length] + ')'
      }));
      cursor += ancho;
    });

    var figura = crear_('figure', 'dato-grafico dato-grafico--distribucion');
    if (datos.titulo) figura.appendChild(crear_('figcaption', 'dato-grafico__titulo', datos.titulo));
    var lienzo = crear_('div', 'dato-grafico__lienzo');
    lienzo.appendChild(svg);
    figura.appendChild(lienzo);

    var leyenda = crear_('ul', 'dato-grafico__leyenda');
    segmentos.forEach(function (seg, i) {
      var li = document.createElement('li');
      var muestra = crear_('span', 'dato-grafico__muestra');
      muestra.setAttribute('aria-hidden', 'true');
      muestra.style.background = 'var(' + PALETA_DISTRIBUCION[i % PALETA_DISTRIBUCION.length] + ')';
      li.appendChild(muestra);
      var pct = (Number(seg.valor) / total) * 100;
      li.appendChild(crear_('span', 'dato-grafico__leyenda-texto', seg.etiqueta + ' — ' + formatearNumero(pct, 0) + ' %'));
      leyenda.appendChild(li);
    });
    figura.appendChild(leyenda);
    return figura;
  }

  /* ---- Diagrama de proceso ------------------------------------------------- */

  function construirProceso(datos) {
    var raiz = crear_('div', 'dato-proceso');
    if (datos.titulo) raiz.appendChild(crear_('p', 'tipo-h5 dato-proceso__titulo', datos.titulo));

    var ol = crear_('ol', 'linea-tiempo linea-tiempo--horizontal');
    (datos.pasos || []).forEach(function (paso, i) {
      var li = crear_('li', 'linea-tiempo__paso');
      var numero = (i + 1 < 10 ? '0' : '') + (i + 1);
      var nodo = crear_('span', 'linea-tiempo__nodo', numero);
      nodo.setAttribute('aria-hidden', 'true');
      var contenido = crear_('div', 'linea-tiempo__contenido');
      if (typeof paso === 'string') {
        contenido.appendChild(crear_('p', 'tipo-cuerpo-sm', paso));
      } else {
        if (paso.titulo) contenido.appendChild(crear_('p', 'tipo-h5', paso.titulo));
        if (paso.detalle) contenido.appendChild(crear_('p', 'tipo-cuerpo-sm', paso.detalle));
      }
      li.appendChild(nodo);
      li.appendChild(contenido);
      ol.appendChild(li);
    });
    raiz.appendChild(ol);
    return raiz;
  }

  /* ---- Despacho ------------------------------------------------------------ */

  var CONSTRUCTORES = {
    cifra: construirCifra,
    tabla: construirTablaNodo,
    variacion: construirVariacion,
    linea: construirLinea,
    barras: construirBarras,
    distribucion: construirDistribucion,
    proceso: construirProceso
  };

  function crear(datos) {
    if (!datos || !datos.tipo) {
      throw new Error('"datos" no trae "tipo".');
    }
    var constructor = CONSTRUCTORES[datos.tipo];
    if (!constructor) {
      throw new Error('El tipo de gráfico "' + datos.tipo + '" no existe en el catálogo de charts.js.');
    }
    return constructor(datos);
  }

  window.OVA = window.OVA || {};
  window.OVA.charts = {
    crear: crear
  };
})();
