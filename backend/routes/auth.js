const express = require("express")
const router = express.Router()
const { register, login, getProfile, updateProfile } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validateRegister, validateLogin, validate } = require("../middleware/validation")

// Public routes
router.post("/register", validateRegister, validate, register)
router.post("/login", validateLogin, validate, login)

// Private routes
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)

module.exports = router
