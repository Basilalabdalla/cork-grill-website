document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL HELPER FUNCTIONS ---
    const getCart = () => {
        try {
            const cartData = localStorage.getItem('corkGrillCart');
            // console.log("getCart raw data:", cartData); // DEBUG
            const cart = cartData ? JSON.parse(cartData) : [];
            // console.log("getCart parsed:", cart); // DEBUG
            return cart;
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            return [];
        }
    };

    const saveCart = (cart) => {
        try {
            // console.log("saveCart called with:", cart); // DEBUG
            localStorage.setItem('corkGrillCart', JSON.stringify(cart));
            updateGlobalCartCount();
        } catch (e) {
            console.error("Error saving cart to localStorage:", e);
        }
    };

    const clearCart = () => {
        localStorage.removeItem('corkGrillCart');
        localStorage.removeItem('corkGrillAppliedPromo');
        updateGlobalCartCount();
    };

    const getOrderHistory = () => JSON.parse(localStorage.getItem('corkGrillOrderHistory') || '[]');
    const saveOrderToHistory = (orderDetails) => { const history = getOrderHistory(); history.unshift(orderDetails); localStorage.setItem('corkGrillOrderHistory', JSON.stringify(history.slice(0, 10))); };

    const updateGlobalCartCount = () => {
        const cart = getCart();
        let totalItems = 0;
        cart.forEach(item => {
            const quantity = parseInt(item.quantity);
            if (!isNaN(quantity) && quantity > 0) {
                totalItems += quantity;
            }
        });
        // console.log("updateGlobalCartCount - totalItems:", totalItems); // DEBUG
        const globalCartCountEl = document.getElementById('globalCartCount');
        if (globalCartCountEl) {
            const prevCount = parseInt(globalCartCountEl.dataset.prevCount || '0');
            globalCartCountEl.textContent = totalItems;
            if ((totalItems > prevCount && totalItems > 0) || (totalItems < prevCount && prevCount >= 0)) {
                globalCartCountEl.classList.add('updated');
                setTimeout(() => globalCartCountEl.classList.remove('updated'), 300);
            }
            globalCartCountEl.dataset.prevCount = totalItems;
        }
    };

    function showError(inputElement, message) { if (!inputElement) return; inputElement.classList.add('error'); const errorSpan = inputElement.nextElementSibling; if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = message; } }
    function clearError(inputElement) { if (!inputElement) return; inputElement.classList.remove('error'); const errorSpan = inputElement.nextElementSibling; if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = ''; } }
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    const setButtonLoading = (button, isLoading) => { /* ... (same as before) ... */
        if (!button) return;
        const textSpan = button.querySelector('.btn-text');
        const spinnerSpan = button.querySelector('.loading-spinner');
        button.disabled = isLoading;
        if (isLoading) {
            button.classList.add('loading');
            if (textSpan) textSpan.style.display = 'none';
            if (spinnerSpan) spinnerSpan.style.display = 'inline-block';
        } else {
            button.classList.remove('loading');
            if (textSpan) textSpan.style.display = 'inline';
            if (spinnerSpan) spinnerSpan.style.display = 'none';
        }
    };

    // --- INITIALIZE GLOBAL ELEMENTS ---
    updateGlobalCartCount();
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNavMenu = document.getElementById('mainNavMenu');
    if (mobileNavToggle && mainNavMenu) { /* ... (same as before) ... */ }
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) { /* ... (same as before) ... */ }

    // --- DUMMY MENU ITEMS DATA STORE ---
    const menuItemsData = { /* ... (same as before, ensure all image paths are "images/placeholder...") ... */
        "kebab-deluxe": { id: "kebab-deluxe", name: "Deluxe Kebab", description: "Our signature kebab...", price: 9.50, image: "images/placeholder-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}, {id:"onion", name:"Onion", price:0, default:false}, {id:"extra_cheese", name:"Extra Cheese", price:1.00, default:false}, {id:"pickles", name:"No Pickles", price:-0.50, default:false, isRemoval: true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"chili", name:"Chili Sauce"}, {id:"house_special", name:"House Special"}], mealOptionPrice: 3.50 },
        "chicken-kebab": { id: "chicken-kebab", name: "Chicken Kebab", description: "Marinated grilled chicken...", price: 9.00, image: "images/placeholder-chicken-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"mayo", name:"Mayonnaise"}], mealOptionPrice: 3.50 },
        "classic-burger": { id: "classic-burger", name: "Classic Burger", description: "A juicy beef patty...", price: 8.00, image: "images/placeholder-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "cheese-burger": { id: "cheese-burger", name: "Cheese Burger", description: "Classic burger with cheddar.", price: 8.75, image: "images/placeholder-cheese-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "kebab-meal-deal": {id: "kebab-meal-deal", name: "Kebab Meal Deal", description: "Kebab, Fries & Drink.", price: 12.50, image: "images/placeholder-kebab-meal.jpg", category: "Deals", isDeal: true, featured: false},
        "spicy-chicken-burger": {id: "spicy-chicken-burger", name: "Spicy Kickin' Chicken Burger", description: "Crispy chicken fillet...", price: 9.00, originalPrice: 10.50, image: "images/placeholder-spicy-burger.jpg", category: "Burgers", featured: true, mealOptionPrice: 3.00}, // Changed category to Burgers for demo
        "loaded-fries-special": {id: "loaded-fries-special", name: "Fully Loaded Fries", description: "Signature fries topped...", price: 6.50, image: "images/placeholder-loaded-fries.jpg", category: "Sides", featured: true, mealOptionPrice: null}, // Changed category
        "falafel-wrap": {id: "falafel-wrap", name: "Falafel Wrap", description: "Crispy falafel, hummus, tahini...", price: 7.50, image: "images/placeholder-falafel-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "chicken-caesar-wrap": {id: "chicken-caesar-wrap", name: "Chicken Caesar Wrap", description: "Grilled chicken, romaine...", price: 8.50, image: "images/placeholder-caesar-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "regular-fries": {id: "regular-fries", name: "Regular Fries", description: "Classic golden fries...", price: 3.50, image: "images/placeholder-fries.jpg", category: "Sides"},
        "onion-rings": {id: "onion-rings", name: "Onion Rings", description: "Crispy battered onion rings.", price: 4.50, image: "images/placeholder-onion-rings.jpg", category: "Sides"},
        "coca-cola": {id: "coca-cola", name: "Coca-Cola", description: "330ml Can", price: 2.00, image: "images/placeholder-coke.jpg", category: "Drinks"},
        "water-still": {id: "water-still", name: "Still Water", description: "500ml Bottle", price: 1.50, image: "images/placeholder-water.jpg", category: "Drinks"},
        "burger-meal-deal": {id: "burger-meal-deal", name: "Burger Bonanza Deal", description: "Any Classic Burger, regular Fries & a selected Drink.", price: 11.00, image: "images/placeholder-burger-meal.jpg", category: "Deals", isDeal: true}
    };
    const promoCodes = { "SAVE10": { type: "percentage", value: 10 }, "CORKGRILL2": { type: "fixed", value: 2.00 } };


    // --- HOMEPAGE SPECIFIC LOGIC (INDEX.HTML) ---
    if (document.querySelector('.hero-section')) { /* ... (same as previous full code) ... */ }

    // --- ITEM DETAIL PAGE SPECIFIC LOGIC ---
    const isItemDetailPage = document.body.classList.contains('item-customization-page');
    if (isItemDetailPage) { /* ... (same as previous full code, ensure currentItemConfig is checked before use) ... */ }


    // --- CART PAGE SPECIFIC LOGIC ---
    const isCartPage = document.body.classList.contains('cart-page');
    if (isCartPage) {
        const cartItemsListEl = document.getElementById('cartItemsList');
        const cartEmptyMessageEl = document.getElementById('cartEmptyMessage');
        const cartSummarySectionEl = document.getElementById('cartSummarySection');
        const cartSubtotalEl = document.getElementById('cartSubtotal');
        const cartTotalEl = document.getElementById('cartTotal');
        const cartDiscountEl = document.getElementById('cartDiscount');
        const discountRowEl = document.getElementById('discountRow');
        const appliedPromoCodeTextEl = document.getElementById('appliedPromoCodeText');
        const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
        const checkoutFormSection = document.getElementById('checkoutFormSection');
        const checkoutForm = document.getElementById('checkoutForm');
        const applyPromoBtn = document.getElementById('applyPromoBtn');
        const promoCodeInput = document.getElementById('cartPromoCode');
        const promoStatusMessageEl = document.getElementById('promoStatusMessage');
        const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
        const deliveryAddressFieldsContainer = document.getElementById('deliveryAddressFields');
        const deliveryAddressInputs = deliveryAddressFieldsContainer.querySelectorAll('input[type="text"]:not(#checkoutAddress2), textarea:not(#deliveryInstructions)');
        const placeOrderBtn = document.getElementById('placeOrderBtn');

        let currentDiscountValue = 0;
        let appliedPromoCode = localStorage.getItem('corkGrillAppliedPromo');

        const saveCheckoutForm = () => { /* ... (same as previous) ... */ };
        const loadCheckoutForm = () => { /* ... (same as previous) ... */ };
        if (checkoutForm) { checkoutForm.addEventListener('input', saveCheckoutForm); loadCheckoutForm(); }

        const renderCart = () => {
            const cart = getCart();
            console.log("renderCart - cart from localStorage:", cart); // DEBUG
            if (!cartItemsListEl || !cartEmptyMessageEl || !cartSummarySectionEl) {
                console.error("Cart page display elements not all found for renderCart!");
                return;
            }

            cartItemsListEl.innerHTML = '';

            if (!cart || cart.length === 0) {
                console.log("renderCart - Cart is empty or null"); // DEBUG
                cartEmptyMessageEl.style.display = 'block';
                cartSummarySectionEl.style.display = 'none';
                if (checkoutFormSection) checkoutFormSection.style.display = 'none';
                if (proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'block'; // Should be hidden if form also hidden
                return;
            }

            cartEmptyMessageEl.style.display = 'none';
            cartSummarySectionEl.style.display = 'block';
            let subtotal = 0;

            cart.forEach(item => {
                // console.log("renderCart - Rendering item:", item); // DEBUG
                if (!item || typeof item.pricePerItem !== 'number' || typeof item.quantity !== 'number') {
                    console.error("Invalid item structure in cart:", item);
                    return; // Skip this invalid item
                }
                const itemTotalPrice = item.pricePerItem * item.quantity;
                subtotal += itemTotalPrice;
                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.dataset.cartItemId = item.cartItemId;
                cartItemDiv.setAttribute('aria-labelledby', `cart-item-name-${item.cartItemId}`);
                cartItemDiv.innerHTML = `
                    <img src="${item.image || 'images/placeholder-default.jpg'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3 id="cart-item-name-${item.cartItemId}">${item.name}</h3>
                        ${item.customizations ? `<p class="item-customizations">${item.customizations}</p>` : ''}
                        <p class="item-unit-price">@ €${item.pricePerItem.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn" data-action="decrease" aria-label="Decrease quantity of ${item.name}">-</button>
                        <span class="quantity-value" aria-label="Current quantity of ${item.name}">${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-action="increase" aria-label="Increase quantity of ${item.name}">+</button>
                    </div>
                    <div class="cart-item-total">€${itemTotalPrice.toFixed(2)}</div>
                    <button class="cart-item-remove" aria-label="Remove ${item.name} from cart">×</button>
                `;
                cartItemsListEl.appendChild(cartItemDiv);
            });

            if (cartSubtotalEl) cartSubtotalEl.textContent = `€${subtotal.toFixed(2)}`;
            calculateTotal(subtotal);
            addCartItemEventListeners();

            if (proceedToCheckoutBtn && checkoutFormSection && checkoutFormSection.style.display !== 'block') {
                proceedToCheckoutBtn.style.display = 'block';
            }
            if (checkoutFormSection && checkoutFormSection.style.display === 'block' && cart.length === 0) {
                checkoutFormSection.style.display = 'none';
            }
        };

        const calculateTotal = (subtotal) => { /* ... (same as previous) ... */ };
        const updateCartItemQuantity = (cartItemId, newQuantity) => { /* ... (same as previous) ... */ };
        const removeCartItem = (cartItemId) => { /* ... (same as previous) ... */ };
        const addCartItemEventListeners = () => { /* ... (same as previous, ensure no errors) ... */ };

        if (applyPromoBtn && promoCodeInput && promoStatusMessageEl) { /* ... (same as previous) ... */ }
        if (proceedToCheckoutBtn && checkoutFormSection) { /* ... (same as previous) ... */ }
        const toggleDeliveryFields = (isDelivery) => { /* ... (same as previous) ... */ };
        if (orderTypeRadios.length > 0 && deliveryAddressFieldsContainer) { /* ... (same as previous) ... */ }
        function validateCheckoutForm() { /* ... (same as previous) ... */ }
        if (checkoutForm && placeOrderBtn) { /* ... (same as previous, ensure no errors) ... */ }

        renderCart(); // Initial render for cart page
    }

    // --- MY ACCOUNT PAGE SPECIFIC LOGIC ---
    const isMyAccountPage = document.body.classList.contains('my-account-page-body');
    if (isMyAccountPage) { /* ... (same as previous, ensure modal and order history logic is sound) ... */ }

    // --- CONTACT PAGE SPECIFIC LOGIC ---
    const isContactPage = document.body.classList.contains('contact-page-body');
    if (isContactPage) { /* ... (same as previous, ensure form validation works) ... */ }

    // --- ORDER CONFIRMATION PAGE SPECIFIC LOGIC ---
    const isOrderConfirmationPage = document.body.classList.contains('order-confirmation-page-body');
    if (isOrderConfirmationPage) { /* ... (same as previous, ensure details are populated) ... */ }

    // ... (Keep all existing code above this section) ...

    // --- HOMEPAGE SPECIFIC LOGIC (INDEX.HTML) ---
    if (document.querySelector('.hero-section')) {
        const createMenuItemHTML = (item) => `
            <div class="item-image-container"><img src="${item.image}" alt="${item.name}"></div>
            <div class="item-info">
                <h3 class="item-name" id="${item.id}-name">${item.name}</h3>
                <p class="item-description">${item.description.length > 70 ? item.description.substring(0,67) + '...' : item.description}</p>
                <p class="item-price">€${item.price.toFixed(2)} ${item.originalPrice ? `<span class="original-price">€${item.originalPrice.toFixed(2)}</span>` : ''}</p>
            </div>
            <a href="item-detail.html?item=${item.id}" class="btn btn-primary btn-view-item">${item.isDeal ? 'View Deal Details' : 'Customize & Add'}</a>`;

        const populateSection = (sectionId, filterFn) => {
            const container = document.querySelector(`#${sectionId} .menu-grid`);
            if (!container) { /* console.warn(`Container not found for section: ${sectionId}`); */ return; }
            container.innerHTML = ''; let itemCount = 0;
            for (const itemId in menuItemsData) {
                const item = menuItemsData[itemId];
                if (filterFn(item)) {
                    const itemArticle = document.createElement('article');
                    // Ensure card classes are appropriate for the section
                    let cardClasses = 'menu-item-card';
                    if (sectionId === 'featured-items' && item.featured) cardClasses += ' featured-item';
                    if (sectionId === 'deals-section' && item.isDeal) cardClasses += ' deal-card';

                    itemArticle.className = cardClasses;
                    itemArticle.dataset.itemId = item.id;
                    itemArticle.setAttribute('aria-labelledby', `${item.id}-name`);
                    itemArticle.innerHTML = createMenuItemHTML(item);
                    container.appendChild(itemArticle);
                    itemCount++;
                }
            }
            const sectionElement = document.getElementById(sectionId);
            if (itemCount === 0) {
                const placeholderTextEl = sectionElement ? sectionElement.querySelector('.placeholder-section h2 span') : null;
                if (!placeholderTextEl && sectionId !== 'featured-items' && sectionId !== 'deals-section') { // Don't show "no items" for specials/deals if they are truly empty
                    container.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">No items currently in this category.</p>`;
                } else if (!placeholderTextEl && (sectionId === 'featured-items' || sectionId === 'deals-section')) {
                     container.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">No current offers/specials.</p>`;
                }
            } else {
                const placeholderTextEl = sectionElement ? sectionElement.querySelector('.placeholder-section h2 span') : null;
                if(placeholderTextEl) placeholderTextEl.style.display = 'none';
            }
        };

        // Populate sections:
        populateSection('featured-items', item => item.featured);
        populateSection('kebabs', item => item.category === 'Kebabs'); // Show all kebabs
        populateSection('burgers', item => item.category === 'Burgers'); // Show all burgers
        populateSection('wraps', item => item.category === 'Wraps');     // Show all wraps
        populateSection('sides', item => item.category === 'Sides');     // Show all sides
        populateSection('drinks', item => item.category === 'Drinks');   // Show all drinks
        populateSection('deals-section', item => item.isDeal);           // Show all deals
    }

// ... (Keep all existing code below this section for item-detail, cart, account, etc.) ...

});
