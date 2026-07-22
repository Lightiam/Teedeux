#!/bin/bash

# Update store-single.html to focus on African food vendors
# Add verification badges for trusted vendors
# Include vendor ratings and reviews

# Update the vendor profile header
sed -i 's/E-Grocery Super Market/Nigerian Cuisine Vendor/g' store-single.html
sed -i 's/100% satisfaction guarantee/Authentic Nigerian cuisine/g' store-single.html

# Add verification badge
sed -i '/<p class="text-white-50 small m-0">Authentic Nigerian cuisine/s/$/ <i class="bi bi-patch-check-fill text-warning ms-1"></i> Verified Authentic Vendor/g' store-single.html

# Update vendor information section
sed -i '/<div class="p-3 bg-white shadow-sm rounded-4 mb-3">/,/<\/div>/c\
      <div class="p-3 bg-white shadow-sm rounded-4 mb-3">\
         <div class="d-flex align-items-center gap-3">\
            <img src="img/vendor/nigerian-vendor.jpg" class="img-fluid rounded-circle" alt="Vendor" style="width: 60px; height: 60px; object-fit: cover;">\
            <div>\
               <h6 class="fw-bold text-dark mb-0">Mama\'s Nigerian Kitchen</h6>\
               <div class="d-flex align-items-center gap-2">\
                  <span class="badge bg-success"><i class="bi bi-patch-check-fill"></i> Verified</span>\
                  <span class="badge bg-primary">Top Rated</span>\
                  <span class="badge bg-warning text-dark">Featured</span>\
               </div>\
               <p class="text-muted small mb-0">Serving authentic Nigerian cuisine since 2010</p>\
            </div>\
         </div>\
         <hr>\
         <div class="row text-center">\
            <div class="col-4">\
               <p class="fw-bold text-dark mb-0">4.8 <i class="bi bi-star-fill text-warning"></i></p>\
               <p class="text-muted small mb-0">Rating</p>\
            </div>\
            <div class="col-4">\
               <p class="fw-bold text-dark mb-0">1,250+</p>\
               <p class="text-muted small mb-0">Orders</p>\
            </div>\
            <div class="col-4">\
               <p class="fw-bold text-dark mb-0">98%</p>\
               <p class="text-muted small mb-0">Satisfaction</p>\
            </div>\
         </div>\
      </div>' store-single.html

# Add vendor verification information
sed -i '/<div class="p-3 bg-white shadow-sm rounded-4 mb-3">/a\
      <div class="p-3 bg-white shadow-sm rounded-4 mb-3">\
         <h6 class="fw-bold text-dark mb-3">Vendor Verification</h6>\
         <div class="d-flex align-items-center gap-2 mb-2">\
            <i class="bi bi-check-circle-fill text-success"></i>\
            <p class="mb-0">Identity Verified</p>\
         </div>\
         <div class="d-flex align-items-center gap-2 mb-2">\
            <i class="bi bi-check-circle-fill text-success"></i>\
            <p class="mb-0">Food Safety Certified</p>\
         </div>\
         <div class="d-flex align-items-center gap-2 mb-2">\
            <i class="bi bi-check-circle-fill text-success"></i>\
            <p class="mb-0">Authenticity Guaranteed</p>\
         </div>\
         <div class="d-flex align-items-center gap-2 mb-2">\
            <i class="bi bi-check-circle-fill text-success"></i>\
            <p class="mb-0">Export License Verified</p>\
         </div>\
         <div class="d-flex align-items-center gap-2">\
            <i class="bi bi-check-circle-fill text-success"></i>\
            <p class="mb-0">Quality Control Approved</p>\
         </div>\
      </div>' store-single.html

