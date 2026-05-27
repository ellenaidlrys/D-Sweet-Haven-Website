// ==========================================
// D'SWEET HAVEN - UPDATED SCRIPT
// ==========================================

// Initialize AOS Animations
AOS.init({
    once: true,
    duration: 1000
});

// ==========================================
// ELEMENTS
// ==========================================
const productsContainer = document.getElementById('productsContainer');
const cartModal = document.getElementById('cartModal');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsList = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const subTotalEl = document.getElementById('subTotal');
const shippingFeeEl = document.getElementById('shippingFee');
const grandTotalEl = document.getElementById('grandTotal');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterButtons = document.querySelectorAll('.filter-btn');

// Checkout Elements
const deliverySection = document.getElementById('deliverySection');
const paymentSection = document.getElementById('paymentSection');
const customerForm = document.getElementById('customerForm');
const checkoutStep1 = document.getElementById('checkoutStep1');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const successModal = document.getElementById('successModal');

// ==========================================
// VARIABLES
// ==========================================
let allProducts = [];
let cart = [];
let shippingFee = 0;

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// LOAD PRODUCTS
// ==========================================
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        allProducts = data.products;
        displayProducts(allProducts);
    })
    .catch(error => {
        console.error('Error loading products:', error);

        productsContainer.innerHTML = `
            <p style="
                text-align:center;
                width:100%;
                color:#888;
                padding:40px 0;
                font-size:18px;
            ">
                Failed to load products ☕
            </p>
        `;
    });

// ==========================================
// DISPLAY PRODUCTS
// ==========================================
function displayProducts(products) {

    productsContainer.innerHTML = '';

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <p style="
                text-align:center;
                width:100%;
                color:#888;
                padding:40px 0;
                font-size:18px;
            ">
                No products found ☕
            </p>
        `;
        return;
    }

    products.forEach(item => {

        const card = document.createElement('div');
        card.className = 'product-card';

        card.setAttribute('data-aos', 'fade-up');

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <h3>${item.name}</h3>

            <div class="price">
                ₱${item.price}.00
            </div>

            <button 
                class="add-to-cart"
                onclick="addToCart(
                    ${item.id},
                    '${item.name.replace(/'/g, "\\'")}',
                    ${item.price}
                )"
            >
                Add to Cart
            </button>
        `;

        productsContainer.appendChild(card);
    });

    AOS.refresh();
}

// ==========================================
// SEARCH PRODUCTS
// ==========================================
function searchProducts() {

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchText)
    );

    displayProducts(filteredProducts);
}

searchBtn.addEventListener('click', searchProducts);

searchInput.addEventListener('keyup', searchProducts);

// ==========================================
// FILTER PRODUCTS
// ==========================================
filterButtons.forEach(button => {

    button.addEventListener('click', () => {

        filterButtons.forEach(btn =>
            btn.classList.remove('active')
        );

        button.classList.add('active');

        const category = button.dataset.filter;

        if (category === 'all') {
            displayProducts(allProducts);
        } else {

            const filtered = allProducts.filter(product =>
                product.category === category
            );

            displayProducts(filtered);
        }
    });
});

