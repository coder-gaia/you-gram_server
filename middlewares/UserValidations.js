const { body } = require("express-validator");

const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("The name is required.")
      .isLength({ min: 3 })
      .withMessage("The name must be at least three characters."),
    body("email")
      .isString()
      .withMessage("The email is required!")
      .isEmail()
      .withMessage("Insert a valid email address."),
    body("password")
      .isString()
      .withMessage("The password is required.")
      .isLength({ min: 5 })
      .withMessage("The password must be at least five characters."),
    body("confirmPassword")
      .isString()
      .withMessage("The password confirmation is required.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("The passwords don't match!");
        }
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("The email is required!")
      .isEmail()
      .withMessage("Insert a valid email address."),
    body("password").isString().withMessage("The password is required."),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isLength({ min: 3 })
      .withMessage("The name must be at least three characters."),
    body("password")
      .optional()
      .isLength({ min: 3 })
      .withMessage("The password must be at least five characters."),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
