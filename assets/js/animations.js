// ===================================
// Animations Module - Dalil Landing Page
// ===================================

(function() {
    'use strict';

    // Configuration
    const config = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
        animationDelay: 100
    };

    /**
     * Initialize all animations
     */
    function init() {
        setupScrollAnimations();
        setupHoverEffects();
        setupCounterAnimations();
        setupParallaxEffects();
    }

    /**
     * Setup scroll-triggered animations
     */
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: config.threshold,
                rootMargin: config.rootMargin
            });

            animatedElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(element => {
                element.classList.add('animated');
            });
        }
    }

    /**
     * Setup hover effects for cards and interactive elements
     */
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.card, .benefit-card, .language-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Button hover effects
        const buttons = document.querySelectorAll('.cta-button');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    /**
     * Setup counter animations for numbers
     */
    function setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-counter'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        }
    }

    /**
     * Setup parallax scrolling effects
     */
    function setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length > 0 && !DalilUtils.isMobile()) {
            window.addEventListener('scroll', DalilUtils.throttle(() => {
                const scrolled = window.pageYOffset;

                parallaxElements.forEach(element => {
                    const speed = element.getAttribute('data-parallax') || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }, 16));
        }
    }

    /**
     * Animate element on scroll into view
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class to add
     */
    function animateOnScroll(element, animationClass = 'fade-in-up') {
        if (DalilUtils.isInViewport(element, 100)) {
            element.classList.add(animationClass);
        }
    }

    /**
     * Stagger animation for children elements
     * @param {HTMLElement} container - Container element
     * @param {number} delay - Delay between animations (ms)
     */
    function staggerAnimation(container, delay = 100) {
        const children = container.children;

        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animated');
            }, index * delay);
        });
    }

    /**
     * Add ripple effect to buttons
     * @param {Event} e - Click event
     */
    function createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        ripple.style.top = `${e.clientY - button.offsetTop - radius}px`;
        ripple.classList.add('ripple');

        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        if (!document.querySelector('style[data-ripple]')) {
            rippleStyle.setAttribute('data-ripple', 'true');
            document.head.appendChild(rippleStyle);
        }

        button.style.position = 'relative';
        button.style.overflow = 'hidden';

        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);
    }

    /**
     * Add ripple effect to all buttons
     */
    function setupRippleEffect() {
        const buttons = document.querySelectorAll('.cta-button, button');
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    }

    /**
     * Smooth reveal animation for text
     * @param {HTMLElement} element - Element to reveal
     */
    function revealText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.animation = `fadeIn 0.05s ease forwards ${index * 0.03}s`;
            element.appendChild(span);
        });
    }

    /**
     * Add smooth scroll reveal animations
     */
    function setupScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach(reveal => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(reveal);
        });
    }

    /**
     * Animate progress bars
     */
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = progress + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease';
            observer.observe(bar);
        });
    }

    /**
     * Add float animation to hero background elements
     */
    function setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.hero-background::before, .hero-background::after');
        
        // This is handled via CSS animations
        // Additional JS interactions can be added here if needed
    }

    /**
     * Setup typing animation
     * @param {HTMLElement} element - Element to type in
     * @param {string} text - Text to type
     * @param {number} speed - Typing speed (ms)
     */
    function typeText(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Setup additional effects
    setupRippleEffect();
    setupScrollReveal();
    animateProgressBars();

    // Export animation functions
    window.DalilAnimations = {
        animateOnScroll,
        staggerAnimation,
        revealText,
        typeText,
        createRipple
    };
})();