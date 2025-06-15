// components/Dashboard/TasksSection.jsx
import TaskCard from "../Task/TaskCard"

const TasksSection = ({ filteredTasks, onEdit, onDelete, onToggle, onDragStart, onDrop, draggedTask }) => {
  return (
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
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
              onDragStart={onDragStart}
              onDragOver={() => {}}
              onDrop={onDrop}
              draggedTask={draggedTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksSection