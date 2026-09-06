/* ============================================================
   media.js — reproductor de video (T4) y de avatar/audio (C3) con
   controles propios.

   Un solo elemento de media (<video> o <audio>) sin el atributo
   `controls`: cada control de abajo es un elemento nativo real
   (button, input[type="range"], details/summary, a[download]) en vez
   de un widget ARIA armado a mano — la operación por teclado la da el
   navegador mismo (Tab, Enter/Espacio, flechas en el scrubber), no un
   manejador de tecla que hay que mantener sincronizado con cada
   estado nuevo.

   "Un solo reproductor activo a la vez" (PLAN.md, T4; PLAN-CONTENIDO.md
   C3 lo hereda para audio): el registro `instancias` pausa cualquier
   otro elemento de media del documento en cuanto uno empieza a
   reproducirse — sin esto, un video y un avatar sonando a la vez es el
   bug más probable de esta pieza. `pausarOtros`/`instancias` no
   distinguen video de audio: los dos heredan de HTMLMediaElement y
   comparten `.pause()`/`.paused`, así que un solo registro alcanza.
   `limpiarInstancias()` (C3, expuesta como `OVA.media.limpiarInstancias`)
   vacía el registro entero — pensada para que `router.js` la llame al
   desmontar una pantalla: antes de C3 el registro solo crecía (T4 lo
   dejó anotado como hallazgo en `ESTADO.md`; con 47 pantallas y 14
   avatares, referencias a elementos ya desconectados del DOM dejan de
   ser inofensivas). Como el router nunca monta más de una pantalla a
   la vez, vaciar todo en cada desmontaje es correcto y más simple que
   filtrar por `isConnected` — la kitchen sink, que monta varias
   instancias a la vez y no desmonta nunca, simplemente no llama a esta
   función.

   Catálogo de `media.tipo` (C3, mismo criterio que el catálogo I01–I08
   vive en el encabezado de quiz.js, no en CLAUDE.md):

   - **"video"** (T4): `{ tipo, src, poster?, vtt?, transcripcion? }`.
     Sin cambios en esta sesión.
   - **"avatar"** (C3): `{ tipo, imagen, audio?, vtt?, transcripcion }`.
     Imagen fija (regla dura 10 de CLAUDE.md: "el avatar es imagen fija
     + audio, no video") más pista de audio opcional, subtítulos
     opcionales (solo tienen sentido si hay audio) y transcripción
     **obligatoria** — es la que carga la locución completa de Jose
     cuando el audio todavía no existe, así que sin ella no hay nada
     real que mostrar. Con audio: reproductor real (play, scrubber,
     tiempo, CC si hay `vtt`) más la transcripción en un `<details>`
     colapsado — mismo patrón que el video. **Sin audio: no se
     construye ningún control** (ni un botón de play que no reproduce
     nada — mismo criterio que el CC omitido en video sin `vtt`) y la
     transcripción se muestra directa, sin colapsar: es el único
     portador de la locución, así que tiene que verse como contenido
     terminado, no como un accesorio oculto detrás de un disclosure.
     Ninguna de las dos rutas es un estado roto — la sección 3.2 de
     `PLAN-CONTENIDO.md` lo pide explícito: "esa degradación es el
     placeholder, no una pantalla rota".

   - **"imagen"** (C7): `{ tipo, src, alt? }`. Infografías y motion sin
     avatar (P14/P17/P21/P23/P27/P33/P41/P45 del storyboard real): una
     imagen fija sin controles de reproducción — a diferencia de
     "avatar", no hay locución que reproducir aquí, así que no hay
     play/scrubber/CC que construir. `alt` es opcional y por defecto ''
     (decorativa): el texto real de la pantalla ya vive en
     `pantalla.cuerpo`, así que la imagen es decorativa mientras no
     exista el diagrama final — cuando Juan entregue la infografía real
     (SVG, PLAN-CONTENIDO.md §5), quien la enganche le agrega un `alt`
     que describa la estructura visual real, no antes: inventar un
     texto alternativo para un diagrama que todavía no existe sería
     describir algo que no está. Mismo criterio de degradación limpia
     que "avatar": si `src` falla al cargar, se quita la `<img>` y
     queda visible `.media-marcador` (ícono + `--surface-subtle`, ver
     components.css) en vez de un ícono de imagen rota — nunca una
     pantalla que se vea incompleta.
   - **"video"** (T4) también degrada limpio desde C7: si la fuente
     falla (rutas de motion todavía no producidas, mismo caso que
     "imagen"), el `error` del `<video>` reemplaza el lienzo por el
     mismo `.media-marcador` y oculta los controles — no tiene sentido
     dejar play/scrubber operables sobre un video que no existe.

   Cualquier otro valor de `tipo` falla ruidoso en consola (mismo
   patrón que un layout desconocido en router.js) en vez de mostrar una
   caja vacía.
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

  // C7: caja de marcador compartida por "imagen" y por el degrade de
  // "video" sin fuente real — mismo lenguaje visual que .layout__figura
  // de L11 (--surface-subtle + --text-tertiary, el par que la auditoría
  // axe-core de T9 ya validó sobre esa combinación de superficies).
  function crearMarcador(nombreIcono) {
    var marcador = document.createElement('div');
    marcador.className = 'media-marcador';
    var icono = document.createElement('span');
    icono.className = 'icono';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = nombreIcono;
    marcador.appendChild(icono);
    return marcador;
  }

  function pausarOtros(elemento) {
    instancias.forEach(function (otro) {
      if (otro !== elemento && !otro.paused) otro.pause();
    });
  }

  // C3: patrón de transcripción compartido entre video y avatar-con-audio
  // — <details>/<summary> nativo colapsado (Enter/Espacio gratis del
  // navegador, mismo criterio que el resto del proyecto) más un
  // <a download> cuyo href es un Blob del mismo texto (sin red, funciona
  // bajo file://). `prefijo` es la familia de clases del componente que
  // llama (media-video o media-audio), así el CSS de cada uno sigue
  // siendo dueño de su propia apariencia.
  function crearTranscripcionColapsada(texto, prefijo) {
    var detalle = document.createElement('details');
    detalle.className = prefijo + '__transcripcion';
    var resumen = document.createElement('summary');
    resumen.textContent = 'Ver transcripción';
    detalle.appendChild(resumen);
    detalle.appendChild(crearCuerpoTranscripcion(texto, prefijo));
    return detalle;
  }

  // C3: mismo contenido que la colapsada, pero directo en el árbol —
  // sin audio, la transcripción es el único portador real de la
  // locución (regla dura 10 de CLAUDE.md), así que esconderla detrás de
  // un disclosure la trataría como un extra opcional en vez del
  // contenido principal de la pantalla.
  function crearTranscripcionVisible(texto, prefijo) {
    var contenedor = document.createElement('div');
    contenedor.className = prefijo + '__transcripcion-directa';
    contenedor.appendChild(crearCuerpoTranscripcion(texto, prefijo));
    return contenedor;
  }

  function crearCuerpoTranscripcion(texto, prefijo) {
    var cuerpo = document.createElement('div');
    cuerpo.className = prefijo + '__transcripcion-cuerpo';
    texto.split(/\n+/).forEach(function (parrafo) {
      parrafo = parrafo.trim();
      if (!parrafo) return;
      var p = document.createElement('p');
      p.textContent = parrafo;
      cuerpo.appendChild(p);
    });

    var blob = new Blob([texto], { type: 'text/plain' });
    var descarga = document.createElement('a');
    descarga.className = prefijo + '__transcripcion-descarga';
    descarga.href = URL.createObjectURL(blob);
    descarga.download = 'transcripcion.txt';
    descarga.textContent = 'Descargar transcripción (.txt)';
    cuerpo.appendChild(descarga);
    return cuerpo;
  }

  function crearVideo(datos) {
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
      raiz.appendChild(crearTranscripcionColapsada(datos.transcripcion, 'media-video'));
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

    // C7: la fuente puede no existir todavía (motion sin producir) —
    // mismo criterio de degradación limpia que la <img> del avatar:
    // quitar el elemento roto y dejar un marcador visible en vez de un
    // reproductor con controles que nunca van a funcionar. El error de
    // una fuente que falla no siempre burbujea al <video> (verificado
    // con Playwright: bajo file:// con un solo <source>, networkState
    // llega a NETWORK_NO_SOURCE sin que video.error se llegue a poblar
    // ni "error" se dispare en el propio <video>) — se escucha en los
    // dos elementos y se degrada una sola vez.
    var yaDegradado = false;
    function alFallarFuente() {
      if (yaDegradado) return;
      yaDegradado = true;
      if (video.parentNode) video.parentNode.replaceChild(crearMarcador('videocam_off'), video);
      controles.hidden = true;
    }
    video.addEventListener('error', alFallarFuente);
    fuente.addEventListener('error', alFallarFuente);

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

  // C7: imagen fija sin controles — ver el catálogo completo en el
  // encabezado del archivo. A diferencia de "avatar", aquí no hay
  // locución que reproducir, así que no hay nada que construir salvo
  // la propia <img> sobre su marcador de fondo.
  function crearImagen(datos) {
    if (!datos.src) {
      console.error('[OVA] OVA.media.crear: media "imagen" necesita "src".');
      return null;
    }
    var raiz = document.createElement('div');
    raiz.className = 'media-imagen';
    var marcador = crearMarcador('image');
    var imagen = document.createElement('img');
    imagen.className = 'media-imagen__elemento';
    imagen.src = datos.src;
    imagen.alt = datos.alt || '';
    // Mismo criterio que el avatar de C3: sin archivo (infografías/
    // motion todavía sin producir, PLAN-CONTENIDO.md §5), quitar la
    // <img> deja el marcador visible en vez de un ícono de imagen rota.
    imagen.addEventListener('error', function () {
      if (imagen.parentNode) imagen.parentNode.removeChild(imagen);
    });
    marcador.appendChild(imagen);
    raiz.appendChild(marcador);
    return raiz;
  }

  // C3: imagen fija + audio opcional + subtítulos opcionales +
  // transcripción obligatoria — ver el catálogo completo en el
  // encabezado del archivo. `datos.imagen`/`transcripcion` son
  // obligatorios (sin imagen no hay avatar; sin transcripción no hay
  // nada real que mostrar en ninguna de las dos rutas); `audio`/`vtt`
  // son opcionales y `vtt` solo tiene sentido si hay `audio`.
  function crearAvatar(datos) {
    if (!datos.imagen) {
      console.error('[OVA] OVA.media.crear: media "avatar" necesita "imagen".');
      return null;
    }
    if (!datos.transcripcion) {
      console.error(
        '[OVA] OVA.media.crear: media "avatar" necesita "transcripcion" ' +
        '(regla dura 10 de CLAUDE.md: toda pantalla con locución la muestra, ' +
        'con o sin audio).'
      );
      return null;
    }

    var raiz = document.createElement('div');
    raiz.className = 'media-audio' + (datos.audio ? '' : ' media-audio--sin-audio');

    var avatarEnvoltura = document.createElement('div');
    avatarEnvoltura.className = 'media-audio__avatar';
    avatarEnvoltura.setAttribute('aria-hidden', 'true');
    var imagen = document.createElement('img');
    imagen.src = datos.imagen;
    imagen.alt = '';
    // Las imágenes de public/img/avatar/ todavía no existen — Juan las
    // produce en paralelo (PLAN-CONTENIDO.md §5). Sin archivo, quitar
    // la <img> deja el círculo en su --surface-muted de fondo (ya
    // definido más abajo en components.css), que se lee como el
    // placeholder de un avatar, no como un ícono de imagen rota.
    imagen.addEventListener('error', function () {
      if (imagen.parentNode) imagen.parentNode.removeChild(imagen);
    });
    avatarEnvoltura.appendChild(imagen);
    raiz.appendChild(avatarEnvoltura);

    if (!datos.audio) {
      // Sin audio: ningún control (mismo criterio que el CC omitido en
      // video sin vtt — nunca un botón que no hace nada) y la
      // transcripción directa, no colapsada: es el placeholder de
      // producción, no un estado roto (PLAN-CONTENIDO.md §3.2).
      raiz.appendChild(crearTranscripcionVisible(datos.transcripcion, 'media-audio'));
      return raiz;
    }

    var audio = document.createElement('audio');
    audio.preload = 'metadata';
    // Fuera del orden de tabulación, mismo motivo que el <video> de
    // crearVideo(): los controles propios de abajo cubren toda la
    // interacción.
    audio.tabIndex = -1;

    var fuente = document.createElement('source');
    fuente.src = datos.audio;
    audio.appendChild(fuente);

    var pista = null;
    if (datos.vtt) {
      pista = document.createElement('track');
      pista.kind = 'captions';
      pista.srclang = 'es';
      pista.label = 'Español';
      // Mismo motivo que en crearVideo(): datos.vtt es el TEXTO WebVTT,
      // no una ruta — un <track src="archivo.vtt"> real falla bajo
      // file:// (verificado con Playwright en T4).
      pista.src = URL.createObjectURL(new Blob([datos.vtt], { type: 'text/vtt' }));
      audio.appendChild(pista);
    }
    raiz.appendChild(audio);

    /* ---- Controles ------------------------------------------------ */
    var controles = document.createElement('div');
    controles.className = 'media-audio__controles';

    var play = crearBoton('media-audio__play icono', 'play_arrow', 'Reproducir');

    var scrubber = document.createElement('input');
    scrubber.type = 'range';
    scrubber.className = 'media-audio__progreso';
    scrubber.min = '0';
    scrubber.max = '0';
    scrubber.step = '0.1';
    scrubber.value = '0';
    scrubber.setAttribute('aria-label', 'Progreso del audio');

    var tiempo = document.createElement('span');
    tiempo.className = 'media-audio__tiempo';
    tiempo.setAttribute('aria-hidden', 'true'); // el scrubber ya lleva aria-valuetext equivalente
    tiempo.textContent = '00:00 / 00:00';

    var cc = null;
    if (pista) {
      cc = crearBoton('media-audio__cc', 'CC', 'Subtítulos activados');
      cc.setAttribute('aria-pressed', 'true');
    }

    controles.appendChild(play);
    controles.appendChild(scrubber);
    controles.appendChild(tiempo);
    if (cc) controles.appendChild(cc);
    raiz.appendChild(controles);

    // Línea de subtítulos en vivo: a diferencia de <video>, <audio> no
    // tiene superficie propia donde el navegador pinte el <track> —
    // esta es esa superficie, actualizada a mano en cada cuechange.
    // No es aria-live a propósito: un lector de pantalla ya tiene la
    // transcripción completa (abajo) como su ruta real; anunciar cada
    // cambio de cue encima del audio sonando sería ruido, no ayuda.
    var captions = null;
    if (pista) {
      captions = document.createElement('p');
      captions.className = 'media-audio__captions';
      raiz.appendChild(captions);
    }

    raiz.appendChild(crearTranscripcionColapsada(datos.transcripcion, 'media-audio'));

    /* ---- Comportamiento --------------------------------------------- */
    play.addEventListener('click', function () {
      if (audio.paused || audio.ended) audio.play();
      else audio.pause();
    });

    audio.addEventListener('play', function () {
      pausarOtros(audio);
      play.textContent = 'pause';
      play.setAttribute('aria-label', 'Pausar');
    });
    audio.addEventListener('pause', function () {
      play.textContent = 'play_arrow';
      play.setAttribute('aria-label', 'Reproducir');
    });

    function actualizarTiempo() {
      var duracion = isFinite(audio.duration) ? audio.duration : 0;
      tiempo.textContent = formatearTiempo(audio.currentTime) + ' / ' + formatearTiempo(duracion);
      scrubber.setAttribute(
        'aria-valuetext',
        formatearTiempo(audio.currentTime) + ' de ' + formatearTiempo(duracion)
      );
      if (document.activeElement !== scrubber) {
        scrubber.value = String(audio.currentTime);
      }
    }
    audio.addEventListener('loadedmetadata', function () {
      scrubber.max = String(audio.duration || 0);
      if (pista) pista.track.mode = 'showing';
      actualizarTiempo();
    });
    audio.addEventListener('timeupdate', actualizarTiempo);

    scrubber.addEventListener('input', function () {
      audio.currentTime = parseFloat(scrubber.value) || 0;
    });

    if (cc) {
      cc.addEventListener('click', function () {
        var activo = pista.track.mode === 'showing';
        pista.track.mode = activo ? 'hidden' : 'showing';
        cc.setAttribute('aria-pressed', String(!activo));
        cc.setAttribute('aria-label', activo ? 'Subtítulos desactivados' : 'Subtítulos activados');
        if (activo && captions) captions.textContent = '';
      });
    }

    if (pista) {
      pista.track.addEventListener('cuechange', function () {
        if (!captions || pista.track.mode !== 'showing') return;
        var activa = pista.track.activeCues && pista.track.activeCues[0];
        captions.textContent = activa ? activa.text : '';
      });
    }

    instancias.push(audio);
    return raiz;
  }

  function crear(datos) {
    if (!datos) {
      console.error('[OVA] OVA.media.crear: falta "datos".');
      return null;
    }
    if (datos.tipo === 'video') return crearVideo(datos);
    if (datos.tipo === 'avatar') return crearAvatar(datos);
    if (datos.tipo === 'imagen') return crearImagen(datos);
    console.error(
      '[OVA] OVA.media.crear: tipo de media "' + datos.tipo + '" no soportado ' +
      '(el catálogo es "video"/"avatar"/"imagen" — ver el encabezado de este archivo).'
    );
    return null;
  }

  // C3: expuesta para que router.js la llame al desmontar una pantalla
  // — ver la nota completa junto a "instancias" en el encabezado.
  function limpiarInstancias() {
    instancias = [];
  }

  // D6: autolocución. router.js la llama al terminar de montar una
  // pantalla nueva cuando la preferencia está encendida y la pantalla
  // trae un avatar con audio real — busca el <audio> dentro de la raíz
  // recién montada y lo reproduce, sin cambiar la firma de crear(). Solo
  // audio, nunca video (regla dura 10 de CLAUDE.md: el avatar es imagen
  // fija + audio). La promesa de play() puede rechazarse — la política
  // de autoplay del navegador bloquea audio con sonido sin gesto previo
  // del usuario — y ese rechazo no debe reventar en consola ni forzar
  // el reproductor a un estado mentiroso: se captura en silencio y el
  // botón de play queda como estaba (los listeners de "play"/"pause" ya
  // existentes son los únicos que le cambian el ícono, así que un play()
  // rechazado nunca los dispara y el botón sigue diciendo "Reproducir",
  // listo para pulsarse a mano).
  function reproducirEn(raiz) {
    if (!raiz) return;
    var audio = raiz.querySelector('audio');
    if (!audio) return;
    var promesa = audio.play();
    if (promesa && promesa.catch) promesa.catch(function () {});
  }

  window.OVA = window.OVA || {};
  window.OVA.media = { crear: crear, limpiarInstancias: limpiarInstancias, reproducirEn: reproducirEn };
})();
