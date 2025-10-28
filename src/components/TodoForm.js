import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ onAddTodo, editingTodo, onUpdateTodo, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    text: editingTodo?.text || '',
    priority: editingTodo?.priority || 'none',
    category: editingTodo?.category || 'none',
    dueDate: editingTodo?.dueDate || '',
    tags: editingTodo?.tags || []
  });
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) return;

    const todoData = {
      text: formData.text.trim(),
      completed: editingTodo?.completed || false,
      priority: formData.priority === 'none' ? null : formData.priority,
      category: formData.category === 'none' ? null : formData.category,
      dueDate: formData.dueDate || null,
      tags: formData.tags,
      createdAt: editingTodo?.createdAt || new Date().toISOString()
    };

    if (editingTodo) {
      onUpdateTodo(editingTodo.index, todoData);
    } else {
      onAddTodo(todoData);
    }

    // 폼 초기화
    setFormData({
      text: '',
      priority: 'none',
      category: 'none',
      dueDate: '',
      tags: []
    });
    setTagInput('');
  };

  const handleCancel = () => {
    setFormData({
      text: '',
      priority: 'none',
      category: 'none',
      dueDate: '',
      tags: []
    });
    setTagInput('');
    if (onCancelEdit) onCancelEdit();
  };

  // 태그 추가
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 태그 색상 생성
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
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{editingTodo ? '할 일 수정' : '새 할 일 추가'}</h3>
        {editingTodo && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            ✕
          </button>
        )}
      </div>
      
      <div className="form-group">
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="할 일을 입력하세요..."
          className="todo-input"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>우선순위</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="none">우선순위 없음</option>
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="none">카테고리 없음</option>
            <option value="work">업무</option>
            <option value="personal">개인</option>
            <option value="shopping">쇼핑</option>
            <option value="health">건강</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label>마감일</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>태그</label>
        <div className="tag-input-container">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="태그를 입력하고 Enter를 누르세요"
            className="form-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button
            type="button"
            onClick={addTag}
            className="add-tag-btn"
          >
            추가
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="tag-list">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="tag-item"
                style={{ backgroundColor: getTagColor(tag) }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="remove-tag-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {editingTodo ? '수정' : '추가'}
        </button>
        {editingTodo && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
