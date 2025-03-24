document.addEventListener("DOMContentLoaded", () => {
	// Select buttons and elements
	const addToCartButtons = document.querySelectorAll(".add-to-cart");
	const buyNowButtons = document.querySelectorAll(".buy-now");
	const totalPriceElement = document.getElementById("total-price");
	const priceButtons = document.querySelectorAll(".price-btn");
	const quantityValueElement = document.querySelector(".quantity-value");

	// This variable will hold the selected quantity value regardless of variant
	let selectedQuantity = null;

	// For the gift card variant: set quantity based on the fixed price buttons
	if (priceButtons.length) {
		priceButtons.forEach((button) => {
			button.addEventListener("click", (event) => {
				selectedQuantity = event.target.getAttribute("data-price"); // Selected quantity for gift cards
			});
		});
	}
	// For the accessories variant: use the quantity selector
	else if (quantityValueElement) {
		// Initialize selected quantity from the current displayed value
		selectedQuantity = parseInt(quantityValueElement.textContent, 10);

		// Also update the selectedQuantity when the quantity changes
		const decreaseBtn = document.querySelector(".qty-btn.decrease");
		const increaseBtn = document.querySelector(".qty-btn.increase");

		if (decreaseBtn && increaseBtn) {
			decreaseBtn.addEventListener("click", () => {
				selectedQuantity = parseInt(quantityValueElement.textContent, 10);
			});
			increaseBtn.addEventListener("click", () => {
				selectedQuantity = parseInt(quantityValueElement.textContent, 10);
			});
		}
	}

	// Add event listener for Add to Cart buttons
	addToCartButtons.forEach((button) => {
		button.addEventListener("click", async function addToCart(event) {
			const productId = event.target.getAttribute("data-id");
			const total_price = parseFloat(
				totalPriceElement.textContent.replace("BDT", "").trim()
			);

			if (!selectedQuantity) {
				alert("Please select a quantity first!");
				return;
			}

			try {
				// Send request to backend
				const response = await fetch("/cart/add-to-cart", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						productId,
						total_price,
						selected_quantity: selectedQuantity,
					}),
				});

				const data = await response.json();

				if (response.ok) {
					window.location.reload();
				} else {
					alert("Please log in first!");
					window.location = "/login";
				}
			} catch (error) {
				alert("Please log in first!");
				window.location = "/login";
			}
		});
	});
});
