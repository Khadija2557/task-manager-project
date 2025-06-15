// components/Dashboard/Dashboard.jsx
import { useState } from "react"
import { exportToCSV } from "../../utils/helpers"
import StatsGrid from "./StatsGrid"
import CategoriesSection from "./CategoriesSection"
import FilterSection from "./FilterSection"
import TasksSection from "./TasksSection"
import TaskForm from "../Modals/TaskForm"
import CategoryModal from "../Modals/CategoryModal"

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
          <div>
            <h2>Dashboard</h2>
            <p>Manage and track your tasks efficiently</p>
          </div>
          <button onClick={() => setShowTaskForm(true)} className="btn-add-task">
            ➕ Add Task
          </button>
        </div>

        <StatsGrid tasks={tasks} />

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

        <CategoriesSection
          categories={categories}
          onAddCategory={() => setShowCategoryModal(true)}
          onDeleteCategory={handleDeleteCategory}
        />

        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />

        <TasksSection
          filteredTasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggle={handleToggleTask}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          draggedTask={draggedTask}
        />
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

export default Dashboard