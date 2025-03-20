// Hamburgerr
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

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

// icon changes
const cartIcon = document.getElementById("cartIcon");
const profileIcon = document.getElementById("profileIcon");
const profile = document.getElementById("profile");

cartIcon.addEventListener("mouseover", () => {
	cartIcon.src = "/ui/icons/cart-shopping-solid.svg";
});

cartIcon.addEventListener("mouseout", () => {
	cartIcon.src = "/ui/icons/cart-shopping-light.svg";
});

profileIcon.addEventListener("mouseover", () => {
	profileIcon.src = "/ui/icons/circle-user-solid.svg";
});

profileIcon.addEventListener("mouseout", () => {
	profileIcon.src = "/ui/icons/circle-user-regular.svg";
});

// moible profile icon
function isMobile() {
	return window.innerWidth <= 768; // mobile breakpoint
}

document.addEventListener("DOMContentLoaded", () => {
	const profileLink = document.getElementById("profileLink");

	if (isMobile()) {
		profile.setAttribute("href", "/account"); // On mobile, go to /account
		profileLink.removeAttribute("onmouseover");
		profileLink.removeAttribute("onmouseleave");
	}
});