// ==========================================
// ADD TO CART
// ==========================================
function addToCart(id, name, price) {

    const existingItem = cart.find(item =>
        item.id === id
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {

        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    showToast('✅ Added to cart!');
}

// ==========================================
// UPDATE CART
// ==========================================
function updateCart() {

    cartItemsList.innerHTML = '';

    if (cart.length === 0) {

        cartItemsList.innerHTML = `
            <p style="
                text-align:center;
                color:#888;
                padding:20px 0;
            ">
                Your cart is empty ☕
            </p>
        `;

        deliverySection.style.display = 'none';
        paymentSection.style.display = 'none';
        customerForm.style.display = 'none';

        checkoutStep1.style.display = 'block';
        confirmOrderBtn.style.display = 'none';

    } else {

        cart.forEach((item, index) => {

            const cartItem = document.createElement('div');

            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>

                    <p>
                        ₱${item.price}.00 × ${item.quantity}
                    </p>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                ">

                    <div class="qty-controls">

                        <button onclick="changeQty(${index}, -1)">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQty(${index}, 1)">
                            +
                        </button>

                    </div>

                    <button 
                        class="remove-item"
                        onclick="removeItem(${index})"
                    >
                        ×
                    </button>

                </div>
            `;

            cartItemsList.appendChild(cartItem);
        });
    }

    calculateTotal();
}

// ==========================================
// CHANGE QUANTITY
// ==========================================
function changeQty(index, change) {

    if (cart[index].quantity + change < 1) {
        return;
    }

    cart[index].quantity += change;

    updateCart();
}

// ==========================================
// REMOVE ITEM
// ==========================================
function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

    showToast('❌ Item removed');
}

// ==========================================
// CALCULATE TOTAL
// ==========================================
function calculateTotal() {

    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const grandTotal = subtotal + shippingFee;

    subTotalEl.textContent = subtotal.toFixed(2);

    shippingFeeEl.textContent = shippingFee.toFixed(2);

    grandTotalEl.textContent = grandTotal.toFixed(2);

    cartCount.textContent = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
}

// ==========================================
// UPDATE SHIPPING
// ==========================================
function updateTotal() {

    const selectedDelivery = document.querySelector(
        'input[name="delivery"]:checked'
    ).value;

    if (selectedDelivery === 'delivery') {
        shippingFee = 50;
    } else {
        shippingFee = 0;
    }

    calculateTotal();
}

// ==========================================
// SHOW CHECKOUT
// ==========================================
function showDeliveryOptions() {

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    deliverySection.style.display = 'block';
    paymentSection.style.display = 'block';
    customerForm.style.display = 'block';

    checkoutStep1.style.display = 'none';
    confirmOrderBtn.style.display = 'block';

    // Smooth scroll
    const cartContent = document.querySelector('.cart-content');

    cartContent.scrollTo({
        top: cartContent.scrollHeight,
        behavior: 'smooth'
    });
}

// ==========================================
// CONFIRM ORDER
// ==========================================
function confirmOrder() {

    const fullname = document
        .getElementById('fullname')
        .value
        .trim();

    const phone = document
        .getElementById('phone')
        .value
        .trim();

    const address = document
        .getElementById('address')
        .value
        .trim();

    const paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    const deliveryType = document.querySelector(
        'input[name="delivery"]:checked'
    ).value;

    // Validation
    if (!fullname || !phone || !address) {

        alert('⚠️ Please fill in all required details!');

        return;
    }

    // Order Object
    const orderDetails = {
        customer: fullname,
        phone: phone,
        address: address,
        delivery: deliveryType,
        payment: paymentMethod,
        items: cart,
        subtotal: subTotalEl.textContent,
        shipping: shippingFeeEl.textContent,
        total: grandTotalEl.textContent
    };

    console.log('ORDER DETAILS:', orderDetails);

    // Reset Cart
    cart = [];

    shippingFee = 0;

    updateCart();

    // Reset Form
    document.getElementById('fullname').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';

    // Close Cart
    cartModal.style.display = 'none';

    // Show Success
    successModal.style.display = 'block';
}

// ==========================================
// CLOSE SUCCESS MODAL
// ==========================================
function closeSuccessModal() {

    successModal.style.display = 'none';
}

// ==========================================
// OPEN CART
// ==========================================
openCartBtn.addEventListener('click', () => {

    cartModal.style.display = 'block';

    updateCart();
});

// ==========================================
// CLOSE CART
// ==========================================
closeCartBtn.addEventListener('click', () => {

    cartModal.style.display = 'none';
});

// ==========================================
// CLOSE WHEN CLICK OUTSIDE
// ==========================================
window.addEventListener('click', event => {

    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }

    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
});

// ==========================================
// SIMPLE TOAST NOTIFICATION
// ==========================================
function showToast(message) {

    const toast = document.createElement('div');

    toast.innerText = message;

    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.background = '#3B2415';
    toast.style.color = '#fff';
    toast.style.padding = '14px 22px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    toast.style.opacity = '0';
    toast.style.transition = '0.3s ease';

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(-5px)';
    }, 100);

    setTimeout(() => {

        toast.style.opacity = '0';

        toast.style.transform = 'translateY(10px)';

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2200);
}