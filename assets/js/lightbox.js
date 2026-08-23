document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('galleryGrid');
    const modal = document.getElementById('lightboxModal');
    if (!grid || !modal) return;

    const modalImg = document.getElementById('lightboxImage');
    const modalTitle = document.getElementById('lightboxTitle');
    const modalCat = document.getElementById('lightboxCategory');
    const modalCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    let visibleItems = [];
    let currentIndex = -1;

    // Helper to update visible items based on current active category filter
    function updateVisibleItems() {
        const items = Array.from(grid.getElementsByClassName('gallery-item'));
        visibleItems = items.filter(item => !item.classList.contains('hidden') && window.getComputedStyle(item).display !== 'none');
    }

    // Function to open lightbox
    function openLightbox(item) {
        updateVisibleItems();
        currentIndex = visibleItems.indexOf(item);
        if (currentIndex === -1) return;

        const img = item.querySelector('img');
        const h3 = item.querySelector('h3');
        const tag = item.querySelector('.category-tag');
        const category = item.getAttribute('data-category');

        modalImg.src = img.src;
        modalImg.alt = img.alt || '';
        
        // Hide caption for "pujo" (Our Pujo Diary) and "blood" (Blood Donation) images
        if (category === 'pujo' || category === 'blood') {
            if (modalCaption) modalCaption.style.display = 'none';
        } else {
            if (modalCaption) {
                modalCaption.style.display = 'block';
                const titleText = h3 ? h3.textContent.trim() : '';
                const catText = tag ? tag.textContent.trim() : '';

                if (modalTitle) {
                    modalTitle.textContent = titleText;
                    modalTitle.style.display = titleText ? 'block' : 'none';
                }
                if (modalCat) {
                    modalCat.textContent = catText;
                    modalCat.style.display = catText ? 'inline-block' : 'none';
                }
            }
        }

        // Show modal display first
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Force reflow to trigger CSS transitions
        void modal.offsetWidth;
        
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        if (modalImg) {
            modalImg.classList.remove('scale-95');
            modalImg.classList.add('scale-100');
        }
        
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        if (modalImg) {
            modalImg.classList.remove('scale-100');
            modalImg.classList.add('scale-95');
        }
        
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore main page scrolling
        }, 300);
    }

    // Navigate images (direction: 1 for next, -1 for previous)
    function navigate(direction) {
        updateVisibleItems();
        if (visibleItems.length <= 1) return;
        
        currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentIndex];
        
        const img = item.querySelector('img');
        const h3 = item.querySelector('h3');
        const tag = item.querySelector('.category-tag');
        const category = item.getAttribute('data-category');

        // Transition out
        if (modalImg) {
            modalImg.classList.remove('scale-100');
            modalImg.classList.add('scale-95');
            modalImg.style.opacity = '0';
        }

        setTimeout(() => {
            if (modalImg) {
                modalImg.src = img.src;
                modalImg.alt = img.alt || '';
            }
            
            // Hide caption for "pujo" (Our Pujo Diary) and "blood" (Blood Donation) images
            if (category === 'pujo' || category === 'blood') {
                if (modalCaption) modalCaption.style.display = 'none';
            } else {
                if (modalCaption) {
                    modalCaption.style.display = 'block';
                    const titleText = h3 ? h3.textContent.trim() : '';
                    const catText = tag ? tag.textContent.trim() : '';

                    if (modalTitle) {
                        modalTitle.textContent = titleText;
                        modalTitle.style.display = titleText ? 'block' : 'none';
                    }
                    if (modalCat) {
                        modalCat.textContent = catText;
                        modalCat.style.display = catText ? 'inline-block' : 'none';
                    }
                }
            }
            
            // Transition in
            if (modalImg) {
                modalImg.style.opacity = '1';
                modalImg.classList.remove('scale-95');
                modalImg.classList.add('scale-100');
            }
        }, 150);
    }

    // Delegation of click events on gallery items
    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            openLightbox(item);
        }
    });

    // Close on click close button or background overlay
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLightbox();
        }
    });

    // Navigation clicks
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(-1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(1);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    });
});
