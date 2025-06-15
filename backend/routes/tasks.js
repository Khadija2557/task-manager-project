const express = require("express")
const router = express.Router()
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskStats,
} = require("../controllers/taskController")
const { protect } = require("../middleware/auth")
const { validateTask, validate } = require("../middleware/validation")

// All routes are protected
router.use(protect)

// Task statistics route (must be before /:id routes)
router.get("/stats", getTaskStats)

// CRUD routes
router.route("/").get(getTasks).post(validateTask, validate, createTask)

router.route("/:id").get(getTask).put(validateTask, validate, updateTask).delete(deleteTask)

// Toggle task completion
router.patch("/:id/toggle", toggleTask)

module.exports = router
