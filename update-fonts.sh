#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  FashionOS — Display Font Swap
#  Old: Cormorant Garamond (serif)
#  New: Permanent Marker (cursive/display)
#
#  Run from your project ROOT:
#    bash update-font-permanent-marker.sh
# ─────────────────────────────────────────────────────────────────

echo "Swapping display font -> Permanent Marker..."

# ── 1. Swap the Google Fonts import in index.html ──────────────────
sed -i 's/family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat/family=Permanent+Marker\&family=Montserrat/' index.html

# ── 2. Swap every font-family reference across src ──────────────────
FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \))

for f in $FILES; do
  sed -i "s/'Cormorant Garamond', serif/'Permanent Marker', cursive/g" "$f"
  sed -i 's/"Cormorant Garamond", serif/"Permanent Marker", cursive/g' "$f"
  sed -i "s/'Cormorant Garamond'/'Permanent Marker'/g" "$f"
  sed -i 's/"Cormorant Garamond"/"Permanent Marker"/g' "$f"
done

echo ""
echo "Done! Permanent Marker is now applied to:"
echo "  - Landing page: logo, hero headline, section titles, agent cards, timeline, CTA"
echo "  - App interior: page titles, stat values, run/approval headers"
echo ""
echo "Heads up: Permanent Marker only ships in one weight (400 Regular)."
echo "Any font-weight overrides on those elements will just be ignored by"
echo "the browser -- nothing breaks, but don't expect a bold variant."
echo ""
echo "Restart dev server: npm run dev"