// ==================== CONFIGURATION ====================
const CONFIG = {
    GAS_URL: 'https://script.google.com/macros/s/YOUR_GAS_URL_HERE/exec',
    GITHUB_USERNAME: 'itsmebillah',
    SHEET_ID: '1ZnoWdyyqzutrIs6SBnYfwN3a9aVsPNPJjzw9lWu76iE',
    
    // API Endpoints
    ENDPOINTS: {
        GET_DATA: '?action=getData',
        GET_PROJECTS: '?action=getProjects',
        GET_CERTIFICATES: '?action=getCertificates',
        GET_ARTICLES: '?action=getArticles',
        SUBMIT_FORM: '?action=submitForm'
    }
};

// ==================== STATE MANAGEMENT ====================
const STATE = {
    currentLang: 'en',
    currentTheme: 'light',
    skillsChart: null,
    predictionChart: null,
    currentProjectFilter: 'all',
    currentPage: 1,
    projectsPerPage: 6
};

// ==================== TRANSLATIONS ====================
const TRANSLATIONS = {
    en: {
        // Navigation
        home: "Home",
        about: "About",
        skills: "Skills",
        projects: "Projects",
        certificates: "Certificates",
        articles: "Articles",
        contact: "Contact",
        
        // Hero
        heroDesc: "Data Analyst specializing in Python, SQL, Power BI, and Data Visualization. Transforming raw data into actionable business intelligence.",
        viewProjects: "View Projects",
        contactMe: "Contact Me",
        projectsDone: "Projects",
        stars: "Stars",
        commits: "Commits",
        
        // About
        aboutTitle: "About Me",
        aboutSubtitle: "Passionate Data Analyst with expertise in transforming data into insights",
        
        // Skills
        skillsTitle: "Skills Dashboard",
        skillsSubtitle: "Live analytics of skills demand and market trends",
        
        // Projects
        projectsTitle: "My Projects",
        projectsSubtitle: "Data analysis projects that deliver business value",
        filterAll: "All",
        filterPython: "Python",
        filterSQL: "SQL",
        filterPowerBI: "Power BI",
        filterExcel: "Excel",
        loadMore: "Load More Projects",
        viewDetails: "View Details",
        
        // Certificates
        certificatesTitle: "Certificates",
        certificatesSubtitle: "Professional certifications and achievements",
        
        // Articles
        articlesTitle: "Articles & Blogs",
        articlesSubtitle: "Latest insights and tutorials on data analysis",
        readMore: "Read More",
        viewAll: "View All Articles",
        
        // Contact
        contactTitle: "Get In Touch",
        contactSubtitle: "Let's work together on your next data project",
        fullName: "Full Name *",
        emailAddress: "Email Address *",
        subject: "Subject",
        message: "Message *",
        sendMessage: "Send Message",
        responseTime: "I usually respond within 24 hours",
        
        // Notifications
        messageSent: "Message sent successfully!",
        messageError: "Failed to send message. Please try again.",
        loading: "Loading...",
        noProjects: "No projects found.",
        noCertificates: "No certificates found.",
        noArticles: "No articles found."
    },
    
    bn: {
        // Navigation
        home: "হোম",
        about: "সম্পর্কে",
        skills: "দক্ষতা",
        projects: "প্রজেক্ট",
        certificates: "সার্টিফিকেট",
        articles: "আর্টিকেল",
        contact: "যোগাযোগ",
        
        // Hero
        heroDesc: "পাইথন, এসকিউএল, পাওয়ার বিআই এবং ডেটা ভিজ্যুয়ালাইজেশনে বিশেষজ্ঞ ডেটা অ্যানালিস্ট। কাঁচা ডেটাকে ব্যবসায়িক বুদ্ধিমত্তায় রূপান্তর করা।",
        viewProjects: "প্রজেক্ট দেখুন",
        contactMe: "যোগাযোগ করুন",
        projectsDone: "প্রজেক্ট",
        stars: "স্টার",
        commits: "কমিট",
        
        // About
        aboutTitle: "আমার সম্পর্কে",
        aboutSubtitle: "ডেটাকে অন্তর্দৃষ্টিতে রূপান্তর করার দক্ষতা সহ উত্সাহী ডেটা অ্যানালিস্ট",
        
        // Skills
        skillsTitle: "দক্ষতা ড্যাশবোর্ড",
        skillsSubtitle: "দক্ষতার চাহিদা এবং বাজার প্রবণতার লাইভ বিশ্লেষণ",
        
        // Projects
        projectsTitle: "আমার প্রজেক্টগুলো",
        projectsSubtitle: "ব্যবসায়িক মূল্য প্রদানকারী ডেটা অ্যানালাইসিস প্রজেক্ট",
        filterAll: "সব",
        filterPython: "পাইথন",
        filterSQL: "এসকিউএল",
        filterPowerBI: "পাওয়ার বিআই",
        filterExcel: "এক্সেল",
        loadMore: "আরো প্রজেক্ট লোড করুন",
        viewDetails: "বিস্তারিত দেখুন",
        
        // Certificates
        certificatesTitle: "সার্টিফিকেট",
        certificatesSubtitle: "পেশাদার সার্টিফিকেশন এবং অর্জন",
        
        // Articles
        articlesTitle: "আর্টিকেল ও ব্লগ",
        articlesSubtitle: "ডেটা অ্যানালাইসিস সম্পর্কিত সর্বশেষ অন্তর্দৃষ্টি এবং টিউটোরিয়াল",
        readMore: "আরো পড়ুন",
        viewAll: "সব আর্টিকেল দেখুন",
        
        // Contact
        contactTitle: "যোগাযোগ করুন",
        contactSubtitle: "আপনার পরবর্তী ডেটা প্রজেক্টে একসাথে কাজ করি",
        fullName: "পুরো নাম *",
        emailAddress: "ইমেইল ঠিকানা *",
        subject: "বিষয়",
        message: "বার্তা *",
        sendMessage: "বার্তা পাঠান",
        responseTime: "আমি সাধারণত ২৪ ঘন্টার মধ্যে উত্তর দেই",
        
        // Notifications
        messageSent: "বার্তা সফলভাবে পাঠানো হয়েছে!",
        messageError: "বার্তা পাঠানো ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।",
        loading: "লোড হচ্ছে...",
        noProjects: "কোনো প্রজেক্ট পাওয়া যায়নি।",
        noCertificates: "কোনো সার্টিফিকেট পাওয়া যায়নি।",
        noArticles: "কোনো আর্টিকেল পাওয়া যায়নি।"
    }
};

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ==================== INITIALIZE APP ====================
async function initializeApp() {
    try {
        // Initialize core features
        initTheme();
        initLanguage();
        initNavigation();
        initTypewriter();
        initScrollEffects();
        initHoverEffects();
        
        // Initialize charts
        initSkillsChart();
        initPredictionChart();
        
        // Load dynamic data
        await Promise.all([
            loadGitHubStats(),
            loadProjects(),
            loadCertificates(),
            loadArticles()
        ]);
        
        // Initialize form
        initContactForm();
        
        // Update current year
        updateCurrentYear();
        
        // Hide loading screen
        hideLoadingScreen();
        
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Failed to load portfolio data', 'error');
        hideLoadingScreen();
    }
}

