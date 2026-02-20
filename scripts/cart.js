// Core Cart Logic for Empire Burger Blok F
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyState = document.getElementById('cart-empty');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const itemTemplate = document.getElementById('cart-item-template');

    // State
    let cart = [];

    // --- Core Functions ---

    // Load Cart
    const loadCart = () => {
        const saved = localStorage.getItem('empireBurgerCart');
        if (saved) {
            try {
                cart = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse cart', e);
                cart = [];
            }
        }
        renderCart();
    };

    // Save Cart
    const saveCart = () => {
        localStorage.setItem('empireBurgerCart', JSON.stringify(cart));
        renderCart();
    };

    // Add to Cart
    const addToCart = (item) => {
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        // Visual Feedback (Fly-to-cart effect or just simple toast)
        // For now, simpler bounce/feedback
        cartBtn.classList.add('scale-125');
        setTimeout(() => cartBtn.classList.remove('scale-125'), 200);

        saveCart();
        openCart(); // Optional: Auto open cart on add? Maybe just show badge. Let's just show badge.
        // But for better UX, let's just make sure badge updates.
    };

    // Remove Item
    const removeItem = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveCart();
    };

    // Update Quantity
    const updateQuantity = (id, change) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeItem(id);
            } else {
                saveCart();
            }
        }
    };

    // Calculate Total
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Calculate Count
    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Render Cart
    const renderCart = () => {
        // Update Badge
        const count = getCartCount();
        cartCountEl.textContent = count;
        if (count > 0) {
            cartCountEl.classList.remove('hidden');
            cartCountEl.classList.add('flex');
        } else {
            cartCountEl.classList.add('hidden');
            cartCountEl.classList.remove('flex');
        }

        // Update Total
        const total = getCartTotal();
        cartTotalEl.textContent = `RM ${total}`;

        // Render Items
        // Clear current items (except default empty state logic)
        // Actually, easiest is to clear all children that are items.
        // Let's rebuild the container content.

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(cartEmptyState);
            cartEmptyState.classList.remove('hidden'); // Ensure it's visible
            checkoutBtn.disabled = true;
            checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            cartItemsContainer.innerHTML = ''; // Remove empty state
            checkoutBtn.disabled = false;
            checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

            cart.forEach(item => {
                const clone = itemTemplate.content.cloneNode(true);

                // Populate Data
                const img = clone.querySelector('.cart-item-img');
                img.src = item.image;
                img.alt = item.name;

                clone.querySelector('.cart-item-title').textContent = item.name;
                clone.querySelector('.cart-item-price').textContent = `RM ${(item.price * item.quantity).toFixed(2)}`;
                clone.querySelector('.cart-item-qty').textContent = item.quantity;

                // Event Listeners
                clone.querySelector('.cart-item-remove').addEventListener('click', () => removeItem(item.id));
                clone.querySelector('.cart-item-increase').addEventListener('click', () => updateQuantity(item.id, 1));
                clone.querySelector('.cart-item-decrease').addEventListener('click', () => updateQuantity(item.id, -1));

                cartItemsContainer.appendChild(clone);
            });

            // Re-initialize icons for new elements
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    };

    // --- UI Interactions ---

    const openCart = () => {
        cartOverlay.classList.remove('hidden');
        // Trigger reflow
        void cartOverlay.offsetWidth;
        cartOverlay.classList.remove('opacity-0');

        cartSidebar.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    };

    const closeCart = () => {
        cartOverlay.classList.add('opacity-0');
        cartSidebar.classList.add('translate-x-full');

        setTimeout(() => {
            cartOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300); // Match duration-300
    };

    // Toggle Events
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    // Add to Cart Events
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Prevent event bubbling if needed
            e.preventDefault();

            const item = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };

            addToCart(item);
        });
    });

    // --- Checkout Logic (WhatsApp) ---
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const phone = '60183178107'; // Replace with actual number
        let message = `*Assalamualaikum Empire Burger! Saya nak order:*%0a%0a`;

        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - RM ${(item.price * item.quantity).toFixed(2)}%0a`;
        });

        message += `%0a*Total: RM ${getCartTotal()}*`;
        message += `%0a%0aTerima Kasih!`;

        const url = `https://wa.me/${phone}?text=${message}`;
        window.open(url, '_blank');

        // Clear cart and redirect to success page
        cart = [];
        saveCart();
        cartBtn.classList.add('hidden'); // Optional: hide cart badge completely if desired, or just let renderCart() handle it
        window.location.href = 'success.html';
    });

    // Intialize listener for custom events from combo builder
    document.addEventListener('empire-burger-add-to-cart', (e) => {
        if (e.detail) {
            addToCart(e.detail);
        }
    });

    // Initialize
    loadCart();
});
