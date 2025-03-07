// Hamburgerr
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navbar.classList.toggle("active");
});

// menu dropdown
function toggleMenu() {
	document.getElementById("menuDropdown").classList.toggle("active");
}

async function logout() {
	try {
		const response = await fetch("/logout", { method: "POST" });

		if (response.ok) {
			window.location.reload(); // Reload page after logout
		} else {
			console.error("Logout failed");
		}
	} catch (error) {
		console.error("Error logging out:", error);
	}
}
