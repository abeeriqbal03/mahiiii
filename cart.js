// Cart array to store products
let cart = [];

// Get cart from localStorage if exists
if (localStorage.getItem('bagbag-cart')) {
    cart = JSON.parse(localStorage.getItem('bagbag-cart'));
    updateCartCount();
}

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-cart');
    
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            const productImage = card.querySelector('.product-img').src;
            
            // Create product object
            const product = {
                id: Date.now() + index,
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
    });
    
    // Cart icon click to open sidebar
    const cartIcon = document.querySelector('.cart a');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
});

// Update cart count badge
function updateCartCount() {
    let cartBadge = document.querySelector('.cart-badge');
    
    if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        document.querySelector('.cart a').appendChild(cartBadge);
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
    
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
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
                    <span class="total-price">$0.00</span>
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
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 60px; color: #666; margin-bottom: 20px;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.querySelector('.total-price').textContent = '$0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price.replace('$', '').replace(',', ''));
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
    
    document.querySelector('.total-price').textContent = '$' + total.toFixed(2);
}

// Update quantity
function updateQuantity(index, change) {
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