/* ============================================
   PORTFOLIO SYSTEM - MAIN JAVASCRIPT
   ============================================
   Version: 4.0.0 | Complete Functionality
   ============================================ */

// ==================== CONFIGURATION ====================
const CONFIG = {
    GAS_URL: 'YOUR_GAS_WEB_APP_URL', // আপনার GAS Web App URL
    API_KEY: 'PORTFOLIO_FRONT_KEY_', // Config.gs থেকে পাওয়া API Key
    CACHE_ENABLED: true,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    DEBUG_MODE: false,
    
    // GitHub Configuration
    GITHUB: {
        USERNAME: 'yourusername',
        API_URL: 'https://api.github.com/users/yourusername'
    },
    
    // Default Images
    IMAGES: {
        PROJECT: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        CERTIFICATE: 'https://images.unsplash.com/photo-1585241936939-be4099591252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        ARTICLE: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        PROFILE: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80'
    }
};

// ==================== STATE MANAGEMENT ====================
const STATE = {
    theme: localStorage.getItem('portfolio-theme') || 'light',
    language: localStorage.getItem('portfolio-language') || 'en',
    currentPage: 1,
    projectsPerPage: 6,
    loadedData: {
        projects: [],
        certificates: [],
        articles: [],
        skills: [],
        settings: {}
    },
    cache: new Map(),
    dataCleaner: {
        currentData: null,
        originalData: null,
        stats: {
            rows: 0,
            columns: 0,
            cleanedRows: 0,
            removedDuplicates: 0,
            missingValues: 0,
            dataQuality: 0
        }
    }
};

// ==================== DOM ELEMENTS ====================
const DOM = {
    // Loading
    loadingScreen: document.getElementById('loadingScreen'),
    loaderProgress: document.getElementById('loaderProgress'),
    
    // Theme & Language
    themeToggle: document.getElementById('themeToggle'),
    themeIcon: document.getElementById('themeIcon'),
    languageSelect: document.getElementById('languageSelect'),
    
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    navContainer: document.querySelector('.nav-links'),
    backToTop: document.getElementById('backToTop'),
    
    // Hero Section
    typewriter: document.getElementById('typewriter'),
    projectsCount: document.getElementById('projectsCount'),
    certificatesCount: document.getElementById('certificatesCount'),
    githubStars: document.getElementById('githubStars'),
    
    // Content Containers
    projectsContainer: document.getElementById('projectsContainer'),
    certificatesContainer: document.getElementById('certificatesContainer'),
    articlesContainer: document.getElementById('articlesContainer'),
    skillsContainer: document.getElementById('skillsContainer'),
    
    // Modals
    articleModal: document.getElementById('articleModal'),
    closeArticleModal: document.getElementById('closeArticleModal'),
    articleContent: document.getElementById('articleContent'),
    
    // Data Cleaner
    uploadZone: document.getElementById('uploadZone'),
    csvFileInput: document.getElementById('csvFileInput'),
    uploadBtn: document.getElementById('uploadBtn'),
    processDataBtn: document.getElementById('processData'),
    resetDataBtn: document.getElementById('resetData'),
    dataTable: document.getElementById('dataTable'),
    dataStats: document.getElementById('dataStats'),
    exportCSV: document.getElementById('exportCSV'),
    exportExcel: document.getElementById('exportExcel'),
    copyData: document.getElementById('copyData'),
    cleanedRows: document.getElementById('cleanedRows'),
    removedDuplicates: document.getElementById('removedDuplicates'),
    missingValues: document.getElementById('missingValues'),
    dataQuality: document.getElementById('dataQuality'),
    
    // Contact Form
    contactForm: document.getElementById('contactForm'),
    submitBtn: document.getElementById('submitBtn'),
    btnText: document.getElementById('btnText'),
    btnSpinner: document.getElementById('btnSpinner'),
    btnIcon: document.getElementById('btnIcon'),
    formStatus: document.getElementById('formStatus'),
    
    // Charts
    skillsChart: null,
    
    // Toast
    toastContainer: document.getElementById('toastContainer'),
    
    // Current Year
    currentYear: document.getElementById('currentYear')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initializing Portfolio System...');
        
        // Update current year
        updateCurrentYear();
        
        // Initialize core features
        initTheme();
        initLanguage();
        initNavigation();
        initScrollEffects();
        initTypewriter();
        initAOS();
        
        // Initialize charts
        initSkillsChart();
        
        // Initialize data cleaner
        initDataCleaner();
        
        // Initialize contact form
        initContactForm();
        
        // Load all data
        await Promise.all([
            loadAllData(),
            loadGitHubStats()
        ]);
        
        // Initialize quick stats animation
        initQuickStats();
        
        // Hide loading screen
        setTimeout(() => {
            hideLoadingScreen();
            showToast('Portfolio loaded successfully!', 'success');
        }, 500);
        
        // Log initialization
        logEvent('portfolio_loaded', {
            theme: STATE.theme,
            language: STATE.language,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Failed to load portfolio. Please refresh.', 'error');
        hideLoadingScreen();
    }
});

// ==================== THEME MANAGEMENT ====================
function initTheme() {
    // Set initial theme
    setTheme(STATE.theme);
    
    // Theme toggle event
    DOM.themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function toggleTheme() {
    const newTheme = STATE.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Log event
    logEvent('theme_changed', { theme: newTheme });
}

function setTheme(theme) {
    STATE.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    
    // Update icon
    if (DOM.themeIcon) {
        const icon = DOM.themeIcon.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Update charts if they exist
    if (DOM.skillsChart) {
        updateChartTheme();
    }
}

// ==================== LANGUAGE MANAGEMENT ====================
function initLanguage() {
    DOM.languageSelect.value = STATE.language;
    
    DOM.languageSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
    });
}

