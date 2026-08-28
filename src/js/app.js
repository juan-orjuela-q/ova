/* ============================================================
   app.js — arranque y montaje.

   Valida la forma del contenido antes de tocar el router: si el
   JSON no cumple el contrato mínimo, falla ruidosamente en consola
   y muestra un estado de error explícito en #app — nunca un blanco
   silencioso ni un render a medias (regla del contrato de contenido
   en CLAUDE.md).
   ============================================================ */
(function () {
  'use strict';

  function validarContenido(contenido) {
    if (!contenido) {
      throw new Error('No se encontró contenido (window.OVA_CONTENIDO). Revisa que content/ova-u1.js esté cargado antes de app.js.');
    }
    if (!contenido.id || !contenido.titulo) {
      throw new Error('El contenido no tiene "id" o "titulo".');
    }
    if (!Array.isArray(contenido.pantallas) || contenido.pantallas.length === 0) {
      throw new Error('El contenido no tiene "pantallas".');
    }
    contenido.pantallas.forEach(function (pantalla, indice) {
      if (!pantalla.id || !pantalla.layout || !pantalla.titulo) {
        throw new Error('La pantalla en la posición ' + indice + ' no tiene "id", "layout" o "titulo".');
      }
    });
  }

  function mostrarErrorFatal(mensaje) {
    var app = document.getElementById('app');
    if (!app) return;
    while (app.firstChild) app.removeChild(app.firstChild);
    var aviso = document.createElement('div');
    aviso.className = 'u-contenedor';
    aviso.setAttribute('role', 'alert');
    var titulo = document.createElement('p');
    titulo.className = 'tipo-h3';
    titulo.textContent = 'No se pudo cargar la OVA';
    var texto = document.createElement('p');
    texto.className = 'tipo-cuerpo';
    texto.textContent = mensaje;
    aviso.appendChild(titulo);
    aviso.appendChild(texto);
    app.appendChild(aviso);
  }

  function iniciar() {
    var contenido = window.OVA_CONTENIDO;
    try {
      validarContenido(contenido);
    } catch (error) {
      console.error('[OVA] ' + error.message);
      mostrarErrorFatal(error.message);
      return;
    }

    // Fuera de Moodle esto simplemente no encuentra la API y queda en
    // false: state.js sigue persistiendo por storage.js sin que nadie
    // vea un error ni una advertencia (modo "URL directa" de CLAUDE.md).
    OVA.scorm.iniciar();

    OVA.router.init(contenido);

    window.addEventListener('beforeunload', function () {
      OVA.scorm.terminar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
