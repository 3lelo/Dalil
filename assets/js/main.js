// ===================================
// Main JavaScript - Dalil Landing Page
// ===================================

(function() {
    'use strict';

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Dalil Landing Page Initialized');

        // Setup all features
        setupExternalLinks();
        setupFormValidation();
        setupTooltips();
        setupLazyLoading();
        setupAccessibility();
        setupDarkMode();
        setupAlgorithmDropdowns();
        setupNetlifyForms();
        logPerformance();
    }

    /**
     * Setup dark mode toggle
     */
    function setupDarkMode() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = localStorage.getItem('theme') || 'light';

        // Apply saved theme
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    /**
     * Setup algorithm dropdowns
     */
    function setupAlgorithmDropdowns() {
        const dropdownTriggers = document.querySelectorAll('.algo-dropdown-trigger');

        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                const dropdown = this.parentElement;
                dropdown.classList.toggle('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.algo-dropdown')) {
                document.querySelectorAll('.algo-dropdown').forEach(d => {
                    d.classList.remove('active');
                });
            }
        });
    }


    /**
     * Setup external links to open in new tab
     */
    function setupExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            // Skip if it's an internal link
            if (link.hostname === window.location.hostname) {
                return;
            }

            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add external-link class if not already present
            if (!link.classList.contains('external-link')) {
                link.classList.add('external-link');
            }
        });
    }

    /**
     * Setup form validation (if forms are added later)
     */
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    /**
     * Validate form
     * @param {HTMLFormElement} form - Form to validate
     * @returns {boolean} - True if valid
     */
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'هذا الحقل مطلوب');
            } else {
                input.classList.remove('error');
                removeError(input);
            }
        });

        return isValid;
    }

    /**
     * Show error message
     * @param {HTMLElement} element - Input element
     * @param {string} message - Error message
     */
    function showError(element, message) {
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        element.parentElement.appendChild(errorDiv);
    }

    /**
     * Remove error message
     * @param {HTMLElement} element - Input element
     */
    function removeError(element) {
        const error = element.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    /**
     * Setup tooltips
     */
    function setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');

        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            
            element.addEventListener('mouseenter', () => {
                const tooltip = createTooltip(tooltipText);
                element.appendChild(tooltip);
                positionTooltip(element, tooltip);
            });

            element.addEventListener('mouseleave', () => {
                const tooltip = element.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    /**
     * Create tooltip element
     * @param {string} text - Tooltip text
     * @returns {HTMLElement} - Tooltip element
     */
    function createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--dark);
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            font-size: 0.875rem;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: fadeIn 0.2s ease forwards;
        `;
        return tooltip;
    }

    /**
     * Position tooltip
     * @param {HTMLElement} element - Parent element
     * @param {HTMLElement} tooltip - Tooltip element
     */
    function positionTooltip(element, tooltip) {
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `-${tooltip.offsetHeight + 8}px`;
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
    }

    /**
     * Setup lazy loading for images
     */
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Setup accessibility features
     */
    function setupAccessibility() {
        // Add skip to main content link
        addSkipLink();

        // Improve focus visibility
        improveFocusVisibility();

        // Add ARIA labels where needed
        addAriaLabels();

        // Handle keyboard navigation
        setupKeyboardNavigation();
    }

    /**
     * Add skip to main content link
     */
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#hero';
        skipLink.textContent = 'انتقل إلى المحتوى الرئيسي';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '10px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-100px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Improve focus visibility
     */
    function improveFocusVisibility() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.style.outline = '3px solid var(--primary)';
                this.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }

    /**
     * Add ARIA labels
     */
    function addAriaLabels() {
        // Add labels to navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'التنقل الرئيسي');
        }

        // Add labels to buttons without text
        const iconButtons = document.querySelectorAll('button:not([aria-label])');
        iconButtons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'زر');
            }
        });
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape' && window.DalilNavigation) {
                window.DalilNavigation.closeMenu();
            }

            // Arrow keys for navigation
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('nav-link')) {
                    e.preventDefault();
                    const links = Array.from(document.querySelectorAll('.nav-link'));
                    const currentIndex = links.indexOf(focusedElement);
                    
                    if (e.key === 'ArrowDown' && currentIndex < links.length - 1) {
                        links[currentIndex + 1].focus();
                    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                        links[currentIndex - 1].focus();
                    }
                }
            }
        });
    }

    /**
     * Log performance metrics
     */
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    const connectTime = perfData.responseEnd - perfData.requestStart;
                    const renderTime = perfData.domComplete - perfData.domLoading;

                    console.log('📊 Performance Metrics:');
                    console.log(`Page Load Time: ${pageLoadTime}ms`);
                    console.log(`Connection Time: ${connectTime}ms`);
                    console.log(`Render Time: ${renderTime}ms`);
                }, 0);
            });
        }
    }

    /**
     * Handle page visibility changes
     */
    function setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('⏸️ Page hidden');
            } else {
                console.log('▶️ Page visible');
            }
        });
    }

    /**
     * Setup service worker (for PWA - optional)
     */
    function setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Uncomment when you have a service worker file
                // navigator.serviceWorker.register('/sw.js')
                //     .then(reg => console.log('✅ Service Worker registered'))
                //     .catch(err => console.log('❌ Service Worker registration failed:', err));
            });
        }
    }

    /**
     * Add console styling
     */
    function setupConsoleWelcome() {
        const styles = [
            'color: #2563EB',
            'font-size: 20px',
            'font-weight: bold',
            'text-shadow: 2px 2px 4px rgba(0,0,0,0.2)'
        ].join(';');

        console.log('%cمرحباً بك في دليل 🚀', styles);
        console.log('%cدليلك للبرمجة التنافسية', 'color: #10B981; font-size: 14px;');
    }

    /**
     * Setup Netlify Forms
     */
    function setupNetlifyForms() {
        const contactForm = document.getElementById('footer-contact-form');
        
        if (contactForm) {
            // Check if we're on a success page
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('form') === 'footer-contact' && urlParams.get('success') === 'true') {
                showFormSuccessMessage();
            }
            
            // Handle form submission
            contactForm.addEventListener('submit', handleNetlifyFormSubmit);
            
            // Setup real-time validation
            setupFormRealTimeValidation(contactForm);
        }
    }

    /**
     * Handle Netlify Form Submission
     */
    async function handleNetlifyFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const messageDiv = document.getElementById('footer-form-message');
        
        // Get form values for validation
        const name = form.querySelector('#footer-name').value.trim();
        const email = form.querySelector('#footer-email').value.trim();
        const message = form.querySelector('#footer-message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showFormMessage(messageDiv, 'error', 'يرجى ملء جميع الحقول');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage(messageDiv, 'error', 'البريد الإلكتروني غير صالح');
            return;
        }
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = '';
        
        // Show sending message
        showFormMessage(messageDiv, 'sending', 'جارٍ إرسال رسالتك...');
        
        try {
            // Netlify Forms will handle the submission automatically
            const formData = new FormData(form);
            
            const response = await fetch('/', {
                method: 'POST',
                body: new URLSearchParams(new FormData(form)),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (response.ok) {
                // Show success message
                showFormMessage(messageDiv, 'success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                
                // Reset form after successful submission
                setTimeout(() => {
                    form.reset();
                    resetSubmitButton(submitBtn);
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        hideFormMessage(messageDiv);
                    }, 5000);
                }, 1500);
            } else {
                throw new Error('Network response was not ok');
            }
            
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Show error message
            showFormMessage(messageDiv, 'error', 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
            
            // Re-enable submit button
            resetSubmitButton(submitBtn);
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                hideFormMessage(messageDiv);
            }, 5000);
        }
    }

    /**
     * Show form message
     */
    function showFormMessage(element, type, text) {
        element.textContent = text;
        
        // Remove all state classes first
        element.classList.remove('success', 'error', 'sending');
        
        // Add the new state class
        element.classList.add(type);
        
        // Make sure it's visible
        element.style.display = 'block';
        element.style.opacity = '1';
        element.style.maxHeight = '100px';
    }

    /**
     * Hide form message
     */
    function hideFormMessage(element) {
        // Instead of hiding completely, reset to default state
        element.classList.remove('success', 'error', 'sending');
        element.style.opacity = '0';
        element.style.maxHeight = '0';
        element.style.padding = '0';
        
        // Hide completely after transition
        setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
        }, 300);
    }

    /**
     * Reset form to initial state
     */
    function resetForm(form) {
        form.reset();
        
        // Remove any invalid classes
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('invalid');
            input.style.borderColor = '';
        });
        
        // Hide any visible messages
        const messageDiv = document.getElementById('footer-form-message');
        if (messageDiv) {
            hideFormMessage(messageDiv);
        }
    }

    /**
     * Show form success message (for redirect pages)
     */
    function showFormSuccessMessage() {
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            const successDiv = document.createElement('div');
            successDiv.className = 'netlify-form-success';
            successDiv.innerHTML = `
                <h3>شكراً لك!</h3>
                <p>تم استلام رسالتك بنجاح. سنتواصل معك في أقرب وقت ممكن.</p>
                <p>يمكنك <a href="#" onclick="location.reload(); return false;">إرسال رسالة أخرى</a> إذا أردت.</p>
            `;
            
            const form = document.getElementById('footer-contact-form');
            if (form) {
                form.style.display = 'none';
            }
            
            formContainer.appendChild(successDiv);
        }
    }

    /**
     * Setup real-time form validation
     */
    function setupFormRealTimeValidation(form) {
        form.addEventListener('input', function(e) {
            const input = e.target;
            const messageDiv = document.getElementById('footer-form-message');
            
            // Clear any error messages when user starts typing
            if (messageDiv.classList.contains('error')) {
                hideFormMessage(messageDiv);
            }
            
            // Real-time validation for email
            if (input.type === 'email' && input.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Additional setups
    setupVisibilityChange();
    setupConsoleWelcome();

    // Export main functions
    window.DalilApp = {
        init,
        validateForm,
        setupExternalLinks,
        handleNetlifyFormSubmit,
        showFormMessage 
    };
})();

// Global error handler
window.addEventListener('error', (e) => {
    console.error('❌ Error:', e.message);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
});