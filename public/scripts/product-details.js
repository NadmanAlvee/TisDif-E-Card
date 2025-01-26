const mainImage = document.getElementById('main-image');
const imageThumbnails = document.getElementById('image-thumbnails');
const productName = document.getElementById('product-name');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const relatedProductsContainer = document.getElementById('related-products-container');

// Extract product ID from URL (e.g., ?id=12345)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id'); // `id` corresponds to the MongoDB `_id` field.

async function fetchProductDetails() {
    try {
        const response = await fetch(`/api/products/${productId}`); // Use the `_id` from the database.
        const product = await response.json();

        // Update the UI with fetched product details
        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productPrice.textContent = `Price: ৳${product.price}`;
        productStock.textContent = `Stock: ${product.stock}`;
        mainImage.src = product.image[0] || '/images/placeholder.jpg';

        // Generate thumbnails
        imageThumbnails.innerHTML = product.image
            .map(img => `<img src="${img}" class="thumbnail" onclick="changeImage('${img}')">`)
            .join('');

        // Fetch related products based on the category
        fetchRelatedProducts(product.category);
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Change main image on thumbnail click
function changeImage(src) {
    mainImage.src = src;
}

async function fetchRelatedProducts(category) {
    try {
        const response = await fetch(`/api/products/all`); // Fetch all products
        const products = await response.json();

        // Filter related products
        const relatedProducts = products.filter(
            prod => prod.category === category && prod._id !== productId
        );

        // Render related products
        relatedProductsContainer.innerHTML = relatedProducts
            .map(prod => `
                <div class="related-product">
                    <img src="${prod.image[0] || '/images/placeholder.png'}" alt="${prod.name}">
                    <h4>${prod.name}</h4>
                    <span>Price: ৳${prod.price}</span>
                    <a href="/product-details.html?id=${prod._id}">View Details</a>
                </div>
            `)
            .join('');
    } catch (error) {
        console.error('Error fetching related products:', error);
    }
}


// Fetch and render product details on page load
fetchProductDetails();
