// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Animate Icon transformation could go here
        });
    }

    // Close Mobile Menu on Link Click
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-deepCharcoal/90', 'shadow-lg');
            navbar.classList.remove('py-6');
            navbar.classList.add('py-4');
        } else {
            navbar.classList.remove('bg-deepCharcoal/90', 'shadow-lg');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-6');
        }
    });

    // Initialize Lucide Icons (if not already handled by the script tag's auto init, but safe to call)
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Horizontal Scroll Logic
    const menuContainer = document.getElementById('menu-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    if (menuContainer && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            menuContainer.scrollBy({ left: -360, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            menuContainer.scrollBy({ left: 360, behavior: 'smooth' });
        });
    }

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
});
