#!/usr/bin/env bash
# convert_to_webp.sh — batch-converts JPG/JPEG/PNG into WebP.
# Usage:  ./scripts/convert_to_webp.sh [target_directory]
# Requires `cwebp` — install via `brew install webp`

set -euo pipefail

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: $TARGET_DIR is not a directory" >&2
  exit 1
fi

count=0
# Use find for portability (works with default macOS bash 3.2)
while IFS= read -r -d '' img; do
  webp="${img%.*}.webp"
  echo "Converting $img -> $webp"
  cwebp -q 82 "$img" -o "$webp" >/dev/null 2>&1
  ((count++))
  # Uncomment the next line to delete originals after verifying quality
  # rm "$img"
done < <(find "$TARGET_DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0)

echo "Converted $count image(s) in $TARGET_DIR and subfolders." 