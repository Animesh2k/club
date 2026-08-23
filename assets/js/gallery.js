let currentLimit = 9;
let activeCategory = 'blood';
let activeLoadSessionId = 0; // Session tracker to avoid duplicate/overlapping load updates

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Find initial active category button on page load
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        // Fallback to extraction if activeBtn exists
        const onclickAttr = activeBtn.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/filterGallery\(this,\s*'([^']+)'\)/);
            if (match && match[1]) {
                activeCategory = match[1];
            }
        }
    }

    // Bind click listener to Load More button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            currentLimit += 9;
            updateGalleryDisplay();
        });
    }

    // Initial display run
    updateGalleryDisplay();
});

window.onload = function () {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        updatePill(activeBtn);
    }
};

window.addEventListener('resize', function () {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        updatePill(activeBtn);
    }
});

function updatePill(btn) {
    const pill = document.getElementById('pill');
    if (pill && btn) {
        pill.style.width = btn.offsetWidth + 'px';
        pill.style.left = btn.offsetLeft + 'px';
        pill.style.top = btn.offsetTop + 'px';
        pill.style.height = btn.offsetHeight + 'px';
    }
}

// Called by inline onclick attribute on category buttons
function filterGallery(btn, category) {
    const btns = document.getElementsByClassName('filter-btn');

    // Update active button classes
    for (let b of btns) {
        b.classList.remove('active');
    }
    btn.classList.add('active');
    updatePill(btn);

    // Reset pagination state for the new category
    activeCategory = category;
    currentLimit = 9;

    updateGalleryDisplay();
}

function updateGalleryDisplay() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = Array.from(grid.getElementsByClassName('gallery-item'));

    // Filter items matching the active category
    const matchingItems = items.filter(item => {
        const cats = item.getAttribute('data-category');
        return activeCategory === 'all' || cats.includes(activeCategory);
    });

    // Update display state for all items
    let visibleCount = 0;
    const visibleElements = [];

    items.forEach(item => {
        const cats = item.getAttribute('data-category');
        const isMatch = activeCategory === 'all' || cats.includes(activeCategory);

        if (isMatch) {
            if (visibleCount < currentLimit) {
                // Show item within pagination limit
                item.classList.remove('hidden');
                visibleElements.push(item);

                // Set animation delay for nice staggered entry
                const delayVal = ((visibleCount % 10) + 1) * 0.1;
                item.style.animationDelay = `${delayVal.toFixed(1)}s`;

                // Small delay to trigger transitions
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                    item.style.animation = 'revealItem 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards';
                }, 50);

                visibleCount++;
            } else {
                // Hide matching items exceeding limit
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.classList.add('hidden');
            }
        } else {
            // Hide non-matching items
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.classList.add('hidden');
        }
    });

    // Show/hide Load More button depending on whether more matching items are available
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (matchingItems.length > currentLimit) {
            loadMoreBtn.style.display = 'flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Track loading of newly visible images and show progress bar
    trackImageLoading(visibleElements);
}

function trackImageLoading(visibleItems) {
    const progressBar = document.getElementById('galleryProgressBar');
    const progressBarFill = document.getElementById('galleryProgressBarFill');
    if (!progressBar || !progressBarFill) return;

    // Increment session ID to cancel any active load tracking from previous operations
    activeLoadSessionId++;
    const thisSessionId = activeLoadSessionId;

    const imgs = visibleItems.map(item => item.querySelector('img')).filter(Boolean);
    const loadingImgs = imgs.filter(img => !img.complete);

    if (loadingImgs.length === 0) {
        progressBarFill.style.width = '100%';
        progressBar.style.opacity = '0';

        visibleItems.forEach(item => {
            item.classList.remove('img-loading');
            item.classList.add('img-loaded');
        });
        return;
    }

    progressBar.style.opacity = '1';
    progressBarFill.style.width = '0%';

    let loadedCount = 0;
    const totalToLoad = loadingImgs.length;

    loadingImgs.forEach(img => {
        const parent = img.closest('.gallery-item');
        if (parent) {
            parent.classList.remove('img-loaded');
            parent.classList.add('img-loading');
        }

        const handleImageLoad = () => {
            // Clean up listeners immediately
            img.removeEventListener('load', handleImageLoad);
            img.removeEventListener('error', handleImageLoad);

            // If this event belongs to an outdated load session, discard it
            if (thisSessionId !== activeLoadSessionId) return;

            if (parent) {
                parent.classList.remove('img-loading');
                parent.classList.add('img-loaded');
            }
            loadedCount++;

            const percent = (loadedCount / totalToLoad) * 100;
            progressBarFill.style.width = `${percent}%`;

            if (loadedCount === totalToLoad) {
                setTimeout(() => {
                    if (thisSessionId === activeLoadSessionId) {
                        progressBar.style.opacity = '0';
                        setTimeout(() => {
                            if (thisSessionId === activeLoadSessionId) {
                                progressBarFill.style.width = '0%';
                            }
                        }, 300);
                    }
                }, 400);
            }
        };

        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad);

        if (img.complete) {
            handleImageLoad();
        }
    });

    // Ensure already cached/loaded visible images are properly marked loaded
    imgs.forEach(img => {
        if (img.complete) {
            const parent = img.closest('.gallery-item');
            if (parent) {
                parent.classList.remove('img-loading');
                parent.classList.add('img-loaded');
            }
        }
    });
}

