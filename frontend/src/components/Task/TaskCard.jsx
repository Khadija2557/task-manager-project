// components/Task/TaskCard.jsx
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

export default TaskCard