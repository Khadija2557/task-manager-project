const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low Priority", "Medium Priority", "High Priority", "Urgent Priority"],
      default: "Medium Priority",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    categoryName: {
      type: String,
      default: "No Category",
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        email: {
          type: String,
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
    enableReminder: {
      type: Boolean,
      default: false,
    },
    reminderDate: {
      type: Date,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Update completedAt when task is marked as completed
taskSchema.pre("save", function (next) {
  if (this.isModified("completed")) {
    if (this.completed) {
      this.completedAt = new Date()
    } else {
      this.completedAt = undefined
    }
  }
  next()
})

// Index for better query performance
taskSchema.index({ owner: 1, completed: 1 })
taskSchema.index({ owner: 1, dueDate: 1 })
taskSchema.index({ owner: 1, priority: 1 })

module.exports = mongoose.model("Task", taskSchema)
