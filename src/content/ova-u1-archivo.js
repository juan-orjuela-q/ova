/* ============================================================
   Banco archivado — 26 pantallas retiradas del recorrido de la
   Unidad 1 en E4 (PLAN-ESTRUCTURA.md, 10 sep 2026).

   `index.html` NO carga este archivo. No es contenido activo del
   OVA: es el lugar donde viven, recuperables, las pantallas que
   E4 sacó de `content/ova-u1.js` al reestructurar el recorrido de
   50 a 26 pantallas (decisión 0.6 de PLAN-ESTRUCTURA.md — van a un
   banco archivado, no al historial de git a secas). Vienen tal
   cual estaban en el contenido justo antes de esa reestructura
   (commit `821b6ac`), sin editar.

   Por qué salieron, agrupadas por causa:

   - **Repo (Unidad 2) y Arma tu portafolio (Unidad 5) completas**
     (p36–p39, p40, p44–p47): las dos piezas insignia que
     PLAN-ESTRUCTURA.md §0.5 saca del OVA. Queda una sola pieza
     insignia (la boleta de orden, p42, que sigue activa en
     `ova-u1.js` bajo Unidad 1 / Simulador).
   - **p41 (mercado vs. límite)**: explicaba la distinción que la
     boleta de orden pide aplicar. No vuelve porque romper el
     conteo fijo de 26 no era la opción elegida — el enunciado de
     la interacción I11 en p42 se volvió autosuficiente en su
     lugar (§5, punto 2 de PLAN-ESTRUCTURA.md).
   - **p27, p28 (ordinarias/preferenciales)**: la vieja Cápsula 4
     ("tipos de acciones") se reemplazó por "el perfil de riesgo"
     (Jonás); esa idea de contenido ya no tiene cápsula que la
     sostenga.
   - **p12, p14, p16–p19, p20, p21, p23, p26, p31, p33, p35**:
     recorte general del guion de Jose contra las cuatro cápsulas
     de video de Jonás — el motor no cambió, cambió qué pantallas
     existen y bajo qué agrupador.

   Recuperar una pantalla es moverla de vuelta a las `pantallas` de
   `ova-u1.js`, no hacer arqueología: los objetos de abajo son
   JSON puro, en el mismo contrato de contenido que documenta
   CLAUDE.md. Antes de reinsertar cualquiera, revisar si sigue
   siendo válida contra el catálogo de layouts/interacciones
   vigente (L01–L13, I01–I15) y si las rutas de media que trae
   siguen existiendo.

   Los ids no se tocan: son el hash de URL y la clave de progreso
   de cuando estas pantallas estuvieron activas (regla dura 7 de
   PLAN-ESTRUCTURA.md §0).
   ============================================================ */
