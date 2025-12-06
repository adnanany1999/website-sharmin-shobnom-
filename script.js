document.addEventListener('DOMContentLoaded', () => {
    // Animate meters when hero is visible
    const meterFills = document.querySelectorAll('.meter-fill');
    const cards = document.querySelectorAll('.card');
    const scrollHint = document.getElementById('scrollHint');

    const metersObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                meterFills.forEach(fill => {
                    const scale = parseFloat(fill.dataset.fill || '1');
                    requestAnimationFrame(() => {
                        fill.style.transition = 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
                        fill.style.transform = `scaleX(${scale})`;
                    });
                });
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.4
    });

    const heroPanel = document.getElementById('heroPanel');
    if (heroPanel) {
        metersObserver.observe(heroPanel);
    }

    // Scroll‑reveal cards
    const cardsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;
            if (entry.isIntersecting) {
                const delay = parseInt(card.dataset.delay || '0', 10);
                setTimeout(() => {
                    card.classList.add('card-active');
                }, delay);
                cardsObserver.unobserve(card);
            }
        });
    }, {
        threshold: 0.16
    });

    cards.forEach(card => cardsObserver.observe(card));

    // Scroll hint visibility
    let hintShown = false;
    window.addEventListener('scroll', () => {
        if (hintShown) return;
        if (window.scrollY > 60) {
            hintShown = true;
            scrollHint.classList.add('scroll-hint-visible');
            setTimeout(() => {
                scrollHint.classList.remove('scroll-hint-visible');
            }, 3800);
        }
    });

    // Small hover wiggle on hero panel using mouse position
    const motionPanel = document.getElementById('heroPanel');
    if (motionPanel) {
        let bounding = null;
        const updateBounding = () => { bounding = motionPanel.getBoundingClientRect(); };
        updateBounding();
        window.addEventListener('resize', updateBounding);

        motionPanel.addEventListener('mousemove', (e) => {
            if (!bounding) return;
            const x = (e.clientX - bounding.left) / bounding.width - 0.5;
            const y = (e.clientY - bounding.top) / bounding.height - 0.5;
            const rotateX = y * 6;
            const rotateY = -x * 10;
            motionPanel.style.transform = `perspective(1100px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-4px)`;
        });

        motionPanel.addEventListener('mouseleave', () => {
            motionPanel.style.transform = 'perspective(1100px) rotateY(-14deg) rotateX(4deg)';
        });
    }
});
