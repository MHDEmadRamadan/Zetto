const express = require("express");
const router = express.Router();
const {
  test,
  getUsers,
  register,
  updateUser,
  login,
} = require("./../controllers/userController");

router.get("/test", test);
router.get("/getusers", getUsers);
router.post("/register", register);
router.post("/login", login);
router.patch("/update/:id", updateUser);

module.exports = router;