window.OVA_CONTENIDO_ARCHIVO = 
[
  {
    "id": "p12",
    "layout": "L02",
    "titulo": "Cápsula 1: ¿En qué mercado estás entrando?",
    "unidad": "Unidad 1",
    "capsula": "¿En qué mercado estás entrando?",
    "kicker": "Unidad 1 · Cápsula 1",
    "cuerpo": [
      "Primero ubicaremos las acciones dentro del mercado de capitales y diferenciaremos tres grandes familias: renta variable, renta fija y derivados."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-medio-confondo-1.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "Antes de hablar de acciones, necesitas ver el mapa general. En el mercado de capitales se negocian instrumentos que conectan a quienes necesitan financiación con quienes buscan invertir. Las acciones hacen parte de la renta variable."
    },
    "progreso": true
  },
  {
    "id": "p14",
    "layout": "L03",
    "titulo": "Dónde encaja la inversión en acciones",
    "unidad": "Unidad 1",
    "capsula": "¿En qué mercado estás entrando?",
    "kicker": "Unidad 1 · Cápsula 1",
    "cuerpo": [
      "Las acciones son el instrumento característico de la renta variable. Puedes ganar por valorización o dividendos, pero también puedes perder si el precio baja o si la empresa no distribuye utilidades."
    ],
    "media": {
      "tipo": "imagen",
      "src": "../public/img/infografia/p14-renta-variable.svg",
      "alt": ""
    },
    "progreso": true
  },
  {
    "id": "p16",
    "layout": "L02",
    "titulo": "Cápsula 2: Qué es una acción",
    "unidad": "Unidad 1",
    "capsula": "Qué es una acción",
    "kicker": "Unidad 1 · Cápsula 2",
    "cuerpo": [
      "Ahora veremos por qué una acción te convierte en propietario de una fracción de una empresa y qué implica ser accionista."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-medio-confondo-2.webp",
      "audio": "../public/audio/demo-avatar.mp3",
      "transcripcion": "Una acción es un título participativo. Cuando compras una acción, compras una fracción muy pequeña de una empresa emisora. Esa participación puede darte derechos económicos y, según el tipo de acción, derechos políticos."
    },
    "progreso": true
  },
  {
    "id": "p17",
    "layout": "L02",
    "titulo": "Propiedad fraccionada",
    "unidad": "Unidad 1",
    "capsula": "Qué es una acción",
    "kicker": "Unidad 1 · Cápsula 2",
    "cuerpo": [
      "Ejemplo: si Andina Cementos emite 1.000.000 de acciones y tú compras 100, tienes una participación pequeña, pero real, en la compañía."
    ],
    "media": {
      "tipo": "video",
      "src": "../public/videos/motion/p17-propiedad-fraccionada.mp4",
      "transcripcion": "Imagina que Andina Cementos está dividida en un millón de partes iguales llamadas acciones. Si compras cien, tu participación es pequeña, pero existe. Esa propiedad fraccionada es la base de los derechos del accionista."
    },
    "progreso": true
  },
  {
    "id": "p18",
    "layout": "L05",
    "titulo": "Tres ventajas de ser accionista",
    "unidad": "Unidad 1",
    "capsula": "Qué es una acción",
    "kicker": "Unidad 1 · Cápsula 2",
    "tarjetas": [
      {
        "titulo": "Valorización",
        "texto": "Participar en valorizaciones si el precio sube."
      },
      {
        "titulo": "Dividendos",
        "texto": "Recibir dividendos cuando se reparten utilidades."
      },
      {
        "titulo": "Derechos políticos",
        "texto": "Acceder a derechos políticos en ciertos tipos de acciones."
      }
    ],
    "progreso": true
  },
  {
    "id": "p19",
    "layout": "L07",
    "titulo": "Comprobación cápsula 2",
    "unidad": "Unidad 1",
    "capsula": "Qué es una acción",
    "kicker": "Unidad 1 · Cápsula 2",
    "interaccion": {
      "tipo": "I02",
      "datos": {
        "id": "u1-p19-comprobacion-capsula2",
        "enunciado": "Comprar una acción equivale a prestar dinero a una empresa con interés fijo.",
        "intentos": 2,
        "respuestaCorrecta": false,
        "retroalimentacion": {
          "correcto": "Correcto. La acción es participación, no deuda con interés fijo.",
          "incorrecto": "Recuerda: una acción te vuelve accionista; un bono se parece más a un préstamo."
        }
      }
    },
    "progreso": true
  },
  {
    "id": "p20",
    "layout": "L02",
    "titulo": "Cápsula 3: Valorización y dividendo",
    "unidad": "Unidad 1",
    "capsula": "Valorización y dividendo",
    "kicker": "Unidad 1 · Cápsula 3",
    "cuerpo": [
      "Esta cápsula explica las dos fuentes básicas de retorno en acciones: vender a mayor precio y recibir parte de utilidades distribuidas."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-medio-confondo-3.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "Ahora entraremos a la pieza más práctica de la unidad. Aprenderás a calcular una valorización simple y un dividendo por acción. Estos cálculos no predicen el futuro, pero ayudan a entender de dónde viene la rentabilidad."
    },
    "progreso": true
  },
  {
    "id": "p21",
    "layout": "L02",
    "titulo": "El caso Petrocaribe: de $1.000 a $1.500",
    "unidad": "Unidad 1",
    "capsula": "Valorización y dividendo",
    "kicker": "Unidad 1 · Cápsula 3",
    "cuerpo": [
      "Compras 500 acciones de Petrocaribe a $1.000 cada una. Ocho meses después, el precio sube a $1.500. La diferencia por acción es $500 y la valorización es 50%."
    ],
    "media": {
      "tipo": "video",
      "src": "../public/videos/motion/p21-caso-petrocaribe.mp4",
      "transcripcion": "Supongamos que compras acciones de Petrocaribe a mil pesos cada una. Más adelante, el precio sube a mil quinientos. La diferencia es quinientos por acción. Al dividir quinientos entre mil, la valorización es cincuenta por ciento."
    },
    "progreso": true
  },
  {
    "id": "p23",
    "layout": "L02",
    "titulo": "El dividendo: reparto de utilidades",
    "unidad": "Unidad 1",
    "capsula": "Valorización y dividendo",
    "kicker": "Unidad 1 · Cápsula 3",
    "cuerpo": [
      "Banco del Sur genera utilidades. La asamblea decide qué porcentaje se reparte. El dividendo por acción se calcula dividiendo el monto a repartir entre el número de acciones."
    ],
    "media": {
      "tipo": "video",
      "src": "../public/videos/motion/p23-dividendo-reparto.mp4",
      "transcripcion": "El dividendo depende de utilidades y de la decisión de repartirlas. Si una empresa gana dinero, puede distribuir una parte entre sus accionistas. Pero también puede decidir repartir menos o no repartir, por ejemplo para fortalecer la operación."
    },
    "progreso": true
  },
  {
    "id": "p26",
    "layout": "L02",
    "titulo": "Cápsula 4: Tipos de acciones y perfil",
    "unidad": "Unidad 1",
    "capsula": "Tipos de acciones y perfil",
    "kicker": "Unidad 1 · Cápsula 4",
    "cuerpo": [
      "Ahora conectaremos los derechos de las acciones con tu perfil de riesgo y tus objetivos de inversión."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-medio-confondo-4.webp",
      "audio": "../public/audio/demo-avatar.mp3",
      "transcripcion": "No todas las acciones otorgan exactamente los mismos derechos. Además, no todos los inversionistas toleran el riesgo de la misma manera. Por eso, antes de invertir debes conocer el instrumento y conocerte como inversionista."
    },
    "progreso": true
  },
  {
    "id": "p27",
    "layout": "L03",
    "titulo": "Derechos políticos y económicos",
    "unidad": "Unidad 1",
    "capsula": "Tipos de acciones y perfil",
    "kicker": "Unidad 1 · Cápsula 4",
    "cuerpo": [
      "Derechos políticos: participación y voto cuando aplica.",
      "Derechos económicos: dividendos y beneficios patrimoniales cuando se generan y aprueban."
    ],
    "media": {
      "tipo": "imagen",
      "src": "../public/img/infografia/p27-derechos-politicos-economicos.svg",
      "alt": ""
    },
    "progreso": true
  },
  {
    "id": "p28",
    "layout": "L05",
    "titulo": "Ordinarias frente a preferenciales",
    "unidad": "Unidad 1",
    "capsula": "Tipos de acciones y perfil",
    "kicker": "Unidad 1 · Cápsula 4",
    "interaccion": {
      "tipo": "I08",
      "datos": {
        "id": "u1-p28-ordinarias-preferenciales",
        "enunciado": "Ordinarias: suelen incluir voto y participación en dividendos.\nPreferenciales: suelen priorizar derechos económicos y limitar el voto.\nAmbas pueden comprarse y venderse en el mercado si están listadas.",
        "columnas": [
          "Acciones ordinarias",
          "Acciones preferenciales"
        ],
        "filas": [
          {
            "etiqueta": "Voto",
            "izquierda": "normalmente sí",
            "derecha": "normalmente no"
          },
          {
            "etiqueta": "Dividendos",
            "izquierda": "proporcionales",
            "derecha": "preferencia económica"
          },
          {
            "etiqueta": "Prioridad en liquidación",
            "izquierda": "menor",
            "derecha": "mayor después de acreedores"
          },
          {
            "etiqueta": "Enfoque",
            "izquierda": "participación",
            "derecha": "ingreso preferente"
          }
        ]
      }
    },
    "progreso": true
  },
  {
    "id": "p31",
    "layout": "L08",
    "titulo": "Tu resultado",
    "unidad": "Unidad 1",
    "capsula": "Tipos de acciones y perfil",
    "kicker": "Unidad 1 · Cápsula 4",
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-3.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "Tu resultado resume tu tolerancia inicial al riesgo. Úsalo como punto de partida, no como sentencia. En inversiones reales, tu perfil debe confirmarse con una entidad autorizada y actualizarse si cambian tus objetivos o circunstancias."
    },
    "resultado": {
      "variable": "perfil_riesgo",
      "reglas": [
        {
          "valor": "conservador",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil conservador",
            "texto": "Prioriza estabilidad y liquidez. Este resultado es orientativo y no reemplaza asesoría profesional."
          }
        },
        {
          "valor": "moderado",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil moderado",
            "texto": "Busca equilibrio entre riesgo y retorno. Este resultado es orientativo y no reemplaza asesoría profesional."
          }
        },
        {
          "valor": "agresivo",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil agresivo",
            "texto": "Acepta volatilidad alta por mayor retorno potencial. Este resultado es orientativo y no reemplaza asesoría profesional."
          }
        }
      ],
      "retro": {
        "tipo": "nota",
        "titulo": "Responde el test de perfil",
        "texto": "Vuelve a la pantalla anterior y responde el test de perfil de riesgo para ver tu resultado aquí."
      }
    },
    "progreso": true
  },
  {
    "id": "p33",
    "layout": "L02",
    "titulo": "Las tres bolsas de nuam",
    "unidad": "Unidad 1",
    "capsula": "Cierre",
    "kicker": "Unidad 1 · Cierre",
    "cuerpo": [
      "Colombia: Bolsa de Valores de Colombia | Supervisor: SFC | Depósito: Deceval.",
      "Perú: Bolsa de Valores de Lima | Supervisor: SMV | Depósito: CAVALI.",
      "Chile: Bolsa de Santiago | Supervisor: CMF | Depósito: DCV."
    ],
    "media": {
      "tipo": "imagen",
      "src": "../public/img/infografia/p33-tres-bolsas-nuam.svg",
      "alt": ""
    },
    "progreso": true
  },
  {
    "id": "p35",
    "layout": "L10",
    "titulo": "Qué sigue después de esta unidad",
    "unidad": "Unidad 1",
    "capsula": "Cierre",
    "kicker": "Unidad 1 · Cierre",
    "cuerpo": [
      "En la siguiente unidad profundizarás en conceptos del mercado bursátil: mercado primario y secundario, operaciones de contado, repos, transferencia temporal de valores y actores del ecosistema."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-4.webp",
      "audio": "../public/audio/demo-avatar.mp3",
      "transcripcion": "Ya tienes la base. En adelante podrás estudiar cómo se ejecutan operaciones, quiénes participan en el mercado y qué debes verificar antes de enviar una orden. El siguiente paso es pasar del concepto a la operación."
    },
    "logro": {
      "titulo": "¡Completaste la Unidad 1!",
      "texto": "Contexto sobre el mercado, la bolsa y las acciones."
    },
    "progreso": true
  },
  {
    "id": "p36",
    "layout": "L13",
    "titulo": "Vista previa Unidad 2: Anatomía de un Repo",
    "unidad": "Unidad 2",
    "capsula": "Anatomía de un Repo",
    "kicker": "Unidad 2 · Pieza insignia Repo",
    "cuerpo": [
      "Objetivo: convertir una explicación densa en una línea de tiempo recorrible de tres momentos: inicio, plazo y regreso."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-abierto-confondo-2.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "Esta pieza funciona como una vista previa de la unidad dos. Un repo puede entenderse como una venta de acciones con pacto de recompra. La interacción mostrará qué cambia de manos al inicio, durante el plazo y al cierre."
    },
    "progreso": true
  },
  {
    "id": "p37",
    "layout": "L06",
    "titulo": "Repo paso a paso",
    "unidad": "Unidad 2",
    "capsula": "Anatomía de un Repo",
    "kicker": "Unidad 2 · Pieza insignia Repo",
    "interaccion": {
      "tipo": "I09",
      "datos": {
        "id": "u1-p37-repo-recorrido",
        "enunciado": "Recorre la operación y mira qué entrega cada parte en cada momento.",
        "estadoInicial": "Inversionista A necesita liquidez y posee acciones. Inversionista B tiene dinero disponible.",
        "momentos": [
          {
            "titulo": "Operación inicial",
            "descripcion": "A entrega acciones y B entrega dinero.",
            "cambia": "acciones de A a B; dinero de B a A",
            "resultado": "A obtiene liquidez; B recibe acciones bajo pacto."
          },
          {
            "titulo": "Durante el plazo",
            "descripcion": "Las acciones quedan inmovilizadas bajo condiciones pactadas.",
            "cambia": "no hay nueva entrega; se mantiene obligación de regreso",
            "resultado": "Las partes esperan vencimiento."
          },
          {
            "titulo": "Operación de regreso",
            "descripcion": "A recompra y B recibe dinero más rendimiento pactado.",
            "cambia": "acciones vuelven a A; dinero+rendimento va a B",
            "resultado": "La operación se cierra."
          }
        ],
        "estadoFinal": "Las acciones retornan al vendedor inicial y el comprador recibe el pago acordado.",
        "retro": "El rasgo esencial es el pacto de recompra, no la venta definitiva."
      }
    },
    "progreso": true
  },
  {
    "id": "p38",
    "layout": "L07",
    "titulo": "Comprobación Repo",
    "unidad": "Unidad 2",
    "capsula": "Anatomía de un Repo",
    "kicker": "Unidad 2 · Pieza insignia Repo",
    "interaccion": {
      "tipo": "I02",
      "datos": {
        "id": "u1-p38-comprobacion-repo",
        "enunciado": "En un repo, las acciones se entregan con un pacto de recompra futura.",
        "intentos": 2,
        "respuestaCorrecta": true,
        "retroalimentacion": {
          "correcto": "Correcto. El pacto de recompra diferencia el repo de una venta definitiva.",
          "incorrecto": "Revisa la secuencia: entrega inicial y recompra pactada al regreso."
        }
      }
    },
    "progreso": true
  },
  {
    "id": "p39",
    "layout": "L09",
    "titulo": "Cierre pieza Repo",
    "unidad": "Unidad 2",
    "capsula": "Anatomía de un Repo",
    "kicker": "Unidad 2 · Pieza insignia Repo",
    "cuerpo": [
      "El repo busca liquidez.",
      "Las acciones sirven como activo de respaldo.",
      "Hay operación inicial y de regreso.",
      "El precio de regreso incorpora el rendimiento acordado."
    ],
    "progreso": true
  },
  {
    "id": "p40",
    "layout": "L13",
    "titulo": "Vista previa Unidad 3: Tu primera orden",
    "unidad": "Unidad 3",
    "capsula": "Tu primera orden",
    "kicker": "Unidad 3 · Pieza insignia Orden",
    "cuerpo": [
      "Objetivo: practicar la diferencia entre orden a mercado y orden límite antes de enviar una instrucción real."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-abierto-confondo-3.webp",
      "audio": "../public/audio/demo-avatar.mp3",
      "transcripcion": "La tercera unidad debe llevar al estudiante de la teoría a la acción. Esta vista previa propone una boleta simulada para entender qué ocurre cuando eliges precio de mercado o precio límite."
    },
    "progreso": true
  },
  {
    "id": "p41",
    "layout": "L03",
    "titulo": "Mercado vs límite",
    "unidad": "Unidad 3",
    "capsula": "Tu primera orden",
    "kicker": "Unidad 3 · Pieza insignia Orden",
    "cuerpo": [
      "Orden a mercado: busca ejecución rápida al mejor precio disponible.",
      "Orden límite: fija el precio máximo de compra o mínimo de venta; puede no ejecutarse."
    ],
    "media": {
      "tipo": "imagen",
      "src": "../public/img/infografia/p41-mercado-vs-limite.svg",
      "alt": ""
    },
    "progreso": true
  },
  {
    "id": "p43",
    "layout": "L08",
    "titulo": "Resultado de la orden",
    "unidad": "Unidad 3",
    "capsula": "Tu primera orden",
    "kicker": "Unidad 3 · Pieza insignia Orden",
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-5.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "El resultado de una orden depende de sus condiciones. Lo importante es revisar cantidad, precio, vigencia, costos y saldo antes de confirmar. En la vida real, una orden confirmada tiene trazabilidad."
    },
    "resultado": {
      "variable": "resultado_boleta",
      "campo": "estado",
      "reglas": [
        {
          "valor": "ejecutada",
          "retro": {
            "tipo": "nota",
            "titulo": "Ejecutada",
            "texto": "tu instrucción encontró condiciones de mercado."
          }
        },
        {
          "valor": "expuesta",
          "retro": {
            "tipo": "nota",
            "titulo": "Expuesta",
            "texto": "queda vigente hasta que el precio llegue o venza."
          }
        },
        {
          "valor": "rechazada",
          "retro": {
            "tipo": "alerta",
            "titulo": "Rechazada",
            "texto": "faltan datos o no hay saldo/títulos suficientes."
          }
        }
      ],
      "retro": {
        "tipo": "nota",
        "titulo": "Envía tu boleta",
        "texto": "Vuelve a la pantalla anterior y envía tu boleta para ver el resultado aquí."
      }
    },
    "progreso": true
  },
  {
    "id": "p44",
    "layout": "L13",
    "titulo": "Vista previa Unidad 5: Arma tu portafolio",
    "unidad": "Unidad 5",
    "capsula": "Arma tu portafolio",
    "kicker": "Unidad 5 · Pieza insignia Portafolio",
    "cuerpo": [
      "Objetivo: repartir capital entre tres emisores ficticios y recibir retroalimentación según el perfil obtenido en P30."
    ],
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-abierto-confondo-4.webp",
      "audio": "../public/audio/demo-avatar.mp3",
      "transcripcion": "La quinta unidad debe cerrar con práctica. Esta pieza permite repartir capital entre tres emisores ficticios. La retroalimentación usará el perfil obtenido antes para sugerir si la distribución es coherente con tu tolerancia al riesgo."
    },
    "progreso": true
  },
  {
    "id": "p45",
    "layout": "L03",
    "titulo": "Tres emisores ficticios",
    "unidad": "Unidad 5",
    "capsula": "Arma tu portafolio",
    "kicker": "Unidad 5 · Pieza insignia Portafolio",
    "cuerpo": [
      "Petrocaribe: alto riesgo, sensible a precios de energía.",
      "Andina Cementos: riesgo medio, ligado a infraestructura y construcción.",
      "Banco del Sur: riesgo medio-bajo, negocio financiero diversificado."
    ],
    "media": {
      "tipo": "imagen",
      "src": "../public/img/infografia/p45-tres-emisores.svg",
      "alt": ""
    },
    "progreso": true
  },
  {
    "id": "p46",
    "layout": "L06",
    "titulo": "Distribuye $10.000",
    "unidad": "Unidad 5",
    "capsula": "Arma tu portafolio",
    "kicker": "Unidad 5 · Pieza insignia Portafolio",
    "interaccion": {
      "tipo": "I12",
      "datos": {
        "id": "u1-p46-portafolio",
        "enunciado": "Asigna porcentajes a Petrocaribe, Andina Cementos y Banco del Sur. La suma debe ser 100%.",
        "categorias": [
          {
            "id": "petrocaribe",
            "etiqueta": "Petrocaribe",
            "riesgo": "alto",
            "valorInicial": 34
          },
          {
            "id": "andinaCementos",
            "etiqueta": "Andina Cementos",
            "riesgo": "medio",
            "valorInicial": 33
          },
          {
            "id": "bancoDelSur",
            "etiqueta": "Banco del Sur",
            "riesgo": "medio-bajo",
            "valorInicial": 33
          }
        ],
        "reglas": [
          {
            "perfil": "conservador",
            "condiciones": [
              {
                "emisor": "petrocaribe",
                "operador": ">",
                "valor": 40
              }
            ],
            "retro": "La distribución luce agresiva para un perfil conservador; revisa concentración y pérdida tolerable."
          },
          {
            "perfil": "conservador",
            "condiciones": [
              {
                "emisor": "bancoDelSur",
                "operador": ">=",
                "valor": 50
              },
              {
                "tipo": "ningunoSupera",
                "valor": 60
              }
            ],
            "retro": "La distribución es más coherente con preservación relativa, aunque sigue expuesta a renta variable."
          },
          {
            "perfil": "moderado",
            "condiciones": [
              {
                "tipo": "ningunoSupera",
                "valor": 60
              }
            ],
            "retro": "La distribución muestra diversificación básica compatible con un perfil moderado."
          },
          {
            "perfil": "moderado",
            "condiciones": [
              {
                "tipo": "algunoSupera",
                "valor": 60
              }
            ],
            "retro": "Revisa concentración; un perfil moderado suele buscar equilibrio."
          },
          {
            "perfil": "agresivo",
            "condiciones": [
              {
                "emisor": "petrocaribe",
                "operador": "entre",
                "min": 30,
                "max": 60
              }
            ],
            "retro": "La exposición a riesgo alto puede ser coherente, siempre que haya análisis y límites."
          },
          {
            "perfil": "agresivo",
            "condiciones": [
              {
                "emisor": "petrocaribe",
                "operador": ">",
                "valor": 60
              }
            ],
            "retro": "Alta concentración: incluso un perfil agresivo debería justificar y monitorear ese riesgo."
          }
        ],
        "aviso": "No constituye recomendación de inversión."
      }
    },
    "progreso": true
  },
  {
    "id": "p47",
    "layout": "L08",
    "titulo": "Retro de portafolio",
    "unidad": "Unidad 5",
    "capsula": "Arma tu portafolio",
    "kicker": "Unidad 5 · Pieza insignia Portafolio",
    "media": {
      "tipo": "avatar",
      "imagen": "../public/img/avatar/avatar-primerplano-sinfondo-6.webp",
      "audio": "../public/audio/loc1_objetivos.mp3",
      "transcripcion": "La retroalimentación del portafolio debe educar, no recomendar. El estudiante aprende a revisar coherencia entre perfil y asignación. En inversiones reales se requiere información adicional, costos, horizonte, asesoría y reglas aplicables."
    },
    "resultado": {
      "variable": "perfil_riesgo",
      "reglas": [
        {
          "valor": "conservador",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil conservador",
            "texto": "Cuida concentración y liquidez. Ninguna retroalimentación equivale a una recomendación de inversión."
          }
        },
        {
          "valor": "moderado",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil moderado",
            "texto": "Busca equilibrio y diversificación. Ninguna retroalimentación equivale a una recomendación de inversión."
          }
        },
        {
          "valor": "agresivo",
          "retro": {
            "tipo": "nota",
            "titulo": "Perfil agresivo",
            "texto": "Tolera más volatilidad, pero no ignora concentración. Ninguna retroalimentación equivale a una recomendación de inversión."
          }
        }
      ],
      "retro": {
        "tipo": "nota",
        "titulo": "Arma tu portafolio",
        "texto": "Vuelve a la pantalla anterior y reparte tu capital para ver la retroalimentación aquí."
      }
    },
    "progreso": true
  }
];
