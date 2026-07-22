#!/bin/bash

# Make a backup of listing.html
cp listing.html listing.html.bak_specific

echo "Fixing specific HTML syntax errors in listing.html..."

# Fix nested ul/li elements
sed -i 's/<ul class="mb-0 list-unstyled"><li>/<ul class="mb-0 list-unstyled">\n<li>/g' listing.html
sed -i 's/<\/li><\/ul>/<\/li>\n<\/ul>/g' listing.html

# Fix dropdown toggles with proper nesting
sed -i 's/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown">/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown">/g' listing.html

# Fix remaining anchor tags with href attributes
sed -i 's/<a href="\([^"]*\)" class="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;" class="\2 border-0 bg-transparent p-0">\3<\/button>/g' listing.html

# Fix remaining anchor tags in the footer
sed -i 's/<a href="\([^"]*\)" class="link-dark text-center col py-2 p-1">/<button onclick="window.location.href=\x27\1\x27;" class="link-dark text-center col py-2 p-1 border-0 bg-transparent">/g' listing.html
sed -i 's/<a href="\([^"]*\)" class="text-muted text-center col py-2 p-1">/<button onclick="window.location.href=\x27\1\x27;" class="text-muted text-center col py-2 p-1 border-0 bg-transparent">/g' listing.html

echo "Specific HTML syntax errors fixed in listing.html."
