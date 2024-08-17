const express = require("express");
const router = express.Router();

//controller
const {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
} = require("../controllers/UserController");

//middleware
const validate = require("../middlewares/HandleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/UserValidations");
const authGuard = require("../middlewares/AuthGuard");
const { imageUpload } = require("../middlewares/ImageUpload");

//routes
//to register a new user
router.post("/register", userCreateValidation(), validate, register);

//to get the user info
router.get("/profile", authGuard, getCurrentUser);

//to login
router.post("/login", loginValidation(), validate, login);

//to update
router.put(
  "/",
  authGuard,
  userUpdateValidation(),
  validate,
  imageUpload.single("profileImage"),
  update
);

router.get("/:id", getUserById);

module.exports = router;
