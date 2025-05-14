document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL HELPER FUNCTIONS ---
    const getCart = () => JSON.parse(localStorage.getItem('corkGrillCart') || '[]');
    const saveCart = (cart) => { localStorage.setItem('corkGrillCart', JSON.stringify(cart)); updateGlobalCartCount(); };
    const clearCart = () => { localStorage.removeItem('corkGrillCart'); localStorage.removeItem('corkGrillAppliedPromo'); updateGlobalCartCount(); };
    const getOrderHistory = () => JSON.parse(localStorage.getItem('corkGrillOrderHistory') || '[]');
    const saveOrderToHistory = (orderDetails) => { const history = getOrderHistory(); history.unshift(orderDetails); localStorage.setItem('corkGrillOrderHistory', JSON.stringify(history.slice(0, 10))); };
    const updateGlobalCartCount = () => {
        const cart = getCart(); let totalItems = 0;
        cart.forEach(item => { totalItems += item.quantity; });
        const globalCartCountEl = document.getElementById('globalCartCount');
        if (globalCartCountEl) {
            const prevCount = parseInt(globalCartCountEl.dataset.prevCount || '0');
            globalCartCountEl.textContent = totalItems;
            if ((totalItems > prevCount && totalItems > 0) || (totalItems < prevCount && prevCount > 0)) {
                globalCartCountEl.classList.add('updated');
                setTimeout(() => globalCartCountEl.classList.remove('updated'), 300);
            }
            globalCartCountEl.dataset.prevCount = totalItems;
        }
    };
    function showError(inputElement, message) { inputElement.classList.add('error'); const errorSpan = inputElement.nextElementSibling; if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = message; } }
    function clearError(inputElement) { inputElement.classList.remove('error'); const errorSpan = inputElement.nextElementSibling; if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = ''; } }
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    const setButtonLoading = (button, isLoading) => {
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
    if (mobileNavToggle && mainNavMenu) {
        mobileNavToggle.addEventListener('click', () => { const isExpanded = mainNavMenu.classList.toggle('mobile-active'); mobileNavToggle.setAttribute('aria-expanded', isExpanded); });
        mainNavMenu.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { if (mainNavMenu.classList.contains('mobile-active')) { mainNavMenu.classList.remove('mobile-active'); mobileNavToggle.setAttribute('aria-expanded', 'false'); } }); });
    }
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) { window.addEventListener('scroll', () => { if (window.pageYOffset > 300) { scrollToTopBtn.classList.add('visible'); } else { scrollToTopBtn.classList.remove('visible'); } }); scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }); }

    // --- DUMMY MENU ITEMS DATA STORE ---
    const menuItemsData = {
        "kebab-deluxe": { id: "kebab-deluxe", name: "Deluxe Kebab", description: "Our signature kebab with all trimmings, fresh salad, and your choice of sauce.", price: 9.50, image: "images/placeholder-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}, {id:"onion", name:"Onion", price:0, default:false}, {id:"extra_cheese", name:"Extra Cheese", price:1.00, default:false}, {id:"pickles", name:"No Pickles", price:-0.50, default:false, isRemoval: true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"chili", name:"Chili Sauce"}, {id:"house_special", name:"House Special"}], mealOptionPrice: 3.50 },
        "chicken-kebab": { id: "chicken-kebab", name: "Chicken Kebab", description: "Marinated grilled chicken pieces, served with fresh salad and sauce.", price: 9.00, image: "images/placeholder-chicken-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"mayo", name:"Mayonnaise"}], mealOptionPrice: 3.50 },
        "classic-burger": { id: "classic-burger", name: "Classic Burger", description: "A juicy beef patty, fresh lettuce, tomato, and our special sauce.", price: 8.00, image: "images/placeholder-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "cheese-burger": { id: "cheese-burger", name: "Cheese Burger", description: "Classic burger with a slice of mature cheddar.", price: 8.75, image: "images/placeholder-cheese-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "kebab-meal-deal": {id: "kebab-meal-deal", name: "Kebab Meal Deal", description: "Kebab, Fries & Drink.", price: 12.50, image: "images/placeholder-kebab-meal.jpg", category: "Deals", isDeal: true, featured: true},
        "spicy-chicken-burger": {id: "spicy-chicken-burger", name: "Spicy Kickin' Chicken Burger", description: "Crispy chicken fillet with our fiery house sauce, jalapeños, and pepper jack cheese.", price: 9.00, originalPrice: 10.50, image: "images/placeholder-spicy-burger.jpg", category: "Specials", featured: true, mealOptionPrice: 3.00},
        "loaded-fries-special": {id: "loaded-fries-special", name: "Fully Loaded Fries", description: "Our signature fries topped with cheese sauce, crispy bacon bits, and spring onions.", price: 6.50, image: "images/placeholder-loaded-fries.jpg", category: "Specials", featured: true, mealOptionPrice: null},
        "falafel-wrap": {id: "falafel-wrap", name: "Falafel Wrap", description: "Crispy falafel, hummus, tahini, fresh salad, in a warm tortilla.", price: 7.50, image: "images/placeholder-falafel-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "chicken-caesar-wrap": {id: "chicken-caesar-wrap", name: "Chicken Caesar Wrap", description: "Grilled chicken, romaine lettuce, croutons, parmesan, Caesar dressing.", price: 8.50, image: "images/placeholder-caesar-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "regular-fries": {id: "regular-fries", name: "Regular Fries", description: "Classic golden fries, lightly salted.", price: 3.50, image: "images/placeholder-fries.jpg", category: "Sides"},
        "onion-rings": {id: "onion-rings", name: "Onion Rings", description: "Crispy battered onion rings.", price: 4.50, image: "images/placeholder-onion-rings.jpg", category: "Sides"},
        "coca-cola": {id: "coca-cola", name: "Coca-Cola", description: "330ml Can", price: 2.00, image: "images/placeholder-coke.jpg", category: "Drinks"},
        "water-still": {id: "water-still", name: "Still Water", description: "500ml Bottle", price: 1.50, image: "images/placeholder-water.jpg", category: "Drinks"},
        "burger-meal-deal": {id: "burger-meal-deal", name: "Burger Bonanza Deal", description: "Any Classic Burger, regular Fries & a selected Drink. Save big!", price: 11.00, image: "images/placeholder-burger-meal.jpg", category: "Deals", isDeal: true}
    };
    const promoCodes = { "SAVE10": { type: "percentage", value: 10 }, "CORKGRILL2": { type: "fixed", value: 2.00 } };

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
            if (!container) { console.warn(`Container not found for section: ${sectionId}`); return; }
            container.innerHTML = ''; let itemCount = 0;
            for (const itemId in menuItemsData) {
                const item = menuItemsData[itemId];
                if (filterFn(item)) {
                    const itemArticle = document.createElement('article');
                    itemArticle.className = `menu-item-card ${item.featured ? 'featured-item' : ''} ${item.isDeal ? 'deal-card' : ''}`;
                    itemArticle.dataset.itemId = item.id; itemArticle.setAttribute('aria-labelledby', `${item.id}-name`);
                    itemArticle.innerHTML = createMenuItemHTML(item);
                    container.appendChild(itemArticle); itemCount++;
                }
            }
            if (itemCount === 0) {
                const sectionElement = document.getElementById(sectionId);
                const placeholderTextEl = sectionElement.querySelector('.placeholder-section h2 span');
                if (!placeholderTextEl) { // Only add if no "Coming Soon" span
                    container.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">No items currently in this category.</p>`;
                }
            } else {
                const sectionElement = document.getElementById(sectionId);
                const placeholderTextEl = sectionElement.querySelector('.placeholder-section h2 span');
                if(placeholderTextEl) placeholderTextEl.style.display = 'none';
            }
        };
        populateSection('featured-items', item => item.featured);
        populateSection('kebabs', item => item.category === 'Kebabs' && !item.featured && !item.isDeal);
        populateSection('burgers', item => item.category === 'Burgers' && !item.featured && !item.isDeal);
        populateSection('wraps', item => item.category === 'Wraps' && !item.featured && !item.isDeal);
        populateSection('sides', item => item.category === 'Sides' && !item.featured && !item.isDeal);
        populateSection('drinks', item => item.category === 'Drinks' && !item.featured && !item.isDeal);
        populateSection('deals-section', item => item.isDeal);
    }

    // --- ITEM DETAIL PAGE SPECIFIC LOGIC ---
    const isItemDetailPage = document.body.classList.contains('item-customization-page');
    if (isItemDetailPage) { /* ... (same as previous, no changes here for this step) ... */ }

    // --- CART PAGE SPECIFIC LOGIC ---
    const isCartPage = document.body.classList.contains('cart-page');
    if (isCartPage) { /* ... (same as previous, including form persistence and validation) ... */
        const checkoutForm = document.getElementById('checkoutForm');
        // Add input listeners to clear errors on Cart Page checkout form
        if (checkoutForm) {
            checkoutForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
                input.addEventListener('input', () => clearError(input));
            });
        }
        // ... (rest of existing cart page logic remains the same)
    }


    // --- MY ACCOUNT PAGE SPECIFIC LOGIC ---
    const isMyAccountPage = document.body.classList.contains('my-account-page-body');
    if (isMyAccountPage) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const formSwitchLinks = document.querySelectorAll('.form-switch-link');
        const orderHistoryListEl = document.getElementById('orderHistoryList');
        const emptyHistoryMessageEl = document.getElementById('emptyHistoryMessage');
        const orderDetailsModalOverlay = document.getElementById('orderDetailsModalOverlay');
        const orderDetailsModalContent = document.getElementById('orderDetailsModalContent'); // The actual content div
        const orderDetailsModalCloseBtn = document.getElementById('orderDetailsModalCloseBtn');

        // Add input listeners to clear errors on My Account forms
        if(loginForm) loginForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => clearError(input)));
        if(registerForm) registerForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => clearError(input)));

        formSwitchLinks.forEach(link => { /* ... (same as previous) ... */ });
        if (loginForm) { /* ... (same as previous, including setButtonLoading) ... */ }
        if (registerForm) { /* ... (same as previous, including setButtonLoading) ... */ }

        function displayOrderDetails(orderId) {
            const history = getOrderHistory();
            const order = history.find(o => o.orderId === orderId);
            if (order && orderDetailsModalOverlay && orderDetailsModalContent) {
                let itemsHtml = '<ul>';
                order.items.forEach(item => {
                    itemsHtml += `<li>
                        <strong>${item.name}</strong> (x${item.quantity}) - €${(item.pricePerItem * item.quantity).toFixed(2)}
                        ${item.customizations ? `<br><small style="color:#555; padding-left: 10px;"><em>${item.customizations}</em></small>` : ''}
                    </li>`;
                });
                itemsHtml += '</ul>';

                // Ensure the H3 for title is inside modal content if not already
                orderDetailsModalContent.innerHTML = `
                    <button id="orderDetailsModalCloseBtnInner" class="order-details-modal-close-btn" aria-label="Close order details">×</button>
                    <h3 id="orderDetailsModalTitle">Order Details: ${order.orderId}</h3>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Name:</strong> ${order.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${order.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${order.phone || 'N/A'}</p>
                    <p><strong>Order Type:</strong> ${order.orderType || 'N/A'}</p>
                    ${order.orderType === 'delivery' && order.address1 ? `<p><strong>Delivery Address:</strong> ${order.address1}${order.eircode ? ', ' + order.eircode : ''}${order.address2 ? '<br>' + order.address2 : ''}</p>` : ''}
                    ${order.instructions ? `<p><strong>Instructions:</strong> ${order.instructions}</p>` : ''}
                    <h4>Items Ordered:</h4>
                    ${itemsHtml}
                    <hr style="margin: 15px 0;">
                    <p style="text-align:right; font-size: 1.2em;"><strong>Total Paid: €${order.total.toFixed(2)}</strong></p>
                `;
                orderDetailsModalOverlay.classList.add('active');
                orderDetailsModalOverlay.setAttribute('aria-hidden', 'false');

                // Add event listener to the new close button inside the modal
                const closeBtnInner = orderDetailsModalContent.querySelector('#orderDetailsModalCloseBtnInner');
                if(closeBtnInner) {
                    closeBtnInner.addEventListener('click', () => {
                        orderDetailsModalOverlay.classList.remove('active');
                        orderDetailsModalOverlay.setAttribute('aria-hidden', 'true');
                    });
                }
                if(orderDetailsModalCloseBtn) orderDetailsModalCloseBtn.focus(); // Focus the close button for accessibility
            }
        }

        function loadOrderHistory() { /* ... (same as previous, ensure displayOrderDetails is called) ... */
            const history = getOrderHistory();
            orderHistoryListEl.innerHTML = '';
            if (history.length === 0) { if(emptyHistoryMessageEl) emptyHistoryMessageEl.style.display = 'block'; }
            else {
                if(emptyHistoryMessageEl) emptyHistoryMessageEl.style.display = 'none';
                history.forEach(order => {
                    const itemDiv = document.createElement('article'); itemDiv.className = 'order-history-item';
                    let itemsSummaryHtml = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
                    if (itemsSummaryHtml.length > 70) itemsSummaryHtml = itemsSummaryHtml.substring(0, 67) + '...';
                    itemDiv.innerHTML = `
                        <h4>Order ID: ${order.orderId} <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></h4>
                        <p>Date: ${order.date}</p>
                        <p>Items: <small>${itemsSummaryHtml || 'Details unavailable'}</small></p>
                        <p>Total: €${order.total.toFixed(2)}</p>
                        <button class="btn btn-secondary btn-sm view-order-details-btn" data-order-id="${order.orderId}" aria-label="View details for order ${order.orderId}">View Details</button>
                    `; // Changed to button for better semantics
                    orderHistoryListEl.appendChild(itemDiv);
                });
                orderHistoryListEl.querySelectorAll('.view-order-details-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayOrderDetails(e.target.dataset.orderId);
                    });
                });
            }
        }

        if(orderDetailsModalOverlay && orderDetailsModalCloseBtn){ // Close modal on overlay click AND original close button
            orderDetailsModalOverlay.addEventListener('click', function(event) {
                if (event.target === orderDetailsModalOverlay) {
                    this.classList.remove('active');
                    this.setAttribute('aria-hidden', 'true');
                }
            });
            orderDetailsModalCloseBtn.addEventListener('click', () => { // This is the static button in HTML
                 orderDetailsModalOverlay.classList.remove('active');
                 orderDetailsModalOverlay.setAttribute('aria-hidden', 'true');
            });
        }
        loadOrderHistory();
    }

    // --- CONTACT PAGE SPECIFIC LOGIC ---
    const isContactPage = document.body.classList.contains('contact-page-body');
    if (isContactPage) { /* ... (same as previous, add loading state to button, add input listeners) ... */
        const contactForm = document.getElementById('contactForm');
        const formStatusMessageEl = document.getElementById('contactFormStatus');
        if(contactForm && formStatusMessageEl){
            contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
                input.addEventListener('input', () => clearError(input));
            });
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault(); let isValid = true;
                const nameInput = document.getElementById('contactName');
                const emailInput = document.getElementById('contactEmail');
                const messageInput = document.getElementById('contactMessage');
                const submitButton = contactForm.querySelector('button[type="submit"]');
                [nameInput, emailInput, messageInput].forEach(input => clearError(input));
                if (!nameInput.value.trim()) { showError(nameInput, 'Name is required.'); isValid = false; }
                if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
                else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
                if (!messageInput.value.trim()) { showError(messageInput, 'Message is required.'); isValid = false; }

                setButtonLoading(submitButton, true);
                setTimeout(() => {
                    if (isValid) {
                        formStatusMessageEl.textContent = 'Thank you! Your message has been received (Demo).';
                        formStatusMessageEl.className = 'form-status-message success'; contactForm.reset();
                    } else { formStatusMessageEl.textContent = 'Please correct the errors above.'; formStatusMessageEl.className = 'form-status-message error'; }
                    setButtonLoading(submitButton, false);
                    setTimeout(() => {formStatusMessageEl.textContent = ''; formStatusMessageEl.className = 'form-status-message';}, 5000);
                }, 750);
            });
        }
    }

    // --- ORDER CONFIRMATION PAGE SPECIFIC LOGIC ---
    const isOrderConfirmationPage = document.body.classList.contains('order-confirmation-page-body');
    if (isOrderConfirmationPage) { /* ... (same as previous) ... */ }
});