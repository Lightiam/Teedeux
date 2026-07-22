/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Platform detection and optimization
document.addEventListener('DOMContentLoaded', function() {
    // Detect platform
    const platform = detectPlatform();
    
    // Add platform-specific class to body
    document.body.classList.add(platform);
    
    // Apply platform-specific optimizations
    applyPlatformOptimizations(platform);
    
    // Log platform for debugging
    console.log('Detected platform:', platform);
});

// Detect user's platform
function detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'ios';
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
        return 'android';
    }
    
    // Mobile detection (other)
    if (/Mobi|Android/i.test(userAgent)) {
        return 'mobile';
    }
    
    // Tablet detection
    if (/Tablet|iPad/i.test(userAgent)) {
        return 'tablet';
    }
    
    // Default to desktop
    return 'desktop';
}

// Apply platform-specific optimizations
function applyPlatformOptimizations(platform) {
    // Get viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    
    // If viewport meta tag doesn't exist, create it
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
    }
    
    // Set appropriate viewport based on platform
    switch (platform) {
        case 'ios':
            // iOS-specific optimizations
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            
            // Fix for iOS input zoom
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
            inputs.forEach(input => {
                input.style.fontSize = '16px';
            });
            
            // Fix for iOS momentum scrolling
            const scrollableAreas = document.querySelectorAll('.scrollable-area');
            scrollableAreas.forEach(area => {
                area.style.webkitOverflowScrolling = 'touch';
            });
            break;
            
        case 'android':
            // Android-specific optimizations
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            
            // Fix for Android select elements
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.style.backgroundPosition = 'calc(100% - 10px) center';
            });
            break;
            
        case 'mobile':
            // General mobile optimizations
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            
            // Optimize images for mobile
            lazyLoadImages();
            break;
            
        case 'tablet':
            // Tablet optimizations
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            break;
            
        default:
            // Desktop optimizations
            viewport.content = 'width=device-width, initial-scale=1';
            break;
    }
}

// Lazy load images for better performance
function lazyLoadImages() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        // Get all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}
