// Enhanced GWD Shopping Cart System with Quantity, Customization & Payment
console.log("GWD Enhanced Cart System loaded!");

let cart = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    updateCartCount();
    setupPaymentMethods();
});

// Quantity Controls
function increaseQuantity(button) {
    const quantityElement = button.parentElement.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;
}

function decreaseQuantity(button) {
    const quantityElement = button.parentElement.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
}

// Enhanced Add to Cart with Customization (for samosas)
function addToCart(button) {
    const itemCard = button.closest('.item-card');
    const itemName = itemCard.querySelector('h4').textContent;
    const basePrice = parseInt(itemCard.querySelector('.price-amount').textContent);
    const quantity = parseInt(itemCard.querySelector('.quantity').textContent);
    const spiceLevel = itemCard.querySelector('.spice-level').value;
    const specialNotes = itemCard.querySelector('.special-notes').value;
    
    const totalPrice = basePrice * quantity;
    
    // Create cart item object
    const cartItem = {
        name: itemName,
        basePrice: basePrice,
        quantity: quantity,
        totalPrice: totalPrice,
        spiceLevel: spiceLevel,
        specialNotes: specialNotes,
        id: Date.now()
    };
    
    // Add to cart
    cart.push(cartItem);
    
    // Update display
    updateCartDisplay();
    updateCartCount();
    
    // Show confirmation
    alert(`✅ Added ${quantity} ${itemName} to cart!`);
    
    // Reset quantity to 1
    itemCard.querySelector('.quantity').textContent = '1';
    
    // Open cart sidebar
    toggleCart();
}

// Simple Add to Cart (for other items)
function addToCartSimple(itemName, price) {
    const cartItem = {
        name: itemName,
        basePrice: price,
        quantity: 1,
        totalPrice: price,
        spiceLevel: 'mild',
        specialNotes: '',
        id: Date.now()
    };
    
    cart.push(cartItem);
    updateCartDisplay();
    updateCartCount();
    alert(`✅ Added ${itemName} to cart!`);
    toggleCart();
}

// Enhanced Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');
    
    if (!cartItems) return;
    
    // Clear current items
    cartItems.innerHTML = '';
    
    let grandTotal = 0;
    
    // Add each item to cart display
    cart.forEach((item, index) => {
        grandTotal += item.totalPrice;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.style.cssText = `
            display: block;
            padding: 1rem;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 0.5rem;
        `;
        
        // Build conditional HTML snippets as strings (avoid JSX-like syntax)
        const spiceHtml = item.spiceLevel !== 'mild'
            ? `<p style="margin: 0.2rem 0; font-size: 0.8rem;">🌶 Spice: ${item.spiceLevel}</p>`
            : '';
        const notesHtml = item.specialNotes
            ? `<p style="margin: 0.2rem 0; font-size: 0.8rem;">📝 Notes: ${item.specialNotes}</p>`
            : '';

        itemElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: bold; color: var(--secondary);">${item.name}</p>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--primary);">KSh ${item.basePrice} × ${item.quantity} = KSh ${item.totalPrice}</p>
                    ${spiceHtml}
                    ${notesHtml}
                </div>
                <button onclick="removeFromCart(${index})" style="
                    background: #EF4444;
                    color: white;
                    border: none;
                    padding: 0.3rem 0.6rem;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.8rem;
                ">Remove</button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
    });
    
    // Update total price
    if (totalElement) {
        totalElement.textContent = grandTotal;
    }
    
    // Update MPesa amount
    updateMpesaAmount();
}

// Remove item from cart
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

// Payment Method Functions
function setupPaymentMethods() {
    // Update MPesa amount when cart changes
    updateMpesaAmount();
    
    // Handle payment method changes
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            showPaymentInstructions(this.value);
        });
    });
}

