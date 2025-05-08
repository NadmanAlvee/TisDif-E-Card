document.addEventListener("DOMContentLoaded", function () {
	// Select buttons and elements
	const addToCartButtons = document.querySelectorAll(".add-to-cart");
	const buyNowButtons = document.querySelectorAll(".buy-now");
	const totalPriceElement = document.getElementById("total-price");
	const quantityValueElement = document.getElementById("quantity-value");
	const decreaseBtn = document.querySelector(".qty-btn.decrease");
	const increaseBtn = document.querySelector(".qty-btn.increase");
	const giftCardValueElement = document.getElementById("quantity-value");
	let quantityValue = parseInt(
		giftCardValueElement.textContent ? giftCardValueElement.textContent : 0,
		10
	);
	const productElement = document.querySelector(".product-info");
	const priceButtons = document.querySelectorAll(".price-btn");
	const totalPrice = document.getElementById("total-price");
	const productPrice =
		parseFloat(productElement.getAttribute("data-price")) || 0;

	// quantity selected of a product
	let selectedQuantity = 1;
	// gift card activity script
	if (priceButtons.length) {
		priceButtons.forEach((button) => {
			button.addEventListener("click", function () {
				priceButtons.forEach((btn) => btn.classList.remove("active"));
				this.classList.add("active");
				const selectedPrice = parseFloat(this.getAttribute("data-price")) || 0;
				totalPrice.textContent = (selectedPrice * productPrice).toFixed(2);
				selectedQuantity = selectedPrice;
				console.log("Seelcted Quantity: ", selectedQuantity); // remove later
			});
		});
	}
	// accessories quantity buttons script
	if (decreaseBtn && increaseBtn && selectedQuantity) {
		function updateTotal() {
			totalPrice.textContent = (selectedQuantity * productPrice).toFixed(2);
			console.log("Seelcted Quantity: ", selectedQuantity); // remove later
		}
		updateTotal();

		decreaseBtn.addEventListener("click", function () {
			if (quantityValue > 1) {
				quantityValue--;
				quantityValueElement.textContent = quantityValue;
				selectedQuantity = quantityValue;
				updateTotal();
			}
		});

		increaseBtn.addEventListener("click", function () {
			quantityValue++;
			quantityValueElement.textContent = quantityValue;
			selectedQuantity = quantityValue;
			updateTotal();
		});
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
					alert("Failed to add item in cart!");
				}
			} catch (error) {
				alert("Failed to add item in cart!");
			}
		});
	});
	// Add event listener for Buy Now buttons
	buyNowButtons.forEach((button) => {
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
					window.location = "/checkout";
				} else {
					alert("Failed to add item in cart!");
				}
			} catch (error) {
				alert("Failed to add item in cart!");
			}
		});
	});
});

function updateMainImage(thumbnail) {
	document.getElementById("main-image").src = thumbnail.src;
}