function setLanguage(lang) {
    STATE.language = lang;
    localStorage.setItem('portfolio-language', lang);
    
    // Update page language
    document.documentElement.lang = lang;
    
    // Here you would update all text elements
    // For now, we'll just show a toast
    showToast(`Language changed to ${lang === 'en' ? 'English' : 'বাংলা'}`, 'info');
    
    // Log event
    logEvent('language_changed', { language: lang });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
                
                // Close mobile menu if open
                if (DOM.navContainer.classList.contains('active')) {
                    DOM.navContainer.classList.remove('active');
                }
            }
        });
    });
    
    // Mobile menu toggle
    if (DOM.mobileMenuBtn) {
        DOM.mobileMenuBtn.addEventListener('click', () => {
            DOM.navContainer.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && DOM.navContainer.classList.contains('active')) {
            DOM.navContainer.classList.remove('active');
        }
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
    
    // Back to top button
    initBackToTop();
}

function updateActiveNavLink(targetId) {
    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            DOM.backToTop.classList.add('visible');
        } else {
            DOM.backToTop.classList.remove('visible');
        }
    });
    
    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            hero.style.transform = `translate3d(0, ${scrolled * 0.1}px, 0)`;
        }
    });
}

// ==================== TYPING EFFECT ====================
function initTypewriter() {
    if (!DOM.typewriter) return;
    
    const texts = [
        "data into insights",
        "spreadsheets into stories",
        "numbers into narratives",
        "metrics into decisions",
        "information into action"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        if (isPaused) return;
        
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            DOM.typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            DOM.typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at the end
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            // Continue typing/deleting
            const speed = isDeleting ? 50 : 100;
            setTimeout(type, speed);
        }
    }
    
    // Start typing
    setTimeout(type, 1000);
    
    // Pause on hover
    DOM.typewriter.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    DOM.typewriter.addEventListener('mouseleave', () => {
        isPaused = false;
        setTimeout(type, 500);
    });
}

// ==================== AOS ANIMATIONS ====================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ==================== DATA LOADING ====================
async function loadAllData() {
    try {
        updateLoaderProgress(20);
        
        // Try to load from cache first
        const cachedData = getCachedData('portfolio_data');
        if (cachedData && CONFIG.CACHE_ENABLED) {
            STATE.loadedData = cachedData;
            updateLoaderProgress(60);
            renderAllData();
            return;
        }
        
        // Load from API
        const [projects, certificates, articles, skills, settings] = await Promise.all([
            fetchData('projects'),
            fetchData('certificates'),
            fetchData('articles'),
            fetchData('skills'),
            fetchData('settings')
        ]);
        
        updateLoaderProgress(80);
        
        // Update state
        STATE.loadedData = {
            projects: projects.data || [],
            certificates: certificates.data || [],
            articles: articles.data || [],
            skills: skills.data || [],
            settings: settings.data || {},
            groupedSkills: skills.grouped || {}
        };
        
        // Cache the data
        if (CONFIG.CACHE_ENABLED) {
            cacheData('portfolio_data', STATE.loadedData);
        }
        
        updateLoaderProgress(100);
        renderAllData();
        
        // Log event
        logEvent('data_loaded', {
            projects: projects.data?.length || 0,
            certificates: certificates.data?.length || 0,
            articles: articles.data?.length || 0,
            skills: skills.data?.length || 0
        });
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Failed to load data from server', 'error');
        renderErrorStates();
    }
}

