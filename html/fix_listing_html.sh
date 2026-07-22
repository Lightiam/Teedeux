#!/bin/bash

# Fix the back button at the top
sed -i '19s/<a href="index.html" class="text-white"><i class="bi bi-arrow-left fs-5"><\/i><\/a>/<button onclick="window.location.href='\''index.html'\'';" class="text-white border-0 bg-transparent p-0"><i class="bi bi-arrow-left fs-5"><\/i><\/button>/g' listing.html

# Fix the search button in the mobile view
sed -i '53s/<a href="#" class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/a>/<button class="btn btn-danger rounded-pill me-1"><i class="icofont-search me-1"><\/i> Search<\/button>/g' listing.html

# Fix the location button
sed -i '57s/<a href="#" class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100" data-bs-toggle="offcanvas" data-bs-target="#location" aria-controls="location">/<button class="link-dark osahan-location text-decoration-none d-flex align-items-center gap-2 text-start flex-shrink-0 w-100 border-0 bg-transparent p-0" data-bs-toggle="offcanvas" data-bs-target="#location" aria-controls="location">/g' listing.html
sed -i '63s/<\/a>/<\/button>/g' listing.html

# Fix the All Departments button
sed -i '67s/<a class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse"/<button class="btn btn-danger d-flex align-items-center rounded-pill w-100" data-bs-toggle="collapse"/g' listing.html
sed -i '70s/<\/a>/<\/button>/g' listing.html

# Fix the dropdown menu items
sed -i '76s/<li><a class="dropdown-item" href="listing.html">Dairy, Bread & Eggs<\/a><\/li>/<li><button class="dropdown-item border-0 bg-transparent w-100 text-start" onclick="window.location.href='\''listing.html'\'';">Dairy, Bread & Eggs<\/button><\/li>/g' listing.html

echo "Listing HTML syntax errors fixed."
