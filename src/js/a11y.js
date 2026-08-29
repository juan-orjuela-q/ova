/* ============================================================
   a11y.js — foco entre pantallas y anuncios aria-live.

   Tres responsabilidades, ninguna decorativa: mover el foco al
   encabezado de la pantalla nueva (para que un lector de pantalla
   entre directo al contenido, no se quede huérfano en el body),
   anunciar el cambio por una región aria-live (para que quien no ve
   la animación de transición sepa igual que la pantalla cambió — ver
   "el movimiento no sustituye al anuncio" en CLAUDE.md), y ciclar el
   foco dentro de una superposición mientras está abierta (drawer de
   índice en T3, modal en T5 — la misma trampa de foco intencional le
   sirve a los dos, por eso vive aquí y no en router.js).
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

  var SELECTOR_FOCALIZABLE =
    'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"])';

  function elementosFocalizables(contenedor) {
    if (!contenedor) return [];
    var nodos = contenedor.querySelectorAll(SELECTOR_FOCALIZABLE);
    return Array.prototype.filter.call(nodos, function (el) {
      // offsetParent es null en elementos con `hidden` o
      // `display: none` (y en `position: fixed`, que este proyecto no
      // usa para nada focalizable) — suficiente para no ofrecer como
      // parada de Tab algo que no se ve.
      return el.offsetParent !== null;
    });
  }

  /**
   * Cicla el foco dentro de `contenedor` en un evento `keydown` de Tab:
   * Tab en el último focalizable vuelve al primero, Shift+Tab en el
   * primero va al último. Quien abre la superposición debe registrar
   * esto en su propio listener de `keydown` y quitarlo al cerrar — esta
   * función no gestiona su propio ciclo de vida, sería una trampa de
   * foco de verdad si vetara el cierre.
   */
  function ciclarFocoEn(contenedor, evento) {
    if (evento.key !== 'Tab') return;
    var focalizables = elementosFocalizables(contenedor);
    if (focalizables.length === 0) return;
    var primero = focalizables[0];
    var ultimo = focalizables[focalizables.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  window.OVA = window.OVA || {};
  window.OVA.a11y = {
    anunciar: anunciar,
    enfocarEncabezado: enfocarEncabezado,
    elementosFocalizables: elementosFocalizables,
    ciclarFocoEn: ciclarFocoEn
  };
})();
