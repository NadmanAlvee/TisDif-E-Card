// external imports
const express = require("express");

// external imports
const { getLogin, login } = require("../controller/loginController");
const {
	doLoginValidators,
	doLoginValidationHandler,
} = require("../middlewares/login/loginValidators");
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
router.post("/", doLoginValidators, doLoginValidationHandler, login);

// register new user
router.post(
	"/register",
	doRegisterValidators,
	doRegisterValidationHandler,
	register
);

module.exports = router;
