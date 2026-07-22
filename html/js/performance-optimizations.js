/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Apply performance optimizations
    optimizePerformance();
    
    // Listen for page load event
    window.addEventListener('load', function() {
        // Defer non-critical operations
        setTimeout(function() {
            loadNonCriticalResources();
        }, 1000);
    });
});

// Apply performance optimizations
function optimizePerformance() {
    // Optimize image loading
    optimizeImages();
    
    // Optimize event handlers
    optimizeEventHandlers();
    
    // Optimize animations
    optimizeAnimations();
    
    // Optimize scrolling
    optimizeScrolling();
}

// Optimize image loading
function optimizeImages() {
    // Convert images to use srcset for responsive loading
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
        const src = img.getAttribute('src');
        
        // Skip if no src or already optimized
        if (!src || img.hasAttribute('data-optimized')) return;
        
        // Mark as optimized
        img.setAttribute('data-optimized', 'true');
        
        // For images that should be lazy loaded
        if (img.classList.contains('lazy') || !isInViewport(img)) {
            img.setAttribute('data-src', src);
            img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
        }
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Optimize event handlers using event delegation
function optimizeEventHandlers() {
    // Use event delegation for common events
    document.addEventListener('click', function(e) {
        // Handle dropdown toggles
        if (e.target.matches('.dropdown-toggle') || e.target.closest('.dropdown-toggle')) {
            e.preventDefault();
            const dropdown = e.target.closest('.dropdown');
            dropdown.classList.toggle('show');
        }
        
        // Handle accordion toggles
        if (e.target.matches('.accordion-button') || e.target.closest('.accordion-button')) {
            e.preventDefault();
            const accordionItem = e.target.closest('.accordion-item');
            const accordionCollapse = accordionItem.querySelector('.accordion-collapse');
            
            if (accordionCollapse) {
                accordionCollapse.classList.toggle('show');
            }
        }
    });
}

// Optimize animations
function optimizeAnimations() {
    // Reduce animation complexity on mobile
    if (window.innerWidth < 768) {
        const animatedElements = document.querySelectorAll('.animated');
        
        animatedElements.forEach(el => {
            // Simplify animations on mobile
            el.style.animationDuration = '0.5s';
        });
        
        // Disable complex animations
        const complexAnimations = document.querySelectorAll('.fade-in-slow');
        
        complexAnimations.forEach(el => {
            el.classList.remove('fade-in-slow');
            el.style.opacity = '1';
        });
    }
}

// Optimize scrolling
function optimizeScrolling() {
    // Debounce scroll events
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            // Handle scroll-based operations here
            lazyLoadImagesInViewport();
        });
    });
}

// Lazy load images that are in viewport
function lazyLoadImagesInViewport() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    lazyImages.forEach(img => {
        if (isInViewport(img)) {
            const src = img.getAttribute('data-src');
            
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        }
    });
}

// Load non-critical resources
function loadNonCriticalResources() {
    // Load non-critical CSS
    loadCSS('https://cdn.lineicons.com/4.0/lineicons.css');
    
    // Load non-critical scripts
    loadScript('js/ai-search/chat-support.js');
    loadScript('js/ai-search/voice-search.js');
}

// Load CSS asynchronously
function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Load script asynchronously
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
}
