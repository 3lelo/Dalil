// ===================================
// Algorithm Page Logic - Dalil
// ===================================

(function() {
    'use strict';

    // Get algorithm ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const algorithmId = urlParams.get('id');

    // DOM Elements
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const algorithmContent = document.getElementById('algorithm-content');

    /**
     * Initialize the page
     */
    async function init() {
        if (!algorithmId) {
            showError();
            return;
        }

        try {
            // Fetch algorithms data
            const response = await fetch('assets/data/algorithms.json');
            if (!response.ok) {
                throw new Error('Failed to load algorithms data');
            }

            const data = await response.json();
            const algorithm = data.algorithms.find(algo => algo.id === algorithmId);

            if (!algorithm) {
                showError();
                return;
            }

            // Render the algorithm
            renderAlgorithm(algorithm);
            
            // Hide loading, show content
            loadingState.style.display = 'none';
            algorithmContent.style.display = 'block';

            // Setup external links
            setupExternalLinks();

            // Smooth scroll for quick links
            setupQuickLinks();

        } catch (error) {
            console.error('Error loading algorithm:', error);
            showError();
        }
    }

    /**
     * Render algorithm content
     */
    function renderAlgorithm(algo) {
        // Update page title and meta
        document.title = `${algo.title} | دليل`;
        document.getElementById('page-title').textContent = `${algo.title} | دليل`;
        document.getElementById('og-title').setAttribute('content', `${algo.title} | دليل`);
        document.getElementById('og-description').setAttribute('content', algo.description);

        // Update breadcrumb
        document.getElementById('breadcrumb-category').textContent = algo.category;
        document.getElementById('breadcrumb-title').textContent = algo.title;

        // Update hero section
        document.getElementById('algo-category').textContent = algo.category;
        document.getElementById('algo-title').textContent = algo.title;
        document.getElementById('algo-description').textContent = algo.description;
        document.getElementById('algo-difficulty').textContent = `المستوى: ${algo.difficulty}`;
        document.getElementById('algo-duration').textContent = `المدة: ${algo.duration}`;

        // Update what section
        const whatElement = document.getElementById('algo-what');
        whatElement.innerHTML = formatText(algo.what);

        // Update why section
        const whyElement = document.getElementById('algo-why');
        whyElement.innerHTML = formatText(algo.why);

        // Render resources
        renderResources(algo.resources);

        // Render problems
        renderProblems(algo.problems);

        // Render prerequisites
        if (algo.prerequisites && algo.prerequisites.length > 0) {
            document.getElementById('prerequisites-card').style.display = 'block';
            renderPrerequisites(algo.prerequisites);
        }

        // Render related topics
        if (algo.related && algo.related.length > 0) {
            document.getElementById('related-card').style.display = 'block';
            renderRelated(algo.related);
        }
    }

    /**
     * Format text with line breaks and bullet points
     */
    function formatText(text) {
        if (!text) return '';
        
        // Convert markdown-style formatting
        return text
            .split('\n')
            .map(line => {
                line = line.trim();
                if (!line) return '<br>';
                
                // Bold text
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // Bullet points
                if (line.startsWith('•')) {
                    return `<p class="bullet-point">${line}</p>`;
                }
                
                return `<p>${line}</p>`;
            })
            .join('');
    }

    /**
     * Render learning resources
     */
    function renderResources(resources) {
        const container = document.getElementById('algo-resources');
        
        if (!resources || resources.length === 0) {
            container.innerHTML = '<p>لا توجد مصادر متاحة حالياً</p>';
            return;
        }

        container.innerHTML = resources.map(resource => {
            const typeIcon = getResourceIcon(resource.type);
            const langBadge = resource.language === 'ar' ? 
                '<span class="resource-badge ar">عربي</span>' : 
                '<span class="resource-badge en">English</span>';
            const difficultyBadge = `<span class="resource-badge difficulty">${resource.difficulty}</span>`;

            return `
                <a href="${resource.url}" target="_blank" class="resource-item external-link">
                    <div class="resource-icon">${typeIcon}</div>
                    <div class="resource-content">
                        <h4 class="resource-title">${resource.title}</h4>
                        <div class="resource-meta">
                            ${langBadge}
                            ${difficultyBadge}
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    }

    /**
     * Render practice problems
     */
    function renderProblems(problems) {
        const container = document.getElementById('algo-problems');
        
        if (!problems || problems.length === 0) {
            container.innerHTML = '<p>لا توجد مسائل متاحة حالياً</p>';
            return;
        }

        container.innerHTML = problems.map(problem => {
            const platformBadge = `<span class="problem-badge platform">${problem.platform}</span>`;
            const difficultyBadge = `<span class="problem-badge difficulty">${problem.difficulty}</span>`;
            const tags = problem.tags.map(tag => 
                `<span class="problem-tag">${tag}</span>`
            ).join('');

            return `
                <a href="${problem.url}" target="_blank" class="problem-item external-link">
                    <div class="problem-header">
                        <h4 class="problem-title">${problem.title}</h4>
                        <div class="problem-badges">
                            ${platformBadge}
                            ${difficultyBadge}
                        </div>
                    </div>
                    <div class="problem-tags">${tags}</div>
                </a>
            `;
        }).join('');
    }

    /**
     * Render prerequisites
     */
    function renderPrerequisites(prerequisites) {
        const container = document.getElementById('algo-prerequisites');
        container.innerHTML = prerequisites.map(prereq => 
            `<li>✓ ${prereq}</li>`
        ).join('');
    }

    /**
     * Render related topics
     */
    function renderRelated(related) {
        const container = document.getElementById('algo-related');
        container.innerHTML = related.map(topic => 
            `<li><a href="algorithm.html?id=${topic.id}">${topic.title}</a></li>`
        ).join('');
    }

    /**
     * Get resource type icon
     */
    function getResourceIcon(type) {
        const icons = {
            video: '📹',
            article: '📄',
            interactive: '💻',
            book: '📚'
        };
        return icons[type] || '📎';
    }

    /**
     * Show error state
     */
    function showError() {
        loadingState.style.display = 'none';
        errorState.style.display = 'flex';
    }

    /**
     * Setup external links
     */
    function setupExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            if (link.hostname === window.location.hostname) {
                return;
            }

            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            if (!link.classList.contains('external-link')) {
                link.classList.add('external-link');
            }
        });
    }

    /**
     * Setup quick links smooth scroll
     */
    function setupQuickLinks() {
        const quickLinks = document.querySelectorAll('.quick-links a');
        
        quickLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();