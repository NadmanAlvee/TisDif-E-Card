document.addEventListener("DOMContentLoaded", function () {
	// Retrieve product price from the data attribute
	const productElement = document.querySelector(".product-info");
	const productPrice =
		parseFloat(productElement.getAttribute("data-price")) || 1;

	const priceButtons = document.querySelectorAll(".price-btn");
	const totalPrice = document.getElementById("total-price");

	priceButtons.forEach((button) => {
		button.addEventListener("click", function () {
			// Remove the active class from all buttons
			priceButtons.forEach((btn) => btn.classList.remove("active"));

			// Add active class to the clicked button
			this.classList.add("active");

			// Get the selected price from the button and multiply by product price
			const selectedPrice = parseFloat(this.getAttribute("data-price")) || 0;
			totalPrice.textContent = (selectedPrice * productPrice).toFixed(2);
		});
	});

	// Slide in
	const slideInCards = document.querySelectorAll(".related-card.slide-in");

	const observerOptions = {
		threshold: 0.3,
	};

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("appear");
				obs.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe each card
	slideInCards.forEach((card) => observer.observe(card));
});

function updateMainImage(thumbnail) {
	document.getElementById("main-image").src = thumbnail.src;
}
