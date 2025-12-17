// Universal Cart System for BagBag
let cart = [];

// Load cart from localStorage on page load
if (localStorage.getItem('bagbag-cart')) {
    cart = JSON.parse(localStorage.getItem('bagbag-cart'));
    updateCartCount();
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

// Initialize cart functionality
function initializeCart() {
    // Get all "Add to Cart" buttons (multiple selectors for different pages)
    const addToCartButtons = document.querySelectorAll('.btn, .add-to-cart-btn, .btn-cart');
    
    addToCartButtons.forEach((button) => {
        // Check if button is for adding to cart
        const buttonText = button.textContent.trim().toLowerCase();
        const isCartButton = buttonText.includes('add to cart') || 
                           button.classList.contains('add-to-cart-btn') ||
                           button.classList.contains('btn-cart');
        
        if (isCartButton) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const card = this.closest('.card, .sale-product-card');
                if (!card) return;
                
                // Try different selectors for product name
                let productName = '';
                const nameElement = card.querySelector('h4, h3, h5, .product-name');
                if (nameElement) {
                    productName = nameElement.textContent.trim();
                }
                
                // Try different selectors for price
                let productPrice = 'Pkr 0';
                const priceElement = card.querySelector('.price, .sale-price');
                if (priceElement) {
                    productPrice = priceElement.textContent.trim();
                }
                
                // Get product image
                let productImage = '';
                const imgElement = card.querySelector('img');
                if (imgElement) {
                    productImage = imgElement.src;
                }
                
                // Create product object
                const product = {
                    id: Date.now(),
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };
                
                // Check if product already exists in cart
                const existingProduct = cart.find(item => item.name === product.name);
                
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cart.push(product);
                }
                
                // Save to localStorage
                localStorage.setItem('bagbag-cart', JSON.stringify(cart));
                
                // Update cart UI
                updateCartCount();
                showCartNotification(productName);
                
                // Auto open cart
                openCart();
            });
        }
    });
    
    // Cart icon click to open sidebar
    const cartIcon = document.querySelector('.cart a');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
}

// Update cart count badge
function updateCartCount() {
    let cartBadge = document.querySelector('.cart-badge');
    
    if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        const cartLink = document.querySelector('.cart a');
        if (cartLink) {
            cartLink.appendChild(cartBadge);
        }
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (totalItems === 0) {
        cartBadge.style.display = 'none';
    } else {
        cartBadge.style.display = 'flex';
    }
}

// Show notification when product added
function showCartNotification(productName) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${productName} added to cart!</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Open cart sidebar
function openCart() {
    let cartSidebar = document.querySelector('.cart-sidebar');
    let cartOverlay = document.querySelector('.cart-overlay');
    
    if (!cartSidebar) {
        createCartSidebar();
        cartSidebar = document.querySelector('.cart-sidebar');
        cartOverlay = document.querySelector('.cart-overlay');
    }
    
    renderCartItems();
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
}

// Close cart sidebar
function closeCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

// Create cart sidebar HTML
function createCartSidebar() {
    const cartHTML = `
        <div class="cart-overlay"></div>
        <div class="cart-sidebar">
            <div class="cart-header">
                <h2 class="cart-title">Shopping Cart</h2>
                <button class="cart-close">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="total-price">$0</span>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    
    // Add event listeners
    document.querySelector('.cart-close').addEventListener('click', closeCart);
    document.querySelector('.cart-overlay').addEventListener('click', closeCart);
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 60px; color: #666; margin-bottom: 20px;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.querySelector('.total-price').textContent = '$0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        // Extract price number from string (handle "Pkr 8000", "$79.99", etc.)
        let priceStr = item.price.replace(/[^\d.,]/g, '').replace(',', '');
        const itemPrice = parseFloat(priceStr) || 0;
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Display total (detect currency from first item)
    const currency = cart[0].price.includes('Pkr') ? 'Pkr ' : '$';
    document.querySelector('.total-price').textContent = currency + total.toFixed(2);
}

// Update quantity
function updateQuantity(index, change) {
    if (!cart[index]) return;
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('bagbag-cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('bagbag-cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('bagbag-cart');
        updateCartCount();
        renderCartItems();
    }
}