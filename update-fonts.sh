#!/bin/bash
# Run this from the ROOT of your fashionos-frontend project
# e.g.  bash update-fonts.sh

echo "🎨 Updating FashionOS font references..."

# Replace 'Grape Nuts' (headings) → 'Fascinate Inline'
find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) \
  -exec sed -i "s/'Grape Nuts', cursive/'Fascinate Inline', cursive/g" {} +

# Replace "Grape Nuts" double-quote variant too (some inline styles use double quotes)
find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) \
  -exec sed -i 's/"Grape Nuts", cursive/"Fascinate Inline", cursive/g' {} +

# Replace 'Molle' (body/buttons) → 'Story Script'
find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) \
  -exec sed -i "s/'Molle', cursive/'Story Script', cursive/g" {} +

find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" \) \
  -exec sed -i 's/"Molle", cursive/"Story Script", cursive/g' {} +

echo "✅ Done! Font references updated across all src files."
echo ""
echo "Next steps:"
echo "  1. Replace your index.html  with the provided index.html"
echo "  2. Replace src/index.css    with the provided index.css"
echo "  3. Restart vite dev server: npm run dev"