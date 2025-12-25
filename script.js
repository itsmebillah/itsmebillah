// ==================== CONFIGURATION ====================
const CONFIG = {
    GAS_URL: 'https://script.google.com/macros/s/AKfycbwM263dREny57y2nXBCrAvgesWLdITWPHJLjqv2NmALXkCMIK016bZ819bMwzX0hn4t2g/exec', // এখানে তোমার নতুন GAS URL দিবে
    GITHUB_USERNAME: 'itsmebillah'
};

// ==================== STATE ====================
let currentLang = 'en';
let currentTheme = 'light';
let skillsChart = null;

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLanguage();
    initNavigation();
    initTypewriter();
    initSkillsChart();
    initGitHubStats();
    initContactForm();
    updateCurrentYear();
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 300);
        }
    }, 1000);
});

// ==================== THEME ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
    }
    if (skillsChart) updateChartTheme();
}

// ==================== LANGUAGE ====================
function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'en';
    currentLang = savedLang;
    document.getElementById('languageSelect').value = savedLang;
    document.getElementById('languageSelect').addEventListener('change', function(e) {
        currentLang = e.target.value;
        localStorage.setItem('language', currentLang);
        location.reload();
    });
}

// ==================== NAVIGATION ====================
function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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
    });
}

// ==================== TYPEWRITER ====================
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    const texts = ["data into insights", "spreadsheets into stories", "numbers into narratives", "metrics into decisions"];
    let textIndex = 0, charIndex = 0, isDeleting = false;
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
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    setTimeout(type, 1000);
}

// ==================== SKILLS CHART ====================
function initSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            { label: 'Python', data: [65,70,75,80,85,90], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', tension: 0.4 },
            { label: 'SQL', data: [60,65,70,75,80,85], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4 },
            { label: 'Power BI', data: [55,60,65,70,75,80], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', tension: 0.4 }
        ]
    };
    skillsChart = new Chart(ctx, { type: 'line', data: data, options: { responsive: true, maintainAspectRatio: false } });
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (this.getAttribute('data-timeframe') === 'yearly') {
                skillsChart.data.labels = ['2019','2020','2021','2022','2023','2024'];
                skillsChart.data.datasets[0].data = [70,75,78,82,87,92];
                skillsChart.data.datasets[1].data = [65,70,73,77,82,87];
                skillsChart.data.datasets[2].data = [60,65,68,72,77,82];
            } else {
                skillsChart.data.labels = ['Jan','Feb','Mar','Apr','May','Jun'];
                skillsChart.data.datasets[0].data = [65,70,75,80,85,90];
                skillsChart.data.datasets[1].data = [60,65,70,75,80,85];
                skillsChart.data.datasets[2].data = [55,60,65,70,75,80];
            }
            skillsChart.update();
        });
    });
}

function updateChartTheme() { if (skillsChart) skillsChart.update(); }

// ==================== GITHUB STATS ====================
async function initGitHubStats() {
    try {
        const response = await fetch(`https://api.github.com/users/${CONFIG.GITHUB_USERNAME}`);
        const data = await response.json();
        document.getElementById('githubRepos').textContent = data.public_repos || '24';
        document.getElementById('commitCount').textContent = Math.floor(data.public_repos * 24) || '580';
    } catch (error) {
        document.getElementById('githubRepos').textContent = '24';
        document.getElementById('commitCount').textContent = '580';
    }
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!validateForm()) return;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        try {
            await fetch(CONFIG.GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data)
            });
            alert('Message sent successfully!');
            form.reset();
        } catch (error) {
            alert('Failed to send message. Please try again.');
        } finally {
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
    if (!name || !email || !message) {
        alert('Please fill all required fields');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    return true;
}

// ==================== UTILITIES ====================
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
}

// Loading screen CSS
const style = document.createElement('style');
style.textContent = `
    .loading-screen { position:fixed; top:0; left:0; width:100%; height:100%; 
        background:var(--primary-bg); display:flex; justify-content:center; 
        align-items:center; z-index:9999; transition:opacity 0.3s; }
    .spinner { width:50px; height:50px; border:3px solid var(--border-color); 
        border-top-color:var(--accent-color); border-radius:50%; 
        animation:spin 1s linear infinite; margin:0 auto 20px; }
    @keyframes spin { to { transform:rotate(360deg); } }
`;
document.head.appendChild(style);

// ==================== ANIMATED BACKGROUND ====================
function initAnimatedBackground() {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'animated-bg';
    document.body.prepend(bgContainer);
    
    // Create bubbles
    for (let i = 0; i < 4; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bgContainer.appendChild(bubble);
    }
    
    // Create glow effects
    const glow1 = document.createElement('div');
    glow1.className = 'glow glow-1';
    bgContainer.appendChild(glow1);
    
    const glow2 = document.createElement('div');
    glow2.className = 'glow glow-2';
    bgContainer.appendChild(glow2);
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
        
        // Parallax effect for hero
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (hero) {
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
}

// ==================== HOVER EFFECTS ====================
function initHoverEffects() {
    // Card hover effects
    const cards = document.querySelectorAll('.card, .skill-card, .project-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
    
    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', function() {
    // Existing initializations
    initTheme();
    initLanguage();
    initNavigation();
    initTypewriter();
    initSkillsChart();
    initGitHubStats();
    initContactForm();
    updateCurrentYear();
    
    // New initializations
    initAnimatedBackground();
    initScrollEffects();
    initHoverEffects();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }, 1000);
});
