const express = require("express")
const router = express.Router()
const { searchUsers, getUserByEmail } = require("../controllers/userController")
const { protect } = require("../middleware/auth")

// All routes are protected
router.use(protect)

// Search users
router.get("/search", searchUsers)

// Get user by email
router.get("/by-email/:email", getUserByEmail)

module.exports = router