async function fetchData(endpoint, params = {}) {
    try {
        const url = new URL(CONFIG.GAS_URL);
        url.searchParams.append('action', `get${capitalizeFirst(endpoint)}`);
        
        // Add API key
        url.searchParams.append('api_key', CONFIG.API_KEY);
        
        // Add other params
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': CONFIG.API_KEY
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'success') {
            throw new Error(data.message || 'API error');
        }
        
        return data;
        
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

function renderAllData() {
    // Update counts
    if (DOM.projectsCount) {
        DOM.projectsCount.textContent = STATE.loadedData.projects.length;
        animateValue(DOM.projectsCount, 0, STATE.loadedData.projects.length, 1000);
    }
    
    if (DOM.certificatesCount) {
        DOM.certificatesCount.textContent = STATE.loadedData.certificates.length;
        animateValue(DOM.certificatesCount, 0, STATE.loadedData.certificates.length, 1000);
    }
    
    // Render data
    renderProjects();
    renderCertificates();
    renderArticles();
    renderSkills();
    
    // Update chart data
    updateSkillsChartData();
}

function renderProjects() {
    if (!DOM.projectsContainer || !STATE.loadedData.projects.length) return;
    
    // Clear container
    DOM.projectsContainer.innerHTML = '';
    
    // Filter featured projects for first view
    const featuredProjects = STATE.loadedData.projects.filter(p => p.featured);
    const projectsToShow = featuredProjects.length > 0 ? featuredProjects : STATE.loadedData.projects.slice(0, 6);
    
    projectsToShow.forEach(project => {
        const projectElement = createProjectElement(project);
        DOM.projectsContainer.appendChild(projectElement);
    });
    
    // Initialize project filters
    initProjectFilters();
}

function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.dataset.category = project.category?.toLowerCase() || 'all';
    div.dataset.id = project.id;
    
    // Calculate time ago
    const timeAgo = project.date ? getTimeAgo(project.date) : 'Recent';
    
    div.innerHTML = `
        <div class="project-image">
            <img src="${project.image || CONFIG.IMAGES.PROJECT}" 
                 alt="${project.title}" 
                 loading="lazy"
                 onerror="this.src='${CONFIG.IMAGES.PROJECT}'">
            <div class="project-overlay">
                <div class="project-links">
                    ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i>
                    </a>` : ''}
                </div>
            </div>
            <div class="project-tags">
                ${(project.tags || []).slice(0, 3).map(tag => `
                    <span class="tag">${tag}</span>
                `).join('')}
            </div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description || ''}</p>
            <div class="project-meta">
                <span class="meta-item">
                    <i class="fas fa-calendar"></i>
                    ${timeAgo}
                </span>
                <span class="meta-item">
                    <i class="fas fa-eye"></i>
                    ${project.views || 0} views
                </span>
                ${project.status ? `<span class="meta-item status ${project.status.toLowerCase()}">
                    ${project.status}
                </span>` : ''}
            </div>
            <button class="btn btn-outline view-project" data-project-id="${project.id}">
                <i class="fas fa-external-link-alt"></i>
                View Details
            </button>
        </div>
    `;
    
    // Add click event for view details
    const viewBtn = div.querySelector('.view-project');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            viewProjectDetails(project);
        });
    }
    
    return div;
}

function renderCertificates() {
    if (!DOM.certificatesContainer || !STATE.loadedData.certificates.length) return;
    
    DOM.certificatesContainer.innerHTML = '';
    
    STATE.loadedData.certificates.forEach(certificate => {
        const certElement = createCertificateElement(certificate);
        DOM.certificatesContainer.appendChild(certElement);
    });
}

function createCertificateElement(certificate) {
    const div = document.createElement('div');
    div.className = 'certificate-card';
    
    // Format date
    const issueDate = certificate.issueDate ? 
        new Date(certificate.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        }) : '';
    
    div.innerHTML = `
        <div class="certificate-image">
            <img src="${certificate.image || CONFIG.IMAGES.CERTIFICATE}" 
                 alt="${certificate.title}" 
                 loading="lazy"
                 onerror="this.src='${CONFIG.IMAGES.CERTIFICATE}'">
            <div class="certificate-overlay">
                ${certificate.verifyUrl ? `
                    <a href="${certificate.verifyUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i>
                        Verify
                    </a>
                ` : ''}
            </div>
        </div>
        <div class="certificate-content">
            <h3 class="certificate-title">${certificate.title}</h3>
            <p class="certificate-issuer">${certificate.issuer}</p>
            <div class="certificate-meta">
                <span class="meta-item">
                    <i class="fas fa-calendar"></i>
                    ${issueDate}
                </span>
                ${certificate.credentialId ? `
                    <span class="meta-item">
                        <i class="fas fa-id-card"></i>
                        ID: ${certificate.credentialId}
                    </span>
                ` : ''}
            </div>
            ${certificate.skills && certificate.skills.length > 0 ? `
                <div class="certificate-skills">
                    ${certificate.skills.slice(0, 3).map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    return div;
}

function renderArticles() {
    if (!DOM.articlesContainer || !STATE.loadedData.articles.length) return;
    
    DOM.articlesContainer.innerHTML = '';
    
    STATE.loadedData.articles.forEach(article => {
        const articleElement = createArticleElement(article);
        DOM.articlesContainer.appendChild(articleElement);
    });
    
    // Initialize article modal
    initArticleModal();
}

function createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'article-card';
    div.dataset.id = article.id;
    
    // Format date
    const publishDate = article.publishedDate ? 
        new Date(article.publishedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }) : '';
    
    div.innerHTML = `
        <div class="article-image">
            <img src="${article.image || CONFIG.IMAGES.ARTICLE}" 
                 alt="${article.title}" 
                 loading="lazy"
                 onerror="this.src='${CONFIG.IMAGES.ARTICLE}'">
            <div class="article-category">
                ${article.category || 'Article'}
            </div>
        </div>
        <div class="article-content">
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt || ''}</p>
            <div class="article-meta">
                <span class="meta-item">
                    <i class="fas fa-calendar"></i>
                    ${publishDate}
                </span>
                <span class="meta-item">
                    <i class="fas fa-clock"></i>
                    ${article.readTime || '5 min read'}
                </span>
            </div>
            <button class="btn btn-outline read-article" data-article-id="${article.id}">
                <i class="fas fa-book-open"></i>
                Read Article
            </button>
        </div>
    `;
    
    // Add click event for reading article
    const readBtn = div.querySelector('.read-article');
    if (readBtn) {
        readBtn.addEventListener('click', () => {
            openArticleModal(article);
        });
    }
    
    return div;
}

function renderSkills() {
    if (!DOM.skillsContainer || !STATE.loadedData.skills.length) return;
    
    DOM.skillsContainer.innerHTML = '';
    
    // Group skills by category if available
    if (STATE.loadedData.groupedSkills) {
        Object.entries(STATE.loadedData.groupedSkills).forEach(([category, skills]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skills-category';
            
            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);
            
            const skillsGrid = document.createElement('div');
            skillsGrid.className = 'skills-grid-category';
            
            skills.forEach(skill => {
                const skillElement = createSkillElement(skill);
                skillsGrid.appendChild(skillElement);
            });
            
            categoryDiv.appendChild(skillsGrid);
            DOM.skillsContainer.appendChild(categoryDiv);
        });
    } else {
        // Fallback to simple list
        STATE.loadedData.skills.forEach(skill => {
            const skillElement = createSkillElement(skill);
            DOM.skillsContainer.appendChild(skillElement);
        });
    }
}

function createSkillElement(skill) {
    const div = document.createElement('div');
    div.className = 'skill-card';
    
    div.innerHTML = `
        <div class="skill-header">
            <div class="skill-icon" style="background: ${skill.color || '#4F46E5'}">
                <i class="${skill.icon || 'fas fa-code'}"></i>
            </div>
            <div class="skill-info">
                <h4 class="skill-name">${skill.name}</h4>
                <span class="skill-experience">${skill.experience || ''}</span>
            </div>
        </div>
        <div class="skill-progress">
            <div class="progress-bar" style="width: ${skill.percentage || 50}%"></div>
        </div>
        <div class="skill-footer">
            <span class="skill-percentage">${skill.percentage || 50}%</span>
            <span class="skill-level">${getSkillLevel(skill.percentage)}</span>
        </div>
        ${skill.description ? `<p class="skill-description">${skill.description}</p>` : ''}
    `;
    
    return div;
}

function getSkillLevel(percentage) {
    if (percentage >= 90) return 'Expert';
    if (percentage >= 80) return 'Advanced';
    if (percentage >= 70) return 'Intermediate';
    if (percentage >= 60) return 'Beginner';
    return 'Novice';
}

// ==================== PROJECT FILTERS ====================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==================== ARTICLE MODAL ====================
function initArticleModal() {
    if (!DOM.articleModal || !DOM.closeArticleModal) return;
    
    // Close modal on button click
    DOM.closeArticleModal.addEventListener('click', closeArticleModal);
    
    // Close modal on overlay click
    DOM.articleModal.addEventListener('click', (e) => {
        if (e.target === DOM.articleModal) {
            closeArticleModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.articleModal.classList.contains('active')) {
            closeArticleModal();
        }
    });
}

async function openArticleModal(article) {
    try {
        // Show loading state
        DOM.articleContent.innerHTML = `
            <div class="article-loading">
                <div class="spinner"></div>
                <p>Loading article...</p>
            </div>
        `;
        
        DOM.articleModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // If article has Google Doc ID, fetch content
        let content = article.content;
        if (article.docId && !content) {
            const response = await fetchData('articleContent', { docId: article.docId });
            content = response.data?.content || article.excerpt;
        }
        
        // Render article content
        DOM.articleContent.innerHTML = `
            <article class="article-full">
                <div class="article-header">
                    <div class="article-badge">
                        <span class="category">${article.category || 'Article'}</span>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${article.readTime || '5 min read'}
                        </span>
                    </div>
                    <h1 class="article-title">${article.title}</h1>
                    <div class="article-meta">
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${new Date(article.publishedDate || Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${article.views || 0} views
                        </span>
                    </div>
                </div>
                
                ${article.image ? `
                    <div class="article-hero">
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                    </div>
                ` : ''}
                
                <div class="article-body">
                    ${content || article.excerpt || '<p>Content not available.</p>'}
                </div>
                
                <div class="article-footer">
                    <div class="article-tags">
                        ${(article.tags || []).map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <div class="article-share">
                        <span>Share this article:</span>
                        <div class="share-buttons">
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}" 
                               target="_blank" class="share-btn twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" 
                               target="_blank" class="share-btn linkedin">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
                               target="_blank" class="share-btn facebook">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <button class="share-btn copy-link" data-url="${window.location.href}">
                                <i class="fas fa-link"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
        
        // Initialize copy link button
        const copyLinkBtn = DOM.articleContent.querySelector('.copy-link');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        showToast('Link copied to clipboard!', 'success');
                    })
                    .catch(() => {
                        showToast('Failed to copy link', 'error');
                    });
            });
        }
        
        // Update view count (increment by 1)
        // You would typically send this to your backend
        logEvent('article_viewed', {
            article_id: article.id,
            article_title: article.title
        });
        
    } catch (error) {
        console.error('Error loading article:', error);
        DOM.articleContent.innerHTML = `
            <div class="article-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to load article</h3>
                <p>Please try again later.</p>
                <button class="btn btn-primary" onclick="closeArticleModal()">
                    Close
                </button>
            </div>
        `;
    }
}