# Add vendor ratings and reviews
sed -i '/<div class="p-3 bg-white shadow-sm rounded-4 mb-3">/a\
      <div class="p-3 bg-white shadow-sm rounded-4 mb-3">\
         <h6 class="fw-bold text-dark mb-3">Customer Reviews</h6>\
         <div class="mb-3">\
            <div class="d-flex align-items-center gap-2 mb-2">\
               <img src="img/user/user1.jpg" class="img-fluid rounded-circle" alt="User" style="width: 40px; height: 40px; object-fit: cover;">\
               <div>\
                  <h6 class="fw-bold text-dark mb-0">John D.</h6>\
                  <div class="d-flex align-items-center">\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <span class="text-muted small ms-2">1 month ago</span>\
                  </div>\
               </div>\
            </div>\
            <p class="mb-0">The Jollof rice was absolutely delicious! Authentic taste that reminded me of home. Fast shipping and great packaging.</p>\
         </div>\
         <hr>\
         <div class="mb-3">\
            <div class="d-flex align-items-center gap-2 mb-2">\
               <img src="img/user/user2.jpg" class="img-fluid rounded-circle" alt="User" style="width: 40px; height: 40px; object-fit: cover;">\
               <div>\
                  <h6 class="fw-bold text-dark mb-0">Sarah M.</h6>\
                  <div class="d-flex align-items-center">\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star text-warning"></i>\
                     <span class="text-muted small ms-2">2 months ago</span>\
                  </div>\
               </div>\
            </div>\
            <p class="mb-0">Ordered the Egusi soup and pounded yam. The flavors were spot on! Will definitely order again.</p>\
         </div>\
         <hr>\
         <div>\
            <div class="d-flex align-items-center gap-2 mb-2">\
               <img src="img/user/user3.jpg" class="img-fluid rounded-circle" alt="User" style="width: 40px; height: 40px; object-fit: cover;">\
               <div>\
                  <h6 class="fw-bold text-dark mb-0">Michael O.</h6>\
                  <div class="d-flex align-items-center">\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-fill text-warning"></i>\
                     <i class="bi bi-star-half text-warning"></i>\
                     <span class="text-muted small ms-2">3 months ago</span>\
                  </div>\
               </div>\
            </div>\
            <p class="mb-0">The Suya skewers were amazing! Perfectly spiced and the meat was tender. Shipping was fast and everything arrived in good condition.</p>\
         </div>\
         <div class="d-grid gap-2 mt-3">\
            <button class="btn btn-outline-primary" type="button">View All Reviews</button>\
         </div>\
      </div>' store-single.html

# Create directories for vendor and user images
mkdir -p img/vendor
mkdir -p img/user

# Create placeholder images for vendors and users
# Since we can't create actual images, we'll create placeholders
echo "Creating placeholder for vendor image..."
convert -size 200x200 xc:#006400 -fill white -gravity center -pointsize 20 -font Arial-Bold -annotate 0 "Nigerian\nVendor" img/vendor/nigerian-vendor.jpg

echo "Creating placeholder for user images..."
convert -size 100x100 xc:#D2691E -fill white -gravity center -pointsize 16 -font Arial-Bold -annotate 0 "User 1" img/user/user1.jpg
convert -size 100x100 xc:#8B4513 -fill white -gravity center -pointsize 16 -font Arial-Bold -annotate 0 "User 2" img/user/user2.jpg
convert -size 100x100 xc:#FFD700 -fill white -gravity center -pointsize 16 -font Arial-Bold -annotate 0 "User 3" img/user/user3.jpg

# Update store-list.html and store-grid.html to include verification badges
sed -i 's/<span class="badge bg-success">/<span class="badge bg-success"><i class="bi bi-patch-check-fill"><\/i> Verified<\/span><span class="badge bg-warning ms-1">/g' store-list.html
sed -i 's/<span class="badge bg-success">/<span class="badge bg-success"><i class="bi bi-patch-check-fill"><\/i> Verified<\/span><span class="badge bg-warning ms-1">/g' store-grid.html

# Update vendor names to reflect Nigerian cuisine vendors
sed -i 's/Grocery World/Mama\'s Nigerian Kitchen/g' store-list.html
sed -i 's/Grocery Mart/Lagos Flavors/g' store-list.html
sed -i 's/Super Store/Naija Delicacies/g' store-list.html
sed -i 's/Fresh Market/Abuja Cuisine/g' store-list.html
sed -i 's/Grocery World/Mama\'s Nigerian Kitchen/g' store-grid.html
sed -i 's/Grocery Mart/Lagos Flavors/g' store-grid.html
sed -i 's/Super Store/Naija Delicacies/g' store-grid.html
sed -i 's/Fresh Market/Abuja Cuisine/g' store-grid.html

# Update vendor descriptions
sed -i 's/Lorem ipsum dolor sit amet, consectetur adipiscing elit./Authentic Nigerian cuisine delivered worldwide. Specializing in traditional recipes and flavors./g' store-list.html
sed -i 's/Lorem ipsum dolor sit amet, consectetur adipiscing elit./Authentic Nigerian cuisine delivered worldwide. Specializing in traditional recipes and flavors./g' store-grid.html
