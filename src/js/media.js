/* ============================================================
   media.js — reproductor de video con controles propios (T4).

   Un solo <video> sin el atributo `controls`: cada control de abajo
   es un elemento nativo real (button, input[type="range"],
   details/summary, a[download]) en vez de un widget ARIA armado a
   mano — la operación por teclado la da el navegador mismo (Tab,
   Enter/Espacio, flechas en el scrubber), no un manejador de tecla
   que hay que mantener sincronizado con cada estado nuevo.

   "Un solo reproductor activo a la vez" (PLAN.md, T4): el registro
   `instancias` pausa cualquier otro video del documento en cuanto
   uno empieza a reproducirse — sin esto, dos cápsulas con audio
   sonando a la vez es el bug más probable de esta pieza.

   T4 solo sabe renderizar media.tipo === "video": cualquier otro
   valor falla ruidoso en consola (mismo patrón que un layout
   desconocido en router.js) en vez de mostrar una caja vacía.
   ============================================================ */
(function () {
  'use strict';

  var instancias = [];
  var VELOCIDADES = [1, 1.25, 1.5, 2, 0.75];

  function formatearTiempo(segundos) {
    if (!isFinite(segundos) || segundos < 0) segundos = 0;
    var m = Math.floor(segundos / 60);
    var s = Math.floor(segundos % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function crearBoton(clases, texto, etiqueta) {
    var boton = document.createElement('button');
    boton.type = 'button';
    boton.className = clases;
    if (texto) boton.textContent = texto;
    if (etiqueta) boton.setAttribute('aria-label', etiqueta);
    return boton;
  }

  function pausarOtros(video) {
    instancias.forEach(function (otro) {
      if (otro !== video && !otro.paused) otro.pause();
    });
  }

  function crear(datos) {
    if (!datos || datos.tipo !== 'video') {
      console.error(
        '[OVA] OVA.media.crear: tipo de media "' + (datos && datos.tipo) +
        '" no soportado (T4 solo implementa "video").'
      );
      return null;
    }

    var raiz = document.createElement('div');
    raiz.className = 'media-video';

    var lienzo = document.createElement('div');
    lienzo.className = 'media-video__lienzo';

    var video = document.createElement('video');
    video.className = 'media-video__elemento';
    video.preload = 'metadata';
    // Fuera del orden de tabulación a propósito: los controles propios
    // de abajo cubren toda la interacción, así que el <video> nativo
    // sería una segunda parada redundante para quien navega con Tab.
    video.tabIndex = -1;
    if (datos.poster) video.poster = datos.poster;

    var fuente = document.createElement('source');
    fuente.src = datos.src;
    fuente.type = 'video/mp4';
    video.appendChild(fuente);

    var pista = null;
    if (datos.vtt) {
      pista = document.createElement('track');
      pista.kind = 'subtitles';
      pista.srclang = 'es';
      pista.label = 'Español';
      // datos.vtt es el TEXTO WebVTT, no una ruta de archivo: un
      // <track src="archivo.vtt"> real falla bajo file:// en Chromium
      // ("Unsafe attempt to load URL... 'file:' URLs are treated as
      // unique security origins") incluso para un archivo hermano en
      // la misma carpeta — verificado con Playwright al construir T4.
      // Mismo motivo por el que el contenido general ya se carga como
      // .js en vez de .json + fetch (ver CLAUDE.md); Blob sí comparte
      // el origen del documento, así que no choca con esa restricción.
      pista.src = URL.createObjectURL(new Blob([datos.vtt], { type: 'text/vtt' }));
      video.appendChild(pista);
    }

    lienzo.appendChild(video);
    raiz.appendChild(lienzo);

    /* ---- Controles ------------------------------------------------ */
    var controles = document.createElement('div');
    controles.className = 'media-video__controles';

    var play = crearBoton('media-video__play icono', 'play_arrow', 'Reproducir');

    var scrubber = document.createElement('input');
    scrubber.type = 'range';
    scrubber.className = 'media-video__scrubber';
    scrubber.min = '0';
    scrubber.max = '0';
    scrubber.step = '0.1';
    scrubber.value = '0';
    scrubber.setAttribute('aria-label', 'Progreso del video');

    var tiempo = document.createElement('span');
    tiempo.className = 'media-video__tiempo';
    tiempo.setAttribute('aria-hidden', 'true'); // el scrubber ya lleva aria-valuetext equivalente
    tiempo.textContent = '00:00 / 00:00';

    var velocidadIndice = 0;
    var velocidad = crearBoton('media-video__velocidad', '1×', 'Velocidad de reproducción: 1×');

    var cc = null;
    if (pista) {
      cc = crearBoton('media-video__cc', 'CC', 'Subtítulos activados');
      cc.setAttribute('aria-pressed', 'true');
    }

    // document.fullscreenEnabled es false dentro de un iframe sin
    // allowfullscreen: el botón se omite en vez de quedar visible y
    // fallar en silencio al pulsarlo (mismo criterio que el indicador
    // de guardado de router.js, que solo dice "Guardado" si localStorage
    // de verdad respondió).
    var fullscreenDisponible = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
    var pantallaCompleta = null;
    if (fullscreenDisponible) {
      pantallaCompleta = crearBoton('media-video__pantalla-completa icono', 'fullscreen', 'Pantalla completa');
    }

    controles.appendChild(play);
    controles.appendChild(scrubber);
    controles.appendChild(tiempo);
    controles.appendChild(velocidad);
    if (cc) controles.appendChild(cc);
    if (pantallaCompleta) controles.appendChild(pantallaCompleta);
    raiz.appendChild(controles);

    /* ---- Transcripción (visible y descargable) --------------------- */
    if (datos.transcripcion) {
      var transcripcion = document.createElement('details');
      transcripcion.className = 'media-video__transcripcion';
      var resumen = document.createElement('summary');
      resumen.textContent = 'Ver transcripción';
      transcripcion.appendChild(resumen);

      var cuerpoTranscripcion = document.createElement('div');
      cuerpoTranscripcion.className = 'media-video__transcripcion-cuerpo';
      datos.transcripcion.split(/\n+/).forEach(function (parrafo) {
        parrafo = parrafo.trim();
        if (!parrafo) return;
        var p = document.createElement('p');
        p.textContent = parrafo;
        cuerpoTranscripcion.appendChild(p);
      });

      var blob = new Blob([datos.transcripcion], { type: 'text/plain' });
      var descarga = document.createElement('a');
      descarga.className = 'media-video__transcripcion-descarga';
      descarga.href = URL.createObjectURL(blob);
      descarga.download = 'transcripcion.txt';
      descarga.textContent = 'Descargar transcripción (.txt)';
      cuerpoTranscripcion.appendChild(descarga);

      transcripcion.appendChild(cuerpoTranscripcion);
      raiz.appendChild(transcripcion);
    }

    /* ---- Comportamiento --------------------------------------------- */
    play.addEventListener('click', function () {
      if (video.paused || video.ended) video.play();
      else video.pause();
    });

    // El ícono y el aria-label cambian juntos con el estado real del
    // <video> (no con la intención del clic): así reflejan lo mismo
    // sin importar si play/pausa lo disparó este botón, el fin del
    // video o pausarOtros() al empezar otro reproductor.
    video.addEventListener('play', function () {
      pausarOtros(video);
      play.textContent = 'pause';
      play.setAttribute('aria-label', 'Pausar');
    });
    video.addEventListener('pause', function () {
      play.textContent = 'play_arrow';
      play.setAttribute('aria-label', 'Reproducir');
    });

    function actualizarTiempo() {
      var duracion = isFinite(video.duration) ? video.duration : 0;
      tiempo.textContent = formatearTiempo(video.currentTime) + ' / ' + formatearTiempo(duracion);
      scrubber.setAttribute(
        'aria-valuetext',
        formatearTiempo(video.currentTime) + ' de ' + formatearTiempo(duracion)
      );
      // No pisar el valor mientras la persona lo está moviendo con
      // teclado o mouse: si el input tiene el foco, currentTime ya lo
      // fija el listener de "input" de abajo, no timeupdate.
      if (document.activeElement !== scrubber) {
        scrubber.value = String(video.currentTime);
      }
    }
    video.addEventListener('loadedmetadata', function () {
      scrubber.max = String(video.duration || 0);
      if (pista) pista.track.mode = 'showing';
      actualizarTiempo();
    });
    video.addEventListener('timeupdate', actualizarTiempo);

    scrubber.addEventListener('input', function () {
      video.currentTime = parseFloat(scrubber.value) || 0;
    });

    velocidad.addEventListener('click', function () {
      velocidadIndice = (velocidadIndice + 1) % VELOCIDADES.length;
      var v = VELOCIDADES[velocidadIndice];
      video.playbackRate = v;
      var etiqueta = v + '×';
      velocidad.textContent = etiqueta;
      velocidad.setAttribute('aria-label', 'Velocidad de reproducción: ' + etiqueta);
    });

    if (cc) {
      cc.addEventListener('click', function () {
        var activo = pista.track.mode === 'showing';
        pista.track.mode = activo ? 'hidden' : 'showing';
        cc.setAttribute('aria-pressed', String(!activo));
        cc.setAttribute('aria-label', activo ? 'Subtítulos desactivados' : 'Subtítulos activados');
      });
    }

    if (pantallaCompleta) {
      pantallaCompleta.addEventListener('click', function () {
        if (document.fullscreenElement === raiz) {
          (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        } else {
          var solicitar = raiz.requestFullscreen || raiz.webkitRequestFullscreen;
          var resultado = solicitar.call(raiz);
          // Safari antiguo no devuelve promesa; los demás sí. Un
          // rechazo (permiso denegado por el iframe embebedor, p. ej.)
          // no debe volcarse a la consola como error no capturado.
          if (resultado && resultado.catch) resultado.catch(function () {});
        }
      });
      document.addEventListener('fullscreenchange', function () {
        var activo = document.fullscreenElement === raiz;
        pantallaCompleta.textContent = activo ? 'fullscreen_exit' : 'fullscreen';
        pantallaCompleta.setAttribute('aria-label', activo ? 'Salir de pantalla completa' : 'Pantalla completa');
      });
    }

    instancias.push(video);
    return raiz;
  }

  window.OVA = window.OVA || {};
  window.OVA.media = { crear: crear };
})();
