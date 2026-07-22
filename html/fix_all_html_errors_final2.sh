#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups_final_all2
find . -name "*.html" -exec cp {} backups_final_all2/ \;

echo "Fixing all remaining HTML syntax errors in all files..."

# Fix anchor tags with href attributes
find . -name "*.html" -exec sed -i 's/<a href="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;" class="border-0 bg-transparent p-0">\2<\/button>/g' {} \;

# Fix anchor tags with class attributes
find . -name "*.html" -exec sed -i 's/<a class="\([^"]*\)" href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" onclick="window.location.href=\x27\2\x27;" class="border-0 bg-transparent p-0">\3<\/button>/g' {} \;

# Fix anchor tags with both class and other attributes
find . -name "*.html" -exec sed -i 's/<a class="\([^"]*\)" \([^>]*\) href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" \2 onclick="window.location.href=\x27\3\x27;" class="border-0 bg-transparent p-0">\4<\/button>/g' {} \;

# Fix back buttons
find . -name "*.html" -exec sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/a>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' {} \;
find . -name "*.html" -exec sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' {} \;

# Fix navbar brands
find . -name "*.html" -exec sed -i 's/<a class="navbar-brand m-0 d-lg-block flex-shrink-0" href="index.html">/<button class="navbar-brand m-0 d-lg-block flex-shrink-0 border-0 bg-transparent p-0" onclick="window.location.href=\x27index.html\x27;">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a class="navbar-brand m-0 d-lg-block flex-shrink-0" href="index.html"><\/a>/<button class="navbar-brand m-0 d-lg-block flex-shrink-0 border-0 bg-transparent p-0" onclick="window.location.href=\x27index.html\x27;"><\/button>/g' {} \;

# Fix dropdown toggles
find . -name "*.html" -exec sed -i 's/<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown"/g' {} \;

# Fix product image links
find . -name "*.html" -exec sed -i 's/<a href="product-detail.html"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/a>/<button onclick="window.location.href=\x27product-detail.html\x27;" class="border-0 bg-transparent p-0"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/g' {} \;
find . -name "*.html" -exec sed -i 's/<a href="product-detail.html"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/<button onclick="window.location.href=\x27product-detail.html\x27;" class="border-0 bg-transparent p-0"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/g' {} \;

# Fix dropdown menu items
find . -name "*.html" -exec sed -i 's/<a class="dropdown-item dropdown-list-group-item dropdown-toggle" href="#">/<button class="dropdown-item dropdown-list-group-item dropdown-toggle border-0 bg-transparent w-100 text-start">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a class="dropdown-item" href="\([^"]*\)">\([^<]*\)<\/a>/<button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' {} \;
find . -name "*.html" -exec sed -i 's/<a class="dropdown-item" href="\([^"]*\)">\([^<]*\)<\/button>/<button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' {} \;

# Fix remaining anchor tags with href="#"
find . -name "*.html" -exec sed -i 's/<a href="#" \([^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a \([^>]*\) href="#" \([^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' {} \;

# Fix remaining </a> tags
find . -name "*.html" -exec sed -i 's/<\/a>/<\/button>/g' {} \;

# Fix remaining aria attributes
find . -name "*.html" -exec sed -i 's/ aria-label="Close"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-expanded="false"//g' {} \;
find . -name "*.html" -exec sed -i 's/ aria-controls="[^"]*"//g' {} \;

# Fix role="button" attributes
find . -name "*.html" -exec sed -i 's/ role="button"//g' {} \;

echo "All remaining HTML syntax errors fixed in all files."
