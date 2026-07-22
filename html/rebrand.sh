#!/bin/bash

# Replace all instances of "Eatreal" with "Teedeux"
find . -name "*.html" -exec sed -i 's/Eatreal/Teedeux/g' {} \;

# Replace all instances of "grocery" with "African food"
find . -name "*.html" -exec sed -i 's/grocery/African food/g' {} \;
find . -name "*.html" -exec sed -i 's/Grocery/African Food/g' {} \;

# Replace all instances of "supermarket" with "marketplace"
find . -name "*.html" -exec sed -i 's/supermarket/marketplace/g' {} \;
find . -name "*.html" -exec sed -i 's/Supermarket/Marketplace/g' {} \;

# Update meta descriptions and keywords for SEO
find . -name "*.html" -exec sed -i 's/<meta name="description" content=".*">/<meta name="description" content="Teedeux - Connecting African food vendors with diaspora customers globally. Authentic Nigerian cuisine delivered worldwide.">/g' {} \;
find . -name "*.html" -exec sed -i 's/<meta name="keywords" content=".*">/<meta name="keywords" content="African food, Nigerian cuisine, diaspora, international shipping, authentic food, cultural connection, jollof rice, egusi soup, suya, pounded yam">/g' {} \;

# Update page titles
find . -name "*.html" -exec sed -i 's/<title>.*<\/title>/<title>Teedeux - African Food Vendor Marketplace<\/title>/g' {} \;

# Update copyright information
find . -name "*.html" -exec sed -i 's/Copyright © [0-9]\{4\} Eatreal. All Rights Reserved/Copyright © 2025 Teedeux. All Rights Reserved/g' {} \;
