#!/bin/bash

# Script to fix common HTML syntax errors in all HTML files

# Fix anchor elements used as buttons
find . -name "*.html" -exec sed -i 's/<a href="#" \(data-bs-toggle="offcanvas"[^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a \(class="[^"]*"\) href="#" \(data-bs-toggle="offcanvas"[^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' {} \;

# Fix button elements with type="button" attribute
find . -name "*.html" -exec sed -i 's/type="button"//g' {} \;

# Fix search buttons
find . -name "*.html" -exec sed -i 's/<a href="#" class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/a>/<button class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/button>/g' {} \;

# Fix dropdown menu items
find . -name "*.html" -exec sed -i 's/<li><a class="dropdown-item" href="listing.html">\([^<]*\)<\/a><\/li>/<li><button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href='\''listing.html'\'';">\1<\/button><\/li>/g' {} \;

# Fix closing anchor tags
find . -name "*.html" -exec sed -i 's/<\/a>/<\/button>/g' {} \;

echo "HTML syntax errors fixed in all files."
