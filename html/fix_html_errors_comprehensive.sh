#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups
find . -name "*.html" -exec cp {} backups/ \;

echo "Fixing HTML syntax errors in all files..."

# Fix type="button" attributes
echo "Removing type=\"button\" attributes..."
find . -name "*.html" -exec sed -i 's/ type="button"//g' {} \;

# Fix aria attributes
echo "Fixing aria attributes..."
find . -name "*.html" -exec sed -i 's/ aria-label="Close"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-expanded="false"//g' {} \;

# Fix button elements in all files
echo "Fixing button elements..."
find . -name "*.html" -exec sed -i 's/<button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"><\/button>/<button class="btn-close" data-bs-dismiss="offcanvas"><\/button>/g' {} \;
find . -name "*.html" -exec sed -i 's/<button class="btn-close float-end shadow-none" data-bs-dismiss="modal" aria-label="Close"><\/button>/<button class="btn-close float-end shadow-none" data-bs-dismiss="modal"><\/button>/g' {} \;

# Fix input elements
echo "Fixing input elements..."
find . -name "*.html" -exec sed -i 's/<input type="button" value="-" class="button-minus btn btn-light btn-sm border-end col" data-field="quantity">/<input value="-" class="button-minus btn btn-light btn-sm border-end col" data-field="quantity">/g' {} \;
find . -name "*.html" -exec sed -i 's/<input type="button" value="+" class="button-plus btn btn-light btn-sm border-start col" data-field="quantity">/<input value="+" class="button-plus btn btn-light btn-sm border-start col" data-field="quantity">/g' {} \;

echo "HTML syntax errors fixed in all files."
