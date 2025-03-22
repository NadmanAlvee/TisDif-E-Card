document.addEventListener("DOMContentLoaded", () => {
	// Slide in
	const slideInCards = document.querySelectorAll(".slide-in");

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
