const { body, validationResult } = require("express-validator")

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// User validation rules
const validateRegister = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
]

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Task validation rules
const validateTask = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Task title is required and must be less than 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("priority")
    .optional()
    .isIn(["Low Priority", "Medium Priority", "High Priority", "Urgent Priority"])
    .withMessage("Invalid priority level"),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().trim().isLength({ max: 20 }).withMessage("Each tag must be less than 20 characters"),
]

// Category validation rules
const validateCategory = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Category name is required and must be less than 30 characters"),
  body("color")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Please enter a valid hex color"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be less than 200 characters"),
]

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateTask,
  validateCategory,
}
