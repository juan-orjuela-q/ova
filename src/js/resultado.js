/* ============================================================
   resultado.js — resolución y construcción del bloque de resultado
   (cifra + callout).

   E1 (PLAN-ESTRUCTURA.md §2). Antes vivía entero dentro de
   PLANTILLAS.L08 (router.js): la regla "primera que aplica gana"
   contra una variable de contenido (obtenerResultado(), desde C1/C4/
   C7) y el armado del callout (crearCalloutResultado(), desde C1).
   I15 (quiz.js) necesita exactamente lo mismo al cerrar una batería
   de preguntas — se extrajo aquí para que las dos lean una sola
   implementación de esa regla en vez de mantener dos copias que
   divergirían en la primera corrección.

   Dos funciones, dos responsabilidades que no se pisan:
     resolver(resultado)  — decide QUÉ cifra/retro aplica (la regla de
       reglas.reglas, evaluada en orden, contra una variable de
       state.js). No toca el DOM.
     construir(efectivo)  — pinta lo que resolver() (o el contenido
       directo, si no hay "variable") ya decidió: { cifra, retro } →
       { cifra: nodo|null, callout: nodo|null }. No decide nada.

   Contrato de "resultado" (igual al que ya documentaba
   obtenerResultado() en router.js):
     {
       variable?,   // nombre de la variable en OVA.state
       campo?,      // subcampo, cuando la variable guarda un objeto
                     // (p. ej. resultado_boleta, que I11 fija como
                     // {operacion,tipo,estado,…} — ver quiz.js)
       reglas?: [ { valor: x, cifra?, retro? } | { minimo: n, cifra?, retro? } ],
       cifra?, retro?   // estático, o el estado "todavía sin dato"
                         // cuando la variable no tiene valor o ninguna
                         // regla matchea
     }
   Dentro de la regla elegida, omitir cifra.valor muestra el valor vivo
   de la variable tal cual (aciertos_diagnostico: el contenido no
   repite el conteo a mano en cada regla); si el contenido sí escribe
   un "valor" propio, ese gana — mismo criterio de "más específico
   gana" que el resto del contrato de contenido.
   ============================================================ */
(function () {
  'use strict';

  var ICONOS_CALLOUT = { nota: 'info', brand: 'lightbulb', alerta: 'warning' };

  function mezclarCifraConVariable(resultado, valorVariable) {
    var copia = {};
    Object.keys(resultado).forEach(function (clave) { copia[clave] = resultado[clave]; });
    var cifra = {};
    Object.keys(resultado.cifra).forEach(function (clave) { cifra[clave] = resultado.cifra[clave]; });
    cifra.valor = valorVariable;
    copia.cifra = cifra;
    return copia;
  }

  function resolver(resultado) {
    var efectivo = resultado;
    if (resultado.variable) {
      var valorVariable = OVA.state.obtenerVariable(resultado.variable);
      if (resultado.campo && valorVariable != null) {
        valorVariable = valorVariable[resultado.campo];
      }
      if (valorVariable !== undefined && resultado.reglas) {
        var regla = resultado.reglas.filter(function (r) {
          if (r.valor !== undefined) return r.valor === valorVariable;
          if (r.minimo !== undefined) return valorVariable >= r.minimo;
          return false;
        })[0];
        if (regla) efectivo = regla;
      }
      if (efectivo.cifra && efectivo.cifra.valor === undefined && valorVariable !== undefined) {
        efectivo = mezclarCifraConVariable(efectivo, valorVariable);
      }
    }
    return efectivo;
  }

  // C1: reusa .callout (T5) tal cual — mismo candado tipo→ícono→color
  // que ya resolvió .quiz-retro en T6, para no inventar un cuarto
  // patrón de "estado con color" en el proyecto.
  function crearCallout(retro) {
    var tipo = retro.tipo && ICONOS_CALLOUT[retro.tipo] ? retro.tipo : 'nota';
    var div = document.createElement('div');
    div.className = 'callout' + (tipo !== 'nota' ? ' callout--' + tipo : '');
    var icono = document.createElement('span');
    icono.className = 'icono callout__icono';
    icono.setAttribute('aria-hidden', 'true');
    icono.textContent = ICONOS_CALLOUT[tipo];
    div.appendChild(icono);
    var cuerpo = document.createElement('div');
    cuerpo.className = 'callout__cuerpo';
    if (retro.titulo) {
      var titulo = document.createElement('p');
      titulo.className = 'callout__titulo';
      titulo.textContent = retro.titulo;
      cuerpo.appendChild(titulo);
    }
    var texto = document.createElement('p');
    texto.className = 'tipo-cuerpo-sm';
    texto.textContent = retro.texto;
    cuerpo.appendChild(texto);
    div.appendChild(cuerpo);
    return div;
  }

  // construir(efectivo) espera el resultado YA resuelto (la salida de
  // resolver(), o directamente {cifra?,retro?} estático si quien llama
  // no usa variable) — no vuelve a evaluar reglas.
  function construir(efectivo) {
    var cifra = null;
    if (efectivo.cifra) {
      cifra = OVA.charts.crear({
        tipo: 'cifra',
        valor: efectivo.cifra.valor,
        etiqueta: efectivo.cifra.etiqueta,
        porcentaje: efectivo.cifra.porcentaje
      });
      if (!cifra) throw new Error('No se pudo construir la cifra de resultado (ver consola).');
    }
    var callout = efectivo.retro ? crearCallout(efectivo.retro) : null;
    return { cifra: cifra, callout: callout };
  }

  window.OVA = window.OVA || {};
  window.OVA.resultado = { resolver: resolver, construir: construir };
})();
