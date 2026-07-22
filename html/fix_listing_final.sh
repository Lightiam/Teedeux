#!/bin/bash

# Fix anchor tags with href attributes
sed -i 's/<a href="\([^"]*\)">\([^<]*\)<\/button>/<button onclick="window.location.href=\x27\1\x27;">\2<\/button>/g' listing.html

# Fix anchor tags with class attributes
sed -i 's/<a class="\([^"]*\)" href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" onclick="window.location.href=\x27\2\x27;">\3<\/button>/g' listing.html

# Fix anchor tags with both class and other attributes
sed -i 's/<a class="\([^"]*\)" \([^>]*\) href="\([^"]*\)">\([^<]*\)<\/button>/<button class="\1" \2 onclick="window.location.href=\x27\3\x27;">\4<\/button>/g' listing.html

echo "Listing HTML final anchor tags fixed."
