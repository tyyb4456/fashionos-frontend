#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  FashionOS — Color Palette Patch
#  Old: Black #0D0D0D + Gold #C9A84C
#  New: Emerald Ivory
#         Deep green-black  #0D1512   (bg)
#         Card green-black  #16211C
#         Emerald           #2F9E6E   (primary accent, was gold)
#         Emerald light     #4FBE94   (hover accent, was gold-light)
#         Ivory             #F2EDE4   (text — unchanged, already neutral)
#
#  Run from your project ROOT:
#    bash color-patch-emerald.sh
# ─────────────────────────────────────────────────────────────────

echo "🎨 Patching FashionOS palette → Emerald Ivory..."

FILES=$(find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \))

for f in $FILES; do

  # ── Primary accent (gold → emerald) ────────────────────────────
  sed -i "s/#C9A84C/#2F9E6E/g" "$f"
  sed -i "s/#c9a84c/#2f9e6e/g" "$f"
  sed -i "s/#D4A87A/#4FBE94/g" "$f"
  sed -i "s/#d4a87a/#4fbe94/g" "$f"

  # ── Gold RGB triplet → Emerald RGB triplet (covers every rgba() opacity variant) ─
  sed -i "s/201,168,76/47,158,110/g"   "$f"
  sed -i "s/201, 168, 76/47, 158, 110/g" "$f"

  # ── Light-mode accent (dark gold → dark emerald) ────────────────
  sed -i "s/#8B6914/#1F7A52/g" "$f"
  sed -i "s/#8b6914/#1f7a52/g" "$f"
  sed -i "s/#A0792A/#26935F/g" "$f"
  sed -i "s/#a0792a/#26935f/g" "$f"
  sed -i "s/139,105,20/31,122,82/g" "$f"
  sed -i "s/139, 105, 20/31, 122, 82/g" "$f"

  # ── Dark-mode backgrounds (black → deep green-black) ────────────
  sed -i "s/#0D0D0D/#0D1512/g" "$f"
  sed -i "s/#0d0d0d/#0d1512/g" "$f"
  sed -i "s/#111111/#131F1A/g" "$f"
  sed -i "s/#1A1A1A/#16211C/g" "$f"
  sed -i "s/#1a1a1a/#16211c/g" "$f"
  sed -i "s/#151515/#121A16/g" "$f"
  sed -i "s/#0A0A0A/#0B1310/g" "$f"
  sed -i "s/#0a0a0a/#0b1310/g" "$f"
  sed -i "s/#0f0f0f/#111A15/g" "$f"
  sed -i "s/#0F0F0F/#111A15/g" "$f"
  sed -i "s/#141414/#14201B/g" "$f"
  sed -i "s/#080808/#081410/g" "$f"

  # ── Navbar backdrop rgba(10,10,10,x) → rgba(11,19,16,x) ─────────
  sed -i "s/10, 10, 10,/11, 19, 16,/g" "$f"
  sed -i "s/10,10,10,/11,19,16,/g" "$f"

  # ── Misc near-black overlay tints used in LandingNoir sections ──
  sed -i "s/12, 12, 12,/13, 21, 18,/g" "$f"
  sed -i "s/12,12,12,/13,21,18,/g" "$f"
  sed -i "s/15, 15, 15,/16, 24, 20,/g" "$f"
  sed -i "s/15,15,15,/16,24,20,/g" "$f"

  # ── Light-mode backgrounds (warm cream → soft mint-ivory) ───────
  sed -i "s/#F5F0E8/#EEF5F0/g" "$f"
  sed -i "s/#EDE5D4/#DDEEE4/g" "$f"
  sed -i "s/#E5DCC8/#CFE6D8/g" "$f"

  # ── Light-mode text (brown/gold-tinted → green-neutral) ─────────
  sed -i "s/#1A1204/#0F1D16/g" "$f"
  sed -i "s/#5C4A1E/#3D5A4C/g" "$f"
  sed -i "s/#8A7040/#6B8577/g" "$f"
  sed -i "s/#2E2008/#16241D/g" "$f"
  sed -i "s/#6B5020/#4A6B58/g" "$f"

done

echo ""
echo "✅  Done! Palette applied across all src files."
echo ""
echo "   Deep green-black  #0D1512  (page bg, dark mode)"
echo "   Emerald           #2F9E6E  (accent — was gold)"
echo "   Ivory             #F2EDE4  (text — unchanged)"
echo ""
echo "📌  Variable/constant NAMES (--gold, GOLD, --teal, GOLD_DIM, etc.) were"
echo "    left as-is — only their color VALUES changed. Same approach as your"
echo "    original color-patch.sh. Harmless, just cosmetic tech debt if it bugs you."
echo ""
echo "🚀  Restart dev server:  npm run dev"