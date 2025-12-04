// ===================================
// Back to Top Module - Dalil Landing Page
// ===================================

// assets/js/back-to-top.js - Minimal Version
(function() {
    'use strict';
    
    // Create button
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.id = 'backToTop';
    btn.title = 'العودة للأعلى';
    btn.setAttribute('aria-label', 'العودة للأعلى');
    
    // Apply all styles
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '24px',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: '9999',
        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        lineHeight: '1',
        fontFamily: 'inherit'
    });
    
    // Add to body
    document.body.appendChild(btn);
    
    // Show/hide on scroll
    function updateVisibility() {
        if (window.pageYOffset > 300) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    }
    
    // Click to scroll to top
    btn.addEventListener('click', function() {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(updateVisibility, 500);
    });
    
    // RTL support
    if (document.documentElement.dir === 'rtl') {
        btn.style.right = 'auto';
        btn.style.left = '30px';
    }
    
    // Mobile responsiveness
    function makeResponsive() {
        if (window.innerWidth <= 768) {
            btn.style.width = '45px';
            btn.style.height = '45px';
            btn.style.fontSize = '20px';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            if (document.documentElement.dir === 'rtl') {
                btn.style.right = 'auto';
                btn.style.left = '20px';
            }
        } else {
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.fontSize = '24px';
            btn.style.bottom = '30px';
            btn.style.right = '30px';
            if (document.documentElement.dir === 'rtl') {
                btn.style.right = 'auto';
                btn.style.left = '30px';
            }
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', updateVisibility);
    window.addEventListener('resize', makeResponsive);
    window.addEventListener('load', updateVisibility);
    
    // Hover effects
    btn.addEventListener('mouseenter', () => {
        if (btn.style.opacity === '1') {
            btn.style.transform = 'scale(1.1)';
            btn.style.background = '#1d4ed8';
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.background = '#2563eb';
    });
    
    // Initial setup
    makeResponsive();
    updateVisibility();
    
})();