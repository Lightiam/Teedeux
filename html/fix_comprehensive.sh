#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups
find . -name "*.html" -exec cp {} backups/ \;

echo "Fixing HTML syntax errors in all files..."

# Fix anchor elements used as buttons with href="#"
echo "Fixing anchor elements used as buttons..."
find . -name "*.html" -exec sed -i 's/<a href="#" \([^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a \([^>]*\) href="#" \([^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' {} \;

# Fix type="button" attributes
echo "Removing type=\"button\" attributes..."
find . -name "*.html" -exec sed -i 's/ type="button"//g' {} \;

# Fix aria attributes
echo "Fixing aria attributes..."
find . -name "*.html" -exec sed -i 's/ aria-label="Close"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-expanded="false"//g' {} \;

# Fix search buttons
echo "Fixing search buttons..."
find . -name "*.html" -exec sed -i 's/<a href="#" class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/a>/<button class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/button>/g' {} \;

# Fix the back button at the top
echo "Fixing back buttons..."
find . -name "*.html" -exec sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/a>/<button onclick="window.location.href='\''index.html'\'';" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' {} \;

# Fix the location button
echo "Fixing location buttons..."
find . -name "*.html" -exec sed -i 's/<a href="#" class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100" data-bs-toggle="offcanvas" data-bs-target="#location" aria-controls="location">/<button class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100 border-0 bg-transparent p-0" data-bs-toggle="offcanvas" data-bs-target="#location">/g' {} \;

# Fix the All Departments button
echo "Fixing department buttons..."
find . -name "*.html" -exec sed -i 's/<a class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse"/<button class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse"/g' {} \;

echo "HTML syntax errors fixed in all files."
