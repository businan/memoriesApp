const express = require("express");

const userController = require('../controllers/users.js')

const router = express.Router();

router.post("/signin", userController.signin);
router.post("/signup", userController.signup);

module.exports = router;
