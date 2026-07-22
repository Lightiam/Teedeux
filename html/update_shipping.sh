#!/bin/bash

# Find the shipping section in the checkout page and replace it with international shipping options
sed -i '/<h6 class="fw-bold mb-3">Shipping Method<\/h6>/,/<div class="mb-3">/c\
            <h6 class="fw-bold mb-3">International Shipping Method</h6>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked>\
                  <label class="form-check-label" for="flexRadioDefault1">\
                  <span class="text-dark fw-bold">DHL Express</span><br>\
                  <small class="text-muted">3-5 business days</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <span class="text-dark fw-bold">$35.99</span>\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">\
                  <label class="form-check-label" for="flexRadioDefault2">\
                  <span class="text-dark fw-bold">FedEx International</span><br>\
                  <small class="text-muted">5-7 business days</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <span class="text-dark fw-bold">$29.99</span>\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">\
                  <label class="form-check-label" for="flexRadioDefault3">\
                  <span class="text-dark fw-bold">UPS Worldwide</span><br>\
                  <small class="text-muted">7-10 business days</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <span class="text-dark fw-bold">$24.99</span>\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4">\
                  <label class="form-check-label" for="flexRadioDefault4">\
                  <span class="text-dark fw-bold">Aramex International</span><br>\
                  <small class="text-muted">7-14 business days</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <span class="text-dark fw-bold">$19.99</span>\
               </div>\
            </div>\
            <div class="d-flex align-items-start mb-3">\
               <div class="form-check">\
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault5">\
                  <label class="form-check-label" for="flexRadioDefault5">\
                  <span class="text-dark fw-bold">EMS (Nigerian Postal Service)</span><br>\
                  <small class="text-muted">14-21 business days</small>\
                  </label>\
               </div>\
               <div class="ms-auto">\
                  <span class="text-dark fw-bold">$14.99</span>\
               </div>\
            </div>\
            <div class="mb-3">' checkout.html

# Add weight-based pricing calculator to the checkout page
sed -i '/<div class="mb-3">/a\
            <h6 class="fw-bold mb-3">Weight-based Pricing Calculator</h6>\
            <div class="mb-3">\
               <label for="weight" class="form-label">Package Weight (kg)</label>\
               <input type="number" class="form-control" id="weight" placeholder="Enter package weight" min="0.1" step="0.1" value="1.0">\
            </div>\
            <div class="mb-3">\
               <label for="destination" class="form-label">Destination Country</label>\
               <select class="form-select" id="destination">\
                  <option value="us">United States</option>\
                  <option value="uk">United Kingdom</option>\
                  <option value="ca">Canada</option>\
                  <option value="fr">France</option>\
                  <option value="de">Germany</option>\
                  <option value="au">Australia</option>\
                  <option value="other">Other Countries</option>\
               </select>\
            </div>\
            <div class="d-grid gap-2">\
               <button class="btn btn-primary" type="button" onclick="calculateShipping()">Calculate Shipping Cost</button>\
            </div>\
            <div class="mt-3" id="shipping-result">\
               <p class="text-muted">Select weight and destination to calculate shipping cost.</p>\
            </div>' checkout.html

# Add JavaScript function for calculating shipping cost
cat > js/shipping-calculator.js << 'EOF'
/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Weight-based shipping calculator
function calculateShipping() {
    const weight = parseFloat(document.getElementById('weight').value);
    const destination = document.getElementById('destination').value;
    const resultDiv = document.getElementById('shipping-result');
    
    // Base rates per kg for different carriers
    const rates = {
        'dhl': { base: 35.99, perKg: 15.00 },
        'fedex': { base: 29.99, perKg: 12.50 },
        'ups': { base: 24.99, perKg: 10.00 },
        'aramex': { base: 19.99, perKg: 8.00 },
        'ems': { base: 14.99, perKg: 5.00 }
    };
    
    // Destination multipliers
    const multipliers = {
        'us': 1.0,
        'uk': 0.9,
        'ca': 1.1,
        'fr': 1.2,
        'de': 1.2,
        'au': 1.5,
        'other': 1.3
    };
    
    // Calculate costs for each carrier
    let html = '<h6 class="fw-bold mb-3">Estimated Shipping Costs</h6>';
    html += '<table class="table table-bordered">';
    html += '<thead><tr><th>Carrier</th><th>Cost</th><th>Delivery Time</th></tr></thead>';
    html += '<tbody>';
    
    for (const [carrier, rate] of Object.entries(rates)) {
        const cost = (rate.base + (weight * rate.perKg)) * multipliers[destination];
        let deliveryTime = '';
        
        switch(carrier) {
            case 'dhl':
                deliveryTime = '3-5 business days';
                break;
            case 'fedex':
                deliveryTime = '5-7 business days';
                break;
            case 'ups':
                deliveryTime = '7-10 business days';
                break;
            case 'aramex':
                deliveryTime = '7-14 business days';
                break;
            case 'ems':
                deliveryTime = '14-21 business days';
                break;
        }
        
        html += `<tr><td>${carrier.toUpperCase()}</td><td>$${cost.toFixed(2)}</td><td>${deliveryTime}</td></tr>`;
    }
    
    html += '</tbody></table>';
    html += '<p class="text-muted small">Prices are estimates and may vary based on actual package dimensions and customs fees.</p>';
    
    resultDiv.innerHTML = html;
    
    // Update the selected shipping option price
    const selectedCarrier = document.querySelector('input[name="flexRadioDefault"]:checked').id;
    const carrierIndex = selectedCarrier.replace('flexRadioDefault', '') - 1;
    const carriers = ['dhl', 'fedex', 'ups', 'aramex', 'ems'];
    const selectedRate = rates[carriers[carrierIndex]];
    const newPrice = (selectedRate.base + (weight * selectedRate.perKg)) * multipliers[destination];
    
    const priceElements = document.querySelectorAll('.form-check + .ms-auto .fw-bold');
    if (priceElements.length > carrierIndex) {
        priceElements[carrierIndex].textContent = '$' + newPrice.toFixed(2);
    }
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight');
    const destinationSelect = document.getElementById('destination');
    
    if (weightInput && destinationSelect) {
        weightInput.addEventListener('change', calculateShipping);
        destinationSelect.addEventListener('change', calculateShipping);
    }
});