function closeArticleModal() {
    DOM.articleModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    DOM.articleContent.innerHTML = '';
}

// ==================== SKILLS CHART ====================
function initSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    
    DOM.skillsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: getChartOptions()
    });
    
    // Initialize chart controls
    initChartControls();
}

function getChartOptions() {
    const isDark = STATE.theme === 'dark';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDark ? '#F1F5F9' : '#1F2937',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                titleColor: isDark ? '#F1F5F9' : '#1F2937',
                bodyColor: isDark ? '#94A3B8' : '#6B7280',
                borderColor: isDark ? '#334155' : '#E5E7EB',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDark ? '#94A3B8' : '#6B7280'
                }
            },
            y: {
                grid: {
                    color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    color: isDark ? '#94A3B8' : '#6B7280',
                    callback: function(value) {
                        return value + '%';
                    }
                },
                beginAtZero: true,
                max: 100
            }
        },
        interaction: {
            intersect: false,
            mode: 'nearest'
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear'
            }
        }
    };
}

function updateSkillsChartData() {
    if (!DOM.skillsChart || !STATE.loadedData.skills.length) return;
    
    // Group skills by month (simulated data for demo)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get top 3 skills for the chart
    const topSkills = [...STATE.loadedData.skills]
        .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
        .slice(0, 3);
    
    const datasets = topSkills.map((skill, index) => {
        const colors = [
            'rgba(79, 70, 229, 0.8)',   // Primary
            'rgba(16, 185, 129, 0.8)',  // Secondary
            'rgba(245, 158, 11, 0.8)'   // Accent
        ];
        
        const borderColors = [
            'rgb(79, 70, 229)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)'
        ];
        
        // Generate simulated monthly data
        const baseValue = skill.percentage || 50;
        const monthlyData = months.map((_, i) => {
            const monthProgress = (i / 11) * 20; // 20% growth over the year
            const fluctuation = Math.random() * 5 - 2.5; // ±2.5% fluctuation
            return Math.min(100, Math.max(0, baseValue - 10 + monthProgress + fluctuation));
        });
        
        return {
            label: skill.name,
            data: monthlyData,
            borderColor: borderColors[index % borderColors.length],
            backgroundColor: colors[index % colors.length],
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6
        };
    });
    
    DOM.skillsChart.data.labels = months;
    DOM.skillsChart.data.datasets = datasets;
    DOM.skillsChart.update();
}

function initChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    
    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.dataset.period;
            
            // Update active button
            chartBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update chart based on period
            updateChartForPeriod(period);
        });
    });
}

function updateChartForPeriod(period) {
    if (!DOM.skillsChart) return;
    
    let labels;
    switch(period) {
        case 'monthly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            break;
        case 'quarterly':
            labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            break;
        case 'yearly':
            labels = ['2020', '2021', '2022', '2023', '2024'];
            break;
        default:
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    
    // Update labels
    DOM.skillsChart.data.labels = labels;
    
    // Update data for each dataset
    DOM.skillsChart.data.datasets.forEach((dataset, index) => {
        const baseValue = 50 + (index * 10);
        dataset.data = labels.map((_, i) => {
            const progress = (i / (labels.length - 1)) * 20;
            return Math.min(100, baseValue + progress + (Math.random() * 10 - 5));
        });
    });
    
    DOM.skillsChart.update();
}

function updateChartTheme() {
    if (!DOM.skillsChart) return;
    
    const isDark = STATE.theme === 'dark';
    DOM.skillsChart.options = getChartOptions();
    DOM.skillsChart.update();
}

// ==================== DATA CLEANER ====================
function initDataCleaner() {
    if (!DOM.uploadZone || !DOM.csvFileInput) return;
    
    // File upload handling
    DOM.uploadBtn.addEventListener('click', () => {
        DOM.csvFileInput.click();
    });
    
    DOM.csvFileInput.addEventListener('change', handleFileUpload);
    
    // Drag and drop
    DOM.uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.uploadZone.classList.add('drag-over');
    });
    
    DOM.uploadZone.addEventListener('dragleave', () => {
        DOM.uploadZone.classList.remove('drag-over');
    });
    
    DOM.uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.uploadZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Click to upload
    DOM.uploadZone.addEventListener('click', () => {
        DOM.csvFileInput.click();
    });
    
    // Process data button
    DOM.processDataBtn.addEventListener('click', processData);
    
    // Reset data button
    DOM.resetDataBtn.addEventListener('click', resetData);
    
    // Export buttons
    DOM.exportCSV.addEventListener('click', exportCSV);
    DOM.exportExcel.addEventListener('click', exportExcel);
    DOM.copyData.addEventListener('click', copyDataToClipboard);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file
    if (!file.name.endsWith('.csv')) {
        showToast('Please upload a CSV file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('File size should be less than 5MB', 'error');
        return;
    }
    
    // Show loading state
    DOM.uploadZone.innerHTML = `
        <div class="upload-loading">
            <div class="spinner"></div>
            <p>Processing ${file.name}...</p>
        </div>
    `;
    
    // Read file
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csvContent = e.target.result;
            parseCSV(csvContent);
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showToast('Error parsing CSV file', 'error');
            resetUploadZone();
        }
    };
    
    reader.onerror = function() {
        showToast('Error reading file', 'error');
        resetUploadZone();
    };
    
    reader.readAsText(file);
}

function parseCSV(csvContent) {
    try {
        // Parse CSV (simple parsing - for production use PapaParse)
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
        }
        
        // Update state
        STATE.dataCleaner.originalData = data;
        STATE.dataCleaner.currentData = JSON.parse(JSON.stringify(data)); // Deep copy
        
        // Update stats
        updateDataStats();
        
        // Render preview
        renderDataPreview();
        
        // Show success
        showToast(`Loaded ${data.length} rows successfully`, 'success');
        
    } catch (error) {
        console.error('CSV parsing error:', error);
        showToast('Invalid CSV format', 'error');
        resetUploadZone();
    }
}

function updateDataStats() {
    const data = STATE.dataCleaner.currentData;
    if (!data || data.length === 0) return;
    
    const stats = STATE.dataCleaner.stats;
    stats.rows = data.length;
    stats.columns = Object.keys(data[0]).length;
    
    // Calculate duplicates (simplified)
    const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
    stats.removedDuplicates = data.length - uniqueRows.size;
    
    // Calculate missing values
    let missingCount = 0;
    data.forEach(row => {
        Object.values(row).forEach(value => {
            if (value === '' || value === null || value === undefined) {
                missingCount++;
            }
        });
    });
    stats.missingValues = missingCount;
    
    // Calculate data quality score (0-100%)
    const totalCells = stats.rows * stats.columns;
    const cleanCells = totalCells - missingCount;
    stats.dataQuality = totalCells > 0 ? Math.round((cleanCells / totalCells) * 100) : 0;
    
    // Update UI
    DOM.cleanedRows.textContent = stats.rows;
    DOM.removedDuplicates.textContent = stats.removedDuplicates;
    DOM.missingValues.textContent = stats.missingValues;
    DOM.dataQuality.textContent = `${stats.dataQuality}%`;
    
    // Update data stats display
    if (DOM.dataStats) {
        DOM.dataStats.innerHTML = `
            <span>${stats.rows} rows</span>
            <span>${stats.columns} columns</span>
        `;
    }
}

