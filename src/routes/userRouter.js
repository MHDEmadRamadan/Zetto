const express = require("express");
const router = express.Router();
const { register } = require("./../controllers/userController.js");

router.get("/api/user", register);

module.exports = router;
