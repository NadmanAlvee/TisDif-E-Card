// external imports
const express = require("express");

// external imports
const sessionInfo = require("../middlewares/common/sessionInfo");
const { getLogin, login, logout } = require("../controller/loginController");
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
router.post(
	"/",
	sessionInfo,
	doLoginValidators,
	doLoginValidationHandler,
	login
);

// register new user
router.post(
	"/register",
	sessionInfo,
	doRegisterValidators,
	doRegisterValidationHandler,
	register
);

// logout url
router.delete("/", logout);

module.exports = router;
