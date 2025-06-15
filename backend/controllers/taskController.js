const Task = require("../models/Task")
const Category = require("../models/Category")

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sort = "createdAt", order = "desc", page = 1, limit = 50 } = req.query

    // Build query
    const query = { owner: req.user._id }

    // Filter by status
    if (status && status !== "All Status") {
      query.completed = status === "Completed"
    }

    // Filter by priority
    if (priority && priority !== "All Priority") {
      query.priority = priority
    }

    // Filter by category
    if (category && category !== "All Categories") {
      if (category === "No Category") {
        query.categoryName = "No Category"
      } else {
        query.categoryName = category
      }
    }

    // Search in title and description
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Sort options
    const sortOptions = {}
    if (sort === "createdAt") {
      sortOptions.createdAt = order === "desc" ? -1 : 1
    } else if (sort === "dueDate") {
      sortOptions.dueDate = order === "desc" ? -1 : 1
    } else if (sort === "priority") {
      const priorityOrder = {
        "Urgent Priority": 4,
        "High Priority": 3,
        "Medium Priority": 2,
        "Low Priority": 1,
      }
      // This is a simplified sort - in production, you might want to use aggregation
      sortOptions.priority = order === "desc" ? -1 : 1
    }

    const tasks = await Task.find(query)
      .populate("category", "name color")
      .populate("sharedWith.user", "name email")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Task.countDocuments(query)

    res.json({
      success: true,
      data: tasks,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ message: "Server error getting tasks" })
  }
}

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })
      .populate("category", "name color")
      .populate("sharedWith.user", "name email")

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({
      success: true,
      data: task,
    })
  } catch (error) {
    console.error("Get task error:", error)
    res.status(500).json({ message: "Server error getting task" })
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, category, categoryName, dueDate, tags, sharedEmails, enableReminder } =
      req.body

    // Process shared emails
    let sharedWith = []
    if (sharedEmails && sharedEmails.length > 0) {
      sharedWith = sharedEmails.map((email) => ({
        email,
        permission: "view",
      }))
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || "Medium Priority",
      category: category || null,
      categoryName: categoryName || "No Category",
      dueDate: dueDate || null,
      tags: tags || [],
      sharedWith,
      enableReminder: enableReminder || false,
      owner: req.user._id,
    })

    // Update category task count if category is provided
    if (category) {
      await Category.findByIdAndUpdate(category, {
        $inc: { taskCount: 1 },
      })
    }

    const populatedTask = await Task.findById(task._id)
      .populate("category", "name color")
      .populate("sharedWith.user", "name email")

    res.status(201).json({
      success: true,
      data: populatedTask,
      message: "Task created successfully",
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ message: "Server error creating task" })
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    const {
      title,
      description,
      completed,
      priority,
      category,
      categoryName,
      dueDate,
      tags,
      sharedEmails,
      enableReminder,
    } = req.body

    // Process shared emails
    let sharedWith = task.sharedWith
    if (sharedEmails !== undefined) {
      sharedWith = sharedEmails.map((email) => ({
        email,
        permission: "view",
      }))
    }

    // Update task fields
    task.title = title !== undefined ? title : task.title
    task.description = description !== undefined ? description : task.description
    task.completed = completed !== undefined ? completed : task.completed
    task.priority = priority !== undefined ? priority : task.priority
    task.category = category !== undefined ? category : task.category
    task.categoryName = categoryName !== undefined ? categoryName : task.categoryName
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate
    task.tags = tags !== undefined ? tags : task.tags
    task.sharedWith = sharedWith
    task.enableReminder = enableReminder !== undefined ? enableReminder : task.enableReminder

    const updatedTask = await task.save()

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("category", "name color")
      .populate("sharedWith.user", "name email")

    res.json({
      success: true,
      data: populatedTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({ message: "Server error updating task" })
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    // Update category task count if task has a category
    if (task.category) {
      await Category.findByIdAndUpdate(task.category, {
        $inc: { taskCount: -1 },
      })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ message: "Server error deleting task" })
  }
}

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    task.completed = !task.completed
    const updatedTask = await task.save()

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("category", "name color")
      .populate("sharedWith.user", "name email")

    res.json({
      success: true,
      data: populatedTask,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
    })
  } catch (error) {
    console.error("Toggle task error:", error)
    res.status(500).json({ message: "Server error toggling task" })
  }
}

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id

    const stats = await Task.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
          pending: { $sum: { $cond: ["$completed", 0, 1] } },
          highPriority: {
            $sum: {
              $cond: [
                { $and: ["$completed", { $eq: ["$priority", "High Priority"] }] },
                0,
                { $cond: [{ $eq: ["$priority", "High Priority"] }, 1, 0] },
              ],
            },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [{ $not: "$completed" }, { $lt: ["$dueDate", new Date()] }, { $ne: ["$dueDate", null] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0,
      overdue: 0,
    }

    // Calculate completion rate
    result.completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Get task stats error:", error)
    res.status(500).json({ message: "Server error getting task statistics" })
  }
}

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
  getTaskStats,
}
