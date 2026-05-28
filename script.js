document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    // Detect active industry and highlight dropdown item
    const industryMap = {
        'Technology-services': 'Technology',
        'Financial-Services-services': 'Financial Services',
        'Insurance-services': 'Insurance',
        'Infrastructure-Logistics-services': 'Infrastructure & Logistics',
        'Education-services': 'Education'
    };
    
    const currentPath = window.location.pathname;
    const dropdownLinks = document.querySelectorAll('.nav-dropdown li a');
    
    dropdownLinks.forEach(link => {
        for (const [slug, industryName] of Object.entries(industryMap)) {
            if (currentPath.includes(slug) && link.textContent.trim() === industryName) {
                link.classList.add('active');
                break;
            }
        }
    });

    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (!statsAnimated) {
            const statsSection = document.querySelector('.by-the-numbers');
            if (statsSection) {
                const rect = statsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        }
    });

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-count'));
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;

                if (isDecimal) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    if (isDecimal) {
                        stat.textContent = target.toFixed(1) + '%';
                    } else {
                        stat.textContent = Math.floor(target) + '+';
                    }
                }
            }

            requestAnimationFrame(update);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = this.classList.contains('active');
            
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                const a = q.nextElementSibling;
                a.classList.remove('open');
            });

            if (!isOpen) {
                this.classList.add('active');
                answer.classList.add('open');
            }
        });
    });
});
