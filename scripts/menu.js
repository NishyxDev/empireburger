// Menu Page Filtering Logic
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const categoryDescription = document.getElementById('category-description');

    const descriptions = {
        'all': 'Explore all our legendary flavors in one place.',
        'beef': 'Daging Angus Ori. Bakar Guna Arang. Smoky Teruk!',
        'chicken': 'Ayam Rangup Krup-Krap. Juicy Di Dalam.',
        'combo': 'Set Lengkap, Perut Puas. Lebih Jimat!',
        'sides': 'Sempurnakan hidangan anda dengan sidekicks padu kami.'
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active-category');
                b.setAttribute('aria-pressed', 'false');
            });
            // Add active class to clicked button
            btn.classList.add('active-category');
            btn.setAttribute('aria-pressed', 'true');

            const category = btn.getAttribute('data-category');

            // Update description with fade effect
            categoryDescription.style.opacity = '0';
            setTimeout(() => {
                categoryDescription.textContent = descriptions[category] || descriptions['all'];
                categoryDescription.style.opacity = '1';
            }, 300);

            // Filter items
            menuItems.forEach(item => {
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; /* trigger reflow */
                item.style.animation = null;

                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.classList.remove('hidden');
                    // Add fade-in animation
                    item.classList.add('animate-fade-in-up');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('animate-fade-in-up');
                }
            });

            // Auto-scroll to center the clicked button (optional better UX)
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // --- Horizontal Scroll Logic for Categories ---
    const catContainer = document.getElementById('category-scroll-container');
    const catLeftBtn = document.getElementById('cat-scroll-left');
    const catRightBtn = document.getElementById('cat-scroll-right');

    if (catContainer && catLeftBtn && catRightBtn) {
        // Scroll Amount matches roughly one item width + gap
        const scrollAmount = 150;

        // Button Click Events
        catLeftBtn.addEventListener('click', () => {
            catContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        catRightBtn.addEventListener('click', () => {
            catContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Scroll Position Monitoring
        const checkScroll = () => {
            const scrollLeft = catContainer.scrollLeft;
            const scrollWidth = catContainer.scrollWidth;
            const clientWidth = catContainer.clientWidth;
            const maxScroll = scrollWidth - clientWidth;

            // Show/Hide Left Button
            if (scrollLeft <= 5) { // Threshold
                catLeftBtn.classList.add('hidden');
                catLeftBtn.classList.remove('flex');
            } else {
                catLeftBtn.classList.remove('hidden');
                catLeftBtn.classList.add('flex');
            }

            // Show/Hide Right Button
            if (scrollLeft >= maxScroll - 5) {
                catRightBtn.classList.add('hidden');
                catRightBtn.classList.remove('flex');
            } else {
                catRightBtn.classList.remove('hidden');
                catRightBtn.classList.add('flex');
            }
        };

        // Initial Check
        checkScroll();
        // Check on Scroll
        catContainer.addEventListener('scroll', checkScroll);
        // Check on Resize
        window.addEventListener('resize', checkScroll);

        // Ensure Lucide icons are re-rendered for the new buttons if needed
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
});