function renderDataPreview() {
    if (!DOM.dataTable || !STATE.dataCleaner.currentData) return;
    
    const data = STATE.dataCleaner.currentData;
    const headers = Object.keys(data[0] || {});
    
    // Clear table
    DOM.dataTable.innerHTML = '';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    DOM.dataTable.appendChild(thead);
    
    // Create body (show first 10 rows)
    const tbody = document.createElement('tbody');
    const rowsToShow = Math.min(10, data.length);
    
    for (let i = 0; i < rowsToShow; i++) {
        const row = document.createElement('tr');
        
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = data[i][header] || '';
            td.title = data[i][header] || '';
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    }
    
    DOM.dataTable.appendChild(tbody);
    
    // Reset upload zone
    resetUploadZone();
}

function processData() {
    if (!STATE.dataCleaner.currentData) {
        showToast('Please upload data first', 'warning');
        return;
    }
    
    // Show processing state
    DOM.processDataBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span>Processing...</span>
    `;
    DOM.processDataBtn.disabled = true;
    
    // Get selected options
    const options = {
        removeDuplicates: document.getElementById('removeDuplicates').checked,
        handleMissing: document.getElementById('handleMissing').checked,
        removeOutliers: document.getElementById('removeOutliers').checked,
        normalizeData: document.getElementById('normalizeData').checked,
        formatDates: document.getElementById('formatDates').checked,
        trimSpaces: document.getElementById('trimSpaces').checked
    };
    
    // Simulate processing delay
    setTimeout(() => {
        try {
            // Apply cleaning operations
            let processedData = [...STATE.dataCleaner.currentData];
            
            // Remove duplicates
            if (options.removeDuplicates) {
                const uniqueRows = new Map();
                processedData = processedData.filter(row => {
                    const key = JSON.stringify(row);
                    if (!uniqueRows.has(key)) {
                        uniqueRows.set(key, true);
                        return true;
                    }
                    return false;
                });
            }
            
            // Handle missing values (simple imputation with mean for numeric columns)
            if (options.handleMissing) {
                const numericColumns = findNumericColumns(processedData);
                
                numericColumns.forEach(column => {
                    const values = processedData
                        .map(row => parseFloat(row[column]))
                        .filter(val => !isNaN(val));
                    
                    if (values.length > 0) {
                        const mean = values.reduce((a, b) => a + b, 0) / values.length;
                        
                        processedData.forEach(row => {
                            if (row[column] === '' || isNaN(parseFloat(row[column]))) {
                                row[column] = mean.toFixed(2);
                            }
                        });
                    }
                });
            }
            
            // Trim spaces
            if (options.trimSpaces) {
                processedData.forEach(row => {
                    Object.keys(row).forEach(key => {
                        if (typeof row[key] === 'string') {
                            row[key] = row[key].trim();
                        }
                    });
                });
            }
            
            // Update state
            STATE.dataCleaner.currentData = processedData;
            
            // Update stats and preview
            updateDataStats();
            renderDataPreview();
            
            // Show success
            showToast(`Data cleaned successfully!`, 'success');
            
            // Log event
            logEvent('data_cleaned', {
                rows: processedData.length,
                options: options
            });
            
        } catch (error) {
            console.error('Error processing data:', error);
            showToast('Error processing data', 'error');
        } finally {
            // Reset button state
            DOM.processDataBtn.innerHTML = `
                <i class="fas fa-magic"></i>
                <span>Process Data</span>
            `;
            DOM.processDataBtn.disabled = false;
        }
    }, 1000);
}

function findNumericColumns(data) {
    if (!data || data.length === 0) return [];
    
    const firstRow = data[0];
    const numericColumns = [];
    
    Object.keys(firstRow).forEach(key => {
        const sampleValues = data.slice(0, 10).map(row => row[key]);
        const hasNumbers = sampleValues.some(val => !isNaN(parseFloat(val)) && isFinite(val));
        
        if (hasNumbers) {
            numericColumns.push(key);
        }
    });
    
    return numericColumns;
}

function resetData() {
    if (!STATE.dataCleaner.originalData) {
        showToast('No data to reset', 'warning');
        return;
    }
    
    // Reset to original data
    STATE.dataCleaner.currentData = JSON.parse(JSON.stringify(STATE.dataCleaner.originalData));
    
    // Update stats and preview
    updateDataStats();
    renderDataPreview();
    
    showToast('Data reset to original', 'info');
}

function exportCSV() {
    if (!STATE.dataCleaner.currentData) {
        showToast('No data to export', 'warning');
        return;
    }
    
    try {
        const data = STATE.dataCleaner.currentData;
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
            const rowValues = headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvContent += rowValues.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cleaned_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('CSV exported successfully', 'success');
        
        // Log event
        logEvent('data_exported', { format: 'csv', rows: data.length });
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        showToast('Error exporting CSV', 'error');
    }
}

function exportExcel() {
    showToast('Excel export requires additional libraries. Using CSV instead.', 'info');
    exportCSV(); // Fallback to CSV
}

function copyDataToClipboard() {
    if (!STATE.dataCleaner.currentData) {
        showToast('No data to copy', 'warning');
        return;
    }
    
    try {
        const data = STATE.dataCleaner.currentData;
        const headers = Object.keys(data[0]);
        
        // Create tab-separated content for clipboard
        let textContent = headers.join('\t') + '\n';
        
        data.slice(0, 100).forEach(row => { // Limit to 100 rows
            const rowValues = headers.map(header => row[header]);
            textContent += rowValues.join('\t') + '\n';
        });
        
        navigator.clipboard.writeText(textContent)
            .then(() => {
                showToast('Data copied to clipboard (first 100 rows)', 'success');
                
                // Log event
                logEvent('data_copied', { rows: Math.min(100, data.length) });
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                showToast('Failed to copy data', 'error');
            });
            
    } catch (error) {
        console.error('Error copying data:', error);
        showToast('Error copying data', 'error');
    }
}

function resetUploadZone() {
    DOM.uploadZone.innerHTML = `
        <div class="upload-content">
            <i class="fas fa-cloud-upload-alt"></i>
            <h4>Upload CSV File</h4>
            <p>Drag & drop or click to upload</p>
            <button class="btn btn-primary" id="uploadBtn">
                <i class="fas fa-file-upload"></i>
                <span>Choose File</span>
            </button>
            <p class="upload-note">Supports files up to 5MB (.csv format)</p>
        </div>
    `;
    
    // Re-attach event listeners
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            DOM.csvFileInput.click();
        });
    }
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    if (!DOM.contactForm) return;
    
    DOM.contactForm.addEventListener('submit', handleContactSubmit);
    
    // Real-time validation
    const inputs = DOM.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', validateField);
        input.addEventListener('blur', validateField);
    });
}

function validateField(e) {
    const field = e.target;
    const fieldId = field.id;
    const errorElement = document.getElementById(`${fieldId}Error`);
    
    if (!errorElement) return;
    
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldId) {
        case 'name':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
            
        case 'message':
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (field.value.trim().length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
            break;
    }
    
    if (isValid) {
        errorElement.textContent = '';
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        errorElement.textContent = errorMessage;
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    return isValid;
}

function validateForm() {
    const fields = ['name', 'email', 'message'];
    let isValid = true;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const event = new Event('blur');
        field.dispatchEvent(event);
        
        if (field.classList.contains('invalid')) {
            isValid = false;
        }
    });
    
    return isValid;
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim(),
        source: 'Portfolio Website',
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    DOM.btnText.textContent = 'Sending...';
    DOM.btnSpinner.classList.remove('hidden');
    DOM.btnIcon.classList.add('hidden');
    DOM.submitBtn.disabled = true;
    
    try {
        // Send to backend
        const response = await fetch(CONFIG.GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                action: 'submitContact',
                ...formData
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            showFormStatus('success', result.message || 'Message sent successfully!');
            
            // Reset form
            DOM.contactForm.reset();
            
            // Remove validation classes
            const inputs = DOM.contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
            
            // Show toast
            showToast('Message sent successfully!', 'success');
            
            // Log event
            logEvent('contact_form_submitted', {
                name: formData.name,
                email: formData.email,
                subject: formData.subject
            });
            
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        showFormStatus('error', 'Failed to send message. Please try again.');
        showToast('Failed to send message', 'error');
    } finally {
        // Reset button state
        DOM.btnText.textContent = 'Send Message';
        DOM.btnSpinner.classList.add('hidden');
        DOM.btnIcon.classList.remove('hidden');
        DOM.submitBtn.disabled = false;
    }
}

function showFormStatus(type, message) {
    if (!DOM.formStatus) return;
    
    DOM.formStatus.className = `form-status ${type}`;
    DOM.formStatus.textContent = message;
    DOM.formStatus.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        DOM.formStatus.style.display = 'none';
    }, 5000);
}

// ==================== GITHUB STATS ====================
async function loadGitHubStats() {
    if (!DOM.githubStars) return;
    
    try {
        const response = await fetch(CONFIG.GITHUB.API_URL);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update stars count
        if (data.public_repos) {
            DOM.githubStars.textContent = data.public_repos;
            animateValue(DOM.githubStars, 0, data.public_repos, 1000);
        }
        
    } catch (error) {
        console.error('Error loading GitHub stats:', error);
        // Fallback value
        DOM.githubStars.textContent = '24';
    }
}

// ==================== QUICK STATS ANIMATION ====================
function initQuickStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.count);
                animateValue(element, 0, target, 2000);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ==================== UTILITY FUNCTIONS ====================
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function animateValue(element, start, end, duration) {
    if (start === end) return;
    
    const range = end - start;
    const startTime = performance.now();
    const increment = end > start ? 1 : -1;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = Math.floor(start + (range * progress));
        element.textContent = value.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString();
        }
    }
    
    requestAnimationFrame(update);
}

function updateLoaderProgress(percent) {
    if (DOM.loaderProgress) {
        DOM.loaderProgress.style.width = `${percent}%`;
    }
}

function hideLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 300);
    }
}

function showToast(message, type = 'info') {
    if (!DOM.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    DOM.toastContainer.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (toast.parentNode === DOM.toastContainer) {
                DOM.toastContainer.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function updateCurrentYear() {
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
}

function cacheData(key, data) {
    if (!CONFIG.CACHE_ENABLED) return;
    
    const cacheItem = {
        data: data,
        timestamp: Date.now()
    };
    
    STATE.cache.set(key, cacheItem);
    localStorage.setItem(`portfolio_cache_${key}`, JSON.stringify(cacheItem));
}

function getCachedData(key) {
    if (!CONFIG.CACHE_ENABLED) return null;
    
    // Check memory cache first
    if (STATE.cache.has(key)) {
        const item = STATE.cache.get(key);
        if (Date.now() - item.timestamp < CONFIG.CACHE_DURATION) {
            return item.data;
        }
    }
    
    // Check localStorage
    const stored = localStorage.getItem(`portfolio_cache_${key}`);
    if (stored) {
        try {
            const item = JSON.parse(stored);
            if (Date.now() - item.timestamp < CONFIG.CACHE_DURATION) {
                STATE.cache.set(key, item);
                return item.data;
            }
        } catch (error) {
            console.error('Error parsing cache:', error);
        }
    }
    
    return null;
}

function clearCache() {
    STATE.cache.clear();
    
    // Clear localStorage cache items
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('portfolio_cache_')) {
            localStorage.removeItem(key);
        }
    });
}

function logEvent(event, data = {}) {
    if (CONFIG.DEBUG_MODE) {
        console.log(`[Event] ${event}:`, data);
    }
    
    // Send to analytics backend if configured
    if (CONFIG.GAS_URL && CONFIG.API_KEY) {
        fetch(CONFIG.GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': CONFIG.API_KEY
            },
            body: JSON.stringify({
                action: 'logAnalytics',
                event: event,
                data: data,
                timestamp: new Date().toISOString(),
                page: window.location.href,
                userAgent: navigator.userAgent
            })
        }).catch(console.error); // Fail silently
    }
}

function viewProjectDetails(project) {
    // Create modal for project details
    const modalHTML = `
        <div class="project-modal">
            <div class="modal-header">
                <h2>${project.title}</h2>
                <button class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="project-hero">
                    <img src="${project.image || CONFIG.IMAGES.PROJECT}" alt="${project.title}">
                </div>
                <div class="project-details">
                    <div class="project-meta">
                        ${project.category ? `<span class="category">${project.category}</span>` : ''}
                        ${project.date ? `<span class="date"><i class="fas fa-calendar"></i> ${project.date}</span>` : ''}
                        ${project.views ? `<span class="views"><i class="fas fa-eye"></i> ${project.views} views</span>` : ''}
                    </div>
                    
                    <div class="project-description-full">
                        <h3>Description</h3>
                        <p>${project.description || 'No description available.'}</p>
                    </div>
                    
                    ${project.technologies && project.technologies.length > 0 ? `
                        <div class="project-technologies">
                            <h3>Technologies Used</h3>
                            <div class="tech-tags">
                                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${project.tags && project.tags.length > 0 ? `
                        <div class="project-tags-full">
                            <h3>Tags</h3>
                            <div class="tags">
                                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="project-links-full">
                        ${project.demoUrl ? `
                            <a href="${project.demoUrl}" target="_blank" class="btn btn-primary">
                                <i class="fas fa-external-link-alt"></i>
                                Live Demo
                            </a>
                        ` : ''}
                        
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
                                <i class="fab fa-github"></i>
                                View Code
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = modalHTML;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Add close functionality
    const closeBtn = overlay.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = 'auto';
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            document.body.style.overflow = 'auto';
        }
    });
    
    // Log view event
    logEvent('project_viewed', {
        project_id: project.id,
        project_title: project.title
    });
}

