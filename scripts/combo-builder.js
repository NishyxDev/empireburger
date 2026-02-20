// Interactive Combo Builder Logic
document.addEventListener('DOMContentLoaded', () => {

    // Options Data
    const comboOptions = {
        burger: [
            { id: 'b1', name: 'The Classic Prime', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop', priceAdd: 0 },
            { id: 'b2', name: 'Spicy Volcano', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=600&auto=format&fit=crop', priceAdd: 0 },
            { id: 'b3', name: 'Truffle Majesty', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop', priceAdd: 5.00 }
        ],
        side: [
            { id: 's1', name: 'Classic Fries', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=600&auto=format&fit=crop', priceAdd: 0 },
            { id: 's2', name: 'Cheesy Wedges', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=600&auto=format&fit=crop', priceAdd: 2.00 }, // using fries for placeholder
            { id: 's3', name: 'Onion Rings', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=600&auto=format&fit=crop', priceAdd: 3.00 }
        ],
        drink: [
            { id: 'd1', name: 'Soft Drink (Coke)', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop', priceAdd: 0 },
            { id: 'd2', name: 'Iced Lemon Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop', priceAdd: 0 },
            { id: 'd3', name: 'Premium Milkshake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop', priceAdd: 4.00 }
        ]
    };

    // Overriding side images if specific are lacking
    comboOptions.side[1].image = 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=600&auto=format&fit=crop';

    // DOM Elements
    const modalOverlay = document.getElementById('combo-modal-overlay');
    const modalBox = document.getElementById('combo-modal');
    const closeBtn = document.getElementById('close-combo-modal');
    const buildComboBtns = document.querySelectorAll('.build-combo-btn');

    const step1Container = document.getElementById('combo-step-1');
    const step2Container = document.getElementById('combo-step-2');
    const step3Container = document.getElementById('combo-step-3');

    // Progress
    const progressBar = document.getElementById('combo-progress-bar');
    const stepCircles = [
        document.getElementById('step-1-circle'),
        document.getElementById('step-2-circle'),
        document.getElementById('step-3-circle')
    ];
    const stepTexts = [
        null, // burger is always white initially
        document.getElementById('step-2-text'),
        document.getElementById('step-3-text')
    ];

    // Buttons
    const backBtn = document.getElementById('combo-back-btn');
    const nextBtn = document.getElementById('combo-next-btn');
    const addBtn = document.getElementById('combo-add-btn');

    // Total Price Display
    const priceDisplay = document.getElementById('combo-total-price');
    const modalTitle = document.getElementById('combo-modal-title');

    // State
    let currentStep = 1;
    let baseCombo = null; // { id, name, price, image }
    let selections = {
        burger: null,
        side: null,
        drink: null
    };

    // Render Options
    const renderOptions = (type, containerId) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        comboOptions[type].forEach(opt => {
            const isSelected = selections[type] && selections[type].id === opt.id;
            const priceTag = opt.priceAdd > 0 ? `<span class="text-xs font-bold text-goldenYellow block mt-1">+RM ${opt.priceAdd.toFixed(2)}</span>` : '<span class="text-xs font-bold text-gray-500 block mt-1">(Termasuk)</span>';

            const card = document.createElement('div');
            card.className = `cursor-pointer rounded-xl border-2 transition-all p-3 flex items-center gap-4 ${isSelected ? 'border-goldenYellow bg-goldenYellow/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`;
            card.innerHTML = `
                <img src="${opt.image}" class="w-16 h-16 rounded-lg object-cover shadow-sm">
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-white leading-tight">${opt.name}</h4>
                    ${priceTag}
                </div>
                <!-- Circle selector -->
                <div class="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-goldenYellow border-goldenYellow' : 'bg-transparent'}">
                    ${isSelected ? '<i data-lucide="check" class="w-4 h-4 text-deepCharcoal font-bold"></i>' : ''}
                </div>
            `;

            card.addEventListener('click', () => {
                selections[type] = opt;
                renderOptions(type, containerId); // Re-render to update UI
                updateUI(); // Check next btn, update price
            });

            container.appendChild(card);
        });

        if (window.lucide) window.lucide.createIcons();
    };

    // Open Modal
    const openModal = (comboData) => {
        baseCombo = comboData;
        modalTitle.textContent = baseCombo.name;

        // Reset state
        currentStep = 1;
        selections = { burger: null, side: null, drink: null };

        renderOptions('burger', 'combo-burger-list');
        renderOptions('side', 'combo-side-list');
        renderOptions('drink', 'combo-drink-list');

        updateUI();
        showStep(1);

        modalOverlay.classList.remove('hidden');
        // trigger reflow
        void modalOverlay.offsetWidth;
        modalOverlay.classList.remove('opacity-0');
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    };

    // Close Modal
    const closeModal = () => {
        modalOverlay.classList.add('opacity-0');
        modalBox.classList.remove('scale-100');
        modalBox.classList.add('scale-95');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    // Go to step
    const showStep = (step) => {
        const containers = [step1Container, step2Container, step3Container];

        containers.forEach((c, index) => {
            const stepNum = index + 1;
            if (stepNum === step) {
                c.classList.remove('invisible', 'translate-x-full', '-translate-x-full');
                c.classList.add('translate-x-0', 'opacity-100');
                c.style.opacity = '1';
                c.style.pointerEvents = 'auto';
            } else if (stepNum < step) {
                c.classList.remove('translate-x-0', 'translate-x-full');
                c.classList.add('-translate-x-full', 'invisible');
                c.style.opacity = '0';
                c.style.pointerEvents = 'none';
            } else {
                c.classList.remove('translate-x-0', '-translate-x-full');
                c.classList.add('translate-x-full', 'invisible');
                c.style.opacity = '0';
                c.style.pointerEvents = 'none';
            }
        });

        // Update Progress Bar
        const progressPercentages = [0, 50, 100];
        progressBar.style.width = `${progressPercentages[step - 1]}%`;

        // Update Circles
        stepCircles.forEach((circle, index) => {
            const stepNum = index + 1;
            if (stepNum <= step) {
                circle.classList.add('bg-goldenYellow', 'text-deepCharcoal');
                circle.classList.remove('bg-deepCharcoal', 'text-gray-400', 'border', 'border-white/20');
                circle.classList.add('shadow-[0_0_10px_#FFB703]');
                if (stepTexts[index]) {
                    stepTexts[index].classList.replace('text-gray-500', 'text-white');
                }
            } else {
                circle.classList.remove('bg-goldenYellow', 'text-deepCharcoal', 'shadow-[0_0_10px_#FFB703]');
                circle.classList.add('bg-deepCharcoal', 'text-gray-400', 'border', 'border-white/20');
                if (stepTexts[index]) {
                    stepTexts[index].classList.replace('text-white', 'text-gray-500');
                }
            }
        });

        // Update Buttons
        backBtn.classList.toggle('hidden', step === 1);

        if (step === 3) {
            nextBtn.classList.add('hidden');
            addBtn.classList.remove('hidden'); // flex depends on specific screen sizes sometimes, basic inline-flex used below
            addBtn.style.display = 'inline-flex';
        } else {
            nextBtn.classList.remove('hidden');
            addBtn.classList.add('hidden');
            addBtn.style.display = 'none';
        }

        updateUI();
    };

    // Check validity and calculate prices
    const updateUI = () => {
        // Calculate total
        let total = parseFloat(baseCombo?.price || 0);
        if (selections.burger) total += selections.burger.priceAdd;
        if (selections.side) total += selections.side.priceAdd;
        if (selections.drink) total += selections.drink.priceAdd;

        priceDisplay.textContent = `RM ${total.toFixed(2)}`;

        // Check current step validation
        let canProceed = false;
        if (currentStep === 1 && selections.burger) canProceed = true;
        if (currentStep === 2 && selections.side) canProceed = true;

        if (currentStep < 3) {
            if (canProceed) {
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                nextBtn.disabled = false;
            } else {
                nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
                nextBtn.disabled = true;
            }
        }

        if (currentStep === 3) {
            if (selections.drink) {
                addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                addBtn.disabled = false;
            } else {
                addBtn.classList.add('opacity-50', 'cursor-not-allowed');
                addBtn.disabled = true;
            }
        }
    };

    // Event Listeners
    buildComboBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const comboData = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image
            };
            openModal(comboData);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < 3) {
            currentStep++;
            showStep(currentStep);
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    addBtn.addEventListener('click', () => {
        if (selections.burger && selections.side && selections.drink) {
            // Calculate final price
            let total = parseFloat(baseCombo.price);
            total += selections.burger.priceAdd + selections.side.priceAdd + selections.drink.priceAdd;

            // Format name: "Set A: Classic Prime + Cheesy Wedges + Coke"
            const finalName = `${baseCombo.name}: ${selections.burger.name} + ${selections.side.name} + ${selections.drink.name}`;

            const finalItem = {
                id: `${baseCombo.id}-${selections.burger.id}-${selections.side.id}-${selections.drink.id}`,
                name: finalName,
                price: parseFloat(total.toFixed(2)),
                image: baseCombo.image
            };

            // Dispatch global event for cart to pick up
            const event = new CustomEvent('empire-burger-add-to-cart', { detail: finalItem });
            document.dispatchEvent(event);

            closeModal();

            // The cart logic handles visually opening cart or badge increment
        }
    });

});
