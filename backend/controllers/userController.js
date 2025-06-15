const User = require("../models/User")

// @desc    Get all users (for sharing tasks)
// @route   GET /api/users/search
// @access  Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.length < 2) {
      return res.status(400).json({
        message: "Search query must be at least 2 characters",
      })
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        { isActive: true },
        {
          $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }],
        },
      ],
    })
      .select("name email avatar")
      .limit(10)

    res.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error("Search users error:", error)
    res.status(500).json({ message: "Server error searching users" })
  }
}

// @desc    Get user by email (for task sharing)
// @route   GET /api/users/by-email/:email
// @access  Private
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params

    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).select("name email avatar")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get user by email error:", error)
    res.status(500).json({ message: "Server error getting user" })
  }
}

module.exports = {
  searchUsers,
  getUserByEmail,
}
