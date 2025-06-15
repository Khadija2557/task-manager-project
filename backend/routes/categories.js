const express = require("express")
const router = express.Router()
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} = require("../controllers/categoryController")
const { protect } = require("../middleware/auth")
const { validateCategory, validate } = require("../middleware/validation")

// All routes are protected
router.use(protect)

// Category statistics route (must be before /:id routes)
router.get("/stats", getCategoryStats)

// CRUD routes
router.route("/").get(getCategories).post(validateCategory, validate, createCategory)

router.route("/:id").get(getCategory).put(validateCategory, validate, updateCategory).delete(deleteCategory)

module.exports = router
