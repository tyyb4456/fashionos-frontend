#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  FashionOS — Professional Font Restore
#  Old: Permanent Marker (cursive/display)
#  New: Cormorant Garamond (serif)
#
#  Run from your project ROOT:
#    bash update-fonts-clean.sh
# ─────────────────────────────────────────────────────────────────

echo "Swapping display font back -> Cormorant Garamond (professional)..."

FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \))

for f in $FILES; do
  sed -i "s/'Permanent Marker', cursive/'Cormorant Garamond', serif/g" "$f"
  sed -i 's/"Permanent Marker", cursive/"Cormorant Garamond", serif/g' "$f"
  sed -i "s/'Permanent Marker'/'Cormorant Garamond'/g" "$f"
  sed -i 's/"Permanent Marker"/"Cormorant Garamond"/g' "$f"
done

echo ""
echo "Done! Cormorant Garamond has been restored for that professional, clean, minimalistic feel."
echo ""
