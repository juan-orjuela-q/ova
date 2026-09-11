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

   Catálogo de layouts: la numeración es la de BRIEF-DI.md (CLAUDE.md,
   regla dura 8) — C0 (4 sep) renumeró el código que T1–T9 habían
   construido contra la numeración anterior. La tabla de equivalencias
   completa vive en PLAN-CONTENIDO.md §2.1; aquí solo el resultado:
   PLANTILLAS.L02 (media a ancho completo + texto debajo, era L04),
   PLANTILLAS.L03 (media lateral 50/50, sin cambio de número),
   PLANTILLAS.L04 (lectura larga, "datos" opcional, era L02),
   PLANTILLAS.L06 (interacción a pantalla completa, delega en
   OVA.quiz.crear, catálogo I01–I05/I09–I12 — ver quiz.js; era L10),
   PLANTILLAS.L12 (cifra destacada, era L05), PLANTILLAS.L13 (cita o
   dato, era L06). Dos plantillas viejas no migraron: la de "proceso/
   línea de tiempo" (era L09) porque ese diagrama ya no es un layout
   propio — ahora es `datos.tipo:'proceso'` dentro de L04, igual que
   cualquier otro tipo de OVA.charts.crear (cifra/tabla/variación/
   línea/barras/distribución/proceso — ver charts.js); la de "término
   de glosario" (era L11) porque ya está resuelta como componente de T5
   (`.termino-glosario` + `.modal`), usable dentro de cualquier layout,
   no como pantalla dedicada. Cualquier otro código, aunque exista en
   el catálogo L01–L13 de CLAUDE.md, todavía no tiene plantilla aquí y
   cae por la misma rama de fallo ruidoso que un código inventado: cada
   tarea futura que dependa de un layout nuevo agrega su entrada a
   PLANTILLAS, nunca reinterpreta esta función.

   C1 (4 sep) agregó las siete que faltaban: PLANTILLAS.L01 (portada de
   unidad), L05 (tarjetas comparativas, 2 a 4), L07 (pregunta, variante
   de chrome sobre la misma crearInteraccion() de L06), L08 (resultado
   y retroalimentación, layout nuevo de verdad), L09 (ideas clave,
   media ahora opcional), L10 (cierre de unidad) y L11 (recursos
   descargables, admite varios). Con esto PLANTILLAS cubre L01–L13
   completo salvo los dos códigos retirados de arriba.

   Nada de innerHTML con texto del contenido: todo nodo de texto se
   arma con createElement/textContent.

   C7 (conversión del storyboard real): tres ampliaciones puntuales,
   todas opcionales y retrocompatibles con el contenido de prueba de
   C0–C6.
   - PLANTILLAS.L05 acepta "interaccion" como alternativa a "tarjetas"
     (P13/P28 del storyboard real ya son en sí mismas una disposición
     de tarjetas comparables — I07/I08 — así que no hace falta una
     tarjeta de solo lectura por delante) y una "nota" opcional debajo
     (un disclaimer de una línea que no es una tarjeta comparable más).
   - PLANTILLAS.L08/L10/L13 aceptan "media" opcional (avatar): las
     ocho pantallas reales de esos tres layouts que llevan narración
     de avatar (P10/P31/P35/P36/P40/P43/P44/P47) no tenían dónde
     montarla antes de esta sesión — mismo patrón opcional que ya
     usaba L09 con su media.
   - obtenerResultado() acepta "resultado.campo": cuando la variable de
     contenido guarda un objeto (resultado_boleta, que I11 fija como
     {operacion,tipo,estado,…} — ver quiz.js) en vez de un valor
     simple, este es el subcampo contra el que se comparan las reglas.
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

  // E2 (PLAN-ESTRUCTURA.md §3) — bloqueaAvance. `bloqueoAvanceActivo` es
  // "la pantalla actual pide bloqueaAvance y su interacción todavía no
  // avisó que terminó" (ver quiz.js, crear(interaccion, {alCompletar})).
  // `construyendoPantalla` distingue "arrancó ya completa" (I15 con la
  // marca puesta desde antes de un F5 — no hay nada que anunciar, ya
  // estaba así) de "se acaba de completar en vivo" (sí se anuncia) —
  // ambas pasan por la misma manejarActividadCompleta().
  //
  // Trampa 2 de PLAN-ESTRUCTURA.md §3: es un candado BLANDO a propósito.
  // Solo siguiente() lo consulta — el drawer (navega por <a href="#id">,
  // vía hashchange) y "Anterior" no, así que una pantalla con
  // bloqueaAvance sigue siendo saltable desde el índice o cambiando el
  // hash a mano. Bloquear el índice contradice "dentro de una unidad
  // toda pantalla es alcanzable" (D1); el candado duro entre unidades es
  // de Moodle, no de este motor.
  var bloqueoAvanceActivo = false;
  var construyendoPantalla = false;

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

  // Ajustes tanda 4: agrupa kicker+título+cuerpo (u otra lectura
  // principal — lista, texto de resultado) en un solo .layout__texto
  // con su propio gap más chico (layouts.css) en vez de dejarlos como
  // hermanos sueltos de .layout, que los separaba con el mismo gap
  // pensado para diferenciar zonas completas (texto vs. media/datos/
  // interaccion). Elementos ausentes (kicker opcional, cuerpo condicional
  // en L08) se filtran solos. No todas las plantillas la usan igual —
  // ver la nota junto a .layout__texto en layouts.css.
  function envolverTexto(elementos) {
    var div = document.createElement('div');
    div.className = 'layout__texto';
    elementos.forEach(function (el) { if (el) div.appendChild(el); });
    return div;
  }

  // T4: única entrada de layout que renderiza pantalla.media. Solo
  // sabe construir video (OVA.media.crear falla ruidoso para
  // cualquier otro tipo.tipo); si la pantalla no trae media en
  // absoluto, cae por fallarPantalla igual que un layout inventado —
  // L02/L03 no tienen sentido sin su columna de media.
  function crearMedia(media) {
    if (!media) throw new Error('Esta pantalla no trae "media" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__media';
    var reproductor = OVA.media.crear(media);
    if (!reproductor) throw new Error('No se pudo construir el reproductor de media (ver consola).');
    contenedor.appendChild(reproductor);
    return contenedor;
  }

  // Ajustes tanda 10: `pantalla.avatar` deja de ser exclusivo de L01.
  // Es la locución de una pantalla que YA tiene otra media (el video de
  // fondo en L01, el retrato con máscara en L03) o cuyo layout no tiene
  // ranura de media en absoluto (L05, tarjetas comparativas). Mismo
  // contrato que media.tipo 'avatar' —ver el encabezado de media.js—
  // sin el campo "tipo", que aquí lo da el nombre del campo, y con
  // `variante` ahora sí pasada tal cual (L01 la ignoraba: era el único
  // consumidor y siempre usaba el círculo chico).
  //
  // El envoltorio .layout__locucion existe para que cada layout decida
  // dónde y con cuánto ancho vive la carta, igual que .layout__media:
  // en L03 va dentro del bloque de texto y en L05 (ajustes tanda 11) va
  // dentro de .layout__encabezado, arriba a la derecha del título.
  function crearLocucion(avatar) {
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__locucion';
    var reproductor = OVA.media.crear({
      tipo: 'avatar',
      imagen: avatar.imagen,
      audio: avatar.audio,
      vtt: avatar.vtt,
      variante: avatar.variante,
      transcripcion: avatar.transcripcion
    });
    if (!reproductor) throw new Error('No se pudo construir la locución de la pantalla (ver consola).');
    contenedor.appendChild(reproductor);
    return contenedor;
  }

  // T6: única entrada de layout que renderiza pantalla.interaccion.
  // Delega en OVA.quiz.crear, que falla ruidoso si interaccion.tipo no
  // existe en el catálogo I01–I05 (más completar/numerica/autoevaluacion,
  // sin número — ver quiz.js) ni I09–I12 — mismo criterio que crearMedia
  // con media.tipo. Sin interaccion en absoluto, también falla: L06 no
  // tiene sentido sin ella. (T8 agrega las cuatro interacciones insignia
  // I09–I12 por el mismo punto de entrada.)
  //
  // E2: `bloqueaAvance` (booleano, de pantalla.bloqueaAvance) decide si se
  // le pasa el canal `{alCompletar}` a OVA.quiz.crear() — manejarActividadCompleta
  // vive junto al resto de la navegación, más abajo en este archivo.
  function crearInteraccion(interaccion, bloqueaAvance) {
    if (!interaccion) throw new Error('Esta pantalla no trae "interaccion" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__interaccion';
    var opciones = bloqueaAvance ? { alCompletar: manejarActividadCompleta } : undefined;
    var nodo = OVA.quiz.crear(interaccion, opciones);
    if (!nodo) throw new Error('No se pudo construir la interacción (ver consola).');
    contenedor.appendChild(nodo);
    return contenedor;
  }

  // D7: extensión mínima del contrato — "componente" monta una pieza de
  // chrome fija en el mismo hueco visual que "interaccion" (.layout__interaccion),
  // pero no es una pregunta (I01–I14 siguen siendo el único catálogo de
  // interacción real): CLAUDE.md define "interaccion" como una pregunta
  // por pantalla, y el panel de preferencias que este componente monta no
  // lo es. Ninguna pantalla real lo pide desde AJUSTES.md tanda 5 (ítem 14,
  // ver la nota de PLANTILLAS.L09 más abajo) — se deja en el catálogo por
  // si hace falta más adelante, mismo criterio que un tipo de media sin
  // pantalla real todavía (AJUSTES.md #8). Catálogo de un solo valor por
  // ahora — cualquier otro cae por el mismo fallo ruidoso que un layout o
  // un tipo de media inventado.
  function crearComponente(nombre) {
    if (nombre !== 'preferencias') {
      throw new Error('El componente "' + nombre + '" no existe en el catálogo (solo "preferencias").');
    }
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__interaccion';
    contenedor.appendChild(OVA.preferencias.crearPanel());
    return contenedor;
  }

  // T7: única entrada de layout que renderiza pantalla.datos. Delega en
  // OVA.charts.crear, que falla ruidoso si datos.tipo no existe en el
  // catálogo de charts.js — mismo criterio que crearMedia con media.tipo
  // y crearInteraccion con interaccion.tipo. Si "datos" es obligatorio o
  // no lo decide quien llama: PLANTILLAS.L04 solo la llama si
  // pantalla.datos existe (incluido datos.tipo:'proceso', que antes de
  // C0 tenía su propio layout L09 obligatorio — ver la nota de arriba).
  function crearDatos(datos) {
    if (!datos) throw new Error('Esta pantalla no trae "datos" y su layout lo necesita.');
    var contenedor = document.createElement('div');
    contenedor.className = 'layout__datos';
    var nodo = OVA.charts.crear(datos);
    if (!nodo) throw new Error('No se pudo construir el gráfico (ver consola).');
    contenedor.appendChild(nodo);
    return contenedor;
  }

  // C1: kicker con ícono para L07 — variante del kicker plano de arriba.
  // El ícono es decorativo (aria-hidden), el texto sigue siendo el único
  // portador real de "esto es una pregunta".
  function crearKickerConIcono(texto, nombreIcono) {
    var span = document.createElement('span');
    span.className = 'layout__kicker tipo-etiqueta';
    var icono = document.createElement('span');
    icono.className = 'icono';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = nombreIcono;
    span.appendChild(icono);
    span.appendChild(document.createTextNode(texto));
    return span;
  }

  // C1: L09 pinta sus ideas clave como lista real (<ul>), no como
  // párrafos sueltos — es "ideas clave", no prosa. Cada <li> lleva un
  // ícono de check decorativo (aria-hidden: el orden de la lista ya
  // comunica que son puntos) más el texto real.
  function crearListaIdeas(items, claseTexto) {
    var ul = document.createElement('ul');
    ul.className = 'layout__cuerpo';
    (items || []).forEach(function (texto) {
      var li = document.createElement('li');
      li.className = claseTexto;
      var icono = document.createElement('span');
      icono.className = 'icono';
      icono.setAttribute('aria-hidden', 'true');
      icono.textContent = 'check_circle';
      li.appendChild(icono);
      var span = document.createElement('span');
      span.textContent = texto;
      li.appendChild(span);
      ul.appendChild(li);
    });
    return ul;
  }

  // D7, rehecha en AJUSTES.md tanda 6 (dos columnas lado a lado) y de
  // nuevo en tanda 8 (grilla 3×3, ícono arriba centrado y texto debajo):
  // alternativa a crearListaIdeas para p01b (tutorial de la barra). Cada
  // ítem lleva una miniatura real del control
  // (public/img/icons/muestra-navegacion-*.svg — captura fiel del
  // componente tal como se ve en la barra, no un símbolo abstracto). La
  // imagen es decorativa (alt vacío): el texto debajo ya describe el
  // control, la miniatura solo lo ilustra. Una sola lista plana en el
  // orden real de lectura (layouts.css la arregla en grilla de 3
  // columnas en escritorio y 1 en mobile) — a diferencia de tanda 6, no
  // hace falta partir el arreglo en dos mitades: el orden de un grid ya
  // reparte los nueve en filas de 3 solo.
  function crearListaControles(controles) {
    var ul = document.createElement('ul');
    ul.className = 'layout__cuerpo--controles';
    (controles || []).forEach(function (control) {
      var li = document.createElement('li');
      li.className = 'layout__controles-item';
      var img = document.createElement('img');
      img.className = 'layout__controles-imagen';
      img.src = control.imagen;
      img.alt = '';
      li.appendChild(img);
      var texto = document.createElement('span');
      texto.className = 'layout__controles-texto tipo-cuerpo';
      texto.textContent = control.texto;
      li.appendChild(texto);
      ul.appendChild(li);
    });
    return ul;
  }

  // AJUSTES.md, tanda 8 (p02, "Objetivos de aprendizaje"): alternativa a
  // que "cuerpo" cargue los números como texto plano ("1. Diferenciar…").
  // <ol> real — el número visual de cada círculo es decorativo
  // (aria-hidden), el orden semántico de la lista ya comunica "punto 1,
  // 2, 3…" a un lector de pantalla, mismo criterio que el ícono de check
  // de crearListaIdeas(). Opcional, sibling de "cuerpo" (no lo
  // reemplaza): en L03 la primera frase ("Al finalizar esta unidad
  // podrás:") se queda como párrafo normal delante de la lista.
  function crearListaEnriquecida(items) {
    var ol = document.createElement('ol');
    ol.className = 'lista-enriquecida';
    (items || []).forEach(function (texto, indice) {
      var li = document.createElement('li');
      li.className = 'lista-enriquecida__item';
      var numero = document.createElement('span');
      numero.className = 'lista-enriquecida__numero';
      numero.setAttribute('aria-hidden', 'true');
      numero.textContent = String(indice + 1);
      li.appendChild(numero);
      var span = document.createElement('span');
      span.className = 'tipo-cuerpo';
      span.textContent = texto;
      li.appendChild(span);
      ol.appendChild(li);
    });
    return ol;
  }

  // AJUSTES.md, tanda 5 (ítem 13): variante de L09 para p01a (resumen de
  // accesibilidad). "tarjetas" aquí no es la misma forma que la de L05
  // (crearTarjetasComparativas, {titulo,texto}) — mismo nombre de campo,
  // interpretación propia de esta plantilla, igual que "cuerpo" ya
  // significa cosas distintas según el layout que lo lee. Cada tarjeta
  // trae su propio ícono ilustrativo (SVG de public/img/icons/, no el
  // check fijo de crearListaIdeas ni el ícono de Material Symbols de
  // crearListaControles): son afirmaciones de producto con su propio
  // símbolo, no puntos de una lista ni controles del chrome.
  function crearTarjetasIconos(tarjetas) {
    if (!tarjetas || !tarjetas.length) {
      throw new Error('Esta variante de L09 necesita "tarjetas" (arreglo con al menos un elemento).');
    }
    var contenedor = document.createElement('div');
    contenedor.className = 'layout--l09__grilla';
    tarjetas.forEach(function (tarjeta) {
      var div = document.createElement('div');
      div.className = 'tarjeta-icono';
      var franja = document.createElement('div');
      franja.className = 'tarjeta-icono__franja';
      var img = document.createElement('img');
      img.className = 'tarjeta-icono__imagen';
      img.src = tarjeta.icono;
      img.alt = '';
      franja.appendChild(img);
      div.appendChild(franja);
      var texto = document.createElement('p');
      texto.className = 'tarjeta-icono__texto tipo-cuerpo';
      texto.textContent = tarjeta.texto;
      div.appendChild(texto);
      contenedor.appendChild(div);
    });
    return contenedor;
  }

  // C1: L05, de 2 a 4 tarjetas comparables. A diferencia de crearCuerpo
  // (párrafos sueltos), cada tarjeta necesita su propio título — así
  // que el contrato de L05 usa "tarjetas", no "cuerpo". El rango 2–4 lo
  // fija PLAN-CONTENIDO.md §2.1 (fila L05); fuera de ese rango el CSS
  // (flex-wrap con base 14rem) no está pensado y falla ruidoso en vez
  // de renderizar algo que no se verificó.
  function crearTarjetasComparativas(tarjetas) {
    if (!tarjetas || tarjetas.length < 2 || tarjetas.length > 4) {
      throw new Error('L05 necesita "tarjetas" (arreglo de 2 a 4 elementos).');
    }
    var contenedor = document.createElement('div');
    // Ajustes tanda 11: con ilustraciones el cuerpo pasa de flex-wrap a
    // grilla (layouts.css) — una tarjeta ilustrada que envuelve sola a
    // la fila siguiente se estiraría a todo el ancho y su imagen con
    // ella. Modificador y no `:has()` por el mismo criterio que
    // `.layout--l09--tarjetas`: quien arma el nodo ya sabe la respuesta.
    var ilustradas = tarjetas.some(function (t) { return !!t.imagen; });
    contenedor.className = 'layout__cuerpo' + (ilustradas ? ' layout__cuerpo--ilustrado' : '');
    tarjetas.forEach(function (tarjeta) {
      var div = document.createElement('div');
      var titulo = document.createElement('p');
      titulo.className = 'tipo-h5';
      titulo.textContent = tarjeta.titulo;
      var texto = document.createElement('p');
      texto.className = 'tipo-cuerpo-sm';
      texto.textContent = tarjeta.texto;
      if (tarjeta.imagen) {
        div.className = 'tarjeta-comparativa';
        div.appendChild(crearIlustracionTarjeta(tarjeta));
        var bloque = document.createElement('div');
        bloque.className = 'tarjeta-comparativa__texto';
        bloque.appendChild(titulo);
        bloque.appendChild(texto);
        div.appendChild(bloque);
      } else {
        div.appendChild(titulo);
        div.appendChild(texto);
      }
      contenedor.appendChild(div);
    });
    return contenedor;
  }

  // Ajustes tanda 11 (p11): ilustración opcional arriba del título de
  // una tarjeta de L05. `alt` es opcional y por defecto '' (decorativa),
  // mismo criterio que media.tipo "imagen" (ver el encabezado de
  // media.js): el título y el texto de la tarjeta ya dicen todo lo que
  // la ilustración ilustra, así que anunciarla dos veces solo alarga el
  // recorrido de un lector de pantalla. Si la fuente falla al cargar se
  // quita la <img> y la tarjeta se queda con su texto —degradación
  // limpia, mismo criterio que "imagen"/"video" en media.js— en vez de
  // dejar el ícono de imagen rota dentro de la caja.
  function crearIlustracionTarjeta(tarjeta) {
    var img = document.createElement('img');
    img.className = 'tarjeta-comparativa__ilustracion';
    img.src = tarjeta.imagen;
    img.alt = tarjeta.alt || '';
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
    });
    return img;
  }

  // C1/C4: L08 lee su cifra/retroalimentación de pantalla.resultado.
  // E1 (PLAN-ESTRUCTURA.md §2): la regla "primera que aplica gana"
  // contra una variable de contenido vivía entera aquí; se extrajo a
  // OVA.resultado.resolver() (resultado.js) porque I15 (quiz.js) la
  // necesita igual al cerrar una batería de preguntas — ver el
  // encabezado de resultado.js para el contrato completo. Esta función
  // solo añade el fallo ruidoso propio de L08 (sin "resultado" en
  // absoluto, o sin cifra/retro tras resolver, el layout no tiene
  // sentido).
  function obtenerResultado(pantalla) {
    if (!pantalla.resultado) {
      throw new Error('Esta pantalla no trae "resultado" (cifra y/o retro) y su layout lo necesita.');
    }
    var efectivo = OVA.resultado.resolver(pantalla.resultado);
    if (!efectivo.cifra && !efectivo.retro) {
      throw new Error('Esta pantalla no trae "resultado" (cifra y/o retro) y su layout lo necesita.');
    }
    return efectivo;
  }

  // C1: aviso de logro de L10 — misma pieza que T5 ya dejó lista
  // (.aviso-logro + .insignia[data-estado="desbloqueada"]), cableada
  // aquí por primera vez contra contenido real en vez de markup fijo
  // de la kitchen sink.
  function crearAvisoLogro(logro) {
    var aviso = document.createElement('div');
    aviso.className = 'aviso-logro';
    aviso.setAttribute('role', 'status');

    var insignia = document.createElement('div');
    insignia.className = 'insignia';
    insignia.dataset.estado = 'desbloqueada';
    var iconoEnvoltura = document.createElement('span');
    iconoEnvoltura.className = 'insignia__icono';
    iconoEnvoltura.setAttribute('aria-hidden', 'true');
    var icono = document.createElement('span');
    icono.className = 'icono';
    icono.textContent = logro.icono || 'military_tech';
    iconoEnvoltura.appendChild(icono);
    insignia.appendChild(iconoEnvoltura);
    var insigniaTexto = document.createElement('span');
    insigniaTexto.className = 'insignia__texto';
    insigniaTexto.textContent = 'Desbloqueada';
    insignia.appendChild(insigniaTexto);
    aviso.appendChild(insignia);

    var textoEnvoltura = document.createElement('div');
    textoEnvoltura.className = 'aviso-logro__texto';
    var tituloLogro = document.createElement('p');
    tituloLogro.className = 'tipo-h4';
    tituloLogro.textContent = logro.titulo;
    textoEnvoltura.appendChild(tituloLogro);
    if (logro.texto) {
      var textoLogro = document.createElement('p');
      textoLogro.className = 'tipo-cuerpo-sm';
      textoLogro.textContent = logro.texto;
      textoEnvoltura.appendChild(textoLogro);
    }
    aviso.appendChild(textoEnvoltura);

    return aviso;
  }

  // C1: tarjeta de descarga de L11 — misma pieza que T5 dejó como
  // maqueta (.tarjeta-recurso), cableada aquí por primera vez. Sin
  // atributo `download`: con un `href` real todavía sin archivo detrás
  // (C8 los engancha), agregarlo dispararía el navegador intentando
  // descargar la página actual en vez de no hacer nada — se agrega
  // cuando el archivo real exista.
  function crearTarjetaRecurso(recurso) {
    var a = document.createElement('a');
    a.className = 'tarjeta-recurso';
    a.href = recurso.href;

    var iconoEnvoltura = document.createElement('span');
    iconoEnvoltura.className = 'tarjeta-recurso__icono';
    iconoEnvoltura.setAttribute('aria-hidden', 'true');
    var icono = document.createElement('span');
    icono.className = 'icono';
    icono.textContent = recurso.icono || 'description';
    iconoEnvoltura.appendChild(icono);
    a.appendChild(iconoEnvoltura);

    var info = document.createElement('span');
    info.className = 'tarjeta-recurso__info';
    var titulo = document.createElement('span');
    titulo.className = 'tarjeta-recurso__titulo';
    titulo.textContent = recurso.titulo;
    info.appendChild(titulo);
    var meta = document.createElement('span');
    meta.className = 'tarjeta-recurso__meta';
    meta.textContent = recurso.meta;
    info.appendChild(meta);
    a.appendChild(info);

    var accion = document.createElement('span');
    accion.className = 'icono tarjeta-recurso__accion';
    accion.setAttribute('aria-hidden', 'true');
    accion.textContent = 'download';
    a.appendChild(accion);

    return a;
  }

  // C7: nota opcional debajo de las tarjetas de L05 (P29 trae un
  // disclaimer de una línea — "es un perfil orientativo, no
  // regulatorio" — que no es una cuarta tarjeta comparable: pesarla
  // igual que Conservador/Moderado/Agresivo la haría leer como una
  // cuarta opción del mismo tipo). Clase propia en vez de reusar
  // tipo-caption a secas: necesita el color secundario que ningún
  // átomo transversal trae ya puesto (ver layouts.css, .layout--l05
  // .layout__nota).
  function crearNotaTarjetas(texto) {
    var p = document.createElement('p');
    p.className = 'layout__nota tipo-caption';
    p.textContent = texto;
    return p;
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

  // C1: portada de unidad. Único layout con <h1> (mismo criterio que la
  // kitchen sink: es la portada de toda la unidad, no una pantalla más
  // dentro de ella) y con media puramente decorativa — el video/imagen
  // de fondo va aria-hidden y en loop mudo, no pasa por
  // OVA.media.crear() (T4): ese reproductor construye controles reales
  // pensados para media con contenido instruccional, y aquí el
  // contenido real es el texto del panel, no el fondo. Los dos SVG de
  // unión (mobile-top/-bottom, desktop) son decoración fija del layout,
  // no contenido — no salen del JSON, igual que el marco no sale de
  // pantalla.datos. El botón "Comenzar" (o pantalla.cta, si el guion
  // pide otro texto) avanza como "Siguiente" del chrome; no es un
  // layout con su propia navegación aparte.
  //
  // C3: L01 puede además traer `pantalla.avatar` (ajustes tanda 10: ya
  // no es exclusivo de L01 — ver crearLocucion() más arriba; el resto de
  // esta nota sigue explicando por qué L01 lo estrenó). (Mismo contrato de
  // media.tipo:'avatar' — ver el encabezado de media.js — sin el campo
  // "tipo", que aquí ya lo da el nombre del campo), un objeto
  // independiente de `pantalla.media`. Van separados a propósito: L01
  // es el único layout con dos zonas visuales (el fondo de
  // .layout__media y el panel de texto), y el fondo se queda con el
  // video en loop de siempre — el usuario lo pidió explícito, no se
  // reemplaza por la foto fija del avatar solo porque la pantalla
  // también tiene locución. `pantalla.avatar`, si existe, se monta con
  // OVA.media.crear() de verdad dentro de .layout__panel, después del
  // cuerpo: ahí vive la locución real de la portada (audio + controles
  // si existe, transcripción siempre, con o sin audio — regla dura 10
  // de CLAUDE.md), sin tocar el fondo.
  PLANTILLAS.L01 = function (pantalla) {
    var media = pantalla.media;
    if (!media || (media.tipo !== 'video' && media.tipo !== 'imagen')) {
      throw new Error('L01 necesita "media" (tipo "video" o "imagen") de fondo.');
    }
    var raiz = crearRaiz('l01');

    var panel = document.createElement('div');
    panel.className = 'layout__panel';

    var unionMobileBottom = document.createElement('img');
    unionMobileBottom.className = 'layout__union layout__union--mobile-bottom';
    unionMobileBottom.src = '../public/graf/union_graf_nuam_mobile_bottom.svg';
    unionMobileBottom.alt = '';
    unionMobileBottom.setAttribute('aria-hidden', 'true');
    panel.appendChild(unionMobileBottom);

    if (pantalla.kicker) panel.appendChild(crearKicker(pantalla.kicker));

    var titulo = document.createElement('h1');
    titulo.className = 'layout__titulo tipo-portada-titulo';
    titulo.textContent = pantalla.titulo;
    panel.appendChild(titulo);

    var cuerpo = document.createElement('div');
    cuerpo.className = 'layout__cuerpo';
    (pantalla.cuerpo || []).forEach(function (texto) {
      var p = document.createElement('p');
      p.className = 'tipo-portada-cuerpo';
      p.textContent = texto;
      cuerpo.appendChild(p);
    });
    panel.appendChild(cuerpo);

    // C3: contenido real del avatar (narración + transcripción), si la
    // pantalla lo trae — después del cuerpo y antes del CTA, siguiendo
    // el orden de lectura kicker → título → cuerpo → narración →
    // "Comenzar". Objeto independiente del fondo (pantalla.media): ver
    // la nota completa arriba, junto a PLANTILLAS.L01.
    if (pantalla.avatar) {
      panel.appendChild(crearLocucion(pantalla.avatar));
    }

    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton boton--portada';
    boton.appendChild(document.createTextNode((pantalla.cta || 'Comenzar') + ' '));
    var iconoBoton = document.createElement('span');
    iconoBoton.className = 'boton__icono';
    iconoBoton.setAttribute('aria-hidden', 'true');
    iconoBoton.textContent = 'arrow_forward';
    boton.appendChild(iconoBoton);
    boton.addEventListener('click', function () { OVA.router.siguiente(); });
    panel.appendChild(boton);

    var unionDesktop = document.createElement('img');
    unionDesktop.className = 'layout__union layout__union--desktop';
    unionDesktop.src = '../public/graf/union_graf_nuam.svg';
    unionDesktop.alt = '';
    unionDesktop.setAttribute('aria-hidden', 'true');
    panel.appendChild(unionDesktop);

    raiz.appendChild(panel);

    var mediaFondo = document.createElement('div');
    mediaFondo.className = 'layout__media';
    if (media.tipo === 'video') {
      var video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      var source = document.createElement('source');
      source.src = media.src;
      source.type = 'video/mp4';
      video.appendChild(source);
      mediaFondo.appendChild(video);
    } else {
      var img = document.createElement('img');
      img.src = media.src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      mediaFondo.appendChild(img);
    }
    var unionMobileTop = document.createElement('img');
    unionMobileTop.className = 'layout__union layout__union--mobile-top';
    unionMobileTop.src = '../public/graf/union_graf_nuam_mobile_top.svg';
    unionMobileTop.alt = '';
    unionMobileTop.setAttribute('aria-hidden', 'true');
    mediaFondo.appendChild(unionMobileTop);
    raiz.appendChild(mediaFondo);

    return { raiz: raiz, titulo: titulo };
  };

  // Antes de C0 esta era PLANTILLAS.L04 ("media protagonista").
  PLANTILLAS.L02 = function (pantalla) {
    // .layout--l02 .layout__media usa order:-1 (layouts.css) para
    // aparecer primero visualmente; el DOM sigue el orden de lectura
    // kicker → título → cuerpo → media (mismo criterio que .layout__figura
    // en L11 — es la jerarquía visual la que decide el orden en pantalla,
    // no el orden del documento).
    var raiz = crearRaiz('l02');
    // Ajustes tanda 10 (p04): con locución de avatar la pantalla deja de
    // ser "media protagonista" — una carta de audio no es un hero. La
    // variante la acota a 56rem centrada y baja la carta debajo del
    // texto (layouts.css). Mismo mecanismo de derivar la variante del
    // media.tipo que L03 y L12, sin campo nuevo de contrato.
    if (pantalla.media && pantalla.media.tipo === 'avatar') {
      raiz.classList.add('layout--l02--avatar');
    }
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    var cuerpo = crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo');
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));
    raiz.appendChild(crearMedia(pantalla.media));
    return { raiz: raiz, titulo: titulo };
  };

  // Sin cambio de número en C0.
  // Ajustes tanda 4: variante de bienvenida (retícula de 12 columnas,
  // ver layouts.css) cuando la pantalla trae un retrato en vez de
  // video/avatar — no es un layout nuevo ni un campo nuevo de
  // contenido, se deriva del mismo media.tipo que ya decide qué
  // construye OVA.media.crear().
  PLANTILLAS.L03 = function (pantalla) {
    var raiz = crearRaiz('l03');
    if (pantalla.media && pantalla.media.tipo === 'retrato') {
      raiz.classList.add('layout--l03--retrato');
      // Ajustes tanda 10: `pantalla.mediaLado` es el único campo del
      // contrato que NO se deriva de la media — porque la diferencia
      // entre las dos pantallas reales con retrato es editorial, no
      // estructural: en la bienvenida el retrato entra primero y el
      // texto después (por defecto, "inicio"); en la del tutor manda el
      // nombre y las credenciales, y el retrato acompaña ("fin").
      // Derivarlo de otra cosa —de que haya locución, del `forma`—
      // sería una regla que nadie puede adivinar leyendo el contenido.
      // Vive en la pantalla y no dentro de `media` a propósito: es una
      // decisión de layout, y media.js no sabe de layouts.
      if (pantalla.mediaLado === 'fin') raiz.classList.add('layout--l03--retrato-fin');
    } else if (pantalla.media && pantalla.media.tipo === 'avatar') {
      // AJUSTES.md tanda 8: variante con locución de avatar a la
      // izquierda y contenido a la derecha — ver layouts.css.
      raiz.classList.add('layout--l03--avatar');
    }
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    var cuerpo = pantalla.cuerpo ? crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo') : null;
    // AJUSTES.md tanda 8: "lista" es opcional, alternativa/complemento a
    // "cuerpo" (crearListaEnriquecida) — p02 la usa para sus cinco
    // objetivos con círculo numerado en vez de texto plano "1. …".
    var lista = pantalla.lista ? crearListaEnriquecida(pantalla.lista) : null;
    // Ajustes tanda 10 (p01-bienvenida, p10-tutor): `avatar` es la
    // locución de una pantalla cuyo `media` ya está ocupado por el
    // retrato de la columna de al lado. Va DENTRO de .layout__texto —no
    // como hermana— para que quede en la misma columna que el texto que
    // narra, igual que en la referencia de la pantalla del tutor.
    var locucion = pantalla.avatar ? crearLocucion(pantalla.avatar) : null;
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo, lista, locucion]));
    raiz.appendChild(crearMedia(pantalla.media));
    return { raiz: raiz, titulo: titulo };
  };

  // Antes de C0 esta era PLANTILLAS.L02 ("texto a una columna").
  PLANTILLAS.L04 = function (pantalla) {
    var raiz = crearRaiz('l04');
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    var cuerpo = crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo');
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));
    // T7: "datos" es opcional en L04 (a diferencia del extinto layout de
    // proceso, que exigía datos siempre) — s01 sigue siendo puro texto
    // sin él, s08/s09/s10 lo agregan (s09 con datos.tipo:'proceso').
    if (pantalla.datos) raiz.appendChild(crearDatos(pantalla.datos));
    // D8: "media" opcional — P02 (real, motion con transcripción) es la
    // única pantalla real que usa L04 con imagen/video de apoyo; el
    // brief ya lo pedía (ver la nota en layouts.css) pero C1 nunca cerró
    // esta ranura. Mismo patrón opcional que L08/L09/L10/L13.
    if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media));
    return { raiz: raiz, titulo: titulo };
  };

  // C1: 2 a 4 tarjetas comparables — ver crearTarjetasComparativas() más
  // arriba para el rango y el porqué de "tarjetas" en vez de "cuerpo".
  //
  // C7: el storyboard real ubica P13 (I07, tarjetas volteables) y P28
  // (I08, comparador de columnas) en L05, no en L06 — nota abierta que
  // dejó C5 en PLAN-CONTENIDO.md: "L05 hoy no tiene ranura para
  // interaccion". Se resuelve aquí en vez de convertir esas dos
  // pantallas a L06/L07: cuando la pantalla trae "interaccion" en vez
  // de "tarjetas", L05 monta esa interacción (misma crearInteraccion()
  // de L06/L07) porque I07/I08 YA son en sí mismas la disposición de
  // tarjetas comparables que L05 promete — no hacía falta una tarjeta
  // de solo lectura por delante. "tarjetas" e "interaccion" son
  // mutuamente excluyentes; layouts.css agrega el mismo tratamiento de
  // caja que usa L06 para que no quede sin estilo.
  PLANTILLAS.L05 = function (pantalla) {
    var raiz = crearRaiz('l05');
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    // Ajustes tanda 10 (p11): L05 no tiene ranura de media —sus tarjetas
    // ocupan el espacio principal— pero sí puede tener locución.
    //
    // Ajustes tanda 11: esa locución deja de ir al final y centrada y
    // pasa a compartir una fila de encabezado con kicker+título, arriba
    // a la derecha (layouts.css). Con las tarjetas ilustradas la columna
    // de tarjetas creció hacia abajo y una carta debajo de ellas quedaba
    // fuera de la pantalla sin scroll. La variante que usa p11 es
    // "sin-avatar": la ilustración de cada tarjeta ya carga el peso
    // visual de la pantalla y una foto más en la esquina compite con
    // ella en vez de sumar.
    if (pantalla.avatar) {
      var encabezado = document.createElement('div');
      encabezado.className = 'layout__encabezado';
      encabezado.appendChild(envolverTexto([
        pantalla.kicker ? crearKicker(pantalla.kicker) : null,
        titulo
      ]));
      encabezado.appendChild(crearLocucion(pantalla.avatar));
      raiz.appendChild(encabezado);
      if (pantalla.interaccion) {
        raiz.appendChild(crearInteraccion(pantalla.interaccion, pantalla.bloqueaAvance));
      } else {
        raiz.appendChild(crearTarjetasComparativas(pantalla.tarjetas));
      }
      if (pantalla.nota) raiz.appendChild(crearNotaTarjetas(pantalla.nota));
      return { raiz: raiz, titulo: titulo };
    }
    // Ajustes tanda 12 (p13, pedido de Juan): sin avatar, kicker + título
    // + interacción/tarjetas comparten un único contenedor de ancho
    // máximo — mismo tope de 72rem que ya usa L09--tarjetas
    // (p01a/p01b) para la misma necesidad de "agrupar todo el
    // contenido bajo un ancho consistente con el resto del curso".
    // Solo esta rama: p11 (con avatar) no lo pidió y conserva su ancho
    // completo actual.
    var contenedor = document.createElement('div');
    contenedor.className = 'layout--l05__contenedor';
    if (pantalla.kicker) contenedor.appendChild(crearKicker(pantalla.kicker));
    contenedor.appendChild(titulo);
    if (pantalla.interaccion) {
      contenedor.appendChild(crearInteraccion(pantalla.interaccion, pantalla.bloqueaAvance));
    } else {
      contenedor.appendChild(crearTarjetasComparativas(pantalla.tarjetas));
    }
    if (pantalla.nota) contenedor.appendChild(crearNotaTarjetas(pantalla.nota));
    raiz.appendChild(contenedor);
    return { raiz: raiz, titulo: titulo };
  };

  // Antes de C0 esta era PLANTILLAS.L10 ("interacción a pantalla
  // completa"). Sin .layout__cuerpo a propósito: kicker + título
  // compactos y centrados, la interacción ocupa el espacio principal —
  // igual que su marcador en la kitchen sink desde T1.5.
  PLANTILLAS.L06 = function (pantalla) {
    var raiz = crearRaiz('l06');
    // Ajustes tanda 13 (p22, p24): cualquier variante tablero de la
    // interacción (quiz.js, datos.variante empieza por "dashboard" —
    // "dashboard" en p22 con dos columnas de resultados, "dashboard-3col"
    // en p24 con tres) necesita más ancho que el 56rem de lectura
    // estándar de L06 — controles+resultados en columnas se ven
    // apretados ahí. El modificador vive en el layout (layouts.css)
    // porque el ancho es del layout, no del componente; se deriva del
    // contrato de contenido, no de pantalla.id, para no acoplar el
    // motor a una pantalla concreta (misma lógica que el resto de
    // PLANTILLAS: reacciona a datos, no a ids).
    var datosInteraccion = pantalla.interaccion && pantalla.interaccion.datos;
    if (datosInteraccion && /^dashboard/.test(datosInteraccion.variante || '')) {
      raiz.classList.add('layout--l06--ancho');
    }
    if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearInteraccion(pantalla.interaccion, pantalla.bloqueaAvance));
    return { raiz: raiz, titulo: titulo };
  };

  // C1: variante de chrome sobre L06 — misma crearInteraccion() (mismo
  // catálogo I01–I05 de quiz.js), kicker con ícono y título a la
  // izquierda en vez de centrado (ver layouts.css, .layout--l07). Es
  // la pantalla más repetida del curso (9/47).
  PLANTILLAS.L07 = function (pantalla) {
    var raiz = crearRaiz('l07');
    raiz.appendChild(crearKickerConIcono(pantalla.kicker || 'Pregunta', 'help'));
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    raiz.appendChild(titulo);
    raiz.appendChild(crearInteraccion(pantalla.interaccion, pantalla.bloqueaAvance));
    return { raiz: raiz, titulo: titulo };
  };

  // C1: resultado y retroalimentación — layout nuevo de verdad. Lee su
  // cifra/retro por obtenerResultado(), el único punto que C4 va a
  // tocar cuando agregue variables de contenido en tiempo de ejecución
  // (ver la nota junto a esa función, más arriba).
  PLANTILLAS.L08 = function (pantalla) {
    var resultado = obtenerResultado(pantalla);
    var raiz = crearRaiz('l08');
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    var cuerpo = pantalla.cuerpo ? crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo') : null;
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));
    // C7: avatar opcional — P10/P31/P43/P47, las cuatro pantallas reales
    // de L08, traen narración de avatar (recurso "avatar" en el
    // storyboard); antes de C7 este layout no tenía ninguna ranura de
    // media. Mismo patrón opcional que ya usa L09 con su media.
    if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media));

    // E1: cifra/callout ya no se arman aquí — OVA.resultado.construir()
    // (resultado.js) es la única fuente de esos dos nodos, compartida
    // con I15.
    var piezas = OVA.resultado.construir(resultado);
    if (piezas.cifra) {
      var cifra = document.createElement('div');
      cifra.className = 'layout__datos';
      cifra.appendChild(piezas.cifra);
      raiz.appendChild(cifra);
    }
    if (piezas.callout) {
      var interaccion = document.createElement('div');
      interaccion.className = 'layout__interaccion';
      interaccion.appendChild(piezas.callout);
      raiz.appendChild(interaccion);
    }

    return { raiz: raiz, titulo: titulo };
  };

  // C1: ideas clave (3–5). Media ahora opcional (P32/P39 no la usan) —
  // a diferencia de crearMedia() en L02/L03, aquí solo se agrega si
  // pantalla.media existe, mismo criterio que "datos" en L04. El
  // cuerpo se arma como lista real (crearListaIdeas), no párrafos.
  //
  // D7: tres ranuras nuevas, pensadas para p01a/p01b (accesibilidad y
  // tutorial) y no para contenido de unidad — las 47 pantallas del
  // storyboard siguen usando solo "cuerpo"/"media":
  // - "controles" es alternativa a "cuerpo" (mutuamente excluyentes,
  //   mismo criterio que tarjetas/interaccion en L05): p01b describe
  //   controles reales del chrome, cada uno con su propia miniatura
  //   (AJUSTES.md tanda 6), así que usa crearListaControles() en vez
  //   del check fijo de crearListaIdeas().
  // - "componente" monta crearComponente() en el mismo hueco de
  //   .layout__interaccion que ya usan L05/L06/L07/L10/L11. Ninguna
  //   pantalla real lo pide desde AJUSTES.md tanda 5 (ítem 14: el panel
  //   de preferencias salió de p01a a favor del aviso que apunta al
  //   botón de la barra superior, ver actualizarAvisoAccesibilidad() más
  //   abajo) — se deja en el catálogo, no se borra, mismo criterio que
  //   el componente "retrato" de AJUSTES.md #8 antes de tener pantalla
  //   real que lo usara.
  // - "nota" reusa crearNotaTarjetas() de L05: la misma idea (una línea
  //   secundaria de cierre) sirve tal cual aquí, sin inventar una
  //   tercera función para lo mismo.
  PLANTILLAS.L09 = function (pantalla) {
    var raiz = crearRaiz('l09');
    // Ajustes tanda 10 (p32): con locución de avatar la segunda columna
    // pasa de 4 a 5 de las 10 columnas útiles en escritorio ancho — una
    // carta de 26rem no es una imagen de apoyo que pueda encogerse (ver
    // layouts.css).
    if (pantalla.media && pantalla.media.tipo === 'avatar') {
      raiz.classList.add('layout--l09--avatar');
    }
    var titulo;
    if (pantalla.tarjetas) {
      // AJUSTES.md, tanda 5 (ítem 13): p01a resume accesibilidad como
      // grilla ilustrada, no como lista de ideas — encabezado centrado
      // (ícono + kicker + título, sin cuerpo propio) más la grilla de
      // crearTarjetasIconos(). No es un layout nuevo (regla dura 8):
      // variante de L09 activada solo cuando "tarjetas" existe, mismo
      // patrón que .layout--l03--retrato (AJUSTES.md #9).
      raiz.classList.add('layout--l09--tarjetas');
      var iconoEncabezado = document.createElement('span');
      iconoEncabezado.className = 'layout__icono-grande';
      iconoEncabezado.setAttribute('aria-hidden', 'true');
      var iconoEncabezadoGlifo = document.createElement('span');
      iconoEncabezadoGlifo.className = 'icono';
      iconoEncabezadoGlifo.textContent = 'accessibility_new';
      iconoEncabezado.appendChild(iconoEncabezadoGlifo);
      var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
      titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
      var descripcion = pantalla.cuerpo ? crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo') : null;
      var interiorEncabezado = document.createElement('div');
      interiorEncabezado.className = 'layout--l09__encabezado-interior';
      interiorEncabezado.appendChild(iconoEncabezado);
      interiorEncabezado.appendChild(envolverTexto([kicker, titulo, descripcion]));
      var encabezado = document.createElement('div');
      encabezado.className = 'layout--l09__encabezado';
      encabezado.appendChild(interiorEncabezado);
      raiz.appendChild(encabezado);
      raiz.appendChild(crearTarjetasIconos(pantalla.tarjetas));
    } else {
      if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
      titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
      var lista = pantalla.controles
        ? crearListaControles(pantalla.controles)
        : crearListaIdeas(pantalla.cuerpo, 'tipo-cuerpo');
      // Kicker fuera de .layout__texto a propósito (ver la nota en
      // layouts.css): en L09 ocupa su propia fila a todo el ancho, no es
      // el primer renglón de un bloque de lectura apilado.
      raiz.appendChild(envolverTexto([titulo, lista]));
    }
    if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media));
    if (pantalla.componente) raiz.appendChild(crearComponente(pantalla.componente));
    if (pantalla.nota) raiz.appendChild(crearNotaTarjetas(pantalla.nota));
    return { raiz: raiz, titulo: titulo };
  };

  // Antes de C0 esta era PLANTILLAS.L05 ("cifra destacada").
  PLANTILLAS.L12 = function (pantalla) {
    var raiz = crearRaiz('l12');
    var titulo;
    if (pantalla.media && pantalla.media.tipo === 'avatar') {
      // Ajustes tanda 9 (p03, "Invertir empieza por cambiar la forma de
      // ahorrar"): variante con retícula de 12 columnas (margen + 5 +
      // gutter + 4 + margen) cuando la pantalla trae avatar — mismo
      // mecanismo que .layout--l03--avatar/--retrato (se deriva de
      // media.tipo, sin campo nuevo de contrato). Kicker+título quedan
      // juntos en el bloque de 5 columnas (envolverTexto, sin cuerpo);
      // el avatar y el cuerpo comparten el bloque de 4 columnas — el
      // cuerpo se agrega dentro del mismo .layout__media que crearMedia()
      // ya arma, en vez de un contenedor aparte, para que ambos apilen
      // en una sola área de grid (layouts.css).
      raiz.classList.add('layout--l12--avatar');
      var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
      titulo = crearTitulo(pantalla.titulo, 'tipo-display-2');
      raiz.appendChild(envolverTexto([kicker, titulo]));
      var media = crearMedia(pantalla.media);
      media.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo-lg'));
      raiz.appendChild(media);
    } else {
      if (pantalla.kicker) raiz.appendChild(crearKicker(pantalla.kicker));
      titulo = crearTitulo(pantalla.titulo, 'tipo-display-2');
      raiz.appendChild(titulo);
      raiz.appendChild(crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo-lg'));
    }
    return { raiz: raiz, titulo: titulo };
  };

  // Antes de C0 esta era PLANTILLAS.L06 ("cita o dato curioso").
  PLANTILLAS.L13 = function (pantalla) {
    var raiz = crearRaiz('l13');
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h3');
    var cuerpo = crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo');
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));
    // C7: avatar opcional — P36/P40/P44, las tres vistas previas de
    // pieza insignia, traen narración de avatar; mismo patrón opcional
    // que L08/L09/L10.
    if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media));
    return { raiz: raiz, titulo: titulo };
  };

  // C1: cierre de unidad. "Siguiente paso" del nombre del brief es el
  // nav-inferior del chrome (T2/T3) — este layout no lleva su propio
  // botón de navegación, ver la nota de layouts.css junto a
  // .layout--l10. pantalla.logro es obligatorio: sin él no hay nada
  // que mostrar en el momento celebratorio de la unidad.
  PLANTILLAS.L10 = function (pantalla) {
    if (!pantalla.logro || !pantalla.logro.titulo) {
      throw new Error('Esta pantalla no trae "logro" (título del aviso de logro) y su layout lo necesita.');
    }
    var raiz = crearRaiz('l10');
    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-display-2');
    var cuerpo = crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo-lg');
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));
    // C7: avatar opcional — P35 (cierre real de la Unidad 1) trae
    // narración de avatar; mismo patrón opcional que L08/L09.
    if (pantalla.media) raiz.appendChild(crearMedia(pantalla.media));
    var interaccion = document.createElement('div');
    interaccion.className = 'layout__interaccion';
    interaccion.appendChild(crearAvisoLogro(pantalla.logro));
    raiz.appendChild(interaccion);
    return { raiz: raiz, titulo: titulo };
  };

  // C1: recursos descargables. pantalla.recursos es un arreglo (P34 va
  // a enganchar los cuatro descargables de Jose en una sola pantalla,
  // C8) — ver la nota de layouts.css junto a .layout--l11.
  PLANTILLAS.L11 = function (pantalla) {
    if (!pantalla.recursos || !pantalla.recursos.length) {
      throw new Error('Esta pantalla no trae "recursos" (arreglo de descargables) y su layout lo necesita.');
    }
    var raiz = crearRaiz('l11');

    var figura = document.createElement('div');
    figura.className = 'layout__figura';
    figura.setAttribute('aria-hidden', 'true');
    var iconoFigura = document.createElement('span');
    iconoFigura.className = 'icono';
    iconoFigura.textContent = 'folder_open';
    figura.appendChild(iconoFigura);
    raiz.appendChild(figura);

    var kicker = pantalla.kicker ? crearKicker(pantalla.kicker) : null;
    var titulo = crearTitulo(pantalla.titulo, 'tipo-h2');
    var cuerpo = crearCuerpo(pantalla.cuerpo, 'tipo-cuerpo');
    raiz.appendChild(envolverTexto([kicker, titulo, cuerpo]));

    var interaccion = document.createElement('div');
    interaccion.className = 'layout__interaccion';
    pantalla.recursos.forEach(function (recurso) {
      interaccion.appendChild(crearTarjetaRecurso(recurso));
    });
    raiz.appendChild(interaccion);

    return { raiz: raiz, titulo: titulo };
  };

  /* ---- Montaje ------------------------------------------------- */

  function limpiarApp() {
    var app = document.getElementById('app');
    while (app.firstChild) app.removeChild(app.firstChild);
    // C3: el router nunca monta más de una pantalla a la vez, así que
    // vaciar el registro de instancias de media.js aquí es correcto —
    // antes de C3 ese registro solo crecía con referencias a <video>/
    // <audio> ya desconectados del DOM (hallazgo de T4, anotado en
    // ESTADO.md y heredado explícitamente por C3 en PLAN-CONTENIDO.md).
    if (window.OVA && OVA.media && OVA.media.limpiarInstancias) {
      OVA.media.limpiarInstancias();
    }
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
    // Cualquier salida temprana de aquí en adelante deja la pantalla sin
    // interacción montada: nada la bloquea. Se fija primero para que
    // ningún "return fallarPantalla(...)" de abajo pueda heredar por
    // descuido el bloqueoAvanceActivo de la pantalla anterior.
    bloqueoAvanceActivo = false;
    if (CATALOGO_LAYOUTS.indexOf(pantalla.layout) === -1) {
      return fallarPantalla(pantalla, 'El layout "' + pantalla.layout + '" no existe en el catálogo L01–L13.');
    }
    var plantilla = PLANTILLAS[pantalla.layout];
    if (!plantilla) {
      return fallarPantalla(pantalla, 'El layout "' + pantalla.layout + '" es válido pero todavía no está implementado en el motor.');
    }
    // E2, trampa 3 de PLAN-ESTRUCTURA.md §3: L01 (portada) esconde la
    // barra inferior entera (regla dura 9) — bloqueaAvance ahí no tendría
    // dónde pintar "Siguiente" ni la nota. Fallo ruidoso, no silencio.
    if (pantalla.bloqueaAvance && pantalla.layout === 'L01') {
      return fallarPantalla(pantalla, 'bloqueaAvance no tiene sentido en L01: la portada no muestra la barra inferior donde vive "Siguiente".');
    }
    bloqueoAvanceActivo = !!pantalla.bloqueaAvance;
    // Desde T4 una plantilla puede fallar en tiempo real (media.tipo
    // inválido, media ausente en un layout que la exige): el mismo
    // criterio de "nunca renderizar a medias en silencio" aplica aquí,
    // no solo al layout inexistente.
    var resultado;
    try {
      // construyendoPantalla distingue, dentro de manejarActividadCompleta(),
      // un alCompletar() disparado durante el montaje (I15 que arranca ya
      // completa tras un F5 — no hay nada que anunciar) de uno disparado
      // en vivo ya con la pantalla puesta.
      construyendoPantalla = true;
      resultado = plantilla(pantalla);
    } catch (error) {
      bloqueoAvanceActivo = false;
      return fallarPantalla(pantalla, error.message);
    } finally {
      construyendoPantalla = false;
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

  // E2 — candado blando: aria-disabled + nota, nunca `disabled` real (eso
  // sacaría "Siguiente" del orden de tabulación y no diría por qué, ver
  // trampa 1 de PLAN-ESTRUCTURA.md §3). siguiente() es quien de verdad
  // bloquea el clic; esto solo refleja bloqueoAvanceActivo en el DOM.
  function actualizarBloqueoAvance() {
    var botonSiguiente = document.getElementById('nav-siguiente');
    var icono = document.getElementById('nav-siguiente-icono');
    var aviso = document.getElementById('nav-bloqueo-aviso');
    if (botonSiguiente) botonSiguiente.setAttribute('aria-disabled', bloqueoAvanceActivo ? 'true' : 'false');
    // Ajustes tanda 10: el estado se lee en el botón — candado en vez de
    // flecha. El ícono es aria-hidden (es el glifo de una fuente de
    // símbolos, no texto), así que no reemplaza a nada: quien no lo ve
    // sigue teniendo aria-disabled y la descripción de #nav-bloqueo-aviso.
    if (icono) icono.textContent = bloqueoAvanceActivo ? 'lock' : 'arrow_forward';
    // El aviso ya no se ve (u-oculto-visualmente, index.html) pero sigue
    // siendo la descripción accesible del botón: `hidden` lo saca del
    // árbol de accesibilidad mientras no hay bloqueo, para que
    // aria-describedby no arrastre una frase que no aplica.
    if (aviso) aviso.hidden = !bloqueoAvanceActivo;
  }

  // Único punto que apaga bloqueoAvanceActivo: lo llama el alCompletar()
  // que crearInteraccion() le pasó a OVA.quiz.crear() (ver quiz.js, E2).
  // Sin bloqueo activo, no-op — una interacción sin bloqueaAvance también
  // puede llamar a su alCompletar() por defecto (no-op de quiz.js) o, si
  // se reusara el mismo constructor en dos pantallas, una sin bloqueo.
  function manejarActividadCompleta() {
    if (!bloqueoAvanceActivo) return;
    bloqueoAvanceActivo = false;
    actualizarBloqueoAvance();
    // Trampa 2 de I15 (arrancar ya completa tras un F5): no es un cambio
    // en vivo, no hay nada que anunciar — la pantalla ni ha terminado de
    // montarse todavía.
    if (!construyendoPantalla) {
      OVA.a11y.anunciar('Actividad completa. Ya puedes continuar.');
    }
  }

  function actualizarNavInferior(inst) {
    var botonAnterior = document.getElementById('nav-anterior');
    var botonSiguiente = document.getElementById('nav-siguiente');
    var pasoCompleto = document.getElementById('nav-paso-completo');
    var pasoCorto = document.getElementById('nav-paso-corto');
    if (botonAnterior) botonAnterior.disabled = inst.esPrimera;
    if (botonSiguiente) botonSiguiente.disabled = inst.esUltima;
    if (pasoCompleto) pasoCompleto.textContent = 'Pantalla ' + (inst.indice + 1) + ' de ' + inst.total;
    if (pasoCorto) pasoCorto.textContent = (inst.indice + 1) + '/' + inst.total;
    actualizarBloqueoAvance();
  }

  /* ---- Chrome: migas de pan / jerarquía (D1) ----------------------
     Unidad › Cápsula › Tema como un <ol> semántico de 2 o 3 ítems,
     nunca enlaces: ningún nivel tiene una pantalla de destino propia
     dentro de la OVA — ese índice navegable es el drawer, no la miga.
     CSS fuerza la unidad a su propia línea (flex-basis:100% sobre el
     primer ítem); cápsula y tema quedan en la segunda. Cuando
     `capsula` es null el ítem de cápsula se oculta y el tema pierde
     su separador — "Tema" solo. Desde E3, las etiquetas de
     agrupación (Antes de empezar, Apertura, Cápsula 1–4, Cierre,
     Simulador) son valores reales de `capsula`: la única pantalla que
     sigue en null es la portada, así que esta rama ahora es
     prácticamente solo el caso de L01. (La regla de "si el título
     repite el nombre de la cápsula, mostrar solo la cápsula" que
     vivía aquí quedó descartada: ninguna pantalla se llama igual que
     su etiqueta — no se implementó.) El separador es un
     <span aria-hidden="true"> real del DOM (index.html), no contenido
     generado por CSS, porque un lector de pantalla no siempre ignora
     el ::after con texto y esto es puramente decorativo. */
  function tituloSinPrefijo(titulo) {
    var i = titulo.indexOf(':');
    return i === -1 ? titulo : titulo.slice(i + 1).trim();
  }

  function actualizarMigas(pantalla) {
    var unidad = document.getElementById('nav-migas-unidad');
    var capsula = document.getElementById('nav-migas-capsula');
    var capsulaTexto = document.getElementById('nav-migas-capsula-texto');
    var titulo = document.getElementById('nav-migas-titulo');

    if (unidad) unidad.textContent = pantalla.unidad || '';
    if (capsulaTexto) capsulaTexto.textContent = pantalla.capsula || '';
    if (capsula) capsula.hidden = !pantalla.capsula;
    if (titulo) titulo.textContent = tituloSinPrefijo(pantalla.titulo);
  }

  function actualizarProgreso(inst) {
    var barra = document.getElementById('nav-progreso');
    var relleno = document.getElementById('nav-progreso-relleno');
    var texto = document.getElementById('nav-progreso-texto');
    // D3: el % se calcula sobre las pantallas que cuentan para el curso
    // (progreso !== false), no sobre inst.total — eso deja fuera del
    // denominador p01a/p01b (D7): leer el tutorial no es avanzar en el curso.
    var pantallasProgreso = contenidoActual.pantallas.filter(function (pantalla) {
      return pantalla.progreso !== false;
    });
    var total = pantallasProgreso.length;
    var completadas = pantallasProgreso.filter(function (pantalla) {
      return inst.visitadas.indexOf(pantalla.id) !== -1;
    }).length;
    var fraccion = total ? completadas / total : 0;
    var porcentaje = Math.round(fraccion * 100);
    if (barra) {
      barra.setAttribute('aria-valuemin', '0');
      barra.setAttribute('aria-valuemax', '100');
      barra.setAttribute('aria-valuenow', String(porcentaje));
      barra.setAttribute(
        'aria-valuetext',
        porcentaje + ' % completado — ' + completadas + ' de ' + total + ' pantallas'
      );
    }
    if (relleno) relleno.style.transform = 'scaleX(' + fraccion + ')';
    if (texto) texto.textContent = porcentaje + ' % completado';
  }

  /* ---- Chrome: marco fijo — barras ocultas en la portada (C2) --------
     L01 va sin barra superior ni inferior, a sangre (regla dura 9 de
     CLAUDE.md): `hidden` las saca del grid de body (base.css) además
     de ocultarlas, así que la fila que les tocaba colapsa a 0 sola.
     No hay nada más que esconder: L01 no tiene progreso ni drawer que
     tenga sentido ofrecer todavía (es la pantalla 1), así que basta con
     las dos barras completas. */
  function actualizarChromePorLayout(pantalla) {
    var esPortada = pantalla.layout === 'L01';
    var header = document.querySelector('.nav-barra');
    var footer = document.querySelector('.nav-inferior');
    if (header) header.hidden = esPortada;
    if (footer) footer.hidden = esPortada;
  }

  /* ---- Chrome: pantalla completa (C2) -------------------------------
     Un solo botón real de la barra superior (#nav-pantalla-completa,
     disponible en todo el recorrido salvo L01, que esconde la barra
     entera) más una segunda aparición fija en la portada
     (#nav-portada-completa, ver index.html) — los dos alternan el mismo
     document.documentElement, así que comparten un único manejador de
     click y un único listener de fullscreenchange. document.fullscreenEnabled
     es falso dentro de un iframe de Moodle sin allowfullscreen: ahí los
     dos botones se quedan `hidden` para siempre, nunca un control que
     falla en silencio al pulsarlo (mismo criterio que el botón de
     pantalla completa de media.js en T4 — trampa 2 de
     PLAN-CONTENIDO.md §4.3). */
  var TEMPORIZADOR_PORTADA_MS = 4000; // "a los pocos segundos" (§4.2)
  var temporizadorPortada = null;
  // Calculado una sola vez en configurarPantallaCompleta(); gestionarBotonPortada()
  // lo consulta en cada navegación para no programar la revelación del botón
  // de la portada cuando no hay pantalla completa que ofrecer.
  var pantallaCompletaDisponible = false;

  function alternarPantallaCompleta() {
    if (document.fullscreenElement === document.documentElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var solicitar = document.documentElement.requestFullscreen ||
        document.documentElement.webkitRequestFullscreen;
      var resultado = solicitar.call(document.documentElement);
      // Safari antiguo no devuelve promesa; los demás sí. Un rechazo
      // (permiso denegado por el iframe embebedor, p. ej.) no debe
      // reventar en consola — mismo tratamiento que media.js en T4.
      if (resultado && resultado.catch) resultado.catch(function () {});
    }
  }

  function actualizarIconoPantallaCompleta() {
    var activo = document.fullscreenElement === document.documentElement;
    [
      document.getElementById('nav-pantalla-completa'),
      document.getElementById('nav-portada-completa')
    ].forEach(function (boton) {
      if (!boton) return;
      var icono = boton.querySelector('.icono');
      if (icono) icono.textContent = activo ? 'fullscreen_exit' : 'fullscreen';
      var etiqueta = boton.querySelector('.u-oculto-visualmente');
      if (etiqueta) etiqueta.textContent = activo ? 'Salir de pantalla completa' : 'Pantalla completa';
      // Solo #nav-pantalla-completa declara aria-pressed en index.html
      // (botón de preferencia real, con el punto naranja de
      // .boton-icono--relleno); #nav-portada-completa no lo trae y este
      // setAttribute no se lo agrega — sigue siendo un botón de acción
      // simple, no un toggle con estado.
      if (boton.hasAttribute('aria-pressed')) {
        boton.setAttribute('aria-pressed', String(activo));
      }
    });
  }

  /* ---- Chrome: botón de autolocución (D6) --------------------------
     Botón dedicado en la barra superior, misma clave que el checkbox
     del panel de preferencias (D5): los dos reflejan el mismo estado
     porque los dos reaccionan a OVA.preferencias.suscribir(), igual
     que los dos montajes de crearPanel() ya quedan sincronizados entre
     sí. Nace apagado (preferencias.js) — decisión de conformidad, no de
     gusto: con el toggle apagado por defecto no hay reproducción
     automática involuntaria y WCAG 1.4.2 no se activa en la primera
     carga. */
  function actualizarBotonAutolocucion(snapshot) {
    var boton = document.getElementById('nav-autolocucion');
    if (!boton) return;
    var activo = snapshot.autolocucion;
    boton.setAttribute('aria-pressed', String(activo));
    var icono = boton.querySelector('.icono');
    if (icono) icono.textContent = activo ? 'record_voice_over' : 'voice_over_off';
    var etiqueta = boton.querySelector('.u-oculto-visualmente');
    if (etiqueta) etiqueta.textContent = activo ? 'Desactivar autolocución' : 'Activar autolocución';
  }

  function configurarAutolocucion() {
    var boton = document.getElementById('nav-autolocucion');
    if (!boton) return;
    boton.addEventListener('click', function () {
      OVA.preferencias.establecer('autolocucion', !OVA.preferencias.obtener().autolocucion);
    });
    actualizarBotonAutolocucion(OVA.preferencias.obtener());
    OVA.preferencias.suscribir(actualizarBotonAutolocucion);
  }

  function configurarPantallaCompleta() {
    pantallaCompletaDisponible = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    if (!pantallaCompletaDisponible) return;
    var botonBarra = document.getElementById('nav-pantalla-completa');
    var botonPortada = document.getElementById('nav-portada-completa');
    if (botonBarra) {
      botonBarra.hidden = false;
      botonBarra.addEventListener('click', alternarPantallaCompleta);
    }
    if (botonPortada) {
      botonPortada.addEventListener('click', alternarPantallaCompleta);
    }
    document.addEventListener('fullscreenchange', actualizarIconoPantallaCompleta);
    document.addEventListener('webkitfullscreenchange', actualizarIconoPantallaCompleta);
  }

  // C2, sección 4.2/4.3 (trampa 3): revela el botón de la portada unos
  // segundos después de llegar a L01, sin robarle el foco a nadie —
  // solo quita `hidden` y, en el frame siguiente, agrega la clase que
  // dispara el fundido en CSS (components.css, .boton-icono--portada).
  // No llama a .focus() en ningún momento. Se re-oculta al salir de L01
  // (o al volver a entrar, para no dejar un temporizador viejo corriendo
  // sobre una visita nueva).
  function gestionarBotonPortada(pantalla) {
    var boton = document.getElementById('nav-portada-completa');
    if (!boton) return;
    window.clearTimeout(temporizadorPortada);
    boton.hidden = true;
    boton.classList.remove('es-visible');
    // Sin pantalla completa disponible no hay nada que revelar — mismo
    // criterio que el botón de la barra, que ni siquiera se desoculta en
    // configurarPantallaCompleta() cuando esto es falso.
    if (!pantallaCompletaDisponible || pantalla.layout !== 'L01') return;
    temporizadorPortada = window.setTimeout(function () {
      boton.hidden = false;
      window.requestAnimationFrame(function () {
        boton.classList.add('es-visible');
      });
    }, TEMPORIZADOR_PORTADA_MS);
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
    var mostrar = inst.masAvanzada > inst.indice;
    boton.hidden = !mostrar;
    // En mobile (components.css) reanudar y el progreso comparten el
    // mismo espacio y no caben los dos — esta clase es la que le dice al
    // CSS cuál de los dos ocultar. En desktop hay espacio de sobra y los
    // dos se muestran juntos, sin que esta clase cambie nada ahí.
    var barra = document.querySelector('.nav-barra');
    if (barra) barra.classList.toggle('nav-barra--reanudando', mostrar);
  }

  function reanudar() {
    var inst = OVA.state.instantanea();
    var pantalla = contenidoActual.pantallas[inst.masAvanzada];
    if (pantalla) navegarA(pantalla.id);
  }

  /* ---- Chrome: drawer de índice (T3, agrupado desde D1) -----------
     Lista generada una vez por contenido; cada navegación solo
     actualiza estado/aria-current de los items ya construidos. Estados
     con ícono y texto, nunca solo color (regla dura de CLAUDE.md): no
     hay estado "bloqueado" aquí —eso es entre unidades, lo resuelve
     Moodle (fuera de alcance)—, dentro de una unidad toda pantalla es
     alcanzable.

     D1: se agrupa por unidad (<h3>) y, dentro, por cápsula (<h4>) —
     encabezados reales, no <div>, para que un lector de pantalla
     pueda saltar de grupo en grupo. Cuando `capsula` es null esas
     pantallas quedan en su propia <ul> bajo el <h3> de la unidad, sin
     <h4> intermedio: no hay nombre de cápsula que anunciar. Desde E3
     esto ya casi no pasa — Antes de empezar, Apertura, Cierre y
     Simulador son valores reales de `capsula`, así que la única
     pantalla en null es la portada. Los grupos se detectan por el
     cambio de valor consecutivo, no por un mapa aparte — el contenido
     ya viene ordenado y cada unidad/cápsula es un tramo contiguo. */
  function construirDrawer(contenido) {
    var titulo = document.getElementById('drawer-titulo');
    var lista = document.getElementById('drawer-lista');
    if (titulo) titulo.textContent = contenido.titulo;
    if (!lista) return;
    while (lista.firstChild) lista.removeChild(lista.firstChild);

    var unidadActual;
    var capsulaActual;
    var listaActual = null;

    contenido.pantallas.forEach(function (pantalla) {
      if (pantalla.unidad !== unidadActual) {
        unidadActual = pantalla.unidad;
        capsulaActual = undefined;
        var h3 = document.createElement('h3');
        h3.className = 'nav-drawer__grupo-unidad';
        h3.textContent = unidadActual || '';
        lista.appendChild(h3);
      }
      if (pantalla.capsula !== capsulaActual) {
        capsulaActual = pantalla.capsula;
        if (capsulaActual) {
          var h4 = document.createElement('h4');
          h4.className = 'nav-drawer__grupo-capsula';
          h4.textContent = capsulaActual;
          lista.appendChild(h4);
        }
        listaActual = document.createElement('ul');
        listaActual.className = 'nav-drawer__lista';
        lista.appendChild(listaActual);
      }
      var fila = document.createElement('li');
      var item = document.createElement('a');
      item.className = 'nav-drawer__item';
      item.href = '#' + pantalla.id;
      var icono = document.createElement('span');
      icono.className = 'icono';
      icono.setAttribute('aria-hidden', 'true');
      item.appendChild(icono);
      item.appendChild(document.createTextNode(' ' + pantalla.titulo));
      fila.appendChild(item);
      listaActual.appendChild(fila);
    });
  }

  function actualizarDrawer(inst) {
    var lista = document.getElementById('drawer-lista');
    if (!lista) return;
    var items = lista.querySelectorAll('.nav-drawer__item');
    Array.prototype.forEach.call(items, function (item, indice) {
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

  /* ---- Chrome: preferencias del curso (D5) --------------------------
     El panel en sí (tamaño de texto, movimiento, transcripción,
     autolocución) lo arma OVA.preferencias.crearPanel() — router.js solo
     lo monta dentro del popover de la barra superior y lo cablea con
     OVA.preferencias.configurarPopover(). */
  function configurarPreferencias() {
    var boton = document.getElementById('pref-abrir');
    var contenedor = document.getElementById('pref-popover');
    if (!boton || !contenedor) return;
    contenedor.appendChild(OVA.preferencias.crearPanel());
    OVA.preferencias.configurarPopover(boton, contenedor);
    // AJUSTES.md, tanda 5 (ítem 14): si el aviso de abajo está visible y el
    // estudiante encuentra el botón por su cuenta, el aviso ya cumplió su
    // función — se oculta al abrir el popover, no solo al cerrar el aviso
    // a mano.
    boton.addEventListener('click', ocultarAvisoAccesibilidad);
  }

  /* ---- Chrome: aviso de accesibilidad (AJUSTES.md, tanda 5, ítem 14) --
     Reemplaza el panel de preferencias que p01a incrustaba completo en su
     cuerpo (D7): ahora un aviso corto, anclado al mismo botón que abre el
     popover real, le dice al estudiante dónde configurar esas preferencias
     en vez de repetir el formulario dentro de la pantalla. Contenido-
     driven igual que "nota"/"componente": cualquier pantalla puede traer
     "avisoAccesibilidad" (hoy solo p01a), no hace falta un caso especial
     por id. Se oculta al salir de la pantalla que lo pidió (siguiente
     navegación con avisoAccesibilidad ausente), al abrir el popover (ver
     configurarPreferencias()) o al pulsar su botón de cerrar — nunca se
     vuelve a mostrar solo porque el estudiante lo cerró y sigue en la
     misma pantalla. */
  function actualizarAvisoAccesibilidad(pantalla) {
    var aviso = document.getElementById('pref-aviso');
    var texto = document.getElementById('pref-aviso-texto');
    if (!aviso || !texto) return;
    if (!pantalla.avisoAccesibilidad) {
      ocultarAvisoAccesibilidad();
      return;
    }
    texto.textContent = pantalla.avisoAccesibilidad;
    aviso.hidden = false;
    // Mismo patrón que gestionarBotonPortada(): quitar "hidden" y recién
    // en el siguiente frame agregar la clase que dispara el fundido en
    // CSS, para que la transición de opacity tenga un valor de partida
    // real que animar en vez de saltar directo al final.
    window.requestAnimationFrame(function () {
      aviso.classList.add('es-visible');
    });
  }

  function ocultarAvisoAccesibilidad() {
    var aviso = document.getElementById('pref-aviso');
    if (!aviso || aviso.hidden) return;
    aviso.hidden = true;
    aviso.classList.remove('es-visible');
  }

  function configurarAvisoAccesibilidad() {
    var cerrar = document.getElementById('pref-aviso-cerrar');
    if (cerrar) cerrar.addEventListener('click', ocultarAvisoAccesibilidad);
  }

  // D5: "transcripcionVisible" abre el <details> de transcripción de la
  // pantalla activa (video/avatar-con-audio, ver media.js) mientras la
  // preferencia está encendida. Apagarla no fuerza el cierre — un
  // estudiante que lo abrió a mano para revisarlo no debería verlo
  // colapsarse solo porque apagó la preferencia en otra pantalla.
  // Selector por sufijo de clase (no un id fijo) porque media-video y
  // media-audio son familias de componentes distintas que comparten el
  // mismo patrón de <details>, no un solo componente.
  function aplicarTranscripcionVisible() {
    if (!OVA.preferencias.obtener().transcripcionVisible) return;
    var detalles = document.querySelectorAll('#app details[class$="__transcripcion"]');
    Array.prototype.forEach.call(detalles, function (detalle) {
      detalle.open = true;
    });
  }

  // D6: autolocución. Dos formas de traer un avatar con audio en el
  // contrato — `pantalla.avatar` (la locución "extra", en L01/L03/L05
  // desde la tanda 10 de ajustes; antes solo la portada) y
  // `pantalla.media.tipo === 'avatar'` (el resto, vía crearMedia) — así
  // que se comprueban las dos en vez de asumir una sola forma. Ninguna
  // pantalla real trae las dos a la vez con audio: donde hay `avatar`,
  // el `media` es un retrato o un video de fondo, que no suenan.
  function tieneAvatarConAudio(pantalla) {
    if (pantalla.avatar && pantalla.avatar.audio) return true;
    return !!(pantalla.media && pantalla.media.tipo === 'avatar' && pantalla.media.audio);
  }

  // Se llama al final de navegarA(), después de que la pantalla ya está
  // en el DOM. Nunca roba foco (no se llama a .focus() aquí — el foco lo
  // sigue moviendo enfocarEncabezado() más abajo) ni anuncia por
  // aria-live (el aviso de cambio de pantalla que ya dispara navegarA()
  // es suficiente) — ver PLAN-REDISENO.md §D6.
  function aplicarAutolocucion(pantalla, resultado) {
    if (!OVA.preferencias.obtener().autolocucion) return;
    if (!resultado || !resultado.raiz) return;
    if (!tieneAvatarConAudio(pantalla)) return;
    OVA.media.reproducirEn(resultado.raiz);
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
    actualizarChromePorLayout(pantalla);
    actualizarNavInferior(inst);
    actualizarMigas(pantalla);
    actualizarProgreso(inst);
    actualizarReanudar(inst);
    actualizarDrawer(inst);
    gestionarBotonPortada(pantalla);
    actualizarAvisoAccesibilidad(pantalla);
    aplicarTranscripcionVisible();
    aplicarAutolocucion(pantalla, resultado);
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
    // E2 — el candado real: aria-disabled en el botón es solo el reflejo
    // visual/anunciado (actualizarBloqueoAvance), esto es lo que de
    // verdad hace el clic (o Enter/Espacio con foco en el botón) inerte.
    if (bloqueoAvanceActivo) return false;
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
    configurarPreferencias();
    configurarAvisoAccesibilidad();
    configurarAutolocucion();
    configurarPantallaCompleta();
    // Encender/apagar "mostrar siempre la transcripción" desde el panel
    // debe verse en la pantalla activa sin esperar a la próxima
    // navegación — no solo al montar una pantalla nueva.
    OVA.preferencias.suscribir(aplicarTranscripcionVisible);
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
