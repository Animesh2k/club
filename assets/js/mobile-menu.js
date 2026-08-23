document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;

    const nav = header.querySelector('nav');
    const hamburger = header.querySelector('button.md\\:hidden');
    if (!hamburger) return;

    // Get desktop links to duplicate
    const desktopLinks = header.querySelectorAll('div.hidden.md\\:flex a');

    // Create Mobile Menu Overlay
    const overlay = document.createElement('div');
    overlay.id = 'mobileMenuOverlay';
    overlay.className = 'fixed inset-0 z-[99] hidden flex-col items-center justify-center bg-[#0d0d0d]/90 backdrop-blur-[24px] transition-all duration-500 opacity-0 overflow-hidden';

    // Add Dynamic Background Ambient Glow Blobs (Google/Material You visual style)
    const blob1 = document.createElement('div');
    blob1.className = 'absolute -top-20 -right-20 w-80 h-80 rounded-full bg-secondary/15 blur-[100px] pointer-events-none z-0 animate-ambient-1';
    overlay.appendChild(blob1);

    const blob2 = document.createElement('div');
    blob2.className = 'absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0 animate-ambient-2';
    overlay.appendChild(blob2);

    // Create Close Button with modern layout and ripple style
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-6 right-6 text-on-surface-variant hover:text-secondary hover:scale-105 active:scale-95 transition-all duration-300 bg-white/5 hover:bg-white/10 p-3 rounded-full flex items-center justify-center z-10 border border-white/5';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">close</span>';
    overlay.appendChild(closeBtn);

    // Create Container for Links
    const linksContainer = document.createElement('div');
    linksContainer.className = 'flex flex-col items-center gap-10 relative z-10 w-full px-8 text-center';

    // Duplicate links inside overlay
    desktopLinks.forEach((link, index) => {
        const mobileLink = link.cloneNode(true);
        // Make the text larger and styled for modern layout
        mobileLink.className = 'text-3xl font-headline tracking-[0.15em] uppercase text-on-surface hover:text-secondary transition-all duration-300 font-bold opacity-0 py-2 relative block w-fit mx-auto';
        // Remove active border styles from copied link
        mobileLink.classList.remove('border-b', 'border-secondary', 'pb-1');

        // Highlight active page link in mobile menu with premium bullet indicator
        if (link.classList.contains('text-secondary') || link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            mobileLink.classList.add('text-secondary', 'font-black');
            const dot = document.createElement('span');
            dot.className = 'absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 circle-badge bg-secondary shadow-[0_0_10px_#ff6d00]';
            mobileLink.appendChild(dot);
        }

        linksContainer.appendChild(mobileLink);
    });

    overlay.appendChild(linksContainer);
    document.body.appendChild(overlay);

    // Toggle logic with staggered transitions
    function openMenu() {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        void overlay.offsetWidth; // force reflow
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        document.body.style.overflow = 'hidden';

        // Staggered fade/slide animation for links
        const links = linksContainer.querySelectorAll('a');
        links.forEach((link, idx) => {
            link.style.animationDelay = `${idx * 0.08}s`;
            link.classList.add('mobile-link-enter');
        });
    }

    function closeMenu() {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');

        // Remove staggered classes
        const links = linksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('mobile-link-enter');
        });

        setTimeout(() => {
            overlay.classList.remove('flex');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 500); // match transition duration
    }

    hamburger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    // Close overlay on clicking outside of links (on the blur area)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeMenu();
        }
    });

    // Close on link click with elegant animation delay
    linksContainer.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            closeMenu();
            if (href) {
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            }
        }
    });

    // Persist color on mobile touch/tap (prevent scroll reverting to grayscale)
    document.addEventListener('touchstart', (e) => {
        let img = e.target.closest('img.interactive-grayscale');
        if (!img) {
            const container = e.target.closest('.aspect-square, .group, div');
            if (container) {
                img = container.querySelector('img.interactive-grayscale');
            }
        }
        if (img) {
            img.classList.add('touch-active');
        }
    }, { passive: true });
});
