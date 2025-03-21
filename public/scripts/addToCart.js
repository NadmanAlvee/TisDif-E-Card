document.addEventListener("DOMContentLoaded", () => {
	// Select buttons
	const addToCartButtons = document.querySelectorAll(".add-to-cart");
	const buyNowButtons = document.querySelectorAll(".buy-now");
	const totalPriceElement = document.getElementById("total-price");
	const priceButtons = document.querySelectorAll(".price-btn");

	let selectedQuantity = null;

	// Set quantity when a price button is clicked
	priceButtons.forEach((button) => {
		button.addEventListener("click", (event) => {
			selectedQuantity = event.target.getAttribute("data-price"); // Set selected quantity
		});
	});
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
