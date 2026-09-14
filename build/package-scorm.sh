#!/usr/bin/env bash
# ============================================================
# package-scorm.sh — genera el paquete SCORM 1.2 para Moodle y la
# copia standalone para URL directa (T9, CLAUDE.md).
#
# Antes de empaquetar, verifica que imsmanifest.xml liste exactamente
# los archivos que hay en src/ más los assets de public/ que el
# contenido referencia hoy. Si alguien agrega un archivo a src/ o
# cambia qué asset de public/ usa el contenido y se olvida de
# actualizar el manifiesto, el script falla ruidoso en vez de generar
# un paquete incompleto en silencio — mismo criterio que "falla
# ruidoso en consola" del contrato de contenido.
#
# Salida:
#   build/out/ova-u1-scorm.zip   — paquete para subir a Moodle
#   build/out/standalone/        — copia lista para servir en URL directa
#                                   (abrir standalone/src/index.html)
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT_DIR="build/out"
ZIP_NAME="ova-u1-scorm.zip"
STANDALONE_DIR="$OUT_DIR/standalone"

# Assets de public/ que el contenido activo (content/ova-u1.js, cargado
# por index.html) y el CSS/JS del motor referencian hoy. ova-u1-archivo.js
# NO se carga en runtime (ver CLAUDE.md), así que sus assets no van aquí.
# Los cuatro videos de cápsula viven en un host externo
# (proyectosappicua.com) por decisión confirmada de Juan (14 sep, ver
# ESTADO.md) — excepción explícita a la regla dura 5 de CLAUDE.md, no un
# gap temporal. No hay archivo local que empaquetar para esos cuatro. Si
# content/ova-u1.js suma otro asset de public/, agregarlo aquí Y a
# imsmanifest.xml — la verificación de abajo revienta si solo se hace uno
# de los dos.
PUBLIC_ASSETS=(
  "public/videos/vid0_introduccion-claudia-mirando-a-camara.mp4"
  "public/videos/capsulas/capsula-1-cover.webp"
  "public/videos/capsulas/capsula-2-cover.webp"
  "public/videos/capsulas/capsula-3-cover.webp"
  "public/videos/capsulas/capsula-4-cover.webp"
  "public/audio/a01-bienvenida.mp3"
  "public/audio/a02-objetivos.mp3"
  "public/audio/a03-forma-de-ahorrar.mp3"
  "public/audio/a04-punto-de-partida.mp3"
  "public/audio/a05-diagnostico-resultado.mp3"
  "public/audio/a06-tutor.mp3"
  "public/audio/a07-capsulas.mp3"
  "public/audio/a08-ideas-cierre.mp3"
  "public/img/avatar/avatar-sin-fondo-plano-primer-saluda.webp"
  "public/img/avatar/avatar-medio-confondo-1.webp"
  "public/img/avatar/avatar-abierto-confondo-5.webp"
  "public/img/avatar/avatar-medio-confondo-5.webp"
  "public/img/avatar/avatar-primerplano-confondo-1.webp"
  "public/img/avatar/avatar-primerplano-confondo-2.webp"
  "public/img/avatar/avatar-medio-confondo-7.webp"
  "public/img/tutor-jose-fernando-mejia.webp"
  "public/img/backgrounds/background-1.webp"
  "public/img/backgrounds/background-2.webp"
  "public/img/backgrounds/background-3.webp"
  "public/img/backgrounds/background-4.webp"
  "public/img/backgrounds/background-5.webp"
  "public/img/backgrounds/background-6.webp"
  "public/img/backgrounds/background-7.webp"
  "public/img/ilustraciones/capsula-1.webp"
  "public/img/ilustraciones/capsula-2.webp"
  "public/img/ilustraciones/capsula-3.webp"
  "public/img/ilustraciones/capsula-4.webp"
  "public/img/ilustraciones/renta-variable.webp"
  "public/img/ilustraciones/renta-fija.webp"
  "public/img/ilustraciones/derivados.webp"
  "public/img/ilustraciones/conservador.webp"
  "public/img/ilustraciones/moderado.webp"
  "public/img/ilustraciones/agresivo.webp"
  "public/img/icons/ind-transcripcion.svg"
  "public/img/icons/ind-contraste.svg"
  "public/img/icons/ind-teclado.svg"
  "public/img/icons/ind-responsive.svg"
  "public/img/icons/ind-zoomtexto.svg"
  "public/img/icons/ind-animacion.svg"
  "public/img/icons/muestra-navegacion-1-menu.svg"
  "public/img/icons/muestra-navegacion-2-ubicacion.svg"
  "public/img/icons/muestra-navegacion-3-indicador-progreso.svg"
  "public/img/icons/muestra-navegacion-4-reanudar.svg"
  "public/img/icons/muestra-navegacion-5-boton-accesibilidad.svg"
  "public/img/icons/muestra-navegacion-6-boton-locucion.svg"
  "public/img/icons/muestra-navegacion-7-boton-fullscreen.svg"
  "public/img/icons/muestra-navegacion-8-anterior.svg"
  "public/img/icons/muestra-navegacion-9-siguiente.svg"
  "public/graf/union_graf_nuam.svg"
  "public/graf/union_graf_nuam_mobile_top.svg"
  "public/graf/union_graf_nuam_mobile_bottom.svg"
)

echo "== 1/4 — Verificando imsmanifest.xml contra el disco =="

if [ ! -f imsmanifest.xml ]; then
  echo "ERROR: no existe imsmanifest.xml en la raíz del proyecto." >&2
  exit 1
