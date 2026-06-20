#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  FashionOS — Color Palette Patch
#  Old: Navy #2C3E50  + Teal  #4CA1AF
#  New: Dark Azure #003152 + Soft Blue #ADDFF1
#
#  Run from your project ROOT:
#    bash color-patch.sh
# ─────────────────────────────────────────────────────────────────

echo "🎨 Patching FashionOS palette → Dark Azure + Soft Blue..."

FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \))

for f in $FILES; do

  # ── Primary brand hex colors ───────────────────────────────────
  sed -i "s/#4CA1AF/#ADDFF1/g" "$f"
  sed -i "s/#4ca1af/#ADDFF1/g" "$f"
  sed -i "s/#2C3E50/#003152/g" "$f"
  sed -i "s/#2c3e50/#003152/g" "$f"

  # ── Teal family variants (used in hero shimmer, feature cards) ─
  sed -i "s/#5db8c5/#9dd6ed/g" "$f"
  sed -i "s/#5DB8C5/#9DD6ED/g" "$f"
  sed -i "s/#7dd3db/#c5ebf8/g" "$f"
  sed -i "s/#7DD3DB/#C5EBF8/g" "$f"

  # ── Light-mode teal (darkened for readability) ─────────────────
  sed -i "s/#3a8fa0/#0077a8/g" "$f"
  sed -i "s/#3A8FA0/#0077A8/g" "$f"

  # ── RGBA teal  76,161,175  → soft blue  173,223,241 ───────────
  sed -i "s/rgba(76,161,175,/rgba(173,223,241,/g"   "$f"
  sed -i "s/rgba(76, 161, 175,/rgba(173, 223, 241,/g" "$f"

  # ── RGBA navy  44,62,80  → dark azure  0,49,82 ────────────────
  sed -i "s/rgba(44,62,80,/rgba(0,49,82,/g"         "$f"
  sed -i "s/rgba(44, 62, 80,/rgba(0, 49, 82,/g"     "$f"

  # ── RGBA deep-navy (navbar bg)  10,22,40 → 0,14,31 ───────────
  sed -i "s/rgba(10,22,40,/rgba(0,14,31,/g"         "$f"
  sed -i "s/rgba(10, 22, 40,/rgba(0, 14, 31,/g"     "$f"

  # ── RGB string inside StatCard palette object ──────────────────
  sed -i "s/'76,161,175'/'173,223,241'/g"            "$f"
  sed -i "s/'44,62,80'/'0,49,82'/g"                 "$f"

  # ── Dark-mode background ───────────────────────────────────────
  sed -i "s/#0a1628/#000e1f/g" "$f"
  sed -i "s/#0A1628/#000E1F/g" "$f"

  # ── Light-mode background ─────────────────────────────────────
  sed -i "s/#eef3f8/#e4f4fc/g" "$f"
  sed -i "s/#EEF3F8/#E4F4FC/g" "$f"

  # ── Light-mode navbar backdrop ────────────────────────────────
  sed -i "s/rgba(238,243,248,/rgba(228,244,252,/g"   "$f"
  sed -i "s/rgba(238, 243, 248,/rgba(228, 244, 252,/g" "$f"

  # ── Light-mode active-nav bg ─────────────────────────────────
  sed -i "s/rgba(190,215,232,/rgba(173,223,241,/g"   "$f"
  sed -i "s/rgba(190, 215, 232,/rgba(173, 223, 241,/g" "$f"

  # ── Light-mode sidebar gradient stops ────────────────────────
  sed -i "s/#d4e4ef/#c8e8f7/g" "$f"
  sed -i "s/#D4E4EF/#C8E8F7/g" "$f"
  sed -i "s/#c2d8e8/#b5dcf0/g" "$f"
  sed -i "s/#C2D8E8/#B5DCF0/g" "$f"

done

echo ""
echo "✅  Done! Palette applied across all src files."
echo ""
echo "   Dark Azure  #003152  (backgrounds, navbars, gradients)"
echo "   Soft Blue   #ADDFF1  (accents, borders, highlights)"
echo ""
echo "📌  Don't forget: also replace src/index.css with the"
echo "    provided version (sidebar gradient stops need it)."
echo ""
echo "🚀  Restart dev server:  npm run dev"