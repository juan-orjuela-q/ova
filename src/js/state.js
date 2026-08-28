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

  function instantanea() {
    return {
      indice: indiceActual,
      total: pantallas.length,
      pantalla: pantallas[indiceActual] || null,
      visitadas: Object.keys(visitadas),
      esPrimera: indiceActual === 0,
      esUltima: indiceActual === pantallas.length - 1
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
    instantanea: instantanea,
    suscribir: suscribir
  };
})();
