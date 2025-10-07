// ========================================
// グローバル変数とキャッシュ
// ========================================
const DOM = {
    themeToggle: null,
    body: null,
    cursor: null,
    cursorOutline: null,
    cursorWrapper: null,
    defaultDot: null,
    loader: null,
    menuToggle: null,
    menuOverlay: null,
    menuLinks: null,
    navbar: null,
    backToTopBtn: null,
    scrollProgress: null,
    human: null,
    header: null,
    contactSection: null,
    aboutSection: null,
    particleContainer: null,
    skillCircles: null,
    glitchTitle: null,
    sectionTitles: null
};

const STATE = {
    mouseX: -1000,
    mouseY: -1000,
    lastMouseMoveTime: 0,
    mouseMoveThrottle: 16
};

// ========================================
// 初期化
// ========================================
function initDOM() {
    DOM.themeToggle = document.getElementById('theme-toggle');
    DOM.body = document.body;
    DOM.cursor = document.querySelector('.cursor-dot');
    DOM.cursorOutline = document.querySelector('.cursor-outline');
    DOM.cursorWrapper = document.querySelector('.mouse-cursor');
    DOM.defaultDot = document.querySelector('.default-cursor-dot');
    DOM.loader = document.querySelector('.loader');
    DOM.menuToggle = document.querySelector('.menu-toggle');
    DOM.menuOverlay = document.querySelector('.menu-overlay');
    DOM.menuLinks = document.querySelectorAll('.menu-link');
    DOM.navbar = document.getElementById('navbar');
    DOM.backToTopBtn = document.querySelector('.back-to-top');
    DOM.scrollProgress = document.querySelector('.scroll-progress');
    DOM.human = document.querySelector('.human');
    DOM.header = document.querySelector('header');
    DOM.contactSection = document.getElementById('contact');
    DOM.aboutSection = document.getElementById('about');
    DOM.particleContainer = document.querySelector('.particle-container');
    DOM.skillCircles = document.querySelectorAll('.skill-circle circle.progress');
    DOM.glitchTitle = document.querySelector('.glitch-title');
    DOM.sectionTitles = document.querySelectorAll('.section-title');
}

// ========================================
// テーマ管理
// ========================================
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            DOM.body.classList.remove('dark-mode');
            DOM.themeToggle.textContent = '🌙';
        } else {
            DOM.body.classList.add('dark-mode');
            DOM.themeToggle.textContent = '☀️';
            if (!savedTheme) {
                localStorage.setItem('theme', 'dark');
            }
        }
        
        DOM.themeToggle.addEventListener('click', () => this.toggle());
    },
    
    toggle() {
        DOM.body.classList.toggle('dark-mode');
        const isDark = DOM.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        DOM.themeToggle.textContent = isDark ? '☀️' : '🌙';
    }
};

// ========================================
// カーソル管理
// ========================================
const CursorManager = {
    init() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseleave', () => this.hide());
        document.addEventListener('mouseenter', () => this.show());
        
        const interactiveElements = document.querySelectorAll('a, button, input, .interactive-element');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => DOM.cursorWrapper.classList.add('link-hover'));
            el.addEventListener('mouseleave', () => DOM.cursorWrapper.classList.remove('link-hover'));
        });
    },
    
    handleMouseMove(e) {
        const currentTime = performance.now();
        if (currentTime - STATE.lastMouseMoveTime >= STATE.mouseMoveThrottle) {
            STATE.mouseX = e.clientX;
            STATE.mouseY = e.clientY;
            STATE.lastMouseMoveTime = currentTime;
        }
        
        DOM.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        
        setTimeout(() => {
            DOM.cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, 100);
        
        DOM.defaultDot.style.left = `${e.clientX}px`;
        DOM.defaultDot.style.top = `${e.clientY}px`;
        
        if (Math.random() > 0.98) {
            this.createRipple(e.clientX, e.clientY);
        }
    },
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    },
    
    hide() {
        DOM.cursor.style.opacity = '0';
        DOM.cursorOutline.style.opacity = '0';
    },
    
    show() {
        DOM.cursor.style.opacity = '1';
        DOM.cursorOutline.style.opacity = '1';
    }
};

