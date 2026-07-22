#!/bin/bash

# Find the payment section in the checkout page and replace it with Nigerian payment gateways
sed -i '/<h6 class="fw-bold mb-3">Payment Method<\/h6>/,/<div class="mb-3">/c\
            <h6 class="fw-bold mb-3">Payment Method</h6>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault21" checked>\
                  <label class="form-check-label" for="flexRadioDefault21">\
                  <span class="text-dark fw-bold">Paystack</span><br>\
                  <small class="text-muted">Fast and secure payment</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <img src="img/payment/paystack.png" alt="Paystack" class="img-fluid" style="height: 30px;">\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault22">\
                  <label class="form-check-label" for="flexRadioDefault22">\
                  <span class="text-dark fw-bold">Flutterwave</span><br>\
                  <small class="text-muted">Secure payment for Africa</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <img src="img/payment/flutterwave.png" alt="Flutterwave" class="img-fluid" style="height: 30px;">\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault23">\
                  <label class="form-check-label" for="flexRadioDefault23">\
                  <span class="text-dark fw-bold">Interswitch</span><br>\
                  <small class="text-muted">Nigerian trusted payment</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <img src="img/payment/interswitch.png" alt="Interswitch" class="img-fluid" style="height: 30px;">\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault24">\
                  <label class="form-check-label" for="flexRadioDefault24">\
                  <span class="text-dark fw-bold">Stripe</span><br>\
                  <small class="text-muted">International payments</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <img src="img/payment/stripe.png" alt="Stripe" class="img-fluid" style="height: 30px;">\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault2" id="flexRadioDefault25">\
                  <label class="form-check-label" for="flexRadioDefault25">\
                  <span class="text-dark fw-bold">PayPal</span><br>\
                  <small class="text-muted">Limited functionality in Nigeria</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <img src="img/payment/paypal.png" alt="PayPal" class="img-fluid" style="height: 30px;">\
               </div>\
            </div>\
            <div class="mb-3">' checkout.html

# Create directory for payment gateway logos
mkdir -p img/payment

# Create simple placeholder logos for payment gateways
# Paystack
cat > img/payment/paystack.svg << 'EOF'
<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" fill="#09A5DB" rx="5" ry="5" />
  <text x="60" y="25" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#FFFFFF">Paystack</text>
</svg>
