// components/Modals/TaskForm.jsx
import { useState } from "react"
import { sendEmailInvite, generateId } from "../../utils/helpers"

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
          <h3>{task?.id ? "Edit Task" : "Create New Task"}</h3>
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
              {isLoading ? (task?.id ? "Saving..." : "Creating...") : task?.id ? "Save Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm