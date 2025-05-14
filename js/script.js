document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL HELPER FUNCTIONS ---
    const getCart = () => JSON.parse(localStorage.getItem('corkGrillCart') || '[]');
    const saveCart = (cart) => { localStorage.setItem('corkGrillCart', JSON.stringify(cart)); updateGlobalCartCount(); };
    const clearCart = () => { localStorage.removeItem('corkGrillCart'); localStorage.removeItem('corkGrillAppliedPromo'); updateGlobalCartCount(); };

    const getOrderHistory = () => JSON.parse(localStorage.getItem('corkGrillOrderHistory') || '[]');
    const saveOrderToHistory = (orderDetails) => {
        const history = getOrderHistory();
        history.unshift(orderDetails); // Add to the beginning
        localStorage.setItem('corkGrillOrderHistory', JSON.stringify(history.slice(0, 10))); // Keep last 10 orders
    };

    const updateGlobalCartCount = () => {
        const cart = getCart(); let totalItems = 0;
        cart.forEach(item => { totalItems += item.quantity; });
        const globalCartCountEl = document.getElementById('globalCartCount');
        if (globalCartCountEl) {
            const prevCount = parseInt(globalCartCountEl.dataset.prevCount || '0');
            globalCartCountEl.textContent = totalItems;
            if ((totalItems > prevCount && totalItems > 0) || (totalItems < prevCount)) {
                globalCartCountEl.classList.add('updated');
                setTimeout(() => globalCartCountEl.classList.remove('updated'), 300);
            }
            globalCartCountEl.dataset.prevCount = totalItems;
        }
    };

    // --- INITIALIZE GLOBAL ELEMENTS ---
    updateGlobalCartCount();

    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => mainNav.classList.toggle('mobile-active'));
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { if (mainNav.classList.contains('mobile-active')) { mainNav.classList.remove('mobile-active'); } });
        });
    }

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { scrollToTopBtn.classList.add('visible'); }
            else { scrollToTopBtn.classList.remove('visible'); }
        });
        scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // --- DUMMY MENU ITEMS DATA STORE ---
    const menuItemsData = {
        "kebab-deluxe": { id: "kebab-deluxe", name: "Deluxe Kebab", description: "Our signature kebab...", price: 9.50, image: "placeholder-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}, {id:"onion", name:"Onion", price:0, default:false}, {id:"extra_cheese", name:"Extra Cheese", price:1.00, default:false}, {id:"pickles", name:"No Pickles", price:-0.50, default:false, isRemoval: true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"chili", name:"Chili Sauce"}, {id:"house_special", name:"House Special"}], mealOptionPrice: 3.50 },
        "chicken-kebab": { id: "chicken-kebab", name: "Chicken Kebab", description: "Marinated grilled chicken...", price: 9.00, image: "placeholder-chicken-kebab.jpg", category: "Kebabs", customizableIngredients: [{id: "lettuce", name:"Lettuce", price:0, default:true}, {id:"tomato", name:"Tomato", price:0, default:true}], sauces: [{id:"garlic", name:"Garlic Sauce", default:true}, {id:"mayo", name:"Mayonnaise"}], mealOptionPrice: 3.50 },
        "classic-burger": { id: "classic-burger", name: "Classic Burger", description: "A juicy beef patty...", price: 8.00, image: "placeholder-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "cheese-burger": { id: "cheese-burger", name: "Cheese Burger", description: "Classic burger with cheddar.", price: 8.75, image: "placeholder-cheese-burger.jpg", category: "Burgers", mealOptionPrice: 3.00 },
        "kebab-meal-deal": {id: "kebab-meal-deal", name: "Kebab Meal Deal", description: "Kebab, Fries & Drink.", price: 12.50, image: "placeholder-kebab-meal.jpg", category: "Deals", isDeal: true},
        "spicy-chicken-burger": {id: "spicy-chicken-burger", name: "Spicy Kickin' Chicken Burger", description: "Crispy chicken fillet with our fiery house sauce, jalapeños, and pepper jack cheese.", price: 9.00, originalPrice: 10.50, image: "placeholder-spicy-burger.jpg", category: "Specials", featured: true, mealOptionPrice: 3.00},
        "loaded-fries-special": {id: "loaded-fries-special", name: "Fully Loaded Fries", description: "Our signature fries topped with cheese sauce, crispy bacon bits, and spring onions.", price: 6.50, image: "placeholder-loaded-fries.jpg", category: "Specials", featured: true, mealOptionPrice: null}
    };
    const promoCodes = { "SAVE10": { type: "percentage", value: 10 }, "CORKGRILL2": { type: "fixed", value: 2.00 } };

    // --- HOMEPAGE SPECIFIC LOGIC (INDEX.HTML) ---
    if (document.querySelector('.hero-section')) {
        const featuredItemsContainer = document.querySelector('#featured-items .menu-grid');
        if (featuredItemsContainer) {
            featuredItemsContainer.innerHTML = '';
            let featuredCount = 0;
            for (const itemId in menuItemsData) {
                if (menuItemsData[itemId].featured && featuredCount < 4) {
                    const item = menuItemsData[itemId];
                    const itemCard = document.createElement('div');
                    itemCard.className = 'menu-item-card featured-item';
                    itemCard.dataset.itemId = item.id;
                    itemCard.innerHTML = `
                        <div class="item-image-container"><img src="${item.image}" alt="${item.name}"></div>
                        <div class="item-info">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-description">${item.description.length > 70 ? item.description.substring(0,67) + '...' : item.description}</p>
                            <p class="item-price">€${item.price.toFixed(2)} ${item.originalPrice ? `<span class="original-price">€${item.originalPrice.toFixed(2)}</span>` : ''}</p>
                        </div>
                        <a href="item-detail.html?item=${item.id}" class="btn btn-primary btn-view-item">Order Now</a>
                    `;
                    featuredItemsContainer.appendChild(itemCard);
                    featuredCount++;
                }
            }
            if(featuredCount === 0 && featuredItemsContainer){ // Check if container still exists
                featuredItemsContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No specials today, check back soon!</p>';
            }
        }
    }

    // --- ITEM DETAIL PAGE SPECIFIC LOGIC ---
    const isItemDetailPage = document.body.classList.contains('item-customization-page');
    if (isItemDetailPage) { /* ... (same as previous) ... */
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
            document.getElementById('itemDetailName').textContent = currentItemConfig.name;
            document.getElementById('itemDetailDescription').textContent = currentItemConfig.description;
            document.getElementById('breadcrumbItemName').textContent = currentItemConfig.name;
            document.getElementById('breadcrumbCategory').textContent = currentItemConfig.category;
            document.getElementById('breadcrumbCategory').href = `index.html#${currentItemConfig.category.toLowerCase().replace(/\s+/g, '-')}`;
            document.getElementById('itemDetailImage').src = currentItemConfig.image;
            document.getElementById('itemBasePrice').textContent = `€${currentItemConfig.price.toFixed(2)}`;
            basePrice = currentItemConfig.price;
            const ingredientsContainer = form.querySelector('.customization-section:nth-of-type(1) .option-group');
            if (ingredientsContainer && currentItemConfig.customizableIngredients) {
                ingredientsContainer.innerHTML = '';
                currentItemConfig.customizableIngredients.forEach(ing => {
                    const label = document.createElement('label'); label.className = 'choice-label';
                    label.innerHTML = `<input type="checkbox" name="${ing.id}" data-price-change="${ing.price}" ${ing.default ? 'checked' : ''}> <span>${ing.name} ${ing.price !== 0 ? `(${ing.price > 0 ? '+' : ''}€${ing.price.toFixed(2)})` : ''}</span>`;
                    ingredientsContainer.appendChild(label);
                });
            }
            const saucesContainer = form.querySelector('.customization-section:nth-of-type(2) .option-group');
            if (saucesContainer && currentItemConfig.sauces) {
                 saucesContainer.innerHTML = '';
                 currentItemConfig.sauces.forEach(sauce => {
                    const label = document.createElement('label'); label.className = 'choice-label';
                    label.innerHTML = `<input type="radio" name="sauce" value="${sauce.id}" ${sauce.default ? 'checked' : ''}> <span>${sauce.name}</span>`;
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
    if (isCartPage) { /* ... (same as previous) ... */
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
        let currentDiscountValue = 0;
        let appliedPromoCode = localStorage.getItem('corkGrillAppliedPromo');
        const renderCart = () => {
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
                cartItemDiv.innerHTML = `
                    <img src="${item.image || 'placeholder-default.jpg'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        ${item.customizations ? `<p class="item-customizations">${item.customizations}</p>` : ''}
                        <p class="item-unit-price">@ €${item.pricePerItem.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn" data-action="decrease" aria-label="Decrease quantity">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus-btn" data-action="increase" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="cart-item-total">€${itemTotalPrice.toFixed(2)}</div>
                    <button class="cart-item-remove" aria-label="Remove item">×</button>
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
        const calculateTotal = (subtotal) => {
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
        const updateCartItemQuantity = (cartItemId, newQuantity) => {
            let cart = getCart();
            const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
            if (itemIndex > -1) {
                if (newQuantity < 1) { cart.splice(itemIndex, 1); }
                else { cart[itemIndex].quantity = newQuantity; }
                saveCart(cart); renderCart();
            }
        };
        const removeCartItem = (cartItemId) => {
            let cart = getCart(); cart = cart.filter(item => item.cartItemId !== cartItemId);
            saveCart(cart); renderCart();
        };
        const addCartItemEventListeners = () => {
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
        if (applyPromoBtn && promoCodeInput && promoStatusMessageEl) {
            if(appliedPromoCode && promoCodes[appliedPromoCode]){
                promoCodeInput.value = appliedPromoCode;
                 promoStatusMessageEl.textContent = `Promo "${appliedPromoCode}" applied!`;
                 promoStatusMessageEl.classList.add('success');
            }
            applyPromoBtn.addEventListener('click', () => {
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
                setTimeout(() => { promoStatusMessageEl.textContent = ''; promoStatusMessageEl.className = 'promo-status-message';}, 3000);
            });
        }
        if (proceedToCheckoutBtn && checkoutFormSection) {
            proceedToCheckoutBtn.addEventListener('click', () => {
                const cart = getCart();
                if (cart.length > 0) {
                    checkoutFormSection.style.display = 'block';
                    proceedToCheckoutBtn.style.display = 'none';
                    checkoutFormSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else { alert("Your cart is empty."); }
            });
        }
        if (orderTypeRadios.length > 0 && deliveryAddressFieldsContainer) {
            const toggleDeliveryFields = (isDelivery) => {
                if (isDelivery) {
                    deliveryAddressFieldsContainer.style.display = 'block';
                    deliveryAddressInputs.forEach(input => input.required = true);
                } else {
                    deliveryAddressFieldsContainer.style.display = 'none';
                    deliveryAddressInputs.forEach(input => { input.required = false; clearError(input); });
                }
            };
            orderTypeRadios.forEach(radio => radio.addEventListener('change', () => toggleDeliveryFields(radio.value === 'delivery' && radio.checked)));
            const initialOrderType = document.querySelector('input[name="orderType"]:checked');
            if (initialOrderType) toggleDeliveryFields(initialOrderType.value === 'delivery');
        }
        function validateCheckoutForm() {
            let isValid = true;
            const inputsToValidate = checkoutForm.querySelectorAll('input[required]:not([type="radio"]), textarea[required]');
            inputsToValidate.forEach(input => {
                if (input.offsetWidth > 0 || input.offsetHeight > 0 || input.getClientRects().length > 0) {
                    clearError(input);
                    if (!input.value.trim()) {
                        showError(input, `${input.labels[0] ? input.labels[0].textContent.replace(':', '') : 'This field'} is required.`);
                        isValid = false;
                    } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
                        showError(input, 'Please enter a valid email address.');
                        isValid = false;
                    } else if (input.type === 'tel' && input.pattern && !new RegExp(input.pattern).test(input.value.trim())) {
                        showError(input, 'Please enter a valid phone number (e.g., 08X XXX XXXX).');
                        isValid = false;
                    }
                } else { clearError(input); }
            });
            return isValid;
        }
        function showError(inputElement, message) {
            inputElement.classList.add('error');
            const errorSpan = inputElement.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = message; }
        }
        function clearError(inputElement) {
            inputElement.classList.remove('error');
            const errorSpan = inputElement.nextElementSibling;
            if (errorSpan && errorSpan.classList.contains('error-message')) { errorSpan.textContent = ''; }
        }
        function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (event) => {
                if (!validateCheckoutForm()) {
                    event.preventDefault();
                    const firstErrorField = checkoutForm.querySelector('input.error, textarea.error');
                    if(firstErrorField) { firstErrorField.focus(); firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });}
                } else {
                    // If form is valid, default action (GET to order-confirmation.html) proceeds.
                    // Before submission, save order details for confirmation page and to history
                    const formData = new FormData(checkoutForm);
                    const orderDetailsFromForm = Object.fromEntries(formData.entries());
                    const orderId = `CG${Date.now()}`;
                    const cartForHistory = getCart();
                    const totalAmountForHistory = parseFloat(document.getElementById('cartTotal').textContent.replace('€',''));

                    const fullOrderDetailsForHistory = {
                        orderId: orderId,
                        date: new Date().toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' }),
                        total: totalAmountForHistory,
                        status: 'Pending', // Initial status for a new order
                        name: orderDetailsFromForm.checkoutName,
                        email: orderDetailsFromForm.checkoutEmail,
                        phone: orderDetailsFromForm.checkoutPhone,
                        orderType: orderDetailsFromForm.orderType,
                        address1: orderDetailsFromForm.checkoutAddress1 || '',
                        address2: orderDetailsFromForm.checkoutAddress2 || '',
                        eircode: orderDetailsFromForm.checkoutEircode || '',
                        instructions: orderDetailsFromForm.deliveryInstructions || '',
                        items: cartForHistory.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            pricePerItem: item.pricePerItem,
                            customizations: item.customizations
                        }))
                    };
                    saveOrderToHistory(fullOrderDetailsForHistory);
                    // For confirmation page, only pass minimal details via URL
                    localStorage.setItem('lastOrderDetails', JSON.stringify({
                        orderId: orderId,
                        name: orderDetailsFromForm.checkoutName,
                        email: orderDetailsFromForm.checkoutEmail,
                        orderType: orderDetailsFromForm.orderType,
                        address1: orderDetailsFromForm.checkoutAddress1 || '',
                        eircode: orderDetailsFromForm.checkoutEircode || ''
                    }));
                    clearCart(); // Clear cart from localStorage after processing
                    // Now allow the form to submit to its action
                }
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

        formSwitchLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetFormId = link.getAttribute('href').substring(1);
                const loginStatus = document.getElementById('loginStatusMessage');
                const registerStatus = document.getElementById('registerStatusMessage');

                if (targetFormId === 'registerForm') {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                } else {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                }
                if (loginStatus) loginStatus.textContent = '';
                if (registerStatus) registerStatus.textContent = '';
            });
        });

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                const statusMessageEl = document.getElementById('loginStatusMessage');
                let isValid = true;
                [emailInput, passwordInput].forEach(input => clearError(input));

                if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
                else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
                if (!passwordInput.value.trim()) { showError(passwordInput, 'Password is required.'); isValid = false; }

                if (isValid) {
                    statusMessageEl.textContent = 'Login successful! (Demo - No actual login occurred)';
                    statusMessageEl.className = 'form-status-message success';
                    loadOrderHistory();
                } else {
                    statusMessageEl.textContent = 'Please correct errors.';
                    statusMessageEl.className = 'form-status-message error';
                }
                setTimeout(() => {statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message';}, 4000);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('registerName');
                const emailInput = document.getElementById('registerEmail');
                const passwordInput = document.getElementById('registerPassword');
                const confirmPasswordInput = document.getElementById('registerConfirmPassword');
                const statusMessageEl = document.getElementById('registerStatusMessage');
                let isValid = true;
                [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => clearError(input));

                if (!nameInput.value.trim()) { showError(nameInput, 'Name is required.'); isValid = false; }
                if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
                else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
                if (!passwordInput.value.trim()) { showError(passwordInput, 'Password is required.'); isValid = false; }
                else if (passwordInput.value.length < 6) { showError(passwordInput, 'Password must be at least 6 characters.'); isValid = false;}
                if (!confirmPasswordInput.value.trim()) { showError(confirmPasswordInput, 'Confirm password is required.'); isValid = false; }
                else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) { showError(confirmPasswordInput, 'Passwords do not match.'); isValid = false; }

                if (isValid) {
                    statusMessageEl.textContent = 'Registration successful! Please login. (Demo)';
                    statusMessageEl.className = 'form-status-message success';
                    registerForm.reset();
                     setTimeout(() => {
                        loginForm.style.display = 'block';
                        registerForm.style.display = 'none';
                        statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message';
                    }, 2000);
                } else {
                    statusMessageEl.textContent = 'Please correct errors.';
                    statusMessageEl.className = 'form-status-message error';
                     setTimeout(() => {statusMessageEl.textContent = ''; statusMessageEl.className = 'form-status-message';}, 4000);
                }
            });
        }

        function loadOrderHistory() {
            const history = getOrderHistory();
            orderHistoryListEl.innerHTML = '';
            if (history.length === 0) {
                emptyHistoryMessageEl.style.display = 'block';
            } else {
                emptyHistoryMessageEl.style.display = 'none';
                history.forEach(order => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'order-history-item';
                    let itemsSummaryHtml = order.items.map(item => `${item.name} (x${item.quantity})`).join(', ');
                    if (itemsSummaryHtml.length > 100) itemsSummaryHtml = itemsSummaryHtml.substring(0, 97) + '...';


                    itemDiv.innerHTML = `
                        <h4>Order ID: ${order.orderId} <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></h4>
                        <p>Date: ${order.date}</p>
                        <p>Items: <small>${itemsSummaryHtml || 'Details unavailable'}</small></p>
                        <p>Total: €${order.total.toFixed(2)}</p>
                        <a href="#" class="btn btn-secondary btn-sm view-order-details-btn" data-order-id="${order.orderId}">View Details (Demo)</a>
                    `;
                    orderHistoryListEl.appendChild(itemDiv);
                });
            }
        }
        // Simulate user might be "logged in" or not - for demo, always load history
        // In a real app, this would depend on actual login state.
        loadOrderHistory();
    }

    // --- CONTACT PAGE SPECIFIC LOGIC ---
    const isContactPage = document.body.classList.contains('contact-page-body');
    if (isContactPage) { /* ... (same as previous) ... */
        const contactForm = document.getElementById('contactForm');
        const formStatusMessageEl = document.getElementById('contactFormStatus');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const messageInput = document.getElementById('contactMessage');
            [nameInput, emailInput, messageInput].forEach(input => clearError(input));
            if (!nameInput.value.trim()) { showError(nameInput, 'Name is required.'); isValid = false; }
            if (!emailInput.value.trim()) { showError(emailInput, 'Email is required.'); isValid = false; }
            else if (!isValidEmail(emailInput.value.trim())) { showError(emailInput, 'Invalid email format.'); isValid = false; }
            if (!messageInput.value.trim()) { showError(messageInput, 'Message is required.'); isValid = false; }
            if (isValid) {
                formStatusMessageEl.textContent = 'Thank you! Your message has been received (Demo).';
                formStatusMessageEl.className = 'form-status-message success';
                contactForm.reset();
            } else {
                formStatusMessageEl.textContent = 'Please correct the errors above.';
                formStatusMessageEl.className = 'form-status-message error';
            }
             setTimeout(() => {formStatusMessageEl.textContent = ''; formStatusMessageEl.className = 'form-status-message';}, 5000);
        });
    }

    // --- ORDER CONFIRMATION PAGE SPECIFIC LOGIC ---
    const isOrderConfirmationPage = document.body.classList.contains('order-confirmation-page-body');
    if (isOrderConfirmationPage) { /* ... (same as previous) ... */
        const lastOrderDetailsString = localStorage.getItem('lastOrderDetails');
        if(lastOrderDetailsString){
            const orderDetails = JSON.parse(lastOrderDetailsString);
            document.getElementById('confirmedOrderId').textContent = orderDetails.orderId || 'N/A';
            document.getElementById('confirmedOrderName').querySelector('span').textContent = orderDetails.name || 'Valued Customer';
            document.getElementById('confirmedEmail').textContent = orderDetails.email || 'your email';
            const orderType = orderDetails.orderType;
            document.getElementById('confirmedOrderType').textContent = orderType === 'delivery' ? 'Delivery' : 'Pickup';
            const deliveryAddressDiv = document.getElementById('confirmedDeliveryAddress');
            const addressSpan = document.getElementById('confirmedOrderAddress');
            if (orderType === 'delivery' && orderDetails.address1) {
                addressSpan.textContent = `${orderDetails.address1}${orderDetails.eircode ? ', ' + orderDetails.eircode : ''}`;
                deliveryAddressDiv.style.display = 'block';
            }
            // We don't remove lastOrderDetails here, as checkout form's submit now handles it
            // and it's used to populate order history.
        } else { document.getElementById('confirmedOrderId').textContent = 'Unavailable'; }
        // Cart is cleared on checkout form submission if valid
        updateGlobalCartCount();
    }
});