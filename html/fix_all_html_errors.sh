#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups_all
find . -name "*.html" -exec cp {} backups_all/ \;

echo "Fixing all HTML syntax errors in all files..."

# Fix type="button" attributes
echo "Removing type=\"button\" attributes..."
find . -name "*.html" -exec sed -i 's/ type="button"//g' {} \;

# Fix aria attributes
echo "Fixing aria attributes..."
find . -name "*.html" -exec sed -i 's/ aria-label="Close"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-expanded="false"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-controls="[^"]*"//g' {} \;

# Fix button elements in all files
echo "Fixing button elements..."
find . -name "*.html" -exec sed -i 's/<button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"><\/button>/<button class="btn-close" data-bs-dismiss="offcanvas"><\/button>/g' {} \;
find . -name "*.html" -exec sed -i 's/<button class="btn-close float-end shadow-none" data-bs-dismiss="modal" aria-label="Close"><\/button>/<button class="btn-close float-end shadow-none" data-bs-dismiss="modal"><\/button>/g' {} \;

# Fix input elements
echo "Fixing input elements..."
find . -name "*.html" -exec sed -i 's/<input type="button" value="-" class="button-minus btn btn-light btn-sm border-end col" data-field="quantity">/<input value="-" class="button-minus btn btn-light btn-sm border-end col" data-field="quantity">/g' {} \;
find . -name "*.html" -exec sed -i 's/<input type="button" value="+" class="button-plus btn btn-light btn-sm border-start col" data-field="quantity">/<input value="+" class="button-plus btn btn-light btn-sm border-start col" data-field="quantity">/g' {} \;

# Fix anchor elements with href="#" that should be buttons
echo "Fixing anchor elements with href=\"#\"..."
find . -name "*.html" -exec sed -i 's/<a href="#" \([^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a \([^>]*\) href="#" \([^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' {} \;

# Fix the toggle navigation button
echo "Fixing toggle navigation button..."
find . -name "*.html" -exec sed -i 's/<a class="toggle hc-nav-trigger hc-nav-1" href="#" data-bs-toggle="offcanvas" data-bs-target="#navbar-default" aria-controls="navbar-default" aria-expanded="false" aria-label="Toggle navigation" >/<button class="toggle hc-nav-trigger hc-nav-1 border-0 bg-transparent p-0" data-bs-toggle="offcanvas" data-bs-target="#navbar-default">/g' {} \;

# Fix the search button in the mobile view
echo "Fixing search buttons..."
find . -name "*.html" -exec sed -i 's/<a href="#" class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/a>/<button class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/button>/g' {} \;

# Fix the location button
echo "Fixing location buttons..."
find . -name "*.html" -exec sed -i 's/<a href="#" class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100" data-bs-toggle="offcanvas" data-bs-target="#location" aria-controls="location">/<button class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100 border-0 bg-transparent p-0" data-bs-toggle="offcanvas" data-bs-target="#location">/g' {} \;

# Fix the All Departments button
echo "Fixing department buttons..."
find . -name "*.html" -exec sed -i 's/<a class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">/<button class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse" data-bs-target="#collapseExample">/g' {} \;

echo "All HTML syntax errors fixed in all files."