function renderErrorStates() {
    // Render error states for empty data
    if (DOM.projectsContainer && STATE.loadedData.projects.length === 0) {
        DOM.projectsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-project-diagram"></i>
                <h3>No Projects Found</h3>
                <p>Projects will appear here once added to the database.</p>
            </div>
        `;
    }
    
    if (DOM.certificatesContainer && STATE.loadedData.certificates.length === 0) {
        DOM.certificatesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-award"></i>
                <h3>No Certificates Found</h3>
                <p>Certificates will appear here once added to the database.</p>
            </div>
        `;
    }
    
    if (DOM.articlesContainer && STATE.loadedData.articles.length === 0) {
        DOM.articlesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-newspaper"></i>
                <h3>No Articles Found</h3>
                <p>Articles will appear here once added to the database.</p>
            </div>
        `;
    }
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    // Send error to analytics
    logEvent('error_occurred', {
        message: e.error?.message || 'Unknown error',
        stack: e.error?.stack,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
    
    // Show user-friendly message for critical errors
    if (e.error?.message?.includes('Failed to fetch')) {
        showToast('Connection error. Please check your internet connection.', 'error');
    }
});

// ==================== PERFORMANCE MONITORING ====================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        logEvent('performance_metrics', {
            load_time: loadTime,
            dns_lookup: timing.domainLookupEnd - timing.domainLookupStart,
            tcp_connect: timing.connectEnd - timing.connectStart,
            request_response: timing.responseEnd - timing.requestStart,
            dom_interactive: timing.domInteractive - timing.navigationStart,
            dom_complete: timing.domComplete - timing.navigationStart
        });
        
        if (loadTime > 3000) {
            console.warn(`Page load took ${loadTime}ms - Consider optimizing`);
        }
    });
}

// ==================== SERVICE WORKER SUPPORT ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
                logEvent('service_worker_registered', { scope: registration.scope });
            })
            .catch(error => {
                console.error('ServiceWorker registration failed:', error);
                logEvent('service_worker_failed', { error: error.message });
            });
    });
}

// ==================== OFFLINE DETECTION ====================
window.addEventListener('online', () => {
    showToast('You are back online', 'success');
    logEvent('network_online');
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 'warning');
    logEvent('network_offline');
});

// ==================== EXPORT FOR GLOBAL ACCESS ====================
window.PortfolioApp = {
    config: CONFIG,
    state: STATE,
    dom: DOM,
    utils: {
        showToast,
        animateValue,
        getTimeAgo,
        logEvent
    }
};

console.log('✅ Portfolio System initialized successfully!');
