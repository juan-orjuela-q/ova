/* ============================================================
   scorm.js — wrapper SCORM 1.2 con degradación a standalone.

   Descubre la API subiendo por window.parent hasta 10 niveles. Si el
   OVA queda en otro origen que Moodle, ese acceso lanza SecurityError:
   se captura y se degrada, nunca revienta. Fuera de Moodle no hay
   API y todo método aquí se vuelve un no-op silencioso — storage.js
   sigue guardando el progreso igual, solo no hay reporte a la LMS.
   ============================================================ */
(function () {
  'use strict';

  var API = null;
  var inicializada = false;

  function buscarAPI(ventana, nivel) {
    if (!ventana || nivel > 10) return null;
    try {
      if (ventana.API) return ventana.API;
    } catch (e) {
      return null; // SecurityError entre orígenes distintos al de Moodle.
    }
    if (ventana.parent && ventana.parent !== ventana) {
      return buscarAPI(ventana.parent, nivel + 1);
    }
    return null;
  }

  function iniciar() {
    API = buscarAPI(window, 0);
    if (!API) {
      inicializada = false;
      return false;
    }
    try {
      var resultado = API.LMSInitialize('');
      inicializada = resultado === 'true' || resultado === true;
    } catch (e) {
      inicializada = false;
      API = null;
    }
    return inicializada;
  }

  function disponible() {
    return inicializada && !!API;
  }

  function obtenerValor(elemento) {
    if (!disponible()) return '';
    try {
      return API.LMSGetValue(elemento);
    } catch (e) {
      return '';
    }
  }

  function establecerValor(elemento, valor) {
    if (!disponible()) return false;
    try {
      API.LMSSetValue(elemento, valor);
      return true;
    } catch (e) {
      return false;
    }
  }

  function confirmar() {
    if (!disponible()) return false;
    try {
      API.LMSCommit('');
      return true;
    } catch (e) {
      return false;
    }
  }

  function terminar() {
    if (!disponible()) return false;
    try {
      API.LMSFinish('');
    } catch (e) {
      // no-op: ya se está cerrando la página, no hay nada que hacer.
    }
    inicializada = false;
    return true;
  }

  window.OVA = window.OVA || {};
  window.OVA.scorm = {
    iniciar: iniciar,
    disponible: disponible,
    obtenerValor: obtenerValor,
    establecerValor: establecerValor,
    confirmar: confirmar,
    terminar: terminar
  };
})();
