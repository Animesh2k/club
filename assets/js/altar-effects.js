document.addEventListener('DOMContentLoaded', () => {
    // Blood bag image touch/click toggle logic
    const bloodBagImg = document.getElementById('blood-bag-img');
    if (bloodBagImg) {
        bloodBagImg.addEventListener('click', (e) => {
            e.stopPropagation();
            const isColored = bloodBagImg.classList.contains('grayscale-0');
            if (isColored) {
                bloodBagImg.classList.remove('grayscale-0', 'opacity-100', 'scale-105');
                bloodBagImg.classList.add('grayscale', 'opacity-80');
            } else {
                bloodBagImg.classList.remove('grayscale', 'opacity-80');
                bloodBagImg.classList.add('grayscale-0', 'opacity-100', 'scale-105');
            }
        });

        document.addEventListener('click', () => {
            bloodBagImg.classList.remove('grayscale-0', 'opacity-100', 'scale-105');
            bloodBagImg.classList.add('grayscale', 'opacity-80');
        });
    }

    const canvas = document.getElementById('altar-sparks');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;
    let width = 0;
    let height = 0;
    let mouseX = null;
    let mouseY = null;
    let wind = 0;
    let targetWind = 0;

    // Optimize performance: only run when visible in viewport
    let isVisible = true;
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    if (!animationId) startAnimation();
                } else {
                    if (animationId) {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        observer.observe(canvas);
    }

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;

        // Handle high DPI displays for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? Math.random() * height : height + 10;
            this.size = Math.random() * 2 + 0.6; // tiny delicate sparks
            this.speedY = -(Math.random() * 1.5 + 0.5); // float upwards
            this.speedX = (Math.random() * 0.6 - 0.3); // slight drift
            this.alpha = Math.random() * 0.5 + 0.3; // initial opacity
            this.decay = Math.random() * 0.003 + 0.0015; // fade rate
            this.hue = Math.random() > 0.4 ? 24 : (Math.random() > 0.5 ? 38 : 12); // Warm temple fire hues (orange/gold/amber)
            this.lightness = Math.random() * 20 + 60; // bright glow
        }

        update() {
            this.y += this.speedY;

            // Apply gentle horizontal wind + friction
            this.speedX += (wind - this.speedX) * 0.05;
            this.x += this.speedX;

            // Interactive touch force
            if (mouseX !== null && mouseY !== null) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    this.speedX += (dx / dist) * force * 0.8;
                    this.speedY -= force * 0.4;
                }
            }

            this.alpha -= this.decay;

            // Recycle particle if faded or out of bounds
            if (this.alpha <= 0 || this.x < 0 || this.x > width || this.y < -10) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            // Draw a soft glowing dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.lightness}%)`;
            // Add a subtle drop shadow glow effect
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize particle pool (fewer particles on mobile for speed)
    const particleCount = Math.min(60, Math.floor(width / 8));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Touch/Mouse interaction handlers
    function handleMove(e) {
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const rect = canvas.getBoundingClientRect();
        mouseX = clientX - rect.left;
        mouseY = clientY - rect.top;

        // Introduce wind drift
        targetWind = (Math.random() - 0.5) * 3;

        // Interactive Spark Spawning: emit sparks on swipe
        if (particles.length < 150) {
            for (let i = 0; i < 2; i++) {
                const sp = new Particle();
                sp.x = mouseX;
                sp.y = mouseY;
                sp.alpha = Math.random() * 0.7 + 0.3;
                sp.speedY = -(Math.random() * 1.8 + 0.5);
                sp.speedX = (Math.random() * 1.6 - 0.8);
                particles.push(sp);
            }
        }
    }

    function handleLeave() {
        mouseX = null;
        mouseY = null;
        targetWind = 0;
    }

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('touchend', handleLeave);

    // Dynamic wind updates on scroll to mimic vertical air currents
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const diff = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Visual feedback: scroll down creates temporary upwards speed and left/right drift
        if (Math.abs(diff) > 2) {
            targetWind = (diff > 0 ? 1 : -1) * 1.5;
            particles.forEach(p => {
                p.speedY -= Math.abs(diff) * 0.05;
                if (p.speedY < -4) p.speedY = -4; // cap speed
            });
        }
    }, { passive: true });

    function animate() {
        if (!isVisible) {
            animationId = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Smooth out wind drift
        wind += (targetWind - wind) * 0.02;

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw interactive gold constellation lines between close particles
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];

            // Connect to other nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 75) {
                    // Golden faint line based on distance and particle opacity
                    const alpha = (1 - (dist / 75)) * 0.16 * Math.min(p1.alpha, p2.alpha);
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 109, 0, ${alpha})`;
                    ctx.lineWidth = 0.55;
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Connect particles to mouse / touch cursor with slightly brighter lines
            if (mouseX !== null && mouseY !== null) {
                const dx = p1.x - mouseX;
                const dy = p1.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    const alpha = (1 - (dist / 110)) * 0.3 * p1.alpha;
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(255, 179, 100, ${alpha})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
    }

    // Interactive 3D Parallax Tilt for Goddess Silhouette, Mandala Aura, and Background Image on Mobile
    const centerpiece = document.getElementById('hero-centerpiece');
    const durgaWrap = document.getElementById('hero-durga-wrap');
    const auraBg = document.getElementById('hero-aura');
    const auraBgInner = document.getElementById('hero-aura-inner');
    const bgImg = document.getElementById('hero-bg-img');

    if (centerpiece && durgaWrap && auraBg) {
        function applyTilt(clientX, clientY) {
            const rect = centerpiece.getBoundingClientRect();
            // Calculate center of visual area
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalized offset from center (-1 to 1)
            const dx = (clientX - centerX) / (window.innerWidth / 2);
            const dy = (clientY - centerY) / (window.innerHeight / 2);

            // Apply soft 3D rotation and translation transitions
            durgaWrap.style.transform = `translate3d(${dx * 18}px, ${dy * 18}px, 0) rotateY(${dx * 22}deg) rotateX(${-dy * 22}deg)`;
            auraBg.style.transform = `translate3d(${dx * -8}px, ${dy * -8}px, 0) rotate(${dx * 10}deg)`;
            if (auraBgInner) {
                auraBgInner.style.transform = `translate3d(${dx * -14}px, ${dy * -14}px, 0) rotate(${dx * -15}deg)`;
            }
            if (bgImg) {
                bgImg.style.transform = `scale(1.1) translate3d(${dx * 8}px, ${dy * 8}px, 0)`;
            }
        }

        function resetTilt() {
            durgaWrap.style.transform = 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)';
            auraBg.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            if (auraBgInner) {
                auraBgInner.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
            }
            if (bgImg) {
                bgImg.style.transform = 'scale(1) translate3d(0, 0, 0)';
            }
        }

        // Mouse trigger on desktop only
        window.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            applyTilt(e.clientX, e.clientY);
        });

        // Reset positions on leave
        window.addEventListener('mouseleave', resetTilt);
    }

    // Tap-to-toggle color on mobile for Blood Donation Bag Image
    const bloodImg = document.getElementById('blood-bag-img');
    if (bloodImg) {
        bloodImg.addEventListener('click', (e) => {
            e.stopPropagation();
            bloodImg.classList.toggle('touch-active');
        });
    }

    // Run first frame
    startAnimation();
});
