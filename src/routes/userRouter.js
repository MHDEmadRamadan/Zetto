const express = require("express");
const router = express.Router();
const {
  test,
  getUsers,
  register,
  login,
} = require("./../controllers/userController");

router.get("/test", test);
router.get("/getusers", getUsers);
router.post("/register", register);
// router.post("/login", login);

module.exports = router;