function showPaymentInstructions(method) {
    // Hide all instructions first
    document.getElementById('mpesa-instructions').style.display = 'none';
    document.getElementById('bank-instructions').style.display = 'none';
    
    // Show selected method instructions
    if (method === 'mpesa') {
        document.getElementById('mpesa-instructions').style.display = 'block';
    } else if (method === 'bank') {
        document.getElementById('bank-instructions').style.display = 'block';
    }
    // Cash on delivery doesn't need instructions
}

function updateMpesaAmount() {
    const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0);
    const mpesaAmountElement = document.getElementById('mpesa-amount');
    if (mpesaAmountElement) {
        mpesaAmountElement.textContent = totalAmount;
    }
}

function getSelectedPaymentMethod() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    return selectedPayment ? selectedPayment.value : 'mpesa';
}

// Enhanced Checkout with Payment Method
function checkout() {
    if (cart.length === 0) {
        alert("🛒 Your cart is empty! Add some delicious items first.");
        return;
    }
    
    const paymentMethod = getSelectedPaymentMethod();
    const totalAmount = cart.reduce((total, item) => total + item.totalPrice, 0);
    
    // Create detailed order summary
    let orderSummary = "🛒 GWD ORDER 🐻\n\n";
    
    cart.forEach(item => {
        orderSummary += `• ${item.quantity}x ${item.name} - KSh ${item.totalPrice}\n`;
        if (item.spiceLevel !== 'mild') {
            orderSummary += `  🌶 Spice: ${item.spiceLevel}\n`;
        }
        if (item.specialNotes) {
            orderSummary += `  📝 Notes: ${item.specialNotes}\n`;
        }
        orderSummary += '\n';
    });

    orderSummary += `💰 TOTAL: KSh ${totalAmount}\n\n`;
    orderSummary += `💳 Payment Method: ${paymentMethod.toUpperCase()}\n\n`;
    
    // Add payment-specific instructions
    if (paymentMethod === 'mpesa') {
        orderSummary += "📱 MPesa Instructions:\n";
        orderSummary += "1. Lipa Na MPesa → Buy Goods\n";
        orderSummary += "2. Till: 3721190\n"; // UPDATE WITH YOUR ACTUAL TILL NUMBER
        orderSummary += "3. Amount: KSh " + totalAmount + "\n";
        orderSummary += "4. Enter PIN\n";
        orderSummary += "5. Send screenshot of confirmation\n\n";
    } else if (paymentMethod === 'bank') {
        orderSummary += "🏦 Bank Transfer:\n";
        orderSummary += "Bank: Equity Bank\n"; // UPDATE WITH YOUR BANK
        orderSummary += "Account: Joe Gicharu Kamoni Grizzly World Deliveries\n";
        orderSummary += "Number: 0380186537877\n"; // UPDATE WITH YOUR ACCOUNT
        orderSummary += "Send transfer screenshot\n\n";
    } else {
        orderSummary += "💵 Cash on Delivery - Please have exact amount ready.\n\n";
    }
    
    orderSummary += "📋 Customer Details:\nName: _________________\nRoom/Hostel: ___________\nPhone: _________________\n\n";
    orderSummary += "📍 Delivery Instructions:\n_";
    
    // Show confirmation
    const userConfirmed = confirm(`ORDER CONFIRMATION:\n\n${orderSummary}\n\nClick OK to proceed to WhatsApp, or Cancel to review your order.`);
    
    if (userConfirmed) {
        // WhatsApp integration - UPDATE WITH YOUR NUMBER
        const phoneNumber = "254714396527";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappUrl, '_blank');
        
        // Optional: Clear cart after successful order
        const clearCart = confirm('Order sent! Would you like to clear your cart?');
        if (clearCart) {
            cart = [];
            updateCartDisplay();
            updateCartCount();
            toggleCart();
        }
    }
}

// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('GWD PWA: ServiceWorker registered');
            })
            .catch(function(error) {
                console.log('GWD PWA: ServiceWorker registration failed');
            });
    });
}