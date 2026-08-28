/* ============================================================
   a11y.js — foco entre pantallas y anuncios aria-live.

   Dos responsabilidades, ninguna decorativa: mover el foco al
   encabezado de la pantalla nueva (para que un lector de pantalla
   entre directo al contenido, no se quede huérfano en el body) y
   anunciar el cambio por una región aria-live (para que quien no ve
   la animación de transición sepa igual que la pantalla cambió — ver
   "el movimiento no sustituye al anuncio" en CLAUDE.md).
   ============================================================ */
(function () {
  'use strict';

  var regionAnuncios = null;

  function region() {
    if (!regionAnuncios) {
      regionAnuncios = document.getElementById('anuncios');
    }
    return regionAnuncios;
  }

  function anunciar(texto) {
    var el = region();
    if (!el) return;
    // Vaciar antes de escribir: si el texto es idéntico al anuncio
    // anterior, el lector de pantalla no lo repite salvo que detecte
    // un cambio real del nodo.
    el.textContent = '';
    window.setTimeout(function () {
      el.textContent = texto;
    }, 50);
  }

  function enfocarEncabezado(elemento) {
    if (!elemento) return;
    if (!elemento.hasAttribute('tabindex')) {
      elemento.setAttribute('tabindex', '-1');
    }
    elemento.focus();
  }

  window.OVA = window.OVA || {};
  window.OVA.a11y = {
    anunciar: anunciar,
    enfocarEncabezado: enfocarEncabezado
  };
})();