fi

# hrefs declarados en el manifiesto (orden de aparición).
manifest_hrefs="$(grep -o 'href="[^"]*"' imsmanifest.xml | sed 's/^href="//;s/"$//' | sort -u)"

# archivos reales de src/, como rutas relativas con / (Git Bash ya usa /).
disk_src_files="$(find src -type f | sort -u)"

# unión esperada: src/** + los assets públicos declarados arriba.
expected_files="$(printf '%s\n%s\n' "$disk_src_files" "$(printf '%s\n' "${PUBLIC_ASSETS[@]}")" | sort -u)"

missing_in_manifest="$(comm -23 <(echo "$expected_files") <(echo "$manifest_hrefs"))"
extra_in_manifest="$(comm -13 <(echo "$expected_files") <(echo "$manifest_hrefs"))"

fail=0
if [ -n "$missing_in_manifest" ]; then
  echo "ERROR: estos archivos existen pero no están en imsmanifest.xml:" >&2
  echo "$missing_in_manifest" | sed 's/^/  - /' >&2
  fail=1
fi
if [ -n "$extra_in_manifest" ]; then
  echo "ERROR: imsmanifest.xml lista archivos que no existen en disco:" >&2
  echo "$extra_in_manifest" | sed 's/^/  - /' >&2
  fail=1
fi
for asset in "${PUBLIC_ASSETS[@]}"; do
  if [ ! -f "$asset" ]; then
    echo "ERROR: el asset público '$asset' no existe en disco." >&2
    fail=1
  fi
done
if [ ! -f "src/index.html" ]; then
  echo "ERROR: falta src/index.html, el SCO de lanzamiento." >&2
  fail=1
fi
if [ "$fail" -ne 0 ]; then
  echo "Empaquetado abortado: corrige el manifiesto o el contenido antes de reintentar." >&2
  exit 1
fi
echo "  OK — $(echo "$expected_files" | wc -l) archivos, manifiesto y disco coinciden."

echo "== 2/4 — Preparando el staging (misma copia sirve para el zip y el standalone) =="
rm -rf "$OUT_DIR"
STAGE_DIR="$OUT_DIR/_staging"
mkdir -p "$STAGE_DIR"
cp -r src "$STAGE_DIR/src"
for asset in "${PUBLIC_ASSETS[@]}"; do
  mkdir -p "$STAGE_DIR/$(dirname "$asset")"
  cp "$asset" "$STAGE_DIR/$asset"
done

echo "== 3/4 — Generando el zip SCORM ($ZIP_NAME) =="
# Ni `zip` de InfoZip ni Compress-Archive de PowerShell son garantía en
# todas las máquinas del equipo (verificado en esta sesión: la del
# usuario no tiene `zip`, sí Python) — se intenta en este orden y se usa
# el primero disponible, sin instalar nada nuevo.
#
# Se copia imsmanifest.xml AL STAGING y se comprime desde ahí (cd +
# rutas relativas), no con rutas sueltas desde la raíz del proyecto:
# `python -m zipfile -c` solo preserva la ruta relativa de directorios
# recorridos recursivamente — un archivo suelto pasado como argumento
# (ej. el .mp4 de public/videos/) lo guarda por su nombre base, sin la
# carpeta, y el <track>/<video> del paquete quedaría roto en Moodle.
# Bug real encontrado en esta sesión verificando el zip generado.
cp imsmanifest.xml "$STAGE_DIR/imsmanifest.xml"
ZIP_ABS="$(pwd)/$OUT_DIR/$ZIP_NAME"
if command -v zip >/dev/null 2>&1; then
  ( cd "$STAGE_DIR" && zip -r -X -q "$ZIP_ABS" imsmanifest.xml src public )
elif command -v python >/dev/null 2>&1; then
  ( cd "$STAGE_DIR" && python -m zipfile -c "$ZIP_ABS" imsmanifest.xml src public )
elif command -v python3 >/dev/null 2>&1; then
  ( cd "$STAGE_DIR" && python3 -m zipfile -c "$ZIP_ABS" imsmanifest.xml src public )
elif command -v powershell.exe >/dev/null 2>&1; then
  ( cd "$STAGE_DIR" && powershell.exe -NoProfile -Command "Compress-Archive -Path 'imsmanifest.xml','src','public' -DestinationPath '$ZIP_ABS' -Force" )
else
  echo "ERROR: no se encontró zip, python ni powershell.exe para comprimir." >&2
  exit 1
fi
echo "  OK — $OUT_DIR/$ZIP_NAME ($(du -h "$OUT_DIR/$ZIP_NAME" | cut -f1))"

echo "== 4/4 — Generando la copia standalone =="
rm "$STAGE_DIR/imsmanifest.xml"
# cp + rm en vez de mv: en esta máquina Windows, mv de un directorio
# recién escrito falla con "Permission denied" (probablemente un
# handle todavía abierto sobre el staging) — cp -r no tiene ese
# problema y el costo extra es insignificante para 8 MB.
cp -r "$STAGE_DIR" "$STANDALONE_DIR"
rm -rf "$STAGE_DIR"
echo "  OK — $STANDALONE_DIR/ (entrada: $STANDALONE_DIR/src/index.html)"

echo ""
echo "Listo:"
echo "  - Subir a Moodle:  $OUT_DIR/$ZIP_NAME"
echo "  - URL directa:     $STANDALONE_DIR/src/index.html"
