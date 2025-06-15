// components/Dashboard/CategoriesSection.jsx
const CategoriesSection = ({ categories, onAddCategory, onDeleteCategory }) => {
  return (
    <div className="categories-section">
      <div className="section-header">
        <h3>📁 Categories</h3>
        <button className="btn-add-category" onClick={onAddCategory}>
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
              <button onClick={() => onDeleteCategory(category.id)} className="btn-icon delete-category">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesSection