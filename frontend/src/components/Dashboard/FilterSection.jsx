// components/Dashboard/FilterSection.jsx
const FilterSection = ({ searchTerm, setSearchTerm, filters, setFilters }) => {
  return (
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
  )
}

export default FilterSection