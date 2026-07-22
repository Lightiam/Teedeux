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
