#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups_all
find . -name "*.html" -exec cp {} backups_all/ \;

echo "Fixing HTML syntax errors in all files..."

# Fix nested elements and ensure proper closing tags
find . -name "*.html" -exec sed -i 's/<button\([^>]*\)><\/button>/<button\1><\/button>/g' {} \;

# Fix dropdown menu structure
find . -name "*.html" -exec sed -i 's/<ul class="dropdown-menu"><li>/<ul class="dropdown-menu">\n<li>/g' {} \;
find . -name "*.html" -exec sed -i 's/<\/li><\/ul>/<\/li>\n<\/ul>/g' {} \;

# Fix nested dropdown menus
find . -name "*.html" -exec sed -i 's/<ul class="submenu list-unstyled ms-4"><li>/<ul class="submenu list-unstyled ms-4">\n<li>/g' {} \;

# Fix remaining anchor tags
find . -name "*.html" -exec sed -i 's/<a\([^>]*\)>/<button\1>/g' {} \;
find . -name "*.html" -exec sed -i 's/<\/a>/<\/button>/g' {} \;

echo "HTML syntax errors fixed in all files."
