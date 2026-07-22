/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// AI-powered chat support for customer inquiries
class TeedeuxChatSupport {
    constructor() {
        this.commonQuestions = {
            "shipping": [
                "How long does shipping take?",
                "What are the shipping costs?",
                "Do you ship internationally?",
                "How is shipping calculated?",
                "Which countries do you ship to?"
            ],
            "payment": [
                "What payment methods do you accept?",
                "Is payment secure?",
                "Can I pay on delivery?",
                "Do you accept international credit cards?",
                "How do I use Paystack/Flutterwave?"
            ],
            "products": [
                "Are the products authentic?",
                "How fresh are the food items?",
                "Do you have vegetarian options?",
                "Are ingredients listed for allergy concerns?",
                "How are perishable items packaged?"
            ],
            "vendors": [
                "How are vendors verified?",
                "Can I become a vendor?",
                "How do I contact a specific vendor?",
                "What's the vendor rating system?",
                "Are vendors food safety certified?"
            ],
            "orders": [
                "How do I track my order?",
                "Can I cancel my order?",
                "What if my order arrives damaged?",
                "How do I return an item?",
                "Can I change my delivery address after ordering?"
            ],
            "account": [
                "How do I create an account?",
                "How do I reset my password?",
                "Can I have multiple shipping addresses?",
                "How do I update my profile?",
                "Is my personal information secure?"
            ]
        };
        
        this.responses = {
            "shipping": {
                "How long does shipping take?": "Shipping times vary by destination. For US/UK/Canada, expect 5-7 business days. EU countries typically take 7-10 days. We provide tracking information once your order ships.",
                "What are the shipping costs?": "Shipping costs are calculated based on weight and destination. You can see the exact cost at checkout after entering your shipping address.",
                "Do you ship internationally?": "Yes! Teedeux ships to over 50 countries worldwide through our partnerships with DHL, FedEx, UPS, Aramex, and EMS.",
                "How is shipping calculated?": "We use a weight-based pricing calculator. Heavier items cost more to ship. You can see the exact shipping cost during checkout.",
                "Which countries do you ship to?": "We currently ship to the US, Canada, UK, most EU countries, Australia, and select countries in Asia and the Middle East. The full list is available in our shipping policy."
            },
            "payment": {
                "What payment methods do you accept?": "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, Paystack, Flutterwave, and Interswitch. Payment options may vary by region.",
                "Is payment secure?": "Absolutely! We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers.",
                "Can I pay on delivery?": "Cash on delivery is available in select regions in Nigeria only. This option will appear at checkout if available for your location.",
                "Do you accept international credit cards?": "Yes, we accept international credit cards through our secure payment gateways including Stripe, PayPal, and Flutterwave.",
                "How do I use Paystack/Flutterwave?": "Select Paystack or Flutterwave at checkout, and you'll be redirected to their secure platform to complete your payment. Both support cards and bank transfers."
            },
            "products": {
                "Are the products authentic?": "Yes, all our vendors go through a strict verification process to ensure they sell authentic Nigerian food products. We have a 100% authenticity guarantee.",
                "How fresh are the food items?": "Our vendors follow strict quality control measures. Perishable items are properly preserved, and all products have clear expiration dates. Non-perishable items have a shelf life of at least 6 months.",
                "Do you have vegetarian options?": "Yes, we have many vegetarian options! You can use our search filters to find vegetarian Nigerian dishes and ingredients.",
                "Are ingredients listed for allergy concerns?": "Yes, all food products include detailed ingredient lists. If you have specific allergy concerns, please contact the vendor directly before purchasing.",
                "How are perishable items packaged?": "Perishable items are vacuum-sealed and shipped with appropriate cooling materials when necessary. Our packaging is designed to maintain freshness during transit."
            },
            "vendors": {
                "How are vendors verified?": "Vendors undergo a 5-step verification process: identity verification, food safety certification, product authenticity check, export license verification, and quality control inspection.",
                "Can I become a vendor?": "Yes! If you're an African food vendor interested in reaching the diaspora market, visit our 'Become a Vendor' page to apply.",
                "How do I contact a specific vendor?": "On each vendor's profile page, you'll find a 'Contact Vendor' button that allows you to send them a direct message.",
                "What's the vendor rating system?": "Vendors are rated on a 5-star scale based on product quality, packaging, shipping speed, and customer service. Ratings come from verified purchases only.",
                "Are vendors food safety certified?": "Yes, all food vendors must provide valid food safety certification as part of our verification process. This information is displayed on their profile."
            },
            "orders": {
                "How do I track my order?": "Once your order ships, you'll receive a tracking number via email. You can also find tracking information in your account under 'My Orders'.",
                "Can I cancel my order?": "Orders can be cancelled within 24 hours of placement if they haven't shipped yet. Go to 'My Orders' in your account and select 'Cancel Order'.",
                "What if my order arrives damaged?": "Please take photos of the damaged items and packaging, then contact our customer support within 48 hours of delivery. We'll arrange a replacement or refund.",
                "How do I return an item?": "Our return policy varies by product type. For non-perishable items, you have 14 days to initiate a return. Perishable food items cannot be returned for safety reasons.",
                "Can I change my delivery address after ordering?": "Address changes are possible only if the order hasn't been processed yet. Contact customer support immediately with your order number and new address."
            },
            "account": {
                "How do I create an account?": "Click the 'Sign Up' button in the top right corner of the website or app. You can register using your email or sign up with Google/Facebook for faster access.",
                "How do I reset my password?": "Click 'Forgot Password' on the login page. We'll send a password reset link to your registered email address.",
                "Can I have multiple shipping addresses?": "Yes, you can save multiple shipping addresses in your account settings. During checkout, you can select which address to use.",
                "How do I update my profile?": "Go to 'My Account' and select 'Settings' to update your profile information, including name, email, phone number, and profile picture.",
                "Is my personal information secure?": "Yes, we follow strict data protection protocols. Your personal information is encrypted and never shared with third parties without your consent."
            }
        };
    }
    
