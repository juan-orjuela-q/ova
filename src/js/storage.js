/* ============================================================
   storage.js — persistencia unificada.

   Un solo punto de acceso a localStorage, con caída a memoria si no
   está disponible (privacidad estricta, cuota llena, contexto que
   bloquea storage). Nunca lanza: si persistir falla, la sesión sigue
   funcionando, solo no sobrevive a un recargue.
   ============================================================ */
(function () {
  'use strict';

  var PREFIJO = 'ova:';
  var disponible = null;
  var memoria = {};

  function verificarDisponibilidad() {
    if (disponible !== null) return disponible;
    try {
      var clave = '__ova_test__';
      window.localStorage.setItem(clave, '1');
      window.localStorage.removeItem(clave);
      disponible = true;
    } catch (e) {
      disponible = false;
    }
    return disponible;
  }

  function clave(contenidoId, nombre) {
    return PREFIJO + contenidoId + ':' + nombre;
  }

  function obtener(contenidoId, nombre, porDefecto) {
    var k = clave(contenidoId, nombre);
    if (verificarDisponibilidad()) {
      try {
        var crudo = window.localStorage.getItem(k);
        return crudo === null ? porDefecto : JSON.parse(crudo);
      } catch (e) {
        return porDefecto;
      }
    }
    return Object.prototype.hasOwnProperty.call(memoria, k) ? memoria[k] : porDefecto;
  }

  function establecer(contenidoId, nombre, valor) {
    var k = clave(contenidoId, nombre);
    if (verificarDisponibilidad()) {
      try {
        window.localStorage.setItem(k, JSON.stringify(valor));
        return;
      } catch (e) {
        // cuota llena u otro fallo de escritura: cae a memoria.
      }
    }
    memoria[k] = valor;
  }

  window.OVA = window.OVA || {};
  window.OVA.storage = {
    obtener: obtener,
    establecer: establecer
  };
})();
