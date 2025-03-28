const image_slides = document.querySelectorAll(".image-slide");
const dots = document.querySelectorAll(".dot");

document.addEventListener("DOMContentLoaded", () => {
	// slide show
	let indexList = Array.from(image_slides).map((img) =>
		Number(img.id.slice(-1))
	);
	function callSlides(index) {
		image_slides.forEach((slide, i) => {
			slide.classList.toggle("active-slide", i === index);
			dots[i].classList.toggle("active-dot", i === index);
		});
	}
	let currentSlide = 0;
	callSlides(currentSlide);
	function nextSlide() {
		currentSlide = (currentSlide + 1) % indexList.length;
		callSlides(currentSlide);
	}
	let slideInterval = setInterval(nextSlide, 3500);
	dots.forEach((dot) => {
		dot.addEventListener("click", (event) => {
			let index = Number(event.target.id.slice(-1));
			callSlides(index);
			clearInterval(slideInterval);
			currentSlide = index;
			slideInterval = setInterval(nextSlide, 3500);
		});
	});
});
