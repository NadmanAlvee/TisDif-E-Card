// Hamburgerr
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");
const searchBtn = document.querySelectorAll(".searchBtn");
const searchBar = document.getElementById("searchBar");
const Header = document.getElementById("Header");

// Search
searchBtn.forEach((e) => {
	e.addEventListener("click", () => {
		searchBar.classList.toggle("active");
		Header.classList.toggle("searchMode");
	});
});
// hamburger
hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navbar.classList.toggle("active");
});
// menu dropdown
function toggleMenu(show) {
	const menu = document.getElementById("menuDropdown");
	if (show) {
		menu.classList.add("active");
	} else {
		menu.classList.remove("active");
	}
}
// Login logout
function getLogin() {
	window.location.href = "/login";
}
async function logout() {
	try {
		const response = await fetch("/logout", { method: "POST" });

		if (response.ok) {
			window.location.reload();
		} else {
			console.error("Logout failed");
		}
	} catch (error) {
		console.error("Error logging out:", error);
	}
}

// scroll_to_contact
const footer = document.getElementById("footer");
const contactBtn = document.getElementById("scroll_to_contact");
contactBtn.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navbar.classList.toggle("active");
	window.scrollTo({
		top: footer.offsetTop,
		behavior: "smooth",
	});
});
