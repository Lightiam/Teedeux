#!/bin/bash

# Replace all instances of "Eatreal" with "Teedeux" in JavaScript files
find . -name "*.js" -exec sed -i 's/Eatreal/Teedeux/g' {} \;

# Update template name and author information
find . -name "*.js" -exec sed -i 's/Template Name: .*/Template Name: Teedeux - African Food Vendor Mobile Template/g' {} \;
find . -name "*.js" -exec sed -i 's/Author: .*/Author: Teedeux Team/g' {} \;

# Replace grocery and supermarket references
find . -name "*.js" -exec sed -i 's/grocery/African food/g' {} \;
find . -name "*.js" -exec sed -i 's/Grocery/African Food/g' {} \;
find . -name "*.js" -exec sed -i 's/supermarket/marketplace/g' {} \;
find . -name "*.js" -exec sed -i 's/Supermarket/Marketplace/g' {} \;
