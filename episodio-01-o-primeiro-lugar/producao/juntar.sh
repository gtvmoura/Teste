#!/usr/bin/env bash
# Junta as cenas renderizadas (c0..c10) no episódio final.
# Uso: ./juntar.sh <pasta_trabalho> <saida.mp4>
set -euo pipefail
PASTA="$1"; SAIDA="$2"
LISTA="$PASTA/lista.txt"; : > "$LISTA"
for c in c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10; do
  [ -f "$PASTA/$c/cena.mp4" ] || { echo "faltando $c"; exit 1; }
  echo "file '$PASTA/$c/cena.mp4'" >> "$LISTA"
done
ffmpeg -loglevel error -y -f concat -safe 0 -i "$LISTA" -c copy -movflags +faststart "$SAIDA"
echo "pronto: $SAIDA ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA") s)"
