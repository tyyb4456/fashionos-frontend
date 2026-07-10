#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  FashionOS — Gray & Copper Orange Palette Patch
#  Old: Emerald Ivory (#0D1512 / #2F9E6E)
#  New: Charcoal Copper
#         Charcoal Background   #191919
#         Card Dark Gray       #222222
#         Copper Orange        #e05e38   (accent)
#         Copper Light         #e87c5d   (hover accent)
#         Cream / Soft White   #f5f5f4   (text)
#
#  Run from your project ROOT:
#    bash color-patch-gray.sh
# ─────────────────────────────────────────────────────────────────

echo "🎨 Patching FashionOS palette → Charcoal Copper..."

FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \))

for f in $FILES; do

  # ── Primary accent (emerald -> copper) ────────────────────────────
  sed -i "s/#2F9E6E/#e05e38/g" "$f"
  sed -i "s/#2f9e6e/#e05e38/g" "$f"
  sed -i "s/#4FBE94/#e87c5d/g" "$f"
  sed -i "s/#4fbe94/#e87c5d/g" "$f"

  # ── Triplet replacement ──────────────────────────────────────────
  sed -i "s/47,158,110/224,94,56/g"   "$f"
  sed -i "s/47, 158, 110/224, 94, 56/g" "$f"

  # ── Light mode accents ───────────────────────────────────────────
  sed -i "s/#1F7A52/#d97736/g" "$f"
  sed -i "s/#1f7a52/#d97736/g" "$f"
  sed -i "s/#26935F/#e0854e/g" "$f"
  sed -i "s/#26935f/#e0854e/g" "$f"
  sed -i "s/31,122,82/217,119,54/g" "$f"
  sed -i "s/31, 122, 82/217, 119, 54/g" "$f"

  # ── Dark mode background replacements (green-black -> gray) ───────
  sed -i "s/#0D1512/#191919/g" "$f"
  sed -i "s/#0d1512/#191919/g" "$f"
  sed -i "s/#16211C/#222222/g" "$f"
  sed -i "s/#16211c/#222222/g" "$f"
  sed -i "s/#131F1A/#141414/g" "$f"
  sed -i "s/#131f1a/#141414/g" "$f"
  sed -i "s/#121A16/#1e1e1e/g" "$f"
  sed -i "s/#121a16/#1e1e1e/g" "$f"
  sed -i "s/#111A15/#1e1e1e/g" "$f"
  sed -i "s/#111a15/#1e1e1e/g" "$f"
  sed -i "s/#14201B/#212121/g" "$f"
  sed -i "s/#14201b/#212121/g" "$f"
  sed -i "s/#081410/#121212/g" "$f"
  sed -i "s/#081410/#121212/g" "$f"

  # ── RGBA / opacity structures ────────────────────────────────────
  sed -i "s/rgba(47,158,110,/rgba(224,94,56,/g" "$f"
  sed -i "s/rgba(47, 158, 110,/rgba(224, 94, 56,/g" "$f"
  sed -i "s/rgba(31,122,82,/rgba(217,119,54,/g" "$f"
  sed -i "s/rgba(31, 122, 82,/rgba(217, 119, 54,/g" "$f"

done

echo ""
echo "✅ Done! All colors patched to Charcoal & Copper Orange theme."
echo ""
