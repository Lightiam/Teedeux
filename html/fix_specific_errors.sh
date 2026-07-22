#!/bin/bash

# Make a backup of all HTML files
mkdir -p backups_specific
find . -name "*.html" -exec cp {} backups_specific/ \;

echo "Fixing specific HTML syntax errors in all files..."

# Fix nested ul/li elements
find . -name "*.html" -exec sed -i 's/<ul class="mb-0 list-unstyled"><li>/<ul class="mb-0 list-unstyled">\n<li>/g' {} \;
find . -name "*.html" -exec sed -i 's/<\/li><\/ul>/<\/li>\n<\/ul>/g' {} \;

# Fix dropdown toggles with proper nesting
find . -name "*.html" -exec sed -i 's/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown">/<button class="nav-link dropdown-toggle border-0 bg-transparent" data-bs-toggle="dropdown">/g' {} \;

# Fix remaining anchor tags with href attributes
find . -name "*.html" -exec sed -i 's/<a href="\([^"]*\)" class="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;" class="\2 border-0 bg-transparent p-0">\3<\/button>/g' {} \;

# Fix remaining anchor tags in the footer
find . -name "*.html" -exec sed -i 's/<a href="\([^"]*\)" class="link-dark text-center col py-2 p-1">/<button onclick="window.location.href=\x27\1\x27;" class="link-dark text-center col py-2 p-1 border-0 bg-transparent">/g' {} \;
find . -name "*.html" -exec sed -i 's/<a href="\([^"]*\)" class="text-muted text-center col py-2 p-1">/<button onclick="window.location.href=\x27\1\x27;" class="text-muted text-center col py-2 p-1 border-0 bg-transparent">/g' {} \;

# Fix remaining </a> tags
find . -name "*.html" -exec sed -i 's/<\/a>/<\/button>/g' {} \;

echo "Specific HTML syntax errors fixed in all files."
