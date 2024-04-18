async function displayProducts(category = '') {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();

        const productDiv = document.querySelector(".product");
        productDiv.innerHTML = ''; // Clear existing products

        data.categories.forEach(categoryItem => {
            if (categoryItem.category_name.toLowerCase() === category.toLowerCase() || category === '') {
                categoryItem.category_products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('productItems');

                    productItem.innerHTML = `
                        <h6>${product.vendor}</h6>
                        <img src="${product.image}" alt="${product.title}">
                        <h6>${product.title}</h6>
                        <p class="price">Price: ${product.price}<br>${product.badge_text ? product.badge_text : 'N/A'}</p>
                        <input type="number" min="1" value="1" id="quantity_${product.id}" style="width: 50px;">
                        <button class="btn btn-dark add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    `;

                    productDiv.appendChild(productItem);
                });
            }
        });
    } catch (error) {
        console.error('Error fetching or processing products:', error);
    }
}

function filterProducts(category) {
    displayProducts(category);
}

document.addEventListener('DOMContentLoaded', function () {
    displayProducts(); // Display all products initially

    // Event listener for category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Event listener for search button
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function () {
        const categoryInput = document.getElementById('categoryInput');
        const category = categoryInput.value.trim();
        filterProducts(category);
    });

    // Event listener for "Add to Cart" buttons
         // Load cart items from localStorage
         let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Update cart UI
updateCartUI(cartItems);

// Event listener for "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
button.addEventListener('click', function () {
const productId = this.getAttribute('data-product-id');
const quantity = parseInt(document.getElementById(`quantity_${productId}`).value);
const price = parseFloat(this.parentElement.querySelector('.price').innerText.split(':')[1].trim());
const totalPrice = price * quantity;

// Add item to cart
const item = { productId, quantity, totalPrice };
cartItems.push(item);

// Save cart items to localStorage
localStorage.setItem('cartItems', JSON.stringify(cartItems));

// Update cart UI
updateCartUI(cartItems);
});
});
});

function updateCartUI(cartItems) {
const cartItemsDiv = document.getElementById('cart-items');
cartItemsDiv.innerHTML = '';

let totalQuantity = 0;
let totalPrice = 0;

cartItems.forEach(item => {
const productItem = document.createElement('div');
productItem.classList.add('cart-item');
productItem.innerHTML = `Product ID: ${item.productId}, Quantity: ${item.quantity}, Total Price: $${item.totalPrice.toFixed(2)}`;
cartItemsDiv.appendChild(productItem);

totalQuantity += item.quantity;
totalPrice += item.totalPrice;
});

const cartInfo = document.getElementById('cart-info');
cartInfo.textContent = `Total Quantity: ${totalQuantity}, Total Price: $${totalPrice.toFixed(2)}`;
}
