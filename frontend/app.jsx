"use client"

import { useState, createContext } from "react"
import "./styles.css"

// Context for global state management
const AppContext = createContext()

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9)

const sendEmailInvite = async (email, taskTitle, senderName) => {
  // Simulate email sending - in real app, this would call your backend API
  console.log(`Sending email invite to ${email} for task "${taskTitle}" from ${senderName}`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return success response
  return {
    success: true,
    message: `Invitation sent to ${email}`,
  }
}

const exportToCSV = (tasks) => {
  const headers = ["Title", "Description", "Category", "Priority", "Due Date", "Status", "Tags", "Shared With"]
  const csvContent = [
    headers.join(","),
    ...tasks.map((task) =>
      [
        `"${task.title}"`,
        `"${task.description}"`,
        task.category,
        task.priority,
        task.dueDate,
        task.completed ? "Completed" : "Pending",
        task.tags.join("; "),
        task.sharedEmails.join("; "),
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "tasks.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}

// Components
const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"

    if (isRegister) {
      if (!fullName) newErrors.fullName = "Full name is required"
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onLogin({
        id: 1,
        name: isRegister ? fullName : "Demo User",
        email,
      })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#gradient1)" />
              <path
                d="M12 20L18 26L28 14"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">TaskFlow</h1>
          <p className="logo-subtitle">Manage your tasks efficiently</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${!isRegister ? "active" : ""}`} onClick={() => setIsRegister(false)}>
            Sign In
          </button>
          <button className={`auth-tab ${isRegister ? "active" : ""}`} onClick={() => setIsRegister(true)}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={errors.fullName ? "error" : ""}
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          )}

          <div className="form-group">
            <label>{isRegister ? "Email Address" : "Email"}</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="password"
                placeholder={isRegister ? "Create a password" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "error" : ""}
              />
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "error" : ""}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="btn-primary">
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button className="link-btn" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Sign in here" : "Sign up here"}
          </button>
        </p>

        {!isRegister && (
          <div className="demo-account">
            <h4>Demo Account</h4>
            <p>Name: Demo User</p>
            <p>Email: john@example.com</p>
            <p>Password: password123</p>
          </div>
        )}
      </div>
    </div>
  )
}

const TaskForm = ({ task, onSave, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    category: task?.category || "No Category",
    priority: task?.priority || "Medium Priority",
    dueDate: task?.dueDate || "",
    tags: task?.tags || [],
    sharedEmails: task?.sharedEmails || [],
    enableReminder: task?.enableReminder || false,
  })

  const [tagInput, setTagInput] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const categories = ["No Category", "Work", "Personal", "Shopping", "Health", "Education", "Travel"]
  const priorities = ["Low Priority", "Medium Priority", "High Priority", "Urgent Priority"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send email invites for new shared emails
      const newEmails = formData.sharedEmails.filter((email) => !task?.sharedEmails?.includes(email))

      for (const email of newEmails) {
        await sendEmailInvite(email, formData.title, currentUser.name)
      }

      onSave({
        ...task,
        ...formData,
        id: task?.id || generateId(),
        completed: task?.completed || false,
        createdAt: task?.createdAt || new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error saving task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagKeyPress = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        })
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleEmailKeyPress = (e) => {
    if ((e.key === "Enter" || e.key === ",") && emailInput.trim()) {
      e.preventDefault()
      const email = emailInput.trim()
      if (/\S+@\S+\.\S+/.test(email) && !formData.sharedEmails.includes(email)) {
        setFormData({
          ...formData,
          sharedEmails: [...formData.sharedEmails, email],
        })
      }
      setEmailInput("")
    }
  }

  const removeEmail = (emailToRemove) => {
    setFormData({
      ...formData,
      sharedEmails: formData.sharedEmails.filter((email) => email !== emailToRemove),
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create New Task</h3>
          <button onClick={onCancel} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                placeholder="mm/dd/yyyy"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-container">
              {formData.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add tags..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
            />
            <small>Press Enter or comma to add tags</small>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.enableReminder}
                onChange={(e) => setFormData({ ...formData, enableReminder: e.target.checked })}
              />
              Enable Reminder
            </label>
          </div>

          <div className="form-group">
            <label>Share with Users</label>
            <div className="shared-emails">
              {formData.sharedEmails.map((email) => (
                <span key={email} className="shared-email">
                  {email}
                  <button type="button" onClick={() => removeEmail(email)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="email"
                placeholder="Search users to share with..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleEmailKeyPress}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CategoryModal = ({ onSave, onCancel }) => {
  const [categoryName, setCategoryName] = useState("")
  const [categoryColor, setCategoryColor] = useState("#8b5cf6")

  const predefinedColors = ["#8b5cf6", "#f97316", "#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#10b981"]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (categoryName.trim()) {
      onSave({
        id: generateId(),
        name: categoryName.trim(),
        color: categoryColor,
        createdAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal category-modal">
        <div className="modal-header">
          <h3>Add New Category</h3>
          <button onClick={onCancel} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Enter category name..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category Color</label>
            <div className="color-picker">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${categoryColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCategoryColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const TaskCard = ({ task, onEdit, onDelete, onToggle, onDragStart, onDragOver, onDrop, draggedTask }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent Priority":
        return "#ef4444"
      case "High Priority":
        return "#f97316"
      case "Medium Priority":
        return "#eab308"
      case "Low Priority":
        return "#22c55e"
      default:
        return "#6b7280"
    }
  }

  const handleDragStart = (e) => {
    onDragStart(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onDrop(task)
  }

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} ${draggedTask?.id === task.id ? "dragging" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="task-drag-handle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="12" r="1" fill="currentColor" />
          <circle cx="9" cy="5" r="1" fill="currentColor" />
          <circle cx="9" cy="19" r="1" fill="currentColor" />
          <circle cx="15" cy="12" r="1" fill="currentColor" />
          <circle cx="15" cy="5" r="1" fill="currentColor" />
          <circle cx="15" cy="19" r="1" fill="currentColor" />
        </svg>
      </div>

      <div className="task-checkbox-wrapper">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="task-checkbox" />
      </div>

      <div className="task-content">
        <h4 className={task.completed ? "completed-text" : ""}>{task.title}</h4>
        {task.description && <p className="task-description">{task.description}</p>}

        <div className="task-meta">
          {task.dueDate && <span className="task-date">📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
          <span className="task-priority" style={{ color: getPriorityColor(task.priority) }}>
            {task.priority.replace(" Priority", "")}
          </span>
          {task.dueDate && <span className="task-time">🕐 {new Date(task.dueDate).toLocaleDateString()}</span>}
        </div>

        {task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag) => (
              <span key={tag} className="task-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {task.sharedEmails.length > 0 && (
          <div className="task-shared">👥 Shared with: {task.sharedEmails.join(", ")}</div>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="btn-icon edit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button onClick={() => onDelete(task.id)} className="btn-icon delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: "1", name: "Work", color: "#8b5cf6" },
    { id: "2", name: "Personal", color: "#f97316" },
    { id: "3", name: "Shopping", color: "#ef4444" },
  ])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [draggedTask, setDraggedTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    status: "All Status",
    priority: "All Priority",
    category: "All Categories",
    sort: "Newest First",
  })

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? taskData : task)))
    } else {
      setTasks([...tasks, taskData])
    }
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleSaveCategory = (categoryData) => {
    setCategories([...categories, categoryData])
    setShowCategoryModal(false)
  }

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId))
      // Update tasks that use this category
      setTasks(
        tasks.map((task) =>
          task.category === categories.find((c) => c.id === categoryId)?.name
            ? { ...task, category: "No Category" }
            : task,
        ),
      )
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleDragStart = (task) => {
    setDraggedTask(task)
  }

  const handleDrop = (targetTask) => {
    if (draggedTask && draggedTask.id !== targetTask.id) {
      const draggedIndex = tasks.findIndex((task) => task.id === draggedTask.id)
      const targetIndex = tasks.findIndex((task) => task.id === targetTask.id)

      const newTasks = [...tasks]
      newTasks.splice(draggedIndex, 1)
      newTasks.splice(targetIndex, 0, draggedTask)

      setTasks(newTasks)
    }
    setDraggedTask(null)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filters.status === "All Status" ||
      (filters.status === "Completed" && task.completed) ||
      (filters.status === "Pending" && !task.completed)

    const matchesPriority = filters.priority === "All Priority" || task.priority === filters.priority

    const matchesCategory = filters.category === "All Categories" || task.category === filters.category

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const completionRate =
    tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="12" fill="url(#gradient1)" />
                <path
                  d="M12 20L18 26L28 14"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1>TaskFlow</h1>
              <p>Manage your tasks efficiently</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button onClick={() => exportToCSV(tasks)} className="btn-export">
            📊 Export CSV
          </button>
          <div className="user-menu">
            <div className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>{user.name}</span>
            <button onClick={onLogout} className="btn-logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-title">
          <h2>Dashboard</h2>
          <p>Manage and track your tasks efficiently</p>
          <button onClick={() => setShowTaskForm(true)} className="btn-add-task">
            ➕ Add Task
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" />
                <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <h3>{tasks.filter((t) => t.completed).length}</h3>
              <p>Completed</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <h3>{tasks.filter((t) => !t.completed).length}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="stat-content">
              <h3>{tasks.filter((t) => t.priority === "High Priority" && !t.completed).length}</h3>
              <p>High Priority</p>
            </div>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="completion-section">
            <div className="completion-text">
              <span>Completion Rate: {completionRate}%</span>
            </div>
            <div className="completion-bar">
              <div className="completion-progress" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        )}

        <div className="categories-section">
          <div className="section-header">
            <h3>📁 Categories</h3>
            <button className="btn-add-category" onClick={() => setShowCategoryModal(true)}>
              ➕ Add Category
            </button>
          </div>
          {categories.length === 0 ? (
            <p>No categories yet. Create your first category!</p>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <div key={category.id} className="category-item">
                  <div className="category-color" style={{ backgroundColor: category.color }}></div>
                  <span className="category-name">{category.name}</span>
                  <button onClick={() => handleDeleteCategory(category.id)} className="btn-icon delete-category">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="filter-section">
          <div className="section-header">
            <h3>🔽 Filter & Sort Tasks</h3>
          </div>

          <div className="filters-container">
            <div className="search-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="filter-select"
            >
              <option>All Priority</option>
              <option>Low Priority</option>
              <option>Medium Priority</option>
              <option>High Priority</option>
              <option>Urgent Priority</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="filter-select"
            >
              <option>All Categories</option>
              <option>Work</option>
              <option>Personal</option>
              <option>Shopping</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="filter-select"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Priority High to Low</option>
              <option>Due Date</option>
            </select>
          </div>
        </div>

        <div className="tasks-section">
          <h3>Your Tasks ({filteredTasks.length})</h3>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="12" fill="url(#gradient2)" />
                  <path
                    d="M12 20L18 26L28 14"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h4>No tasks found</h4>
              <p>Create your first task to get started with your productivity journey.</p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggle={handleToggleTask}
                  onDragStart={handleDragStart}
                  onDragOver={() => {}}
                  onDrop={handleDrop}
                  draggedTask={draggedTask}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
          currentUser={user}
        />
      )}
      {showCategoryModal && <CategoryModal onSave={handleSaveCategory} onCancel={() => setShowCategoryModal(false)} />}
    </div>
  )
}

const App = () => {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ user, handleLogout }}>
      <div className="app">
        {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
      </div>
    </AppContext.Provider>
  )
}

export default App
