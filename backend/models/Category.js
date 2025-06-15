const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [30, "Category name cannot be more than 30 characters"],
    },
    color: {
      type: String,
      required: [true, "Category color is required"],
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Please enter a valid hex color"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    taskCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure unique category names per user
categorySchema.index({ name: 1, owner: 1 }, { unique: true })

module.exports = mongoose.model("Category", categorySchema)
