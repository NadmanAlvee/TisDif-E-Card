const express = require("express");
const router = express.Router();
const checkoutDetails = require("../middlewares/utils/checkoutDetails");

// GET /checkout
router.get("/", async (req, res) => {
	const page_title = "TisDif e-Card | Checkout";
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			const checkoutData = await checkoutDetails(req, res);
			if (!checkoutData) return res.redirect("/cart");
			res.render("checkout", {
				...checkoutData,
				delivery_charge: 0,
				page_title,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send("Internal Server Error");
		}
	} else {
		try {
			const checkoutData = await checkoutDetails(
				req,
				res,
				res.locals.loggedInUser._id
			);
			if (!checkoutData) return res.redirect("/cart");
			res.render("checkout", {
				...checkoutData,
				delivery_charge: 0,
				page_title,
			});
		} catch (error) {
			console.log(error);
			res.status(500).send("Internal Server Error");
		}
	}
});

module.exports = router;
