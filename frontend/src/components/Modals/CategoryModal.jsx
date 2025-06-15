// components/Modals/CategoryModal.jsx
import { useState } from "react"
import { generateId } from "../../utils/helpers"

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

export default CategoryModal