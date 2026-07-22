/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    // Default language
    let currentLanguage = localStorage.getItem('teedeux_language') || 'en';
    
    // Load the current language
    loadLanguage(currentLanguage);
    
    // Set up language switcher if it exists
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.value = currentLanguage;
        languageSwitcher.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('teedeux_language', selectedLanguage);
            loadLanguage(selectedLanguage);
            // Reload the page to apply translations
            window.location.reload();
        });
    }
});

// Function to load language file
function loadLanguage(lang) {
    // Create a script element
    const script = document.createElement('script');
    script.src = `js/lang/${lang}.js`;
    script.id = 'language-script';
    
    // Remove any existing language script
    const existingScript = document.getElementById('language-script');
    if (existingScript) {
        existingScript.remove();
    }
    
    // Add the new script to the head
    document.head.appendChild(script);
    
    // Apply translations once the script is loaded
    script.onload = function() {
        applyTranslations();
    };
}

// Function to apply translations to the page
function applyTranslations() {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded');
        return;
    }
    
    // Apply translations to elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Apply translations to elements with data-i18n-placeholder attribute (for inputs)
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.setAttribute('placeholder', translations[key]);
        }
    });
    
    // Apply translations to elements with data-i18n-value attribute (for buttons)
    const values = document.querySelectorAll('[data-i18n-value]');
    values.forEach(element => {
        const key = element.getAttribute('data-i18n-value');
        if (translations[key]) {
            element.setAttribute('value', translations[key]);
        }
    });
}
