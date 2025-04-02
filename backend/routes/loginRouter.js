// external imports
const express = require("express");

// external imports
const { getLogin, login } = require("../controller/loginController");
const {
	doRegisterValidationHandler,
	doRegisterValidators,
} = require("../middlewares/register/registerValidators");
const { register } = require("../controller/regController");

// configs
const router = express.Router();

// login page
router.get("/", getLogin);

// process login
router.post("/", login);

// register new user
router.post(
	"/register",
	doRegisterValidators,
	doRegisterValidationHandler,
	register
);

module.exports = router;
