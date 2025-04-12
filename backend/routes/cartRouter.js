const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

function generateCartId() {
	const lowerCharSet = "abcdefghijklmnopqrstuvwxyz";
	const upperCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numSet = "0123456789";
	let id = "";
	for (let i = 0; i < 3; i++) {
		id += lowerCharSet[Math.floor(Math.random() * lowerCharSet.length)];
		id += upperCharSet[Math.floor(Math.random() * upperCharSet.length)];
		id += numSet[Math.floor(Math.random() * numSet.length)];
	}
	return id;
}

// GET cart items
router.get("/", async (req, res) => {
	const page_title = "TisDif e-Card | Cart";
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			const cartCookie = req.signedCookies[process.env.CART_NAME];
			const cartItems = cartCookie ? JSON.parse(cartCookie) : [];
			const populatedItems = await Promise.all(
				cartItems.map(async (item) => {
					const product = await Product.findById(item.productId);
					if (!product) return null;
					return {
						productId: product,
						_id: item._id,
						total_price: item.total_price,
						selected_quantity: item.selected_quantity,
					};
				})
			);
			const validItems = populatedItems.filter((item) => item !== null);
			res.render("cart", {
				cartItems: validItems,
				page_title,
			});
		} catch (error) {
			res.status(500).send("Internal Server Error");
		}
	} else {
		try {
			const userId = res.locals.loggedInUser._id;
			const cartItems = await Cart.find({ userId }).populate("productId");
			res.render("cart", {
				cartItems,
				page_title,
			});
		} catch (error) {
			res.status(500).send("Internal Server Error");
		}
	}
});

// Add product to cart
router.post("/add-to-cart", async (req, res) => {
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			const { productId, total_price, selected_quantity } = req.body;
			if (!productId || !total_price || !selected_quantity) {
				return res.status(400).json({ message: "Missing required fields" });
			}
			// Create a new cart item
			const cartItem = {
				_id: generateCartId(),
				productId,
				total_price,
				selected_quantity,
			};

			let existingCart = req.signedCookies[process.env.CART_NAME];
			existingCart = existingCart ? JSON.parse(existingCart) : [];
			existingCart.push(cartItem);
			res.cookie(process.env.CART_NAME, JSON.stringify(existingCart), {
				maxAge: 86400000,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				signed: true,
			});

			res.status(200).json({ message: "Item added to cart", cartItem });
		} catch (error) {
			res.status(500).json({ message: "Internal server error" });
		}
	} else {
		try {
			const userId = res.locals.loggedInUser._id;
			const { productId, total_price, selected_quantity } = req.body;

			if (!productId || !total_price || !selected_quantity) {
				return res.status(400).json({ message: "Missing required fields" });
			}

			// Create a new cart item
			const cartItem = new Cart({
				userId,
				productId,
				total_price,
				selected_quantity,
				orderDate: new Date(),
			});

			// Save cart item
			await cartItem.save();
			res.status(200).json({ message: "Item added to cart", cartItem });
		} catch (error) {
			res.status(500).json({ message: "Internal server error" });
		}
	}
});

// api /cart/:id
router.delete("/:id", async (req, res) => {
	const cartId = req.params.id;
	console.log(cartId);
	if (!res.locals.loggedInUser || !res.locals.loggedInUser._id) {
		try {
			let existingCart = req.signedCookies[process.env.CART_NAME];
			existingCart = existingCart ? JSON.parse(existingCart) : [];
			const updatedCart = existingCart.filter((item) => item._id != cartId);
			console.log(updatedCart);
			res.cookie(process.env.CART_NAME, JSON.stringify(updatedCart), {
				maxAge: 86400000,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				signed: true,
			});
			res.status(200).json({ message: "Item deleted from cart" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	} else {
		try {
			const userId = res.locals.loggedInUser._id;
			const cartItem = await Cart.findOne({ _id: cartId, userId });
			if (!cartItem) {
				res.status(404).json({ message: "Item not found in cart" });
			}
			await Cart.deleteOne({ _id: cartId });
			res.status(200).json({ message: "Item deleted from cart" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
});

module.exports = router;
