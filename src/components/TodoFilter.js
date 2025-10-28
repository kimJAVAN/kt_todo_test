import React from 'react';
import './TodoFilter.css';

const TodoFilter = ({ 
  filter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  sortBy,
  onSortChange 
}) => {
  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'active', label: '진행중' },
    { value: 'completed', label: '완료됨' },
    { value: 'high', label: '높은 우선순위' },
    { value: 'overdue', label: '마감일 지남' }
  ];

  const sortOptions = [
    { value: 'created', label: '생성일순' },
    { value: 'priority', label: '우선순위순' },
    { value: 'dueDate', label: '마감일순' },
    { value: 'alphabetical', label: '가나다순' }
  ];

  return (
    <div className="todo-filter">
      <div className="filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="할 일 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>필터:</label>
          <div className="filter-buttons">
            {filterOptions.map(option => (
              <button
                key={option.value}
                className={`filter-btn ${filter === option.value ? 'active' : ''}`}
                onClick={() => onFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>정렬:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;
