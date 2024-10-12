const products = [
    { id: 1, name: 'quality ring tee', basePrice: 40, image: '/public/img/cashstore/qualityring_tee_front.png', sizes: ['S', 'M', 'L', 'XL'], colors: ['Natural', 'Ash', 'Black'] },
    { id: 2, name: 'h & i tee', basePrice: 40, image: '/public/img/cashstore/h&i_tee_front.png', sizes: ['S', 'M', 'L', 'XL'], colors: ['Natural', 'Ash', 'Black']},
    { id: 3, name: 'quality ring sweatshirt', basePrice: 65, image: '/public/img/cashstore/qualityring_sweatshirt_front.png', sizes: ['S', 'M', 'L', 'XL'], colors: ['Ash', 'Black']},
    { id: 4, name: 'h & i sweatshirt', basePrice: 65, image: '/public/img/cashstore/h&i_sweatshirt_front.png', sizes: ['S', 'M', 'L', 'XL'], colors: ['Ash', 'Black'] },
    { id: 5, name: 'h & i sticker', basePrice: 7, image: '/public/img/cashstore/h&i_sticker.png'},
    { id: 6, name: 'quality ring pin', basePrice: 5, image: '/public/img/cashstore/qualityring_pin.png'},
];

let cart = [];
const SHIPPING_FEE = 10;
let paypalButtonInitialized = false;

function validateProduct(product) {
            const requiredProps = ['id', 'name', 'basePrice', 'image'];
            for (let prop of requiredProps) {
                if (!(prop in product)) {
                    console.error(`Product is missing required property: ${prop}`);
                    return false;
                }
            }
            if (typeof product.basePrice !== 'number' || isNaN(product.basePrice)) {
                console.error(`Invalid basePrice for product: ${product.name}`);
                return false;
            }
            return true;
        }

        function renderProducts() {
            console.log("Rendering products...");
            const productGrid = document.getElementById('product-grid');
            if (!productGrid) {
                console.error("Product grid element not found!");
                return;
            }
            
            productGrid.innerHTML = products.map(product => {
                if (!validateProduct(product)) {
                    return `<div class="error">Error: Invalid product data</div>`;
                }
                return `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <div class="product-info-1">
                                <h3>${product.name} -- $${product.basePrice.toFixed(2)}</h3>
                            </div>
                            <div class="product-info-2">
                                <select id="size-${product.id}">
                                ${product.sizes ? product.sizes.map(size => `<option value="${size}">${size}</option>`).join('') : ''}
                                </select>
                                <select id="color-${product.id}">
                                ${product.colors ? product.colors.map(color => `<option value="${color}">${color}</option>`).join('') : ''}
                                </select>
                                <input type="number" class="quantity" id="quantity-${product.id}" value="1" min="1">
                                <button class="btn cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            console.log("Products rendered.");
        }

        function addToCart(productId) {
            console.log(`Adding product ${productId} to cart...`);
            const product = products.find(p => p.id === productId);
            const selectedSize = document.getElementById(`size-${productId}`).value;
            const selectedColor = document.getElementById(`color-${productId}`).value;
            const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
        
            if (product && validateProduct(product)) {
                const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize && item.color === selectedColor);
                
                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    cart.push({
                        ...product,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity,
                        cartId: Date.now()
                    });
                }
                renderCart();
            } else {
                console.error(`Invalid product with id ${productId}`);
            }
        }

        function removeFromCart(cartId) {
            console.log(`Removing item ${cartId} from cart...`);
            cart = cart.filter(item => item.cartId !== cartId);
            renderCart();
        }

        function renderCart() {
            console.log("Rendering cart...");
            const cartItems = document.getElementById('cart-items');
            if (!cartItems) {
                console.error("Cart items element not found!");
                return;
            }
            
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-sp">
                    <span>${item.name}, ${item.size || 'N/A'}, ${item.color || 'N/A'}</span><br><br>
                    <span>quantity: ${item.quantity}</span>
                    <span> - $${(item.basePrice * item.quantity).toFixed(2)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.cartId})">X</button>
                    </div>
                </div>
            `).join('');

            const subtotal = cart.reduce((sum, item) => sum + item.basePrice, 0);
            const total = subtotal + SHIPPING_FEE;

            const cartSummary = document.getElementById('cart-summary');
            if (cartSummary) {
                cartSummary.innerHTML = `
                    <div class="summary-line">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-line">
                        <span>Shipping:</span>
                        <span>$${SHIPPING_FEE.toFixed(2)}</span>
                    </div>
                    <div class="summary-line total-line">
                        <span>Total:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <button id="submit-order-btn">Submit Order</button>
                `;
            } else {
                console.error("Cart summary element not found!");
            }
                        
            console.log("Cart rendered.");
            
        }

        document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'submit-order-btn') {
        initPayPalButton();
    }
});
function submitOrder(orderData) {
    fetch('/pages/api/submit-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        console.log("Response received:", response);  // Log the entire response
        return response.text();  // Return text instead of JSON for debugging
    })
    .then(data => {
        console.log("Raw response data:", data);  // Log raw response text
        
        try {
            const jsonData = JSON.parse(data);  // Try parsing manually
            if (jsonData.success) {
                alert('Order submitted successfully!');
            } else {
                alert('Error submitting order: ' + jsonData.message);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);  // Log parse errors
            alert('There was an issue with the server response. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);  // Log any fetch errors
        alert('An error occurred while submitting the order. Please try again.');
    });
}


function initPayPalButton() {
    if (paypalButtonInitialized) return; // Prevent multiple initializations

    const cartTotal = cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0) + SHIPPING_FEE;

    document.getElementById('paypal-button-container').style.display = 'block';

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: cartTotal // Total cost including shipping
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                let payer = details.payer;
                let shipping = details.purchase_units[0].shipping;

                // Prepare the order data
                const orderData = {
                    cart: cart, // Pass the current cart
                    totalAmount: cartTotal,
                    customerName: payer.name.given_name + ' ' + payer.name.surname,
                    customerEmail: payer.email_address,
                    shippingAddress: shipping.address.address_line_1 + ', ' +
                                    shipping.address.admin_area_2 + ', ' + 
                                    shipping.address.country_code,
                    paypalOrderId: data.orderID
                };

                // Submit the order
                submitOrder(orderData);

                alert('Transaction completed by ' + payer.name.given_name);
            });
        },
        onError: function(err) {
            console.error("An error occurred during the transaction", err);
            alert("There was an issue processing the transaction. Please try again.");
        }
    }).render('#paypal-button-container');

    paypalButtonInitialized = true; // Mark as initialized
}

document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'submit-order-btn') {
        initPayPalButton();
    }
});

console.log("Calling renderProducts...");
renderProducts();
console.log("Script finished.");