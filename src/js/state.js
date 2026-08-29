/* ============================================================
   state.js — progreso y máquina de estado.

   Dueño único de "dónde está el estudiante" y "qué ha visitado".
   No sabe de URL ni de DOM (eso es router.js) ni de cómo se
   persiste (eso es storage.js/scorm.js, a los que delega). Expone
   un modelo de solo lectura (instantanea()) más un suscriptor para
   que otras piezas reaccionen a cada cambio sin acoplarse entre sí.
   ============================================================ */
(function () {
  'use strict';

  var pantallas = [];
  var contenidoId = '';
  var indiceActual = 0;
  var visitadas = {};
  var suscriptores = [];

  function indiceDe(id) {
    for (var i = 0; i < pantallas.length; i++) {
      if (pantallas[i].id === id) return i;
    }
    return -1;
  }

  function indiceMasAvanzado() {
    var max = 0;
    Object.keys(visitadas).forEach(function (id) {
      var idx = indiceDe(id);
      if (idx > max) max = idx;
    });
    return max;
  }

  function instantanea() {
    return {
      indice: indiceActual,
      total: pantallas.length,
      pantalla: pantallas[indiceActual] || null,
      visitadas: Object.keys(visitadas),
      esPrimera: indiceActual === 0,
      esUltima: indiceActual === pantallas.length - 1,
      // La más lejos que ha llegado el estudiante, no dónde está ahora:
      // difieren cuando usa el drawer (T3) para volver a revisar una
      // pantalla ya visitada. El botón "Reanudar" del chrome usa esto
      // para saber si hay adónde volver.
      masAvanzada: indiceMasAvanzado()
    };
  }

  function persistir() {
    var pantallaActual = pantallas[indiceActual];
    OVA.storage.establecer(contenidoId, 'progreso', {
      actual: pantallaActual ? pantallaActual.id : null,
      visitadas: Object.keys(visitadas)
    });
    if (pantallaActual && OVA.scorm.disponible()) {
      OVA.scorm.establecerValor('cmi.core.lesson_location', pantallaActual.id);
      var completo = Object.keys(visitadas).length >= pantallas.length;
      OVA.scorm.establecerValor('cmi.core.lesson_status', completo ? 'completed' : 'incomplete');
      OVA.scorm.confirmar();
    }
  }

  function notificar() {
    var snapshot = instantanea();
    suscriptores.forEach(function (fn) {
      fn(snapshot);
    });
  }

  /**
   * @param {Array} listaPantallas - pantallas del contenido, en orden.
   * @param {Object} opciones - { contenidoId, idInicial }
   */
  function init(listaPantallas, opciones) {
    pantallas = listaPantallas || [];
    contenidoId = (opciones && opciones.contenidoId) || 'ova';
    var guardado = OVA.storage.obtener(contenidoId, 'progreso', null);

    visitadas = {};
    if (guardado && guardado.visitadas) {
      guardado.visitadas.forEach(function (id) {
        visitadas[id] = true;
      });
    }

    var idInicial = (opciones && opciones.idInicial) ||
      (guardado && guardado.actual) ||
      (pantallas[0] && pantallas[0].id);
    var idx = indiceDe(idInicial);
    // Si el id inicial no existe entre las pantallas (p. ej. el hash quedó
    // en algo que no es un id de pantalla, como el ancla del skip link de
    // T3), no se descarta el progreso guardado por eso: se cae al id
    // guardado antes de rendirse e ir a la primera pantalla.
    if (idx === -1 && guardado && guardado.actual) {
      idx = indiceDe(guardado.actual);
    }
    indiceActual = idx >= 0 ? idx : 0;
    if (pantallas[indiceActual]) {
      visitadas[pantallas[indiceActual].id] = true;
    }
  }

  function ir(id) {
    var idx = indiceDe(id);
    if (idx === -1) return false;
    indiceActual = idx;
    visitadas[id] = true;
    persistir();
    notificar();
    return true;
  }

  function actual() {
    return pantallas[indiceActual] || null;
  }

  function existe(id) {
    return indiceDe(id) !== -1;
  }

  function suscribir(fn) {
    suscriptores.push(fn);
    return function cancelar() {
      var idx = suscriptores.indexOf(fn);
      if (idx !== -1) suscriptores.splice(idx, 1);
    };
  }

  window.OVA = window.OVA || {};
  window.OVA.state = {
    init: init,
    ir: ir,
    actual: actual,
    existe: existe,
    instantanea: instantanea,
    suscribir: suscribir
  };
})();
