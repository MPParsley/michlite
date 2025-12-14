// MiCH lite - Shopping Cart System
// ==================================

const Shop = {
    // Product catalog with prices
    products: {
        'edsl-complete': {
            id: 'edsl-complete',
            name: 'EDSL Complete Set',
            description: 'Complete Equine Dental Speculum Light Set including lamp, battery holder, charger, and aluminum case.',
            price: 545.00,
            image: 'box'
        },
        'edsl-lamp': {
            id: 'edsl-lamp',
            name: 'EDSL Lamp',
            description: 'Powerful LED lamp unit for equine dental procedures.',
            price: 295.00,
            image: 'sun'
        },
        'edsl-battery': {
            id: 'edsl-battery',
            name: 'EDSL Battery Holder',
            description: 'Ergonomic battery holder with rechargeable battery.',
            price: 245.00,
            image: 'battery'
        },
        'edsl-charger': {
            id: 'edsl-charger',
            name: 'EDSL Charger',
            description: 'Fast battery charger for EDSL battery system.',
            price: 85.00,
            image: 'zap'
        },
        'edsl-case': {
            id: 'edsl-case',
            name: 'EDSL Alu Box',
            description: 'Premium aluminum carrying case for complete EDSL set.',
            price: 125.00,
            image: 'package'
        }
    },

    // Initialize cart from localStorage
    init: function() {
        this.cart = this.getCart();
        this.updateCartCount();
        this.bindEvents();
    },

    // Get cart from localStorage
    getCart: function() {
        const cart = localStorage.getItem('michlite_cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart: function() {
        localStorage.setItem('michlite_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    },

    // Add item to cart
    addToCart: function(productId, quantity = 1) {
        const product = this.products[productId];
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} added to cart!`);
        return true;
    },

    // Remove item from cart
    removeFromCart: function(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    },

    // Update item quantity
    updateQuantity: function(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.renderCart();
            }
        }
    },

    // Get cart total
    getTotal: function() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get cart item count
    getItemCount: function() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Update cart count in navigation
    updateCartCount: function() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();

        cartCounts.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Show notification
    showNotification: function(message) {
        // Remove existing notification
        const existing = document.querySelector('.shop-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'shop-notification';
        notification.innerHTML = `
            <span>${message}</span>
            <a href="cart.html" class="notification-link">View Cart</a>
        `;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Bind add to cart events
    bindEvents: function() {
        // Add to cart buttons
        document.querySelectorAll('[data-add-to-cart]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.getAttribute('data-add-to-cart');
                this.addToCart(productId);
            });
        });

        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const quantity = parseInt(e.target.value) || 0;
                this.updateQuantity(productId, quantity);
            });
        });

        // Remove buttons
        document.querySelectorAll('[data-remove-from-cart]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.getAttribute('data-remove-from-cart');
                this.removeFromCart(productId);
            });
        });
    },

    // Render cart page
    renderCart: function() {
        const cartContainer = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const emptyCart = document.getElementById('empty-cart');

        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            return;
        }

        cartContainer.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';
        if (emptyCart) emptyCart.style.display = 'none';

        // Render items
        cartContainer.innerHTML = this.cart.map(item => {
            const product = this.products[item.id];
            return `
                <div class="cart-item">
                    <div class="cart-item-image">
                        ${this.getProductIcon(product.image)}
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">&euro;${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="Shop.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
                        <button class="quantity-btn plus" onclick="Shop.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">
                        <span>&euro;${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button class="cart-item-remove" onclick="Shop.removeFromCart('${item.id}')" title="Remove item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        // Update summary
        if (cartSummary) {
            const subtotal = this.getTotal();
            const shipping = subtotal > 500 ? 0 : 25;
            const total = subtotal + shipping;

            cartSummary.innerHTML = `
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>&euro;${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'Free' : '&euro;' + shipping.toFixed(2)}</span>
                </div>
                ${shipping > 0 ? '<p class="shipping-note">Free shipping on orders over &euro;500</p>' : ''}
                <div class="summary-row total">
                    <span>Total</span>
                    <span>&euro;${total.toFixed(2)}</span>
                </div>
                <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
                <a href="products.html" class="btn btn-outline btn-block">Continue Shopping</a>
            `;
        }

        // Rebind events for new elements
        this.bindEvents();
    },

    // Get product icon SVG
    getProductIcon: function(type) {
        const icons = {
            'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
            </svg>`,
            'battery': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                <line x1="23" y1="13" x2="23" y2="11"></line>
            </svg>`,
            'zap': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>`,
            'package': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>`,
            'box': `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>`
        };
        return icons[type] || icons['box'];
    },

    // Clear cart
    clearCart: function() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
    },

    // Render checkout page
    renderCheckout: function() {
        const orderItems = document.getElementById('order-items');
        const orderTotal = document.getElementById('order-total');

        if (!orderItems) return;

        if (this.cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        // Render order items
        orderItems.innerHTML = this.cart.map(item => `
            <div class="order-item">
                <span class="order-item-name">${item.name} x ${item.quantity}</span>
                <span class="order-item-price">&euro;${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        // Calculate totals
        const subtotal = this.getTotal();
        const shipping = subtotal > 500 ? 0 : 25;
        const total = subtotal + shipping;

        if (orderTotal) {
            orderTotal.innerHTML = `
                <div class="order-item">
                    <span>Subtotal</span>
                    <span>&euro;${subtotal.toFixed(2)}</span>
                </div>
                <div class="order-item">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'Free' : '&euro;' + shipping.toFixed(2)}</span>
                </div>
                <div class="order-item total">
                    <span>Total</span>
                    <span>&euro;${total.toFixed(2)}</span>
                </div>
            `;
        }
    },

    // Process checkout form
    processCheckout: function(formData) {
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                company: formData.get('company')
            },
            shipping: {
                address: formData.get('address'),
                city: formData.get('city'),
                postalCode: formData.get('postalCode'),
                country: formData.get('country')
            },
            items: this.cart,
            total: this.getTotal() + (this.getTotal() > 500 ? 0 : 25),
            notes: formData.get('notes')
        };

        // Generate order summary for email
        const orderSummary = this.cart.map(item =>
            `${item.name} x ${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');

        const subtotal = this.getTotal();
        const shipping = subtotal > 500 ? 0 : 25;
        const total = subtotal + shipping;

        // Create mailto link with order details
        const subject = 'New Order from MiCH lite Website';
        const body = `
NEW ORDER

Customer Information:
---------------------
Name: ${orderData.customer.firstName} ${orderData.customer.lastName}
Email: ${orderData.customer.email}
Phone: ${orderData.customer.phone || 'Not provided'}
Company: ${orderData.customer.company || 'Not provided'}

Shipping Address:
-----------------
${orderData.shipping.address}
${orderData.shipping.postalCode} ${orderData.shipping.city}
${orderData.shipping.country}

Order Items:
------------
${orderSummary}

Subtotal: €${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'Free' : '€' + shipping.toFixed(2)}
Total: €${total.toFixed(2)}

Notes:
------
${orderData.notes || 'None'}
        `.trim();

        const mailtoLink = `mailto:info@michlite.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Clear cart and redirect
        this.clearCart();

        // Show success and open email
        alert('Thank you for your order! Your email client will open to send the order. We will contact you shortly to confirm your order and arrange payment.');
        window.location.href = mailtoLink;

        return true;
    }
};

// Initialize shop when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    Shop.init();

    // Render cart if on cart page
    if (document.getElementById('cart-items')) {
        Shop.renderCart();
    }

    // Render checkout if on checkout page
    if (document.getElementById('order-items')) {
        Shop.renderCheckout();
    }

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(checkoutForm);
            Shop.processCheckout(formData);
        });
    }
});
