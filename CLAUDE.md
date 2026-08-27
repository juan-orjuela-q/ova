# OVA nuam — instrucciones del proyecto

Objeto de aprendizaje virtual en HTML para el demo de la Academia Virtual nuam
(Appicua, RFP agosto 2026). Se empaqueta como SCORM 1.2 para Moodle y además se
sirve como sitio estático en URL directa. Entrega: 8 de septiembre de 2026.

## Reglas duras

Estas no se negocian ni se re-discuten en cada sesión.

1. **Nunca escribas un valor hexadecimal en el código.** Todo color sale de
   `src/styles/tokens.css`. Si necesitas un color que no existe ahí, para y
   pregunta: probablemente la respuesta es que ese color no se puede usar.
2. **WCAG 2.1 AA es requisito de implementación, no revisión final.** Cada
   componente nace accesible o no se da por terminado.
3. **El color nunca es el único código de un estado.** Todo estado lleva además
   icono y texto. Sin excepción.
4. **Nada de frameworks.** HTML, CSS y JavaScript nativo. Sin React, sin Vue, sin
   build step de bundler. El OVA tiene que abrir desde `file://` y desde un
   paquete SCORM sin servidor de por medio.
5. **Sin dependencias externas en tiempo de ejecución**, salvo Google Fonts.
   Nada de CDN de scripts: el OVA debe funcionar sin red una vez cargado.
6. **`outline: none` está prohibido.** El foco siempre visible.
7. **Responsive real, no lienzo escalado.** Prohibido `transform: scale()` sobre
   el contenedor de contenido. Debe reflowear a 320 px y aguantar zoom de texto
   al 200 % sin scroll horizontal.

## Restricciones de color que la gente rompe

El naranja de marca tiene la luminancia de un gris 450. De ahí sale todo esto:

- Naranja 500 **no es texto de cuerpo** sobre ninguna superficie clara. Para
  texto y enlaces sobre claro va el naranja 700.
- **Ningún naranja sobre superficies del gris 200 al 600.** Ni relleno, ni borde,
  ni icono. No llega ni a 3:1.
- **No existe el botón naranja pequeño.** La etiqueta blanca sobre naranja solo
  cumple como texto grande: mínimo 19 px en peso 600.
- El verde 500 y el rojo 500 son para rellenos e iconos. Como texto sobre claro
  van los 700.
- El gris 400 no es texto informativo sobre superficies claras. Sobre superficie
  inverse sí.
- Sobre superficie naranja: cuerpo en gris 950, blanco solo en display.

## Estructura

```
src/
  index.html            plantilla única del OVA
  styles/
    tokens.css          fuente de verdad del sistema visual
    base.css            reset, tipografía, foco, reduced-motion, utilidades
    layouts.css         los layouts L01..L13
    components.css      chrome, contenido, evaluación, datos
  js/
    app.js              arranque y montaje
    router.js           navegación entre pantallas
    state.js            progreso y máquina de estado
    storage.js          persistencia unificada
    scorm.js            wrapper SCORM 1.2 con degradación a standalone
    a11y.js             foco entre pantallas y anuncios aria-live
    media.js            reproductor
    quiz.js             motor de evaluación
    charts.js           gráficos en SVG o canvas
  content/
    ova-u1.json         contenido declarativo de la OVA
  assets/
dev/
  kitchen-sink.html     todos los componentes en una página
build/
  package-scorm.sh      genera el zip SCORM y la copia standalone
```

## El contrato de contenido

Cada OVA es un JSON. El código no sabe de contenido; el contenido no sabe de
código. Esta separación es lo que permite que Jose entregue guion y que la OVA
se genere sin escribir HTML pantalla por pantalla.

```json
{
  "id": "u1-contexto-mercado",
  "titulo": "Contexto sobre el mercado, la bolsa y las acciones",
  "unidad": 1,
  "pantallas": [
    {
      "id": "s01",
      "layout": "L01",
      "titulo": "…",
      "kicker": "Unidad 1",
      "cuerpo": ["…"],
      "media": { "tipo": "video", "src": "…", "poster": "…", "vtt": "…", "transcripcion": "…" },
      "interaccion": { "tipo": "I01", "datos": { } },
      "progreso": true
    }
  ]
}
```

Reglas del contrato: `layout` sale del catálogo L01..L13. `interaccion.tipo`
sale del catálogo I01..I14. Si el JSON pide algo que no existe en el catálogo,
el motor falla ruidosamente en consola — nunca renderiza a medias en silencio.

## Modos de ejecución

El mismo build corre en dos contextos y `scorm.js` los distingue solo:

- **Dentro de Moodle**: paquete SCORM subido al módulo, mismo origen que Moodle,
  la API está disponible. Reporta avance, tiempo e interacciones.
- **URL directa**: no hay API. Degrada a `localStorage`, todo funciona igual
  salvo el reporte. Nunca lanza error ni muestra advertencia al estudiante.

El descubrimiento de la API recorre `window.parent` hasta 10 niveles buscando
`API`. Si el OVA queda en otro origen que Moodle, ese acceso lanza SecurityError:
hay que capturarlo y degradar, no dejarlo reventar.

## Convenciones de código

- CSS con propiedades personalizadas y `gap`. Nada de márgenes por elemento para
  separar hermanos.
- Nombres de clase en español, en kebab-case, con prefijo por familia:
  `.cap-`, `.quiz-`, `.media-`, `.nav-`.
- JavaScript en módulos ES nativos. Sin transpilación.
- Cada componente interactivo expone su estado por atributos ARIA reales, no por
  clases CSS que un lector de pantalla no ve.
- Comentarios y textos de interfaz en español.
- Nada de `innerHTML` con contenido del JSON sin escapar.

## Cómo verificar

Cada tarea se da por terminada cuando:

1. El componente aparece en `dev/kitchen-sink.html` con todos sus estados.
2. Se recorre completo con teclado, con foco visible en cada parada.
3. Reflowea a 320 px sin scroll horizontal y aguanta zoom de texto al 200 %.
4. Ningún hex nuevo fuera de `tokens.css`.
5. `prefers-reduced-motion` desactiva sus animaciones.

La kitchen sink no es opcional ni es un extra: es la superficie de revisión del
proyecto y lo que se le muestra al equipo. Se actualiza en la misma tarea que
crea el componente, nunca después.

## Fuera de alcance

No construir. Si aparece en una petición, avisar en vez de implementarlo:

- Selector de país o cualquier variación de contenido por país. El contenido es
  uno solo y está neutralizado de marca. El argumento tri-país vive en el
  glosario descargable y en una infografía estática.
- Bloqueo de unidades. Eso lo resuelve Moodle con restricciones de acceso. El
  OVA solo conoce el estado bloqueado de una cápsula dentro de su propia unidad.
- Backend de cualquier tipo. No hay servidor.
- Tema oscuro completo. El sistema es claro con superficies inverse puntuales.
