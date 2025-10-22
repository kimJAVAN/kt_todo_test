import React from 'react';
import './TodoItem.css';

const TodoItem = ({ 
  todo, 
  index, 
  onToggle, 
  onDelete, 
  onEdit, 
  onPriorityChange 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#ddd';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return '#3742fa';
      case 'personal': return '#2f3542';
      case 'shopping': return '#ff6348';
      case 'health': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getTagColor = (tag) => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
    ];
    const hash = tag.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div className="todo-main">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(index)}
            className="todo-checkbox"
          />
          <span 
            className="todo-text"
            onClick={() => onToggle(index)}
          >
            {todo.text}
          </span>
        </div>
        
        <div className="todo-meta">
          {todo.priority && (
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(todo.priority) }}
            >
              {todo.priority}
            </span>
          )}
          
          {todo.category && (
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(todo.category) }}
            >
              {todo.category}
            </span>
          )}
          
          {todo.dueDate && (
            <span className="due-date">
              📅 {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
          
          {todo.tags && todo.tags.length > 0 && (
            <div className="todo-tags">
              {todo.tags.map(tag => (
                <span 
                  key={tag}
                  className="todo-tag"
                  style={{ backgroundColor: getTagColor(tag) }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="todo-actions">
        <select
          value={todo.priority || 'none'}
          onChange={(e) => onPriorityChange(index, e.target.value)}
          className="priority-select"
        >
          <option value="none">우선순위</option>
          <option value="low">낮음</option>
          <option value="medium">보통</option>
          <option value="high">높음</option>
        </select>
        
        <button 
          onClick={() => onEdit(index)}
          className="edit-btn"
          title="편집"
        >
          ✏️
        </button>
        
        <button 
          onClick={() => onDelete(index)}
          className="delete-btn"
          title="삭제"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
