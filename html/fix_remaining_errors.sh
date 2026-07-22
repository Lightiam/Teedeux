#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups_final
find . -name "*.html" -exec cp {} backups_final/ \;

echo "Fixing remaining HTML syntax errors in all files..."

# Fix anchor elements with href="#" that should be buttons
echo "Fixing anchor elements with href=\"#\"..."
find . -name "*.html" -exec sed -i 's/<a href="#" \([^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a \([^>]*\) href="#" \([^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' {} \;

# Fix dropdown menu items
echo "Fixing dropdown menu items..."
find . -name "*.html" -exec sed -i 's/<li><a class="dropdown-item" href="\([^"]*\)">\([^<]*\)<\/a><\/li>/<li><button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href=\x27\1\x27;">\2<\/button><\/li>/g' {} \;

# Fix back buttons
echo "Fixing back buttons..."
find . -name "*.html" -exec sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/a>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' {} \;

# Fix navigation links
echo "Fixing navigation links..."
find . -name "*.html" -exec sed -i 's/<a class="nav-link" href="\([^"]*\)">\([^<]*\)<\/a>/<button class="nav-link border-0 bg-transparent" onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' {} \;

# Fix remaining anchor tags
echo "Fixing remaining anchor tags..."
find . -name "*.html" -exec sed -i 's/<a class="btn btn-\([^"]*\)" href="\([^"]*\)">\([^<]*\)<\/a>/<button class="btn btn-\1" onclick="window.location.href=\x27\2\x27;">\3<\/button>/g' {} \;

echo "Remaining HTML syntax errors fixed in all files."
