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
            
            // Check rate limit status on page load
            updateRateLimitStatus();
        }
    }

    /**
     * Rate limiting configuration
     */
    const RATE_LIMIT_CONFIG = {
        maxMessages: 3,
        timeWindow: 10 * 60 * 1000, // 10 minutes in milliseconds
        localStorageKey: 'dalil_form_submissions'
    };

    /**
     * Get rate limit data from localStorage
     */
    function getRateLimitData() {
        try {
            const data = localStorage.getItem(RATE_LIMIT_CONFIG.localStorageKey);
            return data ? JSON.parse(data) : { submissions: [] };
        } catch (error) {
            console.error('Error reading rate limit data:', error);
            return { submissions: [] };
        }
    }

    /**
     * Save rate limit data to localStorage
     */
    function saveRateLimitData(data) {
        try {
            localStorage.setItem(RATE_LIMIT_CONFIG.localStorageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving rate limit data:', error);
        }
    }

    /**
     * Check if user can submit (hasn't exceeded rate limit)
     */
    function canSubmitMessage() {
        const data = getRateLimitData();
        const now = Date.now();
        const timeWindowStart = now - RATE_LIMIT_CONFIG.timeWindow;
        
        // Filter submissions within the time window
        const recentSubmissions = data.submissions.filter(time => time > timeWindowStart);
        
        // Update stored submissions (clean up old ones)
        data.submissions = recentSubmissions;
        saveRateLimitData(data);
        
        // Check if limit is reached
        return recentSubmissions.length < RATE_LIMIT_CONFIG.maxMessages;
    }

    /**
     * Get recent submissions count
     */
    function getRecentSubmissionsCount() {
        const data = getRateLimitData();
        const now = Date.now();
        const timeWindowStart = now - RATE_LIMIT_CONFIG.timeWindow;
        
        return data.submissions.filter(time => time > timeWindowStart).length;
    }

    /**
     * Add a submission timestamp
     */
    function recordSubmission() {
        const data = getRateLimitData();
        const now = Date.now();
        
        data.submissions.push(now);
        
        // Keep only recent submissions (last 24 hours max) to prevent localStorage from growing
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        data.submissions = data.submissions.filter(time => time > oneDayAgo);
        
        saveRateLimitData(data);
        
        // Immediately update UI after recording
        setTimeout(updateRateLimitStatus, 100);
    }

    /**
     * Get remaining time until next allowed submission
     */
    function getRemainingCooldown() {
        const data = getRateLimitData();
        const now = Date.now();
        const timeWindowStart = now - RATE_LIMIT_CONFIG.timeWindow;
        
        const recentSubmissions = data.submissions.filter(time => time > timeWindowStart);
        
        if (recentSubmissions.length < RATE_LIMIT_CONFIG.maxMessages) {
            return 0; // Can submit now
        }
        
        // Sort submissions ascending (oldest first)
        recentSubmissions.sort((a, b) => a - b);
        
        // Find when the oldest submission in the window will expire
        const oldestInWindow = recentSubmissions[0];
        const cooldownEnd = oldestInWindow + RATE_LIMIT_CONFIG.timeWindow;
        
        return Math.max(0, Math.ceil((cooldownEnd - now) / 1000));
    }

    /**
     * Update button and UI based on rate limit status
     */
    function updateRateLimitStatus() {
        const submitBtn = document.querySelector('.submit-btn');
        const messageDiv = document.getElementById('footer-form-message');
        
        if (!submitBtn || !messageDiv) return;
        
        const canSubmit = canSubmitMessage();
        const recentCount = getRecentSubmissionsCount();
        const remainingTime = getRemainingCooldown();
        
        if (!canSubmit && remainingTime > 0) {
            // Rate limited - disable button and show countdown
            submitBtn.disabled = true;
            const minutes = Math.ceil(remainingTime / 60);
            submitBtn.textContent = `انتظر ${minutes} دقيقة`;
            
            // Show rate limit message
            showFormMessage(messageDiv, 'rate-limited', 
                `لقد وصلت للحد المسموح (${RATE_LIMIT_CONFIG.maxMessages} رسائل كل 10 دقائق). ` +
                `يرجى الانتظار ${minutes} دقيقة`);
            
            // Start countdown timer
            startRateLimitCountdown();
        } else {
            // Not rate limited - enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال الرسالة';
            
            // Show remaining messages count if any
            if (recentCount > 0) {
                const remaining = RATE_LIMIT_CONFIG.maxMessages - recentCount;
                if (remaining > 0) {
                    showFormMessage(messageDiv, 'info', 
                        `يمكنك إرسال ${remaining} رسالة أخرى خلال الـ 10 دقائق القادمة`);
                    setTimeout(() => hideFormMessage(messageDiv), 3000);
                }
            } else {
                hideFormMessage(messageDiv);
            }
        }
    }

    /**
     * Start countdown timer for rate limit
     */
    function startRateLimitCountdown() {
        const submitBtn = document.querySelector('.submit-btn');
        const messageDiv = document.getElementById('footer-form-message');
        
        if (!submitBtn || !messageDiv) return;
        
        const updateCountdown = () => {
            const remainingTime = getRemainingCooldown();
            
            if (remainingTime <= 0) {
                // Cooldown expired - re-enable form
                updateRateLimitStatus();
                return;
            }
            
            const minutes = Math.ceil(remainingTime / 60);
            submitBtn.textContent = `انتظر ${minutes} دقيقة`;
            
            // Update message
            if (messageDiv.classList.contains('rate-limited')) {
                messageDiv.textContent = 
                    `لقد وصلت للحد المسموح (${RATE_LIMIT_CONFIG.maxMessages} رسائل كل 10 دقائق). ` +
                    `يرجى الانتظار ${minutes} دقيقة`;
            }
            
            // Schedule next update
            setTimeout(updateCountdown, 1000);
        };
        
        // Start countdown
        updateCountdown();
    }

    /**
     * Handle Netlify Form Submission - FIXED VERSION
     */
    async function handleNetlifyFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const messageDiv = document.getElementById('footer-form-message');
        
        // Check rate limit BEFORE sending
        if (!canSubmitMessage()) {
            const remainingTime = getRemainingCooldown();
            const minutes = Math.ceil(remainingTime / 60);
            
            showFormMessage(messageDiv, 'rate-limited', 
                `لقد وصلت للحد المسموح (${RATE_LIMIT_CONFIG.maxMessages} رسائل كل 10 دقائق). ` +
                `يرجى الانتظار ${minutes} دقيقة`);
            
            submitBtn.disabled = true;
            submitBtn.textContent = `انتظر ${minutes} دقيقة`;
            
            // Start countdown
            startRateLimitCountdown();
            return;
        }
        
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
            // IMPORTANT: For Netlify Forms to work properly, we need to submit the form data
            // including the form-name field and all form fields
            const formData = new FormData(form);
            
            // Convert FormData to URL-encoded string
            const encodedData = new URLSearchParams();
            for (const pair of formData) {
                encodedData.append(pair[0], pair[1]);
            }
            
            // Add the form-name field (required by Netlify)
            encodedData.append('form-name', 'footer-contact');
            
            console.log('Submitting to Netlify with data:', Object.fromEntries(encodedData));
            
            // Submit to Netlify's form endpoint
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: encodedData.toString()
            });
            
            console.log('Netlify response status:', response.status, response.statusText);
            
            if (response.ok || response.status === 200 || response.status === 302) {
                // Record the submission for rate limiting
                recordSubmission();
                
                // Show success message
                showFormMessage(messageDiv, 'success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
                
                // Reset the form
                form.reset();
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.textContent = 'إرسال الرسالة';
                
                // Clear any validation errors
                const inputs = form.querySelectorAll('.form-input, .form-textarea');
                inputs.forEach(input => input.classList.remove('invalid'));
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    hideFormMessage(messageDiv);
                }, 5000);
                
                // Update rate limit status
                updateRateLimitStatus();
                
            } else {
                throw new Error(`Netlify responded with status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error submitting form to Netlify:', error);
            
            // Show error message
            let errorMessage = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'مشكلة في الاتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.';
            }
            
            showFormMessage(messageDiv, 'error', errorMessage);
            
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال الرسالة';
            
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
        if (!element) return;
        
        element.textContent = text;
        
        // Remove all state classes first
        element.classList.remove('success', 'error', 'sending', 'rate-limited', 'info');
        
        // Add the new state class
        element.classList.add(type);
        
        // Make sure it's visible
        element.style.display = 'block';
        element.style.opacity = '1';
        element.style.maxHeight = '100px';
        element.style.padding = '12px';
    }

    /**
     * Hide form message
     */
    function hideFormMessage(element) {
        if (!element) return;
        
        element.classList.remove('success', 'error', 'sending', 'rate-limited', 'info');
        element.style.opacity = '0';
        element.style.maxHeight = '0';
        element.style.padding = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            element.textContent = '';
        }, 300);
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
                <p>يمكنك <a href="#" class="reload-link">إرسال رسالة أخرى</a> إذا أردت.</p>
            `;
            
            const form = document.getElementById('footer-contact-form');
            if (form) {
                form.style.display = 'none';
            }
            
            formContainer.appendChild(successDiv);
            
            // Add click handler for reload link
            const reloadLink = successDiv.querySelector('.reload-link');
            if (reloadLink) {
                reloadLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    location.reload();
                });
            }
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
            if (messageDiv && messageDiv.classList.contains('error')) {
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
            } else if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
        });
    }

    /**
     * Initialize rate limit monitoring
     */
    function setupRateLimitMonitoring() {
        // Update rate limit status every 30 seconds
        setInterval(updateRateLimitStatus, 30000);
        
        // Clean up old submissions (older than 24 hours) every hour
        setInterval(() => {
            const data = getRateLimitData();
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            data.submissions = data.submissions.filter(time => time > oneDayAgo);
            saveRateLimitData(data);
        }, 60 * 60 * 1000);
    }

    // Initialize rate limit monitoring when page loads
    document.addEventListener('DOMContentLoaded', function() {
        setupRateLimitMonitoring();
        // Initial update
        setTimeout(updateRateLimitStatus, 100);
    });

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