// ==================== THEME MANAGEMENT ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    STATE.currentTheme = theme;
    
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (themeIcon && themeText) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = TRANSLATIONS[STATE.currentLang].lightMode || 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = TRANSLATIONS[STATE.currentLang].darkMode || 'Dark Mode';
        }
    }
    
    // Update charts theme
    updateChartsTheme();
}

// ==================== LANGUAGE MANAGEMENT ====================
function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    STATE.currentLang = savedLang;
    updateLanguage();
    
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLang;
        languageSelect.addEventListener('change', function(e) {
            STATE.currentLang = e.target.value;
            localStorage.setItem('language', STATE.currentLang);
            updateLanguage();
        });
    }
}

function updateLanguage() {
    // Update HTML lang attribute
    document.documentElement.lang = STATE.currentLang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (TRANSLATIONS[STATE.currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = TRANSLATIONS[STATE.currentLang][key];
            } else {
                element.textContent = TRANSLATIONS[STATE.currentLang][key];
            }
        }
    });
    
    // Update button texts
    updateButtonTexts();
}

function updateButtonTexts() {
    const buttons = {
        loadMoreProjects: TRANSLATIONS[STATE.currentLang].loadMore,
        viewAllArticles: TRANSLATIONS[STATE.currentLang].viewAll
    };
    
    Object.keys(buttons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.querySelector('span').textContent = buttons[buttonId];
        }
    });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    // Smooth scroll for anchor links
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
            }
        });
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.classList.toggle('show');
        });
        
        // Close mobile menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.style.display = 'none';
                navLinks.classList.remove('show');
            });
        });
    }
    
    // Update active nav on scroll
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        if (scrollY >= (sectionTop - headerHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== TYPEWRITER EFFECT ====================
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
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
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end
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
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.skill-card, .project-card, .certificate-card, .article-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// ==================== HOVER EFFECTS ====================
function initHoverEffects() {
    // Add hover class to cards
    const cards = document.querySelectorAll('.skill-card, .project-card, .certificate-card, .article-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ==================== CHARTS ====================
function initSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Python',
                data: [65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'SQL',
                data: [60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 87],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Power BI',
                data: [55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 82],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    STATE.skillsChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: getChartOptions('Skills Demand Over Time')
    });
    
    // Chart controls
    initChartControls();
}

function initPredictionChart() {
    const ctx = document.getElementById('predictionChart');
    if (!ctx) return;
    
    const data = {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028'],
        datasets: [
            {
                label: 'Data Analyst Jobs',
                data: [100, 120, 140, 165, 190, 220, 250, 285, 320],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    STATE.predictionChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: getChartOptions('Job Market Growth Prediction')
    });
}

function initChartControls() {
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const timeframe = this.getAttribute('data-timeframe');
            
            // Update active button
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on timeframe
            if (STATE.skillsChart) {
                updateSkillsChartData(timeframe);
            }
        });
    });
}

