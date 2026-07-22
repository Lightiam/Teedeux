#!/bin/bash

# Make a backup of listing.html
cp listing.html listing.html.bak_final2

echo "Fixing HTML syntax errors in listing.html..."

# Fix nested elements and ensure proper closing tags
sed -i 's/<button\([^>]*\)><\/button>/<button\1><\/button>/g' listing.html

# Fix dropdown menu structure
sed -i 's/<ul class="dropdown-menu"><li>/<ul class="dropdown-menu">\n<li>/g' listing.html
sed -i 's/<\/li><\/ul>/<\/li>\n<\/ul>/g' listing.html

# Fix nested dropdown menus
sed -i 's/<ul class="submenu list-unstyled ms-4"><li>/<ul class="submenu list-unstyled ms-4">\n<li>/g' listing.html

# Fix remaining anchor tags
sed -i 's/<a\([^>]*\)>/<button\1>/g' listing.html
sed -i 's/<\/a>/<\/button>/g' listing.html

# Fix data-bs-toggle attributes
sed -i 's/data-bs-toggle="dropdown"/data-bs-toggle="dropdown" aria-expanded="false"/g' listing.html

# Fix nested elements in the card-body
sed -i 's/<div class="card card-body"><ul/<div class="card card-body">\n<ul/g' listing.html

echo "HTML syntax errors fixed in listing.html."
