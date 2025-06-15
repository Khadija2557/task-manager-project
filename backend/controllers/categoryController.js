const Category = require("../models/Category")
const Task = require("../models/Task")

// @desc    Get all categories for user
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user._id }).sort({ createdAt: -1 })

    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error getting categories" })
  }
}

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Get category error:", error)
    res.status(500).json({ message: "Server error getting category" })
  }
}

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, color, description } = req.body

    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({
      name,
      owner: req.user._id,
    })

    if (existingCategory) {
      return res.status(400).json({
        message: "Category with this name already exists",
      })
    }

    const category = await Category.create({
      name,
      color,
      description: description || "",
      owner: req.user._id,
    })

    res.status(201).json({
      success: true,
      data: category,
      message: "Category created successfully",
    })
  } catch (error) {
    console.error("Create category error:", error)
    res.status(500).json({ message: "Server error creating category" })
  }
}

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, color, description } = req.body

    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name,
        owner: req.user._id,
        _id: { $ne: req.params.id },
      })

      if (existingCategory) {
        return res.status(400).json({
          message: "Category with this name already exists",
        })
      }
    }

    const oldName = category.name

    // Update category
    category.name = name || category.name
    category.color = color || category.color
    category.description = description !== undefined ? description : category.description

    const updatedCategory = await category.save()

    // Update all tasks that use this category
    if (name && name !== oldName) {
      await Task.updateMany({ categoryName: oldName, owner: req.user._id }, { categoryName: name })
    }

    res.json({
      success: true,
      data: updatedCategory,
      message: "Category updated successfully",
    })
  } catch (error) {
    console.error("Update category error:", error)
    res.status(500).json({ message: "Server error updating category" })
  }
}

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Update all tasks using this category to "No Category"
    await Task.updateMany(
      { categoryName: category.name, owner: req.user._id },
      {
        category: null,
        categoryName: "No Category",
      },
    )

    await Category.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Delete category error:", error)
    res.status(500).json({ message: "Server error deleting category" })
  }
}

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Private
const getCategoryStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: "$categoryName",
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
          pending: { $sum: { $cond: ["$completed", 0, 1] } },
        },
      },
      {
        $project: {
          categoryName: "$_id",
          total: 1,
          completed: 1,
          pending: 1,
          completionRate: {
            $cond: [{ $eq: ["$total", 0] }, 0, { $multiply: [{ $divide: ["$completed", "$total"] }, 100] }],
          },
        },
      },
      { $sort: { total: -1 } },
    ])

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Get category stats error:", error)
    res.status(500).json({ message: "Server error getting category statistics" })
  }
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
}
