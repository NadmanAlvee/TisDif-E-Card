document.addEventListener("DOMContentLoaded", function () {
	// Retrieve product price from the data attribute
	const productElement = document.querySelector(".product-info");
	const productPrice =
		parseFloat(productElement.getAttribute("data-price")) || 1;
	const totalPrice = document.getElementById("total-price");

	// Check if gift card price buttons exist and set up their event listeners
	const priceButtons = document.querySelectorAll(".price-btn");
	if (priceButtons.length) {
		priceButtons.forEach((button) => {
			button.addEventListener("click", function () {
				// Remove active class from all buttons
				priceButtons.forEach((btn) => btn.classList.remove("active"));
				// Add active class to the clicked button
				this.classList.add("active");
				// Calculate and display total price based on selected amount
				const selectedPrice = parseFloat(this.getAttribute("data-price")) || 0;
				totalPrice.textContent = (selectedPrice * productPrice).toFixed(2);
			});
		});
	}

	// Check if accessories quantity buttons exist and set up their event listeners
	const decreaseBtn = document.querySelector(".qty-btn.decrease");
	const increaseBtn = document.querySelector(".qty-btn.increase");
	const quantityValue = document.querySelector(".quantity-value");
	if (decreaseBtn && increaseBtn && quantityValue) {
		let quantity = parseInt(quantityValue.textContent);

		// Function to update total price based on quantity
		function updateTotal() {
			totalPrice.textContent = (quantity * productPrice).toFixed(2);
		}
		updateTotal();

		decreaseBtn.addEventListener("click", function () {
			if (quantity > 1) {
				// prevent quantity going below 1
				quantity--;
				quantityValue.textContent = quantity;
				updateTotal();
			}
		});

		increaseBtn.addEventListener("click", function () {
			quantity++;
			quantityValue.textContent = quantity;
			updateTotal();
		});
	}
});

function updateMainImage(thumbnail) {
	document.getElementById("main-image").src = thumbnail.src;
}
