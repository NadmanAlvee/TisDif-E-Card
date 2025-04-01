const express = require("express");
const router = express.Router();
const checkoutDetails = require("../middlewares/utils/checkoutDetails");

// GET /checkout
router.get("/", async (req, res) => {
	try {
		if (!res.locals.loggedInUser) return res.redirect("/login");
		const userId = res.locals.loggedInUser._id;

		const checkoutData = await checkoutDetails(userId);

		if (!checkoutData) return res.redirect("/cart");
		console.log(checkoutData);
		res.render("checkout", {
			...checkoutData,
			page_title: "TisDif e-Card | Checkout",
		});
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
