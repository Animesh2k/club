document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.replace('opacity-50', 'opacity-0');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.replace('opacity-0', 'opacity-50');
        }, 5000);
    }
});