function updateSkillsChartData(timeframe) {
    if (!STATE.skillsChart) return;
    
    let labels, pythonData, sqlData, powerBIData;
    
    switch (timeframe) {
        case 'quarterly':
            labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            pythonData = [75, 80, 85, 90];
            sqlData = [70, 75, 80, 85];
            powerBIData = [65, 70, 75, 80];
            break;
        case 'yearly':
            labels = ['2020', '2021', '2022', '2023', '2024'];
            pythonData = [70, 75, 80, 85, 90];
            sqlData = [65, 70, 75, 80, 85];
            powerBIData = [60, 65, 70, 75, 80];
            break;
        default: // monthly
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            pythonData = [65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 90, 92];
            sqlData = [60, 63, 65, 68, 70, 73, 75, 78, 80, 83, 85, 87];
            powerBIData = [55, 58, 60, 63, 65, 68, 70, 73, 75, 78, 80, 82];
    }
    
    STATE.skillsChart.data.labels = labels;
    STATE.skillsChart.data.datasets[0].data = pythonData;
    STATE.skillsChart.data.datasets[1].data = sqlData;
    STATE.skillsChart.data.datasets[2].data = powerBIData;
    
    STATE.skillsChart.update();
}

function getChartOptions(title) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f1f5f9' : '#1f2937';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: title,
                color: textColor,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor
                }
            },
            y: {
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor
                },
                beginAtZero: true
            }
        }
    };
}

function updateChartsTheme() {
    if (STATE.skillsChart) {
        STATE.skillsChart.options = getChartOptions('Skills Demand Over Time');
        STATE.skillsChart.update();
    }
    
    if (STATE.predictionChart) {
        STATE.predictionChart.options = getChartOptions('Job Market Growth Prediction');
        STATE.predictionChart.update();
    }
}

// ==================== DYNAMIC DATA LOADING ====================
async function loadGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}`);
        const data = await response.json();
        
        // Update stats
        document.getElementById('githubRepos').textContent = data.public_repos || '24';
        document.getElementById('commitCount').textContent = Math.floor(data.public_repos * 24) || '580';
        
        // Get stars count (approximate)
        const starsResponse = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}/repos`);
        const repos = await starsResponse.json();
        const stars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
        document.getElementById('githubStars').textContent = stars || '156';
        
    } catch (error) {
        console.log('GitHub API error:', error);
        // Fallback values
        document.getElementById('githubRepos').textContent = '24';
        document.getElementById('githubStars').textContent = '156';
        document.getElementById('commitCount').textContent = '580';
    }
}

async function loadProjects() {
    try {
        const response = await fetch(`${CONFIG.GAS_URL}${CONFIG.ENDPOINTS.GET_PROJECTS}`);
        const projects = await response.json();
        
        if (projects && projects.length > 0) {
            renderProjects(projects);
            initProjectFilters();
        } else {
            showNoDataMessage('projectsContainer', TRANSLATIONS[STATE.currentLang].noProjects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        showNoDataMessage('projectsContainer', TRANSLATIONS[STATE.currentLang].noProjects);
    }
}

async function loadCertificates() {
    try {
        const response = await fetch(`${CONFIG.GAS_URL}${CONFIG.ENDPOINTS.GET_CERTIFICATES}`);
        const certificates = await response.json();
        
        if (certificates && certificates.length > 0) {
            renderCertificates(certificates);
        } else {
            showNoDataMessage('certificatesContainer', TRANSLATIONS[STATE.currentLang].noCertificates);
        }
    } catch (error) {
        console.error('Error loading certificates:', error);
        showNoDataMessage('certificatesContainer', TRANSLATIONS[STATE.currentLang].noCertificates);
    }
}

async function loadArticles() {
    try {
        const response = await fetch(`${CONFIG.GAS_URL}${CONFIG.ENDPOINTS.GET_ARTICLES}`);
        const articles = await response.json();
        
        if (articles && articles.length > 0) {
            renderArticles(articles);
        } else {
            showNoDataMessage('articlesContainer', TRANSLATIONS[STATE.currentLang].noArticles);
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        showNoDataMessage('articlesContainer', TRANSLATIONS[STATE.currentLang].noArticles);
    }
}

// ==================== RENDER FUNCTIONS ====================
function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    // Clear loading skeletons
    container.innerHTML = '';
    
    // Render projects
    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        container.appendChild(projectElement);
    });
    
    // Initialize project filters
    initProjectFilters();
}

function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = `project-card ${project.category || ''}`;
    div.setAttribute('data-category', project.category || 'all');
    
    div.innerHTML = `
        <div class="project-image">
            <img src="${project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'}" 
                 alt="${project.title}" loading="lazy">
            <div class="project-tags">
                ${(project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description || ''}</p>
            <div class="project-stats">
                <span><i class="fas fa-calendar"></i> ${project.date || '2024'}</span>
                <span><i class="fas fa-clock"></i> ${project.duration || '2 Weeks'}</span>
            </div>
            <a href="${project.link || '#'}" class="project-link" target="_blank">
                ${TRANSLATIONS[STATE.currentLang].viewDetails || 'View Details'} →
            </a>
        </div>
    `;
    
    return div;
}

function renderCertificates(certificates) {
    const container = document.getElementById('certificatesContainer');
    if (!container) return;
    
    // Clear loading skeletons
    container.innerHTML = '';
    
    // Render certificates
    certificates.forEach(certificate => {
        const certElement = createCertificateElement(certificate);
        container.appendChild(certElement);
    });
}

function createCertificateElement(certificate) {
    const div = document.createElement('div');
    div.className = 'certificate-card';
    
    div.innerHTML = `
        <div class="certificate-image">
            <img src="${certificate.image || 'https://images.unsplash.com/photo-1585241936939-be4099591252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'}" 
                 alt="${certificate.title}" loading="lazy">
        </div>
        <div class="certificate-content">
            <h3>${certificate.title}</h3>
            <p>${certificate.issuer || ''}</p>
            <span class="certificate-date">${certificate.date || '2024'}</span>
            <a href="${certificate.link || '#'}" class="btn btn-secondary" target="_blank">
                <i class="fas fa-external-link-alt"></i>
                <span>View Certificate</span>
            </a>
        </div>
    `;
    
    return div;
}

function renderArticles(articles) {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    // Clear loading skeletons
    container.innerHTML = '';
    
    // Render articles
    articles.forEach(article => {
        const articleElement = createArticleElement(article);
        container.appendChild(articleElement);
    });
}

function createArticleElement(article) {
    const div = document.createElement('div');
    div.className = 'article-card';
    
    div.innerHTML = `
        <div class="article-image">
            <img src="${article.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'}" 
                 alt="${article.title}" loading="lazy">
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="article-category">${article.category || 'Data Analysis'}</span>
                <span class="article-date">${article.date || '2024'}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt || ''}</p>
            <a href="${article.link || '#'}" class="article-link" target="_blank">
                ${TRANSLATIONS[STATE.currentLang].readMore || 'Read More'} →
            </a>
        </div>
    `;
    
    return div;
}

// ==================== PROJECT FILTERS ====================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
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

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // Send to Google Apps Script
            const response = await fetch(`${CONFIG.GAS_URL}${CONFIG.ENDPOINTS.SUBMIT_FORM}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                showToast(TRANSLATIONS[STATE.currentLang].messageSent, 'success');
                
                // Reset form
                form.reset();
                
                // Show success status
                showFormStatus('success', TRANSLATIONS[STATE.currentLang].messageSent);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showToast(TRANSLATIONS[STATE.currentLang].messageError, 'error');
            showFormStatus('error', TRANSLATIONS[STATE.currentLang].messageError);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    
    // Check required fields
    if (!name || !email || !message) {
        showToast('Please fill all required fields', 'warning');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'warning');
        return false;
    }
    
    return true;
}

function showFormStatus(type, message) {
    const statusElement = document.getElementById('formStatus');
    if (!statusElement) return;
    
    statusElement.className = `form-status ${type}`;
    statusElement.textContent = message;
    statusElement.style.display = 'block';
    
    // Hide status after 5 seconds
    setTimeout(() => {
        statusElement.style.display = 'none';
    }, 5000);
}

// ==================== UTILITY FUNCTIONS ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remove toast after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function showNoDataMessage(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-data-message">
            <i class="fas fa-inbox"></i>
            <p>${message}</p>
        </div>
    `;
}

function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// Debounce resize events
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Update charts on resize
        if (STATE.skillsChart) {
            STATE.skillsChart.resize();
        }
        if (STATE.predictionChart) {
            STATE.predictionChart.resize();
        }
    }, 250);
});
