// ===================================
// Navigation Module - Dalil Landing Page
// ===================================

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = document.querySelectorAll('.nav-link');

    // State
    let lastScrollTop = 0;
    let isMenuOpen = false;

    /**
     * Initialize navigation functionality
     */
    function init() {
        setupEventListeners();
        updateActiveLink();
    }

    /**
     * Setup all event listeners
     */
    function setupEventListeners() {
        // Scroll event for navbar styling
        window.addEventListener('scroll', DalilUtils.throttle(handleScroll, 100));

        // Menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMenu);
        }

        // Navigation links
        navLinkElements.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // Close menu when clicking outside
        document.addEventListener('click', handleOutsideClick);

        // Handle window resize
        window.addEventListener('resize', DalilUtils.debounce(handleResize, 250));
    }

    /**
     * Handle scroll event
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        updateActiveLink();

        lastScrollTop = scrollTop;
    }

    /**
     * Toggle mobile menu
     */
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle navigation link click
     * @param {Event} e - Click event
     */
    function handleLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);

        // Smooth scroll to section
        DalilUtils.smoothScrollTo(targetId, 80);

        // Close mobile menu
        closeMenu();

        // Update active link
        updateActiveLink(targetId);
    }

    /**
     * Handle clicks outside menu
     * @param {Event} e - Click event
     */
    function handleOutsideClick(e) {
        if (isMenuOpen && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Close menu on desktop view
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    }

    /**
     * Update active navigation link
     * @param {string} sectionId - Optional section ID to activate
     */
    function updateActiveLink(sectionId) {
        const currentSection = sectionId || DalilUtils.getCurrentSection();

        navLinkElements.forEach(link => {
            const linkTarget = link.getAttribute('href').substring(1);
            if (linkTarget === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Highlight section on hover (for desktop)
     */
    function setupSectionHighlight() {
        const sections = document.querySelectorAll('.section, .hero');

        sections.forEach(section => {
            section.addEventListener('mouseenter', function() {
                if (!DalilUtils.isMobile()) {
                    this.style.transition = 'background-color 0.3s ease';
                }
            });
        });
    }

    /**
     * Add scroll progress indicator
     */
    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        progressBar.id = 'scrollProgress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', DalilUtils.throttle(() => {
            const percentage = DalilUtils.getScrollPercentage();
            progressBar.style.width = percentage + '%';
        }, 50));
    }

    /**
     * Add back to top button
     */
    function addBackToTop() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 2.5rem;
            height: 2.5rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
        `;
        button.id = 'backToTop';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', DalilUtils.throttle(() => {
            if (window.pageYOffset > 300) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        }, 100));

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add additional features
    addScrollProgress();
    addBackToTop();
    setupSectionHighlight();

    // Export navigation functions
    window.DalilNavigation = {
        closeMenu,
        updateActiveLink,
        toggleMenu
    };
})();