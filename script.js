// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target && target.startsWith('#') && document.querySelector(target)) {
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        } else if (target) {
            window.location.href = target;
        }
    });
});

// Reveal on scroll with staggered children
function setupRevealOnScroll() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sec = entry.target;
                sec.classList.add('in-view');

                // Stagger children animations inside the section
                const items = sec.querySelectorAll('h2, .section-header, .badge, .headline, .hero p, .hero-btns a, .timeline-item, .skill-category, .tags span, .about-text p, .personal-info li, .cert-card, .contact-card');
                items.forEach((el, i) => {
                    el.classList.add('stagger');
                    el.style.transitionDelay = (i * 60) + 'ms';
                    setTimeout(() => el.classList.add('in'), i * 60 + 40);
                });

                // Also reveal timeline items specifically
                const timelineItems = sec.querySelectorAll('.timeline-item');
                timelineItems.forEach((it, idx) => {
                    it.style.transitionDelay = (idx * 80) + 'ms';
                    it.classList.add('in');
                });

                obs.unobserve(sec);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('section').forEach(sec => {
        sec.classList.add('reveal-on-scroll');
        observer.observe(sec);
    });
}

// DOM ready: headline split, hero entrance, nav toggle, ripple, parallax, reveal
document.addEventListener('DOMContentLoaded', () => {
    // NAV TOGGLE (mobile)
    const nav = document.querySelector('nav.site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    if (nav && navToggle) {
        navToggle.addEventListener('click', (e) => {
            const open = nav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', open);
        });
        document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
            nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false');
        }));
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && nav.classList.contains('open')) {
                nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Headline per-character split
    const headline = document.querySelector('.headline');
    if (headline) {
        const text = headline.textContent.trim();
        headline.textContent = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.style.setProperty('--i', i);
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            headline.appendChild(span);
        });
        requestAnimationFrame(() => headline.classList.add('reveal'));
    }

    // Hero entrance sequence (staggered)
    const hero = document.querySelector('.hero');
    if (hero) {
        const badge = hero.querySelector('.badge');
        const h1 = hero.querySelector('.headline');
        const p = hero.querySelector('.hero p');
        const buttons = Array.from(hero.querySelectorAll('.hero-btns a'));
        const imageWrap = document.querySelector('.hero-image-wrapper');

        if (badge) badge.classList.add('fade-up');
        if (h1) h1.classList.add('fade-up');
        if (p) p.classList.add('fade-up');
        buttons.forEach(b => b.classList.add('fade-up'));

        setTimeout(() => badge && badge.classList.add('enter'), 120);
        setTimeout(() => h1 && h1.classList.add('enter'), 260);
        setTimeout(() => p && p.classList.add('enter'), 440);
        buttons.forEach((b, i) => setTimeout(() => b.classList.add('enter'), 540 + i * 110));
        setTimeout(() => imageWrap && imageWrap.classList.add('float'), 700);
    }

    // Ripple effect for buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height) * 1.2;
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Hero parallax (desktop only)
    const imageWrap = document.querySelector('.hero-image-wrapper');
    if (hero && imageWrap && window.matchMedia('(hover: hover)').matches) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
            const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
            imageWrap.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
        });
        hero.addEventListener('mouseleave', () => imageWrap.style.transform = '');
    }

    // Initialize reveal observer
    setupRevealOnScroll();
    
    // =========================================
    // TAMBAHAN SCRIPT UNTUK DARK/LIGHT MODE
    // =========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('portfolio-theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('portfolio-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('portfolio-theme', 'light');
            }
        });
    }
});