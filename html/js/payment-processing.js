/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// International payment processing
document.addEventListener('DOMContentLoaded', function() {
    // Get all payment method radio buttons
    const paymentMethods = document.querySelectorAll('input[name="flexRadioDefault2"]');
    
    // Add event listeners to payment method radio buttons
    paymentMethods.forEach(method => {
        method.addEventListener('change', updatePaymentDetails);
    });
    
    // Initial update
    updatePaymentDetails();
    
    // Add event listener to the payment button
    const paymentButton = document.querySelector('.btn-danger');
    if (paymentButton) {
        paymentButton.addEventListener('click', processPayment);
    }
});

// Update payment details based on selected payment method
function updatePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="flexRadioDefault2"]:checked');
    if (!selectedMethod) return;
    
    const methodId = selectedMethod.id;
    const paymentDetailsDiv = document.getElementById('payment-details');
    
    if (!paymentDetailsDiv) return;
    
    let detailsHTML = '';
    
    switch(methodId) {
        case 'flexRadioDefault21': // Paystack
            detailsHTML = `
                <div class="mb-3">
                    <label for="card-number" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="expiry-date" class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cvv" placeholder="123">
                        </div>
                    </div>
                </div>
                <p class="text-muted small">Secure payment processed by Paystack. Your card details are encrypted.</p>
            `;
            break;
        case 'flexRadioDefault22': // Flutterwave
            detailsHTML = `
                <div class="mb-3">
                    <label for="card-number" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="expiry-date" class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cvv" placeholder="123">
                        </div>
                    </div>
                </div>
                <p class="text-muted small">Secure payment processed by Flutterwave. Your card details are encrypted.</p>
            `;
            break;
        case 'flexRadioDefault23': // Interswitch
            detailsHTML = `
                <div class="mb-3">
                    <label for="card-number" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="expiry-date" class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cvv" placeholder="123">
                        </div>
                    </div>
                </div>
                <p class="text-muted small">Secure payment processed by Interswitch. Your card details are encrypted.</p>
            `;
            break;
        case 'flexRadioDefault24': // Stripe
            detailsHTML = `
                <div class="mb-3">
                    <label for="card-number" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456">
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="expiry-date" class="form-label">Expiry Date</label>
                            <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label for="cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cvv" placeholder="123">
                        </div>
                    </div>
                </div>
                <p class="text-muted small">Secure payment processed by Stripe. Your card details are encrypted.</p>
            `;
            break;
        case 'flexRadioDefault25': // PayPal
            detailsHTML = `
                <div class="mb-3">
                    <label for="paypal-email" class="form-label">PayPal Email</label>
                    <input type="email" class="form-control" id="paypal-email" placeholder="your-email@example.com">
                </div>
                <p class="text-muted small">You will be redirected to PayPal to complete your payment.</p>
                <p class="text-warning small">Note: PayPal has limited functionality in Nigeria. Additional verification may be required.</p>
            `;
            break;
    }
    
    paymentDetailsDiv.innerHTML = detailsHTML;
}

// Process payment
function processPayment(event) {
    event.preventDefault();
    
    const selectedMethod = document.querySelector('input[name="flexRadioDefault2"]:checked');
    if (!selectedMethod) {
        alert('Please select a payment method.');
        return;
    }
    
    const methodId = selectedMethod.id;
    let methodName = '';
    
    switch(methodId) {
        case 'flexRadioDefault21':
            methodName = 'Paystack';
            break;
        case 'flexRadioDefault22':
            methodName = 'Flutterwave';
            break;
        case 'flexRadioDefault23':
            methodName = 'Interswitch';
            break;
        case 'flexRadioDefault24':
            methodName = 'Stripe';
            break;
        case 'flexRadioDefault25':
            methodName = 'PayPal';
            break;
    }
    
    // In a real application, this would connect to the payment gateway API
    // For demo purposes, we'll just show an alert
    alert(`Processing payment with ${methodName}. In a real application, this would connect to the ${methodName} API.`);
    
    // Simulate successful payment
    setTimeout(() => {
        window.location.href = 'order-success.html';
    }, 2000);
}
