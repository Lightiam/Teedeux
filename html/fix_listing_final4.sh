#!/bin/bash

# Make a backup of listing.html
cp listing.html listing.html.bak4

# Fix anchor tags with href attributes
sed -i 's/<a href="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;" class="border-0 bg-transparent p-0">\2<\/button>/g' listing.html

# Fix anchor tags with class attributes
sed -i 's/<a class="\([^"]*\)" href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" onclick="window.location.href=\x27\2\x27;" class="border-0 bg-transparent p-0">\3<\/button>/g' listing.html

# Fix anchor tags with both class and other attributes
sed -i 's/<a class="\([^"]*\)" \([^>]*\) href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" \2 onclick="window.location.href=\x27\3\x27;" class="border-0 bg-transparent p-0">\4<\/button>/g' listing.html

# Fix back buttons
sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/a>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' listing.html
sed -i 's/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' listing.html

# Fix navbar brands
sed -i 's/<a class="navbar-brand m-0 d-lg-block flex-shrink-0" href="index.html">/<button class="navbar-brand m-0 d-lg-block flex-shrink-0 border-0 bg-transparent p-0" onclick="window.location.href=\x27index.html\x27;">/g' listing.html
sed -i 's/<a class="navbar-brand m-0 d-lg-block flex-shrink-0" href="index.html"><\/a>/<button class="navbar-brand m-0 d-lg-block flex-shrink-0 border-0 bg-transparent p-0" onclick="window.location.href=\x27index.html\x27;"><\/button>/g' listing.html

# Fix dropdown toggles
sed -i 's/<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown"/g' listing.html

# Fix product image links
sed -i 's/<a href="product-detail.html"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/a>/<button onclick="window.location.href=\x27product-detail.html\x27;" class="border-0 bg-transparent p-0"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/g' listing.html
sed -i 's/<a href="product-detail.html"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/<button onclick="window.location.href=\x27product-detail.html\x27;" class="border-0 bg-transparent p-0"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/g' listing.html

# Fix dropdown menu items
sed -i 's/<a class="dropdown-item dropdown-list-group-item dropdown-toggle" href="#">/<button class="dropdown-item dropdown-list-group-item dropdown-toggle border-0 bg-transparent w-100 text-start">/g' listing.html
sed -i 's/<a class="dropdown-item" href="\([^"]*\)">\([^<]*\)<\/a>/<button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' listing.html
sed -i 's/<a class="dropdown-item" href="\([^"]*\)">\([^<]*\)<\/button>/<button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' listing.html

# Fix remaining anchor tags with href="#"
sed -i 's/<a href="#" \([^>]*\)>/<button \1 class="border-0 bg-transparent p-0">/g' listing.html
sed -i 's/<a \([^>]*\) href="#" \([^>]*\)>/<button \1 \2 class="border-0 bg-transparent p-0">/g' listing.html

# Fix remaining </a> tags
sed -i 's/<\/a>/<\/button>/g' listing.html

# Fix remaining aria attributes
sed -i 's/ aria-label="Close"//g' listing.html
sed -i 's/ aria-expanded="false"//g' listing.html
sed -i 's/ aria-controls="[^"]*"//g' listing.html

# Fix role="button" attributes
sed -i 's/ role="button"//g' listing.html

echo "Listing HTML final anchor tags fixed."