// ========================================
// ローダー管理
// ========================================
const LoaderManager = {
    init() {
        setTimeout(() => {
            DOM.loader.classList.add('hidden');
        }, 2000);
    }
};

// ========================================
// メニュー管理
// ========================================
const MenuManager = {
    init() {
        DOM.menuToggle.addEventListener('click', () => this.toggle());
        DOM.menuLinks.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    },
    
    toggle() {
        DOM.menuToggle.classList.toggle('active');
        DOM.menuOverlay.classList.toggle('active');
        DOM.body.classList.toggle('menu-open');
    },
    
    close() {
        DOM.menuToggle.classList.remove('active');
        DOM.menuOverlay.classList.remove('active');
        DOM.body.classList.remove('menu-open');
    }
};

// ========================================
// スクロール管理
// ========================================
const ScrollManager = {
    init() {
        window.addEventListener('scroll', () => {
            this.updateProgress();
            this.updateNavbar();
            this.updateBackToTop();
        });
        
        this.initSmoothScroll();
    },
    
    updateProgress() {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalHeight) * 100;
        DOM.scrollProgress.style.width = `${progress}%`;
    },
    
    updateNavbar() {
        if (window.scrollY > 50) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
    },
    
    updateBackToTop() {
        if (window.pageYOffset > 300) {
            DOM.backToTopBtn.classList.add('active');
        } else {
            DOM.backToTopBtn.classList.remove('active');
        }
    },
    
    initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

// ========================================
// アニメーション管理
// ========================================
const AnimationManager = {
    init() {
        this.initIntersectionObserver();
        this.initSkillCircles();
        this.initGSAP();
        this.initGlitchEffect();
        this.initShootingStars();
    },
    
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    },
    
    initSkillCircles() {
        DOM.skillCircles.forEach(circle => {
            const value = circle.getAttribute('data-value');
            circle.style.setProperty('--progress', value);
        });
    },
    
    initGSAP() {
        if (typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from('.glitch-title', {
            opacity: 0,
            y: 50,
            duration: 1.5,
            delay: 2.5,
            ease: 'power4.out'
        });
        
        gsap.to('.blob:nth-child(1)', {
            x: '+=30',
            y: '-=30',
            rotation: 360,
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        gsap.to('.blob:nth-child(2)', {
            x: '-=30',
            y: '+=30',
            rotation: -360,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out'
            });
        });
        
        gsap.utils.toArray('.skill-circle').forEach(circle => {
            const progress = circle.querySelector('.progress');
            const radius = progress.getAttribute('r');
            const circumference = 2 * Math.PI * radius;
            
            progress.style.strokeDashoffset = circumference;
            
            gsap.to(progress, {
                scrollTrigger: {
                    trigger: circle,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                strokeDashoffset: function () {
                    const value = progress.getAttribute('data-value');
                    return circumference * (1 - (value / 100));
                },
                duration: 1.5,
                ease: 'power3.out'
            });
        });
    },
    
    initGlitchEffect() {
        if (!DOM.glitchTitle) return;
        
        const content = DOM.glitchTitle.textContent;
        DOM.glitchTitle.innerHTML = `
            <span class="glitch-text">${content}</span>
            <span class="glitch-text-layer red">${content}</span>
            <span class="glitch-text-layer green">${content}</span>
            <span class="glitch-text-layer blue">${content}</span>
        `;
        
        setInterval(() => {
            const layers = DOM.glitchTitle.querySelectorAll('.glitch-text-layer');
            const duration = Math.random() * 200 + 50;
            
            layers.forEach(layer => {
                const xShift = Math.random() * 10 - 5;
                const yShift = Math.random() * 10 - 5;
                
                layer.style.transform = `translate(${xShift}px, ${yShift}px)`;
                layer.style.clipPath = `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`;
                
                setTimeout(() => {
                    layer.style.transform = '';
                    layer.style.clipPath = '';
                }, duration);
            });
        }, 3000);
    },
    
    initShootingStars() {
        const shootingStars = document.querySelectorAll('.shooting-star');
        shootingStars.forEach((star, index) => {
            setInterval(() => {
                const posX = Math.random() * 80;
                const posY = Math.random() * 80;
                const delay = index * 3;
                
                star.style.left = `${posX}%`;
                star.style.top = `${posY}%`;
                star.style.transform = `rotate(${Math.random() * 45}deg)`;
                
                setTimeout(() => {
                    star.style.opacity = "1";
                    setTimeout(() => {
                        star.style.opacity = "0";
                    }, 1000);
                }, delay * 1000);
            }, 6000);
        });
    }
};

// ========================================
// パーティクル管理
// ========================================
const ParticleManager = {
    init() {
        this.createParticles();
        this.createNeuronNetwork();
    },
    
    createParticles() {
        if (!DOM.particleContainer) return;
        
        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.width = `${Math.random() * 5 + 2}px`;
            particle.style.height = particle.style.width;
            DOM.particleContainer.appendChild(particle);
        }
    },
    
    createNeuronNetwork() {
        if (!DOM.aboutSection) return;
        
        const neuronNetwork = document.createElement('div');
        neuronNetwork.className = 'neuron-network';
        
        for (let i = 0; i < 30; i++) {
            const neuron = document.createElement('div');
            neuron.className = 'neuron';
            neuron.style.left = `${Math.random() * 100}%`;
            neuron.style.top = `${Math.random() * 100}%`;
            neuron.style.animationDelay = `${Math.random() * 5}s`;
            neuronNetwork.appendChild(neuron);
        }
        
        DOM.aboutSection.querySelector('.container').appendChild(neuronNetwork);
    }
};

