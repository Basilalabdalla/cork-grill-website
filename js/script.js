document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL HELPER FUNCTIONS ---
    const getCart = () => JSON.parse(localStorage.getItem('corkGrillCart') || '[]');
    const saveCart = (cart) => { localStorage.setItem('corkGrillCart', JSON.stringify(cart)); updateGlobalCartCount(); };
    const clearCart = () => { localStorage.removeItem('corkGrillCart'); localStorage.removeItem('corkGrillAppliedPromo'); updateGlobalCartCount(); };
    const getOrderHistory = () => JSON.parse(localStorage.getItem('corkGrillOrderHistory') || '[]');
    const saveOrderToHistory = (orderDetails) => { const history = getOrderHistory(); history.unshift(orderDetails); localStorage.setItem('corkGrillOrderHistory', JSON.stringify(history.slice(0, 10))); };
    const updateGlobalCartCount = () => { /* ... (same as previous) ... */
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

    // --- INITIALIZE GLOBAL ELEMENTS ---
    updateGlobalCartCount();
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNavMenu = document.getElementById('mainNavMenu');
    if (mobileNavToggle && mainNavMenu) { /* ... (same as previous) ... */
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mainNavMenu.classList.toggle('mobile-active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
        });
        mainNavMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavMenu.classList.contains('mobile-active')) {
                    mainNavMenu.classList.remove('mobile-active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) { /* ... (same as previous) ... */
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { scrollToTopBtn.classList.add('visible'); }
            else { scrollToTopBtn.classList.remove('visible'); }
        });
        scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // --- DUMMY MENU ITEMS DATA STORE & PROMO CODES ---
    const menuItemsData = { /* ... (same as previous, ensure paths are images/placeholder-name.jpg) ... */
        "kebab-deluxe": { id: "kebab-deluxe", name: "Deluxe Kebab", description: "Our signature kebab...", price: 9.50, image: "images/placeholder-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}, {id:"onion", name:"Onion", price:0, default:false}, {id:"extra_cheese", name:"Extra Cheese", price:1.00, default:false}, {id:"pickles", name:"No Pickles", price:-0.50, default:false, isRemoval: true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"chili", name:"Chili Sauce"}, {id:"house_special", name:"House Special"}], mealOptionPrice: 3.50 },
        "chicken-kebab": { id: "chicken-kebab", name: "Chicken Kebab", description: "Marinated grilled chicken...", price: 9.00, image: "images/placeholder-chicken-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"mayo", name:"Mayonnaise"}], mealOptionPrice: 3.50 },
        "classic-burger": { id: "classic-burger", name: "Classic Burger", description: "A juicy beef patty...", price: 8.00, image: "images/placeholder-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "cheese-burger": { id: "cheese-burger", name: "Cheese Burger", description: "Classic burger with cheddar.", price: 8.75, image: "images/placeholder-cheese-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "kebab-meal-deal": {id: "kebab-meal-deal", name: "Kebab Meal Deal", description: "Kebab, Fries & Drink.", price: 12.50, image: "images/placeholder-kebab-meal.jpg", category: "Deals", isDeal: true, featured: true},
        "spicy-chicken-burger": {id: "spicy-chicken-burger", name: "Spicy Kickin' Chicken Burger", description: "Crispy chicken fillet...", price: 9.00, originalPrice: 10.50, image: "images/placeholder-spicy-burger.jpg", category: "Specials", featured: true, mealOptionPrice: 3.00},
        "loaded-fries-special": {id: "loaded-fries-special", name: "Fully Loaded Fries", description: "Signature fries topped...", price: 6.50, image: "images/placeholder-loaded-fries.jpg", category: "Specials", featured: true, mealOptionPrice: null},
        "falafel-wrap": {id: "falafel-wrap", name: "Falafel Wrap", description: "Crispy falafel, hummus, tahini, fresh salad, in a warm tortilla.", price: 7.50, image: "images/placeholder-falafel-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "chicken-caesar-wrap": {id: "chicken-caesar-wrap", name: "Chicken Caesar Wrap", description: "Grilled chicken, romaine lettuce, croutons, parmesan, Caesar dressing.", price: 8.50, image: "images/placeholder-caesar-wrap.jpg", category: "Wraps", mealOptionPrice: 3.00},
        "regular-fries": {id: "regular-fries", name: "Regular Fries", description: "Classic golden fries, lightly salted.", price: 3.50, image: "images/placeholder-fries.jpg", category: "Sides"},
        "onion-rings": {id: "onion-rings", name: "Onion Rings", description: "Crispy battered onion rings.", price: 4.50, image: "images/placeholder-onion-rings.jpg", category: "Sides"},
        "coca-cola": {id: "coca-cola", name: "Coca-Cola", description: "330ml Can", price: 2.00, image: "images/placeholder-coke.jpg", category: "Drinks"},
        "water-still": {id: "water-still", name: "Still Water", description: "500ml Bottle", price: 1.50, image: "images/placeholder-water.jpg", category: "Drinks"},
        "burger-meal-deal": {id: "burger-meal-deal", name: "Burger Bonanza Deal", description: "Any Classic Burger, regular Fries & a selected Drink. Save big!", price: 11.00, image: "images/placeholder-burger-meal.jpg", category: "Deals", isDeal: true}
    };
    const promoCodes = { "SAVE10": { type: "percentage", value: 10 }, "CORKGRILL2": { type: "fixed", value: 2.00 } };

    // Button loading state helper
    const setButtonLoading = (button, isLoading) => {
        if (!button) return;
        const textSpan = button.querySelector('.btn-text');
        const spinnerSpan = button.querySelector('.loading-spinner');
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            if (textSpan) textSpan.style.display = 'none';
            if (spinnerSpan) spinnerSpan.style.display = 'inline-block';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            if (textSpan) textSpan.style.display = 'inline';
            if (spinnerSpan) spinnerSpan.style.display = 'none';
        }
    };

    // --- HOMEPAGE SPECIFIC LOGIC (INDEX.HTML) ---
    if (document.querySelector('.hero-section')) { /* ... (same as previous) ... */
        const createMenuItemHTML = (item) => `
            <div class="item-image-container"><img src="${item.image}" alt="${item.name}"></div>
            <div class="item-info">
                <h3 class="item-name" id="${item.id}-name">${item.name}</h3>
                <p class="item-description">${item.description.length > 70 ? item.description.substring(0,67) + '...' : item.description}</p>
                <p class="item-price">€${item.price.toFixed(2)} ${item.originalPrice ? `<span class="original-price">€${item.originalPrice.toFixed(2)}</span>` : ''}</p>
            </div>
            <a href="item-detail.html?item=${item.id}" class="btn btn-primary btn-view-item">${item.isDeal ? 'View Deal Details' : 'Customize & Add'}</a>`;
        const populateSection = (sectionId, categoryName, isFeatured = false, isDeal = false) => {
            const container = document.querySelector(`#${sectionId} .menu-grid`);
            if (!container) return;
            container.innerHTML = ''; let itemCount = 0;
            for (const itemId in menuItemsData) {
                const item = menuItemsData[itemId];
                let matchesCriteria = isFeatured ? item.featured : (isDeal ? item.isDeal : item.category === categoryName);
                if (matchesCriteria) {
                    const itemArticle = document.createElement('article');
                    itemArticle.className = `menu-item-card ${isFeatured ? 'featured-item' : ''} ${isDeal ? 'deal-card' : ''}`;
                    itemArticle.dataset.itemId = item.id; itemArticle.setAttribute('aria-labelledby', `${item.id}-name`);
                    itemArticle.innerHTML = createMenuItemHTML(item);
                    container.appendChild(itemArticle); itemCount++;
                }
            }
            if (itemCount === 0) { const placeholderSection = container.closest('.placeholder-section'); if (!placeholderSection) { container.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">No items currently in this category.</p>`; }
            } else { const placeholderSection = container.closest('.placeholder-section'); if(placeholderSection && placeholderSection.querySelector('h2 span')) { placeholderSection.querySelector('h2 span').style.display = 'none'; } }
        };
        populateSection('featured-items', null, true, false); populateSection('kebabs', 'Kebabs'); populateSection('burgers', 'Burgers');
        populateSection('wraps', 'Wraps'); populateSection('sides', 'Sides'); populateSection('drinks', 'Drinks'); populateSection('deals-section', null, false, true);
    }

    // --- ITEM DETAIL PAGE SPECIFIC LOGIC ---
    const isItemDetailPage = document.body.classList.contains('item-customization-page');
    if (isItemDetailPage) { /* ... (same as previous, ensure image paths in dummy data are correct) ... */
        const form = document.getElementById('customizationForm');
        const finalPriceEl = document.getElementById('finalItemPrice');
        const quantityInput = form.querySelector('.quantity-value');
        const addToCartBtn = form.querySelector('.btn-add-to-cart-submit');
        const toastMessageEl = document.getElementById('addToCartMessage');
        let basePrice = 0; let currentItemConfig = {};
        const updatePrice = () => {
            if (!currentItemConfig.price) return 0;
            let currentTotal = currentItemConfig.price;
            const checkboxes = form.querySelectorAll('input[type="checkbox"][data-price-change]');
            checkboxes.forEach(cb => { if (cb.checked) { currentTotal += parseFloat(cb.dataset.priceChange); } });
            const quantity = parseInt(quantityInput.value) || 1;
            currentTotal *= quantity;
            if (finalPriceEl && finalPriceEl.textContent !== `€${currentTotal.toFixed(2)}`) {
                finalPriceEl.textContent = `€${currentTotal.toFixed(2)}`;
                finalPriceEl.classList.add('price-updated');
                setTimeout(() => { finalPriceEl.classList.remove('price-updated'); }, 400);
            }
            return currentTotal;
        };
        if (form) {
            form.addEventListener('change', updatePrice);
            form.addEventListener('input', (event) => {
                if (event.target === quantityInput) {
                    if (parseInt(quantityInput.value) < 1 || isNaN(parseInt(quantityInput.value))) { quantityInput.value = 1; }
                    updatePrice();
                }
            });
            form.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    let currentVal = parseInt(quantityInput.value);
                    if (btn.dataset.action === 'increase') { quantityInput.value = currentVal + 1; }
                    else if (btn.dataset.action === 'decrease' && currentVal > 1) { quantityInput.value = currentVal - 1; }
                    updatePrice();
                });
            });
             addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!currentItemConfig.id) return;
                const quantity = parseInt(quantityInput.value);
                const finalPricePerItem = updatePrice() / quantity;
                let selectedCustomizationsText = [];
                form.querySelectorAll('.option-group input:checked').forEach(input => {
                    const labelSpan = input.closest('.choice-label').querySelector('span');
                    if (labelSpan) {
                        const priceChange = parseFloat(input.dataset.priceChange);
                        if(input.type === 'checkbox' && priceChange && priceChange !== 0 && !input.id.toLowerCase().includes('meal')){
                            const baseText = labelSpan.textContent.match(/^(.*?)\s*\(/);
                            selectedCustomizationsText.push(baseText ? baseText[1].trim() : labelSpan.textContent.trim());
                        } else if (input.type === 'radio' || (input.type === 'checkbox' && (input.id === 'makeItMeal' || priceChange === 0) ) ) {
                             selectedCustomizationsText.push(labelSpan.textContent.trim());
                        }
                    }
                });
                const cartItem = { cartItemId: `${currentItemConfig.id}-${Date.now()}`, id: currentItemConfig.id, name: currentItemConfig.name, image: currentItemConfig.image, quantity: quantity, pricePerItem: finalPricePerItem, customizations: selectedCustomizationsText.join(', ') };
                let cart = getCart(); cart.push(cartItem); saveCart(cart);
                toastMessageEl.textContent = `${quantity} x ${currentItemConfig.name} added!`;
                toastMessageEl.style.display = 'block';
                setTimeout(() => { toastMessageEl.classList.add('visible'); }, 10);
                setTimeout(() => { toastMessageEl.classList.remove('visible'); setTimeout(() => { toastMessageEl.style.display = 'none'; }, 400); }, 2500);
            });
        }
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('item');
        if (itemId && menuItemsData[itemId]) {
            currentItemConfig = menuItemsData[itemId];
            document.title = `${currentItemConfig.name} - Customize - Cork Grill`;
            document.getElementById('itemDetailName').textContent = currentItemConfig.name;
            document.getElementById('itemDetailDescription').textContent = currentItemConfig.description;
            document.getElementById('breadcrumbItemName').textContent = currentItemConfig.name;
            document.getElementById('breadcrumbCategory').textContent = currentItemConfig.category;
            document.getElementById('breadcrumbCategory').href = `index.html#${currentItemConfig.category.toLowerCase().replace(/\s+/g, '-')}`;
            document.getElementById('itemDetailImage').src = currentItemConfig.image;
            document.getElementById('itemDetailImage').alt = currentItemConfig.name;
            document.getElementById('itemBasePrice').textContent = `€${currentItemConfig.price.toFixed(2)}`;
            basePrice = currentItemConfig.price;
            const ingredientsContainer = form.querySelector('.customization-section[aria-labelledby="ingredients-heading"] .option-group');
            if (ingredientsContainer && currentItemConfig.customizableIngredients) {
                ingredientsContainer.innerHTML = '';
                currentItemConfig.customizableIngredients.forEach(ing => {
                    const ingId = `ing-${ing.id}`;
                    const label = document.createElement('label'); label.className = 'choice-label'; label.htmlFor = ingId;
                    label.innerHTML = `<input type="checkbox" id="${ingId}" name="${ing.id}" data-price-change="${ing.price}" ${ing.default ? 'checked' : ''}> <span>${ing.name} ${ing.price !== 0 ? `(${ing.price > 0 ? '+' : ''}€${ing.price.toFixed(2)})` : ''}</span>`;
                    ingredientsContainer.appendChild(label);
                });
            }
            const saucesContainer = form.querySelector('.customization-section[aria-labelledby="sauce-heading"] .option-group');
            if (saucesContainer && currentItemConfig.sauces) {
                 saucesContainer.innerHTML = '';
                 currentItemConfig.sauces.forEach((sauce, index) => {
                    const sauceId = `sauce-${sauce.id}`;
                    const label = document.createElement('label'); label.className = 'choice-label'; label.htmlFor = sauceId;
                    label.innerHTML = `<input type="radio" id="${sauceId}" name="sauce" value="${sauce.id}" ${sauce.default || index === 0 ? 'checked' : ''}> <span>${sauce.name}</span>`;
                    saucesContainer.appendChild(label);
                 });
            }
            const mealOptionCheckbox = document.getElementById('makeItMeal');
            if (mealOptionCheckbox) {
                const mealOptionSection = mealOptionCheckbox.closest('.meal-option');
                if (currentItemConfig.mealOptionPrice) {
                    const mealOptionLabelSpan = mealOptionCheckbox.closest('.make-meal-label').querySelector('span');
                    mealOptionCheckbox.dataset.priceChange = currentItemConfig.mealOptionPrice;
                    if(mealOptionLabelSpan) mealOptionLabelSpan.textContent = `Make it a Meal? (Fries & Drink +€${currentItemConfig.mealOptionPrice.toFixed(2)})`;
                    mealOptionSection.style.display = 'block';
                } else { mealOptionSection.style.display = 'none'; }
            }
            if (form) updatePrice();
        } else if (itemId) {
            document.querySelector('.item-customization-page-content').innerHTML = '<h1>Oops! Item not found.</h1><p><a href="index.html" class="btn btn-primary">Back to Menu</a></p>';
        }
    }

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

        // Function to save checkout form data
        const saveCheckoutForm = () => {
            if (!checkoutForm) return;
            const formData = new FormData(checkoutForm);
            const data = {};
            formData.forEach((value, key) => data[key] = value);
            localStorage.setItem('corkGrillCheckoutForm', JSON.stringify(data));
        };

        // Function to load checkout form data
        const loadCheckoutForm = () => {
            if (!checkoutForm) return;
            const savedData = localStorage.getItem('corkGrillCheckoutForm');
            if (savedData) {
                const data = JSON.parse(savedData);
                for (const key in data) {
                    const input = checkoutForm.elements[key];
                    if (input) {
                        if (input.type === 'radio') {
                            if (input.value === data[key]) {
                                input.checked = true;
                                // Trigger change for orderType to show/hide delivery fields
                                if (input.name === 'orderType') {
                                    toggleDeliveryFields(data[key] === 'delivery');
                                }
                            }
                        } else {
                            input.value = data[key];
                        }
                    }
                }
            }
        };

        // Event listener for checkout form inputs to save on change
        if (checkoutForm) {
            checkoutForm.addEventListener('input', saveCheckoutForm);
            loadCheckoutForm(); // Load saved data when cart page loads
        }


        const renderCart = () => { /* ... (same as previous) ... */
            const cart = getCart();
            cartItemsListEl.innerHTML = '';
            if (cart.length === 0) {
                cartEmptyMessageEl.style.display = 'block';
                cartSummarySectionEl.style.display = 'none';
                checkoutFormSection.style.display = 'none';
                if(proceedToCheckoutBtn) proceedToCheckoutBtn.style.display = 'block';
                return;
            }
            cartEmptyMessageEl.style.display = 'none';
            cartSummarySectionEl.style.display = 'block';
            let subtotal = 0;
            cart.forEach(item => {
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
                    <button class="cart-item-remove" aria-label="Remove ${item.name} from cart">&times;</button>
                `;
                cartItemsListEl.appendChild(cartItemDiv);
            });
            cartSubtotalEl.textContent = `€${subtotal.toFixed(2)}`;
            calculateTotal(subtotal);
            addCartItemEventListeners();
            if (proceedToCheckoutBtn && checkoutFormSection.style.display !== 'block') proceedToCheckoutBtn.style.display = 'block';
             if (checkoutFormSection.style.display === 'block' && cart.length === 0) {
                checkoutFormSection.style.display = 'none';
            }
        };
        const calculateTotal = (subtotal) => { /* ... (same as previous) ... */
             let total = subtotal;
            currentDiscountValue = 0;
            if (appliedPromoCode && promoCodes[appliedPromoCode]) {
                const promo = promoCodes[appliedPromoCode];
                if (promo.type === "percentage") { currentDiscountValue = (subtotal * promo.value) / 100; }
                else if (promo.type === "fixed") { currentDiscountValue = promo.value; }
                currentDiscountValue = Math.min(currentDiscountValue, subtotal);
                total -= currentDiscountValue;
            }
            if (currentDiscountValue > 0) {
                cartDiscountEl.textContent = `-€${currentDiscountValue.toFixed(2)}`;
                if(appliedPromoCodeTextEl) appliedPromoCodeTextEl.textContent = appliedPromoCode;
                discountRowEl.style.display = 'flex';
            } else { discountRowEl.style.display = 'none'; }
            cartTotalEl.textContent = `€${Math.max(0, total).toFixed(2)}`;
        };
        const updateCartItemQuantity = (cartItemId, newQuantity) => { /* ... (same as previous) ... */
            let cart = getCart();
            const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
            if (itemIndex > -1) {
                if (newQuantity < 1) { cart.splice(itemIndex, 1); }
                else { cart[itemIndex].quantity = newQuantity; }
                saveCart(cart); renderCart();
            }
        };
        const removeCartItem = (cartItemId) => { /* ... (same as previous) ... */
            let cart = getCart(); cart = cart.filter(item => item.cartItemId !== cartItemId);
            saveCart(cart); renderCart();
        };
        const addCartItemEventListeners = () => { /* ... (same as previous) ... */
            cartItemsListEl.querySelectorAll('.quantity-btn').forEach(btn => {
                const newBtn = btn.cloneNode(true); btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', (e) => {
                    const cartItemDiv = e.target.closest('.cart-item');
                    const cartItemId = cartItemDiv.dataset.cartItemId;
                    let currentQuantity = parseInt(cartItemDiv.querySelector('.quantity-value').textContent);
                    updateCartItemQuantity(cartItemId, e.target.dataset.action === 'increase' ? currentQuantity + 1 : currentQuantity - 1);
                });
            });
            cartItemsListEl.querySelectorAll('.cart-item-remove').forEach(btn => {
                const newBtn = btn.cloneNode(true); btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', (e) => removeCartItem(e.target.closest('.cart-item').dataset.cartItemId));
            });
        };

        if (applyPromoBtn && promoCodeInput && promoStatusMessageEl) { /* ... (same as previous with loading state) ... */
            if(appliedPromoCode && promoCodes[appliedPromoCode]){
                promoCodeInput.value = appliedPromoCode;
                 promoStatusMessageEl.textContent = `Promo "${appliedPromoCode}" applied!`;
                 promoStatusMessageEl.classList.add('success');
            }
            applyPromoBtn.addEventListener('click', () => {
                setButtonLoading(applyPromoBtn, true);
                setTimeout(() => { // Simulate API call
                    const code = promoCodeInput.value.trim().toUpperCase();
                    promoStatusMessageEl.textContent = ''; promoStatusMessageEl.className = 'promo-status-message';
                    if (promoCodes[code]) {
                        appliedPromoCode = code;
                        localStorage.setItem('corkGrillAppliedPromo', code);
                        promoStatusMessageEl.textContent = `Promo "${code}" applied!`;
                        promoStatusMessageEl.classList.add('success');
                    } else if (code === '') {
                        appliedPromoCode = null;
                        localStorage.removeItem('corkGrillAppliedPromo');
                        promoStatusMessageEl.textContent = 'Promo code cleared.';
                    } else {
                        appliedPromoCode = null;
                        localStorage.removeItem('corkGrillAppliedPromo');
                        promoStatusMessageEl.textContent = 'Invalid promo code.';
                        promoStatusMessageEl.classList.add('error');
                    }
                    const currentSubtotal = parseFloat(cartSubtotalEl.textContent.replace('€',''));
                    calculateTotal(currentSubtotal);
                    setButtonLoading(applyPromoBtn, false);
                    setTimeout(() => { promoStatusMessageEl.textContent = ''; promoStatusMessageEl.className = 'promo-status-message';}, 3000);
                }, 500); // 0.5 second delay
            });
        }

        if (proceedToCheckoutBtn && checkoutFormSection) { /* ... (same as previous) ... */ }

        const toggleDeliveryFields = (isDelivery) => {
            if (isDelivery) {
                deliveryAddressFieldsContainer.style.display = 'block';
                deliveryAddressInputs.forEach(input => input.required = true);
            } else {
                deliveryAddressFieldsContainer.style.display = 'none';
                deliveryAddressInputs.forEach(input => { input.required = false; clearError(input); });
            }
        };

        if (orderTypeRadios.length > 0 && deliveryAddressFieldsContainer) {
            orderTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    toggleDeliveryFields(radio.value === 'delivery' && radio.checked);
                    saveCheckoutForm(); // Save state when order type changes
                });
            });
            const initialOrderType = document.querySelector('input[name="orderType"]:checked');
            if (initialOrderType) { // This will be called by loadCheckoutForm if data exists
                 // toggleDeliveryFields(initialOrderType.value === 'delivery');
            }
        }

        function validateCheckoutForm() { /* ... (same as previous, but add input event listeners to clear errors) ... */
            let isValid = true;
            const inputsToValidate = checkoutForm.querySelectorAll('input[required]:not([type="radio"]), textarea[required]');
            inputsToValidate.forEach(input => {
                // Add event listener to clear error on input
                input.addEventListener('input', () => clearError(input), { once: true }); // Clear once then remove listener for this instance

                if (input.offsetWidth > 0 || input.offsetHeight > 0 || input.getClientRects().length > 0) {
                    // clearError(input); // Already cleared by input event or above
                    if (!input.value.trim()) {
                        showError(input, `${input.labels[0] ? input.labels[0].textContent.replace(':', '') : 'This field'} is required.`);
                        isValid = false;
                    } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                        showError(input, 'Please enter a valid email address.');
                        isValid = false;
                    } else if (input.type === 'tel' && input.pattern && !new RegExp(input.pattern).test(input.value.trim())) {
                        showError(input, 'Please enter a valid phone number (e.g., 08X XXX XXXX).');
                        isValid = false;
                    } else {
                        clearError(input); // Clear error if valid now
                    }
                } else { clearError(input); }
            });
            return isValid;
        }


        if (checkoutForm && placeOrderBtn) {
            checkoutForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Always prevent default at first
                setButtonLoading(placeOrderBtn, true);

                // Slight delay to show loading spinner
                setTimeout(() => {
                    if (!validateCheckoutForm()) {
                        const firstErrorField = checkoutForm.querySelector('input.error, textarea.error');
                        if(firstErrorField) { firstErrorField.focus(); firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });}
                        setButtonLoading(placeOrderBtn, false);
                        return; // Stop if validation fails
                    }

                    // If validation passes
                    const formData = new FormData(checkoutForm);
                    const orderDetailsFromForm = Object.fromEntries(formData.entries());
                    const orderId = `CG${Date.now()}`;
                    const cartForHistory = getCart();
                    const totalAmountForHistory = parseFloat(document.getElementById('cartTotal').textContent.replace('€',''));
                    const fullOrderDetailsForHistory = { orderId: orderId, date: new Date().toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' }), total: totalAmountForHistory, status: 'Pending', name: orderDetailsFromForm.checkoutName, email: orderDetailsFromForm.checkoutEmail, phone: orderDetailsFromForm.checkoutPhone, orderType: orderDetailsFromForm.orderType, address1: orderDetailsFromForm.checkoutAddress1 || '', address2: orderDetailsFromForm.checkoutAddress2 || '', eircode: orderDetailsFromForm.checkoutEircode || '', instructions: orderDetailsFromForm.deliveryInstructions || '', items: cartForHistory.map(item => ({ name: item.name, quantity: item.quantity, pricePerItem: item.pricePerItem, customizations: item.customizations })) };
                    saveOrderToHistory(fullOrderDetailsForHistory);
                    localStorage.setItem('lastOrderDetails', JSON.stringify({ orderId: orderId, name: orderDetailsFromForm.checkoutName, email: orderDetailsFromForm.checkoutEmail, orderType: orderDetailsFromForm.orderType, address1: orderDetailsFromForm.checkoutAddress1 || '', eircode: orderDetailsFromForm.checkoutEircode || '' }));
                    clearCart();
                    localStorage.removeItem('corkGrillCheckoutForm'); // Clear saved form data after successful order

                    // Now redirect
                    window.location.href = `order-confirmation.html`; // GET params will be lost, using localStorage instead
                }, 750); // Simulate processing time
            });
        }
        renderCart();
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
        const orderDetailsModalContent = document.getElementById('orderDetailsModalContent');
        const orderDetailsModalCloseBtn = document.getElementById('orderDetailsModalCloseBtn');

        // Add input event listeners to clear errors on My Account forms
        if(loginForm) loginForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => clearError(input)));
        if(registerForm) registerForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => clearError(input)));


        formSwitchLinks.forEach(link => { /* ... (same as previous) ... */
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFormId = link.getAttribute('href').substring(1);
                const loginStatus = document.getElementById('loginStatusMessage');
                const registerStatus = document.getElementById('registerStatusMessage');
                if (targetFormId === 'registerForm') { loginForm.style.display = 'none'; registerForm.style.display = 'block'; }
                else { loginForm.style.display = 'block'; registerForm.style.display = 'none'; }
                if (loginStatus) loginStatus.textContent = '';
                if (registerStatus) registerStatus.textContent = '';
            });
        });

        if (loginForm) { /* ... (same validation as previous, add loading state to button if desired) ... */
             loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                const statusMessageEl = document.getElementById('loginStatusMessage');
                const loginButton = loginForm.querySelector('button[type="submit"]');
                let isValid = true;
                [emailInput, passwordInput].forEach(input => clearError(input));
                if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
                else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
                if (!passwordInput.value.trim()) { showError(passwordInput, 'Password is required.'); isValid = false; }

                setButtonLoading(loginButton, true);
                setTimeout(() => { // Simulate login
                    if (isValid) {
                        statusMessageEl.textContent = 'Login successful! (Demo)'; statusMessageEl.className = 'form-status-message success';
                        loadOrderHistory();
                    } else { statusMessageEl.textContent = 'Please correct errors.'; statusMessageEl.className = 'form-status-message error'; }
                    setButtonLoading(loginButton, false);
                    setTimeout(() => {statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message';}, 4000);
                }, 750);
            });
        }

        if (registerForm) { /* ... (same validation as previous, add loading state to button if desired) ... */
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('registerName');
                const emailInput = document.getElementById('registerEmail');
                const passwordInput = document.getElementById('registerPassword');
                const confirmPasswordInput = document.getElementById('registerConfirmPassword');
                const statusMessageEl = document.getElementById('registerStatusMessage');
                const registerButton = registerForm.querySelector('button[type="submit"]');
                let isValid = true;
                [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => clearError(input));
                if (!nameInput.value.trim()) { showError(nameInput, 'Name is required.'); isValid = false; }
                if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
                else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
                if (!passwordInput.value.trim()) { showError(passwordInput, 'Password is required.'); isValid = false; }
                else if (passwordInput.value.length < 6) { showError(passwordInput, 'Password must be at least 6 characters.'); isValid = false;}
                if (!confirmPasswordInput.value.trim()) { showError(confirmPasswordInput, 'Confirm password is required.'); isValid = false; }
                else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) { showError(confirmPasswordInput, 'Passwords do not match.'); isValid = false; }

                setButtonLoading(registerButton, true);
                setTimeout(() => { // Simulate registration
                    if (isValid) {
                        statusMessageEl.textContent = 'Registration successful! Please login. (Demo)'; statusMessageEl.className = 'form-status-message success';
                        registerForm.reset();
                         setTimeout(() => { loginForm.style.display = 'block'; registerForm.style.display = 'none'; statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message'; }, 2000);
                    } else { statusMessageEl.textContent = 'Please correct errors.'; statusMessageEl.className = 'form-status-message error'; setTimeout(() => {statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message';}, 4000); }
                    setButtonLoading(registerButton, false);
                }, 750);
            });
        }

        function displayOrderDetails(orderId) {
            const history = getOrderHistory();
            const order = history.find(o => o.orderId === orderId);
            if (order && orderDetailsModalOverlay && orderDetailsModalContent) {
                let itemsHtml = order.items.map(item => `<li>${item.name} (x${item.quantity}) - €${(item.pricePerItem * item.quantity).toFixed(2)} <br><small style="color:#777; font-style:italic;">${item.customizations || 'No customizations'}</small></li>`).join('');

                orderDetailsModalContent.innerHTML = `
                    <button class="order-details-modal-close-btn" aria-label="Close order details">&times;</button>
                    <h3>Order Details: ${order.orderId}</h3>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Order Type:</strong> ${order.orderType || 'N/A'}</p>
                    ${order.orderType === 'delivery' && order.address1 ? `<p><strong>Delivery Address:</strong> ${order.address1}${order.eircode ? ', ' + order.eircode : ''}</p>` : ''}
                    <h4>Items:</h4>
                    <ul>${itemsHtml}</ul>
                    <hr style="margin: 15px 0;">
                    <p style="text-align:right; font-size: 1.2em;"><strong>Total: €${order.total.toFixed(2)}</strong></p>
                `;
                orderDetailsModalOverlay.classList.add('active');
                orderDetailsModalOverlay.querySelector('.order-details-modal-close-btn').addEventListener('click', () => {
                    orderDetailsModalOverlay.classList.remove('active');
                });
            }
        }

        function loadOrderHistory() {
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
                    `;
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

        if(orderDetailsModalOverlay){ // Close modal on overlay click
            orderDetailsModalOverlay.addEventListener('click', function(event) {
                if (event.target === orderDetailsModalOverlay) {
                    this.classList.remove('active');
                }
            });
        }

        loadOrderHistory();
    }

    // --- CONTACT PAGE SPECIFIC LOGIC ---
    const isContactPage = document.body.classList.contains('contact-page-body');
    if (isContactPage) { /* ... (same as previous, add loading state to button if desired) ... */
        const contactForm = document.getElementById('contactForm');
        const formStatusMessageEl = document.getElementById('contactFormStatus');
        if(contactForm && formStatusMessageEl){
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
                setTimeout(() => { // Simulate sending
                    if (isValid) {
                        formStatusMessageEl.textContent = 'Thank you! Your message has been received (Demo).';
                        formStatusMessageEl.className = 'form-status-message success'; contactForm.reset();
                    } else { formStatusMessageEl.textContent = 'Please correct the errors above.'; formStatusMessageEl.className = 'form-status-message error'; }
                    setButtonLoading(submitButton, false);
                    setTimeout(() => {formStatusMessageEl.textContent = ''; formStatusMessageEl.className = 'form-status-message';}, 5000);
                }, 750);
            });
             contactForm.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', () => clearError(input)));
        }
    }

    // --- ORDER CONFIRMATION PAGE SPECIFIC LOGIC ---
    const isOrderConfirmationPage = document.body.classList.contains('order-confirmation-page-body');
    if (isOrderConfirmationPage) { /* ... (same as previous) ... */ }
});
