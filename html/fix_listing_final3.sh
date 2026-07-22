#!/bin/bash

# Make a backup of listing.html
cp listing.html listing.html.bak3

# Fix anchor tags with href attributes that were incorrectly closed with </button>
sed -i 's/<a href="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;" class="border-0 bg-transparent p-0">\2<\/button>/g' listing.html

# Fix the back button at the top
sed -i '19s/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/<button onclick="window.location.href=\x27index.html\x27;" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' listing.html

# Fix the navbar brand
sed -i '44s/<a class="navbar-brand m-0 d-lg-block flex-shrink-0" href="index.html">/<button class="navbar-brand m-0 d-lg-block flex-shrink-0 border-0 bg-transparent p-0" onclick="window.location.href=\x27index.html\x27;">/g' listing.html
sed -i '44s/<\/a>/<\/button>/g' listing.html

# Fix dropdown toggles
sed -i 's/<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown"/g' listing.html
sed -i 's/<\/a><\/li>/<\/button><\/li>/g' listing.html

# Fix product image links
sed -i 's/<a href="product-detail.html"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/<button onclick="window.location.href=\x27product-detail.html\x27;" class="border-0 bg-transparent p-0"><img src="img\/list\/[^"]*" alt="" class="card-img-top"><\/button>/g' listing.html

# Fix dropdown menu items
sed -i 's/<a class="dropdown-item dropdown-list-group-item dropdown-toggle" href="#">/<button class="dropdown-item dropdown-list-group-item dropdown-toggle border-0 bg-transparent w-100 text-start">/g' listing.html

echo "Listing HTML final anchor tags fixed."