    // Get response to a customer inquiry
    getResponse(inquiry) {
        inquiry = inquiry.trim();
        
        // Check for exact matches in our response database
        for (const category in this.responses) {
            for (const question in this.responses[category]) {
                if (this.similarQuestions(inquiry, question)) {
                    return {
                        response: this.responses[category][question],
                        category: category
                    };
                }
            }
        }
        
        // If no exact match, find the category and provide a general response
        const category = this.identifyCategory(inquiry);
        if (category) {
            return {
                response: `Thank you for your question about ${category}. A customer service representative will provide a detailed response shortly. In the meantime, you might find helpful information in our FAQ section.`,
                category: category,
                isGeneral: true
            };
        }
        
        // Default response if we can't categorize the question
        return {
            response: "Thank you for your inquiry. Our customer service team will respond to your question shortly. Is there anything else I can help you with?",
            isGeneral: true
        };
    }
    
    // Check if two questions are similar
    similarQuestions(q1, q2) {
        q1 = q1.toLowerCase();
        q2 = q2.toLowerCase();
        
        // Exact match
        if (q1 === q2) return true;
        
        // Contains key parts
        const q2Words = q2.split(' ');
        const keyWords = q2Words.filter(word => word.length > 3);
        const keyWordsMatch = keyWords.filter(word => q1.includes(word)).length;
        
        // If more than 70% of key words match
        if (keyWords.length > 0 && keyWordsMatch / keyWords.length > 0.7) {
            return true;
        }
        
        return false;
    }
    
    // Identify which category a question belongs to
    identifyCategory(inquiry) {
        inquiry = inquiry.toLowerCase();
        
        for (const category in this.commonQuestions) {
            const questions = this.commonQuestions[category];
            
            // Check if inquiry contains category name
            if (inquiry.includes(category)) {
                return category;
            }
            
            // Check for key terms in each category
            for (const question of questions) {
                const questionWords = question.toLowerCase().split(' ');
                const keyWords = questionWords.filter(word => word.length > 3);
                const keyWordsMatch = keyWords.filter(word => inquiry.includes(word)).length;
                
                if (keyWords.length > 0 && keyWordsMatch / keyWords.length > 0.5) {
                    return category;
                }
            }
        }
        
        return null;
    }
    
    // Get suggested questions based on category
    getSuggestedQuestions(category) {
        if (category && this.commonQuestions[category]) {
            return this.commonQuestions[category];
        }
        
        // If no category specified, return a mix of common questions
        const suggested = [];
        for (const category in this.commonQuestions) {
            suggested.push(this.commonQuestions[category][0]);
        }
        
        return suggested;
    }
}

// Export the chat support
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeedeuxChatSupport;
} else {
    // For browser usage
    window.TeedeuxChatSupport = TeedeuxChatSupport;
}
