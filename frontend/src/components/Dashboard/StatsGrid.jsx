// components/Dashboard/StatsGrid.jsx
const StatsGrid = ({ tasks }) => {
  return (
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
  )
}

export default StatsGrid