// ========================================
// エフェクト管理
// ========================================
const EffectManager = {
    init() {
        this.initHumanAvoidance();
        this.initLiquidGradient();
        this.initDNAStrand();
        this.initSectionTitleShadow();
    },
    
    initHumanAvoidance() {
        if (!DOM.human) return;
        
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let lastTime = performance.now();
        let isAnimationPaused = false;
        let isReturningToOriginal = false;
        
        const avoidRadius = 150;
        const maxSpeed = 5;
        const returnForce = 0.03;
        const smoothingFactor = 0.15;
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function updatePosition(currentTime) {
            const deltaTime = currentTime - lastTime;
            const timeScale = deltaTime / 16.67;
            lastTime = currentTime;
            
            const rect = DOM.human.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dx = STATE.mouseX - centerX;
            const dy = STATE.mouseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < avoidRadius) {
                if (!isAnimationPaused) {
                    DOM.human.style.animation = 'none';
                    isAnimationPaused = true;
                    isReturningToOriginal = false;
                }
                
                const angle = Math.atan2(dy, dx);
                const forceFactor = easeOutCubic((avoidRadius - distance) / avoidRadius);
                const force = forceFactor * maxSpeed;
                
                targetX -= Math.cos(angle) * force * timeScale;
                targetY -= Math.sin(angle) * force * timeScale;
                
                const maxDisplacement = avoidRadius * 0.8;
                targetX = Math.max(-maxDisplacement, Math.min(maxDisplacement, targetX));
                targetY = Math.max(-maxDisplacement, Math.min(maxDisplacement, targetY));
            } else {
                isReturningToOriginal = true;
                targetX *= (1 - returnForce * timeScale);
                targetY *= (1 - returnForce * timeScale);
                
                if (Math.abs(targetX) < 1 && Math.abs(targetY) < 1) {
                    targetX = 0;
                    targetY = 0;
                    if (isAnimationPaused && Math.abs(currentX) < 0.5 && Math.abs(currentY) < 0.5) {
                        DOM.human.style.animation = 'move 10s ease-in-out infinite';
                        isAnimationPaused = false;
                        isReturningToOriginal = false;
                    }
                }
            }
            
            const smoothingFactorAdjusted = 1 - Math.pow(1 - smoothingFactor, timeScale);
            currentX += (targetX - currentX) * smoothingFactorAdjusted;
            currentY += (targetY - currentY) * smoothingFactorAdjusted;
            
            DOM.human.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            requestAnimationFrame(updatePosition);
        }
        
        requestAnimationFrame(function(timestamp) {
            lastTime = timestamp;
            updatePosition(timestamp);
        });
    },
    
    initLiquidGradient() {
        if (!DOM.contactSection) return;
        
        const liquidGradient = document.createElement('div');
        liquidGradient.className = 'liquid-gradient';
        DOM.contactSection.prepend(liquidGradient);
        
        DOM.contactSection.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            liquidGradient.style.background = `radial-gradient(
                circle at ${x * 100}% ${y * 100}%,
                rgba(255, 51, 102, 0.4) 0%,
                rgba(102, 204, 255, 0.2) 50%,
                rgba(51, 51, 51, 0.1) 100%
            )`;
        });
    },
    
    initDNAStrand() {
        if (!DOM.header) return;
        
        const dnaContainer = document.createElement('div');
        dnaContainer.className = 'dna-container';
        
        const dnaStrand = document.createElement('div');
        dnaStrand.className = 'dna-strand';
        
        for (let i = 0; i < 20; i++) {
            const dnaRung = document.createElement('div');
            dnaRung.className = 'dna-rung';
            dnaRung.style.animationDelay = `${i * 0.1}s`;
            
            const leftNode = document.createElement('div');
            leftNode.className = 'dna-node left';
            
            const rightNode = document.createElement('div');
            rightNode.className = 'dna-node right';
            
            const connector = document.createElement('div');
            connector.className = 'dna-connector';
            
            dnaRung.appendChild(leftNode);
            dnaRung.appendChild(connector);
            dnaRung.appendChild(rightNode);
            
            dnaStrand.appendChild(dnaRung);
        }
        
        dnaContainer.appendChild(dnaStrand);
        DOM.header.appendChild(dnaContainer);
    },
    
    initSectionTitleShadow() {
        DOM.sectionTitles.forEach(title => {
            title.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                const shadow1 = `${x * 20}px ${y * 20}px 10px rgba(255, 102, 107, 0.3)`;
                const shadow2 = `${-x * 15}px ${-y * 15}px 15px rgba(102, 204, 255, 0.3)`;
                const shadow3 = `${-x * 10}px ${y * 10}px 10px rgba(162, 89, 255, 0.2)`;
                
                this.style.textShadow = `${shadow1}, ${shadow2}, ${shadow3}`;
            });
            
            title.addEventListener('mouseleave', function() {
                this.style.textShadow = '';
            });
        });
    }
};

// ========================================
// テキストエフェクト
// ========================================
const TextEffects = {
    init() {
        this.splitText();
        this.setupObserver();
    },
    
    splitText() {
        const elements = document.querySelectorAll('.split-text');
        
        elements.forEach(element => {
            const text = element.textContent.trim();
            const chars = text.split('');
            
            let html = '';
            chars.forEach(char => {
                if (char === ' ') {
                    html += ' ';
                } else {
                    html += `<span>${char}</span>`;
                }
            });
            
            element.innerHTML = html;
        });
    },
    
    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        document.querySelectorAll('.split-text').forEach(el => observer.observe(el));
    }
};

// ========================================
// フォーム管理
// ========================================
window.sendEmail = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const body = `
お名前: ${name}
メールアドレス: ${email}

${message}
    `;
    
    const mailtoLink = `mailto:ryuya.saito.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
};

// ========================================
// メイン初期化
// ========================================
function init() {
    initDOM();
    ThemeManager.init();
    CursorManager.init();
    LoaderManager.init();
    MenuManager.init();
    ScrollManager.init();
    AnimationManager.init();
    ParticleManager.init();
    EffectManager.init();
    TextEffects.init();
}

// ========================================
// 実行
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
