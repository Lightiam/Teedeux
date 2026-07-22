#!/bin/bash

# Update product categories to reflect Nigerian cuisine
# Replace generic food categories with Nigerian cuisine categories

# 1. Jollof Rice and other rice dishes
find . -name "*.html" -exec sed -i 's/Vegetables & Fruits/Jollof Rice \& Rice Dishes/g' {} \;

# 2. Soups and Stews
find . -name "*.html" -exec sed -i 's/Breakfast & Dairy/Soups \& Stews/g' {} \;

# 3. Meat dishes
find . -name "*.html" -exec sed -i 's/Meat & Seafood/Nigerian Meat Dishes/g' {} \;

# 4. Snacks and Street Food
find . -name "*.html" -exec sed -i 's/Snacks/Nigerian Snacks \& Street Food/g' {} \;

# 5. Swallows
find . -name "*.html" -exec sed -i 's/Bakery/Swallows \& Fufu/g' {} \;

# 6. Seafood dishes
find . -name "*.html" -exec sed -i 's/Frozen Foods/Nigerian Seafood Dishes/g' {} \;

# 7. Traditional breakfast items
find . -name "*.html" -exec sed -i 's/Beverages/Traditional Nigerian Breakfast/g' {} \;

# 8. Beverages
find . -name "*.html" -exec sed -i 's/Alcohol/Nigerian Beverages/g' {} \;

# Update product descriptions and pricing
find . -name "*.html" -exec sed -i 's/Fresh Organic Tomato/Authentic Jollof Rice/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Cucumber/Egusi Soup/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Carrot/Suya Skewers/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Capsicum/Puff-Puff/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Potato/Pounded Yam/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Onion/Catfish Pepper Soup/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Ginger/Akara Breakfast/g' {} \;
find . -name "*.html" -exec sed -i 's/Fresh Organic Garlic/Zobo Drink/g' {} \;

# Update pricing to reflect Nigerian cuisine pricing
find . -name "*.html" -exec sed -i 's/\$1.99/\$12.99/g' {} \;
find . -name "*.html" -exec sed -i 's/\$2.99/\$14.99/g' {} \;
find . -name "*.html" -exec sed -i 's/\$3.99/\$16.99/g' {} \;
find . -name "*.html" -exec sed -i 's/\$4.99/\$18.99/g' {} \;
find . -name "*.html" -exec sed -i 's/\$5.99/\$20.99/g' {} \